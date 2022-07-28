const EventModel = require("../../models/events.model");
const { activityLog } = require("../../common/scripts/activityLog"); //bitácora en base de datos
const logger = require("../../utils/logger"); //logs para developer
const fileMngr = require('../../common/scripts/fileMngr');
const { v4: uuidv4 } = require('uuid');

exports.create = (req, res) => {
  log = {
    message: "",
    action: "create",
  };

  req.body.eventFiles = req.files;
  // if(req.body.daysOfWeek != ''){
  //   console.log(req.body)
  //   const days = req.body.daysOfWeek.split(', ').map((item)=>{
  //     return Number(item)
  //   })

  //   req.body.daysOfWeek = days;
  // }


  for (const field in req.body) {
    if (req.body[field] == "null") {
      req.body[field] = null;
    }
  }
  if (req.body.recurrentType == 1) {
    req.body.sharedId = uuidv4();
    let event = req.body;
    let events = [];
    event.start = new Date(event.start)
    event.end = new Date(event.end)

    let i = event.start.getMonth();
    let value = event.start.getMonth() + event.monthlyRepeat;
    let year = event.start.getFullYear();

    while (i != value) {
      if (i == 13) {
        i = 1;
        year++;

      }
      console.log(i, year)
      event.start.setMonth(i);
      event.start.setFullYear(year);
      event.end.setMonth(i);
      event.end.setFullYear(year);
      let edited = JSON.parse(JSON.stringify(event));
      events.push(edited)
      i++;
      console.log("documents on loop", edited)
    }

    EventModel.createRecurrent(events).then(() => {
      res.status(201).send();
    })
    return;
  }

  EventModel.create(req.body)
    .then((data) => {
      log.message = "Creación de evento exitoso";
      activityLog(log);
      res.status(201).send(data);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

exports.getList = (req, res) => {
  let userId = req.params.userId;

  EventModel.getList(userId)
    .then((data) => {
      console.log(data.length)
      res.status(200).send(data);
    })
    .catch((err) => res.status(500).send(err.message));
};

exports.paginatedList = (req, res) =>{

  let skip = parseInt(req.query.skip)
  let limit = parseInt(req.query.limit)
  let userId = req.params.userId
  console.log("controller", limit, skip)
  EventModel.paginatedList(limit, skip, userId).then((data)=>{
    res.status(200).send(data)
  }).catch(error => console.log(error))
  
}

exports.getById = (req, res) => {
  EventModel.findById(req.params.eventId)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
      } else {
        res.status(404).send("event not found");
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
};

exports.delete = (req, res) => {
  log = {
    message: "",
    action: "create",
  };
  EventModel.delete(req.params.eventId)
    .then((event) => {
      log.message = "Evento eliminado";
      activityLog(log);

      fileMngr.deleteMany(event.eventFiles);
      res.status(204).send();
    })
    .catch((error) => res.status(500).send(error.message));
};

exports.deleteRecurrent = (req, res)=>{

  EventModel.deleteRecurrent(req.params.sharedId).then(()=>{
    res.status(204).send()
  }).catch((error)=>{
    res.status(500).send(error.message)
  })
}


exports.deleteFile = (req, res) => {
  EventModel.deleteFile(req.body).then(() => {
    fileMngr.deleteOne(req.body.path);
    res.status(200).send()
  }).catch((error) => {
    res.status(500).send(error.message)
  })
}

exports.update = (req, res) => {
  log = {
    message: "",
    action: "create",
  };

  req.body.eventFiles = req.files;

  req.body = parseEvent(req.body);

  EventModel.update(req.body)
    .then((data) => {
      log.message = "Evento actualizado";
      activityLog(log);
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(500).send(error.message)
    });
};

function parseEvent(event) {
  for (const field in event) {
    if (event[field] == "null") {
      event[field] = null;
    }
  }

  if (event.daysOfWeek) {
    const days = event.daysOfWeek.split(',').map((item) => {
      return Number(item)
    })

    event.daysOfWeek = days;
  }

  return event;
}