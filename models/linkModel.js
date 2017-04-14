/**
 * Created by YS on 2017-04-14.
 */

var linkModel = {

    getLinkList : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [];
            var sql = "SELECT (SELECT activity_name FROM activity_table WHERE act_id = link_act_id) AS source_id, " +
            	"(SELECT activity_name FROM activity_table WHERE act_id = before_act_id) AS target_id, " +
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
                    return rejected(err);
                } else if (rows.length == 0) {
                	// TODO 아무것도 없는 경우
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
    }
};

module.exports = linkModel;