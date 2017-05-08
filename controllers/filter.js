

module.exports = {
	setFilter : function(query) {
		let filter = {};

        // 기간 필터
        let dateRange = {};
        if (query.startRange != undefined) {
            //dateRange.start = query.startRange
            let temp_date = new Date(Number(query.startRange)).toISOString().split('T');
            dateRange.start = temp_date[0]+" "+temp_date[1].split('.')[0];
        }
        if (query.endRange != undefined) {
            //dateRange.end = query.endRange
            let temp_date = new Date(Number(query.endRange)).toISOString().split('T');
            dateRange.end = temp_date[0]+" "+temp_date[1].split('.')[0];
        }
        if (dateRange.start != undefined && dateRange.end != undefined) {
            filter.dateRange = dateRange;
        }

        // 사용량 필터
        let usageRange = {};
        if (query.startUsage != undefined) {
            usageRange.start = query.startUsage;
        }
        if (query.endUsage != undefined) {
            usageRange.end = query.endUsage;
        }
        if (usageRange.start != undefined && usageRange.end != undefined) {
            filter.usageRange = usageRange;
        }

        // 지역, 기기, os, Activity 필터
        if (query.location != undefined)
            filter.location = query.location.split(',');
        if (query.device != undefined)
            filter.device = query.device.split(',');
        if (query.os != undefined)
            filter.os = query.os.split(',');
        if (query.activity != undefined)
            filter.activity_name = query.activity.split(',');

        if (query.nlocation != undefined) {
        	filter.nlocation = query.nlocation.split(',');
        	filter.location = undefined;
        }
        if (query.ndevice != undefined) {
        	filter.ndevice = query.ndevice.split(',');
        	filter.device = undefined;
        }
        if (query.nos != undefined) {
        	filter.nos = query.nos.split(',');
        	filter.os = undefined;
        }
        if (query.nactivity != undefined) {
        	filter.nactivity_name = query.nactivity.split(',');
        	filter.activity_name = undefined;
        }

        return filter;
	}
}