const { Schema } = require("mongoose");
const { mongoose } = require("../services/mongoose.service");

const notificationSchema = new Schema({
  title: String,
  message: String,
  status: Boolean,
  dateCreated: Date,
  projectId: String,
});

notificationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

notificationSchema.set("toJSON", {
  virtuals: true,
});

const Notifications = mongoose.model("Notifications", notificationSchema);

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Notifications.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (err, logs) {
        if (err) {
          reject(err);
        } else {
          resolve(logs);
        }
      });
  });
};

exports.findById = (id) => {
  return Notifications.findById(id).then((result) => {
    result = result.toJSON();
    delete result._id;
    delete result.__V;
    return result;
  });
};

exports.createNotifications = async (userData) => {
  const notification = new Notifications(userData);
  return await notification.save(function (err) {
    if (err) {
      return handleError(err);
    }
  });
};

exports.removeById = (Id) => {
  return new Promise((resolve, reject) => {
    Notifications.deleteOne({ _id: Id }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
exports.updateNotifications = (NotificationsId, NotificationsData) => {
  return Notifications.findOneAndUpdate(
    { _id: NotificationsId },
    NotificationsData
  );
};

exports.notificationSchema = notificationSchema;
