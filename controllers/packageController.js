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
            	var error = new Error("Failed get package list");
                error.status = 500;
                console.error(err);
                context.connection.rollback();
                mysqlSetting.releaseConnection(context);
                return next(error);
            });
    }

};