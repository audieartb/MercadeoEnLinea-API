const crypto = require('crypto');
const UserModel = require('../../models/users.model');
const { activityLog } = require('../../common/scripts/activityLog');//bitácora en base de datos
const logger = require('../../utils/logger');//logs para developer

function passwordHash(newPassword) {


    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(newPassword).digest("base64");
    let password = salt + "$" + hash;

    return password;
};

function generatePassword() {
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ$%^&)><?'@0123456789"
    let newPassword = ""

    for (var i = 0; i < 8; i++) {
        newPassword += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return newPassword;
}

exports.insert = async (req, res) => {

    log = {
        message: '',
        action: 'create',
    }

    let user = await UserModel.findByEmail(req.body.email);

    if (user) {
        res.status(400).send({ message: "duplicado" })
    }
    if (!req.body.password) {
        req.body.password = 'clave123'
    }


    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = "normal";

    UserModel.createUser(req.body).then((result) => {
        log.message = `Usuario creado, ${req.body.email}`;
        log.action = 'create'
        activityLog(log);
        res.status(201).send()
    }).catch((error) => {
        log.message = `Error creando usuario ${req.body.email}, ${error.message}`;
        log.action = 'create'
        activityLog(log);
        res.status(500).send(error.message)
    });

}


exports.getById = (req, res) => {

    UserModel.findById(req.params.userId).then((data) => {
        res.status(200).send(data);
    }).catch((error) => {
        logger.error(`Error en GetByID de usuario: ${error}`)
        res.status(500).send(error);
    })
}

exports.list = (req, res) => {

    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    UserModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        }).catch((error) => {
            logger.error(`Error obteniendo lista de usuarios: ${error.message}`)
        })
};

exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId).then((result) => {
        res.status(204).send({});
    })
}

exports.updateUser = (req, res) => {

    log = {
        message: '',
        action: 'update',
    }
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    UserModel.updateUser(req.params.userId, req.body).then((result) => {
        log.message = `Usuario actualizado ${req.body.email}`
        activityLog(log)
        res.status(204).send({});
    }).catch(error => {
        res.status(500).send()
    })
}

exports.passwordReset = async (req, res) => {
    log = {
        message: '',
        action: 'update'
    }
    let newPassword = generatePassword()

    let hashed = passwordHash(newPassword)
    const regexpCheck = /^\w+@\w\.\w/
    console.log(req.params.userId)

    UserModel.passwordreset(req.params.userId, hashed).then(() => {
        res.status(201).send({ password: newPassword })
    }).catch((error) => {
        res.status(500).send(error.message)
    })


}

exports.emailReset = async (req, res) => {
    try {
        let newPassword = generatePassword()

        let hashed = passwordHash(newPassword)


        let user = await UserModel.findByEmail(req.body.email);
        console.log(req.body.email)
        UserModel.passwordreset(user.id, hashed).then((data) => {

            res.status(201).send({ message: newPassword })
        }).catch(error => {
            res.status(500).send(error.message)
        })

    } catch (error) {
        console.log(error)
    }
}