const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const server = require('./index');

module.exports = {
    connect : function(){
        mongoose.connect('mongodb://fabriond:abc123@ds119273.mlab.com:19273/distributed-systems-test', {useNewUrlParser: true});
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
        mongoose.connection.once('open', server.init);
    }
}