/**
 * Created by YS on 2017-04-14.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var VersionModel = require('../models/versionModel');
var CpuModel = require('../models/cpuModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    getCPU : function (req, res, next) {
        if (!isNaN(req.params.activityName)) {
            req.query.crashId = req.params.activityName;
            req.params.activityName = undefined;
        } else if (req.query.activity == undefined
                || req.query.activity == "") 
            req.query.activity = req.params.activityName;
        else 
            req.query.activity = req.params.activityName + "," + req.query.activity;

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return VersionModel.getVersionId(context, data);
            })
            .then(function(context) {
            	return VersionModel.getActivityIdByVersionWithName(context, data);
            })
            .then(function(context) {
            	return CpuModel.getCpuUsageList(context, data);
            })
            .then(function(context) {
            	return new Promise(function(resolved) {
            		context.result = data.cpuUsageList;
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
    }
    
};