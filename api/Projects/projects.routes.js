const ProjectController = require('./projects.controller');
const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
const config = require('../../common/config/env.config');


const NORMAL = config.permissionLevels.NORMAL_PROJECT;
const ADMIN = config.permissionLevels.ADMIN;


exports.routesConfig = function (app) {
    app.post('/projects', [
        ProjectController.insert
    ]);

    app.get('/projects/:userId', [
        //ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        ProjectController.list
    ]);

    app.get('/projects/id/:projectId', [
       // ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        ProjectController.getById
    ]);

    app.delete('/projects/:projectId', [
        //ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ProjectController.removeById
    ]);

    app.put('/projects/:projectId', [
        //ValidationMiddleware.validJWTNeeded,
       // PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        ProjectController.update
    ])
}