const { Schema } = require('mongoose');
const { mongoose } = require('../services/mongoose.service');


const activityLogSchema = new Schema({
    user: String,
    userId: Schema.Types.ObjectId,
    action: String,
    dateCreated: Date,
    message: String
});


activityLogSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

activityLogSchema.set('toJSON', {
    virtauls: true
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

exports.logEntry = (data) => {
    const log = new Log(data);
    return log.save();
}

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        ActivityLog.find()
            .limit(perPage)
            .skip(perPage * page)
            .sort({'dateCreated': -1})
            .exec(function (err, logs) {
                if (err) {
                    reject(err);
                } else {
                    resolve(logs);
                }
            })
    });
};


exports.findById = (id) =>{
    return ActivityLog.findById(id)
    .then((result)=>{
        result = result.toJSON();
        delete result._id;
        delete result.__V;
        return result;
    });
};

exports.create = (activityData) =>{
    const activity = new ActivityLog(activityData);
    return activity.save().catch(err => err);
}

exports.delete = (activityId) =>{
    return new Promise((resolve, reject)=>{
        ActivityLog.deleteOne({_id: activityId}, (err) =>{
            if(err){
                reject(err)
            }else{
                resolve(err)
            }
        })
    })
}