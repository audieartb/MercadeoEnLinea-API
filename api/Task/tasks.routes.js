const multer = require('multer');
const TaskController = require('./tasks.controller');
const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
const config = require('../../common/config/env.config');
const FileMiddleware = require('../../common/middlewares/files.middleware')
const fs = require('fs')
const NORMAL = config.permissionLevels.NORMAL_TASK;
const ADMIN = config.permissionLevels.ADMIN;

exports.routesConfig = function (app) {

    app.post('/tasks',FileMiddleware.upload.array("taskFile"), 
        
        TaskController.create
    );

    app.get('/tasks/byProject/:projectId', [
        //ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        TaskController.findByProject
    ]);

    app.get('/tasks/:taskId', [
        // ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        TaskController.findById
    ]);
    app.get('/tasks/byUser/:userId', [
        // ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        TaskController.findByUser
    ]);

    app.get('/tasks/count/:projectId',TaskController.countPending);
    app.delete('/tasks/:taskId', [
        //ValidationMiddleware.validJWTNeeded,
        //PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        TaskController.delete
    ]);

    app.put('/tasks', FileMiddleware.upload.array('taskFile'),

        //ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(NORMAL),
        TaskController.update
    )

    app.post('/tasks/file',FileMiddleware.download);

    app.put('/tasks/status', TaskController.updateStatus)

    app.put('/tasks/deletefile', TaskController.removeFile)
    
    // app.get('/tasks/file/storage/:filepath', FileMiddleware.getdownload);

}