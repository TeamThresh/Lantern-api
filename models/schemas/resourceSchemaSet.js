var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regExp = /[\{\}\[\],;|\)*~`!^\+<>@\$%\\\(\'\"]/gi
var CustomValidator = {
	validator: function(str) {
		return !regExp.test(str);
	},
	message: '{VALUE} is not allow special character!'
}

var regExpForStacktrace = /[\[\]?,;|*~`!^+@\%\=]/gi
var StacktraceValidator = {
	validator: function(str) {
		return !regExpForStacktrace.test(str);
	},
	message: '{VALUE} is not allow special character!'
}

module.exports.testSchema = {
	launch_time : { type : Number }, // milliseconds
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
			validate:  CustomValidator },
		uuid : { type: String,
			trim : true,
			validate:  CustomValidator },
		ip : { type: String,
			trim : true,
			validate:  CustomValidator },
        location : {
            code : { type: String,
				trim : true,
				validate:  CustomValidator },
            country_name : { type: String,
				trim : true,
				validate:  CustomValidator },
            city_name : { type: String,
				trim : true,
				validate:  CustomValidator }
        }
	},
	data : [Schema.Types.Mixed]
}
