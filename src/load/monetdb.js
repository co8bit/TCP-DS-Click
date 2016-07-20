var CONFIG = require('../../config/config');
var Importer = require('monetdb-import')();
var fs = require('fs');
var Timer   = require('../timer');
var util   = require('../util');
var MDB = require('monetdb')();
 
var options = {
	dbname: CONFIG.db.monetdb.dbname,
}

var success =0;//成功数
var fail    =0;//失败数
var fileNum =0;//总文件数
var conn    = new MDB(options);
conn.connect();

load = (file,tableName) => {
	console.log('开始导入文件:'+file);
	return new Promise( (resolve,reject) => {
		var sql = "CALL sys.clearrejects();COPY INTO "+ tableName +" FROM '"+ file +"' USING DELIMITERS '|','\n' NULL AS '';";
		util.log(sql,'sql');
		conn.query(sql)
		.then(function(result) {
			conn.query("SELECT COUNT(DISTINCT rowid) FROM sys.rejects").then((res1) => {
				conn.query("SELECT COUNT(*) FROM " + tableName).then( (res2) => {
					rejectedRows = res1.data[0];
					importedRows = res2.data[0];

					// util.log(res1,'res1');
					// util.log(res2,'res2');
					// util.log(rejectedRows,'rejectedRows');
					// util.log(importedRows,'importedRows');
					console.log(file + ' 成功导入'+importedRows+'条，被拒绝'+rejectedRows+'条。'+"\n");
					success++;
					resolve();
				})
			})
		})
		.catch((err) => {
			console.log('Could not import file '+ file + '原因：' + err);
			fail++;
			reject(error);
		});
		 
	})
}




run = (rootPath) => {
	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var impList = [];
		path = rootPath + CONFIG.config.dsdgen_output_dir;
		var tmpIArray = [];
		for (var i = 1; i <= CONFIG.config.parallel; i++)
			tmpIArray.push(i);
		CONFIG.config._TABLE_NAME.forEach( (tableName) => {
			tmpIArray.forEach( (i) => {
				var file = path + tableName + '_' + i + '_' + CONFIG.config.parallel + '.dat';
				fileNum++;
				if (fs.existsSync(file))
				{
					impList.push( ()=>{
						return load(file,tableName);
					});
				}
			})
		});
		
		// impList.reduce(function(preResult, curValueInArray) {
		// 	if (preResult == 0)
		// 		return Promise.resolve().then(load(curValueInArray));
		// 	else
		//     	return preResult.then(load(curValueInArray));
		// }, 0)|
		
		impList.reduce(function(preResult, curValueInArray) {
	    	return preResult.then(curValueInArray);//.catch(curValueInArray);
		}, Promise.resolve())
		.then(function() {
			console.log('fileNum:'+fileNum);
			console.log('success:'+success);
			// console.log('fail:'+(fail/2));
			console.log('fail:'+fail);
		    resolve(timer.end());
		    conn.close();
		}).catch((error) => {
			reject('load error');
			conn.close();
		});
	})
}

exports.run = run;