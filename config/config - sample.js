//TPC-DS Click自身配置
var config = {
	debug: false,//是否开启debug模式
	parallel:4,//生成数据的时候几线程运行
	scale : 1,//数据测试规模
	stream_num : 3,
	// scale   => stream_num 对应关系
	// 1	   => tpc-ds文档未说明，我暂定3
	// 100     => 7
	// 300     => 9
	// 1,000   => 11
	// 3,000   => 13
	// 10,000  => 15
	// 30,000  => 17
	// 100,000 => 19


	dsdgen_dir : "/lib/tcpdsV2.1.0/tools/",
	dsqgen_dir : "/lib/tcpdsV2.1.0/tools/",
	query_templates_lst : "/lib/fixed_tcpds/query_templates/templates.lst",
	query_templates : "/lib/fixed_tcpds/query_templates",
	//下面的地址如果更换请确保文件夹存在
	//注意：开头没有`.`，是以`/`开头，基准位置是当前项目位置
	dsdgen_output_dir : "/output/data/",
	dsqgen_output_dir : "/output/query/",
	dsqgenStream_output_dir : "/output/query/stream/",

	_TABLE_NAME : ['call_center','catalog_page','catalog_returns','catalog_sales','customer','customer_address','customer_demographics','date_dim','dbgen_version','household_demographics','income_band','inventory','item','promotion','reason','ship_mode','store','store_returns','store_sales','time_dim','warehouse','web_page','web_returns','web_sales','web_site'],

	version:"0.0.1",//本程序的版本号

	report_display_reciprocal : true,//报告的结果用时间的倒数显示
	
	//假数据，中断后还可以生成正确报表
	//load中断
	loadbresk : {
		isBreak : false,//是否启用
		//各数据库的时间消耗
		load_monetdb : 33.576,
		load_mysql   : 4280.595,
	}
}








//数据库设置
var db = {
	mysql : {
		connectionLimit : config.stream_num,
		host     : 'localhost',
		port	 : 3306,
		user     : 'root',
		password : '',
		database : '',
	},
	monetdb : {
		dbname   : 'voc', 
		host     : 'localhost', 
		port     : 50000, 
		user     : 'monetdb', 
		password : 'monetdb'
	}
};



//邮件报告设置
var mail = {
	"host": "",
    "port": ,
    "user": "",
    "pass": "",

	"username": "TCP-DS-Click",
	"prefixSubject": "TCP-DS-Click",
	"sign": "by TCP-DS-Click "+ config.version,
	"attachmentsName": "TCP-DS-Click 运行结果报告",//附件名称

	//接收者列表
	mailList : [
		'',
	],
}


exports.config = config;
exports.db     = db;
exports.mail   = mail;