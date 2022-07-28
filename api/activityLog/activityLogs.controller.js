const ActivityLogModel = require('../../models/activitylog.model');

exports.list = (req, res) =>{
    
     ActivityLogModel.list().then((data)=>{
         res.status(200).send(data);
     }).catch((error)=>{
         res.status(500).send(error.message)
     });

}