var CONFIG                 = require('./config/config');
var Timer                  = require('./src/timer');
var gendata                = require('./src/gendata');
var gensql                 = require('./src/gensql');
var load_monetdb           = require('./src/load/monetdb');
var powerTest_monetdb      = require('./src/powerTest/monetdb');
var throughputTest_monetdb = require('./src/throughputTest/monetdb');



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
	// console.log('gen DATA................................RUN');
// 	var tmpPromise = gendata.run(rootPath);
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
// 	console.log('gen SQL................................RUN');
// 	var tmpPromise = gensql.run(rootPath);
// 	tmpPromise.then( () => {
// 		console.log('gen SQL  ........................................OK');
// 	});
// 	return tmpPromise;
// })



/**
 * load module ---------------
 */
// .then( () => {
// 	// monetdb
	// console.log('load_monetdb................................RUN');
// 	var tmpPromise = load_monetdb.run(rootPath);
// 	tmpPromise.then( (useTime) => {
// 		console.log('load_monetdb.....................................OK');
// 		console.log('load_monetdb time :' + useTime + 's');
// 		statistics.load_monetdb = useTime;
// 	});
// 	return tmpPromise;
// })



/**
 * power test module ---------------
 */
.then( (useTime) => {
	//monetdb
	console.log('powerTest_monetdb................................RUN');
	var tmpPromise = powerTest_monetdb.run(rootPath,statistics);
	tmpPromise.then( (useTime) => {
		console.log('powerTest_monetdb................................OK');
		console.log('powerTest_monetdb time :' + useTime + 's');
		statistics.powerTest_monetdb = useTime;
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
	console.log('throughputTest_monetdb................................RUN');
	var tmpPromise = throughputTest_monetdb.run(rootPath,statistics);
	tmpPromise.then( (useTime) => {
		console.log('throughputTest_monetdb................................OK');
		console.log('throughputTest_monetdb time :' + useTime + 's');
		statistics.throughputTest_monetdb = useTime;
		console.log('throughputTest_monetdbArray:');
		console.log(statistics.throughputTest_monetdbArray);
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