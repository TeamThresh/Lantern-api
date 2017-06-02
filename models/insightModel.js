/**
 * Created by YS on 2017-06-01.
 */

 var insightModel = {
 	getUserCount : (context, data) => {
 		return new Promise((resolved, rejected) => {
 			let select = [data.package_name, data.start_date, data.end_date];
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
 			var select = [data.package_name, data.start_date, data.end_date, data.p95];
 			var sql = `SELECT cpu_raw_rate, SUM(cpu_raw_count), activity_name, device_name, os_ver, location_code, COUNT(ver_id) AS user_count
				FROM cpu_raw_table
				INNER JOIN activity_table
					ON act_id = craw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				AND cpu_raw_rate >= ?
				GROUP BY cpu_raw_rate, activity_name, device_name, os_ver, location_code 
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
 			var select = [data.package_name, data.start_date, data.end_date];
 			var sql = `SELECT IF (cpu_raw_rate < 0, 0, cpu_raw_rate) AS cpu_rate, SUM(cpu_raw_count), COUNT(ver_id) AS user_count
				FROM cpu_raw_table
				INNER JOIN activity_table
					ON act_id = craw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				GROUP BY cpu_rate
				ORDER BY cpu_rate ASC `;

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


                let p50 = {count:0};
                let p95 = {count:0};
                let problem_set = [];
                let count = 0;
                let sum = 0;

                data.histogram = [];
                rows.forEach((row) => {
                	data.histogram.push({
                		rate : row.cpu_rate,
                		user_count : row.user_count
                	});
                	count += row.user_count;
                });

                rows.forEach((row)=> {
                	oldSum = sum;
                	sum += row.user_count;
                	let per = sum/count * 100; // 현재 percent
                	if (per > 95) {
                		let stand95 = Math.round(count * 0.95); // p95 기준 유저 수
                		if (oldSum < stand95) {	// 현재 값을 더해야 기준을 넘는 경우
                			let distance = stand95 - oldSum;	// 차를 구함

                			let stand50 = Math.round(count * 0.5);
                			let decresedCount = row.user_count - distance
                			if (oldSum < stand50) {
                				p50.count += distance - stand50;
                				p50.rate = p50.rate == undefined || p50.rate > row.cpu_rate ? row.cpu_rate : p50.rate;
                			} else {
	                			p50.count += distance; // 기준값 까지 p50 에 삽입
	                			p50.rate = p50.rate == undefined || p50.rate > row.cpu_rate ? row.cpu_rate : p50.rate;
	                		}
                			row.user_count = decresedCount;	// 나머지 p95에 삽입
                		}
                		p95.count += row.user_count;
                		p95.rate = p95.rate == undefined || p95.rate > row.cpu_rate ? row.cpu_rate : p95.rate;
                		problem_set.push(row);
                	} else if (per > 50) {
            			let stand50 = Math.round(count * 0.5);
                		if (oldSum < stand50) {	
                			let distance = stand50 - oldSum;
                			row.user_count = row.user_count - distance;	
                		}
                		p50.count += row.user_count;
                		p50.rate = p50.rate == undefined || p50.rate > row.cpu_rate ? row.cpu_rate : p50.rate;
                	}
                });

                data.p95 = p95;
                data.p50 = p50;
                data.p0 = {
                	count: count - p95.count - p50.count,
                	rate: 0
                };

                return resolved(context);
            });
 		});
 	},

 	getMemInsight : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.start_date, data.end_date, data.p95];
 			var sql = `SELECT mem_raw_rate, SUM(mem_raw_count), activity_name, device_name, os_ver, location_code, COUNT(ver_id) AS user_count
				FROM memory_raw_table
				INNER JOIN activity_table
					ON act_id = mraw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				AND mem_raw_rate >= ?
				GROUP BY mem_raw_rate, activity_name, device_name, os_ver, location_code 
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
 			var select = [data.package_name, data.start_date, data.end_date];
 			var sql = `SELECT mem_raw_rate, SUM(mem_raw_count), COUNT(ver_id) AS user_count
				FROM memory_raw_table
				INNER JOIN activity_table
					ON act_id = mraw_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				GROUP BY mem_raw_rate
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


                let p50 = {count:0};
                let p95 = {count:0};
                let problem_set = [];
                let count = 0;
                let sum = 0;

                data.histogram = [];
                rows.forEach((row) => {
                	data.histogram.push({
                		rate : row.mem_raw_rate,
                		user_count : row.user_count
                	});
                	count += row.user_count;
                });

                rows.forEach((row)=> {
                	oldSum = sum;
                	sum += row.user_count;
                	let per = sum/count * 100; // 현재 percent
                	if (per > 95) {
                		let stand95 = Math.round(count * 0.95); // p95 기준 유저 수
                		if (oldSum < stand95) {	// 현재 값을 더해야 기준을 넘는 경우
                			let distance = stand95 - oldSum;	// 차를 구함

                			let stand50 = Math.round(count * 0.5);
                			let decresedCount = row.user_count - distance
                			if (oldSum < stand50) {
                				p50.count += distance - stand50;
                				p50.rate = p50.rate == undefined || p50.rate > row.mem_raw_rate ? row.mem_raw_rate : p50.rate;
                			} else {
	                			p50.count += distance; // 기준값 까지 p50 에 삽입
	                			p50.rate = p50.rate == undefined || p50.rate > row.mem_raw_rate ? row.mem_raw_rate : p50.rate;
	                		}
                			row.user_count = decresedCount;	// 나머지 p95에 삽입
                		}
                		p95.count += row.user_count;
                		p95.rate = p95.rate == undefined || p95.rate > row.mem_raw_rate ? row.mem_raw_rate : p95.rate;
                		problem_set.push(row);
                	} else if (per > 50) {
            			let stand50 = Math.round(count * 0.5);
                		if (oldSum < stand50) {	
                			let distance = stand50 - oldSum;
                			row.user_count = row.user_count - distance;	
                		}
                		p50.count += row.user_count;
                		p50.rate = p50.rate == undefined || p50.rate > row.mem_raw_rate ? row.mem_raw_rate : p50.rate;
                	}
                });

                data.p95 = p95;
                data.p50 = p50;
                data.p0 = {
                	count: count - p95.count - p50.count,
                	rate: 0
                };
                return resolved(context);
            });
 		});
 	},

 	getRenderInsight : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.start_date, data.end_date, data.p95];
 			var sql = `SELECT FLOOR(FLOOR((ui_speed/ui_count)*10)*10) AS ui_rate, 
 				activity_name, device_name, os_ver, location_code, COUNT(ver_id) AS user_count
				FROM ui_table
				INNER JOIN activity_table
					ON act_id = ui_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				AND (ui_speed/ui_count) * 100 >= ?
				GROUP BY ui_rate, activity_name, device_name, os_ver, location_code
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
 			var select = [data.package_name, data.start_date, data.end_date];
 			var sql = `SELECT FLOOR(FLOOR((ui_speed/ui_count)*10)*10) AS ui_rate, COUNT(ver_id) AS user_count
				FROM ui_table
				INNER JOIN activity_table
					ON act_id = ui_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				GROUP BY ui_rate
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

                let p50 = {count:0};
                let p95 = {count:0};
                let problem_set = [];
                let count = 0;
                let sum = 0;

                data.histogram = [];
                rows.forEach((row) => {
                	data.histogram.push({
                		rate : row.ui_rate,
                		user_count : row.user_count
                	});
                	count += row.user_count;
                });

                
                rows.forEach((row)=> {
                	oldSum = sum;
                	sum += row.user_count;
                	let per = sum/count * 100; // 현재 percent
                	if (per > 95) {
                		let stand95 = Math.round(count * 0.95); // p95 기준 유저 수
                		if (oldSum < stand95) {	// 현재 값을 더해야 기준을 넘는 경우
                			let distance = stand95 - oldSum;	// 차를 구함

                			let stand50 = Math.round(count * 0.5);
                			let decresedCount = row.user_count - distance
                			if (oldSum < stand50) {
                				p50.count += distance - stand50;
                				p50.rate = p50.rate == undefined || p50.rate > row.ui_rate ? row.ui_rate : p50.rate;
                			} else {
	                			p50.count += distance; // 기준값 까지 p50 에 삽입
	                			p50.rate = p50.rate == undefined || p50.rate > row.ui_rate ? row.ui_rate : p50.rate;
	                		}
                			row.user_count = decresedCount;	// 나머지 p95에 삽입
                		}
                		p95.count += row.user_count;
                		p95.rate = p95.rate == undefined || p95.rate > row.ui_rate ? row.ui_rate : p95.rate;
                		problem_set.push(row);
                	} else if (per > 50) {
            			let stand50 = Math.round(count * 0.5);
                		if (oldSum < stand50) {	
                			let distance = stand50 - oldSum;
                			row.user_count = row.user_count - distance;	
                		}
                		p50.count += row.user_count;
                		p50.rate = p50.rate == undefined || p50.rate > row.ui_rate ? row.ui_rate : p50.rate;
                	}
                });

                data.p95 = p95;
                data.p50 = p50;
                data.p0 = {
                	count: count - p95.count - p50.count,
                	rate: 0
                };
                return resolved(context);
            });
 		});
 	},

 	getOBCInsight : function(context, data) {
 		return new Promise(function(resolved, rejected) {
 			var select = [data.package_name, data.start_date, data.end_date, data.p95];
 			var sql = `SELECT (FLOOR(host_speed/100)*100) AS host_rate, SUM(host_count) AS host_count, 
 				activity_name, device_name, os_ver, location_code, COUNT(ver_id) AS user_count
				FROM obc_table
				INNER JOIN activity_table
					ON act_id = host_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ? 
				AND host_speed/host_count >= ?
				GROUP BY host_rate, activity_name, device_name, os_ver, location_code 
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
 			var select = [data.package_name, data.start_date, data.end_date];
 			var sql = `SELECT (FLOOR(host_speed/host_count/100)*100) AS host_rate, COUNT(ver_id) AS user_count
				FROM obc_table
				INNER JOIN activity_table
					ON act_id = host_act_id
				INNER JOIN version_table
					ON ver_id = act_ver_id
				WHERE package_name = ?
				AND collect_time BETWEEN ? AND ?
				GROUP BY host_rate
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

                let p50 = {count:0};
                let p95 = {count:0};
                let problem_set = [];
                let count = 0;
                let sum = 0;

                data.histogram = [];
                rows.forEach((row) => {
                	data.histogram.push({
                		rate : row.host_rate,
                		user_count : row.user_count
                	});
                	count += row.user_count;
                });

                
                rows.forEach((row)=> {
                	oldSum = sum;
                	sum += row.user_count;
                	let per = sum/count * 100; // 현재 percent
                	if (per > 95) {
                		let stand95 = Math.ceil(count * 0.95); // p95 기준 유저 수
                		if (oldSum < stand95) {	// 현재 값을 더해야 기준을 넘는 경우
                			let distance = stand95 - oldSum;	// 차를 구함

                			let stand50 = Math.ceil(count * 0.5);
                			let decresedCount = row.user_count - distance
                			if (oldSum < stand50) {
                				p50.count += distance - stand50;
                				p50.rate = p50.rate == undefined || p50.rate > row.host_rate ? row.host_rate : p50.rate;
                			} else {
	                			p50.count += distance; // 기준값 까지 p50 에 삽입
	                			p50.rate = p50.rate == undefined || p50.rate > row.host_rate ? row.host_rate : p50.rate;
	                		}
                			row.user_count = decresedCount;	// 나머지 p95에 삽입
                		}
                		p95.count += row.user_count;
                		p95.rate = p95.rate == undefined || p95.rate > row.host_rate ? row.host_rate : p95.rate;
                		problem_set.push(row);
                	} else if (per > 50) {
            			let stand50 = Math.ceil(count * 0.5);
                		if (oldSum < stand50) {	
                			let distance = stand50 - oldSum;
                			row.user_count = row.user_count - distance;	
                		}
                		p50.count += row.user_count;
                		p50.rate = p50.rate == undefined || p50.rate > row.host_rate ? row.host_rate : p50.rate;
                	}
                });

                data.p95 = p95;
                data.p50 = p50;
                data.p0 = {
                	count: count - p95.count - p50.count,
                	rate: 0
                };
                return resolved(context);
            });
 		});
 	},
 };

 module.exports = insightModel;