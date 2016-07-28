var sendMail = require("./sendMail");
var CONFIG = require('../config/config');


var notify = (stat) => {

	//初始化sendMail
	sendMail.init();

	var htmlView = '\
		<!DOCTYPE html>\
		<html>\
		<header>\
		    <meta charset="utf-8">\
		    <!-- 引入 ECharts 文件 -->\
		    <!--  下面的网址失效情况下使用：<script src="//cdn.bootcss.com/echarts/3.2.2/echarts.min.js"></script>  -->\
		    <script src="http://echarts.baidu.com/dist/echarts.min.js"></script>\
		</header>\
		<body>';
	



	//QphDS result
	htmlView += '\
		    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->\
		    <div id="QphDS" style="width: 1800px;height:800px;"></div>\
		    <script type="text/javascript">\
		        var QphDSChart = echarts.init(document.getElementById(\'QphDS\'));\
	';
	var QphDSOption = {
	    title : {
	        text: 'TCP-DS Click : 性能指标',
	        subtext: '作者：me@co8bit.com'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['monetdb','mysql']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['QphDS@SF'],
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            type:'bar',
	            name:'monetdb',
	            data:[stat.QphDS],
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            },
	        },
	        {
	            type:'bar',
	            name:'mysql',
	            data:[5000],
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            },
	        }
	    ]
	};
	htmlView += 'QphDSOption = '+JSON.stringify(QphDSOption)+';';
	htmlView += 'QphDSChart.setOption(QphDSOption);';
	htmlView += '</script>';




	//total result
	htmlView += '\
		    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->\
		    <div id="result" style="width: 1800px;height:800px;"></div>\
		    <script type="text/javascript">\
		        var resultChart = echarts.init(document.getElementById(\'result\'));\
	';
	var resultOption = {
	    title : {
	        text: 'TCP-DS Click : 各项测试耗时',
	        subtext: '作者：me@co8bit.com'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['monetdb','mysql']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['Load Test','Power Test','Throughput Test'],
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            type:'bar',
	            name:'monetdb',
	            data:[stat.load_monetdb,stat.powerTest_monetdb,stat.throughputTest_monetdb],
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            },
	        },
	        {
	            type:'bar',
	            name:'mysql',
	            data:[2,50,3],
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            },
	        }
	    ]
	};
	htmlView += 'resultOption = '+JSON.stringify(resultOption)+';';
	htmlView += 'resultChart.setOption(resultOption);';
	htmlView += '</script>';






	//power
	htmlView += '\
		    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->\
		    <div id="power" style="width: 1800px;height:800px;"></div>\
		    <script type="text/javascript">\
		        var powerChart = echarts.init(document.getElementById(\'power\'));\
	';
	var powerOption = {
	    title : {
	        text: 'TCP-DS Click : power 结果图',
	        subtext: '作者：me@co8bit.com'
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['monetdb','mysql']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            dataView : {show: true, readOnly: false},
	            magicType : {show: true, type: ['line', 'bar']},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : stat.powerTest_monetdbArray_X,
	        }
	    ],
	    yAxis : [
	        {
	        	max : CONFIG.config.draw_yAxis_max,
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            type:'bar',
	            name:'monetdb',
	            data:stat.powerTest_monetdbArray_Y,
	            markPoint : {
	                data : [
	                    {type : 'max', name: '最大值'},
	                    {type : 'min', name: '最小值'}
	                ]
	            },
	            markLine : {
	                data : [
	                    {type : 'average', name: '平均值'}
	                ]
	            },
	            markArea : {
	                data : stat.powerTest_monetdbFailArray,
	            },
	        },
	        {
	            type:'bar',
	            name:'mysql',
	            data:[0.025,0.045,0.109,0.162,0.003,0.019,0.169,0.003,0.051,0.086,0.046,0.084,0.004,0.101,30.643,0.002,0.069,0.035,0.003,0.074,0.08,0.054,0.271,0.554,0.025,0.389,0.09,0.13,0.019,0.045,0.036,0.004,0.071,0.197,0.048,0.003,0.116,0.023,1.493,0.032],
	            markLine : {
	                data : [
	                    {type : 'average', name : '平均值'}
	                ]
	            }
	        }
	    ]
	};
	htmlView += 'powerOption = '+JSON.stringify(powerOption)+';';
	htmlView += 'powerChart.setOption(powerOption);';
	htmlView += '</script>';


	//throughput
	var throughputOption = [];
	var streamNumArray = [];
	for(var i = 0; i < CONFIG.config.stream_num; i++)
		streamNumArray.push(i);
	streamNumArray.forEach( (streamNo) => {
		htmlView += '\
			    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->\
			    <div id="throughput'+streamNo+'" style="width: 1800px;height:800px;"></div>\
			    <script type="text/javascript">\
			        var throughputChart'+streamNo+' = echarts.init(document.getElementById("throughput'+streamNo+'"));\
		';
		throughputOption[streamNo] = {
		    title : {
		        text: 'TCP-DS Click : throughput第'+streamNo+'条流 结果图',
		        subtext: '作者：me@co8bit.com'
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['monetdb','mysql']
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            data : stat.throughputTest_monetdbArray_X[streamNo],
		        }
		    ],
		    yAxis : [
		        {
		        	max : CONFIG.config.draw_yAxis_max,
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            type:'bar',
		            name:'monetdb',
		            data:stat.throughputTest_monetdbArray_Y[streamNo],
		            markPoint : {
		                data : [
		                    {type : 'max', name: '最大值'},
		                    {type : 'min', name: '最小值'}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name: '平均值'}
		                ]
		            },
		            markArea : {
		                data : stat.throughputTest_monetdbFailArray[streamNo],
		            },
		        },
		        {
		            type:'bar',
		            name:'mysql',
		            data:[0.033,0.063,0.308,0.411,0.003,0.069,0.468,0.003,0.131,0.206,0.12,0.23,0.004,0.306,0.006,0.128,0.072,0.006,0.17,0.107,0.14,0.312,1.684,0.054,1.434,0.383,0.34,0.024,0.254,0.158,0.004,0.415,0.803,0.146,0.004,0.417,0.112,3.902,0.151],
		            markLine : {
		                data : [
		                    {type : 'average', name : '平均值'}
		                ]
		            }
		        }
		    ]
		};
		htmlView += 'throughputOption'+streamNo+' = '+JSON.stringify(throughputOption[streamNo])+';';
		htmlView += 'throughputChart'+streamNo+'.setOption(throughputOption'+streamNo+');';
		htmlView += '</script>';
	});


	htmlView += '\
		</body>\
		</html>\
	';

	// console.log(htmlView);
	sendMail.send("测试结果",htmlView);
}


exports.notify = notify;
