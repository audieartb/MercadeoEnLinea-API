const crypto = require('crypto');
const TaskModel = require('../../models/tasks.model');
const { activityLog } = require('../../common/scripts/activityLog')//bitácora en base de datos
const logger = require('../../utils/logger');//logs para developer
const fs = require('fs');
const fileMngr = require('../../common/scripts/fileMngr')

exports.create = (req, res) => {
    log = {
        message: "",
        action: "create",
    };
    req.body.files = req.files;

    TaskModel.create(req.body).then(() => {
        log.message = "Creación de tareas exitoso";
        activityLog(log);
        res.status(201).send()
    }).catch((err) => {
        logger.error('No se pudo crear la tarea')
        res.status(500).send(err.message)
    });
}

exports.findByUser = (req, res) => {
    TaskModel.findByUser(req.params.userId).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        logger.error('No se encontró el usuario')
        res.status(500).send(err.message);

    })
}
exports.findById = (req, res) => {
    TaskModel.findById(req.params.taskId).then((data) => {
        res.status(200).send(data);
    }).catch((err) => {
        logger.error('No se encontró el ID')
        res.status(500).send(err.message);
    })
}

exports.findByProject = (req, res) => {

    TaskModel.findByProject(req.params.projectId)
        .then((data) => {
            res.status(200).send(data)
        })
        .catch((err) => {
            logger.error('No se encontró el proyecto')
            res.status(500).send(err.message)
        })
};

exports.countPending = (req, res)=>{
    TaskModel.findByProject(req.params.projectId).then((data)=>{
        console.log("task data",data.length)
        let count = data.filter(task => task.status == 'pending')

        res.status(200).send({count:count.length})
    })
}

exports.delete = (req, res) => {
    log = {
        message: "",
        action: "delete",
    };
    TaskModel.delete(req.params.taskId).then((task) => {
        log.message = " Tarea eliminada";
        activityLog(log);
        fileMngr.deleteMany(task.files)
        res.status(204).send({});

    }).catch((err) => {
        logger.error(`No se pudo eliminar tarea ${err.message}`)
        res.status(500).send('error eliminado tarea')
    })
};

exports.update = (req, res) => {

    req.body.files = req.files;
    TaskModel.update(req.body).then((result) => {

        res.status(204).send(result);
    }).catch((err) => {
        logger.error(`No se pudo actualizar la tarea ${err.message}`)
        res.status(500).send(err.message);
    })
};

exports.getFiles = (req, res) => {

    const path = req.body.path;
    const file = fs.createReadStream(path);
    const filename = (new Date()).toISOString();

    res.status(200)
}

exports.removeFile = (req, res) =>{
    TaskModel.removeFile(req.body).then(()=>{
        fileMngr.deleteOne(req.body.path)
        res.status(200).send()
    }).catch((error)=>{
        res.status(500).send(error.message)
    })
}


exports.updateStatus = (req, res) => {

    TaskModel.updateStatus(req.body).then((response) => {
        res.status(200).send(response);
    }).catch((error) => {
        res.status(500).send(error.message)
    })
}
