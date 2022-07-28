const ActivityLogController = require('./activityLogs.controller');

exports.routesConfig = (app) =>{
    app.get('/activitylog', ActivityLogController.list);
}