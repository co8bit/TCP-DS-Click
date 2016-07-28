TCP-DS-Click
=================
a TCP-DS automatic test tool.  TCP-DS一键自动测试工具。

目前还在开发中，完成后我会补上使用说明。
目前计划支持的数据库：mysql和monetdb。

如有问题欢迎和我讨论<me@co8bit.com>

已知问题列表
----------
Q：mysql导入dat的时候出现`ERROR 1045 (28000): Access denied for user 'xxx'@'localhost' (using password: YES)`权限拒绝。
A：给相应用户开`load data`权限。




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
