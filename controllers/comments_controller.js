const ObjectId = require('mongodb').ObjectID;
const http = require("http");
const url_portal_transp = "http://www.transparencia.gov.br/api-de-dados";

exports.index = (req, res) => {
    var db = require("../database").getDb();
    http.get(url_portal_transp+"/despesas/documentos/"+req.params.codigo, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });
    
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            if(data == ''){
                console.log('document not found');
                res.status(404).json({error: 'document not found'});
            }
            else{
                var cursor = db.collection('comments').find({codigo: req.params.codigo}, {projection: {'comment': 1}});
                cursor.toArray(function(err, results) {
                    if (err) return console.log(err);
                    var output = Object.assign(JSON.parse(data), {comments: results});
                    res.json(output);
                });
            }
        });
    });
}

exports.show = (req, res) => {
    var db = require("../database").getDb();
    db.collection('comments').findOne(ObjectId(req.params.id), function(err, doc) {
        if (err) return console.log(err);
        else if(doc != null) res.json(doc);
        else{
            console.log('comment not found');
            res.status(404).json('comment not found');
        }
    });
}

exports.create = (req, res) => {
    var output = Object.assign({codigo: req.params.codigo}, {comment: req.body})
    
    //In case of invalid document code, we reject the request
    if(output.codigo == undefined){
        console.log('incorrect params');
        res.status(400).json({error: 'incorrect params'});
    }
    
    var db = require("../database").getDb();
    db.collection('comments').insertOne(output, (err, result) => {
        if (err) return console.log(err);
        console.log('saved comment to database');
    });

    res.json(output);
}

exports.update = (req, res) => {
    var db = require("../database").getDb();
    db.collection('comments').findOneAndUpdate({_id: ObjectId(req.params.id)}, {$set: {comment: req.body}}, {returnOriginal: false}, (err, result) => {
        if (err) return console.log(err);
        console.log('updated comment in the database');
        res.json(result.value);

    });
}

exports.delete = (req, res) => {
    var db = require("../database").getDb();
    db.collection('comments').findOneAndDelete({_id: ObjectId(req.params.id)}, (err, result) => {
        if (err) return console.log(err);
        else if(result.value != null){
            console.log('comment deleted comment from the database');
            res.json(result.value);
        } else{
            console.log('comment not found');
            res.status(404).json({error: 'comment not found'});
        }
    });
}