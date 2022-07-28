const NotificationController = require('./notifications.controller');
const ValidationMiddleware = require('../../common/middlewares/auth.validation.middleware');



exports.routesConfig = function (app) {
    app.post('/notifications', [
        NotificationController.insert
    ]);

    app.get('/notifications', [
        //ValidationMiddleware.validJWTNeeded,
        NotificationController.list
    ]);

    app.get('/notifications/:notificationsId', [
        //ValidationMiddleware.validJWTNeeded,
        NotificationController.getById
    ]);

    app.delete('/notifications/:notificationsId', [
       // ValidationMiddleware.validJWTNeeded,
        NotificationController.removeById
    ]);

    app.patch('/notifications/:notificationsId', [
       // ValidationMiddleware.validJWTNeeded,
        NotificationController.updateNotifications
    ])
}