"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var signature_v4_node_1 = require("@aws-sdk/signature-v4-node");
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var url_1 = require("url");
var child_process_1 = require("child_process");
var config_1 = require("../config");
var eksRouter = express_1.Router();
exports.eksRouter = eksRouter;
eksRouter.post('/api/eks', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, eks, sts, sign, request, now, signedReq, params, stsUrl, u, token, cmd;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                console.log(req.body);
                eks = new aws_sdk_1.default.EKS({ credentials: body, region: config_1.EKS_REGION });
                sts = new aws_sdk_1.default.STS({ credentials: body, region: config_1.REGION });
                sign = new signature_v4_node_1.SignatureV4({
                    service: 'sts',
                    region: 'us-east-1',
                    credentials: {
                        accessKeyId: body.accessKeyId,
                        secretAccessKey: body.secretAccessKey,
                        sessionToken: body.sessionToken
                    }
                });
                request = {
                    headers: {
                        'x-k8s-aws-id': (config_1.EKS_NAME !== null && config_1.EKS_NAME !== void 0 ? config_1.EKS_NAME : '')
                    },
                    method: 'GET',
                    protocol: 'https',
                    hostname: 'sts.amazonaws.com',
                    query: {
                        Action: 'GetCallerIdentity',
                        Version: '2011-06-15'
                    },
                    path: '/'
                };
                now = new Date();
                now.setSeconds(now.getSeconds() + 50);
                return [4 /*yield*/, sign.presignRequest(request, now)];
            case 1:
                signedReq = _a.sent();
                params = new url_1.URLSearchParams(signedReq.query);
                stsUrl = "https://sts.amazonaws.com/?" + params.toString();
                u = new URL(stsUrl);
                console.log(u.href);
                token = 'k8s-aws-v1.' +
                    Buffer.from(u.href)
                        .toString('base64')
                        .replace('/', '_');
                cmd = "kubectl get namespaces --token=" + token;
                console.log(cmd);
                try {
                    console.log(child_process_1.execSync(cmd).toString());
                }
                catch (e) { }
                sts.getCallerIdentity(function (err, data) {
                    console.log(data);
                });
                eks.listClusters(function (err, data) {
                    if (err) {
                        res.status(500).send(err.message);
                    }
                    else {
                        res.send(data.clusters);
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
