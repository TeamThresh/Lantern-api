/**
 * Created by YS on 2017-02-07.
 */
//var users = require('./users');
var users = require('./usersController');
var devstats = require('./deviceController');
var crash = require('./crashController');
var res = require('./resController');

var api = {
	users : users,
	devstats : devstats,
	crash : crash,
	res : res
};

module.exports = api;