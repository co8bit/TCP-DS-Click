var CONFIG  = require('./config/config');
var Timer   = require('./src/timer');
var gendata = require('./src/gendata');
var gensql  = require('./src/gensql');
var load_monetdb  = require('./src/load_monetdb');

var timer = Timer.Timer.create();


console.log("<===========================>  TCP-DS Click Run  <===========================>");
var rootPath = process.cwd();
console.log('rootPath:'+rootPath);

gendata.run(rootPath)
.then(() => {
	console.log('gen DATA..........OK');
	return gensql.run(rootPath);
})
.then(() => {
	load_monetdb.run();
	console.log('gensql==--+++123');
}).catch((error) => {
	console.log('error:'+error);
});