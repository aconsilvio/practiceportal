// dependencies

var mongoose = require('mongoose'); 
var express = require('express');
// var wiki = require('./routes/wikis');
var app = express();

var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cookieParser = require('cookie-parser');

// var mongoURI = process.env.PROD_MONGODB || "mongodb://localhost/test";
// console.log(mongoURI)
// mongoose.connect(mongoURI);

// configuration

app.use(cookieParser());
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// log every request to the console
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));
// parse application/json
app.use(bodyParser.json());           
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());


//routes 

app.get('/', function(req, res){
    res.sendfile('public/views/index.html');
});


// app.get('/api/home', wiki.home);
// app.get('/api/header/:title', wiki.loadPageGET);
// app.post('/api/header/:title', wiki.updateWikiPOST);
// app.post('/api/createNew', wiki.saveNewWikiPOST);
// app.get('*', wiki.catchAnything);


//port set up

var PORT = process.env.PORT || 3000;
    app.listen(PORT, function() {
      console.log("Application running on port: ", PORT);
});