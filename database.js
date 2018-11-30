const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const server = require('./index');
const dbURL = 'mongodb://'+process.env.MONGODB_LOGIN+':'+process.env.MONGODB_PASSWORD+'@ds119273.mlab.com:19273/distributed-systems-test';

module.exports = {
    connect : function(){
        mongoose.connect(dbURL, {useNewUrlParser: true});
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
        mongoose.connection.once('open', server.init);
    }
}