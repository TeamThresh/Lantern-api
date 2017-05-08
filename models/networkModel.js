/**
 * Created by YS on 2017-04-14.
 */

var networkModel = {
    getHostList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT host_name, host_count, host_speed, " +
            	"host_status, host_high_speed, host_low_speed " +
            	"FROM obc_table " +
        		"WHERE `host_act_id` IN (";
            	
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
	            
	            data.hostList = [];
	            rows.forEach(function(row) {
	            	var result = data.hostList.some(function (item, index, array) {
						if (item.domain == row.host_name) {
							item.count += row.host_count;
							item.speed += row.host_speed;
							if (row.host_status.toString().substring(0,1) == 2)
								item.success += row.host_count;
							item.minResponseTime = item.minResponseTime < row.host_low_speed 
												? item.minResponseTime : row.host_low_speed;
							item.maxResponseTime = item.maxResponseTime > row.host_high_speed 
												? item.maxResponseTime : row.host_high_speed;
							return true;
						} else {
							return false;
						}
					});

					if (!result) {
		            	var hostData = {
		            		domain : row.host_name,
		            		count : row.host_count,
		            		speed : row.host_speed,
		            		minResponseTime : row.host_low_speed,
		            		maxResponseTime : row.host_high_speed
		            	};
		            	if (row.host_status.toString().substring(0,1) == 2)
		            		hostData.success = row.host_count;
		            	else 
		            		hostData.success = 0;
		            	
		            	data.hostList.push(hostData);
		            }
	            });

	            data.hostList.forEach(function(hostData, index) {
	            	data.hostList[index].avgResponseTime = parseInt(hostData.speed / hostData.count);
	            	delete data.hostList[index].speed
	            });
	            
            	return resolved(context);
            });
        });
    }, 

    getLocationList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.package_name];
            var sql = "SELECT location_name, location_code, " +
				"SUM(user_count) AS usage_count, SUM(crash_count) as crash_count " +
				"FROM version_table " +
				"INNER JOIN activity_table ON version_table.ver_id = activity_table.act_ver_id " +
				"LEFT JOIN crash_table ON activity_table.act_id = crash_table.crash_act_id " +
				"WHERE version_table.package_name = ? ";

            if (data.filter != undefined) {
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
			sql += "GROUP BY version_table.location_name, version_table.location_code ";

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
	            
	            data.locationList = [];
	            rows.forEach(function(arr) {
	            	let temp = {
	            		country_code : arr.location_code,
	            		country_name : arr.location_name,
	            		usage_count : arr.usage_count
	            	};

	            	if (arr.crash_count != null) {
	            		temp.crash_count = arr.crash_count;
	            	} else {
	            		temp.crash_count = 0;
	            	}

	            	data.locationList.push(temp);
	            });
	            
            	return resolved(context);
            });
        });
    }
};

module.exports = networkModel;