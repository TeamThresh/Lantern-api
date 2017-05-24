/**
 * Created by YS on 2017-05-10.
 */
 var credentials = require('../credentials');

var filterOption = require('./filterOption');
// MongoDB module
var mongoose = require('mongoose');

mongoose.connect(credentials.mongodb.host);
var Schema = mongoose.Schema;
var SchemaSet = require(credentials.mongoSchemaSet.resourceSchemaSet);
var resourceSchema = new Schema(SchemaSet.testSchema);

module.exports.resAppMongoModel = function(data) {
	return new Promise(function(resolved, rejected) {

		var matchQuery = {
	        "package_name" : data.package_name,
			"data.app.activity_stack" : data.activity_name,
	        "data.type" : "res"
	    }

	    filterOption.addMongoFullOption(data.filter, matchQuery);

		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate([{
	    		$match : matchQuery
			}, {
				$limit : 100
			}, {
				$unwind : "$data"
			}, {
				$sort : { "data.duration_time.start" : -1 }
			}, {
				$group : {
					_id : "app",
					data : {
						$push : {
							"state" : "$data.app.cpu_app.state",
							"ppid" : "$data.app.cpu_app.ppid",
							"pgrp" : "$data.app.cpu_app.pgrp",
							"session" : "$data.app.cpu_app.session",
							"tty_nr" : "$data.app.cpu_app.tty_nr",
							"flags" : "$data.app.cpu_app.flags",
							"mingflt" : "$data.app.cpu_app.mingflt",
							"cminfltmajflt" : "$data.app.cpu_app.cminfltmajflt",
							"cmajflt" : "$data.app.cpu_app.cmajflt",
							"utime" : "$data.app.cpu_app.utime",
							"stime" : "$data.app.cpu_app.stime",
							"cutime" : "$data.app.cpu_app.cutime",
							"cstime" : "$data.app.cpu_app.cstime",
							"priority" : "$data.app.cpu_app.priority",
							"nice" : "$data.app.cpu_app.nice",
							"num_threadsitrealvalue" : "$data.app.cpu_app.num_threadsitrealvalue",
							"starttime" : "$data.app.cpu_app.starttime",
							"vsize" : "$data.app.cpu_app.vsize",
							"rss_" : "$data.app.cpu_app.rss_",
							"rsslim" : "$data.app.cpu_app.rsslim",
							"startcode" : "$data.app.cpu_app.startcode",
							"endcode" : "$data.app.cpu_app.endcode",
							"startstackkstkesp" : "$data.app.cpu_app.startstackkstkesp",
							"kstkeip" : "$data.app.cpu_app.kstkeip",
							"signal" : "$data.app.cpu_app.signal",
							"blocked" : "$data.app.cpu_app.blocked",
							"sigignore" : "$data.app.cpu_app.sigignore",
							"sigcatch" : "$data.app.cpu_app.sigcatch",
							"wchan" : "$data.app.cpu_app.wchan",
							"nswap" : "$data.app.cpu_app.nswap",
							"start_time" : "$data.duration_time.start",
							"end_time" : "$data.duration_time.start"
						}
					}
				}
			}], function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

		        let resData = [];
		        resRawData.forEach(function(resStack) {
		        	resStack.data.forEach(function(res) {
		        		resData.push(res);
		        	})
		        });
		        
		        return resolved(resData);
	    });

	});
}

module.exports.resOSMongoModel = function(data) {
	return new Promise(function(resolved, rejected) {

		var matchQuery = {
	        "package_name" : data.package_name,
			"data.app.activity_stack" : data.activity_name,
	        "data.type" : "res"
	    }

	    filterOption.addMongoFullOption(data.filter, matchQuery);
	    
		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate([{
			    $match : matchQuery
			}, {
				$limit : 100
			}, {
				$unwind : "$data"
			}, {
				$sort : { "data.duration_time.start" : -1 }
			}, {
				$group : {
					_id : "os",
					data : {
		                $push : {
		                    "user" : "$data.os.cpu.user",
		                    "nice" : "$data.os.cpu.nice",
		                    "system" : "$data.os.cpu.system",
		                    "idle" : "$data.os.cpu.idle",
		                    "iowait" : "$data.os.cpu.iowait",
		                    "irq" : "$data.os.cpu.irq",
		                    "softirq" : "$data.os.cpu.softirq",
		                    "steal" : "$data.os.cpu.steal",
		                    "guest" : "$data.os.cpu.guest",
		                    "guest_nice" : "$data.os.cpu.guest_nice",
		                    "start_time" : "$data.duration_time.start",
		                    "end_time" : "$data.duration_time.start"
		                }
		            }
			    }
			}], function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

		        let resData = [];
		        resRawData.forEach(function(resStack) {
		        	resStack.data.forEach(function(res) {
		        		resData.push(res);
		        	})
		        });
		        
		        return resolved(resData);
	    });

	});
}


module.exports.resVmstatMongoModel = function(data) {
	return new Promise(function(resolved, rejected) {

		var matchQuery = {
	        "package_name" : data.package_name,
			"data.app.activity_stack" : data.activity_name,
	        "data.type" : "res"
	    }

	    filterOption.addMongoFullOption(data.filter, matchQuery);

		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate([{
			    $match : matchQuery
			}, {
				$limit : 100
			}, {
				$unwind : "$data"
			}, {
				$sort : { "data.duration_time.start" : -1 }
			}, {
				$group : {
					_id : "vmstat",
					data : {
		                $push : {
		                    "r" : "$data.os.vmstat.r",
		                    "b" : "$data.os.vmstat.b",
		                    "swpd" : "$data.os.vmstat.swpd",
		                    "free" : "$data.os.vmstat.free",
		                    "buff" : "$data.os.vmstat.buff",
		                    "cache" : "$data.os.vmstat.cache",
		                    "si" : "$data.os.vmstat.si",
		                    "so" : "$data.os.vmstat.so",
		                    "bi" : "$data.os.vmstat.bi",
		                    "bo" : "$data.os.vmstat.bo",
		                    "in" : "$data.os.vmstat.in",
		                    "cs" : "$data.os.vmstat.cs",
		                    "us" : "$data.os.vmstat.us",
		                    "sy" : "$data.os.vmstat.sy",
		                    "id" : "$data.os.vmstat.id",
		                    "wa" : "$data.os.vmstat.wa"
		                    
		                }
		            }
			    }
			}], function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

		        let resData = [];
		        resRawData.forEach(function(resStack) {
		        	resStack.data.forEach(function(res) {
		        		resData.push(res);
		        	})
		        });
		        
		        return resolved(resData);
	    });

	});
}

module.exports.resMemoryMongoModel = function(data) {
	return new Promise(function(resolved, rejected) {

		var matchQuery = {
	        "package_name" : data.package_name,
			"data.app.activity_stack" : data.activity_name,
	        "data.type" : "res",
	        "data.duration_time.start" : { $gt : data.startRange, $lt : data.endRange },
	        "data.duration_time.end" : { $gt : data.startRange, $lt : data.endRange }
	    }

	    filterOption.addMongoFullOption(data.filter, matchQuery);

		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate({
			    $match : matchQuery
			}, {
				$limit : 100
			}, {
				$unwind : "$data"
			}, {
				$sort : { "data.duration_time.start" : -1 }
			}, {
				$group : {
					_id : "memory",
					data : {
		                $push : {
		                    "max" : "$data.app.memory.max",
		                    "total" : "$data.app.memory.total",
		                    "alloc" : "$data.app.memory.alloc",
		                    "free" : "$data.app.memory.free"
		                }
		            }
			    }
			}, function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

		        let resData = [];
		        resRawData.forEach(function(resStack) {
		        	resStack.data.forEach(function(res) {
		        		resData.push(res);
		        	})
		        });
		        
		        return resolved(resData);
	    });

	});
}