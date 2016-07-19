var CONFIG = require('../../config/config');
var Importer = require('monetdb-import')();
var fs = require('fs');
var Timer   = require('../timer');
var util   = require('../util');
var MDB = require('monetdb')();
 
var options = {
	dbname: CONFIG.db.monetdb.dbname,
}


load = (file,tableName) => {
	console.log('开始导入文件:'+file);
	return new Promise( (resolve,reject) => {
		var conn = new MDB(options);
		conn.connect();
		var sql = "COPY INTO "+ tableName +" FROM '"+ file +"' USING DELIMITERS '|','\n' NULL AS '';";
		util.log(sql,'sql');
		conn.query(sql)
		.then(function(result) {
			// conn.query("SELECT COUNT(DISTINCT rowid) FROM sys.rejects").then((res1) => {
			// 	util.log(res1,'res1');
			// 	conn.query("SELECT COUNT(*) FROM " + tableName).then( (res2) => {
			// 		rejectedRows = res1.state === "fulfilled" ? res1 : -1;
			// 		importedRows = res2.state === "fulfilled" ? res2 : -1;
					

			// 		util.log(res1,'res1');
			// 		util.log(res2,'res2');
			// 		util.log(rejectedRows,'rejectedRows');
			// 		util.log(importedRows,'importedRows');
			// 		util.log(tableName+'ok',tableName+'ok');
					util.log(resule,'resule');
					resolve();
			// 	})
			// })
                    
                    // result.rejectedRows = d[0].state === "fulfilled" ? d[0].value.data[0][0] : -1;
                    // result.importedRows = d[1].state === "fulfilled" ? d[1].value.data[0][0] : -1;
		}).catch((error) => {
			util.log(error,'error');
			reject(error);
		});
		 
		conn.close();
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
		// }, 0)
		impList.reduce(function(preResult, curValueInArray) {
	    	return preResult.then(curValueInArray);//.catch(curValueInArray);
		}, Promise.resolve())
		.then(function() {
		    resolve(timer.end());
		}).catch((error) => {
			reject('load error');
		});
	})
}

exports.run = run;