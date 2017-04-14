/**
 * Created by YS on 2017-04-14.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var VersionModel = require('../models/versionModel');
var LinkModel = require('../models/linkModel');

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
            activity_name : req.params.activityName
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getVersionId(context, data);
            })
            .then(function(context) {
                return VersionModel.getActivityIdByVersion(context, data);
            })
            .then(function(context) {
                return VersionModel.getActivityNameByVersion(context, data);
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
            	var error = new Error("Failed get package list");
                error.status = 500;
                console.error(err);
                context.connection.rollback();
                mysqlSetting.releaseConnection(context);
                return next(error);
            });
    },

    getUserflow : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getPackageList(context, data.access_token)
            })
            .then(function(context, nameList) {
                context.result = nameList;
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    packageNames: data
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