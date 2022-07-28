const { Schema } = require("mongoose");
const { mongoose } = require("../services/mongoose.service");

const taskSchema = new Schema({
    title: String,
    description: String,
    status: String,
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    projectId: { type: Schema.Types.ObjectId, ref: 'projects' },
    files: [],

});

taskSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

taskSchema.set('toJSON', {
    virtuals: true
});

taskSchema.findById = function (cb) {
    return this.model('Tasks').find({ id: this.id }, cb);
};


const Task = mongoose.model('Tasks', taskSchema);

exports.findById = (id) => {
    return Task.findById(id)
        .then((result) => {
            if (result) {
                result = result.toJSON();
                delete result._id;
                delete result.__v;
                return result;
            }
            return null;
        });
};

exports.findByProject = async (projectId) => {
    return await Task.find({ projectId: projectId })
};


exports.findByUser = async (userId) => {
    return await Task.find({ userId: userId })
}

exports.create = async (taskData) => {
    const task = new Task(taskData);
    return await task.save(function (err) {
        if (err) {
            return handleError(err);
        }
    });
};

exports.delete = async (taskId) => {
    const task = await Task.findById(taskId);
    return Task.deleteOne({ _id: task.id }).then(() => {
        return task;
    }).catch((err) => {
        return err;
    });

}

exports.update = async (taskData) => {

    let temp = await Task.findById(taskData.id);
    taskData.files.push(...temp.files);
    return Task.findOneAndUpdate({ _id: taskData.id }, taskData);
}

exports.updateStatus = async (data) => {
    return await Task.updateOne({ _id: data.taskId }, { status: data.status })
}

exports.removeFile = async (data) => {
    return await Task.updateOne({ _id: data.id }, { $pull: { files: { filename: data.filename } } }).catch(error => error)
}

exports.taskSchema = taskSchema;