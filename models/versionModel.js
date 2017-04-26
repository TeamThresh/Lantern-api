/**
 * Created by YS on 2016-11-05.
 */

var versionModel = {
    getPackageList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT DISTINCT package_name " +
            	"FROM version_table ";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    return rejected(err);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
	            }
	            
	            context.nameList = [];
	            rows.forEach(function(row) {
	            	context.nameList.push(row.package_name);
	            });
	            //
            	return resolved(context);
            });
        });
    },

    getVersionId : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = "SELECT ver_id " +
            	"FROM version_table " +
            	"WHERE `package_name` = ? ";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    return rejected(err);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
	            }
	            
	            data.ver_key = [];
	            rows.forEach(function(row) {
	            	data.ver_key.push(row.ver_id);
	            });
            	return resolved(context);
            });
        });
    },

    getActivityIdByVersion : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT act_id " +
            	"FROM activity_table " +
            	"WHERE `act_ver_id` IN (";
        	
            data.ver_key.forEach(function(ver_id, index) {
            	sql += ver_id;
            	if (index < data.ver_key.length - 1) {
            		sql += ",";
            	}
            });
            sql += ") ";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    return rejected(err);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
	            }
	            
	            data.act_id_list = []
	            rows.forEach(function(row) {
	            	data.act_id_list.push(row.act_id);
	            });
            	return resolved(context);
            });
        });
    },

    getActivityIdByVersionWithName : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var select = [data.activity_name];
            var sql = "SELECT act_id " +
            	"FROM activity_table " +
            	"WHERE `activity_name` = ? "+
            	"AND `act_ver_id` IN (";
        	
            data.ver_key.forEach(function(ver_id, index) {
            	sql += ver_id;
            	if (index < data.ver_key.length - 1) {
            		sql += ",";
            	}
            });
            sql += ") ";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    return rejected(err);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
	            }
	            
	            data.act_id_list = []
	            rows.forEach(function(row) {
	            	data.act_id_list.push(row.act_id);
	            });
            	return resolved(context);
            });
        });
    },

    getActivityNameByVersion : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT activity_name " +
            	"FROM activity_table " +
            	"WHERE `act_ver_id` IN (";
        	
            data.ver_key.forEach(function(ver_id, index) {
            	sql += ver_id;
            	if (index < data.ver_key.length - 1) {
            		sql += ",";
            	}
            });
            sql += ") ";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    return rejected(err);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
	            }
	            
	            data.act_name_list = []
	            rows.forEach(function(row) {
	            	data.act_name_list.push(row.activity_name);
	            });
            	return resolved(context);
            });
        });
    }

};

module.exports = versionModel;