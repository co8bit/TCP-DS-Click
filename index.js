var CONFIG = require('./config/config');
var Timer = require('./src/timer');
var gendata = require('./src/gendata');
var gensql = require('./src/gensql');

var timer = Timer.Timer.create();


console.log("<===========================>  TCP-DS Click Run  <===========================>");
var gensqlPromise = new Promise((resolve,reject) => {});
gendata.run().then(() => {
	gensqlPromise = gensql.run();
});

gensqlPromise.then(() => {
	console.log('gensql==--+++123');
});