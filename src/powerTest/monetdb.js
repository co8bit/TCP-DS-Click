var CONFIG = require('../../config/config');
var fs     = require('fs');
var Timer  = require('../timer');
var util   = require('../util');
var MDB    = require('monetdb')();
 
var options = CONFIG.db.monetdb;


var conn    = null;
var fail    = 0;
var success = 0;
var totalSql = 0;


var test = (i,sql,statistics) => {
	console.log('开始测试第'+(i+1)+'条SQL');
	var timer = Timer.Timer.create();
	util.log(sql+';','sql');
	// console.log(sql+';');

	return new Promise( (resolve,reject) => {
		conn.query(sql+';')
		.then(function(res) {
			success++;
			var time = timer.end();
			util.logSqlTestResult(0,i,'succ',time);
			statistics.powerTest_monetdbArray.push({"i":i,"time":time,"type":"succ"});
			resolve();
		}).catch((error) => {
			fail++;
			var time = timer.end();
			util.logSqlTestResult(0,i,'fail',time);
			statistics.powerTest_monetdbArray.push({"i":i,"time":time,"type":"fail"});
			util.log(error,'error');
			reject(error);
		});
	});
};




var run = (rootPath,statistics) => {
	conn    = new MDB(options);
	conn.connect();
	
	//获得sql的标准用法：
	// var readf = util.ReadF.createNew(rootPath);
	// readf.readFile('query_0.sql');
	// var sqlArray =  readf.getSQL();

	var readf = util.ReadF.createNew(rootPath);
	if (CONFIG.config.scale == 1)
		readf.readFile('query_monetdb/small/0.sql');
	else
		readf.readFile('query_monetdb/0.sql');
	var sqlArray =  readf.getSQL();

	// var sqlArray2 = [];
	// sqlArray2.push(sqlArray[0]);
	// sqlArray2.push(sqlArray[1]);

	var iArray = [];
	for (v of sqlArray)
	// for (v of sqlArray2)
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
		    conn.close();
		    resolve(timer.end());
		})
		.catch((error) => {
			console.log('总共测试:'+totalSql);
			console.log('succ:'+success);
			console.log('fail:'+fail);
			// reject('test error');//测试不管是否有单个失败，都算成功
			conn.close();
			resolve(timer.end());
		});
	})
}

exports.run = run;