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
        if (req.query.activity == undefined
        || req.query.activity == "") 
            req.query.activity = req.params.activityName;
        else 
            req.query.activity = req.params.activityName + "," + req.query.activity;

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            limit : Number(req.query.limit) || 10,
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

    getTopCrash : function (req, res, next) {

        if (req.query.activity == undefined
        || req.query.activity == "") 
            req.query.activity = req.params.activityName;
        else 
            req.query.activity = req.params.activityName + "," + req.query.activity;
        
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            limit : Number(req.query.limit) || 10,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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

    getCrashUsage : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
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

    getCrashInfo : function (req, res, next) {
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
                return CrashModel.getCrashInfo(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.crashInfo;
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
    
    getVersionsByCrash : function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            crash_id : req.params.crashId,
            mode : req.params.mode,
            filter : require('./filter').setFilter(req.query)
        };

        switch(data.mode) {
            case 'os':
                data.field_name = 'os_ver';
                break;
            case 'device':
                data.field_name = 'device_name';
                break;
            case 'location':
                data.field_name = 'location_code';
                break;
            case 'app':
                data.field_name = 'app_ver';
                break;
            default:
                let err = new Error();
                err.status = 400;
                return next(err);
        }

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return VersionModel.getVersionsByCrash(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data[data.field_name];
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

    getCrashEventPath : function (req, res, next) {
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
                return CrashModel.getEventPath(context, data);
            })
            .then(function(context) {
                return new Promise(function(resolved) {
                    context.result = data.eventpath
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

    markCrashRank : (req, res, next) => {
        var data = {
            package_name : req.params.packageName,
            crash_id : req.params.crashId,
            crash_rank : req.body.crash_rank,
            filter : require('./filter').setFilter(req.query)
        };

        switch(req.body.crash_rank) {
            case 'major' : 
            case 'minor' :
            case 'unhandle' :
                data.crash_rank = req.body.crash_rank;
                break;
            default:
                var error = new Error();
                error.status = 400;
                return next(error);
        }

        mysqlSetting.getWritePool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return CrashModel.setMarkCrash(context, data);
            })
            .then(mysqlSetting.commitTransaction)
            .then(function(data) {
                res.statusCode = 200;
                return res.json({
                    msg : 'Crash rank marked'
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

    getCrashRankRate : (req, res, next) => {
        var data = {
            package_name : req.params.packageName,
            filter : require('./filter').setFilter(req.query)
        };

        mysqlSetting.getReadPool()
            .then(mysqlSetting.getConnection)
            .then(mysqlSetting.connBeginTransaction)
            .then(function(context) {
                return CrashModel.getRankRate(context, data);
            })
            .then((context) => {
                return new Promise((resolved) => {
                    context.result = data.crashRank;
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