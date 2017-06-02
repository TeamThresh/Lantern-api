/**
 * Created by YS on 2017-02-07.
 */

var package = require('./packageController');
var link = require('./linkController');
var crash = require('./crashController');
var render = require('./renderController');
var cpu = require('./cpuController');
var memory = require('./memoryController');
var network = require('./networkController');
var stack = require('./stackController');
var detailRes = require('./detailController');
var group = require('./groupController');
var insight = require('./insightController');

var api = {
	package : package,
	link : link,
	crash : crash,
	render : render,
	cpu : cpu,
	memory : memory,
	network : network,
	stack : stack,
	detailRes : detailRes,
	group : group,
	insight : insight
};

module.exports = api;