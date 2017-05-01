/**
 * Created by YS on 2017-04-14.
 */

var crashModel = {
    getCrashList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT crash_name, first_time, crash_location, crash_stacktrace " +
            	"FROM crash_table " +
        		"WHERE `crash_act_id` IN (";
            	
            data.act_id_list.forEach(function(act_id, index) {
            	sql += act_id;
            	if (index < data.act_id_list.length - 1) {
            		sql += ",";
            	}
            });
            sql += ")";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
                    var error = new Error("No data");
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
	            }
	            
	            data.crashList = [];
	            rows.forEach(function(row) {
	            	var crashData = {
	            		name : row.crash_name,
	            		timestamp : row.first_time,
	            		topActivity : row.crash_location,
	            		stacktrace : row.crash_stacktrace
	            	};
	            	data.crashList.push(crashData);
	            });
	            
            	return resolved(context);
            });
        });
    },

    getCrashCount : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT SUM(crash_count) AS crash_count " +
            	"FROM crash_table " +
        		"WHERE `crash_act_id` IN (";
            	
            data.act_id_list.forEach(function(act_id, index) {
            	sql += act_id;
            	if (index < data.act_id_list.length - 1) {
            		sql += ",";
            	}
            });
            sql += ")";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
                    var error = new Error("No data");
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
	            }
	            
	            data.crashCount = rows[0].crash_count;
	            
            	return resolved(context);
            });
        });
    },

    getCrashNameWithCount : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = "SELECT SUM(crash_count) AS count, crash_name " +
                "FROM crash_table " +
                "INNER JOIN activity_table ON crash_act_id = act_id " +
                "INNER JOIN version_table ON act_ver_id = ver_id " +
                "WHERE package_name = ? ";
                
            if (data.filter != undefined) {
                if (data.filter.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.filter.location);
                }
                if (data.filter.device != undefined) {
                    console.log("디바이스")
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.filter.device);
                }
                if (data.filter.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.filter.os);
                    console.log(data.filter);
                }

                if (data.filter.nlocation != undefined) {
                    sql += "AND `location_code` NOT IN (?) ";
                    select.push(data.filter.nlocation);
                }
                if (data.filter.ndevice != undefined) {
                    sql += "AND `device_name` NOT IN (?) ";
                    select.push(data.filter.ndevice);
                }
                if (data.filter.nos != undefined) {
                    sql += "AND `os_ver` NOT IN (?) ";
                    select.push(data.filter.nos);
                }
            }
            sql += "GROUP BY crash_name " +
                "ORDER BY count";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                } else if (rows.length == 0) {
                    // TODO 아무것도 없는 경우
                    var error = new Error("No data");
                    error.status = 500;
                    context.connection.rollback();
                    return rejected(error);
                }
                
                data.crashList = rows;
                
                return resolved(context);
            });
        });
    }
};

module.exports = crashModel;