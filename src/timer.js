var Util = require('util');


var Timer = {
	create: () => {
		var timer = {};

		var timer.stTime = new Date();
		var timer.time = 0;

		timer.end = () => {
			var timer.endTime = new Date();
			timer.time = timer.endTime - timer.stTime;
		}

		return timer;
	}
}



exports.Timer = Timer;