var CONFIG = require('../../config/config');
var fs     = require('fs');
var Timer  = require('../timer');
var util   = require('../util');
var MDB    = require('monetdb')();
 
var options = CONFIG.db.monetdb;





var test = (streamNo,i,conn,sql,statistics) => {
	console.log('开始测试  '+streamNo+'  文件的第  '+(i+1)+'  条SQL');
	var timer = Timer.Timer.create();
	util.log(sql+';','sql');
	// console.log('sql:'+sql+';');

	return new Promise( (resolve,reject) => {
		conn.query(sql+';')
		.then(function(res) {
			if (typeof(success[streamNo]) === 'undefined')
				success[streamNo] = 0;
			success[streamNo]++;
			var time = timer.end();
			util.logSqlTestResult(streamNo,i,'succ',time);
			statistics.throughputTest_monetdbArray.push({"streamNo":streamNo,"i":i,"time":time,"type":"succ"});
			resolve();
		}).catch((error) => {
			if (typeof(fail[streamNo]) === 'undefined')
				fail[streamNo] = 0;
			fail[streamNo]++;
			var time = timer.end();
			util.logSqlTestResult(streamNo,i,'fail',time);
			
			// console.log('sql:'+sql);
			// console.log('error:'+error);
			util.log(error,'error');

			statistics.throughputTest_monetdbArray.push({"streamNo":streamNo,"i":i,"time":time,"type":"fail"});
			reject(error);
		});
	});
};



var opListRun = (streamNo,opList,conn) => {
	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();
		opList.reduce(function(preResult, curValueInArray) {
			var p = preResult.then( () => {
				return Promise.resolve();
			}).catch( () => {
				return Promise.resolve();
			});
			return p.then(curValueInArray);
		}, Promise.resolve())//todo：为什么then和catch会同时触发?
		.then(function() {
			console.log('第    '+streamNo+'    文件测试...............................t.OK');
			console.log('总共测试:'+totalSql[streamNo]);
			console.log('succ:'+success[streamNo]);
			console.log('fail:'+fail[streamNo]);
		    conn.close();
		    resolve(timer.end());
		})
		.catch((error) => {
			console.log('第    '+streamNo+'    文件测试...............................c.OK');
			console.log('总共测试:'+totalSql[streamNo]);
			console.log('succ:'+success[streamNo]);
			console.log('fail:'+fail[streamNo]);
			// reject('test error');//测试不管是否有单个失败，都算成功
		    conn.close();
			resolve(timer.end());
		});
	});
}







var fail     = [];
var success  = [];
var totalSql = [];


var run = (rootPath,statistics) => {
	var conn           = [];
	var sqlArray       = [];
	var streamNumArray = [];
	for(var i = 0; i < CONFIG.config.stream_num; i++)
	{
		var readf = util.ReadF.createNew(rootPath);
		if (CONFIG.config.scale == 1)
			readf.readFile('query_monetdb/small/'+i+'.sql');
		else
			readf.readFile('query_monetdb/'+i+'.sql');
		sqlArray.push(readf.getSQL());
		streamNumArray.push(i);
	}

	var iArray = [];
	var i = 0;
	for (sqlGroup of sqlArray)
	{
		totalSql[i] = 0;
		for (item of sqlGroup)
		{
			if (typeof(iArray[i]) === 'undefined')
				iArray[i] = [];
			iArray[i].push(totalSql[i]);
			totalSql[i]++;
		}
		i++;
	}
	// util.log(sqlArray,'sqlArray');
	// util.log(iArray,'iArray');
	// util.log(totalSql,'totalSql');
	

	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var opList = [];
		
		//生成流的操作队列
		streamNumArray.forEach( (streamNo) => {
			var tmp = null;
			tmp = new MDB(options);
			conn.push(tmp);
			tmp.connect();
			iArray[streamNo].forEach( (i) => {
				if (typeof(opList[streamNo]) === 'undefined')
					opList[streamNo] = [];
				opList[streamNo].push( () => {
					return test(streamNo,i,tmp,sqlArray[streamNo][i],statistics);
				});
			});
		});
		// console.log(opList);
		// console.log(conn);

		var opListPromiseList = [];
		streamNumArray.forEach( (streamNo) => {
			opListPromiseList.push(opListRun(streamNo,opList[streamNo],conn[streamNo]));
		});
		Promise.all(opListPromiseList)
		.then( (timeRe) => {
			console.log('总共测试:'+totalSql);
			console.log('succ:'+success);
			console.log('fail:'+fail);
			console.log('各组耗费时间:'+timeRe);
		    resolve(timer.end());
		})
		.catch(()=>{
			reject('throughputTest unkonwn error');
		});
	});
}

exports.run = run;