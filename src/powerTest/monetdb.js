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
			fs.readFileSync(ReadF.rootPath + CONFIG.config.dsqgen_output_dir + file, {flag: 'r+', encoding: 'utf8'}, function (err, data) {
				if (err) {
					console.error(err);
					return;
				}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
				console.log(data);
			});
		}
		ReadF.getSQL = () => {

		}
		return ReadF;
	}
};








run = (rootPath) => {
	var readf = ReadF.createNew(rootPath);
	readf.readFile('query_0.sql');

	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var conn = new MDB(options);
		conn.connect();
		 
		util.log('jinru','jinru');
		// conn.query("select * from call_center;")
		conn.query("select * from call_center;CALL sys.clearrejects();")
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

