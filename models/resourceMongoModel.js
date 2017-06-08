/**
 * Created by YS on 2017-05-10.
 */
 var credentials = require('../credentials');

var filterOption = require('./filterOption');
// MongoDB module
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var SchemaSet = require(credentials.mongoSchemaSet.resourceSchemaSet);
var resourceSchema = new Schema(SchemaSet.testSchema);

module.exports.resAppRawMongoModel = function(data) {
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
			}])
			.allowDiskUse(true)
			.exec(function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
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

module.exports.resOSRawMongoModel = function(data) {
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
			}])
			.allowDiskUse(true)
			.exec(function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
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


module.exports.resVmstatRawMongoModel = function(data) {
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
			}])
			.allowDiskUse(true)
			.exec(function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
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

module.exports.resMemoryRawMongoModel = function(data) {
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
			})
			.allowDiskUse(true)
			.exec(function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
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

function converter(rawData) {
	let convertData = {};
	let keys = Object.keys(rawData);

	keys.forEach((key) => {
		if (!convertData[key])
			convertData[key] = [];
		rawData[key].forEach((res) => {
			res.timestamp = new Date(Math.floor(res.timestamp / 10000) * 10000).toISOString();
			let data = convertData[key].some(function(row, index) {
				if (row.value == res.data && row.timestamp == res.timestamp) {
					row.count += 1;
					return true;
				} else {
					return false;
				}
			});

			if (!data)
				convertData[key].push({ value : res.data, timestamp : res.timestamp, count : 1 });

		});
	});

	let returnData = [];
	let dataKeys = Object.keys(convertData);
	dataKeys.forEach((key) => {
		returnData.push({
			title: key,
			data: convertData[key]
		})
	});

	return returnData;
}

module.exports.resAppDetailMongoModel = function(data) {
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
				$match : {
	                "data.app.cpu_app" : { $ne : null }
	            }
		    }, {
				$sort : { "data.duration_time.start" : -1 }
			}, {
				$group : {
					_id : "app_cpu",
					"utime" : {
                        $push : { data: "$data.app.cpu_app.utime", timestamp : "$data.duration_time.start" } },
                    "stime" : {
                        $push : { data: "$data.app.cpu_app.stime", timestamp : "$data.duration_time.start" } },
                    "cutime" : {
                        $push : { data: "$data.app.cpu_app.cutime", timestamp : "$data.duration_time.start" } },
                    "cstime" : {
                        $push : { data: "$data.app.cpu_app.cstime", timestamp : "$data.duration_time.start" } },
                    "priority" : {
                        $push : { data: "$data.app.cpu_app.priority", timestamp : "$data.duration_time.start" } },
                    "nice" : {
                        $push : { data: "$data.app.cpu_app.nice", timestamp : "$data.duration_time.start" } },
                    "starttime" : {
                        $push : { data: "$data.app.cpu_app.starttime", timestamp : "$data.duration_time.start" } },
                    "vsize" : {
                        $push : { data: "$data.app.cpu_app.vsize", timestamp : "$data.duration_time.start" } },
                    "blocked" : {
                        $push : { data: "$data.app.cpu_app.blocked", timestamp : "$data.duration_time.start" } },
                    "nswap" : {
                        $push : { data: "$data.app.cpu_app.nswap", timestamp : "$data.duration_time.start" } }
                }
			}], function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

		        delete resRawData[0]._id;
		        let returnData = converter(resRawData[0]);

		        
		        return resolved(returnData);
	    });

	});
}

module.exports.resOSDetailMongoModel = function(data) {
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
				$match : {
	                "data.os.cpu" : { $ne : null }
	            }
		    }, {
				$sort : { "data.duration_time.start" : -1 }
			}, {
				$group : {
					_id : "os_cpu",
					"user" : {
                        $push : { data: "$data.os.cpu.user", timestamp : "$data.duration_time.start" } },
                    "system" : {
                        $push : { data: "$data.os.cpu.system", timestamp : "$data.duration_time.start" } },
                    "idle" : {
                        $push : { data: "$data.os.cpu.idle", timestamp : "$data.duration_time.start" } },
                    "iowait" : {
                        $push : { data: "$data.os.cpu.iowait", timestamp : "$data.duration_time.start" } },
                    "irq" : {
                        $push : { data: "$data.os.cpu.irq", timestamp : "$data.duration_time.start" } },
                    "softirq" : {
                        $push : { data: "$data.os.cpu.softirq", timestamp : "$data.duration_time.start" } },
                    "steal" : {
                        $push : { data: "$data.os.cpu.steal", timestamp : "$data.duration_time.start" } }
                }
			}], function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

		        delete resRawData[0]._id;
		        
		        let returnData = converter(resRawData[0]);
		        
		        return resolved(returnData);
	    });

	});
}

module.exports.resVmstatDetailMongoModel = function(data) {
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
				$match : {
	                "data.os.vmstat" : { $ne : null }
	            }
		    }, {
				$sort : { "data.duration_time.start" : -1 }
			}, {
				$group : {
					_id : "vmstat",
					"ready" : {
                        $push : { data: "$data.os.vmstat.r", timestamp : "$data.duration_time.start" } },
                    "block" : {
                        $push : { data: "$data.os.vmstat.b", timestamp : "$data.duration_time.start" } },
                    "swpd" : {
                        $push : { data: "$data.os.vmstat.swpd", timestamp : "$data.duration_time.start" } },
                    "free" : {
                        $push : { data: "$data.os.vmstat.free", timestamp : "$data.duration_time.start" } },
                    "buff" : {
                        $push : { data: "$data.os.vmstat.buff", timestamp : "$data.duration_time.start" } },
                    "cache" : {
                        $push : { data: "$data.os.vmstat.cache", timestamp : "$data.duration_time.start" } },
                    "swap_in" : {
                        $push : { data: "$data.os.vmstat.si", timestamp : "$data.duration_time.start" } },
                    "swap_out" : {
                        $push : { data: "$data.os.vmstat.so", timestamp : "$data.duration_time.start" } }
                }
			}], function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

		        delete resRawData[0]._id;
		        
		        let returnData = converter(resRawData[0]);
		        
		        return resolved(returnData);
	    });

	});
}

module.exports.resMemoryDetailMongoModel = function(data) {
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
				$match : {
	                "data.app.memory" : { $ne : null }
	            }
		    }, {
				$sort : { "data.duration_time.start" : -1 }
			}, {
				$group : {
					_id : "memory",
					"max" : {
                        $push : { data: "$data.app.memory.max", timestamp : "$data.duration_time.start" } },
                    "total" : {
                        $push : { data: "$data.app.memory.total", timestamp : "$data.duration_time.start" } },
                    "alloc" : {
                        $push : { data: "$data.app.memory.alloc", timestamp : "$data.duration_time.start" } },
                    "free" : {
                        $push : { data: "$data.app.memory.free", timestamp : "$data.duration_time.start" } }
                }
			}], function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

		        delete resRawData[0]._id;
		        
		        let returnData = converter(resRawData[0]);
		        
		        return resolved(returnData);
	    });

	});
}

module.exports.getMemHistogram = function(data) {
	return new Promise(function(resolved, rejected) {

		var matchQuery = {
	        "package_name" : data.package_name,
            "data.type" : "res",
	    }

	    filterOption.addMongoFullOption(data, matchQuery);

		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate({
		        $match : matchQuery
		    }, {
		        $limit : 300
		    }, {
		        $unwind : "$data"
		    }, {
		        $match : { "data.app.memory.alloc" : { $ne : null } }
		    }, {
		        $group : {
		            _id : {
		                $multiply : [
		                    {$floor : {
		                        $divide : ["$data.app.memory.alloc", 10000]
		                    }}, 10
		                ]
		            },
		            group : {
		                $sum: 1 
		            }
		        }
		    }, {
		        $sort : { "_id" : 1 }
		    }, {
		        $group : {
		            _id : "memory",
		            histogram : {
			            $push : {
			                "rate" : "$_id",
			                "user_count" : "$group"
			            }
			        }
			    }
		    }, function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }


		        ////
                let problem_set = [];
                let count = 0;

                data.histogram = resRawData[0].histogram;
                resRawData[0].histogram.forEach((row) => {
                	count += row.user_count;
                });

                let pValue = require('./position').calculatePValue(resRawData[0].histogram, count, problem_set);

                data.p95 = pValue.p95;
                data.p50 = pValue.p50;
                data.p10 = pValue.p10;
		        
		        return resolved();
	    });

	});
}

module.exports.getCPUHistogram = function(data) {
	return new Promise(function(resolved, rejected) {

		var matchQuery = {
	        "package_name" : data.package_name,
            "data.type" : "res",
	    }

	    filterOption.addMongoFullOption(data, matchQuery);

		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate({
		        $match : matchQuery
		    }, {
		        $limit : 300
		    }, {
		        $unwind : "$data"
		    }, {
		        $match : { "data.os.cpu.user" : { $ne : null }, 
		            "data.os.cpu.idle" : { $gt : 0 }
		        }
		    }, {
		        $group : {
		            _id : {$floor : { 
		                    $multiply : [
		                        { $divide : [ 
		                            "$data.os.cpu.user",
		                            { $add : ["$data.os.cpu.user", "$data.os.cpu.system", "$data.os.cpu.nice", "$data.os.cpu.idle"] }
		                        ] },
		                        100
		                    ]
		                }
		            },
		            group : {
		                $sum: 1 
		            }
		        }
		    }, {
		        $sort : { "_id" : 1 }
		    }, {
		        $group : {
		            _id : "cpu",
		            histogram : {
			            $push : {
			                "rate" : "$_id",
			                "user_count" : "$group"
			            }
			        }
			    }
			}, function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }


		        ////
                let problem_set = [];
                let count = 0;

                data.histogram = resRawData[0].histogram;
                resRawData[0].histogram.forEach((row) => {
                	count += row.user_count;
                });

                let pValue = require('./position').calculatePValue(resRawData[0].histogram, count, problem_set);

                data.p95 = pValue.p95;
                data.p50 = pValue.p50;
                data.p10 = pValue.p10;
		        
		        return resolved();
	    });

	});
}

module.exports.getMemInsight = function(data) {
	return new Promise(function(resolved, rejected) {

		var matchQuery = {
	        "package_name" : data.package_name,
            "data.type" : "res"
	    }

	    filterOption.addMongoFullOption(data, matchQuery);

		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate({
		        $match : matchQuery
	    	}, {
        		$limit : 300
		    }, {
	            $unwind : "$data"
            }, {
	            $match : {
	                "data.app.activity_stack" : { $ne : null },
                	"data.app.activity_stack.0" : { $exists : true },
                	"data.app.memory.alloc": { $gt : data.p95 * 1000 }
	            }
		    }, {
	            $sort : { "data.duration_time.start" : -1 }
		    }, {
	            $group : {
                    _id : {
                        "activity_name" : { $arrayElemAt : [{ $slice : [ "$data.app.activity_stack", -1 ] }, 0] },
                        "device_name" : "$device_info.device",
                        "os_ver" : "$device_info.os",
                        "location_code" : "$device_info.location.code"
                    },
                    user_count : { $sum : 1 }
	                
	            }
			}, function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

				data.problem_set = [];

		        resRawData.forEach((row) => {
		        	data.problem_set.push({
		        		activity_name : row._id.activity_name,
		        		device_name : row._id.device_name,
		        		os_ver : row._id.os_ver,
		        		location_code : row._id.location_code,
		        		user_count : row.user_count
		        	});
		        });
		        
		        return resolved();
	    });

	});
}

module.exports.getCPUInsight = function(data) {
	return new Promise(function(resolved, rejected) {

		var matchQuery = {
	        "package_name" : data.package_name,
            "data.type" : "res"
	    }

	    filterOption.addMongoFullOption(data, matchQuery);

		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate({
		        '$match' : matchQuery
		    }, {
		        '$limit' : 300
		    }, {
		        '$unwind' : "$data"
		    }, {
		        '$match' : { "data.os.cpu.user" : { $ne : null }, 
		            "data.os.cpu.idle" : { $gt : 0 }
		        }
	        }, {
	            '$group' : {
                    _id : {
                        "activity_name" : { $arrayElemAt : [{ $slice : [ "$data.app.activity_stack", -1 ] }, 0] },
                        "device_name" : "$device_info.device",
                        "os_ver" : "$device_info.os",
                        "location_code" : "$device_info.location.code",
                        "usage": {
                        	$floor : { 
			                    $multiply : [
			                        { $divide : [ 
			                            "$data.os.cpu.user",
			                            { $add : ["$data.os.cpu.user", "$data.os.cpu.system", "$data.os.cpu.nice", "$data.os.cpu.idle"] }
			                        ] },
			                        100
			                    ]
			                }
			            }
                    },
                    user_count : { $sum : 1 }
	                
	            }
		    }, {
		    	$match : {
		            "_id.usage" : { $gt : Number(data.p95) }
		        }
			}, function(err, resRawData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resRawData || resRawData.length == 0) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }

				data.problem_set = [];

		        resRawData.forEach((row) => {
		        	data.problem_set.push({
		        		activity_name : row._id.activity_name,
		        		device_name : row._id.device_name,
		        		os_ver : row._id.os_ver,
		        		location_code : row._id.location_code,
		        		user_count : row.user_count
		        	});
		        });
		        
		        return resolved();
	    });

	});
}

