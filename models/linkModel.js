/**
 * Created by YS on 2017-04-14.
 */

const filterOption = require('./filterOption');

var linkModel = {

    getLinkList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.act_id_list];
            var sql = "SELECT (SELECT activity_name FROM activity_table WHERE act_id = link_act_id) AS target_id, " +
            	"(SELECT activity_name FROM activity_table WHERE act_id = before_act_id) AS source_id, " +
            	"link_count " +
            	"FROM link_table " +
        		"WHERE `before_act_id` IN (?) ";

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
	            
	            data.activity_count = rows[0].user_count;
	            
            	return resolved(context);
            });
        });
    }
};

module.exports = linkModel;