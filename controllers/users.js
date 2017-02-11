/**
 * Created by YS on 2017-01-31.
 */
var userModel = require('../models/userModel');

/**
 *
 * @type {{
 *  regUsers: module.exports.regUsers
 * }}
 */
module.exports = {

    regUsers: function (req, res, next) {
        var data = {
            access_token: req.header('access-token'),
            username: req.body.username,
            user_id: req.body.user_id
        };

        facebook.checkToken(data)
            .then(function(result) {
                return userModel.regUser(data.access_token, result.username, result.user_id)
            })
            .then(function(result) {
                res.statusCode = 200;
                res.json({
                    msg: "Registration complete",
                    user_id: result
                });
            })
            .catch(next);
    }
};