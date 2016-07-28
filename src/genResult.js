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
		stat.powerTest_monetdb = 0;
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
			stat.powerTest_monetdb += time;
		}
		stat.powerTest_monetdb = stat.powerTest_monetdb.toFixed(3);

		//throughput calc
		var streamNumArray = [];
		for(var i = 0; i < CONFIG.config.stream_num; i++)
		{
			streamNumArray.push(i);
		}
		stat.throughputTest_monetdb          = 0;//总时间
		stat.throughputTest_monetdb_stream   = [];//每个流的总时间
		stat.throughputTest_monetdbArray_X   = [];
		stat.throughputTest_monetdbArray_Y   = [];
		stat.throughputTest_monetdbFailArray = [];

		for (v of statistics.throughputTest_monetdbArray)
		{
			if (typeof(stat.throughputTest_monetdbArray_X[v.streamNo]) === 'undefined')
			{
				stat.throughputTest_monetdb_stream[v.streamNo]   = 0;
				stat.throughputTest_monetdbArray_X[v.streamNo]   = [];
				stat.throughputTest_monetdbArray_Y[v.streamNo]   = [];
				stat.throughputTest_monetdbFailArray[v.streamNo] = [];
			}

			time = parseFloat(v.time);
			stat.throughputTest_monetdbArray_X[v.streamNo].push(v.i);
			stat.throughputTest_monetdbArray_Y[v.streamNo].push(time);
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
				stat.throughputTest_monetdbFailArray[v.streamNo].push(tmp);
			}
			stat.throughputTest_monetdb += time;
			stat.throughputTest_monetdb_stream[v.streamNo] += time;
		}
		stat.throughputTest_monetdb = stat.throughputTest_monetdb.toFixed(3);
		streamNumArray.forEach( (streamNo) => {
			if (typeof(stat.throughputTest_monetdb_stream[v.streamNo]) !== 'undefined')//允许部分执行
			{
				stat.throughputTest_monetdb_stream[streamNo] = stat.throughputTest_monetdb_stream[streamNo].toFixed(3);
			}
		})





		console.log(stat);

		notify.notify(stat);//email
		resolve();
	});
}

exports.run = run;