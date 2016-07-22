var CONFIG = require('../../config/config');
var fs = require('fs');
var Timer   = require('../timer');
var util   = require('../util');

var MDB = require('monetdb')();
 
var options = CONFIG.db.monetdb;


var ReadF = {
	createNew: function(rootPath){
		var ReadF = {};
		ReadF.rootPath = rootPath;
		ReadF.readFile = (file) => {
			ReadF.oData = fs.readFileSync(ReadF.rootPath + CONFIG.config.dsqgen_output_dir + file, {flag: 'r+', encoding: 'utf8'});
			
		}
		ReadF.getSQL = () => {
			return ReadF.data = ReadF.oData.split(';');
		}
		return ReadF;
	}
};



test = (i,sql) => {
	console.log('开始测试第'+(i+1)+'条SQL');
	// util.log(sql+';','sql');

	return new Promise( (resolve,reject) => {
		conn.query(sql+';')
		.then(function(res) {
			success++;
			resolve(timer.end());
		}).catch((error) => {
			fail++;
			util.log(sql+';','sql');
			reject(error);
		});
	});
};




var conn    = null;
var fail    = 0;
var success = 0;
var totalSql = 0;


run = (rootPath) => {
	conn    = new MDB(options);
	conn.connect();

	var readf = ReadF.createNew(rootPath);
	readf.readFile('query_0.sql');
	var sqlArray =  readf.getSQL();

	var sqlArray2 = [];
	sqlArray2.push(sqlArray[0]);
	sqlArray2.push(sqlArray[1]);

	var iArray = [];
	for (v of sqlArray2)
	{
		iArray.push(totalSql);
		totalSql++;
	}

	
	
	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var opList = [];
		iArray.forEach( (i) => {
			opList.push( () => {
				return test(i,sqlArray[i]);
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