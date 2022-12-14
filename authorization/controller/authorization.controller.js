const jwtSecret = require('../../common/config/env.config').jwt_secret,
    jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_secret = process.env.JWTSECRET

const crypto = require('crypto');


exports.login = (req, res) =>{
    try {
        let refreshId = req.body.userId + jwtSecret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let b = Buffer.from(hash);
        let refresh_token = b.toString('base64');
        res.status(201).send({accessToken: token, refreshToken: refresh_token}); 
    }catch(err){
        log.message = `No se pudo inicar sesión ${req.body.email}`;
        activityLog(log);
        logger.error(`No se pudo inicar sesión ${err}`)
        res.status(500).send({errors: err})
    }
}