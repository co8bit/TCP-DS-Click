var nodemailer = require('nodemailer');
var ACCOUNT_CONFIG = require('../config/accountConfig').mail;

/**
 * 初始化nodemailer
 *
 * @author co8bit
 * @version 0.0.1
 * @date    2016-05-24
 */
function init()
{
	transporter = nodemailer.createTransport({
		host: ACCOUNT_CONFIG.host,
		port: ACCOUNT_CONFIG.port,
		auth: {
			user: ACCOUNT_CONFIG.user,
			pass: ACCOUNT_CONFIG.pass
		}
	});
}


/**
 * 发送邮件
 * @param   {string}   to      发送到的邮箱地址
 * @param   {string}   subject 主题
 * @param   {string}   content 内容
 *
 * @author co8bit
 * @version 0.0.1
 * @date    2016-05-24
 */
function send(to,subject,content,CONFIG)
{
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"'+ CONFIG.mail.username +'" <' + ACCOUNT_CONFIG.user + '>', //sender address
	    to: to, // list of receivers
	    subject: CONFIG.mail.prefixSubject + ":" + subject, // Subject line
	    html:  content + "<br><br><br>------------------------------------------------<br>" + CONFIG.mail.sign// html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    // console.log('Message sent: ' + info.response);
	    console.log('- 乱入：已发送邮件《'+subject+'》');
	});
}

exports.init = init;
exports.send = send;