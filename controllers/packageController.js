/**
 * Created by YS on 2017-04-14.
 */

var credentials = require('../credentials');
var mysqlSetting = require('../models/mysqlSetting');
var VersionModel = require('../models/versionModel');
var AuthModel = require('../models/authModel');
var crypto = require('crypto');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    addProject : function(req, res, next) {
        const data = { 
            user_id : req.token.user_id,
            package_name : req.params.packageName,
            project_name : req.body.project_name,
            level : 'owner',
            project_key : crypto.createHmac('sha256', 
                    credentials.pack_secret)
                .update(req.params.packageName)
                .digest('base64')
        }

        if (req.body.type == 'android' 
            || req.body.type == 'unity') {
            data.type = req.body.type;
        } else {
            let err = new Error('wrong parameter');
            err.status = 400;
            return next(err);
        }

        // check username duplication
        mysqlSetting.getWritePool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then((context) => {
                return VersionModel.addPackage(context, data);
            })
            .then((context) => {
                return AuthModel.addAuthToProject(context, data);
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'regist complete'
                });
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

    editProject : function(req, res, next) {
        const data = { 
            user_id : req.token.user_id,
            user_level : req.token.user_level,
            package_name : req.params.packageName,
            project_name : req.body.project_name
        }

        if (data.user_level != 'owner') {
            let err = new Error();
            err.status = 403;
            return next(err);
        }

        if (req.body.type == 'android' 
            || req.body.type == 'unity') {
            data.type = req.body.type;
        } else {
            let err = new Error('wrong parameter');
            err.status = 400;
            return next(err);
        }

        // check username duplication
        mysqlSetting.getWritePool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then((context) => {
                return VersionModel.editPackage(context, data);
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'edit complete'
                });
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

    rmProject : function(req, res, next) {
        const data = { 
            user_id : req.token.user_id,
            user_level : req.token.user_level,
            package_name : req.params.packageName
        }

        if (data.user_level != 'owner') {
            let err = new Error();
            err.status = 403;
            return next(err);
        }

        // check username duplication
        mysqlSetting.getWritePool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then((context) => {
                return AuthModel.removeProject(context, data);
            })
            .then((context) => {
                return VersionModel.removePackage(context, data);
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'remove complete'
                });
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

    getPackageInfo : function (req, res, next) {
        var data = {
            user_id : req.token.user_id,
            package_name : req.params.packageName
        };

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getPackageInfo(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = context.packageInfo;
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

    getPackageNames : function (req, res, next) {
        var data = {
            user_id : req.token.user_id
        };

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
            	return VersionModel.getPackageList(context, data);
            })
            .then(function(context) {
            	return new Promise(function(resolved) {
            		context.result = context.packageNameList;
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

    getAppVersionList : function (req, res, next) {
        var data = {
            user_id : req.token.user_id,
            package_name : req.params.packageName
        };

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getAppVersionList(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = context.appVersionList;
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

    getDeviceByOS : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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

    getSelectVersionList : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            resourceType : req.params.resourceType,
            filter : require('./filter').setFilter(req.query)
        };

        if (!isNaN(req.params.activityName)) {
            req.query.crashId = req.params.activityName;
        } 
            
        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getVersionInRange(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    let parsed_data = [];
                    data.user_list.forEach((beforeData) => {
                        let parsing_data = {
                            'UUID' : [beforeData.uuid],
                            'Device' : beforeData.device,
                            'OS' : beforeData.os,
                            'Location' : beforeData.location,
                            'Usage Rate' : parseInt(beforeData.usage_rate / beforeData.usage_count),
                            'User' : 1
                        }
                        let find_data = parsed_data.find((data) => {
                            if (data.Device == parsing_data.Device
                                && data.OS == parsing_data.OS
                                && data.Location == parsing_data.Location
                                && data['Usage Rate'] == parsing_data['Usage Rate']) {
                                data.UUID.push(beforeData.uuid);
                                data.User++;
                                return true;
                            }
                            return false;

                        });
                        if (!find_data) 
                            parsed_data.push(parsing_data);
                    });

                    context.result = parsed_data.filter((user) => {
                        user.UUID = undefined;
                        return true;
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
    },

    getAllVersionStatus : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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

    getStatusOfLocation : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            selector : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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

    getStatusOfDevice : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            selector : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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

    getStatusOfOs : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            selector : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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

    getStatusOfActivity : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            selector : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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

    deleteGroup : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            group_name : req.params.groupName
        };

        mysqlSetting.getWritePool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.deleteGroup(context, data);
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'delete complete'
                });
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

    getGroupList : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName
        };

        mysqlSetting.getReadPool()
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

    getStatusByGroup : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            group_name : req.params.groupName
        };

        mysqlSetting.getReadPool()
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

    setStatusByGroup : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            group_name : req.params.groupName,
            group_set : req.body.filters
        };

        mysqlSetting.getReadPool()
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

    getUserUsage : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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