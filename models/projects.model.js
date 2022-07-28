const { Schema } = require("mongoose");
const { mongoose } = require("../services/mongoose.service");
const User = require("./users.model");

const projectSchema = new Schema({
    members: [String],
    description: String,
    owner: String,
    projectName: String,
    startDate: Date,
    endDate: Date
});

projectSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

projectSchema.set('toJSON', {
    virtuals: true
});


projectSchema.findById = function (cb) {
    return this.model('projects').find({ id: this.id }, cb);
};


const project = mongoose.model('projects', projectSchema);

exports.findById = (id) => {
    return project.findById(id)
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


exports.createProject = async (projectData) => {
    const Project = new project(projectData);
    return await Project.save().then((result) => {
        return result
    });

};
exports.list = async (userId) => {

    let projects = await project.find({ owner: userId });
    let memberOf = await project.find({ members: userId });
    const result = projects.concat(memberOf);

    for (const element of result) {
        let owner = await getOwner(element.owner);
        element.owner = owner.firstName + " " + owner.lastName
    }

    return result;
};

function getOwner(id) {
    return User.findById(id);
}

exports.removeById = (projectId) => {
    return new Promise((resolve, reject) => {
        project.deleteOne({ _id: projectId }, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(err)
            }

        })
    })
}

exports.update = (projectId, projectData) => {
    return project.findOneAndUpdate({ _id: projectId }, projectData);
}