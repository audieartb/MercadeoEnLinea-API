const UserController = require('./users.controller');
const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
const config = require('../../common/config/env.config');


const NORMAL = config.permissionLevels.NORMAL_USER;
const ADMIN = config.permissionLevels.ADMIN;


exports.routesConfig = function (app) {
    app.post('/users',
        UserController.insert
    );

    app.get('/users', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        UserController.list
    ]);

    app.get('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        UserController.getById
    ]);

    app.delete('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        UserController.removeById
    ]);

    app.put('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        UserController.updateUser
    ])

    app.put('/users/passwordreset/:userId', UserController.passwordReset);

    app.post('/users/resetpassword', UserController.emailReset)

}