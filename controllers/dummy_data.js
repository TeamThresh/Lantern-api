module.exports = {
	userflow : [
		[{
			name : A_activity,
			data : {
				thru : 150,
				dest : [{
					name : B_activity,
					quan : 50
				}, {
					name : C_activity,
					quan : 40
				}, {
					name : D_activity,
					quan : 30
				}, {
					name : E_activity,
					quan : 30
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : B_activity,
			data : {
				thru : 0,
				dest : [],
				crash : 0,
				exit : 0
			}
		}, {
			name : C_activity,
			data : {
				thru : 50,
				dest : [{
					name : B_activity,
					quan : 30
				}, {
					name : D_activity,
					quan : 10
				}, {
					name : A_activity,
					quan : 10
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : D_activity,
			data : {
				thru : 50,
				dest : [{
					name : A_activity,
					quan : 30
				}, {
					name : B_activity,
					quan : 10
				}, {
					name : C_activity,
					quan : 10
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : E_activity,
			data : {
				thru : 0,
				dest : [],
				crash : 0,
				exit : 0
			}
		}], [{
			name : A_activity,
			data : {
				thru : 150,
				dest : [{
					name : B_activity,
					quan : 50
				}, {
					name : C_activity,
					quan : 40
				}, {
					name : D_activity,
					quan : 30
				}, {
					name : E_activity,
					quan : 30
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : B_activity,
			data : {
				thru : 0,
				dest : [],
				crash : 0,
				exit : 0
			}
		}, {
			name : C_activity,
			data : {
				thru : 50,
				dest : [{
					name : B_activity,
					quan : 30
				}, {
					name : D_activity,
					quan : 10
				}, {
					name : A_activity,
					quan : 10
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : D_activity,
			data : {
				thru : 50,
				dest : [{
					name : A_activity,
					quan : 30
				}, {
					name : B_activity,
					quan : 10
				}, {
					name : C_activity,
					quan : 10
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : E_activity,
			data : {
				thru : 0,
				dest : [],
				crash : 0,
				exit : 0
			}
		}], [{
			name : A_activity,
			data : {
				thru : 150,
				dest : [{
					name : B_activity,
					quan : 50
				}, {
					name : C_activity,
					quan : 40
				}, {
					name : D_activity,
					quan : 30
				}, {
					name : E_activity,
					quan : 30
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : B_activity,
			data : {
				thru : 0,
				dest : [],
				crash : 0,
				exit : 0
			}
		}, {
			name : C_activity,
			data : {
				thru : 50,
				dest : [{
					name : B_activity,
					quan : 30
				}, {
					name : D_activity,
					quan : 10
				}, {
					name : A_activity,
					quan : 10
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : D_activity,
			data : {
				thru : 50,
				dest : [{
					name : A_activity,
					quan : 30
				}, {
					name : B_activity,
					quan : 10
				}, {
					name : C_activity,
					quan : 10
				}],
				crash : 0,
				exit : 0
			}
		}, {
			name : E_activity,
			data : {
				thru : 0,
				dest : [],
				crash : 0,
				exit : 0
			}
		}]

	]
};