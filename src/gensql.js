var CONFIG = require('../config/config');
var shell = require("shelljs");
require('shelljs/global');

/**
 * 生成tcp-ds sql query查询
 *
 * @author co8bit <me@co8bit.com>
 * @version 0.0.1
 * @date    2016-07-08
 */
run = (rootPath) => {
	return new Promise ( (resolve,reject) => {
		var dsdgenPromise = [];
		
		console.log('eneter');
		console.log(rootPath + CONFIG.config.dsqgen_dir);
		cd(rootPath + CONFIG.config.dsqgen_dir);

		var cmdStr = './dsqgen –scale ' + CONFIG.config.scale
					+ ' -input ' + rootPath + CONFIG.config.query_templates_lst
					+ ' -directory ' + rootPath + CONFIG.config.query_templates
					+ ' -output_dir ' + rootPath + CONFIG.config.dsqgen_output_dir;
		console.log('命令'+i+':'+cmdStr);
		shell.exec(cmdStr);
		console.log('gen SQL..........OK');
		resolve();
	});

}

exports.run = run;