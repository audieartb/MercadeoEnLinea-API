const EventController = require('./events.controller');
const PermissionMiddleware = require('../../common/middlewares/auth.permission.middleware');
const config = require('../../common/config/env.config');
const NORMAL = config.permissionLevels.NORMAL_USER;
const ADMIN = config.permissionLevels.ADMIN;
const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');
const FileMiddleware = require('../../common/middlewares/files.middleware')

exports.routesConfig = (app) => {
    app.post('/events',FileMiddleware.upload.array("eventFiles") ,ValidationMiddleware.validJWTNeeded, EventController.create);
    app.get('/events/:userId', [ValidationMiddleware.validJWTNeeded,EventController.getList]);
    app.get('/events/details/:eventId', [EventController.getById])
    app.put('/events', FileMiddleware.upload.array("eventFiles"), EventController.update)
    app.delete('/events/:eventId', [EventController.delete])
    app.delete('/events/recurrent/:sharedId',EventController.deleteRecurrent)
    app.put('/events/deletefile',  EventController.deleteFile)
    app.get('/events/list/:userId', EventController.paginatedList)

}
