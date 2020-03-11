"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = __importDefault(require("winston"));
var env = process.env;
var LOG_LEVEL = env.LOG_LEVEL || 'info';
var customLevels = {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
    trace: 4
};
var _a = winston_1.default.format, combine = _a.combine, timestamp = _a.timestamp, printf = _a.printf;
var customFormat = printf(function (_a) {
    var timestamp = _a.timestamp, level = _a.level, message = _a.message, rest = __rest(_a, ["timestamp", "level", "message"]);
    return JSON.stringify(__assign({ timestamp: timestamp, level: level.toUpperCase(), message: !!message ? message : '' }, rest), undefined, '  ');
});
exports.logger = winston_1.default.createLogger({
    levels: customLevels,
    format: combine(timestamp(), customFormat),
    transports: [
        new winston_1.default.transports.Console({
            level: LOG_LEVEL
        })
    ]
});
