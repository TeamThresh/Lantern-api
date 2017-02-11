/**
 * Created by YS on 2016-11-05.
 */
var credentials = require('../../credentials');
var mysqlSetting = require('./mysqlSetting');

var userModel = {
    regUser : function(access_token, username, user_id) {
        return new Promise(function(resolved, rejected) {
            mysqlSetting.getPool()
                .then(mysqlSetting.getConnection)
                .then(mysqlSetting.connBeginTransaction)
                .then(function(context) {
                    return new Promise(function(resolved, rejected) {
                        var insert = [access_token, username, user_id, access_token, username];
                        var sql = "INSERT INTO users SET " +
                            "access_token = ?, " +
                            "username = ?," +
                            "user_id = ? " +
                            "ON DUPLICATE KEY UPDATE " +
                            "access_token = ?, " +
                            "username = ?";
                        context.connection.query(sql, insert, function (err, rows) {
                            if (err) {
                                var error = new Error("Failed user registration");
                                error.status = 500;
                                console.error(err);
                                context.connection.rollback();
                                mysqlSetting.releaseConnection(context);
                                return rejected(error);
                            }

                            if (rows.insertId == 0)
                                context.result = user_id;
                            else
                                context.result = rows.insertId;
                            return resolved(context);
                        });
                    });
                })
                .then(mysqlSetting.commitTransaction)
                .then(function(data) {
                    return resolved(data);
                })
                .catch(function(err) {
                    return rejected(err);
                });
        });
    }
};

module.exports = userModel;