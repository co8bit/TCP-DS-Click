var CONFIG = require('../config/config');
var Importer = require('monetdb-import')();
 
var dbOptions = {
	dbname: CONFIG.db.monetdb.dbName,
}

run = () => {
	try {

		cd(rootPath + CONFIG.config.dsdgen_output_dir);
		console.log('path:'+rootPath + CONFIG.config.dsdgen_output_dir);

		var imp = new Importer(dbOptions, './' , 'call_center_1_4.dat');
	 
		imp.import(function(err) {
			if(err) {
				console.log('Could not import file '+ 'call_center_1_4.dat' +' Reason: '+err);
			}
	 
			console.log('call_center_1_4.dat' + 'successfully imported into database table call_center_1_4.dat');
		});
	} catch(e) {
		// Could not construct the importer object. Possible reasons:  
		// 1) Invalid parameters 
		// 2) file not found  
		// 3) file is binary 
		console.log(e.message);
	}
}

exports.run = run;