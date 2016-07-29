TCP-DS-Click
=================

[TOC]

简介
----------
a TCP-DS automatic test tool.  

TCP-DS数据库性能一键自动测试工具。

目前支持的数据库：mysql和monetdb。

如有问题欢迎和我讨论<me@co8bit.com>



使用方法
--------------
这里是个简略方法，具体方法以及如何添加新的数据库测试我稍后补上。

- 用make生成/lib下的dsdgen和dsqgen
- 准备monetdb和mysql数据库
- 用DDL文件创建数据表。
- 配置本程序参数
- 执行本程序
- 邮件会将结果发送到你的邮箱中去。

已知问题列表
----------
Q：mysql导入dat的时候出现`ERROR 1045 (28000): Access denied for user 'xxx'@'localhost' (using password: YES)`权限拒绝。
A：给相应用户开`load data`权限。

Q: monetdb drop表后重新建出现数据表已经存在。
A：我认为是monetdb的bug，这时候删掉对应的数据库再重建一个。



其他
-----------
获得文件的标准写法：

```js
//获得sql的标准用法：
var readf = util.ReadF.createNew(rootPath);
readf.readFile('query_0.sql');
var sqlArray =  readf.getSQL();
```





TODO List
------------
- TCP-DS的dsdgen生成的.dat文件编码方式用的不是utf-8（如customer.dat用的是latin），需要手动用vim转换为utf-8。不过奇怪的是只有customer导入会出错，需要手动转换编码。
- mysql的文件导入认为`\N`为null，而TCP-DS生成的.dat文件里，以`||`表示空，所以这里需要转换。不过我觉得鉴于TCP-DS的初衷是为了测量数据库性能，这里这个应该不会影响结果，所以未作修改。










统计结果集
----------
原始结果集：

```js
{ powerTest_monetdbArray: 
   [ { i: 0, time: '0.006', type: 'fail' },
     { i: 1, time: '0.038', type: 'succ' },
     { i: 2, time: '0.169', type: 'succ' },
     { i: 3, time: '0.263', type: 'succ' },
     { i: 4, time: '0.002', type: 'fail' },
     { i: 5, time: '0.024', type: 'succ' },
     { i: 6, time: '0.182', type: 'succ' },
     { i: 7, time: '0.001', type: 'fail' },
     { i: 8, time: '0.046', type: 'succ' },
     { i: 9, time: '0.075', type: 'succ' },
     { i: 10, time: '0.043', type: 'succ' },
     { i: 11, time: '0.087', type: 'succ' },
     { i: 12, time: '0.002', type: 'fail' },
     { i: 13, time: '0.088', type: 'succ' },
     { i: 14, time: '26.557', type: 'fail' },
     { i: 15, time: '0.001', type: 'fail' },
     { i: 16, time: '0.062', type: 'succ' },
     { i: 17, time: '0.030', type: 'succ' },
     { i: 18, time: '0.002', type: 'fail' },
     { i: 19, time: '0.058', type: 'succ' },
     { i: 20, time: '0.068', type: 'succ' },
     { i: 21, time: '0.051', type: 'succ' },
     { i: 22, time: '0.170', type: 'fail' },
     { i: 23, time: '0.565', type: 'succ' },
     { i: 24, time: '0.022', type: 'succ' },
     { i: 25, time: '0.389', type: 'succ' },
     { i: 26, time: '0.082', type: 'succ' },
     { i: 27, time: '0.127', type: 'succ' },
     { i: 28, time: '0.016', type: 'succ' },
     { i: 29, time: '0.039', type: 'succ' },
     { i: 30, time: '0.029', type: 'succ' },
     { i: 31, time: '0.004', type: 'fail' },
     { i: 32, time: '0.069', type: 'succ' },
     { i: 33, time: '0.166', type: 'succ' },
     { i: 34, time: '0.045', type: 'succ' },
     { i: 35, time: '0.002', type: 'fail' },
     { i: 36, time: '0.104', type: 'succ' },
     { i: 37, time: '0.020', type: 'succ' },
     { i: 38, time: '1.366', type: 'succ' },
     { i: 39, time: '0.035', type: 'succ' } ],
  throughputTest_monetdbArray: 
   [ { streamNo: 0, i: 0, time: '0.022', type: 'fail' },
     { streamNo: 2, i: 0, time: '0.023', type: 'fail' },
     { streamNo: 1, i: 0, time: '0.025', type: 'fail' },
     { streamNo: 2, i: 1, time: '0.080', type: 'succ' },
     { streamNo: 0, i: 1, time: '0.094', type: 'succ' },
     { streamNo: 1, i: 1, time: '0.112', type: 'succ' },
     { streamNo: 1, i: 2, time: '0.266', type: 'succ' },
     { streamNo: 0, i: 2, time: '0.308', type: 'succ' },
     { streamNo: 2, i: 2, time: '0.333', type: 'succ' },
     { streamNo: 2, i: 3, time: '0.300', type: 'succ' },
     { streamNo: 2, i: 4, time: '0.002', type: 'fail' },
     { streamNo: 2, i: 5, time: '0.049', type: 'succ' },
     { streamNo: 0, i: 3, time: '0.443', type: 'succ' },
     { streamNo: 0, i: 4, time: '0.002', type: 'fail' },
     { streamNo: 0, i: 5, time: '0.063', type: 'succ' },
     { streamNo: 1, i: 3, time: '0.648', type: 'succ' },
     { streamNo: 1, i: 4, time: '0.003', type: 'fail' },
     { streamNo: 1, i: 5, time: '0.038', type: 'succ' },
     { streamNo: 2, i: 6, time: '0.506', type: 'succ' },
     { streamNo: 2, i: 7, time: '0.001', type: 'fail' },
     { streamNo: 2, i: 8, time: '0.116', type: 'succ' },
     { streamNo: 1, i: 6, time: '0.364', type: 'succ' },
     { streamNo: 1, i: 7, time: '0.002', type: 'fail' },
     { streamNo: 0, i: 6, time: '0.589', type: 'succ' },
     { streamNo: 0, i: 7, time: '0.001', type: 'fail' },
     { streamNo: 2, i: 9, time: '0.202', type: 'succ' },
     { streamNo: 1, i: 8, time: '0.165', type: 'succ' },
     { streamNo: 0, i: 8, time: '0.104', type: 'succ' },
     { streamNo: 2, i: 10, time: '0.106', type: 'succ' },
     { streamNo: 0, i: 9, time: '0.178', type: 'succ' },
     { streamNo: 0, i: 10, time: '0.073', type: 'succ' },
     { streamNo: 2, i: 11, time: '0.194', type: 'succ' },
     { streamNo: 2, i: 12, time: '0.002', type: 'fail' },
     { streamNo: 1, i: 9, time: '0.438', type: 'succ' },
     { streamNo: 2, i: 13, time: '0.170', type: 'succ' },
     { streamNo: 0, i: 11, time: '0.245', type: 'succ' },
     { streamNo: 0, i: 12, time: '0.002', type: 'fail' },
     { streamNo: 1, i: 10, time: '0.165', type: 'succ' },
     { streamNo: 0, i: 13, time: '0.316', type: 'succ' },
     { streamNo: 1, i: 11, time: '0.258', type: 'succ' },
     { streamNo: 1, i: 12, time: '0.003', type: 'fail' },
     { streamNo: 1, i: 13, time: '0.375', type: 'succ' },
     { streamNo: 1, i: 14, time: '0.002', type: 'fail' },
     { streamNo: 1, i: 15, time: '0.166', type: 'succ' },
     { streamNo: 1, i: 16, time: '0.068', type: 'succ' },
     { streamNo: 1, i: 17, time: '0.002', type: 'fail' },
     { streamNo: 1, i: 18, time: '0.094', type: 'succ' },
     { streamNo: 1, i: 19, time: '0.107', type: 'succ' },
     { streamNo: 1, i: 20, time: '0.098', type: 'succ' },
     { streamNo: 1, i: 21, time: '0.393', type: 'fail' },
     { streamNo: 1, i: 22, time: '1.878', type: 'succ' },
     { streamNo: 1, i: 23, time: '0.084', type: 'succ' },
     { streamNo: 1, i: 24, time: '0.928', type: 'succ' },
     { streamNo: 1, i: 25, time: '0.207', type: 'succ' },
     { streamNo: 1, i: 26, time: '0.507', type: 'succ' },
     { streamNo: 1, i: 27, time: '0.096', type: 'succ' },
     { streamNo: 1, i: 28, time: '0.256', type: 'succ' },
     { streamNo: 1, i: 29, time: '0.157', type: 'succ' },
     { streamNo: 1, i: 30, time: '0.003', type: 'fail' },
     { streamNo: 1, i: 31, time: '0.431', type: 'succ' },
     { streamNo: 1, i: 32, time: '0.945', type: 'succ' },
     { streamNo: 1, i: 33, time: '0.174', type: 'succ' },
     { streamNo: 1, i: 34, time: '0.002', type: 'fail' },
     { streamNo: 1, i: 35, time: '0.458', type: 'succ' },
     { streamNo: 1, i: 36, time: '0.142', type: 'succ' },
     { streamNo: 1, i: 37, time: '4.774', type: 'fail' },
     { streamNo: 1, i: 38, time: '0.250', type: 'succ' },
     { streamNo: 0, i: 14, time: '19.338', type: 'fail' },
     { streamNo: 0, i: 15, time: '0.010', type: 'fail' },
     { streamNo: 0, i: 16, time: '0.120', type: 'succ' },
     { streamNo: 0, i: 17, time: '0.056', type: 'succ' },
     { streamNo: 0, i: 18, time: '0.003', type: 'fail' },
     { streamNo: 0, i: 19, time: '0.072', type: 'succ' },
     { streamNo: 0, i: 20, time: '0.090', type: 'succ' },
     { streamNo: 0, i: 21, time: '0.080', type: 'succ' },
     { streamNo: 0, i: 22, time: '0.231', type: 'fail' },
     { streamNo: 0, i: 23, time: '1.139', type: 'succ' },
     { streamNo: 0, i: 24, time: '0.053', type: 'succ' },
     { streamNo: 0, i: 25, time: '0.908', type: 'succ' },
     { streamNo: 0, i: 26, time: '0.188', type: 'succ' },
     { streamNo: 0, i: 27, time: '0.242', type: 'succ' },
     { streamNo: 0, i: 28, time: '0.031', type: 'succ' },
     { streamNo: 0, i: 29, time: '0.090', type: 'succ' },
     { streamNo: 0, i: 30, time: '0.091', type: 'succ' },
     { streamNo: 0, i: 31, time: '0.006', type: 'fail' },
     { streamNo: 0, i: 32, time: '0.424', type: 'succ' },
     { streamNo: 0, i: 33, time: '0.645', type: 'succ' },
     { streamNo: 0, i: 34, time: '0.119', type: 'succ' },
     { streamNo: 0, i: 35, time: '0.003', type: 'fail' },
     { streamNo: 0, i: 36, time: '0.225', type: 'succ' },
     { streamNo: 0, i: 37, time: '0.033', type: 'succ' },
     { streamNo: 0, i: 38, time: '2.367', type: 'succ' },
     { streamNo: 0, i: 39, time: '0.048', type: 'succ' },
     { streamNo: 2, i: 14, time: '33.662', type: 'fail' },
     { streamNo: 2, i: 15, time: '0.002', type: 'fail' },
     { streamNo: 2, i: 16, time: '0.072', type: 'succ' },
     { streamNo: 2, i: 17, time: '0.034', type: 'succ' },
     { streamNo: 2, i: 18, time: '0.002', type: 'fail' },
     { streamNo: 2, i: 19, time: '0.055', type: 'succ' },
     { streamNo: 2, i: 20, time: '0.078', type: 'succ' },
     ... 19 more items ],
  load_monetdb: '33.786',
  powerTest_monetdb: '31.105',
  throughputTest_monetdb: '83.528' }

```





经过genresult后的结果集：

```js
{ powerTest_monetdbArray_X: 
   [ 0,
     1,
     2,
     3,
     4,
     5,
     6,
     7,
     8,
     9,
     10,
     11,
     12,
     13,
     14,
     15,
     16,
     17,
     18,
     19,
     20,
     21,
     22,
     23,
     24,
     25,
     26,
     27,
     28,
     29,
     30,
     31,
     32,
     33,
     34,
     35,
     36,
     37,
     38,
     39 ],
  powerTest_monetdbArray_Y: 
   [ 0.023,
     0.042,
     0.101,
     0.17,
     0.003,
     0.018,
     0.18,
     0.003,
     0.046,
     0.079,
     0.048,
     0.093,
     0.003,
     0.091,
     28.451,
     0.002,
     0.065,
     0.036,
     0.004,
     0.054,
     0.06,
     0.046,
     0.433,
     0.553,
     0.022,
     0.405,
     0.11,
     0.121,
     0.016,
     0.036,
     0.033,
     0.005,
     0.074,
     0.172,
     0.039,
     0.005,
     0.108,
     0.018,
     1.426,
     0.031 ],
  powerTest_monetdbFailArray: 
   [ [ [Object], [Object] ],
     [ [Object], [Object] ],
     [ [Object], [Object] ],
     [ [Object], [Object] ],
     [ [Object], [Object] ],
     [ [Object], [Object] ],
     [ [Object], [Object] ],
     [ [Object], [Object] ],
     [ [Object], [Object] ],
     [ [Object], [Object] ] ],
  powerTest_monetdb: '33.225',
  throughputTest_monetdb: '98.291',
  throughputTest_monetdb_stream: [ '32.845', '15.631', '49.815' ],
  throughputTest_monetdbArray_X: 
   [ [ 0,
       1,
       2,
       3,
       4,
       5,
       6,
       7,
       8,
       9,
       10,
       11,
       12,
       13,
       14,
       15,
       16,
       17,
       18,
       19,
       20,
       21,
       22,
       23,
       24,
       25,
       26,
       27,
       28,
       29,
       30,
       31,
       32,
       33,
       34,
       35,
       36,
       37,
       38,
       39 ],
     [ 0,
       1,
       2,
       3,
       4,
       5,
       6,
       7,
       8,
       9,
       10,
       11,
       12,
       13,
       14,
       15,
       16,
       17,
       18,
       19,
       20,
       21,
       22,
       23,
       24,
       25,
       26,
       27,
       28,
       29,
       30,
       31,
       32,
       33,
       34,
       35,
       36,
       37,
       38 ],
     [ 0,
       1,
       2,
       3,
       4,
       5,
       6,
       7,
       8,
       9,
       10,
       11,
       12,
       13,
       14,
       15,
       16,
       17,
       18,
       19,
       20,
       21,
       22,
       23,
       24,
       25,
       26,
       27,
       28,
       29,
       30,
       31,
       32,
       33,
       34,
       35,
       36,
       37,
       38,
       39 ] ],
  throughputTest_monetdbArray_Y: 
   [ [ 0.02,
       0.066,
       0.288,
       0.485,
       0.003,
       0.034,
       0.35,
       0.004,
       0.074,
       0.262,
       0.092,
       0.235,
       0.005,
       0.287,
       25.507,
       0.002,
       0.073,
       0.035,
       0.005,
       0.052,
       0.06,
       0.049,
       0.218,
       0.616,
       0.022,
       0.397,
       0.124,
       0.183,
       0.019,
       0.042,
       0.037,
       0.004,
       0.124,
       0.29,
       0.053,
       0.005,
       0.139,
       0.03,
       2.516,
       0.038 ],
     [ 0.019,
       0.04,
       0.316,
       0.353,
       0.005,
       0.036,
       0.566,
       0.008,
       0.102,
       0.154,
       0.096,
       0.169,
       0.004,
       0.414,
       0.003,
       0.147,
       0.129,
       0.006,
       0.087,
       0.148,
       0.112,
       0.341,
       2.032,
       0.095,
       1.652,
       0.335,
       0.46,
       0.047,
       0.293,
       0.118,
       0.005,
       0.277,
       1.393,
       0.185,
       0.003,
       0.419,
       0.1,
       4.718,
       0.244 ],
     [ 0.022,
       0.062,
       0.228,
       0.523,
       0.004,
       0.054,
       0.759,
       0.002,
       0.123,
       0.177,
       0.108,
       0.199,
       0.004,
       0.458,
       43.355,
       0.002,
       0.058,
       0.036,
       0.004,
       0.047,
       0.052,
       0.037,
       0.331,
       0.57,
       0.024,
       0.407,
       0.084,
       0.12,
       0.045,
       0.039,
       0.043,
       0.005,
       0.089,
       0.162,
       0.043,
       0.003,
       0.107,
       0.018,
       1.38,
       0.031 ] ],
  throughputTest_monetdbFailArray: 
   [ [ [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object] ],
     [ [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object] ],
     [ [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object] ] ] }

```



备注
----------
monetdb下因为形如以下sql会导致崩溃，所以被我从sql文件里剔除了。

```sql
select  
  cd_gender,
  cd_marital_status,
  cd_education_status,
  count(*) as cnt1,
  cd_purchase_estimate,
  count(*) as cnt2,
  cd_credit_rating,
  count(*) as cnt3,
  cd_dep_count,
  count(*) as cnt4,
  cd_dep_employed_count,
  count(*) as cnt5,
  cd_dep_college_count,
  count(*) as cnt6
 from
  customer c,customer_address ca,customer_demographics
 where
  c.c_current_addr_sk = ca.ca_address_sk and
  ca_county in ('Butler County','Montgomery County','Pottawatomie County','Coffee County','Stark County') and
  cd_demo_sk = c.c_current_cdemo_sk and 
  exists (select *
          from store_sales,date_dim
          where c.c_customer_sk = ss_customer_sk and
                ss_sold_date_sk = d_date_sk and
                d_year = 2002 and
                d_moy between 2 and 2+3) and
   (exists (select *
            from web_sales,date_dim
            where c.c_customer_sk = ws_bill_customer_sk and
                  ws_sold_date_sk = d_date_sk and
                  d_year = 2002 and
                  d_moy between 2 ANd 2+3) or 
    exists (select * 
            from catalog_sales,date_dim
            where c.c_customer_sk = cs_ship_customer_sk and
                  cs_sold_date_sk = d_date_sk and
                  d_year = 2002 and
                  d_moy between 2 and 2+3))
 group by cd_gender,
          cd_marital_status,
          cd_education_status,
          cd_purchase_estimate,
          cd_credit_rating,
          cd_dep_count,
          cd_dep_employed_count,
          cd_dep_college_count
 order by cd_gender,
          cd_marital_status,
          cd_education_status,
          cd_purchase_estimate,
          cd_credit_rating,
          cd_dep_count,
          cd_dep_employed_count,
          cd_dep_college_count
limit 100;




select  
  cd_gender,
  cd_marital_status,
  cd_education_status,
  count(*) as cnt1,
  cd_purchase_estimate,
  count(*) as cnt2,
  cd_credit_rating,
  count(*) as cnt3,
  cd_dep_count,
  count(*) as cnt4,
  cd_dep_employed_count,
  count(*) as cnt5,
  cd_dep_college_count,
  count(*) as cnt6
 from
  customer c,customer_address ca,customer_demographics
 where
  c.c_current_addr_sk = ca.ca_address_sk and
  ca_county in ('Grimes County','Custer County','Wicomico County','Love County','Miami County') and
  cd_demo_sk = c.c_current_cdemo_sk and 
  exists (select *
          from store_sales,date_dim
          where c.c_customer_sk = ss_customer_sk and
                ss_sold_date_sk = d_date_sk and
                d_year = 2000 and
                d_moy between 2 and 2+3) and
   (exists (select *
            from web_sales,date_dim
            where c.c_customer_sk = ws_bill_customer_sk and
                  ws_sold_date_sk = d_date_sk and
                  d_year = 2000 and
                  d_moy between 2 ANd 2+3) or 
    exists (select * 
            from catalog_sales,date_dim
            where c.c_customer_sk = cs_ship_customer_sk and
                  cs_sold_date_sk = d_date_sk and
                  d_year = 2000 and
                  d_moy between 2 and 2+3))
 group by cd_gender,
          cd_marital_status,
          cd_education_status,
          cd_purchase_estimate,
          cd_credit_rating,
          cd_dep_count,
          cd_dep_employed_count,
          cd_dep_college_count
 order by cd_gender,
          cd_marital_status,
          cd_education_status,
          cd_purchase_estimate,
          cd_credit_rating,
          cd_dep_count,
          cd_dep_employed_count,
          cd_dep_college_count
limit 100;


等等等等
```
