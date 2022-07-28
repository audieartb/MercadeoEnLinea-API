const VerifyUserMiddleware = require('./middlewares/verify.user.middleware');
const AuthorizationController = require('./controller/authorization.controller');
const AuthValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const moment = require('moment')
var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore();

var failCallback = function (req, res, next, nextValidRequestDate) {
    res.status(429).res.send('error Has hecho muchas solicitudes en un corto periodo de tiempo, intenta de nuevo ' + moment(nextValidRequestDate).fromNow());
}

var UserBruteforce = new ExpressBrute(store, {
    freeRetries: 5,
    minWait: 30 * 1000,
    maxWait: 5 * 60 * 1000,

});

var globalBruteforce = new ExpressBrute(store, {
    freeRetries: 1000,
    minWait: 6 * 60 * 60 * 1000,
    maxWait: 6 * 60 * 60 * 1000,
})


exports.routesConfig = function (app) {
    app.post('/auth', [
        UserBruteforce.getMiddleware({
            key: function (req, res, next) {
                next(req.body.email)
            }
        }),
        VerifyUserMiddleware.isPasswordAndUserMatch,

        AuthorizationController.login
    ]);
}
