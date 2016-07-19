var CONFIG            = require('./config/config');
var Timer             = require('./src/timer');
var gendata           = require('./src/gendata');
var gensql            = require('./src/gensql');
var load_monetdb      = require('./src/load/monetdb');
var powerTest_monetdb = require('./src/powerTest/monetdb');

var timer = Timer.Timer.create();


console.log("<===========================>  TCP-DS Click Run  <===========================>");
var rootPath = process.cwd();
console.log('rootPath:'+rootPath);

var statistics = {};

Promise.resolve()
.then( () => {
	// return gendata.run(rootPath)
})
.then( (useTime) => {
	console.log('gen DATA ........................................OK');
	console.log('gen DATA time :' + useTime + 's');
	statistics.genDataTime = useTime;
	return gensql.run(rootPath);
})
.then( () => {
	console.log('gen SQL  ........................................OK');
	return load_monetdb.run(rootPath);
})
//load module ---------------
//monetdb
.then( (useTime) => {
	console.log('load_monetdb.....................................OK');
	console.log('load_monetdb time :' + useTime + 's');
	statistics.load_monetdb = useTime;
	// return powerTest_monetdb.run(rootPath);
})
//power test module ---------------
//monetdb
.then ( (useTime) => {
	console.log('powerTest_monetdb................................OK');
	console.log('powerTest_monetdb time :' + useTime + 's');
	statistics.powerTest_monetdb = useTime;
})
.catch((error) => {
	console.log('error:');
	console.log(error);
});