var CONFIG = require('../../config/config');
var Importer = require('monetdb-import')();
var fs = require('fs');
var Timer   = require('../timer');
var util   = require('../util');

var dbOptions = {
	dbname: CONFIG.db.monetdb.dbName,
}

run = (rootPath) => {
	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var importPromise = [];
		path = rootPath + CONFIG.config.dsdgen_output_dir;
		CONFIG.config._TABLE_NAME.forEach( (tableName) => {
			var tmpIArray = [];
			for (var i = 1; i <= CONFIG.config.parallel; i++)
				tmpIArray.push(i);
			tmpIArray.forEach( (i) => {
					var file = path + tableName + '_' + i + '_' + CONFIG.config.parallel + '.dat';
					if (fs.existsSync(file))
					{
						console.log('开始导入文件:'+file);
						importPromise.push(new Promise ( (resolve,reject) => {
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
										util.log(err,'err');
										reject(new Error('Could not import file '+ file +' Reason: '+err));
									}
									else
									{
										console.log(file + '  成功导入'+info.importedRows+'条，被拒绝'+info.rejectedRows+'条。'+"\n");
										util.log(info.rejects,'失败的具体原因');
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
						}));
					}
			})
		});
		
		Promise.all(importPromise).then( () => {
			resolve(timer.end());
		}).catch((error) => {
			reject(error);
		});
	})
}

exports.run = run;