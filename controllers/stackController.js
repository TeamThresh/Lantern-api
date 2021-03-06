/**
 * Created by YS on 2017-05-06.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var VersionModel = require('../models/versionModel');
var StackModel = require('../models/stackModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    getCallstack : function (req, res, next) {

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName
        };

        var old = false;
        if (req.params.activityName) {
            if (!isNaN(req.params.activityName)) {
                req.query.crashId = req.params.activityName;
                req.params.activityName = undefined;
            } else if (req.query.activity && req.query.activity != '')
                req.query.activity = req.params.activityName + "," + req.query.activity;
            else 
                req.query.activity = req.params.activityName;

            data.resourceType = req.params.resourceType;
        } else {
            old = true;
            if (req.query.activity && req.query.activity != '')
                req.query.activity = req.params.resourceType + "," + req.query.activity;
            else 
                req.query.activity = req.params.resourceType;
        }

        data.filter = require('./filter').setFilter(req.query);

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return VersionModel.getVersionId(context, data);
            })
            .then(function(context) {
                if (old) 
                    return VersionModel.getActivityIdByVersionWithName(context, data);
                
                return VersionModel.getActivityIdByType(context, data);
            })
            .then(function(context) {
            	return StackModel.getCallstack(context, data);
            })
            .then(function(context) {
            	return new Promise(function(resolved) {
            		context.result = data.callstack;
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

    getCrashStack : function(req, res, next){
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            crash_id : req.params.crashId,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return StackModel.getCrashstack(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.callstack;
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