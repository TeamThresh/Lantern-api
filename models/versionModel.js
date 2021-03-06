/**
 * Created by YS on 2016-11-05.
 */
const filterOption = require('./filterOption');

var versionModel = {
    addPackage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var insert = [data.package_name, data.project_name, data.type, data.project_key];
            var sql = `INSERT INTO package_table SET
                pack_name = ?,
                project_name = ?,
                project_type = ?,
                project_key = ? `;

            context.connection.query(sql, insert, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                }
                
                return resolved(context);
            });
        });
    },

    editPackage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var update = [data.package_name, data.project_name, data.package_name];
            var sql = `UPDATE package_table SET
                pack_name = ?,
                project_name = ? 
                WHERE pack_name = ? `;

            context.connection.query(sql, update, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                }
                
                return resolved(context);
            });
        });
    },

    removePackage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var del = [data.package_name];
            var sql = `DELETE FROM package_table
                WHERE pack_name = ? `;

            context.connection.query(sql, del, function (err, rows) {
                if (err) {
                    var error = new Error(err);
                    error.status = 500;
                    return rejected({ context : context, error : error });
                }
                
                return resolved(context);
            });
        });
    },

    getPackageInfo : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = `SELECT pack_name, project_name, project_type, project_key
                FROM package_table
                WHERE pack_name = ? `;

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
                
                context.packageInfo = rows[0];
                
                return resolved(context);
            });
        });
    },

    getPackageList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.user_id];
            var sql = `SELECT ap_package_name, project_name, project_type, 
                (SELECT app_ver 
                    FROM version_table 
                    WHERE package_name = ap_package_name ORDER BY app_ver DESC LIMIT 1) AS app_ver
                FROM admin_package_table  
                INNER JOIN package_table ON pack_name = ap_package_name
                WHERE ap_admin_id = 1
                GROUP BY ap_package_name, project_name, project_type `;

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
	            
	            context.packageNameList = [];
	            rows.forEach(function(row) {
	            	context.packageNameList.push({
                        package : row.ap_package_name,
                        name : row.project_name,
                        type : row.project_type,
                        app_ver : row.app_ver
                    });
	            });
	            
            	return resolved(context);
            });
        });
    },

    getAppVersionList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = `SELECT DISTINCT app_ver
                FROM version_table  
                WHERE package_name = ? `;

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
                
                context.appVersionList = [];
                rows.forEach(function(row) {
                    context.appVersionList.push(row.app_ver);
                });
                
                return resolved(context);
            });
        });
    },

    getVersionId : function(context, data) {
    	return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = "SELECT DISTINCT ver_id " +
            	"FROM version_table " +
                "INNER JOIN activity_table " +
                "ON ver_id = act_ver_id " +
            	"WHERE `package_name` = ? ";

            sql += filterOption.addFullOption(data.filter, select);

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

            sql += filterOption.addActivityOption(data.filter, select);

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
            var select = [data.package_name];

            var sql = `SELECT DISTINCT act_id 
                FROM activity_table 
                INNER JOIN version_table ON ver_id = act_ver_id `;

            if (data.filter.crashId) {
                sql += `INNER JOIN crash_table ON crash_act_id = act_id `;
            }
            sql += `WHERE package_name = ? `;

            sql += filterOption.addFullOption(data.filter, select);
            sql += filterOption.addCrashOption(data.filter, select);
            
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

	            data.act_id_list = []
	            rows.forEach(function(row) {
	            	data.act_id_list.push(row.act_id);
	            });
            	return resolved(context);
            });
        });
    },

    getActivityIdByType : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var field = {};
            switch (data.resourceType) {
                case 'cpu':
                    field = {
                        table_name : 'cpu_raw_table',
                        res_date : 'cpu_raw_time',
                        res_usage : 'cpu_raw_rate',
                        res_count : 'cpu_raw_count',
                        res_act_id : 'craw_act_id'
                    }
                    break;
                case 'memory':
                    field = {
                        table_name : 'memory_raw_table',
                        res_date : 'mem_raw_time',
                        res_usage : 'mem_raw_rate',
                        res_count : 'mem_raw_count',
                        res_act_id : 'mraw_act_id'
                    }
                    break;
                case 'ui':
                    field = {
                        table_name : 'ui_table',
                        res_date : 'ui_time',
                        res_usage : 'ui_speed',
                        res_count : 'ui_count',
                        res_act_id : 'ui_act_id'
                    }
                    break;
            }

            var sql = `SELECT DISTINCT act_id 
                FROM ??
                INNER JOIN activity_table ON ?? = act_id 
                INNER JOIN version_table ON act_ver_id = ver_id 
                LEFT JOIN user_table ON ver_id = user_ver_id `;

            if (data.filter.crashId) {
                sql += `INNER JOIN crash_table ON crash_act_id = act_id `;
            }
            sql += `WHERE package_name = ? 
                AND ?? BETWEEN ? AND ? `;

            select.push(field.table_name, field.res_act_id,
                data.package_name,
                field.res_date, data.filter.dateRange.start, data.filter.dateRange.end);

            switch(data.resourceType) {
                case 'cpu':
                case 'memory':
                    sql += `AND ?? BETWEEN ? AND ? `;
                    select.push(field.res_usage, data.filter.usageRange.start, data.filter.usageRange.end);
                    break;

                case 'ui':
                    if (data.filter.usageRange.end < 100) {
                        sql += `AND ??/?? BETWEEN ? AND ? `;
                        select.push(field.res_usage, field.res_count, data.filter.usageRange.start, data.filter.usageRange.end);
                    } else {
                        sql += `AND ??/?? > ? `;
                        select.push(field.res_usage, field.res_count, data.filter.usageRange.start);
                    }
                    break;
            }

            sql += filterOption.addCrashOption(data.filter, select);
            sql += filterOption.addFullOption(data.filter, select);    
            sql += filterOption.addActivityOption(data.filter, select);
            sql += `ORDER BY act_id ASC`;

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
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
                    var error = new Error("No data");
                    error.status = 9404;
                    return rejected({ context : context, error : error });
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
            var sql = `SELECT act_t.activity_name, SUM(user_count) as user_count, 
                SUM(crash_count) as crash_count, SUM(obc_t.host_status > 300) as status_count, 
                SUM(c_t.cpu_sum) / SUM(c_t.cpu_count) as cpu_count, 
                SUM(m_t.mem_sum) / SUM(m_t.mem_count) as mem_count 
                FROM activity_table as act_t 
                LEFT JOIN cpu_table as c_t 
                ON act_t.act_id = c_t.cpu_act_id 
                LEFT JOIN memory_table as m_t 
                ON act_t.act_id = m_t.mem_act_id 
                LEFT JOIN crash_table as crash_t 
                ON act_t.act_id = crash_t.crash_act_id
                LEFT JOIN obc_table as obc_t 
                ON act_t.act_id = obc_t.host_act_id 
                WHERE act_ver_id IN (?) `;

            sql += filterOption.addActivityOption(data.filter, select);

            sql += "GROUP BY `act_t`.`activity_name`";

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
                
                data.act_name_list = []
                rows.forEach(function(row) {
                    let temp = {
                        name : row.activity_name,
                        usageCount : row.user_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0,
                        cpuUsage : row.cpu_count != null ? row.cpu_count : 0,
                        memoryUsage : row.mem_count != null ? row.mem_count : 0,
                        networkCount : row.status_count != null ? row.status_count : 0,
                    };

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
                   
            sql += filterOption.addFullOption(data.filter, select)

            sql += "GROUP BY version_table.os_ver, version_table.device_name " +
                    "ORDER BY user_count DESC ";

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
                    return rejected({ context : context, error : error });
                } else if (rows.length == 0) {
                    // TODO 아무것도 없는 경우
                    var error = new Error("No data");
                    error.status = 9404;
                    return rejected({ context : context, error : error });
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
                "SUM(crash_count) as crash_count, " +
                "SUM(obc_t.host_status > 300) as status_count, " +
                "SUM(c_t.cpu_sum) / SUM(c_t.cpu_count) as cpu_count, " +
                "SUM(m_t.mem_sum) / SUM(m_t.mem_count) as mem_count " +
                "FROM version_table " +
                "JOIN activity_table AS act_t " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "LEFT JOIN cpu_table AS c_t " +
                "ON act_t.act_id = c_t.cpu_act_id " +
                "LEFT JOIN memory_table AS m_t " +
                "ON act_t.act_id = m_t.mem_act_id " +
                "LEFT JOIN obc_table AS obc_t " +
                "ON act_t.act_id = obc_t.host_act_id " +
                "WHERE `package_name` = ? ";

            sql += filterOption.addExceptOption(data.selector, select, ["location"]);

            sql += "GROUP BY location_code " +
                "ORDER BY usage_count ";

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
                
                data.location_usage = [];
                rows.forEach(function(row) {
                    let usage = {
                        locationCode : row.location_code,
                        usageCount : row.usage_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0,
                        cpuUsage : row.cpu_count != null ? row.cpu_count : 0,
                        memoryUsage : row.mem_count != null ? row.mem_count : 0,
                        networkCount : row.status_count != null ? row.status_count : 0
                    }

                    data.location_usage.push(usage);
                });

                return resolved(context);
            });
        });
    },

    getDeviceUsage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            let select = [data.package_name];
            let sql = "SELECT DISTINCT device_name, SUM(user_count) AS usage_count, " +
                "SUM(crash_count) as crash_count, " +
                "SUM(obc_t.host_status > 300) as status_count, " +
                "SUM(c_t.cpu_sum) / SUM(c_t.cpu_count) as cpu_count, " +
                "SUM(m_t.mem_sum) / SUM(m_t.mem_count) as mem_count " +
                "FROM version_table " +
                "JOIN activity_table AS act_t " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "LEFT JOIN cpu_table AS c_t " +
                "ON act_t.act_id = c_t.cpu_act_id " +
                "LEFT JOIN memory_table AS m_t " +
                "ON act_t.act_id = m_t.mem_act_id " +
                "LEFT JOIN obc_table AS obc_t " +
                "ON act_t.act_id = obc_t.host_act_id " +
                "WHERE `package_name` = ? ";


            sql += filterOption.addExceptOption(data.selector, select, ["device"]);

            sql += "GROUP BY device_name " +
                "ORDER BY usage_count ";

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
                
                data.device_usage = [];
                rows.forEach(function(row) {
                    let usage = {
                        deviceName : row.device_name,
                        usageCount : row.usage_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0,
                        cpuUsage : row.cpu_count != null ? row.cpu_count : 0,
                        memoryUsage : row.mem_count != null ? row.mem_count : 0,
                        networkCount : row.status_count != null ? row.status_count : 0
                    }

                    data.device_usage.push(usage);
                });

                return resolved(context);
            });
        });
    },

    getOsUsage : function(context, data) {
        return new Promise(function(resolved, rejected) {
            let select = [data.package_name];
            let sql = "SELECT DISTINCT os_ver, SUM(user_count) AS usage_count, " +
                "SUM(crash_count) as crash_count, " +
                "SUM(obc_t.host_status > 300) as status_count, " +
                "SUM(c_t.cpu_sum) / SUM(c_t.cpu_count) as cpu_count, " +
                "SUM(m_t.mem_sum) / SUM(m_t.mem_count) as mem_count " +
                "FROM version_table " +
                "JOIN activity_table AS act_t " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "LEFT JOIN cpu_table AS c_t " +
                "ON act_t.act_id = c_t.cpu_act_id " +
                "LEFT JOIN memory_table AS m_t " +
                "ON act_t.act_id = m_t.mem_act_id " +
                "LEFT JOIN obc_table AS obc_t " +
                "ON act_t.act_id = obc_t.host_act_id " +
                "WHERE `package_name` = ? ";

            sql += filterOption.addExceptOption(data.selector, select, ["os"]);

            sql += "GROUP BY os_ver " +
                "ORDER BY usage_count ";

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
                
                data.os_usage = [];
                rows.forEach(function(row) {
                    let usage = {
                        osVersion : row.os_ver,
                        usageCount : row.usage_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0,
                        cpuUsage : row.cpu_count != null ? row.cpu_count : 0,
                        memoryUsage : row.mem_count != null ? row.mem_count : 0,
                        networkCount : row.status_count != null ? row.status_count : 0
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
                "SUM(crash_count) as crash_count, " +
                "SUM(obc_t.host_status > 300) as status_count, " +
                "SUM(c_t.cpu_sum) / SUM(c_t.cpu_count) as cpu_count, " +
                "SUM(m_t.mem_sum) / SUM(m_t.mem_count) as mem_count " +
                "FROM version_table " +
                "JOIN activity_table AS act_t " +
                "ON ver_id = act_ver_id " +
                "LEFT JOIN crash_table " +
                "ON crash_act_id = act_id " +
                "LEFT JOIN cpu_table AS c_t " +
                "ON act_t.act_id = c_t.cpu_act_id " +
                "LEFT JOIN memory_table AS m_t " +
                "ON act_t.act_id = m_t.mem_act_id " +
                "LEFT JOIN obc_table AS obc_t " +
                "ON act_t.act_id = obc_t.host_act_id " +
                "WHERE `package_name` = ? ";
                
            sql += filterOption.addExceptOption(data.selector, select, ["activity"]);

            sql += "GROUP BY activity_name " +
                "ORDER BY usage_count ";

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
                
                data.activity_usage = [];
                rows.forEach(function(row) {
                    let usage = {
                        activityName : row.activity_name,
                        usageCount : row.usage_count,
                        crashCount : row.crash_count != null ? row.crash_count : 0,
                        cpuUsage : row.cpu_count != null ? row.cpu_count : 0,
                        memoryUsage : row.mem_count != null ? row.mem_count : 0,
                        networkCount : row.status_count != null ? row.status_count : 0
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

            sql += filterOption.addFullOption(data.filter, select);

            sql += "GROUP BY collect_time " +
                "ORDER BY collect_time ASC";

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

            var select = [];
            var sql = `SELECT `;
            var field = {};
            switch (data.resourceType) {
                case 'cpu':
                    field.field_name = ['cpu_raw_time', 'cpu_raw_rate', 'cpu_raw_count', 'craw_act_id'];
                    field.table_name = 'cpu_raw_table';

                    select.push(field.field_name[1]);
                    sql += `??, `; 
                    break;
                case 'memory':
                    field.field_name = ['mem_raw_time', 'mem_raw_rate', 'mem_raw_count', 'mraw_act_id'];
                    field.table_name = 'memory_raw_table';

                    select.push(field.field_name[1]);
                    sql += `??, `; 
                    break;
                case 'ui':
                    field.field_name = ['ui_time', 'ui_speed', 'ui_count', 'ui_act_id'];
                    field.table_name = 'ui_table';

                    select.push(field.field_name[1], field.field_name[1]);
                    sql += `SUM(??) AS ??, `; 
                    break;
            }

            select.push(field.field_name[2], field.field_name[2], 
                field.table_name, field.field_name[3],
                data.package_name,
                field.field_name[0], data.filter.dateRange.start, data.filter.dateRange.end);
            sql += `SUM(??) AS ??, device_name, os_ver, location_code, uuid 
                FROM ??
                INNER JOIN activity_table ON ?? = act_id 
                INNER JOIN version_table ON act_ver_id = ver_id 
                LEFT JOIN user_table ON ver_id = user_ver_id `;
            
            if (data.filter.crashId) {
                sql += `crash_table ON crash_act_id = act_id `;
            }

            sql += `WHERE package_name = ? 
                AND ?? BETWEEN ? AND ? `;

            if (data.filter.crashId) {
                select.push(data.filter.crashId);
                sql += `AND crash_raw_id = ? `;
            }

            sql += filterOption.addFullOption(data.filter, select);

            switch (data.resourceType) {
                case 'cpu':
                case 'memory':
                    sql += `AND ?? BETWEEN ? AND ? 
                        GROUP BY device_name, os_ver, location_code, uuid, ??
                        ORDER BY ?? ASC`;
                    select.push(field.field_name[1], 
                        data.filter.usageRange.start, data.filter.usageRange.end,
                        field.field_name[1], field.field_name[1]);
                    break;
                case 'ui':
                    sql += `AND ?? / ?? BETWEEN ? AND ? 
                        GROUP BY device_name, os_ver, location_code, uuid
                        ORDER BY ?? ASC`;
                    select.push(field.field_name[1], field.field_name[2], 
                        data.filter.usageRange.start, data.filter.usageRange.end,
                        field.field_name[1]);
                    break;
            }

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

                data.user_list = [];
                rows.forEach(function(row) {
                    data.user_list.push({
                        uuid : row.uuid,
                        device : row.device_name,
                        os : row.os_ver,
                        location : row.location_code,
                        usage_rate : row[field.field_name[1]],
                        usage_count : row[field.field_name[2]]
                    })
                });

                return resolved(context);
            });
        });
    },

    getVersionsByCrash : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.field_name, data.package_name, data.crash_id];
            var sql = `SELECT ??, SUM(crash_count) AS crash_count 
                FROM crash_table 
                INNER JOIN crash_raw_table ON crash_raw_id = crash_id 
                INNER JOIN activity_table ON crash_act_id = act_id 
                INNER JOIN version_table ON act_ver_id = ver_id 
                WHERE package_name = ? 
                AND crash_id = ? `;
            
            sql += filterOption.addFullOption(data.filter, select);

            select.push(data.field_name);
            sql += `GROUP BY ??
                ORDER BY crash_count DESC`;

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

                data[data.field_name] = rows;

                return resolved(context);
            });
        });
    }
};

module.exports = versionModel;