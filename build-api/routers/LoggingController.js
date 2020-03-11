"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var logger_1 = require("../logger");
var loggingRouter = express_1.Router();
exports.loggingRouter = loggingRouter;
loggingRouter.post('/api/log', function (req, res) {
    logger_1.logger.log(req.body);
    return res.sendStatus(200);
});
