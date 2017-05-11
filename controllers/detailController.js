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
    getResourceByUuid : function(req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            package_name : req.params.packageName,
            uuid : req.query.uuid,
            startRange : Number(req.query.startRange),
            endRange : Number(req.query.endRange)
        };

        ResourceMongoModel.resMongoModel(data)
            .then(function(result) {
                res.statusCode = 200;
                return res.json(result);
            })
            .catch(function(err) {
                return res.status(500).json({msg:err});
            })
    }
    
};