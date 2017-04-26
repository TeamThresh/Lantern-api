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
            var sql = "SELECT DISTINCT ver_id " +
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
            var sql = "SELECT DISTINCT act_id " +
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
            var sql = "SELECT DISTINCT act_id " +
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
            var sql = "SELECT DISTINCT activity_name " +
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
    },

    getActNameCrashByVersion : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT act_t.activity_name, SUM(user_count) as user_count, " + 
                "SUM(crash_count) as crash_count " +
                "FROM activity_table as act_t " +
                "LEFT JOIN crash_table as crash_t " +
                "ON `act_t`.`act_id` = `crash_t`.`crash_act_id` " +
                "WHERE `act_ver_id` IN (";
            
            data.ver_key.forEach(function(ver_id, index) {
                sql += ver_id;
                if (index < data.ver_key.length - 1) {
                    sql += ",";
                }
            });
            sql += ") GROUP BY `act_t`.`activity_name`";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    return rejected(err);
                } else if (rows.length == 0) {
                    // TODO 아무것도 없는 경우
                }
                
                data.act_name_list = []
                rows.forEach(function(row) {
                    let temp = {
                        name : row.activity_name,
                        usageCount : row.user_count
                    };

                    if (row.crash_count != null) {
                        temp.crashCount = row.crash_count
                    } else {
                        temp.crashCount = 0
                    }

                    data.act_name_list.push(temp);
                });
                return resolved(context);
            });
        });
    },

    getDeviceByOs : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = "SELECT version_table.os_ver, version_table.device_name, " +
                    "SUM(activity_table.user_count) AS user_count "+
                    "FROM version_table " +
                    "INNER JOIN activity_table " +
                    "ON version_table.ver_id = activity_table.act_ver_id " +
                    "WHERE version_table.package_name = ? " +
                    "GROUP BY version_table.os_ver, version_table.device_name ";

            context.connection.query(sql, select, function (err, rows) {
                if (err) {
                    return rejected(err);
                } else if (rows.length == 0) {
                    // TODO 아무것도 없는 경우
                }
                
                data.device_list = [];
                rows.forEach(function(row, index) {
                    if (data.device_list.length == 0 
                        || rows[index].os_ver != row.os_ver) {
                        data.device_list.push({
                            ver : row.os_ver,
                            device : [{
                                name : row.device_name,
                                count : row.user_count
                            }]
                        });
                    } else {
                        data.device_list[data.device_list.length].device.push({
                            name : row.device_name,
                            count : row.user_count
                        })
                    }
                });

                return resolved(context);
            });
        });
    }
};

module.exports = versionModel;