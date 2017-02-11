/**
 * Created by YS on 2017-02-11.
 */

//var resourceModel = require('../models/resourceModel');

/**
 *
 * @type {{
 *  upload: module.exports.upload
 * }}
 */
module.exports = {

    getLocation : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

	getList : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

	selectListItem : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

	getVersion : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    }
};