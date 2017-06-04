module.exports.calculatePValue = function(array, count, problem_set) {
    let sum = 0;

    let p95 = {
    	count: count - Math.round(count * 0.95),
    	accumCount : Math.round(count * 0.95)
	};
    let p50 = {
    	count: count - Math.round(count * 0.5) - p95.count,
    	accumCount : Math.round(count * 0.5)
    };
    let p10 = {
    	count: count - Math.round(count * 0.1) - p50.count - p95.count,
    	accumCount : Math.round(count * 0.1)
    };

    array.forEach((row)=> {
    	let oldSum = sum;
    	sum += row.user_count;
    	let per = sum/count * 100; // 현재 percent
    	if (sum >= p95.accumCount) {
    		if (oldSum < p95.accumCount) {	// 현재 값을 더해야 기준을 넘는 경우

    			if (oldSum < p50.accumCount) {
        			p50.rate = p50.rate == undefined || p50.rate > row.rate ? row.rate : p50.rate;

        			if (oldSum < p10.accumCount) {
        				p10.rate = p10.rate == undefined || p10.rate > row.rate ? row.rate : p10.rate;
        			} 
        		}
    		}
    		p95.rate = p95.rate == undefined || p95.rate > row.rate ? row.rate : p95.rate;
    		problem_set.push(row);
    	} else if (sum >= p50.accumCount) {
			if (oldSum < p10.accumCount) {
				p10.rate = p10.rate == undefined || p10.rate > row.rate ? row.rate : p10.rate;
			} 
    		p50.rate = p50.rate == undefined || p50.rate > row.rate ? row.rate : p50.rate;
    	} else if (sum >= p10.accumCount) {
    		p10.rate = p10.rate == undefined || p10.rate > row.rate ? row.rate : p10.rate;
    	}
    });

	return {
		p10: p10, 
		p50: p50, 
		p95: p95
	};     
}