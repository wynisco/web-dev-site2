# Getting Started with Airflow


## Bash echo 

```py
import datetime as dt
from textwrap import dedent

from airflow import DAG
from airflow.operators.bash import BashOperator


default_args = {
    'depends_on_past': False,
    'owner': 'sparsh',
    'email': ['sprsag@gmail.com'],
    'email_on_retry': False,
    'start_date': dt.datetime(2022, 10, 16),
    'schedule_interval': '@weekly',
    'retries': 1,
    'retry_delay': dt.timedelta(minutes=50),
}


with DAG('SPR_BASH_ECHO_DAG',
         default_args=default_args,
         description='Bash Echo with Airflow',
         tags=['wysde2','dataeng'],
         ) as dag:

    print_date = BashOperator(task_id='print_date',
                              bash_command='date')
    
    

    sleep = BashOperator(task_id='sleep',
                         depends_on_past=False,
                         bash_command='sleep 5',
                         retries=3)
    
    print_date.doc_md = dedent(
        """\
    #### Task Documentation
    You can document your task using the attributes `doc_md` (markdown),
    `doc` (plain text), `doc_rst`, `doc_json`, `doc_yaml` which gets
    rendered in the UI's Task Instance Details page.
    ![img](http://montcs.bloomu.edu/~bobmon/Semesters/2012-01/491/import%20soul.png)
    """
    )

    dag.doc_md = __doc__  # providing that you have a docstring at the beginning of the DAG
    dag.doc_md = """
    This is a documentation placed anywhere
    """  # otherwise, type it like this
    templated_command = dedent(
        """
    {% for i in range(5) %}
        echo "{{ ds }}"
        echo "{{ macros.ds_add(ds, 7)}}"
    {% endfor %}
    """
    )

    templated = BashOperator(task_id='templated',
                             depends_on_past=False,
                             bash_command=templated_command)

    print_date >> [sleep, templated]
```

## Scooter data cleaning and filtering

```py
import os
import datetime as dt
from datetime import timedelta

from airflow import DAG
from airflow.operators.python_operator import PythonOperator

import pandas as pd


def clean_scooter(read_path, save_path):
    print("Cleaning Scooter data...")
    os.makedirs(read_path, exist_ok=True)
    os.makedirs(save_path, exist_ok=True)
    df=pd.read_csv(os.path.join(read_path, 'scooter.csv'))
    df.drop(columns=['region_id'], inplace=True)
    df.columns=[x.lower() for x in df.columns]
    df['started_at']=pd.to_datetime(df['started_at'],format='%m/%d/%Y %H:%M')
    df.to_csv(os.path.join(save_path, 'cleanscooter.csv'))


def filter_data(read_path, save_path):
    print("Filtering data...")
    os.makedirs(read_path, exist_ok=True)
    os.makedirs(save_path, exist_ok=True)
    df=pd.read_csv(os.path.join(read_path, 'cleanscooter.csv'))
    fromd = '2019-05-23'
    tod='2019-06-03'
    tofrom = df[(df['started_at']>fromd)&(df['started_at']<tod)]
    tofrom.to_csv(os.path.join(save_path, 'may23-june3.csv'))
    

default_args = {
    'owner': 'sparsh',
    'start_date': dt.datetime(2022, 7, 11),
    'retries': 1,
    'retry_delay': dt.timedelta(minutes=50),
}


with DAG('ScooterDAG',
         default_args=default_args,
         schedule_interval=timedelta(minutes=50),      # '0 * * * *',
         ) as dag:
    
    raw_path="{{ dag_run.conf['raw_path'] }}"
    refined_path="{{ dag_run.conf['refined_path'] }}"
    consumption_path="{{ dag_run.conf['consumption_path'] }}"
    
    cleanScooter = PythonOperator(task_id='cleanScooter',
                                      python_callable=clean_scooter,
                                        op_kwargs={"read_path": raw_path,
                                                 "save_path": refined_path})
    
    filterData = PythonOperator(task_id='filterData',
                                      python_callable=filter_data,
                                      op_kwargs={"read_path": refined_path,
                                                 "save_path": consumption_path})


cleanScooter >> filterData
```


## Data migration pipeline with Sqlalchemy

```py
from sqlalchemy import create_engine
import pandas as pd
import os
from datetime import timedelta,datetime
import airflow
from airflow import DAG
from airflow.operators.python import PythonOperator

default_args={
    'owner':'johndoe',
    'retries':5,
    'retry_delay':timedelta(minutes=2)
}

def migrate_data(path,db_table):
    engine = create_engine("")
    print(os.system('pwd'))
    df = pd.read_csv(path,sep="[,;:]",index_col=False)
    print("<<<<<<<<<<start migrating data>>>>>>>>>>>>>>")
    df.to_sql(db_table, con=engine, if_exists='replace',index_label='id')
    print("<<<<<<<<<<<<<<<<<<<completed>>>>>>>>>>>>>>>>")

with DAG(
    dag_id='dag_data',
    default_args=default_args,
    description='this dag handles data manipulations',
    start_date=airflow.utils.dates.days_ago(1),
    schedule_interval='@once'
)as dag:
    task1 = PythonOperator(
        task_id='migrate',
        python_callable=migrate_data,
        op_kwargs={
            "path": "./dags/dataset.csv",
            "db_table":"endpoints_trafficinfo"
        }
    )
    task1
```

## CSV to JSON transformation pipeline

```py
import os
import datetime as dt
from datetime import timedelta

from airflow import DAG
from airflow.operators.python_operator import PythonOperator

import pandas as pd

from faker import Faker
import csv


def generate_csv(save_path):
    print("Generating CSV file...")
    os.makedirs(save_path, exist_ok=True)
    output=open(os.path.join(save_path, 'data.csv'), 'w')
    fake=Faker()
    header=['name','age','street','city','state','zip','lng','lat']
    mywriter=csv.writer(output)
    mywriter.writerow(header)
    for r in range(1000):
        mywriter.writerow([fake.name(),fake.random_int(min=18, max=80, step=1), fake.street_address(), fake.city(),fake.state(),fake.zipcode(),fake.longitude(),fake.latitude()])
    output.close()


def csv_to_json(read_path, save_path):
    print("Converting CSV to JSON...")
    os.makedirs(read_path, exist_ok=True)
    os.makedirs(save_path, exist_ok=True)
    df = pd.read_csv(os.path.join(read_path, "data.csv"))
    for i, r in df.iterrows():
        print(r['name'])
    df.to_json(os.path.join(save_path, "fromAirflow.json"), orient='records')
    

default_args = {
    'owner': 'sparsh',
    'start_date': dt.datetime(2022, 7, 11),
    'retries': 1,
    'retry_delay': dt.timedelta(minutes=50),
}


with DAG('SPR_CSV_TO_JSON_DAG',
         default_args=default_args,
         schedule_interval=timedelta(minutes=50),      # '0 * * * *',
         ) as dag:
    
    raw_path="{{ dag_run.conf['raw_path'] }}"
    refined_path="{{ dag_run.conf['refined_path'] }}"
    
    generateCSV = PythonOperator(task_id='generateCSV',
                                      python_callable=generate_csv,
                                      op_kwargs={"save_path": raw_path})
    
    convertCSVtoJson = PythonOperator(task_id='convertCSVtoJson',
                                      python_callable=csv_to_json,
                                      op_kwargs={"read_path": raw_path,
                                                 "save_path": refined_path})


generateCSV >> convertCSVtoJson

# config: {"raw_path":"", "refined_path":""}
```


## ETL pipeline with Postgres

```py
import time
from datetime import datetime
from airflow.models.dag import DAG
from airflow.decorators import task
from airflow.utils.task_group import TaskGroup
from airflow.hooks.base_hook import BaseHook
from airflow.providers.postgres.operators.postgres import PostgresOperator
import pandas as pd
from sqlalchemy import create_engine

#extract tasks
@task()
def get_src_tables(file_path):
    df = pd.read_excel(file_path)
    print("Summary of src data table:\n", df.info())
    return df

@task()
def load_src_data(df: pd.DataFrame):
    conn = BaseHook.get_connection('postgres')
    engine = create_engine(f'postgresql://{conn.login}:{conn.password}@{conn.host}:{conn.port}/{conn.schema}')
    df.to_sql(f'src_AdvWorks', engine, if_exists='replace', index=False)
    print("Data imported successful")

#transform tasks
@task()
def transform_srcProduct():
    conn = BaseHook.get_connection('postgres')
    engine = create_engine(f'postgresql://{conn.login}:{conn.password}@{conn.host}:{conn.port}/{conn.schema}')
    pdf = pd.read_sql_query('SELECT * FROM public."src_DimProduct" ', engine)
    #drop columns
    revised = pdf[['ProductKey', 'ProductAlternateKey', 'ProductSubcategoryKey','WeightUnitMeasureCode', 'SizeUnitMeasureCode', 'EnglishProductName',
                   'StandardCost','FinishedGoodsFlag', 'Color', 'SafetyStockLevel', 'ReorderPoint','ListPrice', 'Size', 'SizeRange', 'Weight',
                   'DaysToManufacture','ProductLine', 'DealerPrice', 'Class', 'Style', 'ModelName', 'EnglishDescription', 'StartDate','EndDate', 'Status']]
    #replace nulls
    revised['WeightUnitMeasureCode'].fillna('0', inplace=True)
    revised['ProductSubcategoryKey'].fillna('0', inplace=True)
    revised['SizeUnitMeasureCode'].fillna('0', inplace=True)
    revised['StandardCost'].fillna('0', inplace=True)
    revised['ListPrice'].fillna('0', inplace=True)
    revised['ProductLine'].fillna('NA', inplace=True)
    revised['Class'].fillna('NA', inplace=True)
    revised['Style'].fillna('NA', inplace=True)
    revised['Size'].fillna('NA', inplace=True)
    revised['ModelName'].fillna('NA', inplace=True)
    revised['EnglishDescription'].fillna('NA', inplace=True)
    revised['DealerPrice'].fillna('0', inplace=True)
    revised['Weight'].fillna('0', inplace=True)
    # Rename columns with rename function
    revised = revised.rename(columns={"EnglishDescription": "Description", "EnglishProductName":"ProductName"})
    revised.to_sql(f'stg_DimProduct', engine, if_exists='replace', index=False)
    return {"table(s) processed ": "Data imported successful"}

#
@task()
def transform_srcProductSubcategory():
    conn = BaseHook.get_connection('postgres')
    engine = create_engine(f'postgresql://{conn.login}:{conn.password}@{conn.host}:{conn.port}/{conn.schema}')
    pdf = pd.read_sql_query('SELECT * FROM public."src_DimProductSubcategory" ', engine)
    #drop columns
    revised = pdf[['ProductSubcategoryKey','EnglishProductSubcategoryName', 'ProductSubcategoryAlternateKey','EnglishProductSubcategoryName', 'ProductCategoryKey']]
    # Rename columns with rename function
    revised = revised.rename(columns={"EnglishProductSubcategoryName": "ProductSubcategoryName"})
    revised.to_sql(f'stg_DimProductSubcategory', engine, if_exists='replace', index=False)
    return {"table(s) processed ": "Data imported successful"}

@task()
def transform_srcProductCategory():
    conn = BaseHook.get_connection('postgres')
    engine = create_engine(f'postgresql://{conn.login}:{conn.password}@{conn.host}:{conn.port}/{conn.schema}')
    pdf = pd.read_sql_query('SELECT * FROM public."src_DimProductCategory" ', engine)
    #drop columns
    revised = pdf[['ProductCategoryKey', 'ProductCategoryAlternateKey','EnglishProductCategoryName']]
    # Rename columns with rename function
    revised = revised.rename(columns={"EnglishProductCategoryName": "ProductCategoryName"})
    revised.to_sql(f'stg_DimProductCategory', engine, if_exists='replace', index=False)
    return {"table(s) processed ": "Data imported successful"}

#load
@task()
def prdProduct_model():
    conn = BaseHook.get_connection('postgres')
    engine = create_engine(f'postgresql://{conn.login}:{conn.password}@{conn.host}:{conn.port}/{conn.schema}')
    pc = pd.read_sql_query('SELECT * FROM public."stg_DimProductCategory" ', engine)
    p = pd.read_sql_query('SELECT * FROM public."stg_DimProduct" ', engine)
    p['ProductSubcategoryKey'] = p.ProductSubcategoryKey.astype(float)
    p['ProductSubcategoryKey'] = p.ProductSubcategoryKey.astype(int)
    ps = pd.read_sql_query('SELECT * FROM public."stg_DimProductSubcategory" ', engine)
    #join all three
    merged = p.merge(ps, on='ProductSubcategoryKey').merge(pc, on='ProductCategoryKey')
    merged.to_sql(f'prd_DimProductCategory', engine, if_exists='replace', index=False)
    return {"table(s) processed ": "Data imported successful"}


# [START how_to_task_group]
with DAG(dag_id="product_etl_dag",schedule_interval="0 9 * * *", start_date=datetime(2022, 3, 5),catchup=False,  tags=["product_model"]) as dag:

    with TaskGroup("extract_dimProudcts_load", tooltip="Extract and load source data") as extract_load_src:
        src_product_tbls = get_src_tables()
        load_dimProducts = load_src_data(src_product_tbls)
        #define order
        src_product_tbls >> load_dimProducts

    # [START howto_task_group_section_2]
    with TaskGroup("transform_src_product", tooltip="Transform and stage data") as transform_src_product:
        transform_srcProduct = transform_srcProduct()
        transform_srcProductSubcategory = transform_srcProductSubcategory()
        transform_srcProductCategory = transform_srcProductCategory()
        #define task order
        [transform_srcProduct, transform_srcProductSubcategory, transform_srcProductCategory]

    with TaskGroup("load_product_model", tooltip="Final Product model") as load_product_model:
        prd_Product_model = prdProduct_model()
        #define order
        prd_Product_model

    extract_load_src >> transform_src_product >> load_product_model
```
