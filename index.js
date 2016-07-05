var CONFIG = require('./config/config');
var Timer = require('./src/timer');
var gendata = require('./src/gendata');

var timer = Timer.Timer.create();


console.log("<===========================>  TCP-DS Click Run  <===========================>");
gendata.run();