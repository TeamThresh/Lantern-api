/**
 * Created by YS on 2017-06-01.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var InsightModel = require('../models/insightModel');
var ResourceMongoModel = require('../models/resourceMongoModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    getInsight : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            type : req.params.type,
            p95 : req.params.p95,
            //filter : require('./filter').setFilter(req.query)
        };


        let start_date = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T');
        let end_date = new Date().toISOString().split('T');
        data.dateRange = {
            start : start_date[0]+" "+start_date[1].split('.')[0],
            end : end_date[0]+" "+end_date[1].split('.')[0]
        };

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	switch(data.type) {
            		case 'cpu':
            			return ResourceMongoModel.getCPUInsight(data)
            				.then(() => {
            					return new Promise((resolved) => {
            						return resolved(context);
            					});
            				})
            				.catch((err) => {
            					return new Promise((resolved, rejected)=> {
            						return rejected({ context : context, error: err });
            					});
            				});
            			//return InsightModel.getCPUInsight(context, data);
            		case 'memory':
            			return ResourceMongoModel.getMemInsight(data)
            				.then(() => {
            					return new Promise((resolved) => {
            						return resolved(context);
            					});
            				})
            				.catch((err) => {
            					return new Promise((resolved, rejected)=> {
            						return rejected({ context : context, error: err });
            					});
            				});
            			//return InsightModel.getMemInsight(context, data);
            		case 'network':
            			return InsightModel.getOBCInsight(context, data);
            		case 'ui':
            			return InsightModel.getRenderInsight(context, data);
            		default:
            			return new Promise((resolved, rejected) => {
		                	var error = new Error();
		                	error.status = 404;
		                	return rejected({ context : context, error : error });
            			});
            	}
            })
            .then(function(context) {
            	return new Promise((resolved, rejected) => {
            		let result = {
            			activity: {},
            			os: {},
            			device: {},
            			location: {}
            		};
            		data.problem_set.forEach((row) => {
            			result.activity[row.activity_name] == undefined 
            				? result.activity[row.activity_name] = row.user_count 
            				: result.activity[row.activity_name] += row.user_count;
        				result.os[row.os_ver] == undefined
        					? result.os[row.os_ver] = row.user_count
            				: result.os[row.os_ver] += row.user_count;
        				result.device[row.device_name] == undefined
        					? result.device[row.device_name] = row.user_count
            				: result.device[row.device_name] += row.user_count;
        				result.location[row.location_code] == undefined
        					? result.location[row.location_code] = row.user_count
            				: result.location[row.location_code] += row.user_count;
            			result.user_count += row.user_count;
            		});

            		//if (result.activity)
            		let top = {};
            		top.act = result.activity  != undefined ? sortObj(result.activity) : undefined;
            		top.os = result.os  != undefined ? sortObj(result.os) : undefined;
            		top.dev = result.device  != undefined ? sortObj(result.device) : undefined;
            		top.loc = result.location  != undefined ? sortObj(result.location) : undefined;


					context.result = top;
            		return resolved(context);
            	});
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
		        res.statusCode = 200;
		        return res.json(data);
            })
            .catch(function(err) {
                if (err.context) {
                    mysqlSetting.rollbackTransaction(err.context)
                        .then(mysqlSetting.releaseConnection)
                        .then(function() {
                            return next(err.error);
                        });
                } else {
                    next(err);
                    throw err;
                }
            })
    },

    getHistogramWithP95 : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            type : req.params.type,
            //filter : require('./filter').setFilter(req.query)
        };


        let start_date = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T');
        let end_date = new Date().toISOString().split('T');
        data.dateRange = {
            start : start_date[0]+" "+start_date[1].split('.')[0],
            end : end_date[0]+" "+end_date[1].split('.')[0]
        };

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	switch(data.type) {
            		case 'cpu':
            			// MongoDB 에서 Raw 데이터 가져옴
            			return ResourceMongoModel.getCPUHistogram(data)
            				.then((resData) => {
            					return new Promise((resolved) => {
            						return resolved(context);
            					});
            				});
            			//return InsightModel.getCPUHistogramWithP95(context, data);
            		case 'memory':
            			// MongoDB 에서 Raw 데이터 가져옴
            			return ResourceMongoModel.getMemHistogram(data)
            				.then((resData) => {
            					return new Promise((resolved) => {
            						return resolved(context);
            					});
            				});
            			//return InsightModel.getMemHistogramWithP95(context, data);
            		case 'network':
            			return InsightModel.getHostHistogramWithP95(context, data);
            		case 'ui':
            			return InsightModel.getRenderHistogramWithP95(context, data);
            		default:
            			return new Promise((resolved, rejected) => {
		                	var error = new Error();
		                	error.status = 404;
		                	return rejected({ context : context, error : error });
            			});
            	}
            })
            .then(function(context) {
            	return new Promise((resolved, rejected) => {
            		context.result = {
            			histogram: data.histogram,
						p95: data.p95,
						p50: data.p50,
						p10 : data.p10
            		};
            		return resolved(context);
            	});
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
		        res.statusCode = 200;
		        return res.json(data);
            })
            .catch(function(err) {
                if (err.context) {
                    mysqlSetting.rollbackTransaction(err.context)
                        .then(mysqlSetting.releaseConnection)
                        .then(function() {
                            return next(err.error);
                        });
                } else {
                    next(err);
                    throw err;
                }
            })
    },
    
}

function checkTop(arr, target) {
	if (arr.length < 5) return true;
	return arr.some((row) => {
		return row.count < target;
	});
}

function sortObj(obj) {
	let top = [];
	let other = 0;
	let keys = Object.keys(obj);

	keys.forEach((key) => {
		if (checkTop(top, obj[key])) {
			top.push({
				key : key,
				count : obj[key]
			});

			top.sort((a,b) => {
				return a.count > b.count ? -1 : a.count < b.count ? 1 : 0; 
			});

			if (top.length > 5) other += top.pop().count;
		} else {
			other += obj[key];
		}
	})

	top.push({ key: 'others', count: other });
	return top;
}