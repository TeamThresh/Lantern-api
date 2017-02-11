var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var errors = require('./routes/error');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));

// Route Handlers
app.use('/api', routes());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(404);
});

// error handlers
app.use(function(err, req, res, next) {
  errors(err, res, app.get('env'));
});


module.exports = app;
