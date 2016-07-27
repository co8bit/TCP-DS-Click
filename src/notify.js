var sendMail = require("./sendMail");


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
	htmlView += '\
		    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->\
		    <div id="main" style="width: 1800px;height:800px;"></div>\
		    <script type="text/javascript">\
		        var myChart = echarts.init(document.getElementById(\'main\'));\
	';

	var option = {
	    title : {
	        text: 'TCP-DS Click结果图',
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
	        	max : 5,
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
	            data:[0.03,0.02,0.51,0.02,3.2,30.2,20.5,2.5],
	            markLine : {
	                data : [
	                    {type : 'average', name : '平均值'}
	                ]
	            }
	        }
	    ]
	};


	htmlView += 'option = '+JSON.stringify(option)+';';

	htmlView += 'myChart.setOption(option);\
		    </script>\
		</body>\
		</html>\
	';

	// console.log(htmlView);
	sendMail.send("测试结果",htmlView);
}


exports.notify = notify;
