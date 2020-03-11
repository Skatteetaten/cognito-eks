"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var env = process.env;
var PORT = Number(env.HTTP_PORT || 9090);
exports.PORT = PORT;
var EKS_REGION = env.EKS_REGION;
exports.EKS_REGION = EKS_REGION;
var EKS_NAME = env.EKS_NAME;
exports.EKS_NAME = EKS_NAME;
var COGNITO_CONFIG = {
    REGION: env.REGION,
    IDENTITY_POOL_ID: env.IDENTITY_POOL_ID,
    USER_POOL_WEBCLIENT_ID: env.USER_POOL_WEBCLIENT_ID,
    USER_POOL_ID: env.USER_POOL_ID,
    OAUTH_DOMAIN: env.OAUTH_DOMAIN,
    OAUTH_SCOPE: (_b = (_a = env.OAUTH_SCOPE) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.split(','),
    OAUTH_REDIRECT_SIGN_IN: env.OAUTH_REDIRECT_SIGN_IN,
    OAUTH_REDIRECT_SIGN_OUT: env.OAUTH_REDIRECT_SIGN_OUT,
    OAUTH_RESPONSE_TYPE: env.OAUTH_RESPONSE_TYPE
};
exports.COGNITO_CONFIG = COGNITO_CONFIG;
