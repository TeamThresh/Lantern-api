/**
 * Created by YS on 2017-02-10.
 */

// MongoDB module
var mongoose = require('mongoose');
mongoose.connect(require('../credentials').mongodb.host);

var Schema = mongoose.Schema;

var resourceSchema = new Schema({
	launch_time : { type : Number },	// milie sec
	dump_interval : { type : Number },
	device_info : {
		os : { type: String },
		app : { type: String },
		device : { type: String },
		brand : { type: String }
	},
	data : [
		{
			type : { type: String },
			// Shallow
			duration_time : {
				start : { type : Number },
				end : { type : Number }
			},
			cpu : {
				user : { type : Number },
				nice : { type : Number },
				system : { type : Number },
				idle : { type : Number },
				iowait : { type : Number },
				irq : { type : Number },
				softirq : { type : Number },
				steal : { type : Number },
				guest : { type : Number },
				guest_nice : { type : Number }
			},
			memory : {
				max : { type : Number },
				total : { type : Number },
				alloc : { type : Number },
				free : { type : Number }
			},
			battery : { type : Number },
			network_usage : {
				name : { type: String }, // or "WIFI" or ""
				rx : { type : Number },
				tx : { type : Number }
			},
			// Deep
			thread_trace : { type: String },
			crash_time : { type : Number },	// milie sec
			stacktrace : { type: String },
			location : { type: String },
			x : { type : Number },
			y : { type : Number },
			request_time : { type : Number },	// milie sec
			host : { type: String },
			response_time : { type : Number },		// milie sec
			activity_stack : [String]
		}
	]
});

module.exports = mongoose.model('resourceModel', resourceSchema);