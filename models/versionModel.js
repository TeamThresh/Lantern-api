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
                if (data.filter.dateRange != undefined) {
                    sql += "AND collect_time BETWEEN ? AND ? ";
                    select.push(data.filter.dateRange.start, data.filter.dateRange.end);
                }

                if (data.filter.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.filter.location);
                }
                if (data.filter.device != undefined) {
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.filter.device);
                }
                if (data.filter.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.filter.os);
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
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.filter.activity_name);
                }

                if (data.filter.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
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
            var select = [data.activity_name, data.ver_key];
            var sql = "SELECT DISTINCT act_id " +
            	"FROM activity_table " +
            	"WHERE `activity_name` = ? "+
            	"AND `act_ver_id` IN (?) ";

            if (data.filter != undefined) {
                if (data.filter.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.filter.activity_name);
                }

                if (data.filter.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
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

    /**
     * Deprecated
     */
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
            var select = [data.ver_key];
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
                "WHERE `act_ver_id` IN (?) ";

            if (data.filter != undefined) {
                if (data.filter.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.filter.activity_name);
                }

                if (data.filter.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
                    select.push(data.filter.nactivity_name);
                }
            }

            sql += "GROUP BY `act_t`.`activity_name`";

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
                    "WHERE version_table.package_name = ? ";
                    
            if (data.filter != undefined) {
                if (data.filter.dateRange != undefined) {
                    sql += "AND collect_time BETWEEN ? AND ? ";
                    select.push(data.filter.dateRange.start, data.filter.dateRange.end);
                }

                if (data.filter.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.filter.location);
                }
                if (data.filter.device != undefined) {
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.filter.device);
                }
                if (data.filter.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.filter.os);
                }
                if (data.filter.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.filter.activity_name);
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
                if (data.filter.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
                    select.push(data.filter.nactivity_name);
                }
            }

            sql += "GROUP BY version_table.os_ver, version_table.device_name " +
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
                "WHERE `package_name` = ? ";

            if (data.selector != undefined) {
                if (data.selector.dateRange != undefined) {
                    sql += "AND collect_time BETWEEN ? AND ? ";
                    select.push(data.selector.dateRange.start, data.selector.dateRange.end);
                }

                if (data.selector.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.selector.location);
                }
                if (data.selector.device != undefined) {
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.selector.device);
                }
                if (data.selector.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.selector.os);
                }
                if (data.selector.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.selector.activity_name);
                }

                if (data.selector.nlocation != undefined) {
                    sql += "AND `location_code` NOT IN (?) ";
                    select.push(data.selector.nlocation);
                }
                if (data.selector.ndevice != undefined) {
                    sql += "AND `device_name` NOT IN (?) ";
                    select.push(data.selector.ndevice);
                }
                if (data.selector.nos != undefined) {
                    sql += "AND `os_ver` NOT IN (?) ";
                    select.push(data.selector.nos);
                }
                if (data.selector.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
                    select.push(data.selector.nactivity_name);
                }
            }

            sql += "GROUP BY location_code " +
                "ORDER BY usage_count ";

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
                
                data.location_usage = [];
                rows.forEach(function(row) {
                    let usage = {
                        locationCode : row.location_code,
                        usageCount : row.usage_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0
                    }

                    data.location_usage.push(usage);
                });

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
                "WHERE `package_name` = ? ";

            if (data.selector != undefined) {
                if (data.selector.dateRange != undefined) {
                    sql += "AND collect_time BETWEEN ? AND ? ";
                    select.push(data.selector.dateRange.start, data.selector.dateRange.end);
                }

                if (data.selector.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.selector.location);
                }
                if (data.selector.device != undefined) {
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.selector.device);
                }
                if (data.selector.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.selector.os);
                }
                if (data.selector.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.selector.activity_name);
                }

                if (data.selector.nlocation != undefined) {
                    sql += "AND `location_code` NOT IN (?) ";
                    select.push(data.selector.nlocation);
                }
                if (data.selector.ndevice != undefined) {
                    sql += "AND `device_name` NOT IN (?) ";
                    select.push(data.selector.ndevice);
                }
                if (data.selector.nos != undefined) {
                    sql += "AND `os_ver` NOT IN (?) ";
                    select.push(data.selector.nos);
                }
                if (data.selector.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
                    select.push(data.selector.nactivity_name);
                }
            }

            sql += "GROUP BY device_name " +
                "ORDER BY usage_count ";

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
                
                data.device_usage = [];
                rows.forEach(function(row) {
                    let usage = {
                        deviceName : row.device_name,
                        usageCount : row.usage_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0
                    }

                    data.device_usage.push(usage);
                });

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
                "WHERE `package_name` = ? ";

            if (data.selector != undefined) {
                if (data.selector.dateRange != undefined) {
                    sql += "AND collect_time BETWEEN ? AND ? ";
                    select.push(data.selector.dateRange.start, data.selector.dateRange.end);
                }

                if (data.selector.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.selector.location);
                }
                if (data.selector.device != undefined) {
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.selector.device);
                }
                if (data.selector.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.selector.os);
                }
                if (data.selector.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.selector.activity_name);
                }

                if (data.selector.nlocation != undefined) {
                    sql += "AND `location_code` NOT IN (?) ";
                    select.push(data.selector.nlocation);
                }
                if (data.selector.ndevice != undefined) {
                    sql += "AND `device_name` NOT IN (?) ";
                    select.push(data.selector.ndevice);
                }
                if (data.selector.nos != undefined) {
                    sql += "AND `os_ver` NOT IN (?) ";
                    select.push(data.selector.nos);
                }
                if (data.selector.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
                    select.push(data.selector.nactivity_name);
                }
            }

            sql += "GROUP BY os_ver " +
                "ORDER BY usage_count ";

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
                
                data.os_usage = [];
                rows.forEach(function(row) {
                    let usage = {
                        osVersion : row.os_ver,
                        usageCount : row.usage_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0
                    }

                    data.os_usage.push(usage);
                });

                return resolved(context);
            });
        });
    },

    getActivityUsage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            let select = [data.package_name];
            let sql = "SELECT DISTINCT activity_name, SUM(user_count) AS usage_count, " +
                "SUM(crash_count) as crash_count " +
                "FROM version_table " +
                "JOIN activity_table " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "WHERE `package_name` = ? ";
                
            if (data.selector != undefined) {
                if (data.selector.dateRange != undefined) {
                    sql += "AND collect_time BETWEEN ? AND ? ";
                    select.push(data.selector.dateRange.start, data.selector.dateRange.end);
                }

                if (data.selector.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.selector.location);
                }
                if (data.selector.device != undefined) {
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.selector.device);
                }
                if (data.selector.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.selector.os);
                }
                if (data.selector.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.selector.activity_name);
                }

                if (data.selector.nlocation != undefined) {
                    sql += "AND `location_code` NOT IN (?) ";
                    select.push(data.selector.nlocation);
                }
                if (data.selector.ndevice != undefined) {
                    sql += "AND `device_name` NOT IN (?) ";
                    select.push(data.selector.ndevice);
                }
                if (data.selector.nos != undefined) {
                    sql += "AND `os_ver` NOT IN (?) ";
                    select.push(data.selector.nos);
                }
                if (data.selector.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
                    select.push(data.selector.nactivity_name);
                }
            }

            sql += "GROUP BY activity_name " +
                "ORDER BY usage_count ";

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
                
                data.activity_usage = [];
                rows.forEach(function(row) {
                    let usage = {
                        activityName : row.activity_name,
                        usageCount : row.usage_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0
                    }

                    data.activity_usage.push(usage);
                });

                return resolved(context);
            });
        });
    },

    getUserConnection : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = "SELECT SUM(user_count) AS connection, SUM(user_retention_count) AS retention, collect_time " +
                "FROM activity_table " +
                "INNER JOIN version_table " +
                "ON act_ver_id = ver_id " +
                "WHERE `package_name` = ? ";

            if (data.filter != undefined) {
                if (data.filter.dateRange != undefined) {
                    sql += "AND collect_time BETWEEN ? AND ? ";
                    select.push(data.filter.dateRange.start, data.filter.dateRange.end);
                }


                if (data.filter.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.filter.location);
                }
                if (data.filter.device != undefined) {
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.filter.device);
                }
                if (data.filter.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.filter.os);
                }
                if (data.filter.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.filter.activity_name);
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
                if (data.filter.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
                    select.push(data.filter.nactivity_name);
                }
            }

            sql += "GROUP BY collect_time " +
                "ORDER BY collect_time ASC";

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
                
                data.user_connection = [];
                rows.forEach(function(row) {
                    data.user_connection.push({
                        connection : row.connection, 
                        retention : row.retention,
                        collect_time : new Date(row.collect_time).getTime()
                    })
                });

                return resolved(context);
            });
        });
    },

    getVersionInRange : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name, 
                data.filter.dateRange.start, data.filter.dateRange.end,
                data.filter.usageRange.start, data.filter.usageRange.end];
            var sql = "SELECT uuid, cpu_raw_time, collect_time, device_name, " +
                "os_ver, location_code, cpu_raw_rate, cpu_raw_count " +
                "FROM cpu_raw_table " +
                "INNER JOIN activity_table ON craw_act_id = act_id " +
                "INNER JOIN version_table ON act_ver_id = ver_id " +
                "LEFT JOIN user_table ON ver_id = user_ver_id " +
                "WHERE package_name = ? "
                "AND cpu_raw_time BETWEEN ? AND ? " +
                "AND cpu_raw_rate/cpu_raw_count BETWEEN ? AND ? ";

            if (data.filter != undefined) {
                if (data.filter.dateRange != undefined) {
                    sql += "AND collect_time BETWEEN ? AND ? ";
                    select.push(data.filter.dateRange.start, data.filter.dateRange.end);
                }


                if (data.filter.location != undefined) {
                    sql += "AND `location_code` IN (?) ";
                    select.push(data.filter.location);
                }
                if (data.filter.device != undefined) {
                    sql += "AND `device_name` IN (?) ";
                    select.push(data.filter.device);
                }
                if (data.filter.os != undefined) {
                    sql += "AND `os_ver` IN (?) ";
                    select.push(data.filter.os);
                }
                if (data.filter.activity_name != undefined) {
                    sql += "AND `activity_name` IN (?) ";
                    select.push(data.filter.activity_name);
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
                if (data.filter.nactivity_name != undefined) {
                    sql += "AND `activity_name` NOT IN (?) ";
                    select.push(data.filter.nactivity_name);
                }
            }

            sql += "ORDER BY cpu_raw_time ASC";

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

                data.user_list = [];
                rows.forEach(function(row) {
                    data.user_list.push({
                        uuid : row.uuid, 
                        device : row.device_name,
                        os : row.os_ver,
                        location : row.location_code,
                        usage_rate : row.cpu_raw_rate,
                        usage_count : row.cpu_raw_count,
                        time : cpu_raw_time
                    })
                });

                return resolved(context);
            });
        });
    }
};

module.exports = versionModel;