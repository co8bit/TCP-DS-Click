var CONFIG = require('../config/config');
var Importer = require('monetdb-import')();
 
var dbOptions = {
	dbname: CONFIG.db.monetdb.dbName,
}

run = (rootPath) => {
	return new Promise ( (resolve,reject) => {
		try{

			path = rootPath + CONFIG.config.dsdgen_output_dir;
			var imp = new Importer(dbOptions,{locked:false},path+'call_center_1_4.dat' , 'call_center');
			imp.import(function(err,info) {
				if(err)
				{
					reject(new Error(
							'Could not import file '+ path+'call_center_1_4.dat' +' Reason: '+err
						));
				}
				else
				{
					console.log('===============');
					console.log('===============');
					console.log(path+'call_center_1_4.dat' + '成功导入'+info.importedRows+'条，被拒绝'+info.rejectedRows+'条。'+"\n");
					resolve();
				}
			});
		}catch(e){
			// Could not construct the importer object. Possible reasons:  
			// 1) Invalid parameters 
			// 2) file not found  
			// 3) file is binary 
			console.log(e.message);
		}
	})
}

exports.run = run;