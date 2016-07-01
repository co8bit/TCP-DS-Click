var sendMail = require("./sendMail");
var DateExtra = require("./date");
var DBCONFIG = require('../config/accountConfig').db;

notifyOnce = (logCount,CONFIG,title,mailList) => {
	//初始化sendMail
	sendMail.init();

	var htmlView = '<h3>监控时间段：' + logCount.startTimeFormat + ' -- ' + logCount.nowTimeFormat + '</h3>';
	
	if (logCount.stat.threshold >= CONFIG.config.totalErrorThreshold)
		htmlView += '<h3>总错误率：<font color="red"><b>' + (logCount.stat.threshold*100).toFixed(2) + '%</font></b></h3><br>';
	else
		htmlView += '<h3>总错误率：' + (logCount.stat.threshold*100).toFixed(2) + '%</h3><br>';
	
	htmlView += '\
		<table border="1"> \
			<tr align="center">\
				<th>模块</th>\
				<th>模块出错<br>LOG的数量</th>\
				<th>模块所有<br>LOG的数量</th>\
				<th>模块错误率</th>\
				<th>实例组</th>\
				<th>(模块-实例组)<br>出错的数量</th>\
				<th>(模块-实例组)<br>所有的数量</th>\
				<th>(模块-实例组)<br>错误率</th>\
				<th>apiName</th>\
				<th>apiName<br>出错次数</th>\
				<th>错误类型</th>\
				<th>本行错误<br>出现的数量</th>\
			</tr>';


	for (var moduleName in logCount.stat.count)
	{
		htmlView += '<tr align="center">' +
					'<td>'+ moduleName +'</td>' +
					'<td>'+ logCount.stat.count[moduleName].etotal +'</td>' +
					'<td>'+ logCount.stat.count[moduleName].total +'</td>';

		if (logCount.stat.count[moduleName].threshold >= CONFIG.config.moduleName[moduleName])
			htmlView +=	'<td><font color="red"><b>'+ (logCount.stat.count[moduleName].threshold*100).toFixed(2) +'%</b></font></td>';
		else
			htmlView +=	'<td>'+ (logCount.stat.count[moduleName].threshold*100).toFixed(2) +'%</td>';
		
		htmlView +=	' <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>'+
					'</tr>';
		for (var instanceGroup in logCount.stat.count[moduleName].count)
		{
			htmlView += '<tr align="center"> <td></td> <td></td> <td></td> <td></td>' +
						'<td>'+ instanceGroup +'</td>' +
						'<td>'+ logCount.stat.count[moduleName].count[instanceGroup].etotal +'</td>' +
						'<td>'+ logCount.stat.count[moduleName].count[instanceGroup].total +'</td>';
			if (logCount.stat.count[moduleName].count[instanceGroup].threshold >= CONFIG.config.moduleName[moduleName])
				htmlView +=	'<td><font color="red"><b>'+ (logCount.stat.count[moduleName].count[instanceGroup].threshold*100).toFixed(2) +'%</b></font></td>';
			else
				htmlView +=	'<td>'+ (logCount.stat.count[moduleName].count[instanceGroup].threshold*100).toFixed(2) +'%</td>';

			htmlView +=	' <td></td> <td></td> <td></td>  <td></td>'+
						'</tr>';
			for (var apiName in logCount.stat.count[moduleName].count[instanceGroup].apiName)
			{
				if (logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName].etotal != 0)
				{
					htmlView += '<tr align="center"> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>  <td></td>' +
								'<td>'+ apiName + '</td>' +
								'<td>'+ logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName].etotal + '</td>'+
								' <td></td> <td></td>'+
								'</tr>';
					for (var result in logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName].result)
					{
						if (logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName].result[result].etotal != 0)
						{
							htmlView += '<tr align="center"> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td>  <td></td>  <td></td> <td></td>' +
										'<td>'+ result + '</td>'+
										'<td>'+ logCount.stat.count[moduleName].count[instanceGroup].apiName[apiName].result[result].etotal + '</td> </tr>';
						}
					}
				}
			}
		}
	}

	htmlView += '</table>';
	
	htmlView += getStrategy(CONFIG);

	// console.log(htmlView);
	if (DBCONFIG.host == '10.122.139.59')
		sendMail.send(mailList,title,htmlView,CONFIG);
	else
		sendMail.send(mailList,'test'+title,htmlView,CONFIG);
}















getStrategy = (CONFIG) => {
	htmlView = '<br><br><br><br><br><h4>===============================<br>目前的监控策略：</h4>'
	htmlView += '<b>- 定义：</b>错误数 <b>E</b> = 在日志数据库某一时间段T内中出错(result字段值不为"SUCC")的log条数<br>'
	htmlView += '<b>- 定义：</b>日志总条数 <b>M</b> = 在日志数据库中时间段T内所有日志的log总条数<br>'
	htmlView += '<b>- 定义：错误率 = E / M</b><br>'
	htmlView += '- 目前，数据库时间段<b>T</b>的值为'+CONFIG.config.queryInterval+'分钟，log日志检查程序（本程序）每隔'+CONFIG.config.interval+'分钟扫描一次日志数据库<br>'
	htmlView += '- 因为扫描过程中有一些log可能会重复扫描，所以对错误报告有相似度判定，目前的判定为不相似的规则为：\
	<br>&emsp;&emsp;&emsp;&emsp;+ 时间间隔'+CONFIG.similar.intervalTimeThreshold+'分钟以上\
	<br>&emsp;&emsp;&emsp;&emsp;+ 错误率增长超过'+(CONFIG.similar.distThreshold*100).toFixed(2)+'%以上\
	<br>&emsp;&emsp;&emsp;&emsp;+ 在第一次报错后，错误总数在'+ CONFIG.similar.greatNumLine +'以内，错误数增加超过'+ CONFIG.similar.ignoreEtotalInc +'个\
	<br>&emsp;&emsp;&emsp;&emsp;+ 在第一次报错后，错误总数在'+ CONFIG.similar.greatNumLine +'以上，错误数增加超过其项阈值*其项log总数个\
	<br>'
	htmlView += '- <font color="#5bc0de"><b>总错误率</b></font>超过:<font color="#FF66FF"><b>' + (CONFIG.config.totalErrorThreshold*100).toFixed(2) + '%</b></font>会报警<br>';
	for (var moduleName in CONFIG.config.moduleName)
	{
		htmlView += '- <font color="#5bc0de"><b>' + moduleName + '模块</b></font>错误率超过:<font color="#FF66FF"><b>' + (CONFIG.config.moduleName[moduleName]*100).toFixed(2) + '%</b></font>会报警';
		htmlView += '或<font color="#5bc0de"><b>(' + moduleName + '-实例组)</b></font>错误率超过:<font color="#FF66FF"><b>' + (CONFIG.config.moduleName[moduleName]*100).toFixed(2) + '%</b></font>会报警<br>';
	}

	htmlView += '- 忽略的result值（即log返回这些结果不算错误log)：'
	for (var value of CONFIG.config.ignoreResult)
	{
		htmlView += value + '、';
	}
	htmlView += "<br><br><b>如果大家对日志监控有想法/需求/建议，欢迎与我讨论{王博鑫 : hzwangboxin@corp.netease.com}</b>";

	return htmlView;
}










































/**
 * 将本程序运行状态通知本程序开发者
 *
 * @author co8bit <me@co8bit.com>
 * @version 0.4.1
 * @date    2016-06-02
 */
notifyGlobalCount = (stat,CONFIG,mailList) => {

	//初始化sendMail
	sendMail.init();

	var htmlView = '<h3>程序起动时间：' + stat.programStartTimeFormat + '，已运行天数：'+ (stat.runDay - 1) + '天</h3>';
	if (stat.runDay != 1)
		htmlView += '<h3>本次报告监控的时间段：' + stat.timestamp[stat.runDay - 1].programTodayTime + ' -- ' + stat.timestamp[stat.runDay - 1].programTodayEndTime + '</h3><br>';


	htmlView += '<h3>监控情况：</h3>';
	htmlView += '\
		<table border="1"> \
			<tr align="center">\
				<th>天数</th>\
				<th>监控时间段<br>起始时间</th>\
				<th>监控时间段<br>结束时间</th>\
				<th>发现疑似异常次数<br>=确定异常次数+相似次数</th>\
				<th>检查总次数</th>\
				<th>发现疑似异常率</th>\
				<th>被判定为相似异常的次数</th>\
				<th>相似异常率1<br>=被判定为相似异常的次数 / 发现疑似异常次数</th>\
				<th>相似异常率2<br>=被判定为相似异常的次数 / 检查总次数</th>\
				<th>确定通知的异常次数</th>\
				<th>确定通知率1<br>=确定通知的异常次数 / 发现疑似异常次数</th>\
				<th>确定通知率2<br>=确定通知的异常次数 / 检查总次数</th>\
			</tr>';
	for (var runDay = 0; runDay < stat.runDay; runDay++)//因为当天的还没有，所以是<
	{
		var tmpStartTimeInfo = stat.timestamp[runDay].programTodayTime;
		var tmpEndTimeInfo = stat.timestamp[runDay].programTodayEndTime;
		if (runDay == 0)
		{
			tmpStartTimeInfo = "这里是总计";
			tmpEndTimeInfo = "这里是总计";
		}

		htmlView += '<tr align="center">' +
				'<td>'+ runDay +'</td>' +
				'<td>'+ tmpStartTimeInfo +'</td>' +
				'<td>'+ tmpEndTimeInfo +'</td>' +
				'<td>'+ stat.likeTotal[runDay] +'</td>' +
				'<td>'+ stat.total[runDay] +'</td>' +
				'<td>'+ (stat.likeTotal[runDay]/stat.total[runDay]*100).toFixed(2) +'%</td>' +
				'<td>'+ stat.similarTotal[runDay] +'</td>' +
				'<td>'+ (stat.similarTotal[runDay]/stat.likeTotal[runDay]*100).toFixed(2) +'%</td>' +
				'<td>'+ (stat.similarTotal[runDay]/stat.total[runDay]*100).toFixed(2) +'%</td>' +
				'<td>'+ stat.etotal[runDay] +'</td>' +
				'<td>'+ (stat.etotal[runDay]/stat.likeTotal[runDay]*100).toFixed(2) +'%</td>' +
				'<td>'+ (stat.etotal[runDay]/stat.total[runDay]*100).toFixed(2) +'%</td>' +
				'</tr>';
	}
	htmlView += '</table><br>';

	htmlView += '<h3>程序自身异常：</h3>';
	htmlView += "本程序自身出现："+stat.exception+"次异常" + '<br>';
	htmlView += '\
		<table border="1"> \
			<tr align="center">\
				<th>序号</th>\
				<th>异常信息</th>\
			</tr>';
	for (var exception = 0; exception <= stat.exception; exception++)
	{
		htmlView += '<tr align="center">' +
					'<td>'+ exception +'</td>' +
					'<td>'+ stat.exceptionInfo[exception] +'</td>' +
					'</tr>';
	}
	htmlView += '</table><br>';


	htmlView += getStrategy(CONFIG);



	// console.log(htmlView);
	if (DBCONFIG.host == '10.122.139.59')
		var env = '';
	else
		var env = 'test';
	if (stat.runDay == 1)
		sendMail.send(mailList,"LogMonitor----日志实时监控统计----"+ env + '----程序于' + stat.timestamp[stat.runDay].programTodayTime + "开始初次运行",htmlView,CONFIG);
	else
		sendMail.send(mailList,"LogMonitor----日志实时监控统计----"+ env + '----' + stat.timestamp[stat.runDay - 1].programTodayTime + ' -- ' + stat.timestamp[stat.runDay - 1].programTodayEndTime + "总计",htmlView,CONFIG);
}


exports.notifyOnce = notifyOnce;
exports.notifyGlobalCount = notifyGlobalCount;
