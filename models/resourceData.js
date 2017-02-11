/**
 * Created by YS on 2017-02-07.
 */

// MongoDB module
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var SchemaSet = require('./schemas/resourceSchemaSet');

module.exports.resourceDataParcing = function(obj) {
	return new Promise(function(resolved, rejected) {
		var resData;
		switch(obj.type.trim()) {
	        case "res" :
	        	resData = new ResourceDataRes(obj, SchemaSet.resSchema);
	            break;
	        case "crash" :
	        	resData = new ResourceDataCrash(obj, SchemaSet.crashSchema);
	            break;
	        case "click" :
	        	resData = new ResourceDataClick(obj, SchemaSet.clickSchema);
	            break;
	        case "request" :
				resData = new ResourceDataRequest(obj, SchemaSet.requestSchema);
	            break;
	    }
		
		var returnData = resData.setMongooseModel(obj);
    	var error = returnData.validateSync();
    	if (error) {
    		console.error(error);
			return rejected(9400);
    	}

		return resolved(returnData);
		/*checkValidation(resData, function(data) {
			return resolved(resData.setMongooseModel(data));
		});*/
	});
};
/*
var getChild = function(targetParent, targetChild, parent, child, callback) {
	if (!(typeof child === "object")) {
		callback(targetParent, parent);
	} else {
		for (var member_name in child) {
	        if (child.hasOwnProperty(member_name) ) {
	        	getChild(targetChild, targetChild[member_name], child, child[member_name], callback);
	        }
	    }
	}
}

var checkValidation = function(resourceData, callback) {
	var resultCount = 0;
	var childLenth = 0;
	require('async').waterfall([function(waterCall) {
		var context = this;
		var result = true;

		getChild({}, resourceData.obj, {}, resourceData.set, function(target, origin) {
			childLenth++;
			if (typeof origin.type === 'function') {
				if (typeof target == typeof origin.type()) {
					switch(origin.type) {
						case Number:
							if (validator.isInt(target+"")) result = result && true;
							break;
						case String:
							if (validator.isAlpha(target)) result = result && true;
							//target = validator.escape(validator.trim(target));
							break;
						case Array:
							target.forEach(function(arr) {
								if (validator.isAlpha(arr)) result = result && true;
								//target = validator.escape(validator.trim(arr));
							});
							break;
					}

					if (!result) {
						console.log("객체 검사 실패");
						return waterCall(result);
					}

					return waterCall(null);
				}
			} else if (Array.isArray(origin)) {
				var arrResult = true;
				target.forEach(function(val, index, arr) {
					if (typeof val === typeof origin[0]()){
						//arr[index] = validator.escape(validator.trim(arr[index]));
						arrResult = arrResult && true;
					} else {
						arrResult = false;
					}
				});
					
				if (!arrResult) {
					console.log("객체 검사 실패");
					return waterCall(arrResult);
				}
				return waterCall(null);
			} else {
				console.log(origin);
			}
		});
	}, function(waterCall) {
		resultCount++;
		if (resultCount == childLenth) {
			return waterCall(null);
		}
	}], function(err, result) {
		return callback(resourceData.obj);
	});
}
*/
class ResourceData {
	constructor(obj, set) {
		this.obj = obj;
		this.set = set;
    }

    setMongooseModel(data) {
    	return null;
    }

}

class ResourceDataRes extends ResourceData {
	constructor(obj, set) {
		super(obj, set);
	}

	setMongooseModel(data) {
		return mongoose.model('resourceDataSchema', resourceDataSchema)(data);
	}
}

class ResourceDataCrash extends ResourceData {
	constructor(obj, set) {
		super(obj, set);
	}

	setMongooseModel(data) {
		return mongoose.model('resourceCrashSchema', resourceCrashSchema)(data);
	}
}

class ResourceDataRequest extends ResourceData {
	constructor(obj, set) {
		super(obj, set);
	}

	setMongooseModel(data) {
		return mongoose.model('resourceRequestSchema', resourceRequestSchema)(data);
	}
}

class ResourceDataClick extends ResourceData {
	constructor(obj, set) {
		super(obj, set);
	}

	setMongooseModel(data) {
		return mongoose.model('resourceClickSchema', resourceClickSchema)(data);
	}
}

var resourceDataSchema = new Schema(SchemaSet.resSchema);

var resourceCrashSchema = new Schema(SchemaSet.crashSchema);

var resourceRequestSchema = new Schema(SchemaSet.requestSchema);

var resourceClickSchema = new Schema(SchemaSet.clickSchema);