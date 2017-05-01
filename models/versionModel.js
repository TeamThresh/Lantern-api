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
        	sql += data.ver_key.toString();
            sql += ") ";
            if (data.filter != undefined) {
                if (data.filter.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?)";
                    select.push(data.filter.activity_name);
                }

                if (data.filter.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?)";
                    select.push(data.filter.nactivity_name);
                }
            }

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
        	
            sql += data.ver_key.toString();
            sql += ") ";
console.log(sql);
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
        	
            sql += data.ver_key.toString();
            sql += ") ";

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
                "SUM(crash_count) as crash_count, SUM(obc_t.host_status > 300) as status_count, " +
                "SUM(c_t.cpu_sum) / SUM(c_t.cpu_count) as cpu_count, " +
                "SUM(m_t.mem_sum) / SUM(m_t.mem_count) as mem_count " +
                "FROM activity_table as act_t " +
                "LEFT JOIN cpu_table as c_t " +
                "ON act_t.act_id = c_t.cpu_act_id " +
                "LEFT JOIN memory_table as m_t " +
                "ON act_t.act_id = m_t.mem_act_id " +
                "LEFT JOIN crash_table as crash_t " +
                "ON `act_t`.`act_id` = `crash_t`.`crash_act_id` " +
                "LEFT JOIN obc_table as obc_t " +
                "ON act_t.act_id = obc_t.host_act_id " +
                "WHERE `act_ver_id` IN (";
            
            sql += data.ver_key.toString();
            sql += ") GROUP BY `act_t`.`activity_name`";

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
                
                data.act_name_list = []
                rows.forEach(function(row) {
                    let temp = {
                        name : row.activity_name,
                        usageCount : row.user_count,
                        cpuUsage : row.cpu_count,
                        memoryUsage : row.mem_count
                    };

                    if (row.crash_count != null) {
                        temp.crashCount = row.crash_count;
                    } else {
                        temp.crashCount = 0;
                    }

                    if (row.status_count != null) {
                        temp.networkCount = row.status_count;
                    } else {
                        temp.networkCount = 0
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
                    "GROUP BY version_table.os_ver, version_table.device_name " +
                    "ORDER BY user_count DESC ";

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
                
                data.device_list = [];
                rows.forEach(function(row, index) {
                    if (data.device_list.length == 0 
                        || rows[index-1].os_ver != row.os_ver) {
                        data.device_list.push({
                            ver : row.os_ver,
                            device : [{
                                name : row.device_name,
                                count : row.user_count
                            }]
                        });
                    } else {
                        data.device_list[data.device_list.length-1].device.push({
                            name : row.device_name,
                            count : row.user_count
                        })
                    }
                });

                return resolved(context);
            });
        });
    },

    getAllVersionUsage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            let select = [data.package_name];
            let sql = "SELECT DISTINCT device_name, os_ver, location_code, " +
                "activity_name, SUM(user_count) AS user_count " +
                "FROM version_table " +
                "JOIN activity_table " +
                "ON ver_id = act_ver_id " +
                "WHERE `package_name` = ? " +
                "GROUP BY device_name, os_ver, location_code, activity_name";

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
                
                data.all_version = [];
                rows.forEach(function(row) {
                    let version = {
                        deviceName : row.device_name,
                        osVersion : row.os_ver,
                        location : row.location_code,
                        activiyName : row.activity_name,
                        usage : row.user_count
                    }

                    data.all_version.push(version);
                });

                return resolved(context);
            });
        });
    },

    getLocationUsage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            let select = [data.package_name];
            let sql = "SELECT DISTINCT location_code, SUM(user_count) AS usage_count, " +
                "SUM(crash_count) as crash_count " +
                "FROM version_table " +
                "JOIN activity_table " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "WHERE `package_name` = ? " +
                "GROUP BY location_code";

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
                
                data.location_usage = rows;

                return resolved(context);
            });
        });
    },

    getDeviceUsage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            let select = [data.package_name, data.selector.location];
            let sql = "SELECT DISTINCT device_name, SUM(user_count) AS usage_count, " +
                "SUM(crash_count) as crash_count " +
                "FROM version_table " +
                "JOIN activity_table " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "WHERE `package_name` = ? " +
                "AND `location_code` IN (?) " +
                "GROUP BY device_name";

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
                
                data.device_usage = rows;

                return resolved(context);
            });
        });
    },

    getOsUsage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            let select = [data.package_name, data.selector.location, 
                data.selector.device];
            let sql = "SELECT DISTINCT os_ver, SUM(user_count) AS usage_count, " +
                "SUM(crash_count) as crash_count " +
                "FROM version_table " +
                "JOIN activity_table " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "WHERE `package_name` = ? " +
                "AND `location_code` IN (?) " +
                "AND `device_name` IN (?) " +
                "GROUP BY os_ver";

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
                
                data.os_usage = rows;

                return resolved(context);
            });
        });
    },

    getActivityUsage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            let select = [data.package_name, data.selector.location, 
                data.selector.device, data.selector.os];
            let sql = "SELECT DISTINCT activity_name, SUM(user_count) AS usage_count, " +
                "SUM(crash_count) as crash_count " +
                "FROM version_table " +
                "JOIN activity_table " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "WHERE `package_name` = ? " +
                "AND `location_code` IN (?) " +
                "AND `device_name` IN (?) " +
                "AND `os_ver` IN (?) " +
                "GROUP BY activity_name ";

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
                
                data.activity_usage = rows;

                return resolved(context);
            });
        });
    },
};

module.exports = versionModel;