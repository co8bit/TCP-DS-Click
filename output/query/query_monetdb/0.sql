
select  
   sum(ws_ext_discount_amt)  as "Excess Discount Amount" 
from 
    web_sales 
   ,item 
   ,date_dim
where
i_manufact_id = 74
and i_item_sk = ws_item_sk 
and d_date between '2000-01-07' and 
        (cast('2000-01-07' as date) + interval '90 days')
and d_date_sk = ws_sold_date_sk 
and ws_ext_discount_amt  
     > ( 
         SELECT 
            1.3 * avg(ws_ext_discount_amt) 
         FROM 
            web_sales 
           ,date_dim
         WHERE 
              ws_item_sk = i_item_sk 
          and d_date between '2000-01-07' and
                             (cast('2000-01-07' as date) + interval '90 days')
          and d_date_sk = ws_sold_date_sk 
      ) 
order by sum(ws_ext_discount_amt)
limit 100;



select  
        cc_call_center_id as Call_Center,
        cc_name as Call_Center_Name,
        cc_manager as Manager,
        sum(cr_net_loss) as Returns_Loss
from
        call_center,
        catalog_returns,
        date_dim,
        customer,
        customer_address,
        customer_demographics,
        household_demographics
where
        cr_call_center_sk       = cc_call_center_sk
and     cr_returned_date_sk     = d_date_sk
and     cr_returning_customer_sk= c_customer_sk
and     cd_demo_sk              = c_current_cdemo_sk
and     hd_demo_sk              = c_current_hdemo_sk
and     ca_address_sk           = c_current_addr_sk
and     d_year                  = 2002 
and     d_moy                   = 11
and     ( (cd_marital_status       = 'M' and cd_education_status     = 'Unknown')
        or(cd_marital_status       = 'W' and cd_education_status     = 'Advanced Degree'))
and     hd_buy_potential like 'Unknown%'
and     ca_gmt_offset           = -6
group by cc_call_center_id,cc_name,cc_manager,cd_marital_status,cd_education_status
order by sum(cr_net_loss) desc;



select avg(ss_quantity)
       ,avg(ss_ext_sales_price)
       ,avg(ss_ext_wholesale_cost)
       ,sum(ss_ext_wholesale_cost)
 from store_sales
     ,store
     ,customer_demographics
     ,household_demographics
     ,customer_address
     ,date_dim
 where s_store_sk = ss_store_sk
 and  ss_sold_date_sk = d_date_sk and d_year = 2001
 and((ss_hdemo_sk=hd_demo_sk
  and cd_demo_sk = ss_cdemo_sk
  and cd_marital_status = 'M'
  and cd_education_status = '2 yr Degree'
  and ss_sales_price between 100.00 and 150.00
  and hd_dep_count = 3   
     )or
     (ss_hdemo_sk=hd_demo_sk
  and cd_demo_sk = ss_cdemo_sk
  and cd_marital_status = 'D'
  and cd_education_status = 'Advanced Degree'
  and ss_sales_price between 50.00 and 100.00   
  and hd_dep_count = 1
     ) or 
     (ss_hdemo_sk=hd_demo_sk
  and cd_demo_sk = ss_cdemo_sk
  and cd_marital_status = 'U'
  and cd_education_status = '4 yr Degree'
  and ss_sales_price between 150.00 and 200.00 
  and hd_dep_count = 1  
     ))
 and((ss_addr_sk = ca_address_sk
  and ca_country = 'United States'
  and ca_state in ('KY', 'OH', 'TN')
  and ss_net_profit between 100 and 200  
     ) or
     (ss_addr_sk = ca_address_sk
  and ca_country = 'United States'
  and ca_state in ('AL', 'MI', 'PA')
  and ss_net_profit between 150 and 300  
     ) or
     (ss_addr_sk = ca_address_sk
  and ca_country = 'United States'
  and ca_state in ('FL', 'TX', 'CA')
  and ss_net_profit between 50 and 250  
     ))
;



select case when (select count(*) 
                  from store_sales 
                  where ss_quantity between 1 and 20) > 38482
            then (select avg(ss_ext_sales_price) 
                  from store_sales 
                  where ss_quantity between 1 and 20) 
            else (select avg(ss_net_profit)
                  from store_sales
                  where ss_quantity between 1 and 20) end as bucket1 ,
       case when (select count(*)
                  from store_sales
                  where ss_quantity between 21 and 40) > 1034
            then (select avg(ss_ext_sales_price)
                  from store_sales
                  where ss_quantity between 21 and 40) 
            else (select avg(ss_net_profit)
                  from store_sales
                  where ss_quantity between 21 and 40) end as bucket2,
       case when (select count(*)
                  from store_sales
                  where ss_quantity between 41 and 60) > 889
            then (select avg(ss_ext_sales_price)
                  from store_sales
                  where ss_quantity between 41 and 60)
            else (select avg(ss_net_profit)
                  from store_sales
                  where ss_quantity between 41 and 60) end as bucket3,
       case when (select count(*)
                  from store_sales
                  where ss_quantity between 61 and 80) > 17613
            then (select avg(ss_ext_sales_price)
                  from store_sales
                  where ss_quantity between 61 and 80)
            else (select avg(ss_net_profit)
                  from store_sales
                  where ss_quantity between 61 and 80) end as bucket4,
       case when (select count(*)
                  from store_sales
                  where ss_quantity between 81 and 100) > 20938
            then (select avg(ss_ext_sales_price)
                  from store_sales
                  where ss_quantity between 81 and 100)
            else (select avg(ss_net_profit)
                  from store_sales
                  where ss_quantity between 81 and 100) end as bucket5
from reason
where r_reason_sk = 1
;



select  *
 from(select w_warehouse_name
            ,i_item_id
            ,sum(case when (cast(d_date as date) < cast ('2002-04-08' as date))
                  then inv_quantity_on_hand 
                      else 0 end) as inv_before
            ,sum(case when (cast(d_date as date) >= cast ('2002-04-08' as date))
                      then inv_quantity_on_hand 
                      else 0 end) as inv_after
   from inventory
       ,warehouse
       ,item
       ,date_dim
   where i_current_price between 0.99 and 1.49
     and i_item_sk          = inv_item_sk
     and inv_warehouse_sk   = w_warehouse_sk
     and inv_date_sk    = d_date_sk
     and d_date between (cast ('2002-04-08' as date) - interval '30 days')
                    and (cast ('2002-04-08' as date) + interval '30 days')
   group by w_warehouse_name, i_item_id) x
 where (case when inv_before > 0 
             then inv_after / inv_before 
             else null
             end) between 2.0/3.0 and 3.0/2.0
 order by w_warehouse_name
         ,i_item_id
 limit 100;



select  cast(amc as decimal(15,4))/cast(pmc as decimal(15,4)) as am_pm_ratio
 from ( select count(*) as amc
       from web_sales, household_demographics , time_dim, web_page
       where ws_sold_time_sk = time_dim.t_time_sk
         and ws_ship_hdemo_sk = household_demographics.hd_demo_sk
         and ws_web_page_sk = web_page.wp_web_page_sk
         and time_dim.t_hour between 9 and 9+1
         and household_demographics.hd_dep_count = 8
         and web_page.wp_char_count between 5000 and 5200) at,
      ( select count(*) as pmc
       from web_sales, household_demographics , time_dim, web_page
       where ws_sold_time_sk = time_dim.t_time_sk
         and ws_ship_hdemo_sk = household_demographics.hd_demo_sk
         and ws_web_page_sk = web_page.wp_web_page_sk
         and time_dim.t_hour between 15 and 15+1
         and household_demographics.hd_dep_count = 8
         and web_page.wp_char_count between 5000 and 5200) pt
 order by am_pm_ratio
 limit 100;



select  ss_customer_sk
            ,sum(act_sales) as sumsales
      from (select ss_item_sk
                  ,ss_ticket_number
                  ,ss_customer_sk
                  ,case when sr_return_quantity is not null then (ss_quantity-sr_return_quantity)*ss_sales_price
                                                            else (ss_quantity*ss_sales_price) end as act_sales
            from store_sales left outer join store_returns on (sr_item_sk = ss_item_sk
                                                               and sr_ticket_number = ss_ticket_number)
                ,reason
            where sr_reason_sk = r_reason_sk
              and r_reason_desc = 'reason 26') t
      group by ss_customer_sk
      order by sumsales, ss_customer_sk
limit 100;



select  
   count(distinct cs_order_number) as "order count"
  ,sum(cs_ext_ship_cost) as "total shipping cost"
  ,sum(cs_net_profit) as "total net profit"
from
   catalog_sales cs1
  ,date_dim
  ,customer_address
  ,call_center
where
    d_date between '2001-3-01' and 
           (cast('2001-3-01' as date) + interval '60 days')
and cs1.cs_ship_date_sk = d_date_sk
and cs1.cs_ship_addr_sk = ca_address_sk
and ca_state = 'AR'
and cs1.cs_call_center_sk = cc_call_center_sk
and cc_county in ('Williamson County','Williamson County','Williamson County','Williamson County',
                  'Williamson County'
)
and exists (select *
            from catalog_sales cs2
            where cs1.cs_order_number = cs2.cs_order_number
              and cs1.cs_warehouse_sk <> cs2.cs_warehouse_sk)
and not exists(select *
               from catalog_returns cr1
               where cs1.cs_order_number = cr1.cr_order_number)
order by count(distinct cs_order_number)
limit 100;



select  c_last_name
       ,c_first_name
       ,ca_city
       ,bought_city
       ,ss_ticket_number
       ,extended_price
       ,extended_tax
       ,list_price
 from (select ss_ticket_number
             ,ss_customer_sk
             ,ca_city as bought_city
             ,sum(ss_ext_sales_price) as extended_price 
             ,sum(ss_ext_list_price) as list_price
             ,sum(ss_ext_tax) as extended_tax 
       from store_sales
           ,date_dim
           ,store
           ,household_demographics
           ,customer_address 
       where store_sales.ss_sold_date_sk = date_dim.d_date_sk
         and store_sales.ss_store_sk = store.s_store_sk  
        and store_sales.ss_hdemo_sk = household_demographics.hd_demo_sk
        and store_sales.ss_addr_sk = customer_address.ca_address_sk
        and date_dim.d_dom between 1 and 2 
        and (household_demographics.hd_dep_count = 2 or
             household_demographics.hd_vehicle_count= 1)
        and date_dim.d_year in (2000,2000+1,2000+2)
        and store.s_city in ('Midway','Fairview')
       group by ss_ticket_number
               ,ss_customer_sk
               ,ss_addr_sk,ca_city) dn
      ,customer
      ,customer_address current_addr
 where ss_customer_sk = c_customer_sk
   and customer.c_current_addr_sk = current_addr.ca_address_sk
   and current_addr.ca_city <> bought_city
 order by c_last_name
         ,ss_ticket_number
 limit 100;



select sum (ss_quantity)
 from store_sales, store, customer_demographics, customer_address, date_dim
 where s_store_sk = ss_store_sk
 and  ss_sold_date_sk = d_date_sk and d_year = 1998
 and  
 (
  (
   cd_demo_sk = ss_cdemo_sk
   and 
   cd_marital_status = 'W'
   and 
   cd_education_status = 'Unknown'
   and 
   ss_sales_price between 100.00 and 150.00  
   )
 or
  (
  cd_demo_sk = ss_cdemo_sk
   and 
   cd_marital_status = 'W'
   and 
   cd_education_status = 'Unknown'
   and 
   ss_sales_price between 50.00 and 100.00   
  )
 or 
 (
  cd_demo_sk = ss_cdemo_sk
  and 
   cd_marital_status = 'W'
   and 
   cd_education_status = 'Unknown'
   and 
   ss_sales_price between 150.00 and 200.00  
 )
 )
 and
 (
  (
  ss_addr_sk = ca_address_sk
  and
  ca_country = 'United States'
  and
  ca_state in ('NE', 'MN', 'TN')
  and ss_net_profit between 0 and 2000  
  )
 or
  (ss_addr_sk = ca_address_sk
  and
  ca_country = 'United States'
  and
  ca_state in ('MI', 'UT', 'AR')
  and ss_net_profit between 150 and 3000 
  )
 or
  (ss_addr_sk = ca_address_sk
  and
  ca_country = 'United States'
  and
  ca_state in ('KS', 'IA', 'OH')
  and ss_net_profit between 50 and 25000 
  )
 )
;



select  channel, col_name, d_year, d_qoy, i_category, COUNT(*) as sales_cnt, SUM(ext_sales_price) as sales_amt FROM (
        SELECT 'store' as channel, 'ss_hdemo_sk' as col_name, d_year, d_qoy, i_category, ss_ext_sales_price as ext_sales_price
         FROM store_sales, item, date_dim
         WHERE ss_hdemo_sk IS NULL
           AND ss_sold_date_sk=d_date_sk
           AND ss_item_sk=i_item_sk
        UNION ALL
        SELECT 'web' as channel, 'ws_promo_sk' as col_name, d_year, d_qoy, i_category, ws_ext_sales_price as ext_sales_price
         FROM web_sales, item, date_dim
         WHERE ws_promo_sk IS NULL
           AND ws_sold_date_sk=d_date_sk
           AND ws_item_sk=i_item_sk
        UNION ALL
        SELECT 'catalog' as channel, 'cs_ship_hdemo_sk' as col_name, d_year, d_qoy, i_category, cs_ext_sales_price as ext_sales_price
         FROM catalog_sales, item, date_dim
         WHERE cs_ship_hdemo_sk IS NULL
           AND cs_sold_date_sk=d_date_sk
           AND cs_item_sk=i_item_sk) foo
GROUP BY channel, col_name, d_year, d_qoy, i_category
ORDER BY channel, col_name, d_year, d_qoy, i_category
limit 100;



select  i_item_id, 
        avg(ss_quantity) as agg1,
        avg(ss_list_price) as agg2,
        avg(ss_coupon_amt) as agg3,
        avg(ss_sales_price) as agg4 
 from store_sales, customer_demographics, date_dim, item, promotion
 where ss_sold_date_sk = d_date_sk and
       ss_item_sk = i_item_sk and
       ss_cdemo_sk = cd_demo_sk and
       ss_promo_sk = p_promo_sk and
       cd_gender = 'M' and 
       cd_marital_status = 'M' and
       cd_education_status = 'Advanced Degree' and
       (p_channel_email = 'N' or p_channel_event = 'N') and
       d_year = 2002 
 group by i_item_id
 order by i_item_id
 limit 100;



select  i_item_id
       ,i_item_desc
       ,i_current_price
 from item, inventory, date_dim, catalog_sales
 where i_current_price between 62 and 62 + 30
 and inv_item_sk = i_item_sk
 and d_date_sk=inv_date_sk
 and d_date between cast('1999-06-18' as date) and (cast('1999-06-18' as date) +  interval '60 days')
 and i_manufact_id in (676,849,747,939)
 and inv_quantity_on_hand between 100 and 500
 and cs_item_sk = i_item_sk
 group by i_item_id,i_item_desc,i_current_price
 order by i_item_id
 limit 100;



select  s_store_name, s_store_id,
        sum(case when (d_day_name='Sunday') then ss_sales_price else null end) as sun_sales,
        sum(case when (d_day_name='Monday') then ss_sales_price else null end) as mon_sales,
        sum(case when (d_day_name='Tuesday') then ss_sales_price else  null end) as tue_sales,
        sum(case when (d_day_name='Wednesday') then ss_sales_price else null end) as wed_sales,
        sum(case when (d_day_name='Thursday') then ss_sales_price else null end) as thu_sales,
        sum(case when (d_day_name='Friday') then ss_sales_price else null end) as fri_sales,
        sum(case when (d_day_name='Saturday') then ss_sales_price else null end) as sat_sales
 from date_dim, store_sales, store
 where d_date_sk = ss_sold_date_sk and
       s_store_sk = ss_store_sk and
       s_gmt_offset = -5 and
       d_year = 1999 
 group by s_store_name, s_store_id
 order by s_store_name, s_store_id,sun_sales,mon_sales,tue_sales,wed_sales,thu_sales,fri_sales,sat_sales
 limit 100;



select  i_item_desc
      ,w_warehouse_name
      ,d1.d_week_seq
      ,count(case when p_promo_sk is null then 1 else 0 end) as no_promo
      ,count(case when p_promo_sk is not null then 1 else 0 end) as promo
      ,count(*) as total_cnt
from catalog_sales
join inventory on (cs_item_sk = inv_item_sk)
join warehouse on (w_warehouse_sk=inv_warehouse_sk)
join item on (i_item_sk = cs_item_sk)
join customer_demographics on (cs_bill_cdemo_sk = cd_demo_sk)
join household_demographics on (cs_bill_hdemo_sk = hd_demo_sk)
join date_dim d1 on (cs_sold_date_sk = d1.d_date_sk)
join date_dim d2 on (inv_date_sk = d2.d_date_sk)
join date_dim d3 on (cs_ship_date_sk = d3.d_date_sk)
left outer join promotion on (cs_promo_sk=p_promo_sk)
left outer join catalog_returns on (cr_item_sk = cs_item_sk and cr_order_number = cs_order_number)
where d1.d_week_seq = d2.d_week_seq
  and inv_quantity_on_hand < cs_quantity 
  and d3.d_date > d1.d_date + 5
  and hd_buy_potential = '1001-5000'
  and d1.d_year = 2002
  and hd_buy_potential = '1001-5000'
  and cd_marital_status = 'S'
  and d1.d_year = 2002
group by i_item_desc,w_warehouse_name,d1.d_week_seq
order by total_cnt desc, i_item_desc, w_warehouse_name, d_week_seq
limit 100;



select  i_item_id
       ,i_item_desc
       ,i_current_price
 from item, inventory, date_dim, store_sales
 where i_current_price between 12 and 12+30
 and inv_item_sk = i_item_sk
 and d_date_sk=inv_date_sk
 and d_date between cast('2000-03-05' as date) and (cast('2000-03-05' as date) +  interval '60 days')
 and i_manufact_id in (192,287,415,365)
 and inv_quantity_on_hand between 100 and 500
 and ss_item_sk = i_item_sk
 group by i_item_id,i_item_desc,i_current_price
 order by i_item_id
 limit 100;



select 
  c_last_name,c_first_name,substr(s_city,1,30),ss_ticket_number,amt,profit
  from
   (select ss_ticket_number
          ,ss_customer_sk
          ,store.s_city
          ,sum(ss_coupon_amt) as amt
          ,sum(ss_net_profit) as profit
    from store_sales,date_dim,store,household_demographics
    where store_sales.ss_sold_date_sk = date_dim.d_date_sk
    and store_sales.ss_store_sk = store.s_store_sk  
    and store_sales.ss_hdemo_sk = household_demographics.hd_demo_sk
    and (household_demographics.hd_dep_count = 1 or household_demographics.hd_vehicle_count > 2)
    and date_dim.d_dow = 1
    and date_dim.d_year in (2000,2000+1,2000+2) 
    and store.s_number_employees between 200 and 295
    group by ss_ticket_number,ss_customer_sk,ss_addr_sk,store.s_city) ms,customer
    where ss_customer_sk = c_customer_sk
 order by c_last_name,c_first_name,substr(s_city,1,30), profit
limit 100;



select  i_brand_id as brand_id, i_brand as brand,
   sum(ss_ext_sales_price) as ext_price
 from date_dim, store_sales, item
 where d_date_sk = ss_sold_date_sk
   and ss_item_sk = i_item_sk
   and i_manager_id=43
   and d_moy=11
   and d_year=1998
 group by i_brand, i_brand_id
 order by ext_price desc, i_brand_id
limit 100 ;



select   
         w_warehouse_name
   ,w_warehouse_sq_ft
   ,w_city
   ,w_county
   ,w_state
   ,w_country
        ,ship_carriers
        ,year
   ,sum(jan_sales) as jan_sales
   ,sum(feb_sales) as feb_sales
   ,sum(mar_sales) as mar_sales
   ,sum(apr_sales) as apr_sales
   ,sum(may_sales) as may_sales
   ,sum(jun_sales) as jun_sales
   ,sum(jul_sales) as jul_sales
   ,sum(aug_sales) as aug_sales
   ,sum(sep_sales) as sep_sales
   ,sum(oct_sales) as oct_sales
   ,sum(nov_sales) as nov_sales
   ,sum(dec_sales) as dec_sales
   ,sum(jan_sales/w_warehouse_sq_ft) as jan_sales_per_sq_foot
   ,sum(feb_sales/w_warehouse_sq_ft) as feb_sales_per_sq_foot
   ,sum(mar_sales/w_warehouse_sq_ft) as mar_sales_per_sq_foot
   ,sum(apr_sales/w_warehouse_sq_ft) as apr_sales_per_sq_foot
   ,sum(may_sales/w_warehouse_sq_ft) as may_sales_per_sq_foot
   ,sum(jun_sales/w_warehouse_sq_ft) as jun_sales_per_sq_foot
   ,sum(jul_sales/w_warehouse_sq_ft) as jul_sales_per_sq_foot
   ,sum(aug_sales/w_warehouse_sq_ft) as aug_sales_per_sq_foot
   ,sum(sep_sales/w_warehouse_sq_ft) as sep_sales_per_sq_foot
   ,sum(oct_sales/w_warehouse_sq_ft) as oct_sales_per_sq_foot
   ,sum(nov_sales/w_warehouse_sq_ft) as nov_sales_per_sq_foot
   ,sum(dec_sales/w_warehouse_sq_ft) as dec_sales_per_sq_foot
   ,sum(jan_net) as jan_net
   ,sum(feb_net) as feb_net
   ,sum(mar_net) as mar_net
   ,sum(apr_net) as apr_net
   ,sum(may_net) as may_net
   ,sum(jun_net) as jun_net
   ,sum(jul_net) as jul_net
   ,sum(aug_net) as aug_net
   ,sum(sep_net) as sep_net
   ,sum(oct_net) as oct_net
   ,sum(nov_net) as nov_net
   ,sum(dec_net) as dec_net
 from (
    (select 
   w_warehouse_name
   ,w_warehouse_sq_ft
   ,w_city
   ,w_county
   ,w_state
   ,w_country
   ,'GERMA' || ',' || 'UPS' as ship_carriers
       ,d_year as year
   ,sum(case when d_moy = 1 
     then ws_ext_sales_price* ws_quantity else 0 end) as jan_sales
   ,sum(case when d_moy = 2 
     then ws_ext_sales_price* ws_quantity else 0 end) as feb_sales
   ,sum(case when d_moy = 3 
     then ws_ext_sales_price* ws_quantity else 0 end) as mar_sales
   ,sum(case when d_moy = 4 
     then ws_ext_sales_price* ws_quantity else 0 end) as apr_sales
   ,sum(case when d_moy = 5 
     then ws_ext_sales_price* ws_quantity else 0 end) as may_sales
   ,sum(case when d_moy = 6 
     then ws_ext_sales_price* ws_quantity else 0 end) as jun_sales
   ,sum(case when d_moy = 7 
     then ws_ext_sales_price* ws_quantity else 0 end) as jul_sales
   ,sum(case when d_moy = 8 
     then ws_ext_sales_price* ws_quantity else 0 end) as aug_sales
   ,sum(case when d_moy = 9 
     then ws_ext_sales_price* ws_quantity else 0 end) as sep_sales
   ,sum(case when d_moy = 10 
     then ws_ext_sales_price* ws_quantity else 0 end) as oct_sales
   ,sum(case when d_moy = 11
     then ws_ext_sales_price* ws_quantity else 0 end) as nov_sales
   ,sum(case when d_moy = 12
     then ws_ext_sales_price* ws_quantity else 0 end) as dec_sales
   ,sum(case when d_moy = 1 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as jan_net
   ,sum(case when d_moy = 2
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as feb_net
   ,sum(case when d_moy = 3 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as mar_net
   ,sum(case when d_moy = 4 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as apr_net
   ,sum(case when d_moy = 5 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as may_net
   ,sum(case when d_moy = 6 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as jun_net
   ,sum(case when d_moy = 7 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as jul_net
   ,sum(case when d_moy = 8 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as aug_net
   ,sum(case when d_moy = 9 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as sep_net
   ,sum(case when d_moy = 10 
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as oct_net
   ,sum(case when d_moy = 11
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as nov_net
   ,sum(case when d_moy = 12
     then ws_net_paid_inc_ship_tax * ws_quantity else 0 end) as dec_net
     from
          web_sales
         ,warehouse
         ,date_dim
         ,time_dim
     ,ship_mode
     where
            ws_warehouse_sk =  w_warehouse_sk
        and ws_sold_date_sk = d_date_sk
        and ws_sold_time_sk = t_time_sk
   and ws_ship_mode_sk = sm_ship_mode_sk
        and d_year = 2000
   and t_time between 41469 and 41469+28800 
   and sm_carrier in ('GERMA','UPS')
     group by 
        w_warehouse_name
   ,w_warehouse_sq_ft
   ,w_city
   ,w_county
   ,w_state
   ,w_country
       ,d_year
   )
 union all
    (select 
   w_warehouse_name
   ,w_warehouse_sq_ft
   ,w_city
   ,w_county
   ,w_state
   ,w_country
   ,'GERMA' || ',' || 'UPS' as ship_carriers
       ,d_year as year
   ,sum(case when d_moy = 1 
     then cs_ext_sales_price* cs_quantity else 0 end) as jan_sales
   ,sum(case when d_moy = 2 
     then cs_ext_sales_price* cs_quantity else 0 end) as feb_sales
   ,sum(case when d_moy = 3 
     then cs_ext_sales_price* cs_quantity else 0 end) as mar_sales
   ,sum(case when d_moy = 4 
     then cs_ext_sales_price* cs_quantity else 0 end) as apr_sales
   ,sum(case when d_moy = 5 
     then cs_ext_sales_price* cs_quantity else 0 end) as may_sales
   ,sum(case when d_moy = 6 
     then cs_ext_sales_price* cs_quantity else 0 end) as jun_sales
   ,sum(case when d_moy = 7 
     then cs_ext_sales_price* cs_quantity else 0 end) as jul_sales
   ,sum(case when d_moy = 8 
     then cs_ext_sales_price* cs_quantity else 0 end) as aug_sales
   ,sum(case when d_moy = 9 
     then cs_ext_sales_price* cs_quantity else 0 end) as sep_sales
   ,sum(case when d_moy = 10 
     then cs_ext_sales_price* cs_quantity else 0 end) as oct_sales
   ,sum(case when d_moy = 11
     then cs_ext_sales_price* cs_quantity else 0 end) as nov_sales
   ,sum(case when d_moy = 12
     then cs_ext_sales_price* cs_quantity else 0 end) as dec_sales
   ,sum(case when d_moy = 1 
     then cs_net_profit * cs_quantity else 0 end) as jan_net
   ,sum(case when d_moy = 2 
     then cs_net_profit * cs_quantity else 0 end) as feb_net
   ,sum(case when d_moy = 3 
     then cs_net_profit * cs_quantity else 0 end) as mar_net
   ,sum(case when d_moy = 4 
     then cs_net_profit * cs_quantity else 0 end) as apr_net
   ,sum(case when d_moy = 5 
     then cs_net_profit * cs_quantity else 0 end) as may_net
   ,sum(case when d_moy = 6 
     then cs_net_profit * cs_quantity else 0 end) as jun_net
   ,sum(case when d_moy = 7 
     then cs_net_profit * cs_quantity else 0 end) as jul_net
   ,sum(case when d_moy = 8 
     then cs_net_profit * cs_quantity else 0 end) as aug_net
   ,sum(case when d_moy = 9 
     then cs_net_profit * cs_quantity else 0 end) as sep_net
   ,sum(case when d_moy = 10 
     then cs_net_profit * cs_quantity else 0 end) as oct_net
   ,sum(case when d_moy = 11
     then cs_net_profit * cs_quantity else 0 end) as nov_net
   ,sum(case when d_moy = 12
     then cs_net_profit * cs_quantity else 0 end) as dec_net
     from
          catalog_sales
         ,warehouse
         ,date_dim
         ,time_dim
    ,ship_mode
     where
            cs_warehouse_sk =  w_warehouse_sk
        and cs_sold_date_sk = d_date_sk
        and cs_sold_time_sk = t_time_sk
   and cs_ship_mode_sk = sm_ship_mode_sk
        and d_year = 2000
   and t_time between 41469 AND 41469+28800 
   and sm_carrier in ('GERMA','UPS')
     group by 
        w_warehouse_name
   ,w_warehouse_sq_ft
   ,w_city
   ,w_county
   ,w_state
   ,w_country
       ,d_year
     ) 
 ) x
 group by 
        w_warehouse_name
   ,w_warehouse_sq_ft
   ,w_city
   ,w_county
   ,w_state
   ,w_country
   ,ship_carriers
       ,year
 order by w_warehouse_name
 limit 100;



select i_brand_id as brand_id, i_brand as brand,t_hour,t_minute,
   sum(ext_price) as ext_price
 from item, (select ws_ext_sales_price as ext_price, 
                        ws_sold_date_sk as sold_date_sk,
                        ws_item_sk as sold_item_sk,
                        ws_sold_time_sk as time_sk  
                 from web_sales,date_dim
                 where d_date_sk = ws_sold_date_sk
                   and d_moy=11
                   and d_year=2002
                 union all
                 select cs_ext_sales_price as ext_price,
                        cs_sold_date_sk as sold_date_sk,
                        cs_item_sk as sold_item_sk,
                        cs_sold_time_sk as time_sk
                 from catalog_sales,date_dim
                 where d_date_sk = cs_sold_date_sk
                   and d_moy=11
                   and d_year=2002
                 union all
                 select ss_ext_sales_price as ext_price,
                        ss_sold_date_sk as sold_date_sk,
                        ss_item_sk as sold_item_sk,
                        ss_sold_time_sk as time_sk
                 from store_sales,date_dim
                 where d_date_sk = ss_sold_date_sk
                   and d_moy=11
                   and d_year=2002
                 ) as tmp,time_dim
 where
   sold_item_sk = i_item_sk
   and i_manager_id=1
   and time_sk = t_time_sk
   and (t_meal_time = 'breakfast' or t_meal_time = 'dinner')
 group by i_brand, i_brand_id,t_hour,t_minute
 order by ext_price desc, i_brand_id
 ;



select  
  cd_gender,
  cd_marital_status,
  cd_education_status,
  count(*) as cnt1,
  cd_purchase_estimate,
  count(*) as cnt2,
  cd_credit_rating,
  count(*) as cnt3
 from
  customer c,customer_address ca,customer_demographics
 where
  c.c_current_addr_sk = ca.ca_address_sk and
  ca_state in ('TX','MT','VA') and
  cd_demo_sk = c.c_current_cdemo_sk and 
  exists (select *
          from store_sales,date_dim
          where c.c_customer_sk = ss_customer_sk and
                ss_sold_date_sk = d_date_sk and
                d_year = 2004 and
                d_moy between 3 and 3+2) and
   (not exists (select *
            from web_sales,date_dim
            where c.c_customer_sk = ws_bill_customer_sk and
                  ws_sold_date_sk = d_date_sk and
                  d_year = 2004 and
                  d_moy between 3 and 3+2) and
    not exists (select * 
            from catalog_sales,date_dim
            where c.c_customer_sk = cs_ship_customer_sk and
                  cs_sold_date_sk = d_date_sk and
                  d_year = 2004 and
                  d_moy between 3 and 3+2))
 group by cd_gender,
          cd_marital_status,
          cd_education_status,
          cd_purchase_estimate,
          cd_credit_rating
 order by cd_gender,
          cd_marital_status,
          cd_education_status,
          cd_purchase_estimate,
          cd_credit_rating
 limit 100;



select c_last_name
       ,c_first_name
       ,c_salutation
       ,c_preferred_cust_flag
       ,ss_ticket_number
       ,cnt from
   (select ss_ticket_number
          ,ss_customer_sk
          ,count(*) as cnt
    from store_sales,date_dim,store,household_demographics
    where store_sales.ss_sold_date_sk = date_dim.d_date_sk
    and store_sales.ss_store_sk = store.s_store_sk  
    and store_sales.ss_hdemo_sk = household_demographics.hd_demo_sk
    and (date_dim.d_dom between 1 and 3 or date_dim.d_dom between 25 and 28)
    and (household_demographics.hd_buy_potential = '501-1000' or
         household_demographics.hd_buy_potential = '0-500')
    and household_demographics.hd_vehicle_count > 0
    and (case when household_demographics.hd_vehicle_count > 0 
  then household_demographics.hd_dep_count/ household_demographics.hd_vehicle_count 
  else null 
  end)  > 1.2
    and date_dim.d_year in (2000,2000+1,2000+2)
    and store.s_county in ('Williamson County','Williamson County','Williamson County','Williamson County',
                           'Williamson County','Williamson County','Williamson County','Williamson County')
    group by ss_ticket_number,ss_customer_sk) dn,customer
    where ss_customer_sk = c_customer_sk
      and cnt between 15 and 20
    order by c_last_name,c_first_name,c_salutation,c_preferred_cust_flag desc;



select  ca_zip, ca_county, sum(ws_sales_price)
 from web_sales, customer, customer_address, date_dim, item
 where ws_bill_customer_sk = c_customer_sk
   and c_current_addr_sk = ca_address_sk 
   and ws_item_sk = i_item_sk 
   and ( substr(ca_zip,1,5) in ('85669', '86197','88274','83405','86475', '85392', '85460', '80348', '81792')
         or 
         i_item_id in (select i_item_id
                             from item
                             where i_item_sk in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29)
                             )
       )
   and ws_sold_date_sk = d_date_sk
   and d_qoy = 2 and d_year = 2002
 group by ca_zip, ca_county
 order by ca_zip, ca_county
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
  ca_county in ('Hopkins County','Randolph County','Delaware County','Garza County','Douglas County') and
  cd_demo_sk = c.c_current_cdemo_sk and 
  exists (select *
          from store_sales,date_dim
          where c.c_customer_sk = ss_customer_sk and
                ss_sold_date_sk = d_date_sk and
                d_year = 2000 and
                d_moy between 1 and 1+3) and
   (exists (select *
            from web_sales,date_dim
            where c.c_customer_sk = ws_bill_customer_sk and
                  ws_sold_date_sk = d_date_sk and
                  d_year = 2000 and
                  d_moy between 1 ANd 1+3) or 
    exists (select * 
            from catalog_sales,date_dim
            where c.c_customer_sk = cs_ship_customer_sk and
                  cs_sold_date_sk = d_date_sk and
                  d_year = 2000 and
                  d_moy between 1 and 1+3))
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



select  *
from (select avg(ss_list_price) as B1_LP
            ,count(ss_list_price) as B1_CNT
            ,count(distinct ss_list_price) as B1_CNTD
      from store_sales
      where ss_quantity between 0 and 5
        and (ss_list_price between 106 and 106+10 
             or ss_coupon_amt between 4921 and 4921+1000
             or ss_wholesale_cost between 18 and 18+20)) B1,
     (select avg(ss_list_price) as B2_LP
            ,count(ss_list_price) as B2_CNT
            ,count(distinct ss_list_price) as B2_CNTD
      from store_sales
      where ss_quantity between 6 and 10
        and (ss_list_price between 18 and 18+10
          or ss_coupon_amt between 7181 and 7181+1000
          or ss_wholesale_cost between 27 and 27+20)) as B2,
     (select avg(ss_list_price) as B3_LP
            ,count(ss_list_price) as B3_CNT
            ,count(distinct ss_list_price) as B3_CNTD
      from store_sales
      where ss_quantity between 11 and 15
        and (ss_list_price between 35 and 35+10
          or ss_coupon_amt between 2671 and 2671+1000
          or ss_wholesale_cost between 22 and 22+20)) as B3,
     (select avg(ss_list_price) as B4_LP
            ,count(ss_list_price) as B4_CNT
            ,count(distinct ss_list_price) as B4_CNTD
      from store_sales
      where ss_quantity between 16 and 20
        and (ss_list_price between 37 and 37+10
          or ss_coupon_amt between 10853 and 10853+1000
          or ss_wholesale_cost between 21 and 21+20)) as B4,
     (select avg(ss_list_price) as B5_LP
            ,count(ss_list_price) as B5_CNT
            ,count(distinct ss_list_price) as B5_CNTD
      from store_sales
      where ss_quantity between 21 and 25
        and (ss_list_price between 180 and 180+10
          or ss_coupon_amt between 9387 and 9387+1000
          or ss_wholesale_cost between 34 and 34+20)) as B5,
     (select avg(ss_list_price) as B6_LP
            ,count(ss_list_price) as B6_CNT
            ,count(distinct ss_list_price) as B6_CNTD
      from store_sales
      where ss_quantity between 26 and 30
        and (ss_list_price between 108 and 108+10
          or ss_coupon_amt between 13261 and 13261+1000
          or ss_wholesale_cost between 60 and 60+20)) as B6
limit 100;



select  dt.d_year 
       ,item.i_brand_id as brand_id 
       ,item.i_brand as brand
       ,sum(ss_ext_sales_price) as sum_agg
 from  date_dim dt 
      ,store_sales
      ,item
 where dt.d_date_sk = store_sales.ss_sold_date_sk
   and store_sales.ss_item_sk = item.i_item_sk
   and item.i_manufact_id = 519
   and dt.d_moy=11
 group by dt.d_year
      ,item.i_brand
      ,item.i_brand_id
 order by dt.d_year
         ,sum_agg desc
         ,brand_id
 limit 100;



select  ca_zip
       ,sum(cs_sales_price)
 from catalog_sales
     ,customer
     ,customer_address
     ,date_dim
 where cs_bill_customer_sk = c_customer_sk
   and c_current_addr_sk = ca_address_sk 
   and ( substr(ca_zip,1,5) in ('85669', '86197','88274','83405','86475',
                                   '85392', '85460', '80348', '81792')
         or ca_state in ('CA','WA','GA')
         or cs_sales_price > 500)
   and cs_sold_date_sk = d_date_sk
   and d_qoy = 1 and d_year = 2002
 group by ca_zip
 order by ca_zip
 limit 100;



select  
   s_store_name
  ,s_company_id
  ,s_street_number
  ,s_street_name
  ,s_street_type
  ,s_suite_number
  ,s_city
  ,s_county
  ,s_state
  ,s_zip
  ,sum(case when (sr_returned_date_sk - ss_sold_date_sk <= 30 ) then 1 else 0 end)  as "30 days" 
  ,sum(case when (sr_returned_date_sk - ss_sold_date_sk > 30) and 
                 (sr_returned_date_sk - ss_sold_date_sk <= 60) then 1 else 0 end )  as "31-60 days" 
  ,sum(case when (sr_returned_date_sk - ss_sold_date_sk > 60) and 
                 (sr_returned_date_sk - ss_sold_date_sk <= 90) then 1 else 0 end)  as "61-90 days" 
  ,sum(case when (sr_returned_date_sk - ss_sold_date_sk > 90) and
                 (sr_returned_date_sk - ss_sold_date_sk <= 120) then 1 else 0 end)  as "91-120 days" 
  ,sum(case when (sr_returned_date_sk - ss_sold_date_sk  > 120) then 1 else 0 end)  as ">120 days" 
from
   store_sales
  ,store_returns
  ,store
  ,date_dim d1
  ,date_dim d2
where
    d2.d_year = 1998
and d2.d_moy  = 10
and ss_ticket_number = sr_ticket_number
and ss_item_sk = sr_item_sk
and ss_sold_date_sk   = d1.d_date_sk
and sr_returned_date_sk   = d2.d_date_sk
and ss_customer_sk = sr_customer_sk
and ss_store_sk = s_store_sk
group by
   s_store_name
  ,s_company_id
  ,s_street_number
  ,s_street_name
  ,s_street_type
  ,s_suite_number
  ,s_city
  ,s_county
  ,s_state
  ,s_zip
order by s_store_name
        ,s_company_id
        ,s_street_number
        ,s_street_name
        ,s_street_type
        ,s_suite_number
        ,s_city
        ,s_county
        ,s_state
        ,s_zip
limit 100;



select  substr(r_reason_desc,1,20)
       ,avg(ws_quantity)
       ,avg(wr_refunded_cash)
       ,avg(wr_fee)
 from web_sales, web_returns, web_page, customer_demographics cd1,
      customer_demographics cd2, customer_address, date_dim, reason 
 where ws_web_page_sk = wp_web_page_sk
   and ws_item_sk = wr_item_sk
   and ws_order_number = wr_order_number
   and ws_sold_date_sk = d_date_sk and d_year = 2000
   and cd1.cd_demo_sk = wr_refunded_cdemo_sk 
   and cd2.cd_demo_sk = wr_returning_cdemo_sk
   and ca_address_sk = wr_refunded_addr_sk
   and r_reason_sk = wr_reason_sk
   and
   (
    (
     cd1.cd_marital_status = 'U'
     and
     cd1.cd_marital_status = cd2.cd_marital_status
     and
     cd1.cd_education_status = 'Secondary'
     and 
     cd1.cd_education_status = cd2.cd_education_status
     and
     ws_sales_price between 100.00 and 150.00
    )
   or
    (
     cd1.cd_marital_status = 'S'
     and
     cd1.cd_marital_status = cd2.cd_marital_status
     and
     cd1.cd_education_status = 'Unknown' 
     and
     cd1.cd_education_status = cd2.cd_education_status
     and
     ws_sales_price between 50.00 and 100.00
    )
   or
    (
     cd1.cd_marital_status = 'D'
     and
     cd1.cd_marital_status = cd2.cd_marital_status
     and
     cd1.cd_education_status = '2 yr Degree'
     and
     cd1.cd_education_status = cd2.cd_education_status
     and
     ws_sales_price between 150.00 and 200.00
    )
   )
   and
   (
    (
     ca_country = 'United States'
     and
     ca_state in ('MT', 'IN', 'LA')
     and ws_net_profit between 100 and 200  
    )
    or
    (
     ca_country = 'United States'
     and
     ca_state in ('CA', 'OH', 'OR')
     and ws_net_profit between 150 and 300  
    )
    or
    (
     ca_country = 'United States'
     and
     ca_state in ('TN', 'WA', 'NJ')
     and ws_net_profit between 50 and 250  
    )
   )
group by r_reason_desc
order by substr(r_reason_desc,1,20)
        ,avg(ws_quantity)
        ,avg(wr_refunded_cash)
        ,avg(wr_fee)
limit 100;



select  c_customer_id as customer_id
       ,c_last_name || ', ' || c_first_name as customername
 from customer
     ,customer_address
     ,customer_demographics
     ,household_demographics
     ,income_band
     ,store_returns
 where ca_city          =  'Pleasant Hill'
   and c_current_addr_sk = ca_address_sk
   and ib_lower_bound   >=  9332
   and ib_upper_bound   <=  9332 + 50000
   and ib_income_band_sk = hd_income_band_sk
   and cd_demo_sk = c_current_cdemo_sk
   and hd_demo_sk = c_current_hdemo_sk
   and sr_cdemo_sk = cd_demo_sk
 order by c_customer_id
 limit 100;



select  dt.d_year
   ,item.i_category_id
   ,item.i_category
   ,sum(ss_ext_sales_price)
 from   date_dim dt
   ,store_sales
   ,item
 where dt.d_date_sk = store_sales.ss_sold_date_sk
   and store_sales.ss_item_sk = item.i_item_sk
   and item.i_manager_id = 1    
   and dt.d_moy=12
   and dt.d_year=1999
 group by   dt.d_year
     ,item.i_category_id
     ,item.i_category
 order by       sum(ss_ext_sales_price) desc,dt.d_year
     ,item.i_category_id
     ,item.i_category
limit 100 ;



select c_last_name
       ,c_first_name
       ,c_salutation
       ,c_preferred_cust_flag 
       ,ss_ticket_number
       ,cnt from
   (select ss_ticket_number
          ,ss_customer_sk
          ,count(*) as cnt
    from store_sales,date_dim,store,household_demographics
    where store_sales.ss_sold_date_sk = date_dim.d_date_sk
    and store_sales.ss_store_sk = store.s_store_sk  
    and store_sales.ss_hdemo_sk = household_demographics.hd_demo_sk
    and date_dim.d_dom between 1 and 2 
    and (household_demographics.hd_buy_potential = '1001-5000' or
         household_demographics.hd_buy_potential = '0-500')
    and household_demographics.hd_vehicle_count > 0
    and case when household_demographics.hd_vehicle_count > 0 then 
             household_demographics.hd_dep_count/ household_demographics.hd_vehicle_count else null end > 1
    and date_dim.d_year in (1998,1998+1,1998+2)
    and store.s_county in ('Williamson County','Williamson County','Williamson County','Williamson County')
    group by ss_ticket_number,ss_customer_sk) dj,customer
    where ss_customer_sk = c_customer_sk
      and cnt between 1 and 5
    order by cnt desc;



select  
   count(distinct ws_order_number) as "order count"
  ,sum(ws_ext_ship_cost) as "total shipping cost"
  ,sum(ws_net_profit) as "total net profit"
from
   web_sales ws1
  ,date_dim
  ,customer_address
  ,web_site
where
    d_date between '2000-5-01' and 
           (cast('2000-5-01' as date) + interval '60 days')
and ws1.ws_ship_date_sk = d_date_sk
and ws1.ws_ship_addr_sk = ca_address_sk
and ca_state = 'MI'
and ws1.ws_web_site_sk = web_site_sk
and web_company_name = 'pri'
and exists (select *
            from web_sales ws2
            where ws1.ws_order_number = ws2.ws_order_number
              and ws1.ws_warehouse_sk <> ws2.ws_warehouse_sk)
and not exists(select *
               from web_returns wr1
               where ws1.ws_order_number = wr1.wr_order_number)
order by count(distinct ws_order_number)
limit 100;



select  c_last_name
       ,c_first_name
       ,ca_city
       ,bought_city
       ,ss_ticket_number
       ,amt,profit 
 from
   (select ss_ticket_number
          ,ss_customer_sk
          ,ca_city as bought_city
          ,sum(ss_coupon_amt) as amt
          ,sum(ss_net_profit) as profit
    from store_sales,date_dim,store,household_demographics,customer_address 
    where store_sales.ss_sold_date_sk = date_dim.d_date_sk
    and store_sales.ss_store_sk = store.s_store_sk  
    and store_sales.ss_hdemo_sk = household_demographics.hd_demo_sk
    and store_sales.ss_addr_sk = customer_address.ca_address_sk
    and (household_demographics.hd_dep_count = 6 or
         household_demographics.hd_vehicle_count= 4)
    and date_dim.d_dow in (6,0)
    and date_dim.d_year in (2000,2000+1,2000+2) 
    and store.s_city in ('Fairview','Midway','Fairview','Fairview','Fairview') 
    group by ss_ticket_number,ss_customer_sk,ss_addr_sk,ca_city) dn,customer,customer_address current_addr
    where ss_customer_sk = c_customer_sk
      and customer.c_current_addr_sk = current_addr.ca_address_sk
      and current_addr.ca_city <> bought_city
  order by c_last_name
          ,c_first_name
          ,ca_city
          ,bought_city
          ,ss_ticket_number
  limit 100;



select  *
from
 (select count(*) as h8_30_to_9
 from store_sales, household_demographics , time_dim, store
 where ss_sold_time_sk = time_dim.t_time_sk   
     and ss_hdemo_sk = household_demographics.hd_demo_sk 
     and ss_store_sk = s_store_sk
     and time_dim.t_hour = 8
     and time_dim.t_minute >= 30
     and ((household_demographics.hd_dep_count = 1 and household_demographics.hd_vehicle_count<=1+2) or
          (household_demographics.hd_dep_count = 4 and household_demographics.hd_vehicle_count<=4+2) or
          (household_demographics.hd_dep_count = 3 and household_demographics.hd_vehicle_count<=3+2)) 
     and store.s_store_name = 'ese') s1,
 (select count(*) as h9_to_9_30 
 from store_sales, household_demographics , time_dim, store
 where ss_sold_time_sk = time_dim.t_time_sk
     and ss_hdemo_sk = household_demographics.hd_demo_sk
     and ss_store_sk = s_store_sk 
     and time_dim.t_hour = 9 
     and time_dim.t_minute < 30
     and ((household_demographics.hd_dep_count = 1 and household_demographics.hd_vehicle_count<=1+2) or
          (household_demographics.hd_dep_count = 4 and household_demographics.hd_vehicle_count<=4+2) or
          (household_demographics.hd_dep_count = 3 and household_demographics.hd_vehicle_count<=3+2))
     and store.s_store_name = 'ese') s2,
 (select count(*) as h9_30_to_10 
 from store_sales, household_demographics , time_dim, store
 where ss_sold_time_sk = time_dim.t_time_sk
     and ss_hdemo_sk = household_demographics.hd_demo_sk
     and ss_store_sk = s_store_sk
     and time_dim.t_hour = 9
     and time_dim.t_minute >= 30
     and ((household_demographics.hd_dep_count = 1 and household_demographics.hd_vehicle_count<=1+2) or
          (household_demographics.hd_dep_count = 4 and household_demographics.hd_vehicle_count<=4+2) or
          (household_demographics.hd_dep_count = 3 and household_demographics.hd_vehicle_count<=3+2))
     and store.s_store_name = 'ese') s3,
 (select count(*) as h10_to_10_30
 from store_sales, household_demographics , time_dim, store
 where ss_sold_time_sk = time_dim.t_time_sk
     and ss_hdemo_sk = household_demographics.hd_demo_sk
     and ss_store_sk = s_store_sk
     and time_dim.t_hour = 10 
     and time_dim.t_minute < 30
     and ((household_demographics.hd_dep_count = 1 and household_demographics.hd_vehicle_count<=1+2) or
          (household_demographics.hd_dep_count = 4 and household_demographics.hd_vehicle_count<=4+2) or
          (household_demographics.hd_dep_count = 3 and household_demographics.hd_vehicle_count<=3+2))
     and store.s_store_name = 'ese') s4,
 (select count(*) as h10_30_to_11
 from store_sales, household_demographics , time_dim, store
 where ss_sold_time_sk = time_dim.t_time_sk
     and ss_hdemo_sk = household_demographics.hd_demo_sk
     and ss_store_sk = s_store_sk
     and time_dim.t_hour = 10 
     and time_dim.t_minute >= 30
     and ((household_demographics.hd_dep_count = 1 and household_demographics.hd_vehicle_count<=1+2) or
          (household_demographics.hd_dep_count = 4 and household_demographics.hd_vehicle_count<=4+2) or
          (household_demographics.hd_dep_count = 3 and household_demographics.hd_vehicle_count<=3+2))
     and store.s_store_name = 'ese') s5,
 (select count(*) as h11_to_11_30
 from store_sales, household_demographics , time_dim, store
 where ss_sold_time_sk = time_dim.t_time_sk
     and ss_hdemo_sk = household_demographics.hd_demo_sk
     and ss_store_sk = s_store_sk 
     and time_dim.t_hour = 11
     and time_dim.t_minute < 30
     and ((household_demographics.hd_dep_count = 1 and household_demographics.hd_vehicle_count<=1+2) or
          (household_demographics.hd_dep_count = 4 and household_demographics.hd_vehicle_count<=4+2) or
          (household_demographics.hd_dep_count = 3 and household_demographics.hd_vehicle_count<=3+2))
     and store.s_store_name = 'ese') s6,
 (select count(*) as h11_30_to_12
 from store_sales, household_demographics , time_dim, store
 where ss_sold_time_sk = time_dim.t_time_sk
     and ss_hdemo_sk = household_demographics.hd_demo_sk
     and ss_store_sk = s_store_sk
     and time_dim.t_hour = 11
     and time_dim.t_minute >= 30
     and ((household_demographics.hd_dep_count = 1 and household_demographics.hd_vehicle_count<=1+2) or
          (household_demographics.hd_dep_count = 4 and household_demographics.hd_vehicle_count<=4+2) or
          (household_demographics.hd_dep_count = 3 and household_demographics.hd_vehicle_count<=3+2))
     and store.s_store_name = 'ese') s7,
 (select count(*) as h12_to_12_30
 from store_sales, household_demographics , time_dim, store
 where ss_sold_time_sk = time_dim.t_time_sk
     and ss_hdemo_sk = household_demographics.hd_demo_sk
     and ss_store_sk = s_store_sk
     and time_dim.t_hour = 12
     and time_dim.t_minute < 30
     and ((household_demographics.hd_dep_count = 1 and household_demographics.hd_vehicle_count<=1+2) or
          (household_demographics.hd_dep_count = 4 and household_demographics.hd_vehicle_count<=4+2) or
          (household_demographics.hd_dep_count = 3 and household_demographics.hd_vehicle_count<=3+2))
     and store.s_store_name = 'ese') s8
;



select  i_brand_id as brand_id, i_brand as brand, i_manufact_id, i_manufact,
   sum(ss_ext_sales_price) as ext_price
 from date_dim, store_sales, item,customer,customer_address,store
 where d_date_sk = ss_sold_date_sk
   and ss_item_sk = i_item_sk
   and i_manager_id=32
   and d_moy=11
   and d_year=1998
   and ss_customer_sk = c_customer_sk 
   and c_current_addr_sk = ca_address_sk
   and substr(ca_zip,1,5) <> substr(s_zip,1,5) 
   and ss_store_sk = s_store_sk 
 group by i_brand
      ,i_brand_id
      ,i_manufact_id
      ,i_manufact
 order by ext_price desc
         ,i_brand
         ,i_brand_id
         ,i_manufact_id
         ,i_manufact
limit 100 ;



select  
   w_state
  ,i_item_id
  ,sum(case when (cast(d_date as date) < cast ('2000-04-01' as date)) 
     then cs_sales_price - coalesce(cr_refunded_cash,0) else 0 end) as sales_before
  ,sum(case when (cast(d_date as date) >= cast ('2000-04-01' as date)) 
     then cs_sales_price - coalesce(cr_refunded_cash,0) else 0 end) as sales_after
 from
   catalog_sales left outer join catalog_returns on
       (cs_order_number = cr_order_number 
        and cs_item_sk = cr_item_sk)
  ,warehouse 
  ,item
  ,date_dim
 where
     i_current_price between 0.99 and 1.49
 and i_item_sk          = cs_item_sk
 and cs_warehouse_sk    = w_warehouse_sk 
 and cs_sold_date_sk    = d_date_sk
 and d_date between (cast ('2000-04-01' as date) - interval '30 days')
                and (cast ('2000-04-01' as date) + interval '30 days') 
 group by
    w_state,i_item_id
 order by w_state,i_item_id
limit 100;



select  i_item_id, 
        avg(cs_quantity) as agg1,
        avg(cs_list_price) as agg2,
        avg(cs_coupon_amt) as agg3,
        avg(cs_sales_price) as agg4 
 from catalog_sales, customer_demographics, date_dim, item, promotion
 where cs_sold_date_sk = d_date_sk and
       cs_item_sk = i_item_sk and
       cs_bill_cdemo_sk = cd_demo_sk and
       cs_promo_sk = p_promo_sk and
       cd_gender = 'F' and 
       cd_marital_status = 'M' and
       cd_education_status = 'Secondary' and
       (p_channel_email = 'N' or p_channel_event = 'N') and
       d_year = 2002 
 group by i_item_id
 order by i_item_id
 limit 100;



select  count(*) 
from store_sales
    ,household_demographics 
    ,time_dim, store
where ss_sold_time_sk = time_dim.t_time_sk   
    and ss_hdemo_sk = household_demographics.hd_demo_sk 
    and ss_store_sk = s_store_sk
    and time_dim.t_hour = 15
    and time_dim.t_minute >= 30
    and household_demographics.hd_dep_count = 8
    and store.s_store_name = 'ese'
order by count(*)
limit 100;



select  a.ca_state as state, count(*) as cnt
 from customer_address a
     ,customer c
     ,store_sales s
     ,date_dim d
     ,item i
 where       a.ca_address_sk = c.c_current_addr_sk
   and c.c_customer_sk = s.ss_customer_sk
   and s.ss_sold_date_sk = d.d_date_sk
   and s.ss_item_sk = i.i_item_sk
   and d.d_month_seq = 
        (select distinct (d_month_seq)
         from date_dim
               where d_year = 2002
           and d_moy = 4 )
   and i.i_current_price > 1.2 * 
             (select avg(j.i_current_price) 
        from item j 
        where j.i_category = i.i_category)
 group by a.ca_state
 having count(*) >= 10
 order by cnt 
 limit 100;



select  dt.d_year
   ,item.i_brand_id as brand_id
   ,item.i_brand as brand
   ,sum(ss_ext_sales_price) as ext_price
 from date_dim dt
     ,store_sales
     ,item
 where dt.d_date_sk = store_sales.ss_sold_date_sk
    and store_sales.ss_item_sk = item.i_item_sk
    and item.i_manager_id = 1
    and dt.d_moy=12
    and dt.d_year=1999
 group by dt.d_year
   ,item.i_brand
   ,item.i_brand_id
 order by dt.d_year
   ,ext_price desc
   ,brand_id
limit 100 ;


