module.exports.addFullOption = (filter, sql, array) => {

    if (filter != undefined) {
	    if (filter.app != undefined) {
	        sql += "AND app_ver = ? ";
	        array.push(filter.app);
	    }
	    
	    if (filter.dateRange != undefined) {
	        sql += "AND collect_time BETWEEN ? AND ? ";
	        array.push(filter.dateRange.start, filter.dateRange.end);
	    }

	    if (filter.location != undefined) {
	        sql += "AND `location_code` IN (?) ";
	        array.push(filter.location);
	    }
        if (filter.device != undefined) {
            sql += "AND `device_name` IN (?) ";
            select.push(filter.device);
        }
	    if (filter.os != undefined) {
	        sql += "AND `os_ver` IN (?) ";
	        array.push(filter.os);
	    }
	    if (filter.activity_name != undefined) {
	        sql += "AND `activity_name` IN (?) ";
	        array.push(filter.activity_name);
	    }

	    if (filter.nlocation != undefined) {
	        sql += "AND `location_code` NOT IN (?) ";
	        array.push(filter.nlocation);
	    }
        if (filter.ndevice != undefined) {
            sql += "AND `device_name` NOT IN (?) ";
            select.push(filter.ndevice);
        }
	    if (filter.nos != undefined) {
	        sql += "AND `os_ver` NOT IN (?) ";
	        array.push(filter.nos);
	    }
	    if (filter.nactivity_name != undefined) {
	        sql += "AND `activity_name` NOT IN (?) ";
	        array.push(filter.nactivity_name);
	    }
	}
}

module.exports.addActivityOption = (filter, sql, array) => {

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
}

/**
 * 
 * @param filter (Array)
 * @param sql (String)
 * @param array (Array)
 * @param except (Array) 
 */
module.exports.addExceptOption = (filter, sql, array, except) => {

    if (filter != undefined) {

    	// 제외시킬 필터 undefined 로 변경
    	filter = filter.filter((filterItem) => {
    		return !except.some((exceptItem) => {
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
	        array.push(filter.app);
	    }
	    
	    if (filter.dateRange != undefined) {
	        sql += "AND collect_time BETWEEN ? AND ? ";
	        array.push(filter.dateRange.start, filter.dateRange.end);
	    }

	    if (filter.location != undefined) {
	        sql += "AND `location_code` IN (?) ";
	        array.push(filter.location);
	    }
        if (filter.device != undefined) {
            sql += "AND `device_name` IN (?) ";
            select.push(filter.device);
        }
	    if (filter.os != undefined) {
	        sql += "AND `os_ver` IN (?) ";
	        array.push(filter.os);
	    }
	    if (filter.activity_name != undefined) {
	        sql += "AND `activity_name` IN (?) ";
	        array.push(filter.activity_name);
	    }

	    if (filter.nlocation != undefined) {
	        sql += "AND `location_code` NOT IN (?) ";
	        array.push(filter.nlocation);
	    }
        if (filter.ndevice != undefined) {
            sql += "AND `device_name` NOT IN (?) ";
            select.push(filter.ndevice);
        }
	    if (filter.nos != undefined) {
	        sql += "AND `os_ver` NOT IN (?) ";
	        array.push(filter.nos);
	    }
	    if (filter.nactivity_name != undefined) {
	        sql += "AND `activity_name` NOT IN (?) ";
	        array.push(filter.nactivity_name);
	    }
	}
}