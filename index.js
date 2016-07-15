var CONFIG  = require('./config/config');
var Timer   = require('./src/timer');
var gendata = require('./src/gendata');
var gensql  = require('./src/gensql');
var load_monetdb  = require('./src/load_monetdb');

var timer = Timer.Timer.create();


console.log("<===========================>  TCP-DS Click Run  <===========================>");
var rootPath = process.cwd();
console.log('rootPath:'+rootPath);

Promise.resolve()
.then( () => {
	return gendata.run(rootPath)
})
.then( (useTime) => {
	console.log('gen DATA ........................................OK');
	console.log('gen DATA time :' + useTime + 's');
	return gensql.run(rootPath);
})
.then( () => {
	console.log('gen SQL  ........................................OK');
	return load_monetdb.run(rootPath);
})
.then( (useTime) => {
	console.log('load_monetdb.....................................OK');
	console.log('load_monetdb time :' + useTime + 's');
})
.catch((error) => {
	console.log('error:');
	console.log(error);
});