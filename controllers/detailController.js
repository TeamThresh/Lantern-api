/**
 * Created by YS on 2017-05-11.
 */

var credentials = require('../credentials');
var ResourceMongoModel = require('../models/resourceMongoModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {
    getResourceAppByActivity : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };

        ResourceMongoModel.resAppRawMongoModel(data)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getResourceOSByActivity : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };

        ResourceMongoModel.resOSRawMongoModel(data)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getResourceMemoryByActivity : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };

        ResourceMongoModel.resMemoryRawMongoModel(data)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },
    
    getResourceVmstatByActivity : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)	
        };

        ResourceMongoModel.resVmstatRawMongoModel(data)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },

    getResourceDetailByActivity : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            activity_name : req.params.activityName,
            type : req.params.type,
            filter : require('./filter').setFilter(req.query),
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };


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