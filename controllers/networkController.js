/**
 * Created by YS on 2017-04-14.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var VersionModel = require('../models/versionModel');
var NetworkModel = require('../models/networkModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    getNetwork : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName
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
            	return NetworkModel.getHostList(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.hostList;
                    return resolved(context);
                });
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
		        res.statusCode = 200;
		        return res.json({
                    network : data
                });
            })
            .catch(function(err) {
            	var error = new Error("Failed get package list");
                error.status = 500;
                console.error(err);
                context.connection.rollback();
                mysqlSetting.releaseConnection(context);
                return next(error);
            });
    },

    getLocation : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return NetworkModel.getLocationList(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.locationList;
                    return resolved(context);
                });
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    location : data
                });
            })
            .catch(function(err) {
                var error = new Error("Failed get package list");
                error.status = 500;
                console.error(err);
                context.connection.rollback();
                mysqlSetting.releaseConnection(context);
                return next(error);
            });
    }
    
};