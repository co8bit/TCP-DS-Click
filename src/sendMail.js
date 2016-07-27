var MAIL_CONFIG = require('../config/config').mail;
var nodemailer = require('nodemailer');

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
		host: MAIL_CONFIG.host,
		port: MAIL_CONFIG.port,
		auth: {
			user: MAIL_CONFIG.user,
			pass: MAIL_CONFIG.pass
		}
	});
}


/**
 * 发送邮件
 * @param   {string}   subject 主题
 * @param   {string}   content 内容
 *
 * @author co8bit
 * @version 0.0.1
 * @date    2016-05-24
 */
function send(subject,content)
{
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"'+ MAIL_CONFIG.username +'" <' + MAIL_CONFIG.user + '>', //sender address
	    to: MAIL_CONFIG.mailList, // list of receivers
	    subject: MAIL_CONFIG.prefixSubject + "---" + subject, // Subject line
	    html:  "详情见附件。<br><br>请下载到本地然后打开。<br><br><br>------------------------------------------------<br>" + MAIL_CONFIG.sign,// html body
	    attachments: [
	        {   // utf-8 string as an attachment
	            filename: MAIL_CONFIG.attachmentsName+'.html',
	            content: content,
	        },
        ]
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