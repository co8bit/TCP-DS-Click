var CONFIG   = require('../../config/config');
var Importer = require('monetdb-import')();
var fs       = require('fs');
var Timer    = require('../timer');
var util     = require('../util');
var MDB      = require('monetdb')();
var Mysql    = require('mysql');
 

var success =0;//成功数
var fail    =0;//失败数
var fileNum =0;//总文件数

var pool  = Mysql.createPool(CONFIG.db.mysql);

var load = (file,tableName) => {
	console.log('开始导入文件:'+file);
	return new Promise( (resolve,reject) => {
		var sql = "LOAD DATA INFILE '"+ file +"' INTO TABLE "+ tableName +" FIELDS TERMINATED BY '|' LINES TERMINATED BY \'\n\';";
		util.log(sql,'sql');

		pool.query(sql, function(err, res, fields) {
			if (err)
			{
				console.log('Could not import file '+ file + '原因：' + err);
				fail++;
				reject(err);
			}

			console.log(file + ' 成功导入。'+res+"\n");//monetdb这里还去数据库里做了个count，得到了成功导入多少条这个数据，这里没做
			success++;
			resolve();
		});
	})
}




var run = (rootPath) => {

	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var opList = [];
		path = rootPath + CONFIG.config.dsdgen_output_dir;
		var tmpIArray = [];
		for (var i = 1; i <= CONFIG.config.parallel; i++)
			tmpIArray.push(i);
		CONFIG.config._TABLE_NAME.forEach( (tableName) => {
			tmpIArray.forEach( (i) => {
				var file = path + tableName + '_' + i + '_' + CONFIG.config.parallel + '.dat';
				if (fs.existsSync(file))
				{
					fileNum++;
					opList.push( ()=>{
						return load(file,tableName);
					});
				}
			})
		});
		
		opList.reduce(function(preResult, curValueInArray) {
	    	return preResult.then(curValueInArray);//.catch(curValueInArray);
		}, Promise.resolve())
		.then(function() {
			console.log('dataFileNum:'+fileNum);
			console.log('success:'+success);
			console.log('fail:'+fail);
		    resolve(timer.end());
		    pool.end();
		}).catch((error) => {
			console.log('dataFileNum:'+fileNum);
			console.log('success:'+success);
			console.log('fail:'+fail);
			reject('load error');
		    pool.end();
		});
	})
}

exports.run = run;