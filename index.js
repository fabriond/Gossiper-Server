//CODENAME: Gossiper
//URL TO GET TEST CASES: http://www.transparencia.gov.br/api-de-dados/despesas/documentos?unidadeGestora=110096&dataEmissao=12%2F06%2F2018&fase=3&pagina=1
//to get test cases from the above url simply copy the content from "documento"
const express = require("express");
const database = require("./database");
const commentsController = require("./controllers/comments_controller");

const app = express();
const commentsPath = "/:codigo/comments"
const routesPath = "/routes";
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8080', 'https://gossiper-frontend.herokuapp.com'];
    const origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

exports.init = function(){
    app.listen(port, () => {
        console.log("running on port: "+port);
    });
}

database.connect();

app.get(routesPath, (req, res) => {
    var output = [];
    app._router.stack.forEach(element => {
        if(element.route != undefined){
            var method = element.route.stack[0].method;
            var path = element.route.path;
            if(path != routesPath) output.push({method: method, path: path});
        }
    });
    res.json({"Please access a valid url": output});
});

//index for comments of a document
app.get(commentsPath, commentsController.index);

//view a comment
app.get(commentsPath+"/:id", commentsController.show);

//create a comment
app.post(commentsPath, commentsController.create);

//update a comment
app.put(commentsPath+"/:id", commentsController.update);

//delete a comment
app.delete(commentsPath+"/:id", commentsController.delete);