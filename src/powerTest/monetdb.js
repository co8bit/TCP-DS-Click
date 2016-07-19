var CONFIG = require('../../config/config');
var fs = require('fs');
var Timer   = require('../timer');
var util   = require('../util');

var MDB = require('monetdb')();
 
var options = CONFIG.db.monetdb;

run = (rootPath) => {
	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var conn = new MDB(options);
		conn.connect();
		 
		conn.query("COPY INTO call_center FROM '/home/youdata/TCP-DS-Click/output/data/call_center_1_4.dat' USING DELIMITERS '|','\n' NULL AS '';")
		.then(function(result) {
		    // Do something with the result 
		    util.log(result,'result');
			resolve(timer.end());
		}).catch((error) => {
			util.log(error,'error');
			reject(error);
		});
		 
		conn.close();
	})
}

exports.run = run;

