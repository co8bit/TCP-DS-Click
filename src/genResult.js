var CONFIG = require('../config/config');
var util   = require('./util');
var notify   = require('./notify');



var run = (statistics) => {
	return new Promise( (resolve,reject) => {
		//邮件发送的结果
		var stat = {
			//common
			totalSqlNum : 0,//sql语句总数
			avgTotalSqlNum : 0,//sql语句总数的平均数

			//monetdb
			monetdbQphDS : 0,
			load_monetdb : 0,

			powerTest_monetdb : 0,
			powerTest_monetdbArray_X:[],
			powerTest_monetdbArray_Y:[],
			powerTest_monetdbFailArray:[],

			throughputTest_monetdb          : 0,//总时间
			throughputTest_monetdb_stream   : [],//每个流的总时间
			throughputTest_monetdbArray_X   : [],
			throughputTest_monetdbArray_Y   : [],
			throughputTest_monetdbFailArray : [],



			//mysql
			mysqlQphDS : 0,
			load_mysql : 0,

			powerTest_mysql : 0,
			powerTest_mysqlArray_X:[],
			powerTest_mysqlArray_Y:[],
			powerTest_mysqlFailArray:[],

			throughputTest_mysql          : 0,//总时间
			throughputTest_mysql_stream   : [],//每个流的总时间
			throughputTest_mysqlArray_X   : [],
			throughputTest_mysqlArray_Y   : [],
			throughputTest_mysqlFailArray : [],
		};

		/**
		 * common
		 */
		stat.load_monetdb = parseFloat(statistics.load_monetdb);
		if (CONFIG.config.report_display_reciprocal)
				stat.load_monetdb = parseFloat((1/stat.load_monetdb).toFixed(3));
		stat.load_mysql   = parseFloat(statistics.load_mysql);
		if (CONFIG.config.report_display_reciprocal)
				stat.load_mysql = parseFloat((1/stat.load_mysql).toFixed(3));

		/**
		 * powerTest calc
		 */
		//monetdb
		for (v of statistics.powerTest_monetdbArray)
		{
			time = parseFloat(v.time);
			if (CONFIG.config.report_display_reciprocal)
				time = parseFloat((1/time).toFixed(3));
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
			++stat.totalSqlNum;
		}
		stat.powerTest_monetdb = parseFloat(stat.powerTest_monetdb.toFixed(3));

		//mysql
		for (v of statistics.powerTest_mysqlArray)
		{
			time = parseFloat(v.time);
			if (CONFIG.config.report_display_reciprocal)
				time = parseFloat((1/time).toFixed(3));
			stat.powerTest_mysqlArray_X.push(v.i);
			stat.powerTest_mysqlArray_Y.push(time);
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
				stat.powerTest_mysqlFailArray.push(tmp);
			}
			stat.powerTest_mysql += time;
			// ++stat.totalSqlNum;因为每种数据库sql总数都一样，所以只统计一遍
		}
		stat.powerTest_mysql = parseFloat(stat.powerTest_mysql.toFixed(3));





		/**
		 * throughput calc
		 */
		//common
		var streamNumArray = [];
		for(var i = 0; i < CONFIG.config.stream_num; i++)
		{
			streamNumArray.push(i);
		}

		//monetdb
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
			if (CONFIG.config.report_display_reciprocal)
				time = parseFloat((1/time).toFixed(3));
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
			++stat.totalSqlNum;
		}
		stat.throughputTest_monetdb = parseFloat(stat.throughputTest_monetdb.toFixed(3));
		streamNumArray.forEach( (streamNo) => {
			if (typeof(stat.throughputTest_monetdb_stream[v.streamNo]) !== 'undefined')//允许部分执行
			{
				stat.throughputTest_monetdb_stream[streamNo] = parseFloat(stat.throughputTest_monetdb_stream[streamNo].toFixed(3));
			}
		})

		//mysql
		for (v of statistics.throughputTest_mysqlArray)
		{
			if (typeof(stat.throughputTest_mysqlArray_X[v.streamNo]) === 'undefined')
			{
				stat.throughputTest_mysql_stream[v.streamNo]   = 0;
				stat.throughputTest_mysqlArray_X[v.streamNo]   = [];
				stat.throughputTest_mysqlArray_Y[v.streamNo]   = [];
				stat.throughputTest_mysqlFailArray[v.streamNo] = [];
			}

			time = parseFloat(v.time);
			if (CONFIG.config.report_display_reciprocal)
				time = parseFloat((1/time).toFixed(3));
			stat.throughputTest_mysqlArray_X[v.streamNo].push(v.i);
			stat.throughputTest_mysqlArray_Y[v.streamNo].push(time);
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
				stat.throughputTest_mysqlFailArray[v.streamNo].push(tmp);
			}
			stat.throughputTest_mysql += time;
			stat.throughputTest_mysql_stream[v.streamNo] += time;
			// ++stat.totalSqlNum;因为每种数据库sql总数都一样，所以只统计一遍
		}
		stat.throughputTest_mysql = parseFloat(stat.throughputTest_mysql.toFixed(3));
		streamNumArray.forEach( (streamNo) => {
			if (typeof(stat.throughputTest_mysql_stream[v.streamNo]) !== 'undefined')//允许部分执行
			{
				stat.throughputTest_mysql_stream[streamNo] = parseFloat(stat.throughputTest_mysql_stream[streamNo].toFixed(3));
			}
		})





		/**
		 * calc QphDS
		 */
		//common
		stat.avgTotalSqlNum = Math.round( stat.totalSqlNum / (CONFIG.config.stream_num+1) );
		var member = stat.avgTotalSqlNum * 1 * 3600 * CONFIG.config.stream_num * CONFIG.config.scale;//分子

		//monetdb
		var throughputTest_monetdb = stat.throughputTest_monetdb;
		var load_monetdb           = stat.load_monetdb;
		if (CONFIG.config.report_display_reciprocal)
		{
			throughputTest_monetdb = parseFloat((1/stat.throughputTest_monetdb).toFixed(3));
			load_monetdb           = parseFloat((1/stat.load_monetdb).toFixed(3));
		}
		var monetdbDenominator = throughputTest_monetdb + (0.01 * CONFIG.config.stream_num * load_monetdb);//分母
		stat.monetdbQphDS = Math.round(member / monetdbDenominator);

		//mysql
		var throughputTest_mysql = stat.throughputTest_mysql;
		var load_mysql           = stat.load_mysql;
		if (CONFIG.config.report_display_reciprocal)
		{
			throughputTest_mysql = parseFloat((1/stat.throughputTest_mysql).toFixed(3));
			load_mysql           = parseFloat((1/stat.load_mysql).toFixed(3));
		}
		var mysqlDenominator = throughputTest_mysql + (0.01 * CONFIG.config.stream_num * load_mysql);//分母
		stat.mysqlQphDS = Math.round(member / mysqlDenominator);







		console.log(stat);

		// console.log('member:'+member);
		// console.log('stat.avgTotalSqlNum:'+stat.avgTotalSqlNum);
		// console.log('CONFIG.config.stream_num:'+CONFIG.config.stream_num);
		// console.log('CONFIG.config.scale:'+CONFIG.config.scale);
		// console.log('denominator:'+denominator);
		// console.log('stat.throughputTest_monetdb:'+stat.throughputTest_monetdb);
		// console.log('CONFIG.config.stream_num:'+CONFIG.config.stream_num);
		// console.log('stat.load_monetdb:'+stat.load_monetdb);

		notify.notify(stat);//email
		resolve();
	});
}

exports.run = run;