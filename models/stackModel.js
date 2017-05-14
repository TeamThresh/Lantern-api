/**
 * Created by YS on 2017-04-14.
 */

var stackModel = {
    getCallstack : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.act_id_list];
            var sql = "SELECT thread_name, call_clevel, " +
				"(SELECT callstack_name FROM callstack_name_table WHERE call_id = call_clevel) AS clevel_name, " +
				"call_uplevel, " +
				"(SELECT callstack_name FROM callstack_name_table WHERE call_id = call_uplevel) AS uplevel_name, " +
				"SUM(call_count) AS call_count " +
				"FROM callstack_table AS CT " +
				"LEFT JOIN callstack_name_table AS CNT " +
				"ON call_clevel = call_id AND call_uplevel = call_id " +
				"WHERE call_act_id IN (?) " +
				"GROUP BY thread_name, call_clevel, call_uplevel";

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
	           	
	            let callstack = {};
	            rows.forEach(function(row) {
	            	if (callstack[row.thread_name] == undefined) {
	            		callstack[row.thread_name] = {}
	            		if (row.call_uplevel == null) {
	            			callstack[row.thread_name].root = row.call_clevel
	            		}

	            		callstack[row.thread_name].stack = [{
            				id : row.call_clevel,
            				stackName : row.clevel_name,
            				parentId : row.call_uplevel,
            				count : row.call_count
            			}];
	            	} else {
	            		if (row.call_uplevel == null) {
	            			callstack[row.thread_name].root = row.call_clevel
	            		}

	            		callstack[row.thread_name].stack.push({
            				id : row.call_clevel,
            				stackName : row.clevel_name,
            				parentId : row.call_uplevel,
            				count : row.call_count
	            		});
	            	}
	            });

				data.callstack = [];
	            let thread_name = Object.keys(callstack);
	            thread_name.forEach(function(name) {
	            	let orderd = treeModel(callstack[name].stack, callstack[name].root);
	            	data.callstack.push({
	            		threadName : name,
	            		stack : orderd
	            	});
	            });
	            
            	return resolved(context);
            });
        });
    }
};

//트리 변환 메서드
var treeModel = function (arrayList, rootId) {
	var rootNodes = [];
	var traverse = function (nodes, item, index) {
		if (nodes instanceof Array) {
			return nodes.some(function (node) {
				if (node.id === item.parentId) {
					node.children = node.children || [];
					return node.children.push(arrayList.splice(index, 1)[0]);
				}

				return traverse(node.children, item, index);
			});
		}
	};

	while (arrayList.length > 0) {
		arrayList.some(function (item, index) {
			if (item.id === rootId) {
				return rootNodes.push(arrayList.splice(index, 1)[0]);
			}

			return traverse(rootNodes, item, index);
		});
	}

	return rootNodes;
};

module.exports = stackModel;