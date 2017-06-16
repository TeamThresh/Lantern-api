var credentials = require('../credentials');

// MongoDB module
var mongoose = require('mongoose');

mongoose.connect(credentials.replHosts, credentials.mongooseOption, function(err) {
	if (err) throw err;
	console.log("MongoDB connect complete");
});

module.exports = mongoose;