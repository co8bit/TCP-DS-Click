var CONFIG = require('../config/config');
var Importer = require('monetdb-import')();
var fs = require('fs');
 
var dbOptions = {
	dbname: CONFIG.db.monetdb.dbName,
}

run = (rootPath) => {
	return new Promise ( (resolve,reject) => {
		path = rootPath + CONFIG.config.dsdgen_output_dir;
		for(var tableName of CONFIG.config._TABLE_NAME)
		{
			for (var i = 1; i <= CONFIG.config.parallel; i++)
			{
				try{
					// console.log('===============');
					var file = path + tableName + '_' + i + '_' + CONFIG.config.parallel + '.dat';
					if (!fs.existsSync(file))
						continue;
					var imp = new Importer(dbOptions,{locked:false},file,tableName);
					imp.import(function(err,info) {
						if(err)
						{
							reject(new Error('Could not import file '+ file +' Reason: '+err));
						}
						else
						{
							console.log(file + '  成功导入'+info.importedRows+'条，被拒绝'+info.rejectedRows+'条。'+"\n");
						}
					});
				}catch(e){
					// Could not construct the importer object. Possible reasons:  
					// 1) Invalid parameters 
					// 2) file not found  
					// 3) file is binary 
					console.log(e.message);
				}
			}
		}
		resolve();
	})
}

exports.run = run;