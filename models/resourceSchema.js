/**
 * Created by YS on 2017-02-07.
 */

// MongoDB module
var mongoose = require('mongoose');
mongoose.connect(require('../credentials').mongodb.host);

var Schema = mongoose.Schema;

module.exports.resourceParcing = function(obj) {
	return new Promise(function(resolved, rejected) {
		var ResourceSchema = mongoose.model('resourceModels', resourceSchema);
		var resourceModel = new ResourceSchema({
			launch_time : obj.launch_time,
			dump_interval : obj.dump_interval,
			package_name : obj.package_name,
			device_info : obj.device_info,
			data : []
		});

    	var error = resourceModel.validateSync();
    	if (error) {
    		console.error(error);
			return rejected(9400);
    	}

		return resolved(resourceModel);
	});
};
var regExp = /[\{\}\[\]\/?,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
var CustomValidator = {
	validator: function(str) {
		return !regExp.test(str);
	},
	message: '{VALUE} is not allow special character!'
}

var resourceSchema = new Schema({
	launch_time : { type : Number },	// milie sec
	dump_interval : { type : Number },
	package_name : { 
		type : String,
		trim : true,
		validate:  CustomValidator },
	device_info : {
		os : { type: String,
			trim : true,
			validate:  CustomValidator },
		app : { type: String,
			trim : true,
			validate:  CustomValidator },
		device : { type: String,
			trim : true,
			validate:  CustomValidator },
		brand : { type: String,
			trim : true,
			validate:  CustomValidator }
	},
	data : []
});