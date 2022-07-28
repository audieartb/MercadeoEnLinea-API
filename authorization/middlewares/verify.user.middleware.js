const UserModel = require('../../models/users.model');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const { activityLog } = require('../../common/scripts/activityLog');
const log = {
    message: '',
        action: 'create',
}

exports.isPasswordAndUserMatch = (req, res, next) =>{
    UserModel.findByEmail(req.body.email)
        .then((user)=>{
            if(!user){
                console.log("not found email")
                log.message = "Correo inválido";
                activityLog(log);
                logger.error(`Correo inválido`)
                res.status(400).send();
            }else{
                let passwordFields = user.password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
                if (hash === passwordFields[1]){
                    req.body = {
                        userId: user.id,
                        email: user.email,
                        permissionLevel: user.permissionLevel,
                        provider: 'email',
                        name: user.firstName + ' ' + user.lastName
                    };
                    console.log("valid password")
                    return next();
                }else{
                    console.log("invalid password")
                    log.message = "Contraseña incorrecta";
                    activityLog(log);
                    logger.error(`Contraseña incorrecta`)
                   
                    return res.status(401).send(new Error("credenciales inválidos"));
                }
            }
        }).catch((err)=>{
            console.log("login process error", err)
            logger.error(`Error en proceso de autenticación ${err}`)
            return res.status(500).send(err)
        });
};

