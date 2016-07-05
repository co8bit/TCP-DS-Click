var CONFIG = require('../config/config');
var shell = require("shelljs");
require('shelljs/global');

/**
 * 生成tcp-ds数据
 *
 * @author co8bit <me@co8bit.com>
 * @version 0.0.1
 * @date    2016-07-05
 */
run = () => {
	cd(CONFIG.config.dsdgen_dir);
	shell.exec('./dsdgen –scale ' + CONFIG.config.scale + ' -dir ' + CONFIG.config.dsdgen_output_dir);
	console.log('./dsdgen –scale ' + CONFIG.config.scale + ' -dir ' + CONFIG.config.dsdgen_output_dir);
	//./dsqgen -input ../query_templates/templates.lst -directory ../query_templates -scale 1 -output_dir ../wbx
	// shell.exec('./dsqgen -input ' + CONFIG.config.scale + ' -dir ' + CONFIG.config.dsdgen_output_dir);
	// console.log('cd ../' + CONFIG.config.dsdgen_dir);
}

exports.run = run;