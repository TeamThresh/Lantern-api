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
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
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
                mysqlSetting.rollbackTransaction(err.context)
                    .then(mysqlSetting.releaseConnection)
                    .then(function() {
                        return next(err.error);
                    })
            })
    }
    
};