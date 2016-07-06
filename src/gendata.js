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
	var rootPath = process.cwd();
	console.log('rootPath:'+rootPath);

	cd(CONFIG.config.dsdgen_dir);

	for (var i = 0; i < CONFIG.config.parallel; i++)
	{
		var cmdStr = './dsdgen –scale ' + CONFIG.config.scale
				+ ' -dir ' + rootPath + CONFIG.config.dsdgen_output_dir
				+ ' -parallel ' + CONFIG.config.parallel + ' -child ' + (i+1) + ' &';
		console.log('cmdStr:'+cmdStr);
		// shell.exec('./dsdgen –scale ' + CONFIG.config.scale
		// 		+ ' -dir ' + rootPath + CONFIG.config.dsdgen_output_dir
		// 		+ ' -parallel ' + CONFIG.config.parallel + ' -child ' + (i+1) + ' &'
		// 	);

		var exec = require('child_process').exec; 
		exec(cmdStr, function(err,stdout,stderr,i){
		  if(err) {
		    console.log('get weather api error:'+stderr);
		  } else {
		  	console.log('============');
		  	console.log('i: '+i+' start');
		  	console.log('stdout:');
		  	console.log(stdout);
		  	console.log('stderr:');
		  	console.log(stderr);
		  	console.log('over');
		  	console.log('============');
		  }
		});

	}
	// dsdgen –scale 100 –dir /tmp –parallel 4 –child 1 &	
	// dsdgen –scale 100 –dir /tmp –parallel 4 –child 2 &


	//./dsqgen -input ../query_templates/templates.lst -directory ../query_templates -scale 1 -output_dir ../wbx
	// shell.exec('./dsqgen -input ' + CONFIG.config.scale + ' -dir ' + CONFIG.config.dsdgen_output_dir);
	// console.log('cd ../' + CONFIG.config.dsdgen_dir);
}

exports.run = run;