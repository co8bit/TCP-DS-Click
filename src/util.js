var CONFIG  = require('../config/config');
var fs = require('fs');

log = (msg,title = '') => {
	if (CONFIG.config.debug)
	{
		console.log('========== DEBUG: '+title+' start =========');
		console.log(msg);
		console.log('========== DEBUG: '+title+' end =========');
	}
}



deepCopy = (source) => { 
    var result = {};
    for (var key in source)
    {
    	if (Object.prototype.toString.call(source[key]) === '[object Array]')
    		result[key] = source[key].slice(0);
    	else
    	if (typeof(source[key]) === 'object')
    		result[key] = deepCopy(source[key]);
    	else
    		result[key] = source[key];
	}
	return result; 
}


getoutputArray = (tmpDate) => {
	var dateArray = [
		tmpDate.getFullYear(),
		(tmpDate.getMonth() + 1),
		tmpDate.getDate(),
		tmpDate.getHours(),
		tmpDate.getMinutes(),
		tmpDate.getSeconds(),
		tmpDate.getMilliseconds()
		];

	var dateArrayInfo = [];
	for (var i in dateArray)
	{
		if (dateArray[i] < 10)
			dateArrayInfo[i] = "0" + dateArray[i];
		else
			dateArrayInfo[i] = dateArray[i];
	}
	if (dateArray[6] < 10)
		dateArrayInfo[6] = "00" + dateArray[6];
	else if (dateArray[6] < 100)
		dateArrayInfo[6] = "0" + dateArray[6];

	return dateArrayInfo;
}

function DateFormat(tmpDate)
{

	var dateArrayInfo = getoutputArray(tmpDate);
    var output = dateArrayInfo[0] + "年" + dateArrayInfo[1] + "月" + dateArrayInfo[2] + "日" + dateArrayInfo[3] + ":"+ dateArrayInfo[4] + ":" + dateArrayInfo[5] + "." + dateArrayInfo[6];
    return output;
}

function DateShortFormat(tmpDate)
{
	var dateArrayInfo = getoutputArray(tmpDate);
    var output = dateArrayInfo[1] + "月" + dateArrayInfo[2] + "日" + dateArrayInfo[3] + ":"+ dateArrayInfo[4]+"分";
    return output;
}

var ReadF = {
	createNew: function(rootPath){
		var ReadF = {};
		ReadF.rootPath = rootPath;
		ReadF.readFile = (file) => {
			ReadF.oData = fs.readFileSync(ReadF.rootPath + CONFIG.config.dsqgen_output_dir + file, {flag: 'r+', encoding: 'utf8'});
			
		}
		ReadF.getSQL = () => {
			ReadF.data = ReadF.oData.split(';');
			ReadF.data.pop();
			return ReadF.data;
		}
		return ReadF;
	}
};











exports.log = log;
exports.deepCopy = deepCopy;
exports.DateFormat = DateFormat;
exports.DateShortFormat = DateShortFormat;
exports.ReadF = ReadF;
