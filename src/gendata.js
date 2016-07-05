var CONFIG = require('../config/config');
var shell = require("shelljs");

/**
 * 生成tcp-ds数据
 *
 * @author co8bit <me@co8bit.com>
 * @version 0.0.1
 * @date    2016-07-05
 */
run = () => {
	shell.exec('ls');
	shell.exec('cd ' + CONFIG.config.dsdgen_dir);
	shell.exec('ls');
	// console.log('cd ../' + CONFIG.config.dsdgen_dir);
}

exports.run = run;