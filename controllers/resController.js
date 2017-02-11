/**
 * Created by YS on 2017-02-11.
 */

//var resourceModel = require('../models/resourceModel');

/**
 *
 * @type {{
 *  getDashboard: module.exports.getDashboard
 * }}
 */
module.exports = {

    getDashboard : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

    getZview : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

    getNetworkSummary : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

    getNetworkSummary : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

    getRendering : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

    getPerformance : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    },

    getPerformanceList : function (req, res, next) {
        var data = {
            access_token: req.header('access-token')
        };

        res.statusCode = 200;
        return res.json({
            msg: "complete"
        });
    }
};