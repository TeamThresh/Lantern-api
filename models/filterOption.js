module.exports.addFullOption = (filter, select) => {
	let sql = "";

    if (filter != undefined) {
	    if (filter.app != undefined) {
	        sql += "AND app_ver = ? ";
	        select.push(filter.app);
	    }
	    
	    if (filter.dateRange != undefined) {
	        sql += "AND collect_time BETWEEN ? AND ? ";
	        select.push(filter.dateRange.start, filter.dateRange.end);
	    }

	    if (filter.location != undefined) {
	        sql += "AND `location_code` IN (?) ";
	        select.push(filter.location);
	    }
        if (filter.device != undefined) {
            sql += "AND `device_name` IN (?) ";
            select.push(filter.device);
        }
	    if (filter.os != undefined) {
	        sql += "AND `os_ver` IN (?) ";
	        select.push(filter.os);
	    }
	    if (filter.activity_name != undefined) {
	        sql += "AND `activity_name` IN (?) ";
	        select.push(filter.activity_name);
	    }

	    if (filter.nlocation != undefined) {
	        sql += "AND `location_code` NOT IN (?) ";
	        select.push(filter.nlocation);
	    }
        if (filter.ndevice != undefined) {
            sql += "AND `device_name` NOT IN (?) ";
            select.push(filter.ndevice);
        }
	    if (filter.nos != undefined) {
	        sql += "AND `os_ver` NOT IN (?) ";
	        select.push(filter.nos);
	    }
	    if (filter.nactivity_name != undefined) {
	        sql += "AND `activity_name` NOT IN (?) ";
	        select.push(filter.nactivity_name);
	    }
	}

	return sql;
}

module.exports.addActivityOption = (filter, select) => {
	let sql = "";
    if (filter != undefined) {
        if (filter.activity_name != undefined) {
            sql += "AND `activity_name` IN (?) ";
            select.push(filter.activity_name);
        }

        if (filter.nactivity_name != undefined) {
            sql += "AND `activity_name` NOT IN (?) ";
            select.push(filter.nactivity_name);
        }

        if (filter.dateRange != undefined) {
            sql += "AND collect_time BETWEEN ? AND ? ";
            select.push(filter.dateRange.start, filter.dateRange.end);
        }
    }

    return sql;
}

/**
 * 
 * @param filter (Array)
 * @param sql (String)
 * @param array (Array)
 * @param except (Array) 
 */
module.exports.addExceptOption = (filter, select, except) => {

	let sql = "";
    if (filter != undefined) {

    	// 제외시킬 필터 undefined 로 변경
    	let filterName = Object.keys(filter);
    	filterName = filterName.forEach((filterItem) => {
    		except.some((exceptItem) => {
    			if (filterItem == exceptItem) {
					filter[filterItem] = undefined;
					return true;
				} else if (filterItem == "n"+exceptItem) {
					filter[filterItem] = undefined;
					return true;
				}
				return false;
    		});
    	});

	    if (filter.app != undefined) {
	        sql += "AND app_ver = ? ";
	        select.push(filter.app);
	    }
	    
	    if (filter.dateRange != undefined) {
	        sql += "AND collect_time BETWEEN ? AND ? ";
	        select.push(filter.dateRange.start, filter.dateRange.end);
	    }

	    if (filter.location != undefined) {
	        sql += "AND `location_code` IN (?) ";
	        select.push(filter.location);
	    }
        if (filter.device != undefined) {
            sql += "AND `device_name` IN (?) ";
            select.push(filter.device);
        }
	    if (filter.os != undefined) {
	        sql += "AND `os_ver` IN (?) ";
	        select.push(filter.os);
	    }
	    if (filter.activity_name != undefined) {
	        sql += "AND `activity_name` IN (?) ";
	        select.push(filter.activity_name);
	    }

	    if (filter.nlocation != undefined) {
	        sql += "AND `location_code` NOT IN (?) ";
	        select.push(filter.nlocation);
	    }
        if (filter.ndevice != undefined) {
            sql += "AND `device_name` NOT IN (?) ";
            select.push(filter.ndevice);
        }
	    if (filter.nos != undefined) {
	        sql += "AND `os_ver` NOT IN (?) ";
	        select.push(filter.nos);
	    }
	    if (filter.nactivity_name != undefined) {
	        sql += "AND `activity_name` NOT IN (?) ";
	        select.push(filter.nactivity_name);
	    }
	}

	return sql;
}

module.exports.addMongoFullOption = (filter, query) => {

    if (filter != undefined) {
	    if (filter.app != undefined) {
	        query["device_info.app"] = filter.app;
	    }
	    
	    if (filter.dateRange != undefined) {
	        query["data.duration_time.start"] = { $gt : new Date(filter.dateRange.start).getTime(), $lt : new Date(filter.dateRange.end).getTime() },
	        query["data.duration_time.end"] = { $gt : new Date(filter.dateRange.start).getTime(), $lt : new Date(filter.dateRange.end).getTime() }
	    }

	    if (filter.location != undefined) {
	        query["device_info.location"].$eq = filter.location;
	    }
        if (filter.device != undefined) {
            query["device_info.device"].$eq = filter.device;
        }
	    if (filter.os != undefined) {
	        query["device_info.os"].$eq = filter.os;
	    }
	    if (filter.activity_name != undefined) {
	        query["data.app.activity_stack"].$eq = filter.activity_name;
	    }

	    if (filter.nlocation != undefined) {
	        query["device_info.location"].$ne = filter.nlocation;
	    }
        if (filter.ndevice != undefined) {
            query["device_info.device"].$ne = filter.ndevice;
        }
	    if (filter.nos != undefined) {
	        query["device_info.os"].$ne = filter.nos;
	    }
	    if (filter.nactivity_name != undefined) {
	        query["data.app.activity_stack"].$ne = filter.nactivity_name;
	    }
	}
}

module.exports.addMongoInsightOption = (filter, query) => {
    if (filter != undefined) {
		switch(filter.type) {
			case "cpu":
				break;
			case "memory":
        		query["data.app.memory.alloc"] = { $gt : filter.p95 * 1000 };
        		break;
		}

	    if (filter.app != undefined) {
	        query["device_info.app"] = filter.app;
	    }
	    
	    if (filter.start_date != undefined && filter.end_date != undefined) {
	        query["data.duration_time.start"] = { $gt : new Date(filter.start_date).getTime(), $lt : new Date(filter.end_date).getTime() },
	        query["data.duration_time.end"] = { $gt : new Date(filter.start_date).getTime(), $lt : new Date(filter.end_date).getTime() }
	    }

	}

}

module.exports.addUserOption = (filter, select) => {
	let sql = "";

    if (filter != undefined) {
	    if (filter.app != undefined) {
	        sql += "AND uuid = ? ";
	        select.push(filter.uuid);
	    }
	}

	return sql;
}
