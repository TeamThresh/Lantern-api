

module.exports = {
	setFilter : function(query) {
		let filter = {};

        if (query.location != undefined)
            filter.location = query.location.split(',');
        if (query.device != undefined)
            filter.device = query.device.split(',');
        if (query.os != undefined)
            filter.os = query.os.split(',');
        if (query.activity_name != undefined)
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
        if (query.nactivity_name != undefined) {
        	filter.nactivity_name = query.nactivity_name.split(',');
        	filter.activity_name = undefined;
        }

        return filter;
	}
}