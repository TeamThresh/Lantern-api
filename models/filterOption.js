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