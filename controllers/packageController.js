/**
 * Created by YS on 2017-04-14.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var VersionModel = require('../models/versionModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    getPackageNames : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return VersionModel.getPackageList(context, data.access_token);
            })
            .then(function(context) {
            	return new Promise(function(resolved) {
            		context.result = context.nameList;
            		return resolved(context);
            	});
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
		        res.statusCode = 200;
		        return res.json({
		            packageNames: data
		        });
            })
            .catch(function(err) {
                return next(err);
            });
    }, 

    getDeviceStatus : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getDeviceByOs(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.device_list;
                    return resolved(context);
                });
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    os: data
                });
            })
            .catch(function(err) {
                return next(err);
            });
    }
};