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
                    return rejected(err);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
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
    }
};

module.exports = crashModel;