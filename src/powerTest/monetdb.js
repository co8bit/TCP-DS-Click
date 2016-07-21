var CONFIG = require('../../config/config');
var fs = require('fs');
var Timer   = require('../timer');
var util   = require('../util');

var MDB = require('monetdb')();
 
var options = CONFIG.db.monetdb;


var ReadF = {
	createNew: function(rootPath){
		var ReadF = {};
		ReadF.rootPath = rootPath;
		ReadF.readFile = (file) => {
			ReadF.oData = fs.readFileSync(ReadF.rootPath + CONFIG.config.dsqgen_output_dir + file, {flag: 'r+', encoding: 'utf8'});
			
		}
		ReadF.getSQL = () => {
			return ReadF.data = ReadF.oData.split(';');
		}
		return ReadF;
	}
};








run = (rootPath) => {
	var readf = ReadF.createNew(rootPath);
	readf.readFile('query_0.sql');
	var data =  readf.getSQL();
	console.log('data[0]:'+data[0]);

	return new Promise( (resolve,reject) => {});
	// return new Promise( (resolve,reject) => {
	// 	var timer = Timer.Timer.create();

	// 	var conn = new MDB(options);
	// 	conn.connect();
		 
	// 	// conn.query("select * from call_center;")
	// 	conn.query("select * from call_center;CALL sys.clearrejects();")
	// 	.then(function(result) {
	// 	    // Do something with the result 
	// 	    util.log(result,'result');
	// 		resolve(timer.end());
	// 	}).catch((error) => {
	// 		util.log(error,'error');
	// 		reject(error);
	// 	});
		 
	// 	conn.close();
	// })
}

exports.run = run;

