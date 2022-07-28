const crypto = require("crypto");
const ProjectModel = require("../../models/projects.model");
const { activityLog } = require("../../common/scripts/activityLog"); //bitácora en base de datos
const logger = require("../../utils/logger"); //logs para developer
const TaskModel = require("../../models/tasks.model")
exports.insert = (req, res) => {
  log = {
    message: "",
    action: "create",
  };

  ProjectModel.createProject(req.body)
    .then((result) => {
        log.message = `Se creó el proyecto ${req.body.title}`
        activityLog(log)
      res.status(201).send(result);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

exports.getById = (req, res) => {
  ProjectModel.findById(req.params.projectId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
        logger.error(`Error obteniendo proyecto ${req.params.projectId},${error.message}`)
      res.status(500).send(error);
    });
};

exports.list =  (req, res) => {
  ProjectModel.list(req.params.userId)
    .then((data) => {
   
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

async function  getCount(id){
  let tasks = await  TaskModel.findByProject(id);
  console.log(tasks)
  if(tasks){
    tasks.filter(task => task.status == 'pending')
    return tasks.length
  }
  return null
}

exports.removeById = (req, res) => {
  ProjectModel.removeById(req.params.projectId).then((result) => {
    res.status(204).send({});
  });
};

exports.update = (req, res) => {
  ProjectModel.update(req.params.projectId, req.body).then((result) => {
    res.status(204).send({});
  }).catch((error) => {
      logger.error()
    res.status(500).send(error.message);
  });
};
