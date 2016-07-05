var Util = require('util');


var Timer = {
	create: () => {
		var timer = {
			stTime:new Date(),
			time:0,
			endTime:0
		};

		// var timer.stTime = new Date();
		// var timer.time = 0;

		timer.end = () => {
			timer.endTime = new Date();
			// timer.time = timer.endTime.getTime() - timer.stTime.getTime();
			timer.time = timer.endTime - timer.stTime;
			console.log('timer的间隔时间:'+timer.time);
		}

		return timer;
	}
}



exports.Timer = Timer;