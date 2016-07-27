var CONFIG = require('../config/config');
var util   = require('./util');




var run = (statistics) => {
	return new Promise( (resolve,reject) => {
		//powerTest calc
		statistics.powerTest_monetdb = 0;
		for (v of statistics.powerTest_monetdbArray)
		{
			statistics.powerTest_monetdb += parseFloat(v.time);
		}
		statistics.powerTest_monetdb = statistics.powerTest_monetdb.toFixed(3);

		//throughput calc
		statistics.throughputTest_monetdb = 0;
		for (v of statistics.throughputTest_monetdbArray)
		{
			statistics.throughputTest_monetdb += parseFloat(v.time);
		}
		statistics.throughputTest_monetdb = statistics.throughputTest_monetdb.toFixed(3);
		




		resolve();
	});
}

exports.run = run;