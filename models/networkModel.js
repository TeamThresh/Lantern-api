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
                    return rejected(err);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
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
    }
};

module.exports = networkModel;