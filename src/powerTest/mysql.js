var CONFIG = require('../../config/config');
var fs     = require('fs');
var Timer  = require('../timer');
var util   = require('../util');

var Mysql    = require('mysql');

var fail    = 0;
var success = 0;
var totalSql = 0;

var pool  = Mysql.createPool(CONFIG.db.mysql);

var test = (i,sql,statistics) => {
	console.log('开始测试第'+(i+1)+'条SQL');
	var timer = Timer.Timer.create();
	sql = sql + ';';
	util.log(sql,'sql');
	// console.log(sql+';');

	return new Promise( (resolve,reject) => {


		pool.query(sql, function(err, res, fields) {
			if (err)
			{
				fail++;
				var time = timer.end();
				util.logSqlTestResult(0,i,'fail',time);
				statistics.powerTest_mysqlArray.push({"i":i,"time":time,"type":"fail"});
				util.log(error,'error');
				reject(error);
			}

			success++;
			var time = timer.end();
			util.logSqlTestResult(0,i,'succ',time);
			statistics.powerTest_mysqlArray.push({"i":i,"time":time,"type":"succ"});
			util.log(res,'res');
			resolve();
		});
	});
};



var run = (rootPath,statistics) => {

	var readf = util.ReadF.createNew(rootPath);
	if (CONFIG.config.scale == 1)
		readf.readFile('query_monetdb/small/0.sql');
	else
		readf.readFile('query_monetdb/0.sql');
	var sqlArray =  readf.getSQL();

	var iArray = [];
	for (v of sqlArray)
	{
		iArray.push(totalSql);
		totalSql++;
	}

	
	
	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var opList = [];
		iArray.forEach( (i) => {
			opList.push( () => {
				return test(i,sqlArray[i],statistics);
			});
		});
		// console.log(opList);
		opList.reduce(function(preResult, curValueInArray) {
	    	var p = preResult.then( () => {
				return Promise.resolve();
			}).catch( () => {
				return Promise.resolve();
			});
			return p.then(curValueInArray);
		}, Promise.resolve())
		.then(function() {
			console.log('总共测试:'+totalSql);
			console.log('succ:'+success);
			console.log('fail:'+fail);
		    pool.end();
		    resolve(timer.end());
		})
		.catch((error) => {
			console.log('总共测试:'+totalSql);
			console.log('succ:'+success);
			console.log('fail:'+fail);
			// reject('test error');//测试不管是否有单个失败，都算成功
			pool.end();
			resolve(timer.end());
		});
	})
}

exports.run = run;