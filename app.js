var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var errors = require('./routes/error');

var credentials = require('./credentials');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));

// set the secret key variable for jwt
app.set('jwt-secret', new Buffer(credentials.jwtsecret).toString('base64'));

// Route Handlers
app.use('/api', routes());

// error handlers
app.use(function(err, req, res, next) {
  errors(err, res, app.get('env'));
});


module.exports = app;
