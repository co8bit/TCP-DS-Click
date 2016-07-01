/**
 * 查看LogCount数据类型里的东西
 * @param   LogCount   logCount
 * @return 控制台输出 logCount里的具体东西
 *
 * @author co8bit <me@co8bit.com>
 * @version 0.3.2
 * @date    2016-05-31
 */
watchLogCount = (logCount) => {
	console.log("========logCount:========");
	console.log(logCount);
	

	//这里是每层都展开看的代码
	// console.log("========logCount.stat:========");
	// console.log(logCount.stat);
	// 
	// for (var moduleName in logCount.stat.count)
	// {
	// 	console.log("<========moduleName:" + moduleName + "========>");
	// 	console.log(logCount.stat.count[moduleName]);
		
	// 	for (var instanceGroup in logCount.stat.count[moduleName].count)
	// 	{
	// 		console.log("<========instanceGroup:" + instanceGroup + "========>");
	// 		console.log(logCount.stat.count[moduleName].count[instanceGroup]);
			
	// 		for (var apiName in logCount.stat.count[moduleName].count[instanceGroup].apiName)
	// 		{
	// 			console.log("<========apiName:" + apiName + "========>");
	// 			console.log(logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName]);

	// 			for (var result in logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName].result)
	// 			{
	// 				console.log("<========result:" + result + "========>");
	// 				console.log(logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName].result[result]);
	// 			}
	// 		}
	// 	}
	// }


	//这里是跳层展开看的代码（因为实际可以一次看2层的内容）
	for (var moduleName in logCount.stat.count)
	{
		console.log("<========moduleName:" + moduleName + "========>");
		console.log(logCount.stat.count[moduleName]);
		
		for (var instanceGroup in logCount.stat.count[moduleName].count)
		{
			console.log("<========apiName OBJECT" + "========>");
			console.log(logCount.stat.count[moduleName].count[instanceGroup].apiName);

			for (var apiName in logCount.stat.count[moduleName].count[instanceGroup].apiName)
			{
				console.log("<========APINAME:'" + apiName + "'========>");
				console.log(logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName]);
			}
		}
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
exports.watchLogCount = watchLogCount;
exports.deepCopy = deepCopy;
exports.DateFormat = DateFormat;
exports.DateShortFormat = DateShortFormat;