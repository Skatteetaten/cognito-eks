"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var config_1 = require("../config");
var configRouter = express_1.Router();
exports.configRouter = configRouter;
configRouter.get('/api/config', function (req, res) {
    return res.send({
        REGION: config_1.REGION,
        IDENTITY_POOL_ID: config_1.IDENTITY_POOL_ID,
        USER_POOL_WEBCLIENT_ID: config_1.USER_POOL_WEBCLIENT_ID,
        USER_POOL_ID: config_1.USER_POOL_ID,
        OAUTH_DOMAIN: config_1.OAUTH_DOMAIN,
        OAUTH_SCOPE: config_1.OAUTH_SCOPE,
        OAUTH_REDIRECT_SIGN_IN: config_1.OAUTH_REDIRECT_SIGN_IN,
        OAUTH_REDIRECT_SIGN_OUT: config_1.OAUTH_REDIRECT_SIGN_OUT,
        OAUTH_RESPONSE_TYPE: config_1.OAUTH_RESPONSE_TYPE
    });
});
