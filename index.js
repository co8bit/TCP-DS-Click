var CONFIG                 = require('./config/config');
var Timer                  = require('./src/timer');
var util                   = require('./src/util');
var genData                = require('./src/genData');
var genSql                 = require('./src/genSql');
var load_monetdb           = require('./src/load/monetdb');
var powerTest_monetdb      = require('./src/powerTest/monetdb');
var throughputTest_monetdb = require('./src/throughputTest/monetdb');
var genResult              = require('./src/genResult');



console.log("<===========================>  TCP-DS Click Run  <===========================>");
var rootPath = process.cwd();
console.log('rootPath:'+rootPath);

var statistics = {
	powerTest_monetdbArray:[],
	throughputTest_monetdbArray:[],
};

Promise.resolve()
/**
 * gen DATA model ---------------
 */
// .then( () => {
	// util.logModuleTitle('gen DATA');
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
.then( (useTime) => {
	util.logModuleTitle('gen SQL');
	var tmpPromise = genSql.run(rootPath);
	tmpPromise.then( () => {
		console.log('gen SQL  ........................................OK');
	});
	return tmpPromise;
})



/**
 * load module ---------------
 */
.then( () => {
	// monetdb
	util.logModuleTitle('load_monetdb');
	var tmpPromise = load_monetdb.run(rootPath);
	tmpPromise.then( (useTime) => {
		console.log('load_monetdb.....................................OK');
		console.log('load_monetdb time :' + useTime + 's');
		statistics.load_monetdb = useTime;
	});
	return tmpPromise;
})



/**
 * power test module ---------------
 */
.then( (useTime) => {
	//monetdb
	util.logModuleTitle('powerTest_monetdb');
	var tmpPromise = powerTest_monetdb.run(rootPath,statistics);
	tmpPromise.then( (useTime) => {
		console.log('powerTest_monetdb................................OK');
		console.log('powerTest_monetdb time :' + useTime + 's');
		console.log('powerTest_monetdbArray:');
		console.log(statistics.powerTest_monetdbArray);
	});
	return tmpPromise;
})



/**
 * throughput test module ---------------
 */
.then( (useTime) => {
	//monetdb
	util.logModuleTitle('throughputTest_monetdb');
	var tmpPromise = throughputTest_monetdb.run(rootPath,statistics);
	tmpPromise.then( (useTime) => {
		console.log('throughputTest_monetdb................................OK');
		console.log('throughputTest_monetdb time :' + useTime + 's');
		console.log('throughputTest_monetdbArray:');
		console.log(statistics.throughputTest_monetdbArray);
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
		console.log('result:');
		console.log(statistics);
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