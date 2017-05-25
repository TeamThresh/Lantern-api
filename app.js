var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compression = require('compression');

var routes = require('./routes/index');
var errors = require('./routes/error');

var credentials = require('./credentials');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// compress all requests 
app.use(compression({ threshold: 0 }));

app.use(logger('dev'));

// set the secret key variable for jwt
app.set('jwt-secret', new Buffer(credentials.jwtsecret).toString('base64'));


// MongoDB module
var mongoose = require('mongoose');

const mongooseOption = {
	replset: { rs_name: credentials.replSet }
};

mongoose.connect(credentials.mongodb.host, mongooseOption, function(err) {
	if (err) throw err;
	console.log("MongoDB connect complete");
});

// Route Handlers
app.use('/api', routes());

// error handlers
app.use(function(err, req, res, next) {
  errors(err, res, app.get('env'));
});


module.exports = app;
