const ActivityLog = require('../../models/activitylog.model');

exports.activityLog = (logData) => {
    ActivityLog.create(logData)
}

