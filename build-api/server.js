"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var logger_1 = require("./logger");
var config_1 = require("./config");
var ConfigRouter_1 = require("./routers/ConfigRouter");
var LoggingRouter_1 = require("./routers/LoggingRouter");
var EksRouter_1 = require("./routers/EksRouter");
var app = express_1.default();
app.use(express_1.default.json());
app.use(ConfigRouter_1.configRouter);
app.use(LoggingRouter_1.loggingRouter);
app.use(EksRouter_1.eksRouter);
app.listen(config_1.PORT, function () {
    logger_1.logger.info("application server started on port " + config_1.PORT);
});
