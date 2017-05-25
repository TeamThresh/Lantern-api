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
                    return rejected({ context : context, error : error });
                } else if (rows.length > 0) {
                	// TODO 아무것도 없는 경우
                    var error = new Error("exist user");
                    error.status = 8401;
                    return rejected({ context : context, error : error });
	            }
	            
            	return resolved(context);
            });
        });
    },

    createUser : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var insert = [data.username, data.nickname, data.password];
            var sql = `INSERT INTO admin_table SET
                admin_username = ?,
                nickname = ?,
                admin_password = ? `;


			context.connection.query(sql, insert, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                }

                return resolved(context);
            });
    	})
    },

    checkUser : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var select = [data.username];
            var sql = `SELECT admin_user_id, admin_username, nickname, admin_password
            	FROM admin_table 
            	WHERE admin_username = ? `;

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                	// 아무것도 없는 경우
                    var error = new Error("login failed");
                    error.status = 403;
                    return rejected({ context : context, error : error });
	            }
	            
	            data.user = {
	            	user_id : rows[0].admin_user_id,
	            	username : rows[0].admin_username,
	            	nickname : rows[0].nickname,
	            	password : rows[0].admin_password
	            };

            	return resolved(context);
            });
        });
    },

    login : function(context, data) {
    	return new Promise(function(resolved, rejected) {
    		var format = require('date-format');
            var update = [format('yyyy-MM-dd hh:mm:00', new Date()), data.token, 
            	format('yyyy-MM-dd hh:mm:00', new Date(data.expired)), data.user.user_id];
            var sql = `UPDATE admin_table SET 
            	last_login = ?,
            	admin_token = ?,
            	expired = ?
            	WHERE admin_user_id = ? `;

            context.connection.query(sql, update, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                	// 아무것도 없는 경우
                    var error = new Error("login failed");
                    error.status = 403;
                    return rejected({ context : context, error : error });
	            }

            	return resolved(context);
            });
        });
    },

    getToken : function(context, data) {
    	return new Promise(function(resolved, rejected) {
    		var select = [data.user_id];
    		var sql = `SELECT admin_token, last_login, expired 
    			FROM admin_table 
    			WHERE admin_user_id `;

			context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
					var error = new Error("Not Authorized");
                    error.status = 400;
                    return rejected({ context : context, error : error });
                }

                if (rows[0].expired == null 
                || new Date(rows[0].expired).getTime() < Date.now()) {
                	data.isExpired = true;
                } else {
                	data.token = rows[0].admin_token;
                	data.expired = rows[0].expired;
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
                    return rejected({ context : context, error : error });
                }

                return resolved(context);
            });
    	})
    },

    removeMember : function(context, data) {
    	return new Promise(function(resolved, rejected) {
    		var insert = [data.user_id, data.package_name];
    		var sql = `DELETE admin_package_table 
    			WHERE ap_admin_id = ?
    			AND ap_package_name = ? `;

			context.connection.query(sql, insert, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                } else if (rows.affectedRows == 0) {
                	var error = new Error("Not Authorized");
                    error.status = 403;
                    return rejected({ context : context, error : error });
                }

                return resolved(context);
            });
    	})
    },

    checkLevel : function(context, data) {
    	return new Promise(function(resolved, rejected) {
    		var select = [data.member_name, data.package_name];
    		var sql = `SELECT admin_id, ap_level 
    			FROM admin_package_table 
    			INNER JOIN admin_table ON admin_id = ap_admin_id
    			WHERE admin_username = ? 
    			AND ap_package_name = ?`;

			context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                    // TODO 아무것도 없는 경우
                    var error = new Error("No data");
                    error.status = 9404;
                    return rejected({ context : context, error : error });
                }

                switch(rows[0].ap_level) {
                	case 'owner':
                		var error = new Error(err);
	                    error.status = 500;
	                    return rejected({ context : context, error : error });
                    case 'admin':
                    	if (data.project_level != 'owner') {
                    		var error = new Error(err);
		                    error.status = 500;
		                    return rejected({ context : context, error : error });
                    	}
                    default : // member
                    	data.checked_user = {
                    		user_id : rows[0].admin_id,
                    		level : rows[0].ap_level
                    	};
                    	return resolved(context);
                }
            });
    	})
    },

    removeProject : function(context, data) {
    	return new Promise(function(resolved, rejected) {
    		var insert = [data.user_id, data.package_name];
    		var sql = `DELETE FROM admin_package_table 
    			WHERE ap_admin_id = ?
    			AND ap_package_name = ? `;

			context.connection.query(sql, insert, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                } else if (rows.affectedRows == 0) {
                	var error = new Error("Not Authorized");
                    error.status = 403;
                    return rejected({ context : context, error : error });
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
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                	var error = new Error("no data");
                    error.status = 403;
                    return rejected({ context : context, error : error });
                }

                data.project_level = rows[0].ap_level
                return resolved(context);
            });
    	})
    },

    verify : function(context, origin, target) {
    	return new Promise(function(resolved, rejected) {
    		if (origin !== target) {
	    		var error = new Error('Login failed');
				error.status = 403;
				return rejected({ context : context, error : error });
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
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                	// 아무것도 없는 경우
                    var error = new Error("login failed");
                    error.status = 403;
                    return rejected({ context : context, error : error });
	            }

            	return resolved(context);
            });
        });
    }
};

module.exports = authModel;