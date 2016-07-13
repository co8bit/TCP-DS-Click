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
			imp.import(function(err) {
				if(err)
				{
					reject(new Error(
							'Could not import file '+ path+'call_center_1_4.dat' +' Reason: '+err
						));
				}
				else
				{
					console.log('===============');
					console.log(this);
					console.log('===============');
					console.log(path+'call_center_1_4.dat' + ' successfully imported into database table call_center');
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