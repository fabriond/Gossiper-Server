//CODENAME: Gossiper
//URL TO GET TEST CASES: http://www.transparencia.gov.br/api-de-dados/despesas/documentos?unidadeGestora=110096&dataEmissao=12%2F06%2F2018&fase=3&pagina=1
//to get test cases from the above url simply copy the content from "documento"
const express = require("express");
const http = require("http");
const app = express();
const router = express.Router()
const url_portal_transp = "http://www.transparencia.gov.br/api-de-dados";
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

const port = 3000
var db;

MongoClient.connect('mongodb://fabriond:abc123@ds119273.mlab.com:19273/distributed-systems-test', {useNewUrlParser: true}, (err, client) => {
    if(err) return console.log(err);
    db = client.db('distributed-systems-test');
    app.listen(port, () => {
        console.log("running on port: "+port);
    });
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json(["This is just a test response, everything is fine, don't worry"]);
});

//index for comments of an expense's data
app.get("/test", (req, res) => {
    http.get(url_portal_transp+"/despesas/documentos/"+req.query.codigo, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });
      
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var cursor = db.collection('comments').find({codigo: req.query.codigo}, {projection: {'comment': 1}});
            cursor.toArray(function(err, results) {
                console.log(results);
                var output = Object.assign(JSON.parse(data), {comments: results});
                res.json(output);
            });
            
        });
    });
});

//view a comment
app.get("/test/:id", (req, res) => {
    db.collection('comments').findOne(ObjectId(req.params.id), function(err, doc) {
        if (err) return console.log(err);
        res.json(doc);
    });
});

//create a comment
app.post("/test", (req, res) => {
    console.log(req.body);
    var output = Object.assign({codigo: req.query.codigo}, {comment: req.body})
    
    //In case of invalid document, we reject the request
    if(output.codigo == undefined){
        res.status(400).json({error: 'incorrect params'})
        return console.log('incorrect params')
    }

    db.collection('comments').insertOne(output, (err, result) => {
        if (err) return console.log(err);
        console.log('saved comment to database');
    });

    res.json(output);
});

//update a comment
app.put("/test/:id", (req, res) => {
    db.collection('comments').findOneAndUpdate({_id: ObjectId(req.params.id)}, {$set: {comment: req.body}}, {returnOriginal: false}, (err, result) => {
        if (err) return console.log(err);
        console.log('updated comment in the database');
        res.json(result.value);

    });
});

//delete a comment
app.delete("/test/:id", (req, res) => {
    db.collection('comments').findOneAndDelete({_id: ObjectId(req.params.id)}, (err, result) => {
        if (err) return console.log(err);
        else if(result.value != null){
            console.log('comment deleted from the database');
            res.json(result.value);
        } else{
            console.log('comment not found');
            res.status(404).json('comment not found');
        }
    });
});