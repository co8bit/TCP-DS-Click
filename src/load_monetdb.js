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
					// console.log('===============');
					var file = path + tableName + '_' + i + '_' + CONFIG.config.parallel + '.dat';
					if (!fs.existsSync(file))
						continue;
					
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