# Hospital Data Analysis with SQL

## Ingestion of the data into Postgres

```py
import boto3
import json
import pandas as pd

from sqlalchemy import create_engine
import psycopg2

%reload_ext sql

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
HOST = "database-1.cy8ltogyfgas.us-east-1.rds.amazonaws.com"
PORT = 5432
DBNAME = "postgres"
CONN = f"postgresql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"

# load the data into our postgres database
alchemyEngine = create_engine(CONN, pool_recycle=3600);
postgreSQLConnection = alchemyEngine.connect();

%sql {CONN}

SCHEMA = "hospital"

%sql create schema if not exists {SCHEMA};

patients = pd.read_csv("patients.csv", index_col=0)
patients.birth_date = pd.to_datetime(patients.birth_date)
patients.info()
patients.to_sql('patients', postgreSQLConnection, if_exists='replace', schema=SCHEMA, index=False)

admissions = pd.read_csv("admissions.csv", index_col=0)
admissions.admission_date = pd.to_datetime(admissions.admission_date)
admissions.discharge_date = pd.to_datetime(admissions.discharge_date)
admissions.info()
admissions.to_sql('admissions', postgreSQLConnection, if_exists='replace', schema=SCHEMA, index=False)

physicians = pd.read_csv("physicians.csv", index_col=0)
physicians.info()
physicians.to_sql('physicians', postgreSQLConnection, if_exists='replace', schema=SCHEMA, index=False)

province_names = pd.read_csv("province_names.csv", index_col=0)
province_names.info()
province_names.to_sql('province_names', postgreSQLConnection, if_exists='replace', schema=SCHEMA, index=False)

postgreSQLConnection.close();
```

## Connect

```python
import boto3
import json

%reload_ext sql

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
HOST = "database-1.cy8ltogyfgas.us-east-1.rds.amazonaws.com"
PORT = 5432
DBNAME = "postgres"
CONN = f"postgresql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"

%sql {CONN}
```


```python
SCHEMA = "hospital"
%sql SET search_path = {SCHEMA}
```

## Easy

### Show first name, last name, and the full province name of each patient.

Example: 'Ontario' instead of 'ON'


```sql
%%sql
SELECT
  first_name,
  last_name,
  province_name
FROM patients
  JOIN province_names ON province_names.province_id = patients.province_id
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
        <th>last_name</th>
        <th>province_name</th>
    </tr>
    <tr>
        <td>Velu</td>
        <td>Galv�n</td>
        <td>Alberta</td>
    </tr>
    <tr>
        <td>Derek</td>
        <td>Nappa</td>
        <td>Alberta</td>
    </tr>
    <tr>
        <td>Aniki</td>
        <td>Leotardo</td>
        <td>Alberta</td>
    </tr>
    <tr>
        <td>Leonard</td>
        <td>Sacrimoni</td>
        <td>Alberta</td>
    </tr>
    <tr>
        <td>Reginald</td>
        <td>Cavor</td>
        <td>Alberta</td>
    </tr>
    <tr>
        <td>Laura</td>
        <td>March</td>
        <td>British Columbia</td>
    </tr>
    <tr>
        <td>Lydia</td>
        <td>Carver</td>
        <td>British Columbia</td>
    </tr>
    <tr>
        <td>Annie</td>
        <td>Smart</td>
        <td>British Columbia</td>
    </tr>
    <tr>
        <td>Jackie</td>
        <td>Dean</td>
        <td>British Columbia</td>
    </tr>
    <tr>
        <td>Catherine</td>
        <td>Minoru</td>
        <td>British Columbia</td>
    </tr>
</table>



### Show patient_id, first_name, last_name from patients whose diagnosis is 'Dementia'.

Primary diagnosis is stored in the admissions table.


```sql
%%sql
SELECT
  patients.patient_id,
  first_name,
  last_name
FROM patients
  JOIN admissions ON admissions.patient_id = patients.patient_id
WHERE diagnosis = 'Dementia';
```





<table>
    <tr>
        <th>patient_id</th>
        <th>first_name</th>
        <th>last_name</th>
    </tr>
    <tr>
        <td>160</td>
        <td>Miranda</td>
        <td>Delacour</td>
    </tr>
    <tr>
        <td>178</td>
        <td>David</td>
        <td>Bustamonte</td>
    </tr>
    <tr>
        <td>207</td>
        <td>Matt</td>
        <td>Celine</td>
    </tr>
</table>



### Show first name and last name concatinated into one column to show their full name.


```sql
%%sql
SELECT
  CONCAT(first_name, ' ', last_name) AS full_name
FROM patients
LIMIT 10;
```





<table>
    <tr>
        <th>full_name</th>
    </tr>
    <tr>
        <td>Donald Waterfield</td>
    </tr>
    <tr>
        <td>Mickey Baasha</td>
    </tr>
    <tr>
        <td>Jiji Sharma</td>
    </tr>
    <tr>
        <td>Blair Diaz</td>
    </tr>
    <tr>
        <td>Charles Wolfe</td>
    </tr>
    <tr>
        <td>Sue Falcon</td>
    </tr>
    <tr>
        <td>Thomas ONeill</td>
    </tr>
    <tr>
        <td>Sonny Beckett</td>
    </tr>
    <tr>
        <td>Sister Spitzer</td>
    </tr>
    <tr>
        <td>Cedric Coltrane</td>
    </tr>
</table>



### Show how many patients have a birth_date with 2010 as the birth year.


```sql
%%sql
SELECT COUNT(*) AS total_patients
FROM patients
WHERE EXTRACT(YEAR from birth_date) = 2010;
```





<table>
    <tr>
        <th>total_patients</th>
    </tr>
    <tr>
        <td>5</td>
    </tr>
</table>



### Show the first_name, last_name, and height of the patient with the greatest height.


```sql
%%sql
SELECT * FROM patients LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>first_name</th>
        <th>last_name</th>
        <th>gender</th>
        <th>birth_date</th>
        <th>city</th>
        <th>province_id</th>
        <th>allergies</th>
        <th>height</th>
        <th>weight</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Donald</td>
        <td>Waterfield</td>
        <td>M</td>
        <td>1963-02-12 00:00:00</td>
        <td>Barrie</td>
        <td>ON</td>
        <td>None</td>
        <td>156</td>
        <td>65</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Mickey</td>
        <td>Baasha</td>
        <td>M</td>
        <td>1981-05-28 00:00:00</td>
        <td>Dundas</td>
        <td>ON</td>
        <td>Sulfa</td>
        <td>185</td>
        <td>76</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Jiji</td>
        <td>Sharma</td>
        <td>M</td>
        <td>1957-09-05 00:00:00</td>
        <td>Hamilton</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>194</td>
        <td>106</td>
    </tr>
    <tr>
        <td>4</td>
        <td>Blair</td>
        <td>Diaz</td>
        <td>M</td>
        <td>1967-01-07 00:00:00</td>
        <td>Hamilton</td>
        <td>ON</td>
        <td>None</td>
        <td>191</td>
        <td>104</td>
    </tr>
    <tr>
        <td>5</td>
        <td>Charles</td>
        <td>Wolfe</td>
        <td>M</td>
        <td>2017-11-19 00:00:00</td>
        <td>Orillia</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>47</td>
        <td>10</td>
    </tr>
    <tr>
        <td>6</td>
        <td>Sue</td>
        <td>Falcon</td>
        <td>F</td>
        <td>2017-09-30 00:00:00</td>
        <td>Ajax</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>43</td>
        <td>5</td>
    </tr>
    <tr>
        <td>7</td>
        <td>Thomas</td>
        <td>ONeill</td>
        <td>M</td>
        <td>1993-01-31 00:00:00</td>
        <td>Burlington</td>
        <td>ON</td>
        <td>None</td>
        <td>180</td>
        <td>117</td>
    </tr>
    <tr>
        <td>8</td>
        <td>Sonny</td>
        <td>Beckett</td>
        <td>M</td>
        <td>1952-12-11 00:00:00</td>
        <td>Port Hawkesbury</td>
        <td>NS</td>
        <td>None</td>
        <td>174</td>
        <td>105</td>
    </tr>
    <tr>
        <td>9</td>
        <td>Sister</td>
        <td>Spitzer</td>
        <td>F</td>
        <td>1966-10-15 00:00:00</td>
        <td>Toronto</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>173</td>
        <td>95</td>
    </tr>
    <tr>
        <td>10</td>
        <td>Cedric</td>
        <td>Coltrane</td>
        <td>M</td>
        <td>1961-11-10 00:00:00</td>
        <td>Toronto</td>
        <td>ON</td>
        <td>None</td>
        <td>157</td>
        <td>61</td>
    </tr>
</table>




```sql
%%sql
SELECT
  first_name,
  last_name,
  height
FROM patients
WHERE height = (
    SELECT max(height)
    FROM patients
  );
```





<table>
    <tr>
        <th>first_name</th>
        <th>last_name</th>
        <th>height</th>
    </tr>
    <tr>
        <td>Joe</td>
        <td>Snyder</td>
        <td>224</td>
    </tr>
</table>



### Show all columns for patients who have one of the following patient_ids: 1,45,534,879,1000


```sql
%%sql
SELECT *
FROM patients
WHERE
  patient_id IN (1, 45, 534, 879, 1000)
LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>first_name</th>
        <th>last_name</th>
        <th>gender</th>
        <th>birth_date</th>
        <th>city</th>
        <th>province_id</th>
        <th>allergies</th>
        <th>height</th>
        <th>weight</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Donald</td>
        <td>Waterfield</td>
        <td>M</td>
        <td>1963-02-12 00:00:00</td>
        <td>Barrie</td>
        <td>ON</td>
        <td>None</td>
        <td>156</td>
        <td>65</td>
    </tr>
    <tr>
        <td>45</td>
        <td>Cross</td>
        <td>Gordon</td>
        <td>M</td>
        <td>2009-03-20 00:00:00</td>
        <td>Ancaster</td>
        <td>ON</td>
        <td>None</td>
        <td>125</td>
        <td>53</td>
    </tr>
</table>



### Show the total number of admissions


```sql
%%sql
SELECT COUNT(*) AS total_admissions
FROM admissions;
```





<table>
    <tr>
        <th>total_admissions</th>
    </tr>
    <tr>
        <td>400</td>
    </tr>
</table>



### Show all the columns from admissions where the patient was admitted and discharged on the same day.


```sql
%%sql
SELECT *
FROM admissions
WHERE admission_date = discharge_date
LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>admission_date</th>
        <th>discharge_date</th>
        <th>diagnosis</th>
        <th>attending_physician_id</th>
    </tr>
    <tr>
        <td>1</td>
        <td>2018-09-20 00:00:00</td>
        <td>2018-09-20 00:00:00</td>
        <td>Ineffective Breathin Pattern R/T Fluid Accumulatio</td>
        <td>24</td>
    </tr>
    <tr>
        <td>9</td>
        <td>2018-12-31 00:00:00</td>
        <td>2018-12-31 00:00:00</td>
        <td>Ruptured Appendicitis</td>
        <td>19</td>
    </tr>
    <tr>
        <td>10</td>
        <td>2019-02-27 00:00:00</td>
        <td>2019-02-27 00:00:00</td>
        <td>Lower Quadrant Pain</td>
        <td>27</td>
    </tr>
    <tr>
        <td>17</td>
        <td>2019-03-04 00:00:00</td>
        <td>2019-03-04 00:00:00</td>
        <td>Diabetes Mellitus</td>
        <td>9</td>
    </tr>
    <tr>
        <td>28</td>
        <td>2019-03-30 00:00:00</td>
        <td>2019-03-30 00:00:00</td>
        <td>Cancer Of The Stomach</td>
        <td>26</td>
    </tr>
    <tr>
        <td>31</td>
        <td>2018-09-26 00:00:00</td>
        <td>2018-09-26 00:00:00</td>
        <td>Cardiovascular Disease</td>
        <td>19</td>
    </tr>
    <tr>
        <td>53</td>
        <td>2018-10-24 00:00:00</td>
        <td>2018-10-24 00:00:00</td>
        <td>Urinary Tract Infection</td>
        <td>8</td>
    </tr>
    <tr>
        <td>54</td>
        <td>2019-04-07 00:00:00</td>
        <td>2019-04-07 00:00:00</td>
        <td>Hypertension</td>
        <td>21</td>
    </tr>
    <tr>
        <td>70</td>
        <td>2018-07-17 00:00:00</td>
        <td>2018-07-17 00:00:00</td>
        <td>Migraine</td>
        <td>20</td>
    </tr>
    <tr>
        <td>78</td>
        <td>2018-06-17 00:00:00</td>
        <td>2018-06-17 00:00:00</td>
        <td>Hypertension</td>
        <td>17</td>
    </tr>
</table>



### Show the total number of admissions for patient_id 45.


```sql
%%sql
SELECT
  patient_id,
  COUNT(*) AS total_admissions
FROM admissions
WHERE patient_id = 45
GROUP BY patient_id;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>total_admissions</th>
    </tr>
    <tr>
        <td>45</td>
        <td>1</td>
    </tr>
</table>



### Based on the cities that our patients live in, show unique cities that are in province_id 'NS'?


```sql
%%sql
SELECT DISTINCT(city) AS unique_cities
FROM patients
WHERE province_id = 'NS';
```





<table>
    <tr>
        <th>unique_cities</th>
    </tr>
    <tr>
        <td>Halifax</td>
    </tr>
    <tr>
        <td>Port Hawkesbury</td>
    </tr>
</table>



### Write a query to find the first_name, last name and birth date of patients who have height more than 160 and weight more than 70


```sql
%%sql
SELECT first_name, last_name, birth_date FROM patients
WHERE height > 160 AND weight > 70
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
        <th>last_name</th>
        <th>birth_date</th>
    </tr>
    <tr>
        <td>Mickey</td>
        <td>Baasha</td>
        <td>1981-05-28 00:00:00</td>
    </tr>
    <tr>
        <td>Jiji</td>
        <td>Sharma</td>
        <td>1957-09-05 00:00:00</td>
    </tr>
    <tr>
        <td>Blair</td>
        <td>Diaz</td>
        <td>1967-01-07 00:00:00</td>
    </tr>
    <tr>
        <td>Thomas</td>
        <td>ONeill</td>
        <td>1993-01-31 00:00:00</td>
    </tr>
    <tr>
        <td>Sonny</td>
        <td>Beckett</td>
        <td>1952-12-11 00:00:00</td>
    </tr>
    <tr>
        <td>Sister</td>
        <td>Spitzer</td>
        <td>1966-10-15 00:00:00</td>
    </tr>
    <tr>
        <td>Rick</td>
        <td>Bennett</td>
        <td>1977-01-27 00:00:00</td>
    </tr>
    <tr>
        <td>Amy</td>
        <td>Leela</td>
        <td>1977-06-25 00:00:00</td>
    </tr>
    <tr>
        <td>Tom</td>
        <td>Halliwell</td>
        <td>1987-08-01 00:00:00</td>
    </tr>
    <tr>
        <td>Rachel</td>
        <td>Winterbourne</td>
        <td>1966-04-26 00:00:00</td>
    </tr>
</table>



### Write a query to find list of patients first_name, last_name, and allergies from Hamilton where allergies are not null


```sql
%%sql
SELECT
  first_name,
  last_name,
  allergies
FROM patients
WHERE
  city = 'Hamilton'
  and allergies is not null
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
        <th>last_name</th>
        <th>allergies</th>
    </tr>
    <tr>
        <td>Jiji</td>
        <td>Sharma</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Tom</td>
        <td>Halliwell</td>
        <td>Ragweed</td>
    </tr>
    <tr>
        <td>Nino</td>
        <td>Andrews</td>
        <td>Peanuts</td>
    </tr>
    <tr>
        <td>John</td>
        <td>Farley</td>
        <td>Gluten</td>
    </tr>
    <tr>
        <td>Sam</td>
        <td>Threep</td>
        <td>Sulpha</td>
    </tr>
    <tr>
        <td>Temple</td>
        <td>Russert</td>
        <td>Hay Fever</td>
    </tr>
    <tr>
        <td>Alice</td>
        <td>Donovan</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Stone</td>
        <td>Cutting</td>
        <td>Codeine</td>
    </tr>
    <tr>
        <td>Phil</td>
        <td>Chester</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Roland</td>
        <td>Murphy</td>
        <td>Sulfa Drugs</td>
    </tr>
</table>



## Medium

### Show unique birth years from patients and order them by ascending.


```sql
%%sql
SELECT
  DISTINCT EXTRACT(YEAR FROM birth_date) AS birth_year
FROM patients
ORDER BY birth_year
LIMIT 10;
```





<table>
    <tr>
        <th>birth_year</th>
    </tr>
    <tr>
        <td>1918</td>
    </tr>
    <tr>
        <td>1923</td>
    </tr>
    <tr>
        <td>1933</td>
    </tr>
    <tr>
        <td>1934</td>
    </tr>
    <tr>
        <td>1938</td>
    </tr>
    <tr>
        <td>1939</td>
    </tr>
    <tr>
        <td>1948</td>
    </tr>
    <tr>
        <td>1949</td>
    </tr>
    <tr>
        <td>1950</td>
    </tr>
    <tr>
        <td>1951</td>
    </tr>
</table>



### Show unique first names from the patients table which only occurs once in the list.

For example, if two or more people are named 'John' in the first_name column then don't include their name in the output list. If only 1 person is named 'Leo' then include them in the output.


```sql
%%sql
SELECT first_name
FROM patients
GROUP BY first_name
HAVING COUNT(first_name) = 1
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
    </tr>
    <tr>
        <td>Moe</td>
    </tr>
    <tr>
        <td>Mrs</td>
    </tr>
    <tr>
        <td>Cindy</td>
    </tr>
    <tr>
        <td>Emil</td>
    </tr>
    <tr>
        <td>Herr</td>
    </tr>
    <tr>
        <td>Hercule</td>
    </tr>
    <tr>
        <td>Nancy</td>
    </tr>
    <tr>
        <td>Dame</td>
    </tr>
    <tr>
        <td>Belladonna</td>
    </tr>
    <tr>
        <td>Shion</td>
    </tr>
</table>



### Show patient_id and first_name from patients where their first_name start with 'N' and ends with 'y' and is at least 3 characters long.


```sql
%%sql
SELECT
  patient_id,
  first_name
FROM patients
WHERE first_name LIKE 'N_%y'
LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>first_name</th>
    </tr>
    <tr>
        <td>181</td>
        <td>Nancy</td>
    </tr>
    <tr>
        <td>434</td>
        <td>Nicky</td>
    </tr>
</table>



### Display every patient's first_name. Order the list by the length of each name and then by alphbetically.


```sql
%%sql
SELECT first_name
FROM patients
order by
  LENGTH(first_name),
  first_name
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
    </tr>
    <tr>
        <td>Bo</td>
    </tr>
    <tr>
        <td>Abe</td>
    </tr>
    <tr>
        <td>Abi</td>
    </tr>
    <tr>
        <td>Amy</td>
    </tr>
    <tr>
        <td>Amy</td>
    </tr>
    <tr>
        <td>Amy</td>
    </tr>
    <tr>
        <td>Amy</td>
    </tr>
    <tr>
        <td>Ana</td>
    </tr>
    <tr>
        <td>Ann</td>
    </tr>
    <tr>
        <td>Ann</td>
    </tr>
</table>



### Show the total amount of male patients and the total amount of female patients in the patients table.

Display the two results in the same row.


```sql
%%sql
SELECT 
  (SELECT count(*) FROM patients WHERE gender='M') AS male_count, 
  (SELECT count(*) FROM patients WHERE gender='F') AS female_count;
```





<table>
    <tr>
        <th>male_count</th>
        <th>female_count</th>
    </tr>
    <tr>
        <td>273</td>
        <td>227</td>
    </tr>
</table>



### Show first and last name, allergies from patients which have allergies to either 'Penicillin' or 'Morphine'. Show results ordered ascending by allergies then by first_name then by last_name.


```sql
%%sql
SELECT
  first_name,
  last_name,
  allergies
FROM patients
WHERE
  allergies IN ('Penicillin', 'Morphine')
ORDER BY
  allergies,
  first_name,
  last_name
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
        <th>last_name</th>
        <th>allergies</th>
    </tr>
    <tr>
        <td>Briareos</td>
        <td>Hayes</td>
        <td>Morphine</td>
    </tr>
    <tr>
        <td>Jon</td>
        <td>Guarnaccia</td>
        <td>Morphine</td>
    </tr>
    <tr>
        <td>Temple</td>
        <td>Starsmore</td>
        <td>Morphine</td>
    </tr>
    <tr>
        <td>Abi</td>
        <td>Nesmith</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Adam</td>
        <td>Hecatonchires</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Agatha</td>
        <td>Sawyer</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Agnes</td>
        <td>Duckworth</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Alice</td>
        <td>Donovan</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Amy</td>
        <td>Fuhrey</td>
        <td>Penicillin</td>
    </tr>
    <tr>
        <td>Amy</td>
        <td>McFly</td>
        <td>Penicillin</td>
    </tr>
</table>



### Show patient_id, diagnosis from admissions. Find patients admitted multiple times for the same diagnosis.


```sql
%%sql
SELECT
  patient_id,
  diagnosis
FROM admissions
GROUP BY
  patient_id,
  diagnosis
HAVING COUNT(*) > 1
LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>diagnosis</th>
    </tr>
    <tr>
        <td>320</td>
        <td>Pneumonia</td>
    </tr>
    <tr>
        <td>137</td>
        <td>Pregnancy</td>
    </tr>
</table>



### Show the city and the total number of patients in the city.

Order from most to least patients and then by city name ascending.


```sql
%%sql
SELECT
  city,
  COUNT(*) AS num_patients
FROM patients
GROUP BY city
ORDER BY num_patients DESC, city asc
LIMIT 10;
```





<table>
    <tr>
        <th>city</th>
        <th>num_patients</th>
    </tr>
    <tr>
        <td>Hamilton</td>
        <td>215</td>
    </tr>
    <tr>
        <td>Burlington</td>
        <td>33</td>
    </tr>
    <tr>
        <td>Toronto</td>
        <td>33</td>
    </tr>
    <tr>
        <td>Brantford</td>
        <td>20</td>
    </tr>
    <tr>
        <td>Stoney Creek</td>
        <td>17</td>
    </tr>
    <tr>
        <td>Ancaster</td>
        <td>14</td>
    </tr>
    <tr>
        <td>Cambridge</td>
        <td>9</td>
    </tr>
    <tr>
        <td>Barrie</td>
        <td>8</td>
    </tr>
    <tr>
        <td>Delhi</td>
        <td>6</td>
    </tr>
    <tr>
        <td>Dundas</td>
        <td>6</td>
    </tr>
</table>



### Show first name, last name and role of every person that is either patient or physician.

The roles are either "Patient" or "Physician"


```sql
%%sql
SELECT first_name, last_name, 'Patient' as role FROM patients
    union
SELECT first_name, last_name, 'Physician' FROM physicians
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
        <th>last_name</th>
        <th>role</th>
    </tr>
    <tr>
        <td>Lenny</td>
        <td>Holmes</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Vernon</td>
        <td>Halliwell</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Charles</td>
        <td>Wolfe</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Spiros</td>
        <td>Mangel</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Jane</td>
        <td>Mars</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Mary</td>
        <td>Knight</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Catherine</td>
        <td>Minoru</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Maggie</td>
        <td>Price</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Bertha</td>
        <td>Crowley</td>
        <td>Patient</td>
    </tr>
    <tr>
        <td>Harry</td>
        <td>Sofer</td>
        <td>Patient</td>
    </tr>
</table>



### Show all allergies ordered by popularity. Remove NULL values from query.


```sql
%%sql
SELECT
  allergies,
  COUNT(*) AS total_diagnosis
FROM patients
WHERE
  allergies IS NOT NULL
GROUP BY allergies
ORDER BY total_diagnosis DESC
LIMIT 10;
```





<table>
    <tr>
        <th>allergies</th>
        <th>total_diagnosis</th>
    </tr>
    <tr>
        <td>Penicillin</td>
        <td>113</td>
    </tr>
    <tr>
        <td>Codeine</td>
        <td>30</td>
    </tr>
    <tr>
        <td>Sulfa</td>
        <td>24</td>
    </tr>
    <tr>
        <td>ASA</td>
        <td>8</td>
    </tr>
    <tr>
        <td>Sulfa Drugs</td>
        <td>7</td>
    </tr>
    <tr>
        <td>Peanuts</td>
        <td>6</td>
    </tr>
    <tr>
        <td>Tylenol</td>
        <td>6</td>
    </tr>
    <tr>
        <td>Valporic Acid</td>
        <td>5</td>
    </tr>
    <tr>
        <td>Wheat</td>
        <td>4</td>
    </tr>
    <tr>
        <td>Hay Fever</td>
        <td>4</td>
    </tr>
</table>



### Show all patient's first_name, last_name, and birth_date who were born in the 1970s decade. Sort the list starting from the earliest birth_date.


```sql
%%sql
SELECT
  first_name,
  last_name,
  birth_date
FROM patients
WHERE
  EXTRACT (YEAR FROM birth_date) BETWEEN 1970 AND 1979
ORDER BY birth_date ASC
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
        <th>last_name</th>
        <th>birth_date</th>
    </tr>
    <tr>
        <td>Jadu</td>
        <td>Principal</td>
        <td>1970-03-28 00:00:00</td>
    </tr>
    <tr>
        <td>Kenny</td>
        <td>Skelton</td>
        <td>1970-05-29 00:00:00</td>
    </tr>
    <tr>
        <td>Temple</td>
        <td>LoPresti</td>
        <td>1970-06-08 00:00:00</td>
    </tr>
    <tr>
        <td>Dominic</td>
        <td>Poppins</td>
        <td>1971-02-18 00:00:00</td>
    </tr>
    <tr>
        <td>Robbie</td>
        <td>Wilde</td>
        <td>1971-03-27 00:00:00</td>
    </tr>
    <tr>
        <td>Richard</td>
        <td>Davis</td>
        <td>1971-08-03 00:00:00</td>
    </tr>
    <tr>
        <td>Tom</td>
        <td>Lovegood</td>
        <td>1971-11-27 00:00:00</td>
    </tr>
    <tr>
        <td>Joanna</td>
        <td>Cooper</td>
        <td>1972-01-15 00:00:00</td>
    </tr>
    <tr>
        <td>Freddie</td>
        <td>Landsman</td>
        <td>1972-03-16 00:00:00</td>
    </tr>
    <tr>
        <td>Sarah</td>
        <td>Daniels</td>
        <td>1972-07-22 00:00:00</td>
    </tr>
</table>



### Separate the last_name and first_name with a comma. Order the list by the first_name in decending order.

We want to display each patient's full name in a single column. Their last_name in all upper letters must appear first, then first_name in all lower case letters. EX: SMITH,jane


```sql
%%sql
SELECT
  CONCAT(UPPER(last_name), ',', LOWER(first_name)) AS new_name_format
FROM patients
ORDER BY first_name DESC
LIMIT 10;
```





<table>
    <tr>
        <th>new_name_format</th>
    </tr>
    <tr>
        <td>MILLER,zoe</td>
    </tr>
    <tr>
        <td>RIVIERA,woody</td>
    </tr>
    <tr>
        <td>BASHIR,woody</td>
    </tr>
    <tr>
        <td>HALE,winnie</td>
    </tr>
    <tr>
        <td>CLOCK,winnie</td>
    </tr>
    <tr>
        <td>LARKIN,winifred</td>
    </tr>
    <tr>
        <td>DINGLE,willie</td>
    </tr>
    <tr>
        <td>TEMPLIN,william</td>
    </tr>
    <tr>
        <td>MANU,will</td>
    </tr>
    <tr>
        <td>VINCENT,wilfred</td>
    </tr>
</table>



### Show the province_id(s), sum of height; where the total sum of its patient's height is greater than or equal to 7,000.


```python
%sql select * from patients limit 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>first_name</th>
        <th>last_name</th>
        <th>gender</th>
        <th>birth_date</th>
        <th>city</th>
        <th>province_id</th>
        <th>allergies</th>
        <th>height</th>
        <th>weight</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Donald</td>
        <td>Waterfield</td>
        <td>M</td>
        <td>1963-02-12 00:00:00</td>
        <td>Barrie</td>
        <td>ON</td>
        <td>None</td>
        <td>156</td>
        <td>65</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Mickey</td>
        <td>Baasha</td>
        <td>M</td>
        <td>1981-05-28 00:00:00</td>
        <td>Dundas</td>
        <td>ON</td>
        <td>Sulfa</td>
        <td>185</td>
        <td>76</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Jiji</td>
        <td>Sharma</td>
        <td>M</td>
        <td>1957-09-05 00:00:00</td>
        <td>Hamilton</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>194</td>
        <td>106</td>
    </tr>
    <tr>
        <td>4</td>
        <td>Blair</td>
        <td>Diaz</td>
        <td>M</td>
        <td>1967-01-07 00:00:00</td>
        <td>Hamilton</td>
        <td>ON</td>
        <td>None</td>
        <td>191</td>
        <td>104</td>
    </tr>
    <tr>
        <td>5</td>
        <td>Charles</td>
        <td>Wolfe</td>
        <td>M</td>
        <td>2017-11-19 00:00:00</td>
        <td>Orillia</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>47</td>
        <td>10</td>
    </tr>
    <tr>
        <td>6</td>
        <td>Sue</td>
        <td>Falcon</td>
        <td>F</td>
        <td>2017-09-30 00:00:00</td>
        <td>Ajax</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>43</td>
        <td>5</td>
    </tr>
    <tr>
        <td>7</td>
        <td>Thomas</td>
        <td>ONeill</td>
        <td>M</td>
        <td>1993-01-31 00:00:00</td>
        <td>Burlington</td>
        <td>ON</td>
        <td>None</td>
        <td>180</td>
        <td>117</td>
    </tr>
    <tr>
        <td>8</td>
        <td>Sonny</td>
        <td>Beckett</td>
        <td>M</td>
        <td>1952-12-11 00:00:00</td>
        <td>Port Hawkesbury</td>
        <td>NS</td>
        <td>None</td>
        <td>174</td>
        <td>105</td>
    </tr>
    <tr>
        <td>9</td>
        <td>Sister</td>
        <td>Spitzer</td>
        <td>F</td>
        <td>1966-10-15 00:00:00</td>
        <td>Toronto</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>173</td>
        <td>95</td>
    </tr>
    <tr>
        <td>10</td>
        <td>Cedric</td>
        <td>Coltrane</td>
        <td>M</td>
        <td>1961-11-10 00:00:00</td>
        <td>Toronto</td>
        <td>ON</td>
        <td>None</td>
        <td>157</td>
        <td>61</td>
    </tr>
</table>




```sql
%%sql
SELECT
  province_id,
  SUM(height) AS sum_height
FROM patients
GROUP BY province_id
HAVING SUM(height) >= 7000;
```





<table>
    <tr>
        <th>province_id</th>
        <th>sum_height</th>
    </tr>
    <tr>
        <td>ON</td>
        <td>76576</td>
    </tr>
</table>



### Show the difference between the largest weight and smallest weight for patients with the last name 'Maroni'.


```sql
%%sql
SELECT
  (MAX(weight) - MIN(weight)) AS weight_delta
FROM patients
WHERE last_name = 'Maroni';
```





<table>
    <tr>
        <th>weight_delta</th>
    </tr>
    <tr>
        <td>0</td>
    </tr>
</table>



### Show all of the days of the month (1-31) and how many admission_dates occurred on that day. Sort by the day with most admissions to least admissions.


```sql
%%sql
SELECT
  EXTRACT (DAY FROM admission_date) AS day_number,
  COUNT(*) AS number_of_admissions
FROM admissions
GROUP BY day_number
ORDER BY number_of_admissions DESC
LIMIT 10;
```





<table>
    <tr>
        <th>day_number</th>
        <th>number_of_admissions</th>
    </tr>
    <tr>
        <td>2</td>
        <td>21</td>
    </tr>
    <tr>
        <td>4</td>
        <td>19</td>
    </tr>
    <tr>
        <td>9</td>
        <td>18</td>
    </tr>
    <tr>
        <td>18</td>
        <td>16</td>
    </tr>
    <tr>
        <td>10</td>
        <td>16</td>
    </tr>
    <tr>
        <td>7</td>
        <td>16</td>
    </tr>
    <tr>
        <td>12</td>
        <td>16</td>
    </tr>
    <tr>
        <td>24</td>
        <td>15</td>
    </tr>
    <tr>
        <td>15</td>
        <td>15</td>
    </tr>
    <tr>
        <td>25</td>
        <td>15</td>
    </tr>
</table>



### Show all columns for patient_id 45's most recent admission_date.


```sql
%%sql
SELECT *
FROM admissions
WHERE patient_id = 45
ORDER BY admission_date DESC
LIMIT 1;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>admission_date</th>
        <th>discharge_date</th>
        <th>diagnosis</th>
        <th>attending_physician_id</th>
    </tr>
    <tr>
        <td>45</td>
        <td>2018-11-15 00:00:00</td>
        <td>2018-11-23 00:00:00</td>
        <td>Post Partum Hemmorage</td>
        <td>6</td>
    </tr>
</table>




```sql
%%sql
SELECT *
FROM admissions
WHERE
  patient_id = '45'
  AND admission_date = (
    SELECT MAX(admission_date)
    FROM admissions
    WHERE patient_id = '45'
  );
```





<table>
    <tr>
        <th>patient_id</th>
        <th>admission_date</th>
        <th>discharge_date</th>
        <th>diagnosis</th>
        <th>attending_physician_id</th>
    </tr>
    <tr>
        <td>45</td>
        <td>2018-11-15 00:00:00</td>
        <td>2018-11-23 00:00:00</td>
        <td>Post Partum Hemmorage</td>
        <td>6</td>
    </tr>
</table>



### Show patient_id, attending_physician_id, and diagnosis for admissions that match one of the given criteria.

1. Criteria 1: patient_id is an odd number and attending_physician_id is either 1, 5, or 19.
2. Criteria 2: attending_physician_id contains a 2 and the length of patient_id is 3 characters.


```sql
%%sql
SELECT
  patient_id,
  attending_physician_id,
  diagnosis
FROM admissions
WHERE
  (
    attending_physician_id IN (1, 5, 19)
    AND patient_id % 2 != 0
  )
  OR 
  (
    (attending_physician_id::text) LIKE '%2%'
    AND LENGTH(patient_id::text) = 3
  )
  LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>attending_physician_id</th>
        <th>diagnosis</th>
    </tr>
    <tr>
        <td>9</td>
        <td>19</td>
        <td>Ruptured Appendicitis</td>
    </tr>
    <tr>
        <td>13</td>
        <td>1</td>
        <td>Renal Failure</td>
    </tr>
    <tr>
        <td>15</td>
        <td>5</td>
        <td>Hiatal Hernia</td>
    </tr>
    <tr>
        <td>31</td>
        <td>19</td>
        <td>Cardiovascular Disease</td>
    </tr>
    <tr>
        <td>51</td>
        <td>1</td>
        <td>Undiagnosed Chest Pain</td>
    </tr>
    <tr>
        <td>100</td>
        <td>22</td>
        <td>Depression, Dementia</td>
    </tr>
    <tr>
        <td>100</td>
        <td>21</td>
        <td>Respiratory Failure</td>
    </tr>
    <tr>
        <td>103</td>
        <td>22</td>
        <td>Ovarian Cyst</td>
    </tr>
    <tr>
        <td>103</td>
        <td>2</td>
        <td>Basal Skull Fracture</td>
    </tr>
    <tr>
        <td>104</td>
        <td>25</td>
        <td>Abdominal Pain</td>
    </tr>
</table>



### Show first_name, last_name, and the total number of admissions attended for each physician.

Every admission has been attended by a physician.


```sql
%%sql
SELECT
  first_name,
  last_name,
  COUNT(*) as admissions_total
from admissions a
  JOIN physicians ph on ph.physician_id = a.attending_physician_id
GROUP BY first_name, last_name
LIMIT 10;
```





<table>
    <tr>
        <th>first_name</th>
        <th>last_name</th>
        <th>admissions_total</th>
    </tr>
    <tr>
        <td>Simon</td>
        <td>Santiago</td>
        <td>17</td>
    </tr>
    <tr>
        <td>Donna</td>
        <td>Greenwood</td>
        <td>15</td>
    </tr>
    <tr>
        <td>Larry</td>
        <td>Miller</td>
        <td>16</td>
    </tr>
    <tr>
        <td>Irene</td>
        <td>Brooks</td>
        <td>6</td>
    </tr>
    <tr>
        <td>Jenny</td>
        <td>Pulaski</td>
        <td>11</td>
    </tr>
    <tr>
        <td>Ralph</td>
        <td>Wilson</td>
        <td>18</td>
    </tr>
    <tr>
        <td>Tyrone</td>
        <td>Smart</td>
        <td>15</td>
    </tr>
    <tr>
        <td>Mickey</td>
        <td>Duval</td>
        <td>17</td>
    </tr>
    <tr>
        <td>Marie</td>
        <td>Brinkman</td>
        <td>15</td>
    </tr>
    <tr>
        <td>Miriam</td>
        <td>Tregre</td>
        <td>12</td>
    </tr>
</table>



### For each physicain, display their id, full name, and the first and last admission date they attended.


```sql
%%sql
SELECT
  physician_id,
  first_name || ' ' || last_name as full_name,
  MIN(admission_date) as first_admission_date,
  MAX(admission_date) as last_admission_date
from admissions a
  JOIN physicians ph on a.attending_physician_id = ph.physician_id
GROUP BY physician_id, full_name
LIMIT 10;
```





<table>
    <tr>
        <th>physician_id</th>
        <th>full_name</th>
        <th>first_admission_date</th>
        <th>last_admission_date</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Claude Walls</td>
        <td>2018-06-20 00:00:00</td>
        <td>2019-05-07 00:00:00</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Joshua Green</td>
        <td>2018-06-26 00:00:00</td>
        <td>2019-06-02 00:00:00</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Miriam Tregre</td>
        <td>2018-06-10 00:00:00</td>
        <td>2019-04-07 00:00:00</td>
    </tr>
    <tr>
        <td>4</td>
        <td>James Russo</td>
        <td>2018-06-15 00:00:00</td>
        <td>2019-04-19 00:00:00</td>
    </tr>
    <tr>
        <td>5</td>
        <td>Scott Hill</td>
        <td>2018-06-28 00:00:00</td>
        <td>2019-05-06 00:00:00</td>
    </tr>
    <tr>
        <td>6</td>
        <td>Tasha Phillips</td>
        <td>2018-08-02 00:00:00</td>
        <td>2019-06-02 00:00:00</td>
    </tr>
    <tr>
        <td>7</td>
        <td>Hazel Patterson</td>
        <td>2018-06-20 00:00:00</td>
        <td>2019-04-23 00:00:00</td>
    </tr>
    <tr>
        <td>8</td>
        <td>Mickey Duval</td>
        <td>2018-06-10 00:00:00</td>
        <td>2019-06-05 00:00:00</td>
    </tr>
    <tr>
        <td>9</td>
        <td>Jon Nelson</td>
        <td>2018-06-26 00:00:00</td>
        <td>2019-04-10 00:00:00</td>
    </tr>
    <tr>
        <td>10</td>
        <td>Monica Singleton</td>
        <td>2018-06-18 00:00:00</td>
        <td>2019-05-04 00:00:00</td>
    </tr>
</table>



### Display the total amount of patients for each province. Order by descending.


```sql
%%sql
SELECT
  province_name,
  COUNT(*) as patient_count
FROM patients pa
  join province_names pr on pr.province_id = pa.province_id
GROUP BY pr.province_id, province_name
ORDER BY patient_count desc
LIMIT 10;
```





<table>
    <tr>
        <th>province_name</th>
        <th>patient_count</th>
    </tr>
    <tr>
        <td>Ontario</td>
        <td>480</td>
    </tr>
    <tr>
        <td>Nova Scotia</td>
        <td>6</td>
    </tr>
    <tr>
        <td>British Columbia</td>
        <td>5</td>
    </tr>
    <tr>
        <td>Alberta</td>
        <td>5</td>
    </tr>
    <tr>
        <td>Manitoba</td>
        <td>3</td>
    </tr>
    <tr>
        <td>Saskatchewan</td>
        <td>1</td>
    </tr>
</table>



### For every admission, display the patient's full name, their admission diagnosis, and their physician's full name who diagnosed their problem.


```sql
%%sql
SELECT
  CONCAT(patients.first_name, ' ', patients.last_name) as patient_name,
  diagnosis,
  CONCAT(physicians.first_name,' ',physicians.last_name) as physician_name
FROM patients
  JOIN admissions ON admissions.patient_id = patients.patient_id
  JOIN physicians ON physicians.physician_id = admissions.attending_physician_id
LIMIT 10;
```





<table>
    <tr>
        <th>patient_name</th>
        <th>diagnosis</th>
        <th>physician_name</th>
    </tr>
    <tr>
        <td>Dirk Lindley</td>
        <td>Pain In Abdomen Left Side</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Annie Smart</td>
        <td>Cervical Spinal Tumor</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Hannah MacLeod</td>
        <td>Chlymidia</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Marvin Dredd</td>
        <td>Scatica</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Cordelia Sugden</td>
        <td>Active Labour</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Daniel Nelson</td>
        <td>Fibromyalgia</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Naoto Stewart</td>
        <td>Headache</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Maria Bluenight</td>
        <td>Osteoarthritis</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Joyce Bosch</td>
        <td>Total Hysterectomy</td>
        <td>Claude Walls</td>
    </tr>
    <tr>
        <td>Gala Littlefield</td>
        <td>Undiagnosed Chest Pain</td>
        <td>Claude Walls</td>
    </tr>
</table>



### Hard

### Show all of the patients grouped into weight groups. Show the total amount of patients in each weight group. Order the list by the weight group decending.

For example, if they weight 100 to 109 they are placed in the 100 weight group, 110-119 = 110 weight group, etc.


```sql
%%sql
SELECT
  COUNT(*) AS patients_in_group,
  FLOOR(weight / 10) * 10 AS weight_group
FROM patients
GROUP BY weight_group
ORDER BY weight_group DESC
LIMIT 10;
```





<table>
    <tr>
        <th>patients_in_group</th>
        <th>weight_group</th>
    </tr>
    <tr>
        <td>3</td>
        <td>140.0</td>
    </tr>
    <tr>
        <td>8</td>
        <td>130.0</td>
    </tr>
    <tr>
        <td>23</td>
        <td>120.0</td>
    </tr>
    <tr>
        <td>45</td>
        <td>110.0</td>
    </tr>
    <tr>
        <td>57</td>
        <td>100.0</td>
    </tr>
    <tr>
        <td>38</td>
        <td>90.0</td>
    </tr>
    <tr>
        <td>52</td>
        <td>80.0</td>
    </tr>
    <tr>
        <td>71</td>
        <td>70.0</td>
    </tr>
    <tr>
        <td>87</td>
        <td>60.0</td>
    </tr>
    <tr>
        <td>40</td>
        <td>50.0</td>
    </tr>
</table>



### Show patient_id, weight, height, isObese from the patients table.

Display isObese as a boolean 0 or 1.

Obese is defined as weight(kg)/(height(m)2) >= 30.

weight is in units kg.

height is in units cm.


```sql
%%sql
SELECT patient_id, weight, height, 
  (CASE 
      WHEN weight/(POWER(height/100.0,2)) >= 30 THEN
          1
      ELSE
          0
      END) AS isObese
FROM patients
LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>weight</th>
        <th>height</th>
        <th>isobese</th>
    </tr>
    <tr>
        <td>1</td>
        <td>65</td>
        <td>156</td>
        <td>0</td>
    </tr>
    <tr>
        <td>2</td>
        <td>76</td>
        <td>185</td>
        <td>0</td>
    </tr>
    <tr>
        <td>3</td>
        <td>106</td>
        <td>194</td>
        <td>0</td>
    </tr>
    <tr>
        <td>4</td>
        <td>104</td>
        <td>191</td>
        <td>0</td>
    </tr>
    <tr>
        <td>5</td>
        <td>10</td>
        <td>47</td>
        <td>1</td>
    </tr>
    <tr>
        <td>6</td>
        <td>5</td>
        <td>43</td>
        <td>0</td>
    </tr>
    <tr>
        <td>7</td>
        <td>117</td>
        <td>180</td>
        <td>1</td>
    </tr>
    <tr>
        <td>8</td>
        <td>105</td>
        <td>174</td>
        <td>1</td>
    </tr>
    <tr>
        <td>9</td>
        <td>95</td>
        <td>173</td>
        <td>1</td>
    </tr>
    <tr>
        <td>10</td>
        <td>61</td>
        <td>157</td>
        <td>0</td>
    </tr>
</table>



### Show patient_id, first_name, last_name, and attending physician's specialty.

Show only the patients who has a diagnosis as 'Hypertension' and the physician's first name is 'Lisa'

Check patients, admissions, and physicians tables for required information.


```sql
%%sql
SELECT
  p.patient_id,
  p.first_name AS patient_first_name,
  p.last_name AS patient_last_name,
  ph.specialty AS attending_physician_specialty
FROM patients p
  JOIN admissions a ON a.patient_id = p.patient_id
  JOIN physicians ph ON ph.physician_id = a.attending_physician_id
WHERE
  ph.first_name = 'Lisa' and
  a.diagnosis = 'Hypertension';
```





<table>
    <tr>
        <th>patient_id</th>
        <th>patient_first_name</th>
        <th>patient_last_name</th>
        <th>attending_physician_specialty</th>
    </tr>
    <tr>
        <td>54</td>
        <td>Molly</td>
        <td>Jackson</td>
        <td>Obstetrician/Gynecologist</td>
    </tr>
    <tr>
        <td>324</td>
        <td>Mary</td>
        <td>Matthews</td>
        <td>Obstetrician/Gynecologist</td>
    </tr>
</table>



### All patients who have gone through admissions, can see their medical documents on our site. Those patients are given a temporary password after their first admission. Show the patient_id and temp_password.

The password must be the following, in order:
1. patient_id
2. the numerical length of patient's last_name
3. year of patient's birth_date


```sql
%%sql
SELECT
  DISTINCT P.patient_id,
  CONCAT(
    P.patient_id,
    LENGTH(last_name),
    EXTRACT (YEAR from birth_date)
  ) AS temp_password
FROM patients P
  JOIN admissions A ON A.patient_id = P.patient_id
LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>temp_password</th>
    </tr>
    <tr>
        <td>244</td>
        <td>24481986</td>
    </tr>
    <tr>
        <td>64</td>
        <td>6441957</td>
    </tr>
    <tr>
        <td>155</td>
        <td>15591989</td>
    </tr>
    <tr>
        <td>47</td>
        <td>4791979</td>
    </tr>
    <tr>
        <td>339</td>
        <td>33971986</td>
    </tr>
    <tr>
        <td>40</td>
        <td>4071953</td>
    </tr>
    <tr>
        <td>9</td>
        <td>971966</td>
    </tr>
    <tr>
        <td>82</td>
        <td>8271990</td>
    </tr>
    <tr>
        <td>39</td>
        <td>3982016</td>
    </tr>
    <tr>
        <td>6</td>
        <td>662017</td>
    </tr>
</table>



### Each admission costs $50 for patients without insurance, and $10 for patients with insurance. All patients with an even patient_id have insurance.

Give each patient a 'Yes' if they have insurance, and a 'No' if they don't have insurance. Add up the admission_total cost for each has_insurance group.


```sql
%%sql
SELECT 
CASE WHEN patient_id % 2 = 0 Then 
    'Yes'
ELSE 
    'No' 
END as has_insurance,
SUM(CASE WHEN patient_id % 2 = 0 Then 
    10
ELSE 
    50 
END) as cost_after_insurance
FROM admissions 
GROUP BY has_insurance;
```





<table>
    <tr>
        <th>has_insurance</th>
        <th>cost_after_insurance</th>
    </tr>
    <tr>
        <td>No</td>
        <td>9850</td>
    </tr>
    <tr>
        <td>Yes</td>
        <td>2030</td>
    </tr>
</table>



### Show the provinces that has more patients identified as 'M' than 'F'. Must only show full province_name


```sql
%%sql
SELECT pr.province_name
FROM patients AS pa
  JOIN province_names AS pr ON pa.province_id = pr.province_id
GROUP BY pr.province_name
HAVING
  COUNT( CASE WHEN gender = 'M' THEN 1 END) > COUNT( CASE WHEN gender = 'F' THEN 1 END)
LIMIT 10;
```





<table>
    <tr>
        <th>province_name</th>
    </tr>
    <tr>
        <td>Manitoba</td>
    </tr>
    <tr>
        <td>Nova Scotia</td>
    </tr>
    <tr>
        <td>Alberta</td>
    </tr>
    <tr>
        <td>Ontario</td>
    </tr>
    <tr>
        <td>Saskatchewan</td>
    </tr>
</table>



### Show the percent of patients that have 'M' as their gender. Round the answer to the nearest hundreth number and in percent form.



```sql
%%sql
SELECT
  round(100 * avg(CASE WHEN  gender = 'M' THEN 1 ELSE 0 END), 2) || '%' AS percent_of_male_patients
FROM
  patients;
```





<table>
    <tr>
        <th>percent_of_male_patients</th>
    </tr>
    <tr>
        <td>54.60%</td>
    </tr>
</table>



## Extra

### Show patients who borned in or after 2005.


```sql
%%sql
SELECT *
FROM patients
WHERE EXTRACT(YEAR from birth_date) >= 2005
LIMIT 10;
```





<table>
    <tr>
        <th>patient_id</th>
        <th>first_name</th>
        <th>last_name</th>
        <th>gender</th>
        <th>birth_date</th>
        <th>city</th>
        <th>province_id</th>
        <th>allergies</th>
        <th>height</th>
        <th>weight</th>
    </tr>
    <tr>
        <td>5</td>
        <td>Charles</td>
        <td>Wolfe</td>
        <td>M</td>
        <td>2017-11-19 00:00:00</td>
        <td>Orillia</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>47</td>
        <td>10</td>
    </tr>
    <tr>
        <td>6</td>
        <td>Sue</td>
        <td>Falcon</td>
        <td>F</td>
        <td>2017-09-30 00:00:00</td>
        <td>Ajax</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>43</td>
        <td>5</td>
    </tr>
    <tr>
        <td>30</td>
        <td>Roderick</td>
        <td>Payne</td>
        <td>M</td>
        <td>2015-03-22 00:00:00</td>
        <td>Halifax</td>
        <td>NS</td>
        <td>None</td>
        <td>58</td>
        <td>17</td>
    </tr>
    <tr>
        <td>32</td>
        <td>Bertha</td>
        <td>Crowley</td>
        <td>F</td>
        <td>2009-03-14 00:00:00</td>
        <td>Delhi</td>
        <td>ON</td>
        <td>None</td>
        <td>125</td>
        <td>39</td>
    </tr>
    <tr>
        <td>35</td>
        <td>Anthony</td>
        <td>Maxwell</td>
        <td>M</td>
        <td>2011-02-11 00:00:00</td>
        <td>Oakville</td>
        <td>ON</td>
        <td>None</td>
        <td>92</td>
        <td>37</td>
    </tr>
    <tr>
        <td>38</td>
        <td>Kelly</td>
        <td>Hamilton</td>
        <td>F</td>
        <td>2010-09-29 00:00:00</td>
        <td>Stoney Creek</td>
        <td>ON</td>
        <td>Penicillin</td>
        <td>84</td>
        <td>36</td>
    </tr>
    <tr>
        <td>39</td>
        <td>Charles</td>
        <td>Andonuts</td>
        <td>M</td>
        <td>2016-05-20 00:00:00</td>
        <td>Hamilton</td>
        <td>ON</td>
        <td>None</td>
        <td>62</td>
        <td>15</td>
    </tr>
    <tr>
        <td>43</td>
        <td>Stone</td>
        <td>Cutting</td>
        <td>M</td>
        <td>2010-09-24 00:00:00</td>
        <td>Hamilton</td>
        <td>ON</td>
        <td>Codeine</td>
        <td>110</td>
        <td>42</td>
    </tr>
    <tr>
        <td>45</td>
        <td>Cross</td>
        <td>Gordon</td>
        <td>M</td>
        <td>2009-03-20 00:00:00</td>
        <td>Ancaster</td>
        <td>ON</td>
        <td>None</td>
        <td>125</td>
        <td>53</td>
    </tr>
    <tr>
        <td>50</td>
        <td>Phil</td>
        <td>Beckett</td>
        <td>M</td>
        <td>2014-10-11 00:00:00</td>
        <td>Ottawa</td>
        <td>ON</td>
        <td>None</td>
        <td>83</td>
        <td>26</td>
    </tr>
</table>



### Show last name of patients that ends with the letter 'A'


```sql
%%sql
SELECT
  last_name
FROM
  patients
WHERE
  last_name LIKE '%a'
LIMIT 10;
```

<table>
    <tr>
        <th>last_name</th>
    </tr>
    <tr>
        <td>Baasha</td>
    </tr>
    <tr>
        <td>Sharma</td>
    </tr>
    <tr>
        <td>Leela</td>
    </tr>
    <tr>
        <td>Kobayakawa</td>
    </tr>
    <tr>
        <td>Riviera</td>
    </tr>
    <tr>
        <td>Riviera</td>
    </tr>
    <tr>
        <td>Provenza</td>
    </tr>
    <tr>
        <td>Baasha</td>
    </tr>
    <tr>
        <td>Scarpetta</td>
    </tr>
    <tr>
        <td>Luca</td>
    </tr>
</table>