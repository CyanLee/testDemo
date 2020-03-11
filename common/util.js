function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		if (str) {
			var a = str.split(/[^0-9]/);
			return new Date(a.length > 0 ? a[0] : 0,
				a.length > 1 ? (a[1] - 1) : 0,
				a.length > 2 ? a[2] : 0,
				a.length > 3 ? a[3] : 0,
				a.length > 4 ? a[4] : 0,
				a.length > 5 ? a[5] : 0);
		} else {
			return ''
		}
	},
	compareDate: function(date, cpDate) {
		let differ = date.getTime() - cpDate.getTime()
		if (differ > 0)
			return 1
		else if (differ == 0)
			return 0
		else
			return -1
	},
	formatDateYMDH: function(date) {
		if (!date) return '';
		var myyear = date.getFullYear();
		var mymonth = date.getMonth() + 1;
		var myweekday = date.getDate();
		var myHours = date.getHours();

		if (mymonth < 10) {
			mymonth = "0" + mymonth;
		}
		if (myweekday < 10) {
			myweekday = "0" + myweekday;
		}
		if (myHours < 10) {
			myHours = "0" + myHours;
		}
		return (myyear + "-" + mymonth + "-" + myweekday + " " + myHours);
	},
	formatDateYMD: function(date) {
		if (!date) return '';
		var myyear = date.getFullYear();
		var mymonth = date.getMonth() + 1;
		var myweekday = date.getDate();
	
		if (mymonth < 10) {
			mymonth = "0" + mymonth;
		}
		if (myweekday < 10) {
			myweekday = "0" + myweekday;
		}
		
		return (myyear + "-" + mymonth + "-" + myweekday);
	},
	formatDateYMDHM: function(date) {
		if (!date) return '';
		var myyear = date.getFullYear();
		var mymonth = date.getMonth() + 1;
		var myweekday = date.getDate();

		if (mymonth < 10) {
			mymonth = "0" + mymonth;
		}
		if (myweekday < 10) {
			myweekday = "0" + myweekday;
		}
		var myHours = date.getHours();
		if (myHours > 0) {
			if (myHours < 10) {
				myHours = "0" + myHours;
			}
			var myMinutes = date.getMinutes();
			if (myMinutes > 0) {
				if (myMinutes < 10) {
					myMinutes = "0" + myMinutes;
				}
				return (myyear + "-" + mymonth + "-" + myweekday + " " + myHours + ":" + myMinutes);
			} else {
				return (myyear + "-" + mymonth + "-" + myweekday + " " + myHours);
			}

		} else {
			return (myyear + "-" + mymonth + "-" + myweekday);
		}
	},
	formatDateYMDHMS: function(date) {
		if (!date) return '';
		var myyear = date.getFullYear();
		var mymonth = date.getMonth() + 1;
		var myweekday = date.getDate();
		var myHours = date.getHours();
		var myMinutes = date.getMinutes();
		var mySeconds = date.getSeconds();
	
		if (mymonth < 10) {
			mymonth = "0" + mymonth;
		}
		if (myweekday < 10) {
			myweekday = "0" + myweekday;
		}
		if (myHours < 10) {
			myHours = "0" + myHours;
		}
		if (myMinutes < 10) {
			myMinutes = "0" + myMinutes;
		}
		if (mySeconds < 10) {
			mySeconds = "0" + mySeconds;
		}
		return (myyear + "-" + mymonth + "-" + myweekday + " " + myHours + ":" + myMinutes + ":" + mySeconds);
	},
	//格式化日期：yyyy-MM-dd hh:mm:ss 只支持固定格式,注意传值
	// formatDate:function(date,format){
	//     var myyear = date.getFullYear();
	//     var mymonth = date.getMonth() + 1;
	//     var myweekday = date.getDate();
	// 	var myHours = date.getHours();
	// 	var myMinutes = date.getMinutes();
	// 	var mySeconds = date.getSeconds();

	// 	let resulte = ''
	// 	let isExit = false
	// 	if(format.indexOf('yyyy')!=-1){
	// 		resulte = myyear
	// 		isExit = true
	// 	}else{isExit = false}

	// 	if(format.indexOf('yyyy')!=-1){
	// 		resulte = myyear
	// 		isExit = true
	// 	}else{isExit = false}

	// 	if(format.indexOf('yyyy')!=-1){
	// 		resulte = myyear
	// 		isExit = true
	// 	}else{isExit = false}

	// 	if(format.indexOf('yyyy')!=-1){
	// 		resulte = myyear
	// 		isExit = true
	// 	}else{isExit = false}

	// 	if(format.indexOf('yyyy')!=-1){
	// 		resulte = myyear
	// 		isExit = true
	// 	}else{isExit = false}

	// 	if(format.indexOf('yyyy')!=-1){
	// 		resulte = myyear
	// 		isExit = true
	// 	}else{isExit = false}

	//     if (mymonth < 10) {
	//         mymonth = "0" + mymonth;
	//     }
	//     if (myweekday < 10) {
	//         myweekday = "0" + myweekday;
	//     }
	//     return (myyear + "-" + mymonth + "-" + myweekday);
	// }
}

var stringUtils = {
	isEmpty:function(str){
		if(str == '' || str == null || str == ' ' || str == 'undefine'){
			return true
		}else{
			return false
		}
	}
}

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	stringUtils: stringUtils
}
