/**
 * Created by YS on 2017-04-14.
 */

var cpuModel = {
    getCpuUsageList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT cpu_raw_rate, cpu_raw_count, cpu_raw_time " +
            	"FROM cpu_raw_table " +
            	"WHERE `craw_act_id` IN (";
            	
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
                    error.status = 404;
                    context.connection.rollback();
                    return rejected(error);
	            }
	            
	            data.cpuUsageList = [];
	            rows.forEach(function(row) {
	            	var usageData = {
	            		timestamp : row.cpu_raw_time,
	            		value : row.cpu_raw_rate,
	            		count : row.cpu_raw_count
	            	};
	            	data.cpuUsageList.push(usageData);
	            });
	            
            	return resolved(context);
            });
        });
    }
};

module.exports = cpuModel;