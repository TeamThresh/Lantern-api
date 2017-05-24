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

        ResourceMongoModel.resAppMongoModel(data)
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

        ResourceMongoModel.resOSMongoModel(data)
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

        ResourceMongoModel.resMemoryMongoModel(data)
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

        ResourceMongoModel.resVmstatMongoModel(data)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return next(err);
            });
    },
};