const ObjectId = require('mongoose').Types.ObjectId;
const http = require("http");
const url_portal_transp = "http://www.transparencia.gov.br/api-de-dados";
const Comment = require('../models/comment');

exports.index = (req, res) => {
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
                Comment.find({codigo: req.params.codigo}, 'author comment', function(err, results) {
                    if (err) return console.log(err);
                    var output = Object.assign(JSON.parse(data), {comments: results});
                    res.status(200).json(output);
                    console.log('document found');
                });
            }
        });
    });
}

exports.show = (req, res) => {
    Comment.findById(ObjectId(req.params.id), '-__v', function(err, doc) {
        if (err) return console.log(err);
        else if(doc != null) res.status(200).json(doc);
        else{
            console.log('comment not found');
            res.status(404).json('comment not found');
        }
    });
}

exports.create = (req, res) => {
    var newComment = new Comment(Object.assign({codigo: req.params.codigo}, req.body));
    
    //In case of invalid document code, we reject the request
    const invalid = newComment.validateSync();
    if(invalid){
        const validationErrors = [];
        if(invalid.errors.author != undefined) validationErrors.push(invalid.errors.author.message);
        if(invalid.errors.comment != undefined) validationErrors.push(invalid.errors.comment.message);
        
        console.log(validationErrors);
        res.status(400).json({errors: validationErrors});       
    } else{
        newComment.save((err, result) => {
            if (err) return console.log(err);
            console.log('saved comment to database');
        });
    
        res.status(201).json(newComment);
    }
}

exports.update = (req, res) => {
    Comment.findOneAndUpdate({_id: ObjectId(req.params.id)}, req.body, {projection: {'codigo': 1, 'comment': 1, 'author': 1}, new: true, runValidators: true}, (err, result) => {
        if (err){
            const validationErrors = [];
            if(err.errors.author != undefined) validationErrors.push(err.errors.author.message);
            if(err.errors.comment != undefined) validationErrors.push(err.errors.comment.message);
            
            console.log(validationErrors);
            res.status(400).json({errors: validationErrors});
        }
        else if(result != null){
            console.log('updated comment in the database');
            res.status(200).json(result);
        } else{
            console.log('comment not found');
            res.status(404).json({error: 'comment not found'});
        }
    });
}

exports.delete = (req, res) => {
    Comment.findOneAndDelete({_id: ObjectId(req.params.id)}, {projection: {'codigo': 1, 'comment': 1, 'author': 1}}, (err, result) => {
        if (err) return console.log(err);
        else if(result != null){
            console.log('comment deleted from the database');
            res.status(200).json(result);
        } else{
            console.log('comment not found');
            res.status(404).json({error: 'comment not found'});
        }
    });
}