const jwt = require('jsonwebtoken'), secret = require('../../common/config/env.config').jwt_secret, crypto = require('crypto');

exports.validJWTNeeded = (req, res, next) => {
    if(req.headers['authorization']){
        try{
            let authorization = req.headers['authorization'].split(' ');
            if(authorization[0] !== 'Bearer'){
                return res.status(401).send('missing token');
            }else{
                req.jwt = jwt.verify(authorization[1], secret);
                
                return next();
            }
        }catch(err){
            return res.status(500).send();
        }

    }else{
        return res.status(401).send('missing authorization header');
    }
};


