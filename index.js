var CONFIG                 = require('./config/config');
var Timer                  = require('./src/timer');
var util                   = require('./src/util');
var genData                = require('./src/genData');
var genSql                 = require('./src/genSql');
var genResult              = require('./src/genResult');

//monetdb
var load_monetdb           = require('./src/load/monetdb');
var powerTest_monetdb      = require('./src/powerTest/monetdb');
var throughputTest_monetdb = require('./src/throughputTest/monetdb');
//mysql
var load_mysql           = require('./src/load/mysql');
var powerTest_mysql      = require('./src/powerTest/mysql');
var throughputTest_mysql = require('./src/throughputTest/mysql');



console.log("<===========================>  TCP-DS Click Run  <===========================>");
var rootPath = process.cwd();
console.log('rootPath:'+rootPath);

var statistics = {
	//monetdb
	load_monetdb : 0,
	powerTest_monetdbArray:[],
	powerTest_mysqlArray:[],

	//mysql
	load_mysql : 0,
	throughputTest_monetdbArray:[],
	throughputTest_mysqlArray:[],
};

Promise.resolve()
/**
 * gen DATA model ---------------
 */
// .then( () => {
// 	util.logModuleTitle('gen DATA');
// 	var tmpPromise = genData.run(rootPath);
// 	tmpPromise.then( (useTime) => {
// 		console.log('gen DATA ........................................OK');
// 		console.log('gen DATA time :' + useTime + 's');
// 		statistics.genDataTime = useTime;
// 	});
// 	return tmpPromise;
// })



/**
 * gen SQL model ---------------
 */
// .then( (useTime) => {
// 	util.logModuleTitle('gen SQL');
// 	var tmpPromise = genSql.run(rootPath);
// 	tmpPromise.then( () => {
// 		console.log('gen SQL  ........................................OK');
// 	});
// 	return tmpPromise;
// })



/**
 * load module ---------------
 */
.then( () => {// monetdb
	util.logModuleTitle('load_monetdb');
	var tmpPromise = load_monetdb.run(rootPath);
	tmpPromise.then( (useTime) => {
		console.log('load_monetdb.....................................OK');
		console.log('load_monetdb time :' + useTime + 's');
		statistics.load_monetdb = useTime;
	});
	return tmpPromise;
})
.then( () => {// mysql
	util.logModuleTitle('load_mysql');
	var tmpPromise = load_mysql.run(rootPath);
	tmpPromise.then( (useTime) => {
		console.log('load_mysql.......................................OK');
		console.log('load_mysql time :' + useTime + 's');
		statistics.load_mysql = useTime;
	});
	return tmpPromise;
})



/**
 * power test module ---------------
 */
.then( (useTime) => {//monetdb
	util.logModuleTitle('powerTest_monetdb');
	var tmpPromise = powerTest_monetdb.run(rootPath,statistics);
	tmpPromise.then( (useTime) => {
		console.log('powerTest_monetdb................................OK');
		console.log('powerTest_monetdb time :' + useTime + 's');
	});
	return tmpPromise;
})
.then( (useTime) => {//mysql
	util.logModuleTitle('powerTest_mysql');
	var tmpPromise = powerTest_mysql.run(rootPath,statistics);
	tmpPromise.then( (useTime) => {
		console.log('powerTest_mysql..................................OK');
		console.log('powerTest_mysql time :' + useTime + 's');
	});
	return tmpPromise;
})



/**
 * throughput test module ---------------
 */
.then( (useTime) => {//monetdb
	util.logModuleTitle('throughputTest_monetdb');
	var tmpPromise = throughputTest_monetdb.run(rootPath,statistics);
	tmpPromise.then( (useTime) => {
		console.log('throughputTest_monetdb................................OK');
		console.log('throughputTest_monetdb time :' + useTime + 's');
	});
	return tmpPromise;
})
.then( (useTime) => {//mysql
	util.logModuleTitle('throughputTest_mysql');
	var tmpPromise = throughputTest_mysql.run(rootPath,statistics);
	tmpPromise.then( (useTime) => {
		console.log('throughputTest_mysql.................................OK');
		console.log('throughputTest_mysql time :' + useTime + 's');
	});
	return tmpPromise;
})


/**
 * generate result module
 */
.then( (useTime) => {
	util.logModuleTitle('genResult');
	var tmpPromise = genResult.run(statistics);
	tmpPromise.then( (useTime) => {
		console.log('genResult................................OK');
	});
	return tmpPromise;
})





.then( () => {
	console.log('====================RUN OVER====================')
})
.catch((error) => {
	console.log('error:');
	console.log(error);
});