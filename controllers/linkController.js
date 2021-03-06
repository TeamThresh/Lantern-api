/**
 * Created by YS on 2017-04-14.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var VersionModel = require('../models/versionModel');
var LinkModel = require('../models/linkModel');
var CrashModel = require('../models/crashModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    getNodesAndLinks : function (req, res, next) {
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
                return VersionModel.getActivityIdByVersion(context, data);
            })
            .then(function(context) {
                return VersionModel.getActNameCrashByVersion(context, data);
            })
            .then(function(context) {
            	return LinkModel.getLinkList(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = {
                        links : data.linkList,
                        nodes : data.act_name_list
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

    getUserflow : function (req, res, next) {
        if (req.query.activity == undefined
        || req.query.activity == "") 
            req.query.activity = req.params.activityName;
        else 
            req.query.activity = req.params.activityName + "," + req.query.activity;

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
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
                return LinkModel.getActivityCount(context, data);
            })
            .then(function(context) {
                return LinkModel.getLinkList(context, data);
            })
            .then(function(context) {
                return CrashModel.getCrashCount(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = {
                        crash : data.crashCount,
                        exit : data.activity_count - data.crashCount
                    };

                    data.linkList.forEach(function(link) {
                        context.result[link.target] = link.value;
                        context.result.exit -= link.value;
                    });
                   
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