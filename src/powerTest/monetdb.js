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
		 
		conn.query("COPY INTO store_sales FROM '/home/youdata/TCP-DS-Click/output/data/store_sales_1_4.dat' USING DELIMITERS '|','\n' NULL AS '';")
		.then(function(result) {
		    // Do something with the result 
		    util.log(result,'result');
			resolve(timer.end());
		});
		 
		conn.close();
	})
}

exports.run = run;

