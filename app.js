var express = require('express');
var http = require('http');
var Promise=require('bluebird');
var mongoose = (require('mongoose'));
mongoose.Promise=Promise;
var bodyParser=require('body-parser');
var routes = require('./config/routes');
var consolidate = require('consolidate');
var session=require('express-session');
var passport= require('passport');
var flash=require('connect-flash');


var environment=process.env.NODE_ENV||'development';
var config = require('./config/config.js')[environment];

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function(err){
	console.log("Error occured while connecting to DB : "+err);
	process.exit(-1);
});

db.once('open', function(){
	console.log("DB connection has been established ");
});

var app = express();

// check qs vs querystring
// express static use ?
app.use(express.static(__dirname +'/api/views/images'));
app.set('port',config.port||3000);
app.engine('html',consolidate.handlebars);
app.set('views',__dirname+'/api/views');
app.set('view engine','html');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
	secret:'dark side of force',
	resave:false,
	saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(err, req, res, next){
	conaole.log('in error blocak');
  res.status(err.status || 500);
    res.render('500', { error: err });
});

require('./config/authenticate.js')(passport,config);
routes(app,passport);



http.createServer(app).listen(app.get('port'),function(){
	console.log("Application has started , listening to port :"+app.get('port'));
});



