/**
 * Created by YS on 2017-04-14.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var VersionModel = require('../models/versionModel');
var CrashModel = require('../models/crashModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    getCrash : function (req, res, next) {
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
                return CrashModel.getCrashList(context, data)
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.crashList;
                    return resolved(context);
                });
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    crash: data
                });
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getTopCrash : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return CrashModel.getCrashNameWithCount(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.crashList;
                    return resolved(context);
                });
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    error_rank: data
                });
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getCrashUsage : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return CrashModel.getCrashUsage(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.crashList;
                    return resolved(context);
                });
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    crash: data
                });
            })
            .catch(function(err) {
                return next(err);
            });
    },
    
    getVersionsByCrash : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            crash_id : req.params.crashId,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return CrashModel.getCrashInfo(context, data);
            })
            .then(function(context) {
                return VersionModel.getVersionsByCrash(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = {
                        crash_info : data.crashInfo,
                        crash_version : data.crash_version_list
                    }
                    return resolved(context);
                });
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json(data);
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getCrashStack : function(req, res, next){
        res.statusCode = 200;
        return res.json("data");
    }
};