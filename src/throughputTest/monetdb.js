var CONFIG = require('../../config/config');
var fs     = require('fs');
var Timer  = require('../timer');
var util   = require('../util');
var MDB    = require('monetdb')();
 
var options = CONFIG.db.monetdb;





test = (i,sql,statistics) => {
	console.log('开始测试第'+(i+1)+'条SQL');
	var timer = Timer.Timer.create();
	// util.log(sql+';','sql');

	return new Promise( (resolve,reject) => {
		conn.query(sql+';')
		.then(function(res) {
			success++;
			var time = timer.end();
			console.log('耗时:'+time);
			statistics.powerTest_monetdbArray.push({"i":i,"time":time,"type":"success"});
			resolve();
		}).catch((error) => {
			fail++;
			var time = timer.end();
			console.log('耗时:'+time);
			// util.log(sql+';','error sql');
			if (statistics.powerTest_monetdbArray.length - 1 < 0)
				statistics.powerTest_monetdbArray.push({"i":i,"time":time,"type":"fail"});
			else
				if (statistics.powerTest_monetdbArray[statistics.powerTest_monetdbArray.length - 1].i != i)
					statistics.powerTest_monetdbArray.push({"i":i,"time":time,"type":"fail"});
			reject(error);
		});
	});
};




var conn    = null;
var fail    = 0;
var success = 0;
var totalSql = 0;


run = (rootPath,statistics) => {
	conn    = new MDB(options);
	conn.connect();
	
	var readf = util.ReadF.createNew(rootPath);
	if (CONFIG.config.scale == 1)
		readf.readFile('query_monetdb/small/1.sql');
	else
		readf.readFile('query_monetdb/1.sql');
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
	    	return preResult.then(curValueInArray).catch(curValueInArray);
		}, Promise.resolve())
		.then(function() {
			console.log('总共测试:'+totalSql);
			console.log('success:'+success);
			console.log('fail:'+(totalSql - success));
		    resolve(timer.end());
		    conn.close();
		})
		.catch((error) => {
			console.log('总共测试:'+totalSql);
			console.log('success:'+success);
			console.log('fail:'+(totalSql - success));
			// reject('test error');//测试不管是否有单个失败，都算成功
			resolve(timer.end());
			conn.close();
		});
	})
}

exports.run = run;