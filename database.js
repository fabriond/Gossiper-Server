const MongoClient = require('mongodb').MongoClient;
var db;

module.exports = {
    connect : function(callback){
        MongoClient.connect('mongodb://fabriond:abc123@ds119273.mlab.com:19273/distributed-systems-test', {useNewUrlParser: true}, (err, client) => {
            db = client.db('distributed-systems-test');
            return callback(err);
        });
    },

    getDb : function(){
        return db;
    }
}