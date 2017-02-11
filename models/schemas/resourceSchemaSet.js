var regExp = /[\{\}\[\],;|\)*~`!^\-_+<>@\#$%\\\(\'\"]/gi
var CustomValidator = {
	validator: function(str) {
		return !regExp.test(str);
	},
	message: '{VALUE} is not allow special character!'
}

var regExpForStacktrace = /[\{\}\[\]?,;:|*~`!^+<>@\#$%&\=]/gi
var StacktraceValidator = {
	validator: function(str) {
		return !regExpForStacktrace.test(str);
	},
	message: '{VALUE} is not allow special character!'
}

module.exports.resSchema = {
	type : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
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
	activity_stack : [String],
	network_usage : {
		name : { type: String,
			trim : true,
			validate:  CustomValidator }, // or "WIFI" or ""
		rx : { type : Number },
		tx : { type : Number }
	},
	thread_trace : { 
		type: String,
		trim : true,
		validate:  StacktraceValidator }
};

module.exports.crashSchema = {
	type : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	crash_time : { type : Number },	// milie sec
	stacktrace : { 
		type: String,
		trim : true,
		validate:  StacktraceValidator }
};

module.exports.requestSchema = {
	type : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	request_time : { type : Number },	// milie sec
	host : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	response_time : { type : Number }		// milie sec
};

module.exports.clickSchema = {
	type : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	location : { 
		type: String,
		trim : true,
		validate:  CustomValidator },
	x : { type : Number },
	y : { type : Number }
};
