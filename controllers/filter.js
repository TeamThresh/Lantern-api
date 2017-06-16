

module.exports = {
	setFilter : function(query) {
		let filter = {};

        // 크래시 필터
        if (query.crashId != undefined && query.crashId != '') {
            filter.crashId = Number(query.crashId);
        }

        // 기간 필터
        let dateRange = {};
        if (query.startRange != undefined && query.startRange != '') {
            //dateRange.start = query.startRange
            let temp_date = new Date(Number(query.startRange)).toISOString().split('T');
            dateRange.start = temp_date[0]+" "+temp_date[1].split('.')[0];
        }
        if (query.endRange != undefined && query.endRange != '') {
            //dateRange.end = query.endRange
            let temp_date = new Date(Number(query.endRange)).toISOString().split('T');
            dateRange.end = temp_date[0]+" "+temp_date[1].split('.')[0];
        }
        if (dateRange.start != undefined && dateRange.end != undefined) {
            filter.dateRange = dateRange;
        }

        // 사용량 필터
        let usageRange = {};
        if (query.startUsage != undefined && query.startUsage != '') {
            usageRange.start = query.startUsage;
        }
        if (query.endUsage != undefined && query.endUsage != '') {
            usageRange.end = query.endUsage;
        }
        if (usageRange.start != undefined && usageRange.end != undefined) {
            filter.usageRange = usageRange;
        }

        if (query.app != undefined && query.app != '')
            filter.app = query.app;

        // 지역, 기기, os, Activity 필터
        if (query.location != undefined && query.location != '')
            filter.location = query.location.split(',');
        if (query.device != undefined && query.device != '')
            filter.device = query.device.split(',');
        if (query.os != undefined && query.os != '')
            filter.os = query.os.split(',');
        if (query.activity != undefined && query.activity != '')
            filter.activity = query.activity.split(',');

        if (query.nlocation != undefined && query.nlocation != '') {
        	filter.nlocation = query.nlocation.split(',');
        	filter.location = undefined;
        }
        if (query.ndevice != undefined && query.ndevice != '') {
        	filter.ndevice = query.ndevice.split(',');
        	filter.device = undefined;
        }
        if (query.nos != undefined && query.nos != '') {
        	filter.nos = query.nos.split(',');
        	filter.os = undefined;
        }
        if (query.nactivity != undefined && query.nactivity != '') {
        	filter.nactivity = query.nactivity.split(',');
        	filter.activity = undefined;
        }

        if (query.uuid != undefined && query.uuid != '') {
            filter.uuidList = query.uuid.split(',');
        }

        return filter;
	}
}