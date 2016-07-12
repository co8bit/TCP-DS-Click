var CONFIG = require('./config/config');
var Timer = require('./src/timer');
var gendata = require('./src/gendata');
var gensql = require('./src/gensql');

var timer = Timer.Timer.create();


console.log("<===========================>  TCP-DS Click Run  <===========================>");
var rootPath = process.cwd();
console.log('rootPath:'+rootPath);
var gensqlPromise = new Promise((resolve,reject) => {});
// var gensqlPromise = null;

gendata.run(rootPath).then(() => {
	gensqlPromise = gensql.run(rootPath);
});

gensqlPromise.then(() => {
	console.log('gensql==--+++123');
});