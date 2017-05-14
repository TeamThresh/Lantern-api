/**
 * Created by YS on 2017-04-14.
 */

var renderModel = {
    getRenderList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT ui_time, ui_speed, ui_count " +
            	"FROM ui_table " +
            	"WHERE `ui_act_id` IN (";
            	
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
                    error.status = 9404;
                    context.connection.rollback();
                    return rejected(error);
	            }
	            
	            data.renderList = [];
	            rows.forEach(function(row) {
	            	var renderData = {
	            		timestamp : row.ui_time,
	            		value : row.ui_speed,
	            		count : row.ui_count
	            	};
	            	data.renderList.push(renderData);
	            });
	            
            	return resolved(context);
            });
        });
    }
};

module.exports = renderModel;