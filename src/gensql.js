var CONFIG = require('../config/config');
var shell = require("shelljs");
require('shelljs/global');
var util   = require('./util');

/**
 * 生成tcp-ds sql query查询
 *
 * @author co8bit <me@co8bit.com>
 * @version 0.0.1
 * @date    2016-07-08
 */
var run = (rootPath) => {
	return new Promise ( (resolve,reject) => {

		cd(rootPath + CONFIG.config.dsqgen_dir);

		var cmdStr = './dsqgen –scale ' + CONFIG.config.scale
					+ ' -input ' + rootPath + CONFIG.config.query_templates_lst
					+ ' -directory ' + rootPath + CONFIG.config.query_templates
					+ ' -output_dir ' + rootPath + CONFIG.config.dsqgen_output_dir;
		util.log(cmdStr,'命令');
		console.log('cmdStr:'+cmdStr);
		shell.exec(cmdStr);
		resolve();
	});

}

exports.run = run;