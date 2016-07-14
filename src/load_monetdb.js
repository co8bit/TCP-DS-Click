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
		
		
		Promise.all(importPromise).then( () => {
			resolve('all ok');
		}).catch((error) => {
			console.log(new Errror('gendata error:'+error));
		});
	})
}

exports.run = run;