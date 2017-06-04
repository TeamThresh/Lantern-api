/**
 * Created by YS on 2017-04-14.
 */

const filterOption = require('./filterOption');

var stackModel = {
 	getCallstack : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name];
 			var sql = `SELECT thread_name, call_clevel, 
     			(SELECT callstack_name FROM callstack_name_table WHERE call_id = call_clevel) AS clevel_name, 
     			call_uplevel, 
     			(SELECT callstack_name FROM callstack_name_table WHERE call_id = call_uplevel) AS uplevel_name, 
     			GROUP_CONCAT(DISTINCT call_downlevel) AS 
                call_downlevel,
     			SUM(call_count) AS call_count 
     			FROM callstack_table AS CT 
                INNER JOIN activity_table ON call_act_id = act_id 
                INNER JOIN version_table ON act_ver_id = ver_id 
                INNER JOIN user_table ON user_ver_id = ver_id
                LEFT JOIN callstack_name_table AS CNT 
                ON call_clevel = call_id AND call_uplevel = call_id AND call_downlevel = call_id 
                WHERE package_name = ? `;

            sql += filterOption.addFullOption(data.filter, select);
            sql += filterOption.addUserOption(data.filter, select);

            sql += `GROUP BY thread_name, call_clevel, call_uplevel `;

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

                let callstack = {};
                rows.forEach(function(row) {
                	if (callstack[row.thread_name] == undefined) {
                		callstack[row.thread_name] = {
                            stack: [{
                                id : 0,
                                stackName : 'root',
                                childId : []
                            }]
                        };
                		if (row.call_uplevel == row.call_clevel) {
	            			// 루트 노드 일경우
	            			row.call_uplevel = 0;
                            callstack[row.thread_name].stack[0].childId.push(row.call_clevel);
	            		}

	            		callstack[row.thread_name].stack.push({
	            			id : row.call_clevel,
	            			stackName : row.clevel_name,
	            			parentId : row.call_uplevel,
	            			childId : row.call_downlevel.split(','),
	            			count : row.call_count
	            		});
	            	} else {

	            		if (row.call_uplevel == row.call_clevel) {
	            			// 루트 노드 일경우
	            			row.call_uplevel = 0;
                            callstack[row.thread_name].stack[0].childId.push(row.call_clevel);
	            		}

	            		callstack[row.thread_name].stack.push({
	            			id : row.call_clevel,
	            			stackName : row.clevel_name,
	            			parentId : row.call_uplevel,
	            			childId : row.call_downlevel.split(','),
	            			count : row.call_count
	            		});
	            	}
	            });

                const TreeModel = require('./treeModel');

                data.callstack = [];
                let thread_name = Object.keys(callstack);
                thread_name.forEach(function(name) {
                	let orderd = [];
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
 			var sql = `SELECT cs_thread_name, cs_clevel, 
 			(SELECT callstack_name FROM callstack_name_table WHERE call_id = cs_clevel) AS clevel_name, 
 			cs_uplevel, 
 			GROUP_CONCAT(cs_downlevel) AS cs_downlevel, 
 			SUM(cs_count) AS cs_count 
 			FROM crash_raw_table
 			INNER JOIN version_table
 			ON crash_ver_id = ver_id
 			INNER JOIN crash_stack_table AS CT 
 			ON cs_crash_id = crash_id
 			LEFT JOIN callstack_name_table AS CNT 
 			ON cs_clevel = call_id AND cs_uplevel = call_id AND cs_downlevel = call_id 
 			WHERE crash_id = ?
 			AND package_name = ? 
 			GROUP BY cs_thread_name, cs_clevel, cs_uplevel `;

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
                
                let rootChild = [];
                let callstack = {};
                rows.forEach(function(row) {
                	if (callstack[row.cs_thread_name] == undefined) {
                		callstack[row.cs_thread_name] = {
                            stack: [{
                                id : 0,
                                stackName : 'root',
                                childId : []
                            }]
                        };
                		if (row.cs_uplevel == row.cs_clevel) {
                			row.cs_uplevel = 0;
                            callstack[row.cs_thread_name].stack[0].childId.push(row.cs_clevel);
                		}

                		callstack[row.cs_thread_name].stack.push({
                			id : row.cs_clevel,
                			stackName : row.clevel_name,
                			parentId : row.cs_uplevel,
                			childId : row.cs_downlevel.split(','),
                			count : row.cs_count
                		});
                	} else {
                		if (row.cs_uplevel == row.cs_clevel) {
                			row.cs_uplevel = 0;
                            callstack[row.cs_thread_name].stack[0].childId.push(row.cs_clevel);
                		}

                		callstack[row.cs_thread_name].stack.push({
                			id : row.cs_clevel,
                			stackName : row.clevel_name,
                			parentId : row.cs_uplevel,
                			childId : row.cs_downlevel.split(','),
                			count : row.cs_count
                		});
                	}
                });

                const TreeModel = require('./treeModel');

                data.callstack = [];
                let thread_name = Object.keys(callstack);
                thread_name.forEach(function(name) {
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