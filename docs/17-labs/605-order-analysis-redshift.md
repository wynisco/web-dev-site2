# Order Analysis with Redshift SQL

## Setup the environment

```python
!mkdir -p ~/.aws
!pip install -qq psycopg2-binary awscli boto3 awswrangler s3fs
```


```python
%%writefile ~/.aws/credentials
[default]
aws_access_key_id=
aws_secret_access_key=
```


```python
%%writefile ~/.aws/config
[default]
region=us-east-1
output=json
```

## Connect to the Redshift cluster


```python
import boto3
import json

%reload_ext sql
```


```python
def get_secret(secret_name):
    region_name = "us-east-1"
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name)
    get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    get_secret_value_response = json.loads(get_secret_value_response['SecretString'])
    return get_secret_value_response

db_credentials = get_secret(secret_name='wysde')

USERNAME = db_credentials["REDSHIFT_USERNAME"]
PASSWORD = db_credentials["REDSHIFT_PASSWORD"]
HOST = db_credentials["REDSHIFT_HOST"]
PORT = db_credentials["REDSHIFT_PORT"]
DBNAME = "dev"
CONN = f"postgresql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"

%sql {CONN}
```

```python
SCHEMA = "retail"
%sql CREATE SCHEMA IF NOT EXISTS {SCHEMA}
%sql SET search_path = {SCHEMA}
```

## Copy Data from s3 into Redshift Tables

### Create Database and Table for Redshift


```sql
%%sql
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  order_date DATETIME,
  order_customer_id INT,
  order_status VARCHAR(30)
);
```

### Troubleshoot Errors related to Redshift Copy Command


```python
%sql SELECT * FROM sys_load_error_detail LIMIT 10;
```

### Run Copy Command to copy from s3 to Redshift table


```python
REDSHIFT_IAM_ROLE = 'arn:aws:iam::684199068947:role/service-role/AmazonRedshift-CommandsAccessRole-20220921T223853'
```


```python
%sql COPY orders FROM 's3://wysde2/retail_db/orders/part_0000.csv' iam_role '{REDSHIFT_IAM_ROLE}' DATEFORMAT 'auto' CSV;
```

### Validate using queries against Redshift Table


```python
%sql SELECT * FROM orders LIMIT 10;
```






<table>
    <thead>
        <tr>
            <th>order_id</th>
            <th>order_date</th>
            <th>order_customer_id</th>
            <th>order_status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>14</td>
            <td>2013-07-25 00:00:00</td>
            <td>9842</td>
            <td>PROCESSING</td>
        </tr>
        <tr>
            <td>130</td>
            <td>2013-07-26 00:00:00</td>
            <td>7509</td>
            <td>PENDING_PAYMENT</td>
        </tr>
        <tr>
            <td>257</td>
            <td>2013-07-26 00:00:00</td>
            <td>3273</td>
            <td>PROCESSING</td>
        </tr>
        <tr>
            <td>571</td>
            <td>2013-07-28 00:00:00</td>
            <td>5006</td>
            <td>PENDING</td>
        </tr>
        <tr>
            <td>572</td>
            <td>2013-07-28 00:00:00</td>
            <td>6691</td>
            <td>PENDING</td>
        </tr>
        <tr>
            <td>644</td>
            <td>2013-07-28 00:00:00</td>
            <td>7295</td>
            <td>PENDING_PAYMENT</td>
        </tr>
        <tr>
            <td>773</td>
            <td>2013-07-29 00:00:00</td>
            <td>10414</td>
            <td>PENDING_PAYMENT</td>
        </tr>
        <tr>
            <td>789</td>
            <td>2013-07-29 00:00:00</td>
            <td>17</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>900</td>
            <td>2013-07-30 00:00:00</td>
            <td>8585</td>
            <td>CLOSED</td>
        </tr>
        <tr>
            <td>950</td>
            <td>2013-07-30 00:00:00</td>
            <td>4151</td>
            <td>PENDING_PAYMENT</td>
        </tr>
    </tbody>
</table>




```python
%sql SELECT count(1) FROM orders;
```







<table>
    <thead>
        <tr>
            <th>count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>68883</td>
        </tr>
    </tbody>
</table>



### Copy JSON Data from s3 to Redshift table using IAM Role


```sql
%%sql
DROP TABLE IF EXISTS order_items;

CREATE TABLE order_items (
  order_item_id INT PRIMARY KEY,
  order_item_order_id INT,
  order_item_product_id INT,
  order_item_quantity INT,
  order_item_subtotal FLOAT,
  order_item_product_price FLOAT
);
```


```python
%sql COPY order_items FROM 's3://wysde2/retail_db/retail_db_json/order_items' iam_role '{REDSHIFT_IAM_ROLE}' JSON AS 'auto';
```


```python
%sql SELECT * FROM order_items LIMIT 10;
```






<table>
    <thead>
        <tr>
            <th>order_item_id</th>
            <th>order_item_order_id</th>
            <th>order_item_product_id</th>
            <th>order_item_quantity</th>
            <th>order_item_subtotal</th>
            <th>order_item_product_price</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>1</td>
            <td>957</td>
            <td>1</td>
            <td>299.98</td>
            <td>299.98</td>
        </tr>
        <tr>
            <td>61</td>
            <td>20</td>
            <td>1014</td>
            <td>4</td>
            <td>199.92</td>
            <td>49.98</td>
        </tr>
        <tr>
            <td>148</td>
            <td>61</td>
            <td>191</td>
            <td>4</td>
            <td>399.96</td>
            <td>99.99</td>
        </tr>
        <tr>
            <td>434</td>
            <td>180</td>
            <td>403</td>
            <td>1</td>
            <td>129.99</td>
            <td>129.99</td>
        </tr>
        <tr>
            <td>504</td>
            <td>207</td>
            <td>191</td>
            <td>1</td>
            <td>99.99</td>
            <td>99.99</td>
        </tr>
        <tr>
            <td>522</td>
            <td>214</td>
            <td>191</td>
            <td>2</td>
            <td>199.98</td>
            <td>99.99</td>
        </tr>
        <tr>
            <td>590</td>
            <td>239</td>
            <td>627</td>
            <td>2</td>
            <td>79.98</td>
            <td>39.99</td>
        </tr>
        <tr>
            <td>752</td>
            <td>300</td>
            <td>116</td>
            <td>1</td>
            <td>44.99</td>
            <td>44.99</td>
        </tr>
        <tr>
            <td>877</td>
            <td>353</td>
            <td>365</td>
            <td>3</td>
            <td>179.97</td>
            <td>59.99</td>
        </tr>
        <tr>
            <td>946</td>
            <td>381</td>
            <td>810</td>
            <td>5</td>
            <td>99.95</td>
            <td>19.99</td>
        </tr>
    </tbody>
</table>




```python
%sql SELECT count(*) FROM order_items;
```







<table>
    <thead>
        <tr>
            <th>count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>172198</td>
        </tr>
    </tbody>
</table>



## Basic SQL Queries using AWS Redshift SQL

### Filtering Data using AWS Redshift


```sql
%%sql
SELECT *
FROM orders
WHERE order_status = 'COMPLETE'
LIMIT 10;
```






<table>
    <thead>
        <tr>
            <th>order_id</th>
            <th>order_date</th>
            <th>order_customer_id</th>
            <th>order_status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>248</td>
            <td>2013-07-26 00:00:00</td>
            <td>11707</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>516</td>
            <td>2013-07-28 00:00:00</td>
            <td>9204</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>659</td>
            <td>2013-07-28 00:00:00</td>
            <td>6006</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>736</td>
            <td>2013-07-29 00:00:00</td>
            <td>8536</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>770</td>
            <td>2013-07-29 00:00:00</td>
            <td>12146</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>1321</td>
            <td>2013-08-01 00:00:00</td>
            <td>800</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>1452</td>
            <td>2013-08-01 00:00:00</td>
            <td>4953</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>1599</td>
            <td>2013-08-02 00:00:00</td>
            <td>8647</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>1822</td>
            <td>2013-08-03 00:00:00</td>
            <td>5682</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>58075</td>
            <td>2013-08-06 00:00:00</td>
            <td>1136</td>
            <td>COMPLETE</td>
        </tr>
    </tbody>
</table>




```sql
%%sql
SELECT *
FROM orders
WHERE order_status = 'COMPLETE' 
	AND order_date = '2014-01-01 00:00:00.0'
LIMIT 10;
```






<table>
    <thead>
        <tr>
            <th>order_id</th>
            <th>order_date</th>
            <th>order_customer_id</th>
            <th>order_status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>25882</td>
            <td>2014-01-01 00:00:00</td>
            <td>4598</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25895</td>
            <td>2014-01-01 00:00:00</td>
            <td>1044</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25888</td>
            <td>2014-01-01 00:00:00</td>
            <td>6735</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25901</td>
            <td>2014-01-01 00:00:00</td>
            <td>3099</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25920</td>
            <td>2014-01-01 00:00:00</td>
            <td>12232</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25921</td>
            <td>2014-01-01 00:00:00</td>
            <td>12373</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25936</td>
            <td>2014-01-01 00:00:00</td>
            <td>3057</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25962</td>
            <td>2014-01-01 00:00:00</td>
            <td>5170</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25980</td>
            <td>2014-01-01 00:00:00</td>
            <td>363</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>25924</td>
            <td>2014-01-01 00:00:00</td>
            <td>3826</td>
            <td>COMPLETE</td>
        </tr>
    </tbody>
</table>




```sql
%%sql
SELECT *
FROM orders
WHERE order_status = 'COMPLETE' 
	AND order_date LIKE '2014-01%'
LIMIT 10;
```






<table>
    <thead>
        <tr>
            <th>order_id</th>
            <th>order_date</th>
            <th>order_customer_id</th>
            <th>order_status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>26032</td>
            <td>2014-01-02 00:00:00</td>
            <td>2424</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>26596</td>
            <td>2014-01-05 00:00:00</td>
            <td>6998</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>62102</td>
            <td>2014-01-09 00:00:00</td>
            <td>6176</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>27823</td>
            <td>2014-01-13 00:00:00</td>
            <td>3017</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>28732</td>
            <td>2014-01-18 00:00:00</td>
            <td>5654</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>28915</td>
            <td>2014-01-19 00:00:00</td>
            <td>166</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>29147</td>
            <td>2014-01-21 00:00:00</td>
            <td>6118</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>29649</td>
            <td>2014-01-24 00:00:00</td>
            <td>8244</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>29858</td>
            <td>2014-01-26 00:00:00</td>
            <td>5670</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>30194</td>
            <td>2014-01-28 00:00:00</td>
            <td>9135</td>
            <td>COMPLETE</td>
        </tr>
    </tbody>
</table>




```sql
%%sql
SELECT *
FROM orders
WHERE order_status IN ('COMPLETE', 'CLOSED')
LIMIT 10;
```






<table>
    <thead>
        <tr>
            <th>order_id</th>
            <th>order_date</th>
            <th>order_customer_id</th>
            <th>order_status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>80</td>
            <td>2013-07-25 00:00:00</td>
            <td>3007</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>771</td>
            <td>2013-07-29 00:00:00</td>
            <td>9026</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>782</td>
            <td>2013-07-29 00:00:00</td>
            <td>12213</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>972</td>
            <td>2013-07-30 00:00:00</td>
            <td>10255</td>
            <td>CLOSED</td>
        </tr>
        <tr>
            <td>58029</td>
            <td>2013-08-04 00:00:00</td>
            <td>2863</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>2950</td>
            <td>2013-08-10 00:00:00</td>
            <td>3757</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>3343</td>
            <td>2013-08-12 00:00:00</td>
            <td>12289</td>
            <td>CLOSED</td>
        </tr>
        <tr>
            <td>3401</td>
            <td>2013-08-13 00:00:00</td>
            <td>3038</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>58244</td>
            <td>2013-08-13 00:00:00</td>
            <td>2316</td>
            <td>CLOSED</td>
        </tr>
        <tr>
            <td>3477</td>
            <td>2013-08-14 00:00:00</td>
            <td>6898</td>
            <td>COMPLETE</td>
        </tr>
    </tbody>
</table>




```sql
%%sql
SELECT *
FROM orders
WHERE order_status IN ('COMPLETE', 'CLOSED')
	AND order_date LIKE '2014-01%'
LIMIT 10;
```






<table>
    <thead>
        <tr>
            <th>order_id</th>
            <th>order_date</th>
            <th>order_customer_id</th>
            <th>order_status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>25990</td>
            <td>2014-01-02 00:00:00</td>
            <td>4870</td>
            <td>CLOSED</td>
        </tr>
        <tr>
            <td>26357</td>
            <td>2014-01-04 00:00:00</td>
            <td>11733</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>26460</td>
            <td>2014-01-05 00:00:00</td>
            <td>7582</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>26995</td>
            <td>2014-01-09 00:00:00</td>
            <td>7456</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>27066</td>
            <td>2014-01-09 00:00:00</td>
            <td>2994</td>
            <td>CLOSED</td>
        </tr>
        <tr>
            <td>27188</td>
            <td>2014-01-10 00:00:00</td>
            <td>12389</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>27464</td>
            <td>2014-01-11 00:00:00</td>
            <td>7274</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>27911</td>
            <td>2014-01-13 00:00:00</td>
            <td>8571</td>
            <td>COMPLETE</td>
        </tr>
        <tr>
            <td>27949</td>
            <td>2014-01-14 00:00:00</td>
            <td>11080</td>
            <td>CLOSED</td>
        </tr>
        <tr>
            <td>68784</td>
            <td>2014-01-14 00:00:00</td>
            <td>10349</td>
            <td>COMPLETE</td>
        </tr>
    </tbody>
</table>



### Total Aggregations using AWS Redshift SQL


```sql
%%sql
WITH
    sales AS (
        SELECT 1 AS sale_id, 1 AS course_id, 10.99 AS sale_amount
        UNION ALL
        SELECT 2, 2, 9.99
        UNION ALL
        SELECT 3, 1, 10.99
        UNION ALL
        SELECT 4, 3, 12.99
        UNION ALL
        SELECT 5, 3, 12.99
        UNION ALL
        SELECT 6, 1, 9.99
        UNION ALL
        SELECT 7, 2, 10.99
        UNION ALL
        SELECT 8, 2, 9.99
        UNION ALL
        SELECT 9, 4, 11.99
        UNION ALL
        SELECT 10, 1, 13.99
    )
SELECT * FROM sales;
```






<table>
    <thead>
        <tr>
            <th>sale_id</th>
            <th>course_id</th>
            <th>sale_amount</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>1</td>
            <td>10.99</td>
        </tr>
        <tr>
            <td>2</td>
            <td>2</td>
            <td>9.99</td>
        </tr>
        <tr>
            <td>3</td>
            <td>1</td>
            <td>10.99</td>
        </tr>
        <tr>
            <td>4</td>
            <td>3</td>
            <td>12.99</td>
        </tr>
        <tr>
            <td>5</td>
            <td>3</td>
            <td>12.99</td>
        </tr>
        <tr>
            <td>6</td>
            <td>1</td>
            <td>9.99</td>
        </tr>
        <tr>
            <td>7</td>
            <td>2</td>
            <td>10.99</td>
        </tr>
        <tr>
            <td>8</td>
            <td>2</td>
            <td>9.99</td>
        </tr>
        <tr>
            <td>9</td>
            <td>4</td>
            <td>11.99</td>
        </tr>
        <tr>
            <td>10</td>
            <td>1</td>
            <td>13.99</td>
        </tr>
    </tbody>
</table>




```sql
%%sql
SELECT count(distinct order_date),
	count(distinct order_status)
FROM orders;
```







<table>
    <thead>
        <tr>
            <th>count</th>
            <th>count_1</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>364</td>
            <td>9</td>
        </tr>
    </tbody>
</table>




```sql
%%sql
SELECT * 
FROM order_items 
LIMIT 10;
```






<table>
    <thead>
        <tr>
            <th>order_item_id</th>
            <th>order_item_order_id</th>
            <th>order_item_product_id</th>
            <th>order_item_quantity</th>
            <th>order_item_subtotal</th>
            <th>order_item_product_price</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>1</td>
            <td>957</td>
            <td>1</td>
            <td>299.98</td>
            <td>299.98</td>
        </tr>
        <tr>
            <td>61</td>
            <td>20</td>
            <td>1014</td>
            <td>4</td>
            <td>199.92</td>
            <td>49.98</td>
        </tr>
        <tr>
            <td>148</td>
            <td>61</td>
            <td>191</td>
            <td>4</td>
            <td>399.96</td>
            <td>99.99</td>
        </tr>
        <tr>
            <td>434</td>
            <td>180</td>
            <td>403</td>
            <td>1</td>
            <td>129.99</td>
            <td>129.99</td>
        </tr>
        <tr>
            <td>504</td>
            <td>207</td>
            <td>191</td>
            <td>1</td>
            <td>99.99</td>
            <td>99.99</td>
        </tr>
        <tr>
            <td>522</td>
            <td>214</td>
            <td>191</td>
            <td>2</td>
            <td>199.98</td>
            <td>99.99</td>
        </tr>
        <tr>
            <td>590</td>
            <td>239</td>
            <td>627</td>
            <td>2</td>
            <td>79.98</td>
            <td>39.99</td>
        </tr>
        <tr>
            <td>752</td>
            <td>300</td>
            <td>116</td>
            <td>1</td>
            <td>44.99</td>
            <td>44.99</td>
        </tr>
        <tr>
            <td>877</td>
            <td>353</td>
            <td>365</td>
            <td>3</td>
            <td>179.97</td>
            <td>59.99</td>
        </tr>
        <tr>
            <td>946</td>
            <td>381</td>
            <td>810</td>
            <td>5</td>
            <td>99.95</td>
            <td>19.99</td>
        </tr>
    </tbody>
</table>




```sql
%%sql
SELECT round(sum(order_item_subtotal), 2)
FROM order_items
WHERE order_item_order_id = 2;
```







<table>
    <thead>
        <tr>
            <th>round</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>579.98</td>
        </tr>
    </tbody>
</table>




```sql
%%sql
SELECT count(*) item_count,
	round(sum(order_item_subtotal), 2) total_revenue,
    round(avg(order_item_subtotal), 2) avg_revenue
FROM order_items
WHERE order_item_order_id = 2;
```







<table>
    <thead>
        <tr>
            <th>item_count</th>
            <th>total_revenue</th>
            <th>avg_revenue</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>3</td>
            <td>579.98</td>
            <td>193.33</td>
        </tr>
    </tbody>
</table>
