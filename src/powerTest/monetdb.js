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
		 
		conn.query('SELECT * FROM call_center').then(function(result) {
		    // Do something with the result 
		    util.log(result,'result');
		});
		 
		conn.close();
		resolve(timer.end());
	})
}

exports.run = run;