TCP-DS-Click
=================
a TCP-DS automatic test tool.  TCP-DS一键自动测试工具。

目前还在开发中，完成后我会补上使用说明。
目前计划支持的数据库：mysql和monetdb。

如有问题欢迎和我讨论<me@co8bit.com>








备注
==============
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