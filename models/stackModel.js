/**
 * Created by YS on 2017-04-14.
 */

var stackModel = {
    getCallstack : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.act_id_list];
            var sql = `SELECT thread_name, call_clevel, 
				(SELECT callstack_name FROM callstack_name_table WHERE call_id = call_clevel) AS clevel_name, 
				call_uplevel, 
				(SELECT callstack_name FROM callstack_name_table WHERE call_id = call_uplevel) AS uplevel_name, 
				SUM(call_count) AS call_count 
				FROM callstack_table AS CT 
				LEFT JOIN callstack_name_table AS CNT 
				ON call_clevel = call_id AND call_uplevel = call_id 
				WHERE call_act_id IN (?) 
				GROUP BY thread_name, call_clevel, call_uplevel`;

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
	           	
	            let callstack = {};
	            rows.forEach(function(row) {
	            	if (callstack[row.thread_name] == undefined) {
	            		callstack[row.thread_name] = {}
	            		if (row.call_uplevel == row.call_clevel) {
	            			row.call_uplevel = 0;
	            		}

	            		callstack[row.thread_name].stack = [{
            				id : row.call_clevel,
            				stackName : row.clevel_name,
            				parentId : row.call_uplevel,
            				count : row.call_count
            			}];
	            	} else {
	            		if (row.call_uplevel == row.call_clevel) {
	            			row.call_uplevel = 0;
	            		}

	            		callstack[row.thread_name].stack.push({
            				id : row.call_clevel,
            				stackName : row.clevel_name,
            				parentId : row.call_uplevel,
            				count : row.call_count
	            		});
	            	}
	            });

	            const TreeModel = require('./treeModel');

				data.callstack = [];
	            let thread_name = Object.keys(callstack);
	            thread_name.forEach(function(name) {
	            	callstack[name].stack.push({
		            	id : 0,
		            	stackName : 'root'
		            });

	            	let orderd = []
	            	orderd.push(TreeModel.expendTreeModel(callstack[name].stack, 0));
	            	data.callstack.push({
	            		threadName : name,
	            		stack : orderd
	            	});
	            });
	            
            	return resolved(context);
            });
        });
    },

    getCrashstack : function(context, data) {
        return new Promise(function(resolved, rejected) {
            var select = [data.crash_id, data.package_name];
            var sql = `SELECT thread_name, call_clevel, 
				(SELECT callstack_name FROM callstack_name_table WHERE call_id = call_clevel) AS clevel_name, 
				call_uplevel, 
				(SELECT callstack_name FROM callstack_name_table WHERE call_id = call_uplevel) AS uplevel_name, 
				SUM(call_count) AS call_count 
				FROM crash_table
				INNER JOIN activity_table
				ON crash_act_id = act_id
				INNER JOIN version_table
				ON act_ver_id = ver_id
				LEFT JOIN callstack_table AS CT 
				ON act_id = call_act_id
				LEFT JOIN callstack_name_table AS CNT 
				ON call_clevel = call_id AND call_uplevel = call_id 
				WHERE crash_raw_id = ?
				AND package_name = ? 
				GROUP BY thread_name, call_clevel, call_uplevel `;

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
	           	
	            let callstack = {};
	            rows.forEach(function(row) {
	            	if (callstack[row.thread_name] == undefined) {
	            		callstack[row.thread_name] = {}
	            		if (row.call_uplevel == row.call_clevel) {
	            			row.call_uplevel = 0;
	            		}

	            		callstack[row.thread_name].stack = [{
            				id : row.call_clevel,
            				stackName : row.clevel_name,
            				parentId : row.call_uplevel,
            				count : row.call_count
            			}];
	            	} else {
	            		if (row.call_uplevel == row.call_clevel) {
	            			row.call_uplevel = 0;
	            		}

	            		callstack[row.thread_name].stack.push({
            				id : row.call_clevel,
            				stackName : row.clevel_name,
            				parentId : row.call_uplevel,
            				count : row.call_count
	            		});
	            	}
	            });
	            
	            const TreeModel = require('./treeModel');

				data.callstack = [];
	            let thread_name = Object.keys(callstack);
	            thread_name.forEach(function(name) {
	            	callstack[name].stack.push({
		            	id : 0,
		            	stackName : 'root'
		            });

	            	let orderd = []
	            	orderd.push(TreeModel.expendTreeModel(callstack[name].stack, 0));
	            	data.callstack.push({
	            		threadName : name,
	            		stack : orderd
	            	});
	            });
	            
            	return resolved(context);
            });
        });
    },
};

module.exports = stackModel;