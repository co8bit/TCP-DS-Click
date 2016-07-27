var CONFIG = require('../config/config');
var util   = require('./util');
var notify   = require('./notify');



var run = (statistics) => {
	return new Promise( (resolve,reject) => {
		//邮件发送的结果
		var stat = {
			powerTest_monetdbArray_X:[],
			powerTest_monetdbArray_Y:[],
			powerTest_monetdbFailArray:[],
		};

		//powerTest calc
		statistics.powerTest_monetdb = 0;
		for (v of statistics.powerTest_monetdbArray)
		{
			time = parseFloat(v.time);
			stat.powerTest_monetdbArray_X.push(v.i);
			stat.powerTest_monetdbArray_Y.push(time);
			if (v.type == 'fail')
			{
				var tmp = [];
				tmp.push({
					name:'失败',
					xAxis:v.i,
					yAxis:time,
				});
				tmp.push({
					xAxis:v.i,
					yAxis:0,
				});
				stat.powerTest_monetdbFailArray.push(tmp);
			}
			statistics.powerTest_monetdb += parseFloat(time);
		}
		statistics.powerTest_monetdb = statistics.powerTest_monetdb.toFixed(3);

		//throughput calc
		statistics.throughputTest_monetdb = 0;
		for (v of statistics.throughputTest_monetdbArray)
		{
			statistics.throughputTest_monetdb += parseFloat(v.time);
		}
		statistics.throughputTest_monetdb = statistics.throughputTest_monetdb.toFixed(3);
		
		console.log(stat);

		notify.notify(stat);

		resolve();
	});
}

exports.run = run;