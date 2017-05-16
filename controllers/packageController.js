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
            access_token: req.token
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return VersionModel.getPackageList(context, data);
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

    getDeviceByOS : function (req, res, next) {
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
    },

    getSelectVersionList : function(req, res, next) {
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
                return VersionModel.getVersionInRange(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.user_list;
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

    getAllVersionStatus : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getAllVersionUsage(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.all_version;
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

    getStatusOfLocation : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            selector : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getLocationUsage(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.location_usage;
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

    getStatusOfDevice : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            selector : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getDeviceUsage(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.device_usage;
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

    getStatusOfOs : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            selector : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getOsUsage(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.os_usage;
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

    getStatusOfActivity : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            selector : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getActivityUsage(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.activity_usage;
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

    getGroupList : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getGroupList(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.group_list;
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

    getStatusByGroup : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            group_name : req.params.groupName
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getGroup(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.group_set;
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

    setStatusByGroup : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            group_name : req.params.groupName,
            group_set : req.body.filters
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.setGroup(context, data);
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({msg : "complete"});
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getUserUsage : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getUserConnection(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.user_connection;
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
    }
};