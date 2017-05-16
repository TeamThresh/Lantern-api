/**
 * Created by YS on 2017-04-14.
 */

var authModel = {
    checkUserName : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.username];
            var sql = `SELECT admin_username
            	FROM admin_table 
            	WHERE admin_username = ? `;

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                } else if (rows.length > 0) {
                	// TODO 아무것도 없는 경우
                    var error = new Error("exist user");
                    error.status = 9401;
                    context.connection.rollback();
                    return rejected(error);
	            }
	            
            	return resolved(context);
            });
        });
    },

    createUser : function(context, data) {
    	return new Promise(function(resolved, rejected) {
    		var insert = [data.username, data.password];
    		var sql = `INSERT INTO admin_table SET
    			admin_username = ?,
    			admin_password = ? `;

			context.connection.query(sql, insert, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                }

                return resolved(context);
            });
    	})
    },

    checkUser : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var select = [data.username];
            var sql = `SELECT admin_user_id, admin_username, admin_password
            	FROM admin_table 
            	WHERE admin_username = ? `;

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                } else if (rows.length == 0) {
                	// 아무것도 없는 경우
                    var error = new Error("login failed");
                    error.status = 403;
                    context.connection.rollback();
                    return rejected(error);
	            }
	            
	            context.user = {
	            	user_id : rows[0].admin_user_id,
	            	username : rows[0].admin_username,
	            	password : rows[0].admin_password
	            };

            	return resolved(context);
            });
        });
    },

    login : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var update = [new Date().toISOString(), context.result, data.user_id];
            var sql = `UPDATE admin_table SET 
            	last_login = ?,
            	admin_token = ?
            	WHERE admin_user_id = ? `;

            context.connection.query(sql, update, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                } else if (rows.length == 0) {
                	// 아무것도 없는 경우
                    var error = new Error("login failed");
                    error.status = 403;
                    context.connection.rollback();
                    return rejected(error);
	            }

            	return resolved(context);
            });
        });
    },

    addAuthToProject : function(context, data) {
    	return new Promise(function(resolved, rejected) {
    		var insert = [data.user_id, data.package_name, data.level, data.level];
    		var sql = `INSERT INTO admin_package_table SET
    			ap_admin_id = ?, 
    			ap_package_name = ?, 
    			ap_level = ? 
    			ON DUPLICATE KEY UPDATE 
    			ap_level = ? `;

			context.connection.query(sql, insert, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                }

                return resolved(context);
            });
    	})
    },

    checkProject : function(context, data) {
    	return new Promise(function(resolved, rejected) {
    		var select = [data.user_id, data.package_name];
    		var sql = `SELECT ap_package_name, ap_level 
    			FROM admin_package_table 
    			WHERE ap_admin_id = ? 
    			AND ap_package_name = ?`;

			context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                } else if (rows.length == 0) {
                	var error = new Error("no data");
                    error.status = 403;
                    context.connection.rollback();
                    return rejected(error);
                }

                context.result = rows[0].ap_level
                return resolved(context);
            });
    	})
    },

    verify : function(context, origin, target) {
    	return new Promise(function(resolved, rejected) {
    		if (origin !== target) {
	    		var error = new Error('Login failed');
				error.status = 403;
				context.connection.rollback();
			    return rejected(error);
	    	}

	    	return resolved(context);
    	});
    },

    verifyToken : function(context, data, token) {
    	return new Promise(function(resolved, rejected) {
            var select = [data.user_id, token];
            var sql = `SELECT admin_user_id 
            	FROM admin_table 
            	WHERE admin_user_id = ? 
            	AND admin_token = ? `;

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                } else if (rows.length == 0) {
                	// 아무것도 없는 경우
                    var error = new Error("login failed");
                    error.status = 403;
                    context.connection.rollback();
                    return rejected(error);
	            }

            	return resolved(context);
            });
        });
    }
};

module.exports = authModel;