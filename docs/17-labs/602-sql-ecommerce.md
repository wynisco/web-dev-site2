# Ecommerce Data Analysis with SQL


```python
!mkdir -p ~/.aws
!pip install -qq psycopg2-binary awscli boto3 s3fs
```


```python
%%writefile ~/.aws/credentials
[default]
aws_access_key_id=
aws_secret_access_key=
region=us-east-1
output=json
```

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

USERNAME = db_credentials["RDS_POSTGRES_USERNAME"]
PASSWORD = db_credentials["RDS_POSTGRES_PASSWORD"]
HOST = db_credentials["RDS_POSTGRES_HOST"]
PORT = 5432
DBNAME = "postgres"
CONN = f"postgresql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"

%sql {CONN}
```

```python
# SCHEMA = "retail"
# %sql CREATE SCHEMA IF NOT EXISTS {SCHEMA}
# %sql SET search_path = {SCHEMA}
```

## Basic SQL

### LIMIT

Displays all the data in the occurred_at, account_id, and channel columns of the web_events table, and limits the output to only the first 15 rows

Note - LIMIT must be the last one.


```python
%%sql
SELECT occurred_at, account_id, channel
FROM web_events
LIMIT 15;
```


<table>
    <thead>
        <tr>
            <th>occurred_at</th>
            <th>account_id</th>
            <th>channel</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2015-10-06 17:13:58</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2015-11-05 03:08:26</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2015-12-04 03:57:24</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-01-02 00:55:03</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-02-01 19:02:33</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-03-02 15:15:22</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-04-01 10:58:55</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-05-01 15:26:44</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-05-31 20:53:47</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-06-30 12:09:45</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-07-30 03:06:26</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-08-28 06:42:42</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-09-26 23:14:59</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-10-26 20:21:09</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2016-11-25 22:52:29</td>
            <td>1001</td>
            <td>direct</td>
        </tr>
    </tbody>
</table>



### ORDER BY

Write a query to return the 10 earliest orders in the orders table. Include the id, occurred_at, and total_amt_usd.


```python
%%sql
SELECT id, occurred_at, total_amt_usd
FROM orders
ORDER BY occurred_at
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>occurred_at</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>5786</td>
            <td>2013-12-04 04:22:44</td>
            <td>627.48</td>
        </tr>
        <tr>
            <td>2415</td>
            <td>2013-12-04 04:45:54</td>
            <td>2646.77</td>
        </tr>
        <tr>
            <td>4108</td>
            <td>2013-12-04 04:53:25</td>
            <td>2709.62</td>
        </tr>
        <tr>
            <td>4489</td>
            <td>2013-12-05 20:29:16</td>
            <td>277.13</td>
        </tr>
        <tr>
            <td>287</td>
            <td>2013-12-05 20:33:56</td>
            <td>3001.85</td>
        </tr>
        <tr>
            <td>1946</td>
            <td>2013-12-06 02:13:20</td>
            <td>2802.90</td>
        </tr>
        <tr>
            <td>6197</td>
            <td>2013-12-06 12:55:22</td>
            <td>7009.18</td>
        </tr>
        <tr>
            <td>3122</td>
            <td>2013-12-06 12:57:41</td>
            <td>1992.13</td>
        </tr>
        <tr>
            <td>6078</td>
            <td>2013-12-06 13:14:47</td>
            <td>6680.06</td>
        </tr>
        <tr>
            <td>2932</td>
            <td>2013-12-06 13:17:25</td>
            <td>2075.94</td>
        </tr>
    </tbody>
</table>



Write a query to return the top 5 orders in terms of largest total_amt_usd. Include the id, account_id, and total_amt_usd.


```python
%%sql
SELECT id, account_id, total_amt_usd
FROM orders
ORDER BY total_amt_usd DESC
LIMIT 5;
```



<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4016</td>
            <td>4251</td>
            <td>232207.07</td>
        </tr>
        <tr>
            <td>3892</td>
            <td>4161</td>
            <td>112875.18</td>
        </tr>
        <tr>
            <td>3963</td>
            <td>4211</td>
            <td>107533.55</td>
        </tr>
        <tr>
            <td>5791</td>
            <td>2861</td>
            <td>95005.82</td>
        </tr>
        <tr>
            <td>3778</td>
            <td>4101</td>
            <td>93547.84</td>
        </tr>
    </tbody>
</table>



Write a query to return the lowest 20 orders in terms of smallest total_amt_usd. Include the id, account_id, and total_amt_usd.


```python
%%sql
SELECT id, account_id, total_amt_usd
FROM orders
ORDER BY total_amt_usd
Limit 20;
```



<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>6375</td>
            <td>3651</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>6523</td>
            <td>3991</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>6323</td>
            <td>3551</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>6312</td>
            <td>3541</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>6435</td>
            <td>3801</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>4446</td>
            <td>1231</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>5612</td>
            <td>2601</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>4844</td>
            <td>1571</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>5057</td>
            <td>1851</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>4625</td>
            <td>1411</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>6009</td>
            <td>3141</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>6281</td>
            <td>3491</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>4445</td>
            <td>1221</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>2518</td>
            <td>2881</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>4490</td>
            <td>1281</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>124</td>
            <td>1131</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>4770</td>
            <td>1521</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>1353</td>
            <td>1951</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>5001</td>
            <td>1791</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>6856</td>
            <td>4451</td>
            <td>0.00</td>
        </tr>
    </tbody>
</table>



Write a query that displays the order ID, account ID, and total dollar amount for all the orders, sorted first by the account ID (in ascending order), and then by the total dollar amount (in descending order).


```python
%%sql
SELECT id, account_id, total_amt_usd
FROM orders
ORDER BY account_id, total_amt_usd DESC
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4308</td>
            <td>1001</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>4309</td>
            <td>1001</td>
            <td>9230.67</td>
        </tr>
        <tr>
            <td>4316</td>
            <td>1001</td>
            <td>9134.31</td>
        </tr>
        <tr>
            <td>4317</td>
            <td>1001</td>
            <td>8963.91</td>
        </tr>
        <tr>
            <td>4314</td>
            <td>1001</td>
            <td>8863.24</td>
        </tr>
        <tr>
            <td>4307</td>
            <td>1001</td>
            <td>8757.18</td>
        </tr>
        <tr>
            <td>4311</td>
            <td>1001</td>
            <td>8672.95</td>
        </tr>
        <tr>
            <td>4310</td>
            <td>1001</td>
            <td>8538.26</td>
        </tr>
        <tr>
            <td>4312</td>
            <td>1001</td>
            <td>8343.09</td>
        </tr>
        <tr>
            <td>4313</td>
            <td>1001</td>
            <td>8311.59</td>
        </tr>
    </tbody>
</table>



Write a query that again displays order ID, account ID, and total dollar amount for each order, but this time sorted first by total dollar amount (in descending order), and then by account ID (in ascending order).



```python
%%sql
SELECT id, account_id, total_amt_usd
FROM orders
ORDER BY total_amt_usd DESC, account_id
LIMIT 10;
```



<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4016</td>
            <td>4251</td>
            <td>232207.07</td>
        </tr>
        <tr>
            <td>3892</td>
            <td>4161</td>
            <td>112875.18</td>
        </tr>
        <tr>
            <td>3963</td>
            <td>4211</td>
            <td>107533.55</td>
        </tr>
        <tr>
            <td>5791</td>
            <td>2861</td>
            <td>95005.82</td>
        </tr>
        <tr>
            <td>3778</td>
            <td>4101</td>
            <td>93547.84</td>
        </tr>
        <tr>
            <td>6590</td>
            <td>4111</td>
            <td>93505.69</td>
        </tr>
        <tr>
            <td>362</td>
            <td>1301</td>
            <td>93106.81</td>
        </tr>
        <tr>
            <td>731</td>
            <td>1521</td>
            <td>92991.05</td>
        </tr>
        <tr>
            <td>4562</td>
            <td>1341</td>
            <td>84099.62</td>
        </tr>
        <tr>
            <td>3858</td>
            <td>4151</td>
            <td>82163.71</td>
        </tr>
    </tbody>
</table>



### WHERE

Pulls the first 5 rows and all columns from the orders table that have a dollar amount of gloss_amt_usd greater than or equal to 1000.


```python
%%sql
SELECT *
FROM orders
WHERE gloss_amt_usd >= 1000
LIMIT 5;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>standard_qty</th>
            <th>gloss_qty</th>
            <th>poster_qty</th>
            <th>total</th>
            <th>standard_amt_usd</th>
            <th>gloss_amt_usd</th>
            <th>poster_amt_usd</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>14</td>
            <td>1001</td>
            <td>2016-10-26 20:31:30</td>
            <td>97</td>
            <td>143</td>
            <td>54</td>
            <td>294</td>
            <td>484.03</td>
            <td>1071.07</td>
            <td>438.48</td>
            <td>1993.58</td>
        </tr>
        <tr>
            <td>62</td>
            <td>1091</td>
            <td>2014-10-13 12:12:55</td>
            <td>146</td>
            <td>196</td>
            <td>3</td>
            <td>345</td>
            <td>728.54</td>
            <td>1468.04</td>
            <td>24.36</td>
            <td>2220.94</td>
        </tr>
        <tr>
            <td>88</td>
            <td>1101</td>
            <td>2015-06-24 13:08:15</td>
            <td>182</td>
            <td>339</td>
            <td>17</td>
            <td>538</td>
            <td>908.18</td>
            <td>2539.11</td>
            <td>138.04</td>
            <td>3585.33</td>
        </tr>
        <tr>
            <td>121</td>
            <td>1131</td>
            <td>2016-08-10 23:47:41</td>
            <td>273</td>
            <td>134</td>
            <td>0</td>
            <td>407</td>
            <td>1362.27</td>
            <td>1003.66</td>
            <td>0.00</td>
            <td>2365.93</td>
        </tr>
        <tr>
            <td>129</td>
            <td>1141</td>
            <td>2016-12-21 15:52:58</td>
            <td>143</td>
            <td>1045</td>
            <td>2157</td>
            <td>3345</td>
            <td>713.57</td>
            <td>7827.05</td>
            <td>17514.84</td>
            <td>26055.46</td>
        </tr>
    </tbody>
</table>



Pulls the first 10 rows and all columns from the orders table that have a total_amt_usd less than 500.


```python
%%sql
SELECT *
FROM orders
WHERE total_amt_usd < 500
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>standard_qty</th>
            <th>gloss_qty</th>
            <th>poster_qty</th>
            <th>total</th>
            <th>standard_amt_usd</th>
            <th>gloss_amt_usd</th>
            <th>poster_amt_usd</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>67</td>
            <td>1091</td>
            <td>2015-04-07 13:29:20</td>
            <td>95</td>
            <td>0</td>
            <td>0</td>
            <td>95</td>
            <td>474.05</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>474.05</td>
        </tr>
        <tr>
            <td>96</td>
            <td>1101</td>
            <td>2016-03-15 11:36:03</td>
            <td>14</td>
            <td>8</td>
            <td>16</td>
            <td>38</td>
            <td>69.86</td>
            <td>59.92</td>
            <td>129.92</td>
            <td>259.70</td>
        </tr>
        <tr>
            <td>119</td>
            <td>1131</td>
            <td>2016-06-12 12:29:45</td>
            <td>0</td>
            <td>30</td>
            <td>23</td>
            <td>53</td>
            <td>0.00</td>
            <td>224.70</td>
            <td>186.76</td>
            <td>411.46</td>
        </tr>
        <tr>
            <td>124</td>
            <td>1131</td>
            <td>2016-11-07 05:10:56</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>254</td>
            <td>1251</td>
            <td>2014-11-01 02:15:24</td>
            <td>0</td>
            <td>0</td>
            <td>17</td>
            <td>17</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>138.04</td>
            <td>138.04</td>
        </tr>
        <tr>
            <td>328</td>
            <td>1291</td>
            <td>2015-08-03 08:35:23</td>
            <td>0</td>
            <td>19</td>
            <td>21</td>
            <td>40</td>
            <td>0.00</td>
            <td>142.31</td>
            <td>170.52</td>
            <td>312.83</td>
        </tr>
        <tr>
            <td>542</td>
            <td>1421</td>
            <td>2015-11-13 09:07:09</td>
            <td>0</td>
            <td>64</td>
            <td>0</td>
            <td>64</td>
            <td>0.00</td>
            <td>479.36</td>
            <td>0.00</td>
            <td>479.36</td>
        </tr>
        <tr>
            <td>683</td>
            <td>1501</td>
            <td>2016-04-14 23:59:50</td>
            <td>0</td>
            <td>15</td>
            <td>16</td>
            <td>31</td>
            <td>0.00</td>
            <td>112.35</td>
            <td>129.92</td>
            <td>242.27</td>
        </tr>
        <tr>
            <td>713</td>
            <td>1521</td>
            <td>2014-11-23 16:04:03</td>
            <td>0</td>
            <td>8</td>
            <td>10</td>
            <td>18</td>
            <td>0.00</td>
            <td>59.92</td>
            <td>81.20</td>
            <td>141.12</td>
        </tr>
        <tr>
            <td>730</td>
            <td>1521</td>
            <td>2016-05-06 02:34:48</td>
            <td>0</td>
            <td>0</td>
            <td>2</td>
            <td>2</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>16.24</td>
            <td>16.24</td>
        </tr>
    </tbody>
</table>



Filter the accounts table to include the company name, website, and the primary point of contact (primary_poc) just for the Exxon Mobil company in the accounts table.


```python
%%sql
SELECT name, website, primary_poc
FROM accounts
WHERE name = 'Exxon Mobil'
```


<table>
    <thead>
        <tr>
            <th>name</th>
            <th>website</th>
            <th>primary_poc</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Exxon Mobil</td>
            <td>www.exxonmobil.com</td>
            <td>Sung Shields</td>
        </tr>
    </tbody>
</table>



Using the orders table:
Create a column that divides the standard_amt_usd by the standard_qty to find the unit price for standard paper for each order. Limit the results to the first 10 orders, and include the id and account_id fields.


```python
%%sql
SELECT id, account_id, (standard_amt_usd/standard_qty) AS unit_price
FROM orders
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>unit_price</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>2</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>3</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>4</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>5</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>6</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>7</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>8</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>9</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
        <tr>
            <td>10</td>
            <td>1001</td>
            <td>4.9900000000000000</td>
        </tr>
    </tbody>
</table>



Write a query that finds the percentage of revenue that comes from poster paper for each order. You will need to use only the columns that end with _usd. (Try to do this without using the total column.) Display the id and account_id fields also. NOTE - you will receive an error with the correct solution to this question. This occurs because at least one of the values in the data creates a division by zero in your formula. You will learn later how to fully handle this issue. For now, you can just limit your calculations to the first 10 orders, as we did in question #1, and you'll avoid that set of data that causes the problem.


```python
%%sql
SELECT id, account_id, poster_amt_usd/(standard_amt_usd + gloss_amt_usd + poster_amt_usd) AS post_per
FROM orders
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>post_per</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>1001</td>
            <td>0.20019929527546921710</td>
        </tr>
        <tr>
            <td>2</td>
            <td>1001</td>
            <td>0.26940158204455102647</td>
        </tr>
        <tr>
            <td>3</td>
            <td>1001</td>
            <td>0E-20</td>
        </tr>
        <tr>
            <td>4</td>
            <td>1001</td>
            <td>0E-20</td>
        </tr>
        <tr>
            <td>5</td>
            <td>1001</td>
            <td>0.23117672777557473894</td>
        </tr>
        <tr>
            <td>6</td>
            <td>1001</td>
            <td>0.34998360271726399625</td>
        </tr>
        <tr>
            <td>7</td>
            <td>1001</td>
            <td>0.49862501668669069550</td>
        </tr>
        <tr>
            <td>8</td>
            <td>1001</td>
            <td>0.59746613390507747783</td>
        </tr>
        <tr>
            <td>9</td>
            <td>1001</td>
            <td>0.23737326760301367315</td>
        </tr>
        <tr>
            <td>10</td>
            <td>1001</td>
            <td>0.07393917319249681297</td>
        </tr>
    </tbody>
</table>



### LIKE

Use the accounts table to find All the companies whose names start with 'C'.


```python
%%sql
SELECT id, name
FROM accounts
WHERE name LIKE 'C%'
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1061</td>
            <td>CVS Health</td>
        </tr>
        <tr>
            <td>1131</td>
            <td>Chevron</td>
        </tr>
        <tr>
            <td>1141</td>
            <td>Costco</td>
        </tr>
        <tr>
            <td>1201</td>
            <td>Cardinal Health</td>
        </tr>
        <tr>
            <td>1281</td>
            <td>Citigroup</td>
        </tr>
        <tr>
            <td>1361</td>
            <td>Comcast</td>
        </tr>
        <tr>
            <td>1531</td>
            <td>Cisco Systems</td>
        </tr>
        <tr>
            <td>1581</td>
            <td>Caterpillar</td>
        </tr>
        <tr>
            <td>1611</td>
            <td>Coca-Cola</td>
        </tr>
        <tr>
            <td>1781</td>
            <td>Cigna</td>
        </tr>
    </tbody>
</table>



Use the accounts table to find All companies whose names contain the string 'one' somewhere in the name.


```python
%%sql
SELECT id, name
FROM accounts
WHERE name LIKE '%one'
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1821</td>
            <td>INTL FCStone</td>
        </tr>
        <tr>
            <td>3791</td>
            <td>AutoZone</td>
        </tr>
    </tbody>
</table>



Use the accounts table to find All companies whose names end with 's'.


```python
%%sql
SELECT id, name
FROM accounts
WHERE name LIKE '%s'
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1071</td>
            <td>General Motors</td>
        </tr>
        <tr>
            <td>1441</td>
            <td>United Technologies</td>
        </tr>
        <tr>
            <td>1461</td>
            <td>Lowe&#x27;s</td>
        </tr>
        <tr>
            <td>1531</td>
            <td>Cisco Systems</td>
        </tr>
        <tr>
            <td>1621</td>
            <td>HCA Holdings</td>
        </tr>
        <tr>
            <td>1651</td>
            <td>Tyson Foods</td>
        </tr>
        <tr>
            <td>1671</td>
            <td>Delta Air Lines</td>
        </tr>
        <tr>
            <td>1691</td>
            <td>Johnson Controls</td>
        </tr>
        <tr>
            <td>3361</td>
            <td>Ross Stores</td>
        </tr>
        <tr>
            <td>1791</td>
            <td>United Continental Holdings</td>
        </tr>
    </tbody>
</table>



### IN

Use the accounts table to find the account name, primary_poc, and sales_rep_id for Walmart, Target, and Nordstrom.


```python
%%sql
SELECT name, primary_poc, sales_rep_id
FROM accounts
WHERE name IN ('Walmart', 'Target', 'Nordstrom')
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>name</th>
            <th>primary_poc</th>
            <th>sales_rep_id</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Walmart</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>Target</td>
            <td>Luba Streett</td>
            <td>321660</td>
        </tr>
        <tr>
            <td>Nordstrom</td>
            <td>Yan Crater</td>
            <td>321820</td>
        </tr>
    </tbody>
</table>



Use the web_events table to find all information regarding individuals who were contacted via the channel of organic or adwords.


```python
%%sql
SELECT *
FROM web_events
WHERE channel IN ('organic', 'adwords')
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>channel</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4395</td>
            <td>1001</td>
            <td>2015-10-22 05:02:47</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>4396</td>
            <td>1001</td>
            <td>2015-10-22 14:04:20</td>
            <td>adwords</td>
        </tr>
        <tr>
            <td>4399</td>
            <td>1001</td>
            <td>2016-01-01 15:45:54</td>
            <td>adwords</td>
        </tr>
        <tr>
            <td>4401</td>
            <td>1001</td>
            <td>2016-02-07 17:44:10</td>
            <td>adwords</td>
        </tr>
        <tr>
            <td>4402</td>
            <td>1001</td>
            <td>2016-02-27 15:27:22</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>4404</td>
            <td>1001</td>
            <td>2016-04-05 03:02:52</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>4405</td>
            <td>1001</td>
            <td>2016-04-17 16:41:02</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>4408</td>
            <td>1001</td>
            <td>2016-05-21 16:22:01</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>4410</td>
            <td>1001</td>
            <td>2016-06-22 13:48:53</td>
            <td>adwords</td>
        </tr>
        <tr>
            <td>4414</td>
            <td>1001</td>
            <td>2016-08-12 09:31:22</td>
            <td>organic</td>
        </tr>
    </tbody>
</table>



### NOT

Use the accounts table to find the account name, primary poc, and sales rep id for all stores except Walmart, Target, and Nordstrom.


```python
%%sql
SELECT name, primary_poc, sales_rep_id
FROM accounts
WHERE name NOT IN ('Walmart', 'Target', 'Nordstrom')
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>name</th>
            <th>primary_poc</th>
            <th>sales_rep_id</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Exxon Mobil</td>
            <td>Sung Shields</td>
            <td>321510</td>
        </tr>
        <tr>
            <td>Apple</td>
            <td>Jodee Lupo</td>
            <td>321520</td>
        </tr>
        <tr>
            <td>Berkshire Hathaway</td>
            <td>Serafina Banda</td>
            <td>321530</td>
        </tr>
        <tr>
            <td>McKesson</td>
            <td>Angeles Crusoe</td>
            <td>321540</td>
        </tr>
        <tr>
            <td>UnitedHealth Group</td>
            <td>Savanna Gayman</td>
            <td>321550</td>
        </tr>
        <tr>
            <td>CVS Health</td>
            <td>Anabel Haskell</td>
            <td>321560</td>
        </tr>
        <tr>
            <td>General Motors</td>
            <td>Barrie Omeara</td>
            <td>321570</td>
        </tr>
        <tr>
            <td>Ford Motor</td>
            <td>Kym Hagerman</td>
            <td>321580</td>
        </tr>
        <tr>
            <td>AT&amp;T</td>
            <td>Jamel Mosqueda</td>
            <td>321590</td>
        </tr>
        <tr>
            <td>General Electric</td>
            <td>Parker Hoggan</td>
            <td>321600</td>
        </tr>
    </tbody>
</table>



Use the web_events table to find all information regarding individuals who were contacted via any method except using organic or adwords methods.


```python
%%sql
SELECT *
FROM web_events
WHERE channel NOT in ('organic', 'adwords')
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>channel</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:13:58</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>2</td>
            <td>1001</td>
            <td>2015-11-05 03:08:26</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>3</td>
            <td>1001</td>
            <td>2015-12-04 03:57:24</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>4</td>
            <td>1001</td>
            <td>2016-01-02 00:55:03</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>5</td>
            <td>1001</td>
            <td>2016-02-01 19:02:33</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>6</td>
            <td>1001</td>
            <td>2016-03-02 15:15:22</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>7</td>
            <td>1001</td>
            <td>2016-04-01 10:58:55</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>8</td>
            <td>1001</td>
            <td>2016-05-01 15:26:44</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>9</td>
            <td>1001</td>
            <td>2016-05-31 20:53:47</td>
            <td>direct</td>
        </tr>
        <tr>
            <td>10</td>
            <td>1001</td>
            <td>2016-06-30 12:09:45</td>
            <td>direct</td>
        </tr>
    </tbody>
</table>



Use the accounts table to find All the companies whose names do not start with 'C'.


```python
%%sql
SELECT name
FROM accounts
WHERE name NOT LIKE 'C%'
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Walmart</td>
        </tr>
        <tr>
            <td>Exxon Mobil</td>
        </tr>
        <tr>
            <td>Apple</td>
        </tr>
        <tr>
            <td>Berkshire Hathaway</td>
        </tr>
        <tr>
            <td>McKesson</td>
        </tr>
        <tr>
            <td>UnitedHealth Group</td>
        </tr>
        <tr>
            <td>General Motors</td>
        </tr>
        <tr>
            <td>Ford Motor</td>
        </tr>
        <tr>
            <td>AT&amp;T</td>
        </tr>
        <tr>
            <td>General Electric</td>
        </tr>
    </tbody>
</table>



All companies whose names do not contain the string 'one' somewhere in the name.


```python
%%sql
SELECT name
FROM accounts
WHERE name NOT LIKE '%one%'
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Walmart</td>
        </tr>
        <tr>
            <td>Exxon Mobil</td>
        </tr>
        <tr>
            <td>Apple</td>
        </tr>
        <tr>
            <td>Berkshire Hathaway</td>
        </tr>
        <tr>
            <td>McKesson</td>
        </tr>
        <tr>
            <td>UnitedHealth Group</td>
        </tr>
        <tr>
            <td>CVS Health</td>
        </tr>
        <tr>
            <td>General Motors</td>
        </tr>
        <tr>
            <td>Ford Motor</td>
        </tr>
        <tr>
            <td>AT&amp;T</td>
        </tr>
    </tbody>
</table>



All companies whose names do not end with 's'.


```python
%%sql
SELECT name
FROM accounts
WHERE name NOT LIKE '%s'
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Walmart</td>
        </tr>
        <tr>
            <td>Exxon Mobil</td>
        </tr>
        <tr>
            <td>Apple</td>
        </tr>
        <tr>
            <td>Berkshire Hathaway</td>
        </tr>
        <tr>
            <td>McKesson</td>
        </tr>
        <tr>
            <td>UnitedHealth Group</td>
        </tr>
        <tr>
            <td>CVS Health</td>
        </tr>
        <tr>
            <td>Ford Motor</td>
        </tr>
        <tr>
            <td>AT&amp;T</td>
        </tr>
        <tr>
            <td>General Electric</td>
        </tr>
    </tbody>
</table>



### AND and BETWEEN

Write a query that returns all the orders where the standard_qty is over 1000, the poster_qty is 0, and the gloss_qty is 0.


```python
%%sql
SELECT *
FROM orders
WHERE standard_qty > 1000 AND poster_qty = 0 AND gloss_qty = 0
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>standard_qty</th>
            <th>gloss_qty</th>
            <th>poster_qty</th>
            <th>total</th>
            <th>standard_amt_usd</th>
            <th>gloss_amt_usd</th>
            <th>poster_amt_usd</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2613</td>
            <td>2951</td>
            <td>2016-08-15 00:06:12</td>
            <td>1171</td>
            <td>0</td>
            <td>0</td>
            <td>1171</td>
            <td>5843.29</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>5843.29</td>
        </tr>
        <tr>
            <td>3260</td>
            <td>3491</td>
            <td>2014-08-29 22:43:00</td>
            <td>1552</td>
            <td>0</td>
            <td>0</td>
            <td>1552</td>
            <td>7744.48</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>7744.48</td>
        </tr>
    </tbody>
</table>



Using the accounts table, find all the companies whose names do not start with 'C' and end with 's'.


```python
%%sql
SELECT name
FROM accounts
WHERE name NOT LIKE 'C%' AND name LIKE '%s'
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>name</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>General Motors</td>
        </tr>
        <tr>
            <td>United Technologies</td>
        </tr>
        <tr>
            <td>Lowe&#x27;s</td>
        </tr>
        <tr>
            <td>HCA Holdings</td>
        </tr>
        <tr>
            <td>Tyson Foods</td>
        </tr>
        <tr>
            <td>Delta Air Lines</td>
        </tr>
        <tr>
            <td>Johnson Controls</td>
        </tr>
        <tr>
            <td>Ross Stores</td>
        </tr>
        <tr>
            <td>United Continental Holdings</td>
        </tr>
        <tr>
            <td>American Express</td>
        </tr>
    </tbody>
</table>



When you use the BETWEEN operator in SQL, do the results include the values of your endpoints, or not?
Figure out the answer to this important question by writing a query that displays the order date and gloss_qty data for all orders where gloss_qty is between 24 and 29.
Then look at your output to see if the BETWEEN operator included the begin and end values or not.
--there are a number of rows in the output of this query where the gloss_qty values are 24 or 29.
So the answer to the question is that yes, the BETWEEN operator in SQL is inclusive; that is, the endpoint values are included.
So the BETWEEN statement in this query is equivalent to having written "WHERE gloss_qty >= 24 AND gloss_qty <= 29.


```python
%%sql
SELECT occurred_at, gloss_qty
FROM orders
WHERE gloss_qty BETWEEN 24 AND 29
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>occurred_at</th>
            <th>gloss_qty</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2016-02-01 19:27:27</td>
            <td>29</td>
        </tr>
        <tr>
            <td>2016-03-02 15:29:32</td>
            <td>24</td>
        </tr>
        <tr>
            <td>2016-10-14 23:54:21</td>
            <td>28</td>
        </tr>
        <tr>
            <td>2015-08-09 18:29:20</td>
            <td>24</td>
        </tr>
        <tr>
            <td>2016-02-01 20:00:37</td>
            <td>26</td>
        </tr>
        <tr>
            <td>2016-04-30 07:46:13</td>
            <td>26</td>
        </tr>
        <tr>
            <td>2016-06-28 06:18:20</td>
            <td>25</td>
        </tr>
        <tr>
            <td>2016-08-26 16:47:57</td>
            <td>25</td>
        </tr>
        <tr>
            <td>2016-10-24 21:46:10</td>
            <td>28</td>
        </tr>
        <tr>
            <td>2016-11-23 04:38:57</td>
            <td>25</td>
        </tr>
    </tbody>
</table>



Use the web_events table to find all information regarding individuals who were contacted via the organic or adwords channels, and started their account at any point in 2016, sorted from newest to oldest.


```python
%%sql
SELECT *
FROM web_events
WHERE channel IN ('organic', 'adwords') AND occurred_at BETWEEN '2016-01-01' AND '2017-01-01'
ORDER BY occurred_at DESC
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>channel</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>8493</td>
            <td>4141</td>
            <td>2016-12-31 16:31:23</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>5661</td>
            <td>1851</td>
            <td>2016-12-31 06:55:38</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>5562</td>
            <td>1791</td>
            <td>2016-12-31 02:08:50</td>
            <td>adwords</td>
        </tr>
        <tr>
            <td>7703</td>
            <td>3351</td>
            <td>2016-12-30 21:06:53</td>
            <td>adwords</td>
        </tr>
        <tr>
            <td>7921</td>
            <td>3521</td>
            <td>2016-12-30 20:15:48</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>6416</td>
            <td>2401</td>
            <td>2016-12-30 17:51:36</td>
            <td>adwords</td>
        </tr>
        <tr>
            <td>4553</td>
            <td>1151</td>
            <td>2016-12-30 15:57:41</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>8129</td>
            <td>3781</td>
            <td>2016-12-30 06:52:24</td>
            <td>organic</td>
        </tr>
        <tr>
            <td>6200</td>
            <td>2281</td>
            <td>2016-12-30 03:43:11</td>
            <td>adwords</td>
        </tr>
        <tr>
            <td>6937</td>
            <td>2801</td>
            <td>2016-12-29 14:51:48</td>
            <td>organic</td>
        </tr>
    </tbody>
</table>



Find list of orders ids where either gloss_qty or poster_qty is greater than 4000. Only include the id field in the resulting table.


```python
%%sql
SELECT id
FROM orders
WHERE gloss_qty > 4000 OR poster_qty > 4000
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>362</td>
        </tr>
        <tr>
            <td>731</td>
        </tr>
        <tr>
            <td>1191</td>
        </tr>
        <tr>
            <td>1913</td>
        </tr>
        <tr>
            <td>1939</td>
        </tr>
        <tr>
            <td>3778</td>
        </tr>
        <tr>
            <td>3858</td>
        </tr>
        <tr>
            <td>3963</td>
        </tr>
        <tr>
            <td>4016</td>
        </tr>
        <tr>
            <td>4230</td>
        </tr>
    </tbody>
</table>



Write a query that returns a list of orders where the standard_qty is zero and either the gloss_qty or poster_qty is over 1000.


```python
%%sql
SELECT *
FROM orders
WHERE standard_qty =0 AND (gloss_qty > 1000 OR poster_qty > 1000)
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>standard_qty</th>
            <th>gloss_qty</th>
            <th>poster_qty</th>
            <th>total</th>
            <th>standard_amt_usd</th>
            <th>gloss_amt_usd</th>
            <th>poster_amt_usd</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1913</td>
            <td>2461</td>
            <td>2013-12-29 09:50:38</td>
            <td>0</td>
            <td>6450</td>
            <td>45</td>
            <td>6495</td>
            <td>0.00</td>
            <td>48310.50</td>
            <td>365.40</td>
            <td>48675.90</td>
        </tr>
        <tr>
            <td>4369</td>
            <td>1111</td>
            <td>2015-11-15 17:47:46</td>
            <td>0</td>
            <td>486</td>
            <td>2988</td>
            <td>3474</td>
            <td>0.00</td>
            <td>3640.14</td>
            <td>24262.56</td>
            <td>27902.70</td>
        </tr>
        <tr>
            <td>4391</td>
            <td>1161</td>
            <td>2016-06-04 08:58:10</td>
            <td>0</td>
            <td>106</td>
            <td>2967</td>
            <td>3073</td>
            <td>0.00</td>
            <td>793.94</td>
            <td>24092.04</td>
            <td>24885.98</td>
        </tr>
        <tr>
            <td>4420</td>
            <td>1191</td>
            <td>2016-05-21 23:21:14</td>
            <td>0</td>
            <td>43</td>
            <td>1448</td>
            <td>1491</td>
            <td>0.00</td>
            <td>322.07</td>
            <td>11757.76</td>
            <td>12079.83</td>
        </tr>
        <tr>
            <td>4448</td>
            <td>1231</td>
            <td>2016-06-25 12:27:15</td>
            <td>0</td>
            <td>3178</td>
            <td>23</td>
            <td>3201</td>
            <td>0.00</td>
            <td>23803.22</td>
            <td>186.76</td>
            <td>23989.98</td>
        </tr>
        <tr>
            <td>4698</td>
            <td>1451</td>
            <td>2015-02-26 06:13:21</td>
            <td>0</td>
            <td>484</td>
            <td>4901</td>
            <td>5385</td>
            <td>0.00</td>
            <td>3625.16</td>
            <td>39796.12</td>
            <td>43421.28</td>
        </tr>
        <tr>
            <td>4942</td>
            <td>1701</td>
            <td>2015-09-24 21:02:25</td>
            <td>0</td>
            <td>10744</td>
            <td>95</td>
            <td>10839</td>
            <td>0.00</td>
            <td>80472.56</td>
            <td>771.40</td>
            <td>81243.96</td>
        </tr>
        <tr>
            <td>5032</td>
            <td>1831</td>
            <td>2016-05-26 17:48:19</td>
            <td>0</td>
            <td>1448</td>
            <td>287</td>
            <td>1735</td>
            <td>0.00</td>
            <td>10845.52</td>
            <td>2330.44</td>
            <td>13175.96</td>
        </tr>
        <tr>
            <td>5191</td>
            <td>2051</td>
            <td>2015-05-17 14:17:59</td>
            <td>0</td>
            <td>1041</td>
            <td>0</td>
            <td>1041</td>
            <td>0.00</td>
            <td>7797.09</td>
            <td>0.00</td>
            <td>7797.09</td>
        </tr>
        <tr>
            <td>5791</td>
            <td>2861</td>
            <td>2014-10-24 12:06:22</td>
            <td>0</td>
            <td>10</td>
            <td>11691</td>
            <td>11701</td>
            <td>0.00</td>
            <td>74.90</td>
            <td>94930.92</td>
            <td>95005.82</td>
        </tr>
    </tbody>
</table>



Find all the company names that start with a 'C' or 'W', and the primary contact contains 'ana' or 'Ana', but it doesn't contain 'eana'.


```python
%%sql
SELECT *
FROM accounts
WHERE (name LIKE 'C%' OR name LIKE 'W%')
      AND ((primary_poc LIKE '%ana%' OR primary_poc LIKE '%Ana%')
      AND primary_poc NOT LIKE '%eana%');
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
            <th>website</th>
            <th>lat</th>
            <th>long</th>
            <th>primary_poc</th>
            <th>sales_rep_id</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1061</td>
            <td>CVS Health</td>
            <td>www.cvshealth.com</td>
            <td>41.46779585</td>
            <td>-73.76763638</td>
            <td>Anabel Haskell</td>
            <td>321560</td>
        </tr>
        <tr>
            <td>1361</td>
            <td>Comcast</td>
            <td>www.comcastcorporation.com</td>
            <td>42.54154764</td>
            <td>-76.24992387</td>
            <td>Shana Sanborn</td>
            <td>321650</td>
        </tr>
    </tbody>
</table>



## SQL Joins

We use ON clause to specify a JOIN condition which is a logical statement to combine the table in FROM and JOIN statements.


```python
%%sql
SELECT *
FROM orders
JOIN accounts
ON orders.account_id = accounts.id
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>standard_qty</th>
            <th>gloss_qty</th>
            <th>poster_qty</th>
            <th>total</th>
            <th>standard_amt_usd</th>
            <th>gloss_amt_usd</th>
            <th>poster_amt_usd</th>
            <th>total_amt_usd</th>
            <th>id_1</th>
            <th>name</th>
            <th>website</th>
            <th>lat</th>
            <th>long</th>
            <th>primary_poc</th>
            <th>sales_rep_id</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>2</td>
            <td>1001</td>
            <td>2015-11-05 03:34:33</td>
            <td>190</td>
            <td>41</td>
            <td>57</td>
            <td>288</td>
            <td>948.10</td>
            <td>307.09</td>
            <td>462.84</td>
            <td>1718.03</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>3</td>
            <td>1001</td>
            <td>2015-12-04 04:21:55</td>
            <td>85</td>
            <td>47</td>
            <td>0</td>
            <td>132</td>
            <td>424.15</td>
            <td>352.03</td>
            <td>0.00</td>
            <td>776.18</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>4</td>
            <td>1001</td>
            <td>2016-01-02 01:18:24</td>
            <td>144</td>
            <td>32</td>
            <td>0</td>
            <td>176</td>
            <td>718.56</td>
            <td>239.68</td>
            <td>0.00</td>
            <td>958.24</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>5</td>
            <td>1001</td>
            <td>2016-02-01 19:27:27</td>
            <td>108</td>
            <td>29</td>
            <td>28</td>
            <td>165</td>
            <td>538.92</td>
            <td>217.21</td>
            <td>227.36</td>
            <td>983.49</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>6</td>
            <td>1001</td>
            <td>2016-03-02 15:29:32</td>
            <td>103</td>
            <td>24</td>
            <td>46</td>
            <td>173</td>
            <td>513.97</td>
            <td>179.76</td>
            <td>373.52</td>
            <td>1067.25</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>7</td>
            <td>1001</td>
            <td>2016-04-01 11:20:18</td>
            <td>101</td>
            <td>33</td>
            <td>92</td>
            <td>226</td>
            <td>503.99</td>
            <td>247.17</td>
            <td>747.04</td>
            <td>1498.20</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>8</td>
            <td>1001</td>
            <td>2016-05-01 15:55:51</td>
            <td>95</td>
            <td>47</td>
            <td>151</td>
            <td>293</td>
            <td>474.05</td>
            <td>352.03</td>
            <td>1226.12</td>
            <td>2052.20</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>9</td>
            <td>1001</td>
            <td>2016-05-31 21:22:48</td>
            <td>91</td>
            <td>16</td>
            <td>22</td>
            <td>129</td>
            <td>454.09</td>
            <td>119.84</td>
            <td>178.64</td>
            <td>752.57</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
        <tr>
            <td>10</td>
            <td>1001</td>
            <td>2016-06-30 12:32:05</td>
            <td>94</td>
            <td>46</td>
            <td>8</td>
            <td>148</td>
            <td>469.06</td>
            <td>344.54</td>
            <td>64.96</td>
            <td>878.56</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
        </tr>
    </tbody>
</table>



As we've learned, the SELECT clause indicates which column(s) of data you'd like to see in the output (For Example, orders.* gives us all the columns in orders table in the output). The FROM clause indicates the first table from which we're pulling data, and the JOIN indicates the second table. The ON clause specifies the column on which you'd like to merge the two tables together

Try pulling all the data from the accounts table, and all the data from the orders table.


```python
%%sql
SELECT accounts.*, orders.*
FROM accounts
JOIN orders
ON orders.account_id = accounts.id
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>id</th>
            <th>name</th>
            <th>website</th>
            <th>lat</th>
            <th>long</th>
            <th>primary_poc</th>
            <th>sales_rep_id</th>
            <th>id_1</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>standard_qty</th>
            <th>gloss_qty</th>
            <th>poster_qty</th>
            <th>total</th>
            <th>standard_amt_usd</th>
            <th>gloss_amt_usd</th>
            <th>poster_amt_usd</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>2</td>
            <td>1001</td>
            <td>2015-11-05 03:34:33</td>
            <td>190</td>
            <td>41</td>
            <td>57</td>
            <td>288</td>
            <td>948.10</td>
            <td>307.09</td>
            <td>462.84</td>
            <td>1718.03</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>3</td>
            <td>1001</td>
            <td>2015-12-04 04:21:55</td>
            <td>85</td>
            <td>47</td>
            <td>0</td>
            <td>132</td>
            <td>424.15</td>
            <td>352.03</td>
            <td>0.00</td>
            <td>776.18</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>4</td>
            <td>1001</td>
            <td>2016-01-02 01:18:24</td>
            <td>144</td>
            <td>32</td>
            <td>0</td>
            <td>176</td>
            <td>718.56</td>
            <td>239.68</td>
            <td>0.00</td>
            <td>958.24</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>5</td>
            <td>1001</td>
            <td>2016-02-01 19:27:27</td>
            <td>108</td>
            <td>29</td>
            <td>28</td>
            <td>165</td>
            <td>538.92</td>
            <td>217.21</td>
            <td>227.36</td>
            <td>983.49</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>6</td>
            <td>1001</td>
            <td>2016-03-02 15:29:32</td>
            <td>103</td>
            <td>24</td>
            <td>46</td>
            <td>173</td>
            <td>513.97</td>
            <td>179.76</td>
            <td>373.52</td>
            <td>1067.25</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>7</td>
            <td>1001</td>
            <td>2016-04-01 11:20:18</td>
            <td>101</td>
            <td>33</td>
            <td>92</td>
            <td>226</td>
            <td>503.99</td>
            <td>247.17</td>
            <td>747.04</td>
            <td>1498.20</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>8</td>
            <td>1001</td>
            <td>2016-05-01 15:55:51</td>
            <td>95</td>
            <td>47</td>
            <td>151</td>
            <td>293</td>
            <td>474.05</td>
            <td>352.03</td>
            <td>1226.12</td>
            <td>2052.20</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>9</td>
            <td>1001</td>
            <td>2016-05-31 21:22:48</td>
            <td>91</td>
            <td>16</td>
            <td>22</td>
            <td>129</td>
            <td>454.09</td>
            <td>119.84</td>
            <td>178.64</td>
            <td>752.57</td>
        </tr>
        <tr>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>10</td>
            <td>1001</td>
            <td>2016-06-30 12:32:05</td>
            <td>94</td>
            <td>46</td>
            <td>8</td>
            <td>148</td>
            <td>469.06</td>
            <td>344.54</td>
            <td>64.96</td>
            <td>878.56</td>
        </tr>
    </tbody>
</table>



Try pulling standard_qty, gloss_qty, and poster_qty from the orders table, and the website and the primary_poc from the accounts table.


```python
%%sql
SELECT accounts.website, accounts.primary_poc, orders.standard_qty, orders.gloss_qty, orders.poster_qty
FROM accounts
JOIN orders
ON orders.account_id = accounts.id
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>website</th>
            <th>primary_poc</th>
            <th>standard_qty</th>
            <th>gloss_qty</th>
            <th>poster_qty</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>190</td>
            <td>41</td>
            <td>57</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>85</td>
            <td>47</td>
            <td>0</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>144</td>
            <td>32</td>
            <td>0</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>108</td>
            <td>29</td>
            <td>28</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>103</td>
            <td>24</td>
            <td>46</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>101</td>
            <td>33</td>
            <td>92</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>95</td>
            <td>47</td>
            <td>151</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>91</td>
            <td>16</td>
            <td>22</td>
        </tr>
        <tr>
            <td>www.walmart.com</td>
            <td>Tamara Tuma</td>
            <td>94</td>
            <td>46</td>
            <td>8</td>
        </tr>
    </tbody>
</table>



Join all three of these tables - web_events, orders and accounts.


```python
%%sql
SELECT *
FROM web_events
JOIN accounts
ON web_events.account_id = accounts.id
JOIN orders
ON accounts.id = orders.account_id
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>occurred_at</th>
            <th>channel</th>
            <th>id_1</th>
            <th>name</th>
            <th>website</th>
            <th>lat</th>
            <th>long</th>
            <th>primary_poc</th>
            <th>sales_rep_id</th>
            <th>id_2</th>
            <th>account_id_1</th>
            <th>occurred_at_1</th>
            <th>standard_qty</th>
            <th>gloss_qty</th>
            <th>poster_qty</th>
            <th>total</th>
            <th>standard_amt_usd</th>
            <th>gloss_amt_usd</th>
            <th>poster_amt_usd</th>
            <th>total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:13:58</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>2</td>
            <td>1001</td>
            <td>2015-11-05 03:08:26</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>3</td>
            <td>1001</td>
            <td>2015-12-04 03:57:24</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>4</td>
            <td>1001</td>
            <td>2016-01-02 00:55:03</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>5</td>
            <td>1001</td>
            <td>2016-02-01 19:02:33</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>6</td>
            <td>1001</td>
            <td>2016-03-02 15:15:22</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>7</td>
            <td>1001</td>
            <td>2016-04-01 10:58:55</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>8</td>
            <td>1001</td>
            <td>2016-05-01 15:26:44</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>9</td>
            <td>1001</td>
            <td>2016-05-31 20:53:47</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
        <tr>
            <td>10</td>
            <td>1001</td>
            <td>2016-06-30 12:09:45</td>
            <td>direct</td>
            <td>1001</td>
            <td>Walmart</td>
            <td>www.walmart.com</td>
            <td>40.23849561</td>
            <td>-75.10329704</td>
            <td>Tamara Tuma</td>
            <td>321500</td>
            <td>1</td>
            <td>1001</td>
            <td>2015-10-06 17:31:14</td>
            <td>123</td>
            <td>22</td>
            <td>24</td>
            <td>169</td>
            <td>613.77</td>
            <td>164.78</td>
            <td>194.88</td>
            <td>973.43</td>
        </tr>
    </tbody>
</table>



Provide a table that provides the region for each sales_rep along with their associated accounts.
This time only for the Midwest region. Your final table should include three columns:
the region name, the sales rep name, and the account name. Sort the accounts alphabetically (A-Z) according to account name.


```python
%%sql
SELECT r.name region, s.name rep, a.name account
FROM sales_reps AS s
JOIN region AS r
ON s.region_id = r.id
JOIN accounts AS a
ON s.id = a.sales_rep_id
WHERE r.name = 'Midwest'
ORDER BY a.name ASC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>region</th>
            <th>rep</th>
            <th>account</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Midwest</td>
            <td>Chau Rowles</td>
            <td>Abbott Laboratories</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Julie Starr</td>
            <td>AbbVie</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Cliff Meints</td>
            <td>Aflac</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Chau Rowles</td>
            <td>Alcoa</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Charles Bidwell</td>
            <td>Altria Group</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Delilah Krum</td>
            <td>Amgen</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Charles Bidwell</td>
            <td>Arrow Electronics</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Delilah Krum</td>
            <td>AutoNation</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Delilah Krum</td>
            <td>Capital One Financial</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Cordell Rieder</td>
            <td>Centene</td>
        </tr>
    </tbody>
</table>



Provide a table that provides the region for each sales_rep along with their associated accounts.
This time only for accounts where the sales rep has a first name starting with S and in the Midwest region.
Your final table should include three columns: the region name, the sales rep name, and the account name.
Sort the accounts alphabetically (A-Z) according to account name.


```python
%%sql
SELECT r.name region, s.name rep, a.name account
FROM sales_reps AS s
JOIN region AS r
ON s.region_id = r.id
JOIN accounts AS a
ON s.id = a.sales_rep_id
WHERE s.name LIKE 'S%'
AND r.name = 'Midwest'
ORDER BY a.name ASC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>region</th>
            <th>rep</th>
            <th>account</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Midwest</td>
            <td>Sherlene Wetherington</td>
            <td>Community Health Systems</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Sherlene Wetherington</td>
            <td>Progressive</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Sherlene Wetherington</td>
            <td>Rite Aid</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Sherlene Wetherington</td>
            <td>Time Warner Cable</td>
        </tr>
        <tr>
            <td>Midwest</td>
            <td>Sherlene Wetherington</td>
            <td>U.S. Bancorp</td>
        </tr>
    </tbody>
</table>



Provide a table that provides the region for each sales_rep along with their associated accounts.
This time only for accounts where the sales rep has a last name starting with K and in the Midwest region.
Your final table should include three columns: the region name, the sales rep name, and the account name.
Sort the accounts alphabetically (A-Z) according to account name.


```python
%%sql
SELECT r.name region, s.name rep, a.name account
FROM region r
JOIN sales_reps s
ON r.id = s.region_id
JOIN accounts a
ON r.id = a.sales_rep_id
WHERE s.name LIKE 'K%'
AND r.name = 'Midwest'
ORDER BY a.name
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>region</th>
            <th>rep</th>
            <th>account</th>
        </tr>
    </thead>
    <tbody>
    </tbody>
</table>



## SQL Aggregations

If the COUNT result of a column is less than the number of rows in the table, we know that difference is the number of NULLs.


```python
%sql SELECT COUNT(*) AS account_count FROM accounts;
```





<table>
    <thead>
        <tr>
            <th>account_count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>351</td>
        </tr>
    </tbody>
</table>




```python
%sql SELECT COUNT(id) AS account_id_count FROM accounts;
```





<table>
    <thead>
        <tr>
            <th>account_id_count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>351</td>
        </tr>
    </tbody>
</table>



Unlike COUNT, you can only use SUM on numeric columns. However, SUM will ignore NULL values, as do the other aggregation functions.


```python
%%sql
SELECT SUM(standard_qty) AS standard,
      SUM(gloss_qty) AS gloss,
      SUM(poster_qty) AS poster
FROM orders;
```





<table>
    <thead>
        <tr>
            <th>standard</th>
            <th>gloss</th>
            <th>poster</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1938346</td>
            <td>1013773</td>
            <td>723646</td>
        </tr>
    </tbody>
</table>



Find the total amount spent on standard_amt_usd and gloss_amt_usd paper for each order in the orders table.
This should give a dollar amount for each order in the table.


```python
%%sql
SELECT SUM(standard_amt_usd) + SUM(gloss_amt_usd) AS total_usd
FROM orders
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>total_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>17265506.31</td>
        </tr>
    </tbody>
</table>



Find the standard_amt_usd per unit of standard_qty paper.
Your solution should use both an aggregation and a mathematical operator.


```python
%%sql
SELECT SUM(standard_amt_usd)/SUM(standard_qty) AS standard_price_per_unit
FROM orders
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>standard_price_per_unit</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4.9900000000000000</td>
        </tr>
    </tbody>
</table>



Functionally, MIN and MAX are similar to COUNT in that they can be used on non-numerical columns.
Depending on the column type, MIN will return the lowest number, earliest date, or non-numerical value as early in the alphabet as possible.
As you might suspect, MAX does the opposite—it returns the highest number, the latest date, or the non-numerical value closest alphabetically to “Z.”


```python
%%sql
SELECT MIN(standard_qty) AS standard_min,
    MAX(standard_qty) AS standard_max
FROM orders
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>standard_min</th>
            <th>standard_max</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0</td>
            <td>22591</td>
        </tr>
    </tbody>
</table>



## Working with CASE statements


```python
%%sql
SELECT
  o.id AS order_id,
  a.id AS account_id,
  SUM(o.total_amt_usd) AS total_sales,
  CASE
    WHEN SUM(o.total_amt_usd) >= 3000 THEN 'Large'
    ELSE 'Small'
  END AS order_size
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY 1,
         2
ORDER BY 3 DESC, 1, 2
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>order_id</th>
            <th>account_id</th>
            <th>total_sales</th>
            <th>order_size</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4016</td>
            <td>4251</td>
            <td>232207.07</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>3892</td>
            <td>4161</td>
            <td>112875.18</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>3963</td>
            <td>4211</td>
            <td>107533.55</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>5791</td>
            <td>2861</td>
            <td>95005.82</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>3778</td>
            <td>4101</td>
            <td>93547.84</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>6590</td>
            <td>4111</td>
            <td>93505.69</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>362</td>
            <td>1301</td>
            <td>93106.81</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>731</td>
            <td>1521</td>
            <td>92991.05</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>4562</td>
            <td>1341</td>
            <td>84099.62</td>
            <td>Large</td>
        </tr>
        <tr>
            <td>3858</td>
            <td>4151</td>
            <td>82163.71</td>
            <td>Large</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  CASE
    WHEN total > 2000 THEN 'At Least 2000'
    WHEN total BETWEEN 1000 AND 2000 THEN 'Between 1000 and 2000'
    ELSE 'Less than 1000'
  END AS order_size,
  COUNT(*) AS count
FROM orders
GROUP BY 1
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>order_size</th>
            <th>count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Between 1000 and 2000</td>
            <td>511</td>
        </tr>
        <tr>
            <td>Less than 1000</td>
            <td>6331</td>
        </tr>
        <tr>
            <td>At Least 2000</td>
            <td>70</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name,
  SUM(o.total_amt_usd) total_sales,
  CASE
    WHEN SUM(o.total_amt_usd) > 200000 THEN '200,000+'
    WHEN SUM(o.total_amt_usd) BETWEEN 100000 AND 200000 THEN 'Between 100,000 and 200,000'
    ELSE 'Under 100,000'
  END AS group_level
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>total_sales</th>
            <th>group_level</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>EOG Resources</td>
            <td>382873.30</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>Mosaic</td>
            <td>345618.59</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>IBM</td>
            <td>326819.48</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>General Dynamics</td>
            <td>300694.79</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>Republic Services</td>
            <td>293861.14</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>Leucadia National</td>
            <td>291047.25</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>Arrow Electronics</td>
            <td>281018.36</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>Sysco</td>
            <td>278575.64</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>Supervalu</td>
            <td>275288.30</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>Archer Daniels Midland</td>
            <td>272672.84</td>
            <td>200,000+</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name,
  SUM(o.total_amt_usd) total_sales,
  CASE
    WHEN SUM(o.total_amt_usd) > 200000 THEN '200,000+'
    WHEN SUM(o.total_amt_usd) BETWEEN 100000 AND 200000 THEN 'Between 100,000 and 200,000'
    ELSE 'Under 100,000'
  END AS group_level
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
WHERE date_part('year', o.occurred_at) IN (2016, 2017)
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>total_sales</th>
            <th>group_level</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Pacific Life</td>
            <td>255319.18</td>
            <td>200,000+</td>
        </tr>
        <tr>
            <td>Mosaic</td>
            <td>172180.04</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
        <tr>
            <td>CHS</td>
            <td>163471.78</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
        <tr>
            <td>Core-Mark Holding</td>
            <td>148105.93</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
        <tr>
            <td>Disney</td>
            <td>129157.38</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
        <tr>
            <td>National Oilwell Varco</td>
            <td>121873.16</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
        <tr>
            <td>Sears Holdings</td>
            <td>114003.21</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
        <tr>
            <td>State Farm Insurance Cos.</td>
            <td>111810.55</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
        <tr>
            <td>Fidelity National Financial</td>
            <td>110027.29</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
        <tr>
            <td>BB&amp;T Corp.</td>
            <td>107300.05</td>
            <td>Between 100,000 and 200,000</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  s.name AS rep_name,
  COUNT(o.id) AS order_count,
  CASE
    WHEN COUNT(o.id) > 200 THEN 'Top'
    ELSE 'Not'
  END AS rep_level
FROM sales_reps s
JOIN accounts a
  ON s.id = a.sales_rep_id
JOIN orders o
  ON a.id = o.account_id
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>rep_name</th>
            <th>order_count</th>
            <th>rep_level</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Earlie Schleusner</td>
            <td>335</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Vernita Plump</td>
            <td>299</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Tia Amato</td>
            <td>267</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Georgianna Chisholm</td>
            <td>256</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Moon Torian</td>
            <td>250</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Nelle Meaux</td>
            <td>241</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Maren Musto</td>
            <td>224</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Dorotha Seawell</td>
            <td>208</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Charles Bidwell</td>
            <td>205</td>
            <td>Top</td>
        </tr>
        <tr>
            <td>Maryanna Fiorentino</td>
            <td>204</td>
            <td>Top</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  s.name AS rep_name,
  COUNT(o.id) AS order_count,
  SUM(o.total_amt_usd) AS total_sales,
  CASE
    WHEN COUNT(o.id) > 200 OR
      SUM(o.total_amt_usd) > 750000 THEN 'top'
    WHEN COUNT(o.id) > 150 OR
      SUM(o.total_amt_usd) > 500000 THEN 'middle'
    ELSE 'Low'
  END AS rep_level
FROM sales_reps s
JOIN accounts a
  ON s.id = a.sales_rep_id
JOIN orders o
  ON a.id = o.account_id
GROUP BY 1
ORDER BY 3 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>rep_name</th>
            <th>order_count</th>
            <th>total_sales</th>
            <th>rep_level</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Earlie Schleusner</td>
            <td>335</td>
            <td>1098137.72</td>
            <td>top</td>
        </tr>
        <tr>
            <td>Tia Amato</td>
            <td>267</td>
            <td>1010690.60</td>
            <td>top</td>
        </tr>
        <tr>
            <td>Vernita Plump</td>
            <td>299</td>
            <td>934212.93</td>
            <td>top</td>
        </tr>
        <tr>
            <td>Georgianna Chisholm</td>
            <td>256</td>
            <td>886244.12</td>
            <td>top</td>
        </tr>
        <tr>
            <td>Arica Stoltzfus</td>
            <td>186</td>
            <td>810353.34</td>
            <td>top</td>
        </tr>
        <tr>
            <td>Dorotha Seawell</td>
            <td>208</td>
            <td>766935.04</td>
            <td>top</td>
        </tr>
        <tr>
            <td>Nelle Meaux</td>
            <td>241</td>
            <td>749076.16</td>
            <td>top</td>
        </tr>
        <tr>
            <td>Sibyl Lauria</td>
            <td>193</td>
            <td>722084.27</td>
            <td>middle</td>
        </tr>
        <tr>
            <td>Maren Musto</td>
            <td>224</td>
            <td>702697.29</td>
            <td>top</td>
        </tr>
        <tr>
            <td>Brandie Riva</td>
            <td>167</td>
            <td>675917.64</td>
            <td>middle</td>
        </tr>
    </tbody>
</table>



## Working with Dates


```python
%%sql
SELECT
  date_part('year', occurred_at) AS sales_year,
  SUM(total_amt_usd) AS total_sales
FROM orders o
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>sales_year</th>
            <th>total_sales</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2016.0</td>
            <td>12864917.92</td>
        </tr>
        <tr>
            <td>2015.0</td>
            <td>5752004.94</td>
        </tr>
        <tr>
            <td>2014.0</td>
            <td>4069106.54</td>
        </tr>
        <tr>
            <td>2013.0</td>
            <td>377331.00</td>
        </tr>
        <tr>
            <td>2017.0</td>
            <td>78151.43</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  date_part('month', occurred_at) AS sales_month,
  SUM(total_amt_usd) AS total_sales
FROM orders o
GROUP BY 1
ORDER BY 2
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>sales_month</th>
            <th>total_sales</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2.0</td>
            <td>1312616.64</td>
        </tr>
        <tr>
            <td>1.0</td>
            <td>1337661.87</td>
        </tr>
        <tr>
            <td>5.0</td>
            <td>1537082.23</td>
        </tr>
        <tr>
            <td>4.0</td>
            <td>1562037.74</td>
        </tr>
        <tr>
            <td>3.0</td>
            <td>1659987.88</td>
        </tr>
        <tr>
            <td>6.0</td>
            <td>1871118.52</td>
        </tr>
        <tr>
            <td>8.0</td>
            <td>1918107.22</td>
        </tr>
        <tr>
            <td>7.0</td>
            <td>1978731.15</td>
        </tr>
        <tr>
            <td>9.0</td>
            <td>2017216.88</td>
        </tr>
        <tr>
            <td>11.0</td>
            <td>2390033.75</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  date_part('year', occurred_at) AS sales_year,
  SUM(total_amt_usd) AS total_sales
FROM orders o
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>sales_year</th>
            <th>total_sales</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2016.0</td>
            <td>12864917.92</td>
        </tr>
        <tr>
            <td>2015.0</td>
            <td>5752004.94</td>
        </tr>
        <tr>
            <td>2014.0</td>
            <td>4069106.54</td>
        </tr>
        <tr>
            <td>2013.0</td>
            <td>377331.00</td>
        </tr>
        <tr>
            <td>2017.0</td>
            <td>78151.43</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  date_part('month', occurred_at) AS sales_month,
  COUNT(o.id) AS total_orders
FROM orders o
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>sales_month</th>
            <th>total_orders</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>12.0</td>
            <td>882</td>
        </tr>
        <tr>
            <td>11.0</td>
            <td>713</td>
        </tr>
        <tr>
            <td>10.0</td>
            <td>675</td>
        </tr>
        <tr>
            <td>8.0</td>
            <td>603</td>
        </tr>
        <tr>
            <td>9.0</td>
            <td>602</td>
        </tr>
        <tr>
            <td>7.0</td>
            <td>571</td>
        </tr>
        <tr>
            <td>6.0</td>
            <td>527</td>
        </tr>
        <tr>
            <td>5.0</td>
            <td>518</td>
        </tr>
        <tr>
            <td>3.0</td>
            <td>482</td>
        </tr>
        <tr>
            <td>4.0</td>
            <td>472</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name,
  date_part('year', occurred_at) AS _year,
  date_part('month', occurred_at) AS _month,
  SUM(o.gloss_amt_usd) AS total_gloss_saless
FROM orders o
JOIN accounts a
  ON a.id = o.account_id
WHERE a.name = 'Walmart'
GROUP BY 1,
         2,
         3
ORDER BY total_gloss_saless DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>_year</th>
            <th>_month</th>
            <th>total_gloss_saless</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Walmart</td>
            <td>2016.0</td>
            <td>5.0</td>
            <td>9257.64</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2016.0</td>
            <td>1.0</td>
            <td>5070.73</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2015.0</td>
            <td>11.0</td>
            <td>4890.97</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2016.0</td>
            <td>4.0</td>
            <td>4875.99</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2015.0</td>
            <td>12.0</td>
            <td>4823.56</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2016.0</td>
            <td>3.0</td>
            <td>4711.21</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2016.0</td>
            <td>9.0</td>
            <td>4673.76</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2016.0</td>
            <td>2.0</td>
            <td>4673.76</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2016.0</td>
            <td>8.0</td>
            <td>4531.45</td>
        </tr>
        <tr>
            <td>Walmart</td>
            <td>2016.0</td>
            <td>11.0</td>
            <td>4359.18</td>
        </tr>
    </tbody>
</table>



## HAVING clause


```python
%%sql
SELECT
  s.name,
  COUNT(*) num_accts
FROM sales_reps s
JOIN accounts a
  ON s.id = a.sales_rep_id
GROUP BY 1
HAVING COUNT(*) > 5
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>num_accts</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Samuel Racine</td>
            <td>6</td>
        </tr>
        <tr>
            <td>Elwood Shutt</td>
            <td>9</td>
        </tr>
        <tr>
            <td>Michel Averette</td>
            <td>7</td>
        </tr>
        <tr>
            <td>Brandie Riva</td>
            <td>10</td>
        </tr>
        <tr>
            <td>Elba Felder</td>
            <td>6</td>
        </tr>
        <tr>
            <td>Nelle Meaux</td>
            <td>7</td>
        </tr>
        <tr>
            <td>Necole Victory</td>
            <td>6</td>
        </tr>
        <tr>
            <td>Saran Ram</td>
            <td>10</td>
        </tr>
        <tr>
            <td>Moon Torian</td>
            <td>10</td>
        </tr>
        <tr>
            <td>Sibyl Lauria</td>
            <td>6</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  COUNT(o.id) AS order_id
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY account_name
HAVING COUNT(o.id) > 20
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>order_id</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Monsanto</td>
            <td>57</td>
        </tr>
        <tr>
            <td>KKR</td>
            <td>55</td>
        </tr>
        <tr>
            <td>Performance Food Group</td>
            <td>21</td>
        </tr>
        <tr>
            <td>Paccar</td>
            <td>46</td>
        </tr>
        <tr>
            <td>CST Brands</td>
            <td>49</td>
        </tr>
        <tr>
            <td>Reynolds American</td>
            <td>23</td>
        </tr>
        <tr>
            <td>Sears Holdings</td>
            <td>30</td>
        </tr>
        <tr>
            <td>Aetna</td>
            <td>51</td>
        </tr>
        <tr>
            <td>Gilead Sciences</td>
            <td>27</td>
        </tr>
        <tr>
            <td>Altria Group</td>
            <td>51</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  COUNT(o.id) AS order_id
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY account_name
HAVING COUNT(o.id) > 20
ORDER BY order_id DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>order_id</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Leucadia National</td>
            <td>71</td>
        </tr>
        <tr>
            <td>Supervalu</td>
            <td>68</td>
        </tr>
        <tr>
            <td>Sysco</td>
            <td>68</td>
        </tr>
        <tr>
            <td>Arrow Electronics</td>
            <td>67</td>
        </tr>
        <tr>
            <td>Mosaic</td>
            <td>66</td>
        </tr>
        <tr>
            <td>Archer Daniels Midland</td>
            <td>66</td>
        </tr>
        <tr>
            <td>General Dynamics</td>
            <td>66</td>
        </tr>
        <tr>
            <td>Fluor</td>
            <td>65</td>
        </tr>
        <tr>
            <td>Western Digital</td>
            <td>65</td>
        </tr>
        <tr>
            <td>Philip Morris International</td>
            <td>65</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  SUM(o.total_amt_usd) total_usd
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY a.name
HAVING SUM(o.total_amt_usd) > 30000
ORDER BY total_usd DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>total_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>EOG Resources</td>
            <td>382873.30</td>
        </tr>
        <tr>
            <td>Mosaic</td>
            <td>345618.59</td>
        </tr>
        <tr>
            <td>IBM</td>
            <td>326819.48</td>
        </tr>
        <tr>
            <td>General Dynamics</td>
            <td>300694.79</td>
        </tr>
        <tr>
            <td>Republic Services</td>
            <td>293861.14</td>
        </tr>
        <tr>
            <td>Leucadia National</td>
            <td>291047.25</td>
        </tr>
        <tr>
            <td>Arrow Electronics</td>
            <td>281018.36</td>
        </tr>
        <tr>
            <td>Sysco</td>
            <td>278575.64</td>
        </tr>
        <tr>
            <td>Supervalu</td>
            <td>275288.30</td>
        </tr>
        <tr>
            <td>Archer Daniels Midland</td>
            <td>272672.84</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  SUM(o.total_amt_usd) total_usd
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY a.name
HAVING SUM(o.total_amt_usd) < 10000
ORDER BY total_usd DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>total_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>General Motors</td>
            <td>9995.05</td>
        </tr>
        <tr>
            <td>AIG</td>
            <td>9980.93</td>
        </tr>
        <tr>
            <td>O&#x27;Reilly Automotive</td>
            <td>9914.23</td>
        </tr>
        <tr>
            <td>WellCare Health Plans</td>
            <td>9743.13</td>
        </tr>
        <tr>
            <td>CBRE Group</td>
            <td>9715.71</td>
        </tr>
        <tr>
            <td>Newmont Mining</td>
            <td>9618.81</td>
        </tr>
        <tr>
            <td>Macy&#x27;s</td>
            <td>9613.32</td>
        </tr>
        <tr>
            <td>Devon Energy</td>
            <td>9536.55</td>
        </tr>
        <tr>
            <td>Eli Lilly</td>
            <td>9339.20</td>
        </tr>
        <tr>
            <td>Xerox</td>
            <td>8759.93</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  SUM(o.total_amt_usd) total_usd
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY a.name
ORDER BY total_usd DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>total_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>EOG Resources</td>
            <td>382873.30</td>
        </tr>
        <tr>
            <td>Mosaic</td>
            <td>345618.59</td>
        </tr>
        <tr>
            <td>IBM</td>
            <td>326819.48</td>
        </tr>
        <tr>
            <td>General Dynamics</td>
            <td>300694.79</td>
        </tr>
        <tr>
            <td>Republic Services</td>
            <td>293861.14</td>
        </tr>
        <tr>
            <td>Leucadia National</td>
            <td>291047.25</td>
        </tr>
        <tr>
            <td>Arrow Electronics</td>
            <td>281018.36</td>
        </tr>
        <tr>
            <td>Sysco</td>
            <td>278575.64</td>
        </tr>
        <tr>
            <td>Supervalu</td>
            <td>275288.30</td>
        </tr>
        <tr>
            <td>Archer Daniels Midland</td>
            <td>272672.84</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  SUM(o.total_amt_usd) total_usd
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY a.name
ORDER BY total_usd ASC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>total_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Nike</td>
            <td>390.25</td>
        </tr>
        <tr>
            <td>Delta Air Lines</td>
            <td>859.64</td>
        </tr>
        <tr>
            <td>Level 3 Communications</td>
            <td>881.73</td>
        </tr>
        <tr>
            <td>Deere</td>
            <td>1036.57</td>
        </tr>
        <tr>
            <td>Bed Bath &amp; Beyond</td>
            <td>1069.64</td>
        </tr>
        <tr>
            <td>Las Vegas Sands</td>
            <td>1113.29</td>
        </tr>
        <tr>
            <td>Assurant</td>
            <td>1235.81</td>
        </tr>
        <tr>
            <td>Ball</td>
            <td>1982.74</td>
        </tr>
        <tr>
            <td>Priceline Group</td>
            <td>2129.24</td>
        </tr>
        <tr>
            <td>Bank of New York Mellon Corp.</td>
            <td>2155.98</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  w.channel,
  COUNT(w.channel) channel_cnt
FROM accounts a
JOIN web_events w
  ON a.id = w.account_id
WHERE w.channel = 'facebook'
GROUP BY a.name,
         w.channel
HAVING COUNT(w.channel) > 6
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>channel</th>
            <th>channel_cnt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>FirstEnergy</td>
            <td>facebook</td>
            <td>10</td>
        </tr>
        <tr>
            <td>Aetna</td>
            <td>facebook</td>
            <td>10</td>
        </tr>
        <tr>
            <td>Fluor</td>
            <td>facebook</td>
            <td>8</td>
        </tr>
        <tr>
            <td>Cisco Systems</td>
            <td>facebook</td>
            <td>8</td>
        </tr>
        <tr>
            <td>Lithia Motors</td>
            <td>facebook</td>
            <td>10</td>
        </tr>
        <tr>
            <td>General Mills</td>
            <td>facebook</td>
            <td>9</td>
        </tr>
        <tr>
            <td>Wells Fargo</td>
            <td>facebook</td>
            <td>7</td>
        </tr>
        <tr>
            <td>PayPal Holdings</td>
            <td>facebook</td>
            <td>8</td>
        </tr>
        <tr>
            <td>United Continental Holdings</td>
            <td>facebook</td>
            <td>11</td>
        </tr>
        <tr>
            <td>Laboratory Corp. of America</td>
            <td>facebook</td>
            <td>7</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  w.channel,
  COUNT(w.channel) channel_cnt
FROM accounts a
JOIN web_events w
  ON a.id = w.account_id
WHERE w.channel = 'facebook'
GROUP BY a.name,
         w.channel
ORDER BY channel_cnt DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>channel</th>
            <th>channel_cnt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Gilead Sciences</td>
            <td>facebook</td>
            <td>16</td>
        </tr>
        <tr>
            <td>TJX</td>
            <td>facebook</td>
            <td>15</td>
        </tr>
        <tr>
            <td>AutoNation</td>
            <td>facebook</td>
            <td>14</td>
        </tr>
        <tr>
            <td>Charter Communications</td>
            <td>facebook</td>
            <td>13</td>
        </tr>
        <tr>
            <td>Disney</td>
            <td>facebook</td>
            <td>12</td>
        </tr>
        <tr>
            <td>Marathon Petroleum</td>
            <td>facebook</td>
            <td>12</td>
        </tr>
        <tr>
            <td>Philip Morris International</td>
            <td>facebook</td>
            <td>12</td>
        </tr>
        <tr>
            <td>United Continental Holdings</td>
            <td>facebook</td>
            <td>11</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>facebook</td>
            <td>11</td>
        </tr>
        <tr>
            <td>Ecolab</td>
            <td>facebook</td>
            <td>11</td>
        </tr>
    </tbody>
</table>




```python
%%sql
SELECT
  a.name AS account_name,
  w.channel AS channel_name,
  COUNT(w.channel) channel_cnt
FROM accounts a
JOIN web_events w
  ON a.id = w.account_id
GROUP BY a.name,
         w.channel
ORDER BY channel_cnt DESC, channel_name, account_name
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>account_name</th>
            <th>channel_name</th>
            <th>channel_cnt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Leucadia National</td>
            <td>direct</td>
            <td>52</td>
        </tr>
        <tr>
            <td>Colgate-Palmolive</td>
            <td>direct</td>
            <td>51</td>
        </tr>
        <tr>
            <td>New York Life Insurance</td>
            <td>direct</td>
            <td>51</td>
        </tr>
        <tr>
            <td>Philip Morris International</td>
            <td>direct</td>
            <td>49</td>
        </tr>
        <tr>
            <td>ADP</td>
            <td>direct</td>
            <td>48</td>
        </tr>
        <tr>
            <td>AutoNation</td>
            <td>direct</td>
            <td>48</td>
        </tr>
        <tr>
            <td>BlackRock</td>
            <td>direct</td>
            <td>48</td>
        </tr>
        <tr>
            <td>Charter Communications</td>
            <td>direct</td>
            <td>48</td>
        </tr>
        <tr>
            <td>FirstEnergy</td>
            <td>direct</td>
            <td>48</td>
        </tr>
        <tr>
            <td>Altria Group</td>
            <td>direct</td>
            <td>47</td>
        </tr>
    </tbody>
</table>



## CONCAT

Each company in the accounts table wants to create an email address for each primary_poc. The email address should be the first name of the primary_poc . last name primary_poc @ company name .com.


```python
%%sql
SELECT
  concat
  (
  -- first name
  LEFT(a.primary_poc, strpos(a.primary_poc, ' ') - 1),
  '.',
  -- last name
  substr(a.primary_poc, strpos(a.primary_poc, ' ') + 1),
  '@',
  a.name,
  '.com'
  )
FROM accounts a
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>concat</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Tamara.Tuma@Walmart.com</td>
        </tr>
        <tr>
            <td>Sung.Shields@Exxon Mobil.com</td>
        </tr>
        <tr>
            <td>Jodee.Lupo@Apple.com</td>
        </tr>
        <tr>
            <td>Serafina.Banda@Berkshire Hathaway.com</td>
        </tr>
        <tr>
            <td>Angeles.Crusoe@McKesson.com</td>
        </tr>
        <tr>
            <td>Savanna.Gayman@UnitedHealth Group.com</td>
        </tr>
        <tr>
            <td>Anabel.Haskell@CVS Health.com</td>
        </tr>
        <tr>
            <td>Barrie.Omeara@General Motors.com</td>
        </tr>
        <tr>
            <td>Kym.Hagerman@Ford Motor.com</td>
        </tr>
        <tr>
            <td>Jamel.Mosqueda@AT&amp;T.com</td>
        </tr>
    </tbody>
</table>



You may have noticed that in the previous question some of the company names include spaces, which will certainly not work in an email address. See if you can create an email address that will work by removing all of the spaces in the account name, but otherwise your solution should be just as above. Some helpful documentation is here: https://www.postgresql.org/docs/8.1/functions-string.html


```python
%%sql
SELECT
  concat
  (
  -- poc first name
  LEFT(a.primary_poc, strpos(a.primary_poc, ' ') - 1),
  '.',
  -- poc last name
  substr(a.primary_poc, strpos(a.primary_poc, ' ') + 1),
  '@',
  -- company name
  REPLACE(a.name, ' ', ''),
  '.com'
  )
FROM accounts a
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>concat</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Tamara.Tuma@Walmart.com</td>
        </tr>
        <tr>
            <td>Sung.Shields@ExxonMobil.com</td>
        </tr>
        <tr>
            <td>Jodee.Lupo@Apple.com</td>
        </tr>
        <tr>
            <td>Serafina.Banda@BerkshireHathaway.com</td>
        </tr>
        <tr>
            <td>Angeles.Crusoe@McKesson.com</td>
        </tr>
        <tr>
            <td>Savanna.Gayman@UnitedHealthGroup.com</td>
        </tr>
        <tr>
            <td>Anabel.Haskell@CVSHealth.com</td>
        </tr>
        <tr>
            <td>Barrie.Omeara@GeneralMotors.com</td>
        </tr>
        <tr>
            <td>Kym.Hagerman@FordMotor.com</td>
        </tr>
        <tr>
            <td>Jamel.Mosqueda@AT&amp;T.com</td>
        </tr>
    </tbody>
</table>



We would also like to create an initial password, which they will change after their first log in. The first password will be:
- the first letter of the primary_poc's first name (lowercase), then
- the last letter of their first name (lowercase),
- the first letter of their last name (lowercase),
- the last letter of their last name (lowercase),
- the number of letters in their first name,
- the number of letters in their last name, and then
- the name of the company they are working with, all capitalized with no spaces.


```python
%%sql
SELECT
  concat
  (
  LOWER(LEFT(a.primary_poc, 1)),
  LOWER(substr(a.primary_poc, strpos(a.primary_poc, ' ') - 1, 1)),
  LOWER(substr(a.primary_poc, strpos(a.primary_poc, ' ') + 1, 1)),
  LOWER(RIGHT(a.primary_poc, 1)),
  length(substr(a.primary_poc, 1, strpos(a.primary_poc, ' ') - 1)),
  length(substr(a.primary_poc, strpos(a.primary_poc, ' ') + 1)),
  UPPER(REPLACE(a.name, ' ', ''))
  )
FROM accounts a
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>concat</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>tata64WALMART</td>
        </tr>
        <tr>
            <td>sgss47EXXONMOBIL</td>
        </tr>
        <tr>
            <td>jelo54APPLE</td>
        </tr>
        <tr>
            <td>saba85BERKSHIREHATHAWAY</td>
        </tr>
        <tr>
            <td>asce76MCKESSON</td>
        </tr>
        <tr>
            <td>sagn76UNITEDHEALTHGROUP</td>
        </tr>
        <tr>
            <td>alhl67CVSHEALTH</td>
        </tr>
        <tr>
            <td>beoa66GENERALMOTORS</td>
        </tr>
        <tr>
            <td>kmhn38FORDMOTOR</td>
        </tr>
        <tr>
            <td>jlma58AT&amp;T</td>
        </tr>
    </tbody>
</table>



Suppose the company wants to assess the performance of all the sales representatives.
Each sales representative is assigned to work in a particular region.
To make it easier to understand for the HR team, display the concatenated sales_reps.id, ‘_’ (underscore),
and region.name as EMP_ID_REGION for each sales representative.


```python
%%sql
SELECT
  concat(s.id, '_', r.name)
FROM sales_reps s
JOIN region r
  ON r.id = s.region_id
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>concat</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>321500_Northeast</td>
        </tr>
        <tr>
            <td>321510_Northeast</td>
        </tr>
        <tr>
            <td>321520_Northeast</td>
        </tr>
        <tr>
            <td>321530_Northeast</td>
        </tr>
        <tr>
            <td>321540_Northeast</td>
        </tr>
        <tr>
            <td>321550_Northeast</td>
        </tr>
        <tr>
            <td>321560_Northeast</td>
        </tr>
        <tr>
            <td>321570_Northeast</td>
        </tr>
        <tr>
            <td>321580_Northeast</td>
        </tr>
        <tr>
            <td>321590_Northeast</td>
        </tr>
    </tbody>
</table>



From the accounts table, display:
- the name of the client,
- the coordinate as concatenated (latitude, longitude),
- email id of the primary point of contact as `first letter of the primary_poc` `last letter of the primary_poc`@`extracted name and domain from the website`.


```python
%%sql
SELECT
  a.name,
  concat('(', a.lat, ',', a.long, ')') AS lat_long,
  concat(LEFT(a.primary_poc, 1), RIGHT(a.primary_poc, 1), '@', substr(a.website, 5)) AS poc_email
FROM accounts a
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>lat_long</th>
            <th>poc_email</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Walmart</td>
            <td>(40.23849561,-75.10329704)</td>
            <td>Ta@walmart.com</td>
        </tr>
        <tr>
            <td>Exxon Mobil</td>
            <td>(41.16915630,-73.84937379)</td>
            <td>Ss@exxonmobil.com</td>
        </tr>
        <tr>
            <td>Apple</td>
            <td>(42.29049481,-76.08400942)</td>
            <td>Jo@apple.com</td>
        </tr>
        <tr>
            <td>Berkshire Hathaway</td>
            <td>(40.94902131,-75.76389759)</td>
            <td>Sa@berkshirehathaway.com</td>
        </tr>
        <tr>
            <td>McKesson</td>
            <td>(42.21709326,-75.28499823)</td>
            <td>Ae@mckesson.com</td>
        </tr>
        <tr>
            <td>UnitedHealth Group</td>
            <td>(40.08792542,-75.57569396)</td>
            <td>Sn@unitedhealthgroup.com</td>
        </tr>
        <tr>
            <td>CVS Health</td>
            <td>(41.46779585,-73.76763638)</td>
            <td>Al@cvshealth.com</td>
        </tr>
        <tr>
            <td>General Motors</td>
            <td>(40.80551762,-76.71018140)</td>
            <td>Ba@gm.com</td>
        </tr>
        <tr>
            <td>Ford Motor</td>
            <td>(41.11394200,-75.85422452)</td>
            <td>Kn@ford.com</td>
        </tr>
        <tr>
            <td>AT&amp;T</td>
            <td>(42.49746270,-74.90271225)</td>
            <td>Ja@att.com</td>
        </tr>
    </tbody>
</table>



From the web_events table, display the concatenated value of account_id, '_' , channel, '_', count of web events of the particular channel.


```python
%%sql
WITH t1
AS (SELECT
  w1.account_id,
  w1.channel,
  COUNT(*) AS cnt
FROM web_events w1
GROUP BY 1,
         2)
SELECT
  concat(t1.account_id, '_', t1.channel, '_', t1.cnt)
FROM t1
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>concat</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2601_organic_3</td>
        </tr>
        <tr>
            <td>2541_organic_8</td>
        </tr>
        <tr>
            <td>2461_facebook_8</td>
        </tr>
        <tr>
            <td>1121_organic_7</td>
        </tr>
        <tr>
            <td>2191_adwords_2</td>
        </tr>
        <tr>
            <td>1761_adwords_1</td>
        </tr>
        <tr>
            <td>4301_organic_2</td>
        </tr>
        <tr>
            <td>2051_organic_9</td>
        </tr>
        <tr>
            <td>3631_twitter_2</td>
        </tr>
        <tr>
            <td>2741_adwords_2</td>
        </tr>
    </tbody>
</table>



## Window function


```python
%%sql
SELECT id,
       account_id,
       DATE_TRUNC('year',occurred_at) AS year,
       DENSE_RANK() OVER (PARTITION BY account_id ORDER BY DATE_TRUNC('year',occurred_at)) AS dense_rank,
       total_amt_usd,
       SUM(total_amt_usd) OVER account_year_window AS sum_total_amt_usd,
       COUNT(total_amt_usd) OVER account_year_window AS count_total_amt_usd,
       AVG(total_amt_usd) OVER account_year_window AS avg_total_amt_usd,
       MIN(total_amt_usd) OVER account_year_window AS min_total_amt_usd,
       MAX(total_amt_usd) OVER account_year_window AS max_total_amt_usd
FROM orders
window account_year_window as
    (PARTITION BY account_id ORDER BY DATE_TRUNC('year',occurred_at))
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>id</th>
            <th>account_id</th>
            <th>year</th>
            <th>dense_rank</th>
            <th>total_amt_usd</th>
            <th>sum_total_amt_usd</th>
            <th>count_total_amt_usd</th>
            <th>avg_total_amt_usd</th>
            <th>min_total_amt_usd</th>
            <th>max_total_amt_usd</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4307</td>
            <td>1001</td>
            <td>2015-01-01 00:00:00</td>
            <td>1</td>
            <td>8757.18</td>
            <td>21651.53</td>
            <td>5</td>
            <td>4330.3060000000000000</td>
            <td>776.18</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>3</td>
            <td>1001</td>
            <td>2015-01-01 00:00:00</td>
            <td>1</td>
            <td>776.18</td>
            <td>21651.53</td>
            <td>5</td>
            <td>4330.3060000000000000</td>
            <td>776.18</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>2</td>
            <td>1001</td>
            <td>2015-01-01 00:00:00</td>
            <td>1</td>
            <td>1718.03</td>
            <td>21651.53</td>
            <td>5</td>
            <td>4330.3060000000000000</td>
            <td>776.18</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>1</td>
            <td>1001</td>
            <td>2015-01-01 00:00:00</td>
            <td>1</td>
            <td>973.43</td>
            <td>21651.53</td>
            <td>5</td>
            <td>4330.3060000000000000</td>
            <td>776.18</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>4308</td>
            <td>1001</td>
            <td>2015-01-01 00:00:00</td>
            <td>1</td>
            <td>9426.71</td>
            <td>21651.53</td>
            <td>5</td>
            <td>4330.3060000000000000</td>
            <td>776.18</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>6</td>
            <td>1001</td>
            <td>2016-01-01 00:00:00</td>
            <td>2</td>
            <td>1067.25</td>
            <td>124014.87</td>
            <td>28</td>
            <td>4429.1025000000000000</td>
            <td>752.57</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>5</td>
            <td>1001</td>
            <td>2016-01-01 00:00:00</td>
            <td>2</td>
            <td>983.49</td>
            <td>124014.87</td>
            <td>28</td>
            <td>4429.1025000000000000</td>
            <td>752.57</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>4</td>
            <td>1001</td>
            <td>2016-01-01 00:00:00</td>
            <td>2</td>
            <td>958.24</td>
            <td>124014.87</td>
            <td>28</td>
            <td>4429.1025000000000000</td>
            <td>752.57</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>4318</td>
            <td>1001</td>
            <td>2016-01-01 00:00:00</td>
            <td>2</td>
            <td>7924.46</td>
            <td>124014.87</td>
            <td>28</td>
            <td>4429.1025000000000000</td>
            <td>752.57</td>
            <td>9426.71</td>
        </tr>
        <tr>
            <td>4309</td>
            <td>1001</td>
            <td>2016-01-01 00:00:00</td>
            <td>2</td>
            <td>9230.67</td>
            <td>124014.87</td>
            <td>28</td>
            <td>4429.1025000000000000</td>
            <td>752.57</td>
            <td>9426.71</td>
        </tr>
    </tbody>
</table>



Create a running total of standard_amt_usd (in the orders table) over order time with no date truncation. Your final table should have two columns: one with the amount being added for each new row, and a second with the running total.


```python
%%sql
SELECT standard_amt_usd,
       SUM(standard_amt_usd) OVER (ORDER BY occurred_at) AS running_total
FROM orders
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>standard_amt_usd</th>
            <th>running_total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0.00</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>2445.10</td>
            <td>2445.10</td>
        </tr>
        <tr>
            <td>2634.72</td>
            <td>5079.82</td>
        </tr>
        <tr>
            <td>0.00</td>
            <td>5079.82</td>
        </tr>
        <tr>
            <td>2455.08</td>
            <td>7534.90</td>
        </tr>
        <tr>
            <td>2504.98</td>
            <td>10039.88</td>
        </tr>
        <tr>
            <td>264.47</td>
            <td>10304.35</td>
        </tr>
        <tr>
            <td>1536.92</td>
            <td>11841.27</td>
        </tr>
        <tr>
            <td>374.25</td>
            <td>12215.52</td>
        </tr>
        <tr>
            <td>1402.19</td>
            <td>13617.71</td>
        </tr>
    </tbody>
</table>



Now, modify your query from the previous question to include partitions. Still create a running total of standard_amt_usd (in the orders table) over order time, but this time, date truncate occurred_at by year and partition by that same year-truncated occurred_at variable. Your final table should have three columns: One with the amount being added for each row, one for the truncated date, and a final column with the running total within each year.


```python
%%sql
SELECT standard_amt_usd, date_trunc('year', occurred_at) as year,
       SUM(standard_amt_usd) OVER (partition by date_trunc('year', occurred_at) order by occurred_at) AS running_total
FROM orders
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>standard_amt_usd</th>
            <th>year</th>
            <th>running_total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>0.00</td>
            <td>2013-01-01 00:00:00</td>
            <td>0.00</td>
        </tr>
        <tr>
            <td>2445.10</td>
            <td>2013-01-01 00:00:00</td>
            <td>2445.10</td>
        </tr>
        <tr>
            <td>2634.72</td>
            <td>2013-01-01 00:00:00</td>
            <td>5079.82</td>
        </tr>
        <tr>
            <td>0.00</td>
            <td>2013-01-01 00:00:00</td>
            <td>5079.82</td>
        </tr>
        <tr>
            <td>2455.08</td>
            <td>2013-01-01 00:00:00</td>
            <td>7534.90</td>
        </tr>
        <tr>
            <td>2504.98</td>
            <td>2013-01-01 00:00:00</td>
            <td>10039.88</td>
        </tr>
        <tr>
            <td>264.47</td>
            <td>2013-01-01 00:00:00</td>
            <td>10304.35</td>
        </tr>
        <tr>
            <td>1536.92</td>
            <td>2013-01-01 00:00:00</td>
            <td>11841.27</td>
        </tr>
        <tr>
            <td>374.25</td>
            <td>2013-01-01 00:00:00</td>
            <td>12215.52</td>
        </tr>
        <tr>
            <td>1402.19</td>
            <td>2013-01-01 00:00:00</td>
            <td>13617.71</td>
        </tr>
    </tbody>
</table>



## Subqueries


```python
%%sql
SELECT
  date_trunc('day', w.occurred_at) AS day,
  w.channel AS channel,
  COUNT(*) AS event_count
FROM web_events w
GROUP BY 1,
         2
ORDER BY 3 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>day</th>
            <th>channel</th>
            <th>event_count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2017-01-01 00:00:00</td>
            <td>direct</td>
            <td>21</td>
        </tr>
        <tr>
            <td>2016-12-21 00:00:00</td>
            <td>direct</td>
            <td>21</td>
        </tr>
        <tr>
            <td>2016-12-31 00:00:00</td>
            <td>direct</td>
            <td>19</td>
        </tr>
        <tr>
            <td>2016-11-03 00:00:00</td>
            <td>direct</td>
            <td>18</td>
        </tr>
        <tr>
            <td>2016-12-28 00:00:00</td>
            <td>direct</td>
            <td>17</td>
        </tr>
        <tr>
            <td>2016-10-28 00:00:00</td>
            <td>direct</td>
            <td>16</td>
        </tr>
        <tr>
            <td>2016-12-20 00:00:00</td>
            <td>direct</td>
            <td>16</td>
        </tr>
        <tr>
            <td>2016-10-29 00:00:00</td>
            <td>direct</td>
            <td>15</td>
        </tr>
        <tr>
            <td>2016-12-26 00:00:00</td>
            <td>direct</td>
            <td>15</td>
        </tr>
        <tr>
            <td>2016-12-02 00:00:00</td>
            <td>direct</td>
            <td>15</td>
        </tr>
    </tbody>
</table>



Num events for each day for each channel


```python
%%sql
SELECT
  date_trunc('day', w.occurred_at) AS day,
  w.channel AS channel,
  COUNT(*) AS event_count
FROM web_events w
GROUP BY 1,
         2
ORDER BY 3 DESC
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>day</th>
            <th>channel</th>
            <th>event_count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2017-01-01 00:00:00</td>
            <td>direct</td>
            <td>21</td>
        </tr>
        <tr>
            <td>2016-12-21 00:00:00</td>
            <td>direct</td>
            <td>21</td>
        </tr>
        <tr>
            <td>2016-12-31 00:00:00</td>
            <td>direct</td>
            <td>19</td>
        </tr>
        <tr>
            <td>2016-11-03 00:00:00</td>
            <td>direct</td>
            <td>18</td>
        </tr>
        <tr>
            <td>2016-12-28 00:00:00</td>
            <td>direct</td>
            <td>17</td>
        </tr>
        <tr>
            <td>2016-10-28 00:00:00</td>
            <td>direct</td>
            <td>16</td>
        </tr>
        <tr>
            <td>2016-12-20 00:00:00</td>
            <td>direct</td>
            <td>16</td>
        </tr>
        <tr>
            <td>2016-10-29 00:00:00</td>
            <td>direct</td>
            <td>15</td>
        </tr>
        <tr>
            <td>2016-12-26 00:00:00</td>
            <td>direct</td>
            <td>15</td>
        </tr>
        <tr>
            <td>2016-12-02 00:00:00</td>
            <td>direct</td>
            <td>15</td>
        </tr>
    </tbody>
</table>



Avg events per channel


```python
%%sql
SELECT
  sub.channel,
  ROUND(AVG(sub.event_count), 2)
FROM (
-- number of events for each day for each channel
SELECT
  date_trunc('day', w.occurred_at) AS day,
  w.channel AS channel,
  COUNT(*) AS event_count
FROM web_events w
GROUP BY 1,
         2
ORDER BY 3 DESC) sub
GROUP BY 1
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>channel</th>
            <th>round</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>facebook</td>
            <td>1.60</td>
        </tr>
        <tr>
            <td>organic</td>
            <td>1.67</td>
        </tr>
        <tr>
            <td>twitter</td>
            <td>1.32</td>
        </tr>
        <tr>
            <td>adwords</td>
            <td>1.57</td>
        </tr>
        <tr>
            <td>banner</td>
            <td>1.29</td>
        </tr>
        <tr>
            <td>direct</td>
            <td>4.90</td>
        </tr>
    </tbody>
</table>



Provide the name of the sales_rep in each region with the largest amount of total_amt_usd sales.


```python
%%sql
SELECT
  t3.region_name,
  t3.rep_name,
  t3.total_sales
FROM (
-- sales for region by rep
SELECT
  r.name AS region_name,
  sr.name AS rep_name,
  SUM(o.total_amt_usd) total_sales
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
JOIN sales_reps sr
  ON a.sales_rep_id = sr.id
JOIN region r
  ON sr.region_id = r.id
GROUP BY 1,
         2) AS t3
JOIN (SELECT
  t1.region_name,
  MAX(t1.total_sales) AS total_sales
FROM (
-- sales for region by rep
SELECT
  r.name AS region_name,
  sr.name AS rep_name,
  SUM(o.total_amt_usd) total_sales
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
JOIN sales_reps sr
  ON a.sales_rep_id = sr.id
JOIN region r
  ON sr.region_id = r.id
GROUP BY 1,
         2) AS t1
GROUP BY 1) AS t2
  ON t3.region_name = t2.region_name
  AND t2.total_sales = t3.total_sales
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>region_name</th>
            <th>rep_name</th>
            <th>total_sales</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Midwest</td>
            <td>Charles Bidwell</td>
            <td>675637.19</td>
        </tr>
        <tr>
            <td>Northeast</td>
            <td>Tia Amato</td>
            <td>1010690.60</td>
        </tr>
        <tr>
            <td>Southeast</td>
            <td>Earlie Schleusner</td>
            <td>1098137.72</td>
        </tr>
        <tr>
            <td>West</td>
            <td>Georgianna Chisholm</td>
            <td>886244.12</td>
        </tr>
    </tbody>
</table>



For the region with the largest (sum) of sales total_amt_usd, how many total (count) orders were placed?


```python
%%sql
SELECT
  r.name AS region_name,
  COUNT(o.total) AS ttl_cnt
FROM orders o
JOIN accounts a
  ON o.account_id = a.id
JOIN sales_reps s
  ON a.sales_rep_id = s.id
JOIN region r
  ON s.region_id = r.id
WHERE r.name = (SELECT
  t1.name
FROM (
-- region with the most sales
SELECT
  r.name,
  SUM(o.total_amt_usd) AS ttl_sls
FROM orders o
JOIN accounts a
  ON o.account_id = a.id
JOIN sales_reps s
  ON a.sales_rep_id = s.id
JOIN region r
  ON s.region_id = r.id
GROUP BY 1
ORDER BY 2 DESC LIMIT 1) AS t1)
GROUP BY 1;
```





<table>
    <thead>
        <tr>
            <th>region_name</th>
            <th>ttl_cnt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Northeast</td>
            <td>2357</td>
        </tr>
    </tbody>
</table>



How many accounts had more total purchases than the account name which has bought the most standard_qty paper throughout their lifetime as a customer?


```python
%%sql
SELECT
  a.name,
  SUM(o.total) AS total_qty
FROM orders o
JOIN accounts a
  ON a.id = o.account_id
GROUP BY 1
HAVING SUM(o.total) > (
-- what is the max standard_qty purchased by an account
SELECT
  t1.ttl_qty
FROM (
-- which account has bought the most standard_qty paper throughout their lifetime as a customer?
SELECT
  a.name,
  SUM(o.standard_qty) AS max_std_qty,
  SUM(o.total) AS ttl_qty
FROM orders o
JOIN accounts a
  ON o.account_id = a.id
GROUP BY 1
ORDER BY 2 DESC LIMIT 1) AS t1);
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>total_qty</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>EOG Resources</td>
            <td>56410</td>
        </tr>
        <tr>
            <td>Mosaic</td>
            <td>49246</td>
        </tr>
        <tr>
            <td>IBM</td>
            <td>47506</td>
        </tr>
    </tbody>
</table>



For the customer that spent the most (in total over their lifetime as a customer) total_amt_usd, how many web_events did they have for each channel?


```python
%%sql
SELECT
  a.name,
  a.id,
  we.channel,
  COUNT(*) AS cnt
FROM accounts a
JOIN web_events we
  ON a.id = we.account_id
WHERE a.id = (
-- the id of the customer with the max total spending
SELECT
  t1.id
FROM (
-- the customer with the max total spending
SELECT
  a.name,
  a.id,
  SUM(o.total_amt_usd)
FROM orders o
JOIN accounts a
  ON a.id = o.account_id
GROUP BY 1,
         2
ORDER BY 3 DESC LIMIT 1) AS t1)
GROUP BY 1,
         2,
         3
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>id</th>
            <th>channel</th>
            <th>cnt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>adwords</td>
            <td>12</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>banner</td>
            <td>4</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>direct</td>
            <td>44</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>facebook</td>
            <td>11</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>organic</td>
            <td>13</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>twitter</td>
            <td>5</td>
        </tr>
    </tbody>
</table>



What is the lifetime average amount spent in terms of total_amt_usd for the top 10 total spending accounts?


```python
%%sql
SELECT
  AVG(t2.total_sls_usd) AS avg_sls_for_top_10
FROM (
-- top 10 accounts by total spending
SELECT
  a.id,
  a.name,
  SUM(o.total_amt_usd) AS total_sls_usd
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY 1,
         2
ORDER BY 3 DESC LIMIT 10) AS t2;
```





<table>
    <thead>
        <tr>
            <th>avg_sls_for_top_10</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>304846.969000000000</td>
        </tr>
    </tbody>
</table>



What is the lifetime average amount spent in terms of total_amt_usd, including only the companies that spent more per order, on average, than the average of all orders.


```python
%%sql
SELECT
  AVG(tmp.avg_sls_for_company)
FROM (SELECT
  a.name,
  ROUND(AVG(o.total_amt_usd), 2) AS avg_sls_for_company
FROM orders o
JOIN accounts a
  ON a.id = o.account_id
GROUP BY 1
HAVING ROUND(AVG(o.total_amt_usd), 2) > (
-- average total_amt_usd per order for all orders
SELECT
  ROUND(AVG(o1.total_amt_usd), 2) AS avg_ttl_per_order
FROM orders o1)) tmp;
```





<table>
    <thead>
        <tr>
            <th>avg</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4721.1402958579881657</td>
        </tr>
    </tbody>
</table>



Provide the name of the sales_rep in each region with the largest amount of total_amt_usd sales.


```python
%%sql
WITH sales_for_region_by_rep
AS (
-- total sales by region for rep
SELECT
  r.name AS region_name,
  sr.name AS rep_name,
  SUM(o.total_amt_usd) total_sales
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
JOIN sales_reps sr
  ON a.sales_rep_id = sr.id
JOIN region r
  ON sr.region_id = r.id
GROUP BY 1,
         2
ORDER BY 3 DESC),
max_sales_for_region
AS (
-- max sales by region for rep, rep name removed
SELECT
  t1.region_name,
  MAX(t1.total_sales) AS total_sales
FROM (
-- sales for region by rep
SELECT
  r.name AS region_name,
  sr.name AS rep_name,
  SUM(o.total_amt_usd) total_sales
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
JOIN sales_reps sr
  ON a.sales_rep_id = sr.id
JOIN region r
  ON sr.region_id = r.id
GROUP BY 1,
         2) AS t1
GROUP BY 1)
SELECT
  sales_for_region_by_rep.region_name,
  sales_for_region_by_rep.rep_name,
  sales_for_region_by_rep.total_sales
FROM sales_for_region_by_rep
JOIN max_sales_for_region
  ON sales_for_region_by_rep.region_name = max_sales_for_region.region_name
  AND sales_for_region_by_rep.total_sales = max_sales_for_region.total_sales
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>region_name</th>
            <th>rep_name</th>
            <th>total_sales</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Midwest</td>
            <td>Charles Bidwell</td>
            <td>675637.19</td>
        </tr>
        <tr>
            <td>Northeast</td>
            <td>Tia Amato</td>
            <td>1010690.60</td>
        </tr>
        <tr>
            <td>Southeast</td>
            <td>Earlie Schleusner</td>
            <td>1098137.72</td>
        </tr>
        <tr>
            <td>West</td>
            <td>Georgianna Chisholm</td>
            <td>886244.12</td>
        </tr>
    </tbody>
</table>



For the region with the largest (sum) of sales total_amt_usd, how many total (count) orders were placed?


```python
%%sql
WITH region_with_max_sales_and_sales
AS (
-- region name with the most sales
SELECT
  t1.name
FROM (
-- region name with the most sales and sales total
SELECT
  r.name,
  SUM(o.total_amt_usd) AS ttl_sls
FROM orders o
JOIN accounts a
  ON o.account_id = a.id
JOIN sales_reps s
  ON a.sales_rep_id = s.id
JOIN region r
  ON s.region_id = r.id
GROUP BY 1
ORDER BY 2 DESC LIMIT 1) AS t1)
SELECT
  r.name AS region_name,
  COUNT(o.total) AS ttl_cnt
FROM orders o
JOIN accounts a
  ON o.account_id = a.id
JOIN sales_reps s
  ON a.sales_rep_id = s.id
JOIN region r
  ON s.region_id = r.id
JOIN region_with_max_sales_and_sales rms
  ON rms.name = r.name
GROUP BY 1;
```





<table>
    <thead>
        <tr>
            <th>region_name</th>
            <th>ttl_cnt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Northeast</td>
            <td>2357</td>
        </tr>
    </tbody>
</table>



How many accounts had more total purchases than the account name which has bought the most standard_qty paper throughout their lifetime as a customer?


```python
%%sql
WITH t2
AS (
-- which account has bought the most standard_qty paper throughout their lifetime as a customer?
SELECT
  a.name,
  SUM(o.standard_qty) AS max_std_qty,
  SUM(o.total) AS ttl_qty
FROM orders o
JOIN accounts a
  ON o.account_id = a.id
GROUP BY 1
ORDER BY 2 DESC LIMIT 1)

SELECT
  a.name,
  SUM(o.total) AS total_qty
FROM orders o
JOIN accounts a
  ON a.id = o.account_id
GROUP BY 1
HAVING SUM(o.total) > (SELECT
  t2.ttl_qty
FROM t2);
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>total_qty</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>EOG Resources</td>
            <td>56410</td>
        </tr>
        <tr>
            <td>Mosaic</td>
            <td>49246</td>
        </tr>
        <tr>
            <td>IBM</td>
            <td>47506</td>
        </tr>
    </tbody>
</table>



For the customer that spent the most (in total over their lifetime as a customer) total_amt_usd, how many web_events did they have for each channel?


```python
%%sql
WITH t2
AS (
-- the customer with the max total spending
SELECT
  a.name,
  a.id,
  SUM(o.total_amt_usd)
FROM orders o
JOIN accounts a
  ON a.id = o.account_id
GROUP BY 1,
         2
ORDER BY 3 DESC LIMIT 1)

SELECT
  a.name,
  a.id,
  we.channel,
  COUNT(*) AS cnt
FROM accounts a
JOIN web_events we
  ON a.id = we.account_id
WHERE a.id = (SELECT
  t2.id
FROM t2)
GROUP BY 1,
         2,
         3
LIMIT 10;
```





<table>
    <thead>
        <tr>
            <th>name</th>
            <th>id</th>
            <th>channel</th>
            <th>cnt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>adwords</td>
            <td>12</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>banner</td>
            <td>4</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>direct</td>
            <td>44</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>facebook</td>
            <td>11</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>organic</td>
            <td>13</td>
        </tr>
        <tr>
            <td>EOG Resources</td>
            <td>4211</td>
            <td>twitter</td>
            <td>5</td>
        </tr>
    </tbody>
</table>



What is the lifetime average amount spent in terms of total_amt_usd for the top 10 total spending accounts?


```python
%%sql
WITH t2
AS (
-- top 10 accounts by total spending
SELECT
  a.id,
  a.name,
  SUM(o.total_amt_usd) AS total_sls_usd
FROM accounts a
JOIN orders o
  ON a.id = o.account_id
GROUP BY 1,
         2
ORDER BY 3 DESC LIMIT 10)
SELECT
  AVG(t2.total_sls_usd) AS avg_sls_for_top_10
FROM t2;
```





<table>
    <thead>
        <tr>
            <th>avg_sls_for_top_10</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>304846.969000000000</td>
        </tr>
    </tbody>
</table>



What is the lifetime average amount spent in terms of total_amt_usd, including only the companies that spent more per order, on average, than the average of all orders.


```python
%%sql
WITH t2
AS (SELECT
  a.name,
  ROUND(AVG(o.total_amt_usd), 2) AS avg_sls_for_company
FROM orders o
JOIN accounts a
  ON a.id = o.account_id
GROUP BY 1
HAVING ROUND(AVG(o.total_amt_usd), 2) > (
-- average total_amt_usd per order for all orders
SELECT
  ROUND(AVG(o1.total_amt_usd), 2) AS avg_ttl_per_order
FROM orders o1))
SELECT
  AVG(t2.avg_sls_for_company)
FROM t2
LIMIT 10;
```


<table>
    <thead>
        <tr>
            <th>avg</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>4721.1402958579881657</td>
        </tr>
    </tbody>
</table>
