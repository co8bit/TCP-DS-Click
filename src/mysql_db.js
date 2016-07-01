var mysql  = require('mysql');
var CONFIG = require('../config/accountConfig').db.mysql;

function init()
{
    var connection = mysql.createConnection(CONFIG);
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
    });
}



/**
 * 连接数据库，得到数据
 * @return  数据库集
 *
 * @author co8bit <me@co8bit.com>
 * @version 1.2.0
 * @date    2016-06-24
 */
visitDatabase = (resolve, reject) => {
	//calc time
	var nowTime = new Date();
	startTime.setTime( nowTime - (CONFIG.config.queryInterval * 60 * 1000) );
	logCount.nowTime = nowTime;
	logCount.nowTimeFormat = DateExtra.format(nowTime);
	logCount.nowTimeShortFormat = DateExtra.shortFormat(nowTime);
	logCount.startTime = startTime;
	logCount.startTimeFormat = DateExtra.format(startTime);
	console.log("本次扫描时间now time:" + logCount.nowTimeFormat + " <===> 数据库内容开始时间start time:" + logCount.startTimeFormat);

	sql_query = '\
		select moduleName, instanceGroup, apiName, result, count(*) as total from Transaction\
		where beginTime >= ? and beginTime <= ? and (endTime IS NOT NULL)\
		group by moduleName, instanceGroup, apiName, result;\
		';
	sql_queryFormat = Mysql.format(sql_query,[startTime,nowTime]);
	// console.log('sql_queryFormat: ', sql_queryFormat);
	pool.query(sql_queryFormat, function(err, res, fields) {
	  if (err) reject(new Error('visitDatabasePromise falt'+err));
	  
	  resolve(res);
	});
}



/**
 * 检查log是否异常
 * @return Promise visitDatabasePromise
 *
 * @author co8bit <me@co8bit.com>
 * @version 0.3.0
 * @date    2016-05-31
 */
findException = (getStat,judgeException,isSimilarF,notify,CONFIG) => {
	var logCount = {};


	var visitDatabasePromise = new Promise( (resolve,reject) => visitDatabase(resolve,reject,logCount,CONFIG) );

	visitDatabasePromise.then((res) => {

		logCount.stat = getStat(res,CONFIG);

		// Util.watchLogCount(logCount);
		

		var isException = judgeException(logCount.stat,CONFIG);
		
		if (isException)
		{
			var isSimilar = isSimilarF(preExceptionLogCount,logCount,CONFIG);

			++_developerStat.likeTotal[_developerStat.runDay];
			++_developerStat.likeTotal[0];

			if (isSimilar)
			{
				++_developerStat.similarTotal[_developerStat.runDay];
				++_developerStat.similarTotal[0];
				console.log("本次异常和上次相似，不发送邮件");
			}
			else
			{
				preExceptionLogCount = preExceptionLogCountInit(preExceptionLogCount);
				preExceptionLogCount = logCount;
				notify(logCount,CONFIG,logCount.nowTimeShortFormat,CONFIG.realtime_mailList);
				++_developerStat.etotal[_developerStat.runDay];
				++_developerStat.etotal[0];
			}
		}
		else
		{
			console.log("no problem");
		}

		++_developerStat.total[_developerStat.runDay];
		++_developerStat.total[0];

		console.log("- 从"+_developerStat.programStartTimeFormat+"开始，运行了："+ _developerStat.runDay + "天（含今日）。已监测" + _developerStat.total[0] + "次，发现"+_developerStat.likeTotal[0]+"次疑似异常,其中"+_developerStat.similarTotal[0]+"次被判定为相似异常-未发送邮件,"+"确定通知"+_developerStat.etotal[0]+"次异常。本程序自身出现："+_developerStat.exception+"次异常。");
		console.log("- 本次从"+DateExtra.format(_developerStat.programTodayTime)+"开始，已监测" + _developerStat.total[_developerStat.runDay] + "次，其中发现"+_developerStat.likeTotal[_developerStat.runDay]+"次疑似异常,其中"+_developerStat.similarTotal[_developerStat.runDay]+"次被判定为相似异常-未发送邮件,"+"确定通知"+_developerStat.etotal[_developerStat.runDay]+"次异常。");
		console.log('=============once end=============');
	})//.catch((err) => console.log(err));扔给最外层处理

	return visitDatabasePromise;
}










exports.init = init;