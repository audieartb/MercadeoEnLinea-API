const {mongoose} = require('./mongoose.service');
const {Schema} = require('mongoose');
const { findById } = require('../models/activitylog.model');

class genericCRUD{
    constructor(collectionName, schema){
        this.collection = mongoose.model(collectionName, schema);
    }


    

    findById(id){
        this.collection.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
    }
}

exports.genericCRUD = new genericCRUD;