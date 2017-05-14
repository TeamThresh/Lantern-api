/**
 * Created by YS on 2017-05-10.
 */
 var credentials = require('../credentials');

// MongoDB module
var mongoose = require('mongoose');

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect(credentials.mongodb.host);
var Schema = mongoose.Schema;
var SchemaSet = require(credentials.mongoSchemaSet.resourceSchemaSet);
var resourceSchema = new Schema(SchemaSet.testSchema);

module.exports.resMongoModel = function(data) {
	return new Promise(function(resolved, rejected) {
		var Res = mongoose.model('resourceModels', resourceSchema);
		Res.aggregate({
			    $match : {
			        "package_name" : data.package_name,
			        "device_info.uuid" : data.uuid,
			        "data.type" : "res",
			        "data.duration_time.start" : { $gt : data.startRange, $lt : data.endRange },
			        "data.duration_time.end" : { $gt : data.startRange, $lt : data.endRange }
			    }
			}, {
			    $unwind : "$data"
			    
			}, {
			    $match : {
			        "data.type" : "res"
			    }
			}, {
			    $group : {
			        _id : "$_id",
			        data : {
			            $push : {
			                "app" : {
			                    "memory" : "$data.app.memory",
			                    "cpu_app" : "$data.app.cpu_app"
			                },
			                "os" : {
			                    "vmstat" : "$data.os.vmstat",
			                    "cpu" : "$data.os.cpu"
			                },
			                "duration_time" : "$data.duration_time"
			            }
			        }
			    }
			}, {
			    $limit : data.limit
			}, function(err, resData){
		        if(err) {
		        	var error = new Error(err);
		        	error.status = 500;
		        	return rejected(error);
		        }
		        if(!resData) {
		        	var error = new Error("No data");
                    error.status = 9404;
		        	return rejected(error);
		        }
		        
		        return resolved(resData);
	    });
		/*Res.find({
			"package_name" : data.package_name,
		    "device_info.uuid" : data.uuid,
		    "data": {
		        $elemMatch: {
		            type : "res",
		            "duration_time.start" : { $gt : data.startRange, $lt : data.endRange },
		            "duration_time.end" : { $gt : data.startRange, $lt : data.endRange }
		        }
		    }}, function(err, resData){
		        if(err) return rejected(err);
		        if(!resData) return rejected("No data");
		        
		        return resolved(resData);
	    });*/

	});
}