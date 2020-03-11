"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var config_1 = require("../config");
var configRouter = express_1.Router();
exports.configRouter = configRouter;
configRouter.get('/api/config', function (req, res) {
    return res.send(config_1.COGNITO_CONFIG);
});
