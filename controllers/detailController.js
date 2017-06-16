/**
 * Created by YS on 2017-05-11.
 */

var credentials = require('../credentials');
var ResourceMongoModel = require('../models/resourceMongoModel');
var mysqlSetting = require('../models/mysqlSetting');
var CrashModel = require('../models/crashModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {
    getResourceAppByActivity : function(req, res, next) {
        if (!isNaN(req.params.activityName)) {
            req.query.crashId = req.params.activityName;
            crash_id = req.query.crashId;
            req.params.activityName = undefined;
        } 

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            crash_id : req.query.crashId,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };

        return new Promise((resolved, rejected) => {
            if (data.crash_id) {
                mysqlSetting.getReadPool()
                    .then(mysqlSetting.getConnection)
                    .then((context) => {
                        return CrashModel.getCrashInfo(context, data);
                    })
                    .then(mysqlSetting.releaseConnection)
                    .then(() => {
                        data.filter.crash_stacktrace = data.crashInfo.crash_stacktrace;
                        return resolved(data);
                    })
                    .catch((err) => {
                        if (err.context) {
                            mysqlSetting.releaseConnection(err.context)
                                .then(function() {
                                    return next(err.error);
                                });
                        } else {
                            next(err);
                            throw err;
                        }
                    });
            } else {
                return resolved(data);
            }
            })
            .then(ResourceMongoModel.resAppRawMongoModel)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getResourceOSByActivity : function(req, res, next) {
        if (!isNaN(req.params.activityName)) {
            req.query.crashId = req.params.activityName;
            crash_id = req.query.crashId;
            req.params.activityName = undefined;
        } 

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            crash_id : req.query.crashId,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };

        return new Promise((resolved, rejected) => {
            if (data.crash_id) {
                mysqlSetting.getReadPool()
                    .then(mysqlSetting.getConnection)
                    .then((context) => {
                        return CrashModel.getCrashInfo(context, data);
                    })
                    .then(mysqlSetting.releaseConnection)
                    .then(() => {
                        data.filter.crash_stacktrace = data.crashInfo.crash_stacktrace;
                        return resolved(data);
                    })
                    .catch((err) => {
                        if (err.context) {
                            mysqlSetting.releaseConnection(err.context)
                                .then(function() {
                                    return next(err.error);
                                });
                        } else {
                            next(err);
                            throw err;
                        }
                    });
            } else {
                return resolved(data);
            }
            })
            .then(ResourceMongoModel.resOSRawMongoModel)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getResourceMemoryByActivity : function(req, res, next) {
        if (!isNaN(req.params.activityName)) {
            req.query.crashId = req.params.activityName;
            crash_id = req.query.crashId;
            req.params.activityName = undefined;
        } 

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            crash_id : req.query.crashId,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };

        return new Promise((resolved, rejected) => {
            if (data.crash_id) {
                mysqlSetting.getReadPool()
                    .then(mysqlSetting.getConnection)
                    .then((context) => {
                        return CrashModel.getCrashInfo(context, data);
                    })
                    .then(mysqlSetting.releaseConnection)
                    .then(() => {
                        data.filter.crash_stacktrace = data.crashInfo.crash_stacktrace;
                        return resolved(data);
                    })
                    .catch((err) => {
                        if (err.context) {
                            mysqlSetting.releaseConnection(err.context)
                                .then(function() {
                                    return next(err.error);
                                });
                        } else {
                            next(err);
                            throw err;
                        }
                    });
            } else {
                return resolved(data);
            }
            })
            .then(ResourceMongoModel.resMemoryRawMongoModel)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },
    
    getResourceVmstatByActivity : function(req, res, next) {
        if (!isNaN(req.params.activityName)) {
            req.query.crashId = req.params.activityName;
            crash_id = req.query.crashId;
            req.params.activityName = undefined;
        } 

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            crash_id : req.query.crashId,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)	
        };

        return new Promise((resolved, rejected) => {
            if (data.crash_id) {
                mysqlSetting.getReadPool()
                    .then(mysqlSetting.getConnection)
                    .then((context) => {
                        return CrashModel.getCrashInfo(context, data);
                    })
                    .then(mysqlSetting.releaseConnection)
                    .then(() => {
                        data.filter.crash_stacktrace = data.crashInfo.crash_stacktrace;
                        return resolved(data);
                    })
                    .catch((err) => {
                        if (err.context) {
                            mysqlSetting.releaseConnection(err.context)
                                .then(function() {
                                    return next(err.error);
                                });
                        } else {
                            next(err);
                            throw err;
                        }
                    });
            } else {
                return resolved(data);
            }
            })
            .then(ResourceMongoModel.resVmstatRawMongoModel)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getResourceDetailByActivity : function(req, res, next) {
        if (!isNaN(req.params.activityName)) {
            req.query.crashId = req.params.activityName;
            req.params.activityName = undefined;
        } 

        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            crash_id : req.query.crashId,
            type : req.params.type,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };
        
        return new Promise((resolved, rejected) => {
            if (data.crash_id) {
                mysqlSetting.getReadPool()
                    .then(mysqlSetting.getConnection)
                    .then((context) => {
                        return CrashModel.getCrashInfo(context, data);
                    })
                    .then(mysqlSetting.releaseConnection)
                    .then(() => {
                        data.filter.crash_stacktrace = data.crashInfo.crash_stacktrace;
                        return resolved();
                    })
                    .catch((err) => {
                        if (err.context) {
                            mysqlSetting.releaseConnection(err.context)
                                .then(function() {
                                    return next(err.error);
                                });
                        } else {
                            next(err);
                            throw err;
                        }
                    });
            } else {
                return resolved();
            }
        })
        .then(() => {
            return new Promise((resolved, rejected) => {
                switch (data.type) {
                    case "stat":
                        return ResourceMongoModel.resOSDetailMongoModel(data)
                            .then(resolved)
                            .catch(rejected);
                        break;
                    case "pstat":
                        return ResourceMongoModel.resAppDetailMongoModel(data)
                            .then(resolved)
                            .catch(rejected);
                        break;
                    case "vmstat":
                        return ResourceMongoModel.resVmstatDetailMongoModel(data)
                            .then(resolved)
                            .catch(rejected);
                        break;
                    case "memory":
                        return ResourceMongoModel.resMemoryDetailMongoModel(data)
                            .then(resolved)
                            .catch(rejected);
                        break;
                    default:
                        var error = new Error("no route");
                        error.status = 404;
                        return rejected(error);

                }
            });
        })
        .then(function(result) {
            res.statusCode = 200;
            return res.json(result);
        })
        .catch(function(err) {
            return next(err);
        });
            
    },
};