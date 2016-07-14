var CONFIG = require('../config/config');
var Importer = require('monetdb-import')();
var fs = require('fs');
 
var dbOptions = {
	dbname: CONFIG.db.monetdb.dbName,
}

run = (rootPath) => {
	return new Promise ( (resolve,reject) => {
		var importPromise = [];
		path = rootPath + CONFIG.config.dsdgen_output_dir;
		for(var tableName of CONFIG.config._TABLE_NAME)
		{
			for (var i = 1; i <= CONFIG.config.parallel; i++)
			{
					var file = path + tableName + '_' + i + '_' + CONFIG.config.parallel + '.dat';
					if (!fs.existsSync(file))
						continue;
					importPromise[i-1] = new Promise ( (resolve,reject) => {
						try{
							var imp = new Importer(dbOptions,{locked:false},file,tableName,['|','\n']);
							// imp.setSqlLogFn(null);//关闭monetdb-import log
							imp.import(function(err,info) {
								console.log('===============');
								console.log(err);
								console.log('===============');
								if(err)
								{
									reject(new Error('Could not import file '+ file +' Reason: '+err));
								}
								else
								{
									console.log(file + '  成功导入'+info.importedRows+'条，被拒绝'+info.rejectedRows+'条。'+"\n");
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
					})
			}
		}
		
		Promise.all(importPromise).then( () => {
			resolve('all ok');
		}).catch((error) => {
			console.log(new Errror('gendata error:'+error));
		});
	})
}

exports.run = run;