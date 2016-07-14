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
run = (rootPath) => {
	return new Promise ( (resolve,reject) => {
		var dsdgenPromise = [];

		cd(rootPath + CONFIG.config.dsdgen_dir);

		for (var i = 0; i < CONFIG.config.parallel; i++)
		{
			dsdgenPromise.push(new Promise( (resolve,reject) => {
				var cmdStr = './dsdgen –scale ' + CONFIG.config.scale
					+ ' -dir ' + rootPath + CONFIG.config.dsdgen_output_dir
					+ ' -parallel ' + CONFIG.config.parallel + ' -child ' + (i+1) + ' & ';
				console.log('命令'+i+':'+cmdStr);
				// shell.exec('./dsdgen –scale ' + CONFIG.config.scale
				// 		+ ' -dir ' + rootPath + CONFIG.config.dsdgen_output_dir
				// 		+ ' -parallel ' + CONFIG.config.parallel + ' -child ' + (i+1) + ' &'
				// 	);

				var execAsyn = require('child_process').exec; 
				execAsyn(cmdStr, (err,stdout,stderr) => {
					if(err)
					{
						reject(stderr);
					}
					else
					{
					  	resolve(stderr);
					  	// console.log('============');
					  	// console.log('stdout:');
					  	// console.log(stdout);
					  	// console.log('stderr:');
					  	// console.log(stderr);
					  	// console.log('over');
					  	// console.log('============');
					}
				});//exeAsyn
			}))//push promise
		}//for

		Promise.all(dsdgenPromise).then( (stdout) => {
			console.log(stdout);
			resolve();
		}).catch((error) => {
			console.log(new Error('gendata error:'+error));
		});
	});

}

exports.run = run;