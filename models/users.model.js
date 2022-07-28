const { Schema } = require("mongoose");
const { mongoose } = require("../services/mongoose.service");

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,//news
    password: String,
    permissionLevel: String,
    dateCreated: Date ///new
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

userSchema.findById = function (cb) {
    return this.model('Users').find({ id: this.id }, cb);
};


const User = mongoose.model('Users', userSchema);

exports.findByEmail = (email) => {
    return User.findOne({ email: email }).then(res => {
        console.log(res)
        return res
    }).catch(err => err);
}


exports.findById = (id) => {
    return User.findById(id)
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


exports.createUser = async (userData) => {
    userData.dateCreated = Date.now()
    const user = new User(userData);
    return await user.save(function (err) {
        if (err) {
            return handleError(err);
        }
    });
};


exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteOne({ _id: userId }, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(err)
            }

        })
    })
}

exports.updateUser = async (userId, userData) => {
    return await User.findOneAndUpdate({ _id: userId }, userData).catch(error => error);
}

exports.passwordreset = async (userId, password) => {

    console.log(userId)
    return await User.updateOne({ _id: userId },{$set: { password: password }}).then(data=>{
        console.log("mongo res",data)
    }).catch(error=>{
        console.log(error)
    })
}

exports.userSchema = userSchema;