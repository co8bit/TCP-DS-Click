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
	var sqlArray =  readf.getSQL();

	return new Promise( (resolve,reject) => {
		var timer = Timer.Timer.create();

		var conn = new MDB(options);
		conn.connect();

		sqlArray.forEach( (sql) => {
			// util.log(sql,'sql');
			conn.query(sql)
			.then(function(res) {
			    util.log(result,'res');
				resolve(timer.end());
			}).catch((error) => {
				util.log(sql,'sql');
				util.log(error,'error');
				reject(error);
			});
		});

		conn.close();
	})
}

exports.run = run;