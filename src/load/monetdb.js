var CONFIG = require('../../config/config');
var Importer = require('monetdb-import')();
var fs = require('fs');
var Timer   = require('../timer');
var util   = require('../util');

var dbOptions = {
	dbname: CONFIG.db.monetdb.dbname,
}


load = (file,tableName) => {
	console.log('开始导入文件:'+file);
	return new Promise ( (resolve,reject) => {
		try{
			var imp = new Importer(dbOptions,{locked:false},file,tableName,['|','\n']);
			if (!CONFIG.config.debug)
			{
				imp.setSqlLogFn(null);//关闭monetdb-import log
				imp.bestEffort(true);//打开best effort模式
			}
			imp.import(function(err,info) {
				if(err)
				{
					console.log('Could not import file '+ file + '原因：' + err);
					reject();
				}
				else
				{
					console.log(file + ' 成功导入'+info.importedRows+'条，被拒绝'+info.rejectedRows+'条。'+"\n");
					resolve();
				}
			});
		}catch(e){
			// Could not construct the importer object. Possible reasons:  
			// 1) Invalid parameters 
			// 2) file not found  
			// 3) file is binary 
			reject(new Error(e.message));
		}
	});
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
	    	return preResult.then(curValueInArray).catch(curValueInArray);
		}, Promise.resolve())
		.then(function() {
		    resolve(timer.end());
		}).catch((error) => {
			reject('load error');
		});
	})
}

exports.run = run;