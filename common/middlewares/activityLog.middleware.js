const jwtSecret = require('../config/env.config').jwt_secret, jwt = require('jsonwebtoken');
const ActivityLog = require('../../models/activitylog.model');

exports.activityLog = () => {
    data = {
        username: req.jwt.name,
        userId: req.jet.userId,
        

    }
    ActivityLog.create()
    next();
}
