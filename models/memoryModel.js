/**
 * Created by YS on 2017-04-14.
 */

var memoryModel = {
    getMemUsageList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.act_id_list];
            var sql = "SELECT mem_raw_rate, mem_raw_count, mem_raw_time " +
            	"FROM memory_raw_table " +
            	"WHERE `mraw_act_id` IN (?)";

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
	            
	            data.memUsageList = [];
	            rows.forEach(function(row) {
	            	var usageData = {
	            		timestamp : row.mem_raw_time,
	            		value : row.mem_raw_rate,
	            		count : row.mem_raw_count
	            	};
	            	data.memUsageList.push(usageData);
	            });
	            
            	return resolved(context);
            });
        });
    }
};

module.exports = memoryModel;