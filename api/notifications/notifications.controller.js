const NotificationsModel = require("../../models/notifications.model");


exports.insert = (req, res) => {


  NotificationsModel.createNotifications(req.body)
    .then((result) => {
     
      res.status(201).send();
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

exports.getById = (req, res) => {
  NotificationsModel.findById(req.params.notificationsId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  NotificationsModel.list(limit, page).then((result) => {
    res.status(200).send(result);
  });
};

exports.removeById = (req, res) => {
  NotificationsModel.removeById(req.params.notificationsId).then((result) => {
    res.status(204).send({});
  });
};

exports.updateNotifications = (req, res) => {
  NotificationsModel.updateNotifications(req.params.notificationsId, req.body).then(
    (result) => {
      res.status(204).send(result);
    }
  ).catch(error => res.status(500).send(error.message));
};
