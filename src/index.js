var CONFIG = require('../config/config');
var Timer = require('./timer');
var gendata = require('./gendata');

var timer = Timer.Timer.create();


console.log("<===========================>  TCP-DS Click Run  <===========================>");
gendata.run();