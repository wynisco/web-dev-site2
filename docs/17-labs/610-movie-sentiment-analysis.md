# Movie Sentiment Analysis

## Setup the environment


```python
!mkdir -p ~/.aws
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
!pip install -q -U requests
!pip install -q -U boto3
!pip install -q -U ipython-sql
!pip install -q -U psycopg2-binary
!pip install -q -U matplotlib
!pip install -q -U reportlab
```


```python
import boto3
import zipfile
import json
import os
import io
import sys
import time
import psycopg2
import requests
import numpy as np
import tensorflow as tf
import pandas as pd
import matplotlib.pyplot as plt
from urllib.request import urlopen
from urllib.parse import urlparse
from tqdm.auto import tqdm

%reload_ext sql
```

## Connect to the Redshift cluster


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

iam_role = 'arn:aws:iam::684199068947:role/service-role/AmazonRedshift-CommandsAccessRole-20220921T223853'
staging_bucket = 'wysde2'
```

## URLs and Paths


```python
# Movies Source And Staging Folder
tmdb_movies_source_url  = 'https://hudsonmendes-datalake.s3.eu-west-2.amazonaws.com/kaggle/hudsonmendes/tmdb-movies-with-imdb_id.zip'
tmdb_movies_staging_folder = f'tmdb-movies-with-imdb_id/'

# Reviews Source and Staging Folder
tmdb_reviews_source_url  = 'https://hudsonmendes-datalake.s3.eu-west-2.amazonaws.com/kaggle/hudsonmendes/tmdb-reviews.zip'
tmdb_reviews_staging_folder = f'tmdb-reviews'

# IMDb Cast (Links)
imdb_cast_source_url = 'https://datasets.imdbws.com/title.principals.tsv.gz'
imdb_cast_staging_path = f'imdb-cast/imdb-cast-{int(time.time())}.tsv.gz'

# IMDb Cast (Names)
imdb_names_source_url = 'https://datasets.imdbws.com/name.basics.tsv.gz'
imdb_names_staging_path = f'imdb-cast/imdb-cast-names{int(time.time())}.tsv.gz'
```

## Pipeline

This Pipeline is composed of the following steps:

1. Unzip files from the Data Lake into our Staging S3
2. COPY data from Staging S3 to out Redshift Staging Tables
3. Extract, Transform and Load the data into our Data Warehouse Dimensions Table
4. Classify Sentiment of Movie Reviews using our Model, generating our Data Warehouse Facts Table

### Unzip files from the Data Lake into our Staging S3


```python
# Upload files within ZIP to S3 Staging
def stage_zip_files_to_s3(
        source_url,
        destination_bucket,
        destination_folder):
    s3 = boto3.client('s3')
    
    print(f'Downloading "{source_url}", please wait...')
    with urlopen(source_url) as res:
        buffer = io.BytesIO(res.read())
        file_zip = zipfile.ZipFile(buffer)
        print('Download completed.')

        print(f'Uploading each file from "{source_url}" to s3://{destination_bucket}/{destination_folder}')
        for inner_file_name in tqdm(file_zip.namelist(), 'extracting to s3'):
            inner_file_buffer = file_zip.read(inner_file_name) 
            s3.put_object(
                Bucket=staging_bucket,
                Key=os.path.join(destination_folder, inner_file_name),
                Body=inner_file_buffer)
            print(f'[ok] {inner_file_name}')

stage_zip_files_to_s3(
    source_url=tmdb_movies_source_url,
    destination_bucket=staging_bucket,
    destination_folder=tmdb_movies_staging_folder)

# Downloading "https://hudsonmendes-datalake.s3.eu-west-2.amazonaws.com/kaggle/hudsonmendes/tmdb-movies-with-imdb_id.zip", please wait...
# Download completed.
# Uploading each file in "https://hudsonmendes-datalake.s3.eu-west-2.amazonaws.com/kaggle/hudsonmendes/tmdb-movies-with-imdb_id.zip" to s3://wysde2/tmdb-movies-with-imdb_id/

# extracting to s3:   0%|          | 0/21 [00:00<?, ?it/s]

# [ok] tmdb-movies-2000.json
# [ok] tmdb-movies-2001.json
# [ok] tmdb-movies-2002.json
# [ok] tmdb-movies-2003.json
# [ok] tmdb-movies-2004.json
# [ok] tmdb-movies-2005.json
# [ok] tmdb-movies-2006.json
# [ok] tmdb-movies-2007.json
# [ok] tmdb-movies-2008.json
# [ok] tmdb-movies-2009.json
# [ok] tmdb-movies-2010.json
# [ok] tmdb-movies-2011.json
# [ok] tmdb-movies-2012.json
# [ok] tmdb-movies-2013.json
# [ok] tmdb-movies-2014.json
# [ok] tmdb-movies-2015.json
# [ok] tmdb-movies-2016.json
# [ok] tmdb-movies-2017.json
# [ok] tmdb-movies-2018.json
# [ok] tmdb-movies-2019.json
# [ok] tmdb-movies-2020.json

stage_zip_files_to_s3(
    source_url=tmdb_reviews_source_url,
    destination_bucket=staging_bucket,
    destination_folder=tmdb_reviews_staging_folder)

# Downloading "https://hudsonmendes-datalake.s3.eu-west-2.amazonaws.com/kaggle/hudsonmendes/tmdb-reviews.zip", please wait...
# Download completed.
# Uploading each file in "https://hudsonmendes-datalake.s3.eu-west-2.amazonaws.com/kaggle/hudsonmendes/tmdb-reviews.zip" to s3://wysde2/tmdb-reviews

# extracting to s3:   0%|          | 0/21 [00:00<?, ?it/s]

# [ok] tmdb-movies-2000-reviews.json
# [ok] tmdb-movies-2001-reviews.json
# [ok] tmdb-movies-2002-reviews.json
# [ok] tmdb-movies-2003-reviews.json
# [ok] tmdb-movies-2004-reviews.json
# [ok] tmdb-movies-2005-reviews.json
# [ok] tmdb-movies-2006-reviews.json
# [ok] tmdb-movies-2007-reviews.json
# [ok] tmdb-movies-2008-reviews.json
# [ok] tmdb-movies-2009-reviews.json
# [ok] tmdb-movies-2010-reviews.json
# [ok] tmdb-movies-2011-reviews.json
# [ok] tmdb-movies-2012-reviews.json
# [ok] tmdb-movies-2013-reviews.json
# [ok] tmdb-movies-2014-reviews.json
# [ok] tmdb-movies-2015-reviews.json
# [ok] tmdb-movies-2016-reviews.json
# [ok] tmdb-movies-2017-reviews.json
# [ok] tmdb-movies-2018-reviews.json
# [ok] tmdb-movies-2019-reviews.json
# [ok] tmdb-movies-2020-reviews.json
```

Upload .tsv.gz to S3 Staging


```python
import os
import sys
import threading

class ProgressPercentage(object):

    def __init__(self, buffer):
        self.buffer = buffer
        self._size = sys.getsizeof(buffer)
        self.pbar = tqdm(total=self._size, unit='B', unit_scale=True, desc='uploading')
        self._lock = threading.Lock()

    def __call__(self, bytes_amount):
        with self._lock:
            self.pbar.update(bytes_amount)
            
    def close(self):
        self.pbar.update(self._size - self.pbar.n)
        self.pbar.close()

def stage_file_to_s3(
        source_url,
        destination_bucket,
        destination_path):

    s3 = boto3.client('s3')
    file_name = os.path.basename(source_url)
    file_size = int(urlopen(source_url).info().get('Content-Length', -1))
    pbar = tqdm(total=file_size, unit='B', unit_scale=True, desc='downloading')
    req = requests.get(source_url, stream=True)
    buffer = io.BytesIO()
    for chunk in req.iter_content(chunk_size=1024):
        if chunk:
            buffer.write(chunk)
            pbar.update(1024)
    pbar.close()
    
    pbar = ProgressPercentage(buffer)
    buffer.seek(0)
    s3.upload_fileobj(
        Fileobj=buffer,
        Bucket=staging_bucket,
        Key=destination_path,
        Callback=pbar)
    pbar.close()
    print(f'[ok] {file_name}')

stage_file_to_s3(
    source_url=imdb_cast_source_url,
    destination_bucket=staging_bucket,
    destination_path=imdb_cast_staging_path)

# downloading:  0%|          | 0.00/415M [00:00<?, ?B/s]
# uploading:   0%|          | 0.00/434M [00:00<?, ?B/s]
# [ok] title.principals.tsv.gz

stage_file_to_s3(
    source_url=imdb_names_source_url,
    destination_bucket=staging_bucket,
    destination_path=imdb_names_staging_path)

# downloading:   0%|          | 0.00/235M [00:00<?, ?B/s]
# uploading:   0%|          | 0.00/241M [00:00<?, ?B/s]
# [ok] name.basics.tsv.gz
```

### From S3 Staging to Reshift Staging Tables

IMDb Movies


```python
tmdb_movies_staging_url = f's3://{staging_bucket}/{tmdb_movies_staging_folder}'
```


```sql
%%sql
drop table if exists staging_tmdb_movies;

create table staging_tmdb_movies (
    id                integer,
    video             boolean,
    vote_count        bigint,
    vote_average      numeric(10, 6),
    title             varchar(256),
    release_date      timestamp,
    original_language varchar(10), 
    original_title    varchar(256),
    genre_ids         varchar(1024),
    backdrop_path     varchar(1024),
    adult             boolean,
    overview          varchar(10000),
    poster_path       varchar(1024),
    popularity        numeric(10, 6),
    id_imdb           varchar(32)
);

copy public.staging_tmdb_movies
from :tmdb_movies_staging_url
iam_role :iam_role
region 'us-east-1'
format as json 'auto';
```

```python
%sql select count(*) from public.staging_tmdb_movies;
```

<table>
    <tr>
        <th>count</th>
    </tr>
    <tr>
        <td>109222</td>
    </tr>
</table>



IMDb Movie Reviews


```python
tmdb_reviews_staging_url = f's3://{staging_bucket}/{tmdb_reviews_staging_folder}'
```


```sql
%%sql
drop table if exists staging_tmdb_reviews;

create table staging_tmdb_reviews (
    author   varchar(256),
    content  varchar(40000),
    id       varchar(40),
    url      varchar(256),
    movie_id integer
);

copy public.staging_tmdb_reviews
from :tmdb_reviews_staging_url
iam_role :iam_role
region 'us-east-1'
format as json 'auto';
```

```python
%sql select count(*) from public.staging_tmdb_reviews;
```

<table>
    <tr>
        <th>count</th>
    </tr>
    <tr>
        <td>7153</td>
    </tr>
</table>



IMDb Cast (Links)


```python
imdb_cast_staging_url = f's3://{staging_bucket}/{imdb_cast_staging_path}'
```


```sql
%%sql
drop table if exists staging_imdb_cast;

create table staging_imdb_cast (
    tconst     varchar(40),
    ordering   varchar(10),
    nconst     varchar(40),
    category   varchar(256),
    job        varchar(1024),
    characters varchar(2048)
);

copy public.staging_imdb_cast
from :imdb_cast_staging_url
iam_role :iam_role
region 'us-east-1'
delimiter '\t'
gzip;
```

```python
%sql select count(*) from public.staging_imdb_cast;
```

<table>
    <tr>
        <th>count</th>
    </tr>
    <tr>
        <td>52697448</td>
    </tr>
</table>



IMDb Cast (Names)


```python
imdb_names_staging_url = f's3://{staging_bucket}/{imdb_names_staging_path}'
```


```sql
%%sql
drop table if exists staging_imdb_names;

create table staging_imdb_names (
    nconst            varchar(40),
    primaryname       varchar(256),
    birthyear         varchar(10),
    deathyear         varchar(10),
    primaryprofession varchar(256),
    knownfortitles    varchar(256)
);

copy public.staging_imdb_names
from :imdb_names_staging_url
iam_role :iam_role
region 'us-east-1'
delimiter '\t'
gzip;
```

```python
%sql select count(*) from public.staging_imdb_names;
```

<table>
    <tr>
        <th>count</th>
    </tr>
    <tr>
        <td>12022550</td>
    </tr>
</table>



### From Redshift Staging to Dimension Tables

Creating Tables


```sql
%%sql
drop table if exists public.dim_dates;
create table if not exists public.dim_dates
(
    date_id timestamp without time zone not null,
    year    integer not null,
    month   integer not null,
    day     integer,
    constraint dim_dates_pkey primary key (date_id)
);

drop table if exists public.dim_films;
create table if not exists public.dim_films
(
    film_id      varchar(32)  not null,
    date_id      timestamp    not null,
    title        varchar(256) not null,
    constraint dim_films_pkey primary key (film_id),
    constraint dim_films_fkey_dates foreign key (date_id) references dim_dates (date_id)
);

drop table if exists public.dim_cast;
create table if not exists public.dim_cast
(
    cast_id    varchar(32)  not null,
    film_id    varchar(32)  not null,
    full_name  varchar(256) not null,
    constraint dim_cast_pkey primary key (cast_id),
    constraint dim_cast_fkey_films foreign key (film_id) references dim_films (film_id)
);

drop table if exists public.dim_reviews;
create table if not exists public.dim_reviews
(
    review_id varchar(32)    not null,
    film_id   varchar(32)    not null,
    text      varchar(40000) not null,
    constraint dim_reviews_pkey primary key (review_id),
    constraint dim_reviews_fkey_films foreign key (film_id) references dim_films (film_id)
);

drop table if exists public.fact_film_review_sentiments;
create table if not exists public.fact_film_review_sentiments
(
    date_id                timestamp without time zone not null,
    film_id                varchar(32) not null,
    review_id              varchar(32) not null,
    review_sentiment_class integer     not null,
    constraint fact_films_review_sentiments_pkey primary key (date_id, film_id, review_id),
    constraint fact_films_review_sentiments_fkey_dates foreign key (date_id) references dim_dates (date_id),
    constraint fact_films_review_sentiments_fkey_films foreign key (film_id) references dim_films (film_id),
    constraint fact_films_review_sentiments_fkey_reviews foreign key (review_id) references dim_reviews (review_id)
);

drop table if exists public.fact_cast_review_sentiments;
create table if not exists public.fact_cast_review_sentiments
(
    date_id                timestamp without time zone not null,
    cast_id                varchar(32) not null,
    review_id              varchar(32) not null,
    review_sentiment_class integer     not null,
    constraint fact_cast_review_sentiments_pkey primary key (date_id, cast_id, review_id),
    constraint fact_cast_review_sentiments_fkey_dates foreign key (date_id) references dim_dates (date_id),
    constraint fact_cast_review_sentiments_fkey_cast foreign key (cast_id) references dim_cast (cast_id),
    constraint fact_cast_review_sentiments_fkey_reviews foreign key (review_id) references dim_reviews (review_id)
);
```

dim_dates


```sql
%%sql
truncate table dim_dates;

insert into dim_dates
select release_date as date_id,
       datepart(year, release_date)  as year,
       datepart(month, release_date) as month,
       datepart(day, release_date)   as day
from (
    select distinct release_date
    from staging_tmdb_movies
    where not release_date is null);
```

dim_films


```sql
%%sql
truncate table dim_films;

insert into dim_films (film_id, date_id, title)
select id, release_date, title
from staging_tmdb_movies
where not release_date is null;
```

dim_cast


```sql
%%sql
truncate table dim_cast;

insert into dim_cast (cast_id, film_id, full_name)
select imdbc.nconst, tmdbm.id, imdbn.primaryname
from staging_imdb_cast as imdbc
  inner join staging_imdb_names as imdbn on imdbc.nconst = imdbn.nconst
  inner join staging_tmdb_movies as tmdbm on tmdbm.id_imdb = imdbc.tconst
where not release_date is null
  and imdbc.category in ('actor', 'actress');
```

dim_reviews


```sql
%%sql
truncate table dim_reviews;

insert into dim_reviews (review_id, film_id, text)
select id, movie_id, content
from staging_tmdb_reviews;
```


fact_film_review_sentiments


```sql
%%sql
truncate table fact_film_review_sentiments;

insert into fact_film_review_sentiments (
    date_id,
    film_id,
    review_id,
    review_sentiment_class)
select df.date_id, df.film_id, dr.review_id, 0
from dim_films as df
    inner join dim_reviews as dr on df.film_id = dr.film_id
```


fact_cast_review_sentiments


```sql
%%sql
truncate table fact_cast_review_sentiments;

insert into fact_cast_review_sentiments (
    date_id,
    cast_id,
    review_id,
    review_sentiment_class)
select df.date_id, dc.cast_id, dr.review_id, 0
from dim_cast as dc
    inner join dim_films as df on dc.film_id = df.film_id
    inner join dim_reviews as dr on dc.film_id = dr.film_id
```


### Sentiment Classification


```python
!wget -q --show-progress https://github.com/datalaker/data-engineering-shared/raw/main/models/movie-sentiment-review-model.tar.gz
!tar -xvf movie-sentiment-review-model.tar.gz
```

```
movie-sentiment-rev 100%[===================>]   7.84M  --.-KB/s    in 0.09s   
movie-sentiment-classifier-model/
movie-sentiment-classifier-model/variables/
movie-sentiment-classifier-model/saved_model.pb
movie-sentiment-classifier-model/assets/
movie-sentiment-classifier-model/assets/tokenizer.json
movie-sentiment-classifier-model/variables/variables.data-00000-of-00001
movie-sentiment-classifier-model/variables/variables.index
```


```python
import tensorflow as tf
from tensorflow import keras

model = tf.saved_model.load('./movie-sentiment-classifier-model')

tokenizer = None
with open('./movie-sentiment-classifier-model/assets/tokenizer.json', 'r', encoding='utf-8') as tokenizer_file:
    tokenizer_json = json.dumps(json.load(tokenizer_file))
    tokenizer = keras.preprocessing.text.tokenizer_from_json(tokenizer_json)
```


```python
db = psycopg2.connect(CONN)
```


```python
reviews = []
cur = db.cursor()
cur.execute('select review_id, text from dim_reviews')
for review_id, text in tqdm(cur.fetchall(), desc='reviews'):
    reviews.append({'review_id': review_id, 'text': text })
cur.close()

review_texts = [ r['text'] for r in reviews ]
review_seqs  = tokenizer.texts_to_sequences(review_texts)
review_seqs  = tf.keras.preprocessing.sequence.pad_sequences(review_seqs, maxlen=500, dtype='float32', padding='post', value=0)
(len(reviews), len(review_texts), review_seqs.shape)
```

```
reviews:   0%|          | 0/7153 [00:00<?, ?it/s]
(7153, 7153, (7153, 500))
```

```python
review_preds = model(inputs=review_seqs)
len(review_preds)
```

```python
def update_review_sentiment_class_for(table):
    cur = db.cursor()
    try:
        sql = f"""update {table}
                 set review_sentiment_class = %s
                 where review_id = %s"""
        batch = []
        pbar = tqdm(enumerate(review_preds), total=len(review_preds), desc=table)
        for i, review_pred in pbar:
            review_id = reviews[i]['review_id']
            review_sentiment = -1 if np.argmax(review_preds[i]) else 1
            batch.append((review_sentiment, review_id))
            if len(batch) % 200 == 0:
                cur.executemany(sql, batch)
                db.commit()
                batch.clear()
                pbar.refresh()
        if len(batch) > 0:
            cur.executemany(sql, batch)
            db.commit()
            batch.clear()
            pbar.refresh()
        pbar.close()
        cur.close()
    except Exception as e:
        db.rollback()
        raise e
```


```python
update_review_sentiment_class_for('fact_film_review_sentiments')
```

```
fact_film_review_sentiments:   0%|          | 0/7153 [00:00<?, ?it/s]
```


```python
update_review_sentiment_class_for('fact_cast_review_sentiments')
```

```
fact_cast_review_sentiments:   0%|          | 0/7153 [00:00<?, ?it/s]
```

## Quality Checks

### Counts

Dates


```sql
%%sql dates_source_count <<
select count(distinct release_date)
from staging_tmdb_movies
```


```sql
%%sql dates_dest_count <<
select count(date_id)
from dim_dates
```


```python
print((dates_source_count[0][0], dates_dest_count[0][0]))
assert dates_source_count == dates_dest_count
```

    (7526, 7526)


Films


```sql
%%sql films_source_count <<
select count(id_imdb)
from staging_tmdb_movies
where not release_date is null
```

```sql
%%sql films_dest_count <<
select count(film_id)
from dim_films
```

```python
print((films_source_count[0][0], films_dest_count[0][0]))
assert films_source_count == films_dest_count
```

    (103780, 103780)


Reviews


```sql
%%sql reviews_source_count <<
select count(id)
from staging_tmdb_reviews
```

```sql
%%sql reviews_dest_count <<
select count(review_id)
from dim_reviews
```


```python
print((reviews_source_count[0][0], reviews_dest_count[0][0]))
assert reviews_source_count == reviews_dest_count
```

    (7153, 7153)


Cast


```sql
%%sql cast_source_count <<
select count(imdbc.nconst)
from staging_imdb_cast as imdbc
  inner join staging_tmdb_movies as tmdbm on imdbc.tconst = tmdbm.id_imdb
  inner join staging_imdb_names as imdbn on imdbc.nconst = imdbn.nconst
where not release_date is null
  and imdbc.category in ('actor', 'actress');
```

```sql
%%sql cast_dest_count <<
select count(cast_id)
from dim_cast
```

```python
print((cast_source_count[0][0], cast_dest_count[0][0]))
assert cast_source_count == cast_dest_count
```

    (348800, 348800)


Film Facts


```sql
%%sql film_fact_source_count <<
select count(0)
from dim_films as df
    inner join dim_reviews as dr on df.film_id = dr.film_id
```

```sql
%%sql film_fact_dest_count <<
select count(0)
from fact_film_review_sentiments
```

```python
print((film_fact_source_count[0][0], film_fact_dest_count[0][0]))
assert film_fact_source_count == film_fact_dest_count
```

    (7153, 7153)


Cast Facts


```sql
%%sql cast_fact_source_count <<
select count(0)
from dim_cast as dc
    inner join dim_reviews as dr on dc.film_id = dr.film_id
```

```sql
%%sql cast_fact_dest_count <<
select count(0)
from fact_cast_review_sentiments
```

```python
print((cast_fact_source_count[0][0], cast_fact_dest_count[0][0]))
assert cast_fact_source_count == cast_fact_dest_count
```

    (27810, 27810)


### Existence


```sql
%%sql films_not_in_facts <<
select df.film_id
from dim_films as df
  inner join dim_reviews as dr on df.film_id = dr.film_id
where df.film_id not in (select f.film_id from fact_film_review_sentiments as f)
```

```python
assert not films_not_in_facts
```


```sql
%%sql reviews_not_in_facts <<
select dr.review_id
from dim_reviews as dr
where dr.review_id not in (select f.review_id from fact_film_review_sentiments as f)
```

```python
assert not reviews_not_in_facts
```


```sql
%%sql cast_not_in_facts <<
select dc.cast_id
from dim_cast as dc
  inner join dim_reviews as dr on dc.film_id = dr.film_id
where dc.cast_id not in (select f.cast_id from fact_cast_review_sentiments as f)
```

```python
assert not cast_not_in_facts
```

### Ranges


```sql
%%sql sentiment_classes <<
select distinct review_sentiment_class
from fact_film_review_sentiments
union
select distinct review_sentiment_class
from fact_cast_review_sentiments
```

```python
print(set([ x[0] for x in sentiment_classes ]))
assert set([ x[0] for x in sentiment_classes ]) == set([0])

# {0}
```



## Analysis

### Top 10 Films


```sql
%%sql
select df.title, sum(f.review_sentiment_class) as sentiment
from fact_film_review_sentiments as f
  inner join dim_films as df on f.film_id = df.film_id
  inner join dim_reviews as dr on f.review_id = dr.review_id
group by df.title
order by sentiment desc
limit 10;
```


<table>
    <tr>
        <th>title</th>
        <th>sentiment</th>
    </tr>
    <tr>
        <td>Spider-Man: Into the Spider-Verse</td>
        <td>38</td>
    </tr>
    <tr>
        <td>The Avengers</td>
        <td>31</td>
    </tr>
    <tr>
        <td>Avengers: Age of Ultron</td>
        <td>30</td>
    </tr>
    <tr>
        <td>Spider-Man</td>
        <td>23</td>
    </tr>
    <tr>
        <td>Avengers: Infinity War</td>
        <td>23</td>
    </tr>
    <tr>
        <td>Spider-Man 2</td>
        <td>19</td>
    </tr>
    <tr>
        <td>Thor</td>
        <td>18</td>
    </tr>
    <tr>
        <td>Assassin 33 A.D.</td>
        <td>18</td>
    </tr>
    <tr>
        <td>Big Hero 6</td>
        <td>14</td>
    </tr>
    <tr>
        <td>Doctor Strange</td>
        <td>14</td>
    </tr>
</table>



### 10 Worst Films


```sql
%%sql
select df.title, sum(f.review_sentiment_class) as sentiment
from fact_film_review_sentiments as f
  inner join dim_films as df on f.film_id = df.film_id
  inner join dim_reviews as dr on f.review_id = dr.review_id
group by df.title
order by sentiment asc
limit 10;
```


<table>
    <tr>
        <th>title</th>
        <th>sentiment</th>
    </tr>
    <tr>
        <td>Thor: The Dark World</td>
        <td>-12</td>
    </tr>
    <tr>
        <td>Godzilla: King of the Monsters</td>
        <td>-6</td>
    </tr>
    <tr>
        <td>Suicide Squad</td>
        <td>-6</td>
    </tr>
    <tr>
        <td>The Forest</td>
        <td>-5</td>
    </tr>
    <tr>
        <td>The Mummy</td>
        <td>-5</td>
    </tr>
    <tr>
        <td>Underworld: Blood Wars</td>
        <td>-5</td>
    </tr>
    <tr>
        <td>The Grudge</td>
        <td>-5</td>
    </tr>
    <tr>
        <td>Star Wars: The Rise of Skywalker</td>
        <td>-5</td>
    </tr>
    <tr>
        <td>Godzilla</td>
        <td>-5</td>
    </tr>
    <tr>
        <td>Star Wars: The Last Jedi</td>
        <td>-5</td>
    </tr>
</table>



### Top 10 Actors in Films with Best Reviews


```sql
%%sql
select dc.full_name, sum(f.review_sentiment_class) as sentiment
from fact_cast_review_sentiments as f
  inner join dim_cast as dc on f.cast_id = dc.cast_id
  inner join dim_reviews as dr on f.review_id = dr.review_id
group by dc.full_name
order by sentiment desc
limit 10;
```

<table>
    <tr>
        <th>full_name</th>
        <th>sentiment</th>
    </tr>
    <tr>
        <td>Chris Evans</td>
        <td>3654</td>
    </tr>
    <tr>
        <td>James Franco</td>
        <td>3038</td>
    </tr>
    <tr>
        <td>Robert Downey Jr.</td>
        <td>2912</td>
    </tr>
    <tr>
        <td>Mark Ruffalo</td>
        <td>2838</td>
    </tr>
    <tr>
        <td>Scarlett Johansson</td>
        <td>2368</td>
    </tr>
    <tr>
        <td>Willem Dafoe</td>
        <td>1848</td>
    </tr>
    <tr>
        <td>Chris Hemsworth</td>
        <td>1530</td>
    </tr>
    <tr>
        <td>Samuel L. Jackson</td>
        <td>1456</td>
    </tr>
    <tr>
        <td>Prakash Raj</td>
        <td>1400</td>
    </tr>
    <tr>
        <td>Hugh Jackman</td>
        <td>1170</td>
    </tr>
</table>



### Sentiment Over Time


```sql
%%sql
select dt.year, sum(f.review_sentiment_class) as sentiment
from fact_film_review_sentiments as f
    inner join dim_dates as dt on f.date_id = dt.date_id
group by dt.year
order by dt.year asc;
```


<table>
    <tr>
        <th>year</th>
        <th>sentiment</th>
    </tr>
    <tr>
        <td>2000</td>
        <td>48</td>
    </tr>
    <tr>
        <td>2001</td>
        <td>22</td>
    </tr>
    <tr>
        <td>2002</td>
        <td>57</td>
    </tr>
    <tr>
        <td>2003</td>
        <td>37</td>
    </tr>
    <tr>
        <td>2004</td>
        <td>42</td>
    </tr>
    <tr>
        <td>2005</td>
        <td>28</td>
    </tr>
    <tr>
        <td>2006</td>
        <td>48</td>
    </tr>
    <tr>
        <td>2007</td>
        <td>41</td>
    </tr>
    <tr>
        <td>2008</td>
        <td>59</td>
    </tr>
    <tr>
        <td>2009</td>
        <td>65</td>
    </tr>
    <tr>
        <td>2010</td>
        <td>75</td>
    </tr>
    <tr>
        <td>2011</td>
        <td>69</td>
    </tr>
    <tr>
        <td>2012</td>
        <td>149</td>
    </tr>
    <tr>
        <td>2013</td>
        <td>78</td>
    </tr>
    <tr>
        <td>2014</td>
        <td>192</td>
    </tr>
    <tr>
        <td>2015</td>
        <td>313</td>
    </tr>
    <tr>
        <td>2016</td>
        <td>233</td>
    </tr>
    <tr>
        <td>2017</td>
        <td>89</td>
    </tr>
    <tr>
        <td>2018</td>
        <td>148</td>
    </tr>
    <tr>
        <td>2019</td>
        <td>194</td>
    </tr>
    <tr>
        <td>2020</td>
        <td>34</td>
    </tr>
</table>



## Reporting

Sentiment Normalization


```python
sentiment_scale = 2.5

def sentiment_normalizer(max_sentiment):
    return lambda x: round(sentiment_scale + (sentiment_scale * x / max_sentiment), 2)
```

Sentiment Per Films


```sql
%%sql film_sentiments <<
select df.title, sum(f.review_sentiment_class) as sentiment
from fact_film_review_sentiments as f
  inner join dim_films as df on f.film_id = df.film_id
group by df.title
order by sentiment desc;
```


```python
df_films = pd.DataFrame(film_sentiments, columns=['title', 'sentiment'])
df_films = df_films.set_index('title')
df_films.describe()
df_films_normalizer = sentiment_normalizer(max(df_films.sentiment))
df_films['normalized_sentiment'] = df_films['sentiment'].map(df_films_normalizer)
df_films.head()
```

<table>
  <thead>
    <tr>
      <th></th>
      <th>sentiment</th>
      <th>normalized_sentiment</th>
    </tr>
    <tr>
      <th>title</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Spider-Man: Into the Spider-Verse</th>
      <td>38</td>
      <td>5.00</td>
    </tr>
    <tr>
      <th>The Avengers</th>
      <td>31</td>
      <td>4.54</td>
    </tr>
    <tr>
      <th>Avengers: Age of Ultron</th>
      <td>30</td>
      <td>4.47</td>
    </tr>
    <tr>
      <th>Spider-Man</th>
      <td>23</td>
      <td>4.01</td>
    </tr>
    <tr>
      <th>Avengers: Infinity War</th>
      <td>23</td>
      <td>4.01</td>
    </tr>
  </tbody>
</table>


Sentiment Per Actor


```sql
%%sql cast_sentiments <<
select dc.full_name, sum(f.review_sentiment_class) as sentiment
from fact_cast_review_sentiments f
  inner join dim_cast as dc on f.cast_id = dc.cast_id
group by dc.full_name
order by sentiment desc;
```

     * postgresql://admin:***@default.684199068947.us-east-1.redshift-serverless.amazonaws.com:5439/dev
    9766 rows affected.
    Returning data to local variable cast_sentiments



```python
df_cast = pd.DataFrame(cast_sentiments, columns=['full_name', 'sentiment'])
df_cast = df_cast.set_index('full_name')
df_cast_normalizer = sentiment_normalizer(max(df_cast.sentiment))
df_cast['normalized_sentiment'] = df_cast['sentiment'].map(df_cast_normalizer)
df_cast.head()
```


<table>
  <thead>
    <tr>
      <th></th>
      <th>sentiment</th>
      <th>normalized_sentiment</th>
    </tr>
    <tr>
      <th>full_name</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Chris Evans</th>
      <td>3654</td>
      <td>5.00</td>
    </tr>
    <tr>
      <th>James Franco</th>
      <td>3038</td>
      <td>4.58</td>
    </tr>
    <tr>
      <th>Robert Downey Jr.</th>
      <td>2912</td>
      <td>4.49</td>
    </tr>
    <tr>
      <th>Mark Ruffalo</th>
      <td>2838</td>
      <td>4.44</td>
    </tr>
    <tr>
      <th>Scarlett Johansson</th>
      <td>2368</td>
      <td>4.12</td>
    </tr>
  </tbody>
</table>


Sentiment Per Year


```sql
%%sql year_sentiments <<
select dt.year, sum(f.review_sentiment_class) as sentiment
from fact_film_review_sentiments as f
    inner join dim_dates as dt on f.date_id = dt.date_id
group by dt.year
order by dt.year asc;
```

     * postgresql://admin:***@default.684199068947.us-east-1.redshift-serverless.amazonaws.com:5439/dev
    21 rows affected.
    Returning data to local variable year_sentiments



```python
df_year = pd.DataFrame(year_sentiments, columns=['year', 'sentiment'])
df_year = df_year.set_index('year')
df_year.transpose()
```

<table>
  <thead>
    <tr>
      <th>year</th>
      <th>2000</th>
      <th>2001</th>
      <th>2002</th>
      <th>2003</th>
      <th>2004</th>
      <th>2005</th>
      <th>2006</th>
      <th>2007</th>
      <th>2008</th>
      <th>2009</th>
      <th>...</th>
      <th>2011</th>
      <th>2012</th>
      <th>2013</th>
      <th>2014</th>
      <th>2015</th>
      <th>2016</th>
      <th>2017</th>
      <th>2018</th>
      <th>2019</th>
      <th>2020</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>sentiment</th>
      <td>48</td>
      <td>22</td>
      <td>57</td>
      <td>37</td>
      <td>42</td>
      <td>28</td>
      <td>48</td>
      <td>41</td>
      <td>59</td>
      <td>65</td>
      <td>...</td>
      <td>69</td>
      <td>149</td>
      <td>78</td>
      <td>192</td>
      <td>313</td>
      <td>233</td>
      <td>89</td>
      <td>148</td>
      <td>194</td>
      <td>34</td>
    </tr>
  </tbody>
</table>



```python
from datetime import datetime
from reportlab.lib.units import cm
from reportlab.lib.utils import ImageReader
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image, Table, TableStyle, Spacer, PageBreak
from reportlab.lib.colors import black
```


```python
year  = str(datetime.now().year).rjust(4, '0')
month = str(datetime.now().month).rjust(2, '0')
day   = str(datetime.now().day).rjust(2, '0')
title = f'TMDb, Film Review Sentiment Analysis ({year}-{month}-{day})'

os.makedirs('images', exist_ok=True)
```


```python
# Chart: Review Distribution per Films
film_review_distro_path = './images/film_review_distro_fig.png'
film_review_distro_fig = df_films[['sentiment']] \
    .plot \
    .density(bw_method=1, grid=True, figsize=(7, 3)) \
    .get_figure()
film_review_distro_fig.savefig(film_review_distro_path, format='png')
```
    
```python
# Chart: Sentiment over Time
year_review_distro_path = './images/year_review_distro_fig.png'
year_review_distro_fig = df_year \
    .plot \
    .bar(grid=True, figsize=(7, 4)) \
    .get_figure()
year_review_distro_fig.savefig(year_review_distro_path, format='png')
```

```python
# Table: Top 10 Films
top_10_films= df_films[['normalized_sentiment']].head(10)
```


```python
# Table: Worst 10 Films
worst_10_films= df_films[['normalized_sentiment']] \
    .tail(10) \
    .sort_values(by='normalized_sentiment', ascending=True)
```


```python
# Table: Top 10 Cast
top_10_cast = df_cast[['normalized_sentiment']].head(10)
```


```python
!wget -q --show-progress https://github.com/datalaker/data-engineering-shared/raw/main/images/the_movie_db.png -O images/header.png
```

    images/header.png   100%[===================>] 176.62K  --.-KB/s    in 0.02s   



```python
doc = SimpleDocTemplate('report.pdf', pagesize=A4, rightMargin=cm, leftMargin=cm, topMargin=cm, bottomMargin=cm)
doc.title = title
width, height = A4

style_title = getSampleStyleSheet()["title"]
style_h1 = getSampleStyleSheet()["h1"]
style_normal = getSampleStyleSheet()["bu"]
style_grid = TableStyle([
    ('GRID', (0, 0), (-1, -1), 1, black),
    ('ALIGN', (1, 0), (-1, -1), 'RIGHT')])

br = Spacer(width, 20)

elements = []
elements.append(Paragraph(title, style=style_title))
elements.append(Image('./images/header.png', width-(2*cm), 220))
elements.append(br)

elements.append(Paragraph('Executive Summary', style=style_h1))
elements.append(Paragraph(f'The top film in our database, accorindg to TMDB reviews is <strong>{df_films.head(1).index[0]}</strong>', style=style_normal))
elements.append(br)

elements.append(Paragraph('Top 10 Films', style=style_h1))
elements.append(Paragraph('Here are the top 10 films in our database, according to the sentiment found in the TMDb reviews, ranging from 0 (negative) to 5 (positive).', style=style_normal))
elements.append(Table(top_10_films.copy().reset_index().to_numpy().tolist(), style=style_grid))
elements.append(br)

elements.append(Paragraph('Worst 10 Films', style=style_h1))
elements.append(Paragraph('Here are the worst 10 films in our database, according to the sentiment found in the TMDb reviews, ranging from 0 (negative) to 5 (positive).', style=style_normal))
elements.append(Table(worst_10_films.copy().reset_index().to_numpy().tolist(), style=style_grid))
elements.append(br)

elements.append(Paragraph('Review Sentiment Distibution', style=style_h1))
elements.append(Image(film_review_distro_path))
elements.append(br)

elements.append(Paragraph('Top 10 Actors/Actresses in Best Reviewed Films', style=style_h1))
elements.append(Paragraph('The ranking bellow is of actors that worked in films with positive reviews. Reviews are not made directly to actors, but to their films', style=style_normal))
elements.append(Table(top_10_cast.copy().reset_index().to_numpy().tolist(), style=style_grid))
elements.append(br)

elements.append(Paragraph('IMDb Average Voting vs TMDb Sentiment Reviews', style=style_h1))
elements.append(Image(year_review_distro_path))

doc.build(elements)
```


```python
!pip install -qq watermark
%reload_ext watermark
%watermark -a "Sparsh A." -m -iv -u -t -d

# Compiler    : GCC 7.5.0
# OS          : Linux
# Release     : 5.10.133+
# Machine     : x86_64
# Processor   : x86_64
# CPU cores   : 2
# Architecture: 64bit

# json      : 2.0.9
# tensorflow: 2.9.2
# sys       : 3.7.15 (default, Oct 12 2022, 19:14:55) 
# [GCC 7.5.0]
# psycopg2  : 2.9.4
# numpy     : 1.21.6
# pandas    : 1.3.5
# matplotlib: 3.5.3
# requests  : 2.28.1
# boto3     : 1.24.96
```

