const { Schema } = require('mongoose');
const { mongoose } = require('../services/mongoose.service');
const moment = require('moment')
const eventSchema = new Schema({
    userId: Schema.Types.ObjectId,
    sharedId: String,
    title: String,
    description: String,
    allDay: Boolean,
    start: String,
    end: String,
    startTime: String,
    endTime: String,
    startRecur: String,
    endRecur: String,
    daysOfWeek: [Number],
    url: String,
    color: String,
    eventFiles: [],
    recurrentType: Number
});

eventSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

eventSchema.set('toJSON', {
    virtuals: true
});

eventSchema.findById = (cb) => {
    return this.model('Events').find({ id: this.id }, cb);
};

const Event = mongoose.model('Events', eventSchema);

exports.findById = (id) => {
    return Event.findById(id)
        .then((result) => {
            if (result) {
                result = result.toJSON();
                delete result._id;
                delete result._v;
                return result;
            }
            return null;
        });
};

exports.create = (eventData) => {
    const event = new Event(eventData);
    return event.save().then(res => {
        return res
    }).catch(err => {
        console.log("error ->", err)
        throw Error(error)
    })

};

exports.createRecurrent = async (eventArray) => {
    return await Event.insertMany(eventArray, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log("documents added", docs);
        }
    })
};


exports.getList = async (userId) => {
    return await Event.find({ userId: userId });
};


exports.paginatedList = async (limit = 0, skip = 0, userId) => {
    let today = moment().format('YYYY-MM-DD')
    console.log(skip, limit, userId)
    return Event.find({userId: userId, start:{$gte: today}})
    .skip(skip).limit(limit)
}


exports.update = async (data) => {
    let temp = await Event.findById(data.id);
    data.eventFiles.push(...temp.eventFiles);
    return Event.findOneAndUpdate({ _id: data.id }, data).catch((error) => {
    });
}

exports.delete = async (id) => {
    const event = await Event.findById(id);
    return Event.deleteOne({ _id: event.id }).then(() => {
        return event;
    }).catch((err) => {
        return err;
    })

}


exports.deleteRecurrent = async (sharedId) => {

    return Event.deleteMany({ sharedId: sharedId }).then(() => {
        return;
    }).catch((err) => {
        throw new Error(`Error deleting recurrent event: ${err}`)
    })
}

exports.deleteFile = (data) => {
    return Event.updateOne({ _id: data.id }, {
        $pull: {
            eventFiles: {
                filename: data.filename
            }
        }
    }).catch((error) => error)
}


