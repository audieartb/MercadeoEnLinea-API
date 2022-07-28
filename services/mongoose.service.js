require('dotenv').config();
const mongoose = require('mongoose');
let count = 0;
const mongoPassword = process.env.MONGOPASSWORD
const options = {
    autoIndex: false,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
};


const connectWithRetry = () => {
    console.log('MongoDb connection with retry');
    mongoose.connect(`mongodb+srv://developerdatabaseuser:${mongoPassword}@mee-v1.8aenf.mongodb.net/meedatabase?retryWrites=true&w=majority`, options).then(() => {
        console.log("MongoDB is connected")
    }).catch(err => {
        console.log('MongoDb connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();

exports.mongoose = mongoose;