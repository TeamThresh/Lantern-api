/**
 * Created by YS on 2017-06-01.
 */

 var insightModel = {
 	getUserCount : (context, data) => {
 		return new Promise((resolved, rejected) => {
 			let select = [data.package_name, data.dateRange.start, data.dateRange.end];
 			let sql = `SELECT COUNT(ver_id) AS user_count
				FROM cpu_raw_table
				INNER JOIN activity_table
					ON act_id = craw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id	
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ? `;

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

                data.user_count = rows[0].user_count;

                return resolved(context);
            });
 		})
 	},

 	getCPUInsight : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.dateRange.start, data.dateRange.end];
 			var sql = `SELECT cpu_raw_rate, SUM(cpu_raw_count), activity_name, device_name, os_ver, location_code, COUNT(ver_id) AS user_count
				FROM cpu_raw_table
				INNER JOIN activity_table
					ON act_id = craw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ? `;
            
            // 하위 호환
            if (data.p95) { 
                select.push(data.p95);
                sql += `AND cpu_raw_rate >= ? `;
            } else {
                select.push(data.filter.usageRange.start, data.filter.usageRange.end);
                sql += `AND cpu_raw_rate BETWEEN ? AND ? `;
            }
				
			sql += `GROUP BY cpu_raw_rate, activity_name, device_name, os_ver, location_code 
				ORDER BY cpu_raw_rate ASC `;

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

                data.problem_set = rows;

                return resolved(context);
            });
 		});
 	},

	getCPUHistogramWithP95 : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.dateRange.start, data.dateRange.end];
 			var sql = `SELECT IF (cpu_raw_rate < 0, 0, cpu_raw_rate) AS rate, SUM(cpu_raw_count), COUNT(ver_id) AS user_count
				FROM cpu_raw_table
				INNER JOIN activity_table
					ON act_id = craw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				GROUP BY rate
				ORDER BY rate ASC `;

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

                let problem_set = [];
                let count = 0;

                data.histogram = [];
                rows.forEach((row) => {
                	data.histogram.push({
                		rate : row.rate,
                		user_count : row.user_count
                	});
                	count += row.user_count;
                });

                let pValue = require('./position').calculatePValue(rows, count, problem_set);

                data.p95 = pValue.p95;
                data.p50 = pValue.p50;
                data.p10 = pValue.p10;

                return resolved(context);
            });
 		});
 	},

 	getMemInsight : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.dateRange.start, data.dateRange.end];
 			var sql = `SELECT mem_raw_rate, SUM(mem_raw_count), activity_name, device_name, os_ver, location_code, COUNT(ver_id) AS user_count
				FROM memory_raw_table
				INNER JOIN activity_table
					ON act_id = mraw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ? `;

            // 하위 호환
            if (data.p95) { 
                select.push(data.p95);
                sql += `AND mem_raw_rate >= ? `;
    		} else {
                select.push(data.filter.usageRange.start, data.filter.usageRange.end);
                sql += `AND mem_raw_rate BETWEEN ? AND ? `;
            }

			sql += `GROUP BY mem_raw_rate, activity_name, device_name, os_ver, location_code 
				ORDER BY mem_raw_rate ASC `;

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

                
                data.problem_set = rows;
                return resolved(context);
            });
 		});
 	},

 	getMemHistogramWithP95 : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.dateRange.start, data.dateRange.end];
 			var sql = `SELECT mem_raw_rate AS rate, SUM(mem_raw_count), COUNT(ver_id) AS user_count
				FROM memory_raw_table
				INNER JOIN activity_table
					ON act_id = mraw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				GROUP BY rate
				ORDER BY rate ASC `;

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

                let problem_set = [];
                let count = 0;

                data.histogram = [];
                rows.forEach((row) => {
                	data.histogram.push({
                		rate : row.rate,
                		user_count : row.user_count
                	});
                	count += row.user_count;
                });

                let pValue = require('./position').calculatePValue(rows, count, problem_set);

                data.p95 = pValue.p95;
                data.p50 = pValue.p50;
                data.p10 = pValue.p10;
                return resolved(context);
            });
 		});
 	},

 	getRenderInsight : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.dateRange.start, data.dateRange.end];
 			var sql = `SELECT FLOOR(ui_speed/ui_count) AS ui_rate, 
 				activity_name, device_name, os_ver, location_code, COUNT(ver_id) AS user_count
				FROM ui_table
				INNER JOIN activity_table
					ON act_id = ui_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ? `;

            // 하위 호환
            if (data.p95) { 
                select.push(data.p95);
                sql += `AND (ui_speed/ui_count) >= ? `;
            } else {
                select.push(data.filter.usageRange.start, data.filter.usageRange.end);
                sql += `AND (ui_speed/ui_count) BETWEEN ? AND ? `;
            }
                
            sql += `GROUP BY ui_rate, activity_name, device_name, os_ver, location_code
				ORDER BY ui_rate ASC `;

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

                data.problem_set = rows;
                return resolved(context);
            });
 		});
 	},

 	getRenderHistogramWithP95 : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.dateRange.start, data.dateRange.end];
 			var sql = `SELECT FLOOR(ui_speed/ui_count) AS rate, COUNT(ver_id) AS user_count
				FROM ui_table
				INNER JOIN activity_table
					ON act_id = ui_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				GROUP BY rate
				ORDER BY rate ASC `;

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

                let problem_set = [];
                let count = 0;

                data.histogram = [];
                rows.forEach((row) => {
                	data.histogram.push({
                		rate : row.rate,
                		user_count : row.user_count
                	});
                	count += row.user_count;
                });

                let pValue = require('./position').calculatePValue(rows, count, problem_set);

                data.p95 = pValue.p95;
                data.p50 = pValue.p50;
                data.p10 = pValue.p10;
		        
                return resolved(context);
            });
 		});
 	},

 	getOBCInsight : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.dateRange.start, data.dateRange.end, 
                data.filter.usageRange.start, data.filter.usageRange.end];
 			var sql = `SELECT (FLOOR(host_speed/100)*100) AS host_rate, SUM(host_count) AS host_count, 
 				activity_name, device_name, os_ver, location_code, COUNT(ver_id) AS user_count
				FROM obc_table
				INNER JOIN activity_table
					ON act_id = host_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ? `;

            // 하위 호환
            if (data.p95) { 
                select.push(data.p95);
                sql += `AND host_speed/host_count >= ? `;
            } else {
                select.push(data.filter.usageRange.start, data.filter.usageRange.end);
                sql += `AND host_speed/host_count BETWEEN ? AND ? `;
            }
                
            sql += `GROUP BY host_rate, activity_name, device_name, os_ver, location_code 
				ORDER BY host_rate ASC `;

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

                data.problem_set = rows;
                return resolved(context);
            });
 		});
 	},


 	getHostHistogramWithP95 : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.dateRange.start, data.dateRange.end];
 			var sql = `SELECT (FLOOR(host_speed/host_count/100)*100) AS rate, COUNT(ver_id) AS user_count
				FROM obc_table
				INNER JOIN activity_table
					ON act_id = host_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				GROUP BY rate
				ORDER BY rate ASC `;

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

                let problem_set = [];
                let count = 0;

                data.histogram = [];
                rows.forEach((row) => {
                	data.histogram.push({
                		rate : row.rate,
                		user_count : row.user_count
                	});
                	count += row.user_count;
                });

                let pValue = require('./position').calculatePValue(rows, count, problem_set);

                data.p95 = pValue.p95;
                data.p50 = pValue.p50;
                data.p10 = pValue.p10;
		        
                return resolved(context);
            });
 		});
 	},
 };

 module.exports = insightModel;