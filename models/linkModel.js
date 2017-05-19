/**
 * Created by YS on 2017-04-14.
 */

var linkModel = {

    getLinkList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT (SELECT activity_name FROM activity_table WHERE act_id = link_act_id) AS target_id, " +
            	"(SELECT activity_name FROM activity_table WHERE act_id = before_act_id) AS source_id, " +
            	"link_count " +
            	"FROM link_table " +
        		"WHERE `before_act_id` IN (";
            	
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
	            
	            data.linkList = [];
	            rows.forEach(function(row) {
	            	var result = data.linkList.some(function (item, index, array) {
						if (item.source == row.source_id
							&& item.target == row.target_id) {
							item.value += 1;
							return true;
						} else {
							return false;
						}
					});

					if (!result) {
		            	var linkData = {
		            		source : row.source_id,
		            		target : row.target_id,
		            		value : row.link_count
		            	};
		            	
		            	data.linkList.push(linkData);
		            }
	            });
	            
            	return resolved(context);
            });
        });
    },

    getActivityCount : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.ver_key];
            var sql = "SELECT SUM(user_count) AS user_count " +
            	"FROM activity_table " +
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
	            
	            data.activity_count = rows[0].user_count;
	            
            	return resolved(context);
            });
        });
    }
};

module.exports = linkModel;