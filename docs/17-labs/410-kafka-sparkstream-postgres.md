# Real-time ETL pipeline with Kafka and Spark Streaming

## Process flow

![](/img/tutorials/kafkaspark/process-diagram.drawio.svg)

## Setup

### Spark 3.0


```python
%%capture
!apt-get install openjdk-8-jdk-headless -qq > /dev/null
!wget -q https://archive.apache.org/dist/spark/spark-3.2.0/spark-3.2.0-bin-hadoop3.2.tgz
!tar xf spark-3.2.0-bin-hadoop3.2.tgz
!pip install -q findspark
!pip install -q pyspark
```


```python
import os

os.environ["JAVA_HOME"] = "/usr/lib/jvm/java-8-openjdk-amd64"
os.environ["SPARK_HOME"] = "/content/spark-3.2.0-bin-hadoop3.2"

import findspark
findspark.init()
```

### Postgres


```python
%%capture
# Install postgresql server
!sudo apt-get -y -qq update
!sudo apt-get -y -qq install postgresql
!sudo service postgresql start

# Setup a password `postgres` for username `postgres`
!sudo -u postgres psql -U postgres -c "ALTER USER postgres PASSWORD 'postgres';"
```


```python
! lsof -i -P -n | grep -E 'postgres'

# postgres  3669 postgres    7u  IPv4  46139      0t0  TCP 127.0.0.1:5432 (LISTEN)
# postgres  3669 postgres   11u  IPv4  46150      0t0  UDP 127.0.0.1:52935->127.0.0.1:52935 
# postgres  3671 postgres   11u  IPv4  46150      0t0  UDP 127.0.0.1:52935->127.0.0.1:52935 
# postgres  3672 postgres   11u  IPv4  46150      0t0  UDP 127.0.0.1:52935->127.0.0.1:52935 
# postgres  3673 postgres   11u  IPv4  46150      0t0  UDP 127.0.0.1:52935->127.0.0.1:52935 
# postgres  3674 postgres   11u  IPv4  46150      0t0  UDP 127.0.0.1:52935->127.0.0.1:52935 
# postgres  3675 postgres   11u  IPv4  46150      0t0  UDP 127.0.0.1:52935->127.0.0.1:52935 
# postgres  3676 postgres   11u  IPv4  46150      0t0  UDP 127.0.0.1:52935->127.0.0.1:52935 
```


```python
!psql --version
# psql (PostgreSQL) 10.21 (Ubuntu 10.21-0ubuntu0.18.04.1)
```


### Kafka


```python
%%capture
!pip install kafka-python
!curl -sSOL https://downloads.apache.org/kafka/3.2.0/kafka_2.12-3.2.0.tgz
!tar -xzf kafka_2.12-3.2.0.tgz
!./kafka_2.12-3.2.0/bin/zookeeper-server-start.sh -daemon ./kafka_2.12-3.2.0/config/zookeeper.properties
!./kafka_2.12-3.2.0/bin/kafka-server-start.sh -daemon ./kafka_2.12-3.2.0/config/server.properties
!echo "Waiting for 10 secs until kafka and zookeeper services are up and running"
!sleep 10
```

## Kafka Spark

![](/img/tutorials/kafkaspark/kafkaspark.png)

```python
!wget -q --show-progress https://repo1.maven.org/maven2/org/apache/spark/spark-sql-kafka-0-10_2.12/3.2.0/spark-sql-kafka-0-10_2.12-3.2.0.jar
!wget -q --show-progress https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/3.2.0/kafka-clients-3.2.0.jar
!wget -q --show-progress https://repo1.maven.org/maven2/org/apache/spark/spark-token-provider-kafka-0-10_2.12/3.2.0/spark-token-provider-kafka-0-10_2.12-3.2.0.jar
!wget -q --show-progress https://repo1.maven.org/maven2/org/apache/commons/commons-pool2/2.11.0/commons-pool2-2.11.0.jar
!wget -q --show-progress https://repo1.maven.org/maven2/org/postgresql/postgresql/42.4.0/postgresql-42.4.0.jar

# spark-sql-kafka-0-1 100%[===================>] 409.39K  --.-KB/s    in 0.02s   
# kafka-clients-3.2.0 100%[===================>]   4.71M  --.-KB/s    in 0.04s   
# spark-token-provide 100%[===================>]  55.29K  --.-KB/s    in 0.005s  
# commons-pool2-2.11. 100%[===================>] 141.86K  --.-KB/s    in 0.01s   
# postgresql-42.4.0.j 100%[===================>]   1018K  --.-KB/s    in 0.02s   
```


```python
from pyspark.sql import SparkSession

spark_jars = """/content/spark-sql-kafka-0-10_2.12-3.2.0.jar,
/content/kafka-clients-3.2.0.jar,
/content/spark-token-provider-kafka-0-10_2.12-3.2.0.jar,
/content/commons-pool2-2.11.0.jar,
/content/postgresql-42.4.0.jar
"""

spark = SparkSession \
    .builder \
    .appName("PySpark Structured Streaming") \
    .master("local[*]") \
    .config("spark.jars", spark_jars) \
    .config("spark.executor.extraClassPath", spark_jars) \
    .config("spark.executor.extraLibrary", spark_jars) \
    .config("spark.driver.extraClassPath", spark_jars) \
    .getOrCreate()
spark.sparkContext.setLogLevel('INFO')
```

## Kafka Producer


```python
from kafka import KafkaProducer
import json
import pandas as pd
from random import randint
import time
import uuid

# Constants
KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
KAFKA_TOPIC_NAME = 'ecommercetopic'
DATA_PATH = 'sample.csv'

# Download the data
!wget -q --show-progress https://github.com/datalaker/data-engineering-shared/raw/main/data/kafka_sample.csv -O {DATA_PATH}

# Serializer method
def serializer(data):
    return json.dumps(data).encode('utf-8')

# Producer object
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=serializer
)

# Dataframe to simulate real-time data flow
df = pd.read_csv(DATA_PATH)
print(df)
```

<table>
  <thead>
    <tr>
      <th></th>
      <th>event_time</th>
      <th>event_type</th>
      <th>product_id</th>
      <th>category_id</th>
      <th>category_code</th>
      <th>brand</th>
      <th>price</th>
      <th>user_id</th>
      <th>user_session</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2019-11-08 08:14:53 UTC</td>
      <td>view</td>
      <td>1004259</td>
      <td>2053013555631882655</td>
      <td>electronics.smartphone</td>
      <td>apple</td>
      <td>776.74</td>
      <td>568847318</td>
      <td>3fca063b-dbd6-4306-8c8f-be86cc369d6d</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2019-11-08 08:15:32 UTC</td>
      <td>view</td>
      <td>16000290</td>
      <td>2053013558223962683</td>
      <td>NaN</td>
      <td>tefal</td>
      <td>22.14</td>
      <td>547707147</td>
      <td>57b0fa7e-fcf0-4a22-b537-07c59fdfeaa2</td>
    </tr>
    <tr>
      <th>2</th>
      <td>2019-11-08 08:17:27 UTC</td>
      <td>view</td>
      <td>16000976</td>
      <td>2053013558223962683</td>
      <td>NaN</td>
      <td>pyrex</td>
      <td>9.76</td>
      <td>552474342</td>
      <td>380c380b-22c5-40e8-8d0e-daf409032477</td>
    </tr>
    <tr>
      <th>3</th>
      <td>2019-11-08 08:19:50 UTC</td>
      <td>view</td>
      <td>17300768</td>
      <td>2053013553853497655</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>56.61</td>
      <td>563883687</td>
      <td>e6a954a2-3cb6-47fc-89c5-77eb09016c8e</td>
    </tr>
    <tr>
      <th>4</th>
      <td>2019-11-08 08:21:58 UTC</td>
      <td>view</td>
      <td>4501335</td>
      <td>2053013563877884791</td>
      <td>appliances.kitchen.hob</td>
      <td>bosch</td>
      <td>334.37</td>
      <td>568857333</td>
      <td>f7c46092-13bd-418b-bc94-7e41bb5e660d</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>10029</th>
      <td>2019-11-21 16:43:15 UTC</td>
      <td>view</td>
      <td>1004886</td>
      <td>2053013555631882655</td>
      <td>electronics.smartphone</td>
      <td>oppo</td>
      <td>154.16</td>
      <td>522921329</td>
      <td>3020bc5b-3133-4988-94a5-c621779ed9fc</td>
    </tr>
    <tr>
      <th>10030</th>
      <td>2019-11-21 16:46:51 UTC</td>
      <td>purchase</td>
      <td>4804056</td>
      <td>2053013554658804075</td>
      <td>electronics.audio.headphone</td>
      <td>apple</td>
      <td>165.07</td>
      <td>566161134</td>
      <td>0555d9f8-d12c-4e38-9497-95e16102514d</td>
    </tr>
    <tr>
      <th>10031</th>
      <td>2019-11-21 16:46:59 UTC</td>
      <td>view</td>
      <td>5100402</td>
      <td>2053013553341792533</td>
      <td>electronics.clocks</td>
      <td>garmin</td>
      <td>262.30</td>
      <td>535237020</td>
      <td>52d7c479-4203-4b76-b9be-e6dd4bff5adb</td>
    </tr>
    <tr>
      <th>10032</th>
      <td>2019-11-21 16:49:35 UTC</td>
      <td>view</td>
      <td>29100105</td>
      <td>2053013565941482475</td>
      <td>appliances.personal.massager</td>
      <td>casada</td>
      <td>102.96</td>
      <td>553359592</td>
      <td>b45d8cb4-499c-49ff-8777-ac22cc7758f4</td>
    </tr>
    <tr>
      <th>10033</th>
      <td>2019-11-21 16:50:07 UTC</td>
      <td>purchase</td>
      <td>1004958</td>
      <td>2053013555631882655</td>
      <td>electronics.smartphone</td>
      <td>xiaomi</td>
      <td>334.11</td>
      <td>549564056</td>
      <td>d30915a0-eae6-487a-8bb4-7150bfda4760</td>
    </tr>
  </tbody>
</table>


```python
for _ in range(10):
    # Number of messages to send in this iteration
    n_msjs = randint(1, 10)
    # Getting random n_msjs from the dataframe
    sample_df = df.sample(n_msjs, axis=0)
    # Setting a timestamp
    sample_df.event_time = pd.Timestamp.now()
    sample_df.event_time = sample_df.event_time.astype('str')
    # Setting a unique ID
    sample_df['id'] = df.apply(lambda x: str(uuid.uuid1()), axis=1)
    # Creating a list of dictionaries from sampled dataframe
    sample = sample_df.to_dict('records')

    # Sending all messages in the sample to Kafka Topic
    for message in sample:
        print(message)
        producer.send(KAFKA_TOPIC_NAME, message)
    # Sleep randomly between 1 and 3 seconds
    time.sleep(randint(1, 3))

  # {'event_time': '2022-07-31 08:15:35.972490', 'event_type': 'view', 'product_id': 12600086, 'category_id': 2053013554751078769, 'category_code': 'appliances.kitchen.grill', 'brand': 'redmond', 'price': 51.46, 'user_id': 512391301, 'user_session': 'fbd30c28-1e91-4900-be0d-e90245a2ebf1', 'id': 'f477eeb6-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:35.972490', 'event_type': 'view', 'product_id': 1004133, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'xiaomi', 'price': 136.4, 'user_id': 569305509, 'user_session': '664883ca-ebe4-411f-b1f3-a3752a932f8f', 'id': 'f478b698-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:35.972490', 'event_type': 'view', 'product_id': 1005248, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'inoi', 'price': 46.05, 'user_id': 566653563, 'user_session': 'c33975ec-fdf5-4f24-a29a-609ad8c0ef56', 'id': 'f478b4cc-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:35.972490', 'event_type': 'view', 'product_id': 3600592, 'category_id': 2053013563810775923, 'category_code': 'appliances.kitchen.washer', 'brand': 'artel', 'price': 93.75, 'user_id': 548471972, 'user_session': 'de0225de-7b3a-470b-9292-06f2500954f4', 'id': 'f483001c-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:35.972490', 'event_type': 'view', 'product_id': 1004739, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'xiaomi', 'price': 200.73, 'user_id': 540066192, 'user_session': '93270524-ae1a-802e-6ae4-da07a30d1d3f', 'id': 'f47d5266-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:35.972490', 'event_type': 'view', 'product_id': 22700323, 'category_id': 2053013556168753601, 'category_code': nan, 'brand': 'bosch', 'price': 20.57, 'user_id': 574373384, 'user_session': 'f5d7aefd-b425-419a-acb0-371da1dad9bc', 'id': 'f477803e-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:35.972490', 'event_type': 'cart', 'product_id': 2500859, 'category_id': 2053013564003713919, 'category_code': 'appliances.kitchen.oven', 'brand': 'asel', 'price': 46.31, 'user_id': 546735350, 'user_session': 'fc187c5a-bf2b-448c-9f07-4a8132fa8b58', 'id': 'f488fe2c-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'cart', 'product_id': 12719963, 'category_id': 2053013553559896355, 'category_code': nan, 'brand': 'kapsen', 'price': 57.92, 'user_id': 555931035, 'user_session': 'b1b32d59-4353-478e-9ccd-f5c374003f69', 'id': 'f58817b8-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 1307310, 'category_id': 2053013558920217191, 'category_code': 'computers.notebook', 'brand': 'acer', 'price': 300.88, 'user_id': 515497865, 'user_session': 'fc359662-4743-4e8a-8001-ee09fa8022c0', 'id': 'f570e552-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 7900790, 'category_id': 2053013556487520725, 'category_code': 'furniture.kitchen.chair', 'brand': 'pituso', 'price': 95.73, 'user_id': 537293259, 'user_session': 'e7c4176f-ef93-434d-949b-028880322a7f', 'id': 'f57bdfac-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 17300752, 'category_id': 2053013553853497655, 'category_code': nan, 'brand': 'versace', 'price': 59.31, 'user_id': 520186641, 'user_session': '58eff6b1-cabe-408f-ab55-963698e62c96', 'id': 'f5804f42-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 1004767, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'samsung', 'price': 264.79, 'user_id': 540686713, 'user_session': 'd8d50d2d-19b2-4490-8a9c-9d7d795f5c06', 'id': 'f584b668-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 8300180, 'category_id': 2053013560220451507, 'category_code': nan, 'brand': 'chicco', 'price': 72.07, 'user_id': 544254572, 'user_session': '9cf050fb-0804-4b8b-86fa-34701672563d', 'id': 'f58396a2-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 1005100, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'samsung', 'price': 137.92, 'user_id': 549133439, 'user_session': 'f63d7bc7-7778-4707-88e4-bd48f8413c63', 'id': 'f5746880-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 1004237, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'apple', 'price': 1168.6, 'user_id': 572707613, 'user_session': 'c5b715d8-ff24-4f48-8e51-884a19d17613', 'id': 'f582707e-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 30000071, 'category_id': 2127425436764865054, 'category_code': 'construction.tools.welding', 'brand': nan, 'price': 74.36, 'user_id': 514666494, 'user_session': '831e8606-5622-45d9-b9f8-3bcdd4566d66', 'id': 'f584806c-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:37.657261', 'event_type': 'view', 'product_id': 19300027, 'category_id': 2053013566033757167, 'category_code': 'appliances.ironing_board', 'brand': 'nika', 'price': 56.6, 'user_id': 570922333, 'user_session': 'd9cc17b6-e945-4273-be75-35ef253ff20a', 'id': 'f58219bc-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 2501073, 'category_id': 2053013564003713919, 'category_code': 'appliances.kitchen.oven', 'brand': 'beko', 'price': 434.57, 'user_id': 560812488, 'user_session': '4646382c-fbcd-44dd-9ebb-99954fa606f6', 'id': 'f6d01404-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 7005060, 'category_id': 2053013560346280633, 'category_code': 'kids.carriage', 'brand': 'babytime', 'price': 56.37, 'user_id': 515022336, 'user_session': 'c2bee0bf-9d1b-49fc-91c1-8e6c42164bc4', 'id': 'f6c51a36-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 1003571, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'xiaomi', 'price': 250.87, 'user_id': 567444141, 'user_session': '17710265-98c4-4de4-83c8-90c01c003af9', 'id': 'f6cfcde6-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'cart', 'product_id': 1004870, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'samsung', 'price': 278.69, 'user_id': 570589069, 'user_session': 'a61ecd01-b7ab-4b11-8887-c248aca9877e', 'id': 'f6d2fd4a-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 12700931, 'category_id': 2053013553559896355, 'category_code': nan, 'brand': 'nokian', 'price': 53.03, 'user_id': 513429714, 'user_session': 'bdf880c7-c808-4da9-b076-6afa6cf2da8d', 'id': 'f6d3f6fa-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 26400292, 'category_id': 2053013563651392361, 'category_code': nan, 'brand': 'lucente', 'price': 185.85, 'user_id': 519029992, 'user_session': 'd986a468-b258-4776-80d0-6e806a8ab844', 'id': 'f6c788b6-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 19700091, 'category_id': 2053013559104766575, 'category_code': nan, 'brand': nan, 'price': 8.23, 'user_id': 540281175, 'user_session': '4f041253-401b-435b-9a16-e1fa90677d7e', 'id': 'f6c73050-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 1004249, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'apple', 'price': 795.9, 'user_id': 520115682, 'user_session': '9c84d65d-3078-4f48-8791-cd20590ba5e4', 'id': 'f6ceedcc-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 1005100, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'samsung', 'price': 136.76, 'user_id': 530588085, 'user_session': 'dac95799-7b47-4d7e-98e4-dd1082385733', 'id': 'f6c665da-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:39.869344', 'event_type': 'view', 'product_id': 12703117, 'category_id': 2053013553559896355, 'category_code': nan, 'brand': 'cordiant', 'price': 99.1, 'user_id': 544568763, 'user_session': '50ed6634-8cb9-4ffd-8b05-ebb0789329cf', 'id': 'f6daa2e8-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 1801766, 'category_id': 2053013554415534427, 'category_code': 'electronics.video.tv', 'brand': 'artel', 'price': 152.72, 'user_id': 521077745, 'user_session': '65321470-de8f-4d19-8265-05cb78585ebb', 'id': 'f8228c9c-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 3801058, 'category_id': 2053013566176363511, 'category_code': 'appliances.iron', 'brand': 'tefal', 'price': 180.16, 'user_id': 572964110, 'user_session': '300339b9-1a11-4a67-a052-eb92e5ee481b', 'id': 'f82066f6-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 1004873, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'samsung', 'price': 383.02, 'user_id': 553116689, 'user_session': 'e935f1b4-7846-4b77-94d1-7de61bc7d59f', 'id': 'f81682bc-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 4803597, 'category_id': 2053013554658804075, 'category_code': 'electronics.audio.headphone', 'brand': 'plantronics', 'price': 20.57, 'user_id': 545857808, 'user_session': '6f658f4d-6c8e-4a04-8df0-19e61fa38737', 'id': 'f81a225a-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'purchase', 'product_id': 27000042, 'category_id': 2053013564674802599, 'category_code': 'sport.trainer', 'brand': nan, 'price': 218.54, 'user_id': 572661524, 'user_session': '5ce234d8-87c7-4506-9c7d-274c45f92661', 'id': 'f81d4c28-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 1004659, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'samsung', 'price': 715.33, 'user_id': 514085961, 'user_session': '5b6905a0-766c-455d-9b1f-133b471e2752', 'id': 'f82d8fe8-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 1004258, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'apple', 'price': 818.53, 'user_id': 576927919, 'user_session': 'fc2c6c1f-561e-4ab7-abaf-4860951f1e97', 'id': 'f815d66e-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 1701169, 'category_id': 2053013553031414015, 'category_code': 'computers.peripherals.monitor', 'brand': 'lg', 'price': 179.93, 'user_id': 558922129, 'user_session': 'fc313267-ffda-43b0-89f8-b6a9af185cfe', 'id': 'f8271438-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 2800678, 'category_id': 2053013563835941749, 'category_code': 'appliances.kitchen.refrigerators', 'brand': 'midea', 'price': 270.25, 'user_id': 547001537, 'user_session': 'd5a6dc07-ab88-4534-a017-78889f3e0841', 'id': 'f815c976-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:42.088549', 'event_type': 'view', 'product_id': 18500016, 'category_id': 2053013552695869677, 'category_code': 'electronics.tablet', 'brand': 'wacom', 'price': 324.08, 'user_id': 573771278, 'user_session': '54a1e3cb-2837-4ff7-b674-8a9cf808a464', 'id': 'f82d4e2a-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:44.280538', 'event_type': 'view', 'product_id': 4803585, 'category_id': 2053013554658804075, 'category_code': 'electronics.audio.headphone', 'brand': 'huawei', 'price': 115.55, 'user_id': 571848339, 'user_session': '7ece8ae2-c1d3-4093-ae07-5f769a939246', 'id': 'f97c4bd2-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:44.280538', 'event_type': 'view', 'product_id': 1801690, 'category_id': 2053013554415534427, 'category_code': 'electronics.video.tv', 'brand': 'samsung', 'price': 405.92, 'user_id': 572646711, 'user_session': 'a2b0183d-c1e6-48d1-942b-0b190494d208', 'id': 'f96c6104-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:44.280538', 'event_type': 'cart', 'product_id': 1005115, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'apple', 'price': 958.3, 'user_id': 572685233, 'user_session': '77b1e68b-4e2d-408f-ba4f-64261d8eb736', 'id': 'f973e6ae-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:44.280538', 'event_type': 'view', 'product_id': 45200032, 'category_id': 2106075695351333719, 'category_code': nan, 'brand': nan, 'price': 7.98, 'user_id': 513555763, 'user_session': '0cff33e2-7d41-471a-9f17-f639fb870f8d', 'id': 'f9797f92-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:44.280538', 'event_type': 'view', 'product_id': 1004781, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'huawei', 'price': 262.52, 'user_id': 514580299, 'user_session': '172da58d-7aef-4955-83f0-093d4ceb45a8', 'id': 'f9760cb8-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:44.280538', 'event_type': 'view', 'product_id': 1005109, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'apple', 'price': 977.97, 'user_id': 567032142, 'user_session': '1eb08148-7827-488c-b193-473034f4dd9a', 'id': 'f975e95e-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:44.280538', 'event_type': 'view', 'product_id': 4200545, 'category_id': 2053013552351936731, 'category_code': 'appliances.environment.air_conditioner', 'brand': 'elenberg', 'price': 437.57, 'user_id': 530138116, 'user_session': 'f003ff12-7175-4f03-90cf-0846e275ac60', 'id': 'f97c13b0-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 11700411, 'category_id': 2053013554591695207, 'category_code': 'electronics.audio.acoustic', 'brand': 'fender', 'price': 1347.78, 'user_id': 569402671, 'user_session': '95604b8a-4b3d-4f5d-811a-4e5694a64070', 'id': 'fac774c6-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 1004856, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'samsung', 'price': 128.42, 'user_id': 512449042, 'user_session': '8a6240bc-d07d-491d-a475-50ff991897e3', 'id': 'fab998c4-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 1004249, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'apple', 'price': 796.55, 'user_id': 517013349, 'user_session': '219b6403-d1ef-4863-8eee-e664ff056b3a', 'id': 'facd7e66-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 1005004, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'huawei', 'price': 243.99, 'user_id': 529711599, 'user_session': 'ce4657a6-231e-4867-baf3-4c40874a83c0', 'id': 'facdb55c-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 22500081, 'category_id': 2053013552469377249, 'category_code': nan, 'brand': 'onkron', 'price': 9.76, 'user_id': 522014261, 'user_session': '57437960-cf84-4c76-9a90-327b96ab919a', 'id': 'faba00ca-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 4300363, 'category_id': 2053013552385491165, 'category_code': nan, 'brand': nan, 'price': 257.38, 'user_id': 522753200, 'user_session': '38f9c444-0da0-4ad5-891c-9979755b6240', 'id': 'fabe89b0-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 1003489, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'huawei', 'price': 212.36, 'user_id': 513400203, 'user_session': '74a482b0-f65e-49c1-8ca6-36ee997c54b2', 'id': 'fabf89a0-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 12400208, 'category_id': 2053013556252639687, 'category_code': 'construction.tools.drill', 'brand': 'makita', 'price': 136.43, 'user_id': 513378859, 'user_session': '9d2c2322-5712-4e93-9175-7aa3ad8784f0', 'id': 'fabb0a74-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'cart', 'product_id': 1005236, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'oppo', 'price': 231.41, 'user_id': 513516822, 'user_session': 'cf533cda-d298-490e-ba15-6509dbb16106', 'id': 'fab8ca84-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:46.488431', 'event_type': 'view', 'product_id': 1801544, 'category_id': 2053013554415534427, 'category_code': 'electronics.video.tv', 'brand': 'lg', 'price': 643.47, 'user_id': 517656538, 'user_session': 'd9aec5c5-dc74-4d23-b501-cd8467b78c2d', 'id': 'fac95e6c-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:47.685047', 'event_type': 'view', 'product_id': 18000050, 'category_id': 2053013558525952589, 'category_code': nan, 'brand': 'samsung', 'price': 25.71, 'user_id': 514451046, 'user_session': '795287c6-e224-455c-bb40-d29aa06d64f1', 'id': 'fb761ea4-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:47.685047', 'event_type': 'view', 'product_id': 21406531, 'category_id': 2053013561579406073, 'category_code': 'electronics.clocks', 'brand': nan, 'price': 128.19, 'user_id': 524270911, 'user_session': '9e67f378-fa97-489a-ac61-1b735c7b979b', 'id': 'fb85d056-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:47.685047', 'event_type': 'view', 'product_id': 12719632, 'category_id': 2053013553559896355, 'category_code': nan, 'brand': 'kapsen', 'price': 56.37, 'user_id': 561159890, 'user_session': '792b9dd9-a106-49c8-b84c-00f28f794874', 'id': 'fb72d852-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:47.685047', 'event_type': 'view', 'product_id': 28101813, 'category_id': 2053013564918072245, 'category_code': nan, 'brand': 'karat', 'price': 49.77, 'user_id': 512458385, 'user_session': 'd6cbb69d-80bd-4915-b0ac-d3393f96ce45', 'id': 'fb6a7d88-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:49.892186', 'event_type': 'view', 'product_id': 1003879, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'huawei', 'price': 666.43, 'user_id': 539959307, 'user_session': 'c423ddd9-f4d8-4cb6-9820-b71adc4f200f', 'id': 'fcbf3188-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:49.892186', 'event_type': 'view', 'product_id': 54900002, 'category_id': 2146660887203676486, 'category_code': 'apparel.costume', 'brand': nan, 'price': 46.33, 'user_id': 572720087, 'user_session': 'eb471f56-1657-4780-81da-19f97e30ea60', 'id': 'fccc21ea-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:49.892186', 'event_type': 'view', 'product_id': 28102032, 'category_id': 2053013564918072245, 'category_code': nan, 'brand': 'velvet', 'price': 205.93, 'user_id': 518602361, 'user_session': 'd83646ab-dbcb-4ae9-9362-c4b90f7f655a', 'id': 'fccaf02c-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:49.892186', 'event_type': 'view', 'product_id': 1004848, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'huawei', 'price': 643.23, 'user_id': 536610279, 'user_session': 'aae6ba3d-7e03-4c51-9fc2-f62e4da2c1b3', 'id': 'fcc76fba-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:49.892186', 'event_type': 'view', 'product_id': 2500566, 'category_id': 2053013564003713919, 'category_code': 'appliances.kitchen.oven', 'brand': 'asel', 'price': 43.73, 'user_id': 538973383, 'user_session': '9d7c2d5b-f266-4da6-8fd8-0edb538b6a82', 'id': 'fccaa496-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:49.892186', 'event_type': 'view', 'product_id': 9300012, 'category_id': 2053013554524586339, 'category_code': nan, 'brand': 'lg', 'price': 148.18, 'user_id': 519230729, 'user_session': '42f46031-31e1-412b-9a5c-6845bd49d783', 'id': 'fcc72528-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:51.093973', 'event_type': 'view', 'product_id': 12711941, 'category_id': 2053013553559896355, 'category_code': nan, 'brand': 'kormoran', 'price': 38.74, 'user_id': 567742743, 'user_session': '333e938c-e26d-4d91-9a11-a09e4b37aa38', 'id': 'fd7a2524-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:51.093973', 'event_type': 'view', 'product_id': 15100000, 'category_id': 2053013557024391671, 'category_code': nan, 'brand': nan, 'price': 849.19, 'user_id': 553329768, 'user_session': '3ecdd825-6457-4fcc-a026-adebe5f49b77', 'id': 'fd74ba62-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:53.295897', 'event_type': 'view', 'product_id': 1004751, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'samsung', 'price': 195.31, 'user_id': 563585962, 'user_session': '1486d3e4-f783-43f7-a6f2-e07a49fcbddb', 'id': 'fec39e4c-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:53.295897', 'event_type': 'cart', 'product_id': 1004249, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'apple', 'price': 739.04, 'user_id': 512711851, 'user_session': '7b62a3f3-5c94-4fa8-9aaf-11ca01c4bff4', 'id': 'fed13278-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:53.295897', 'event_type': 'view', 'product_id': 20100080, 'category_id': 2053013559473865347, 'category_code': nan, 'brand': 'nika', 'price': 20.57, 'user_id': 520652978, 'user_session': '5b14fd83-5e49-4e67-8d07-9f1e20d50ec5', 'id': 'fec851b2-10a8-11ed-adee-0242ac1c0002'}
  # {'event_time': '2022-07-31 08:15:53.295897', 'event_type': 'view', 'product_id': 1005160, 'category_id': 2053013555631882655, 'category_code': 'electronics.smartphone', 'brand': 'xiaomi', 'price': 202.31, 'user_id': 536157985, 'user_session': 'faaa093e-8599-4055-955a-12f0b4a49ecd', 'id': 'fed66342-10a8-11ed-adee-0242ac1c0002'}
```



```python
!kafka_2.12-3.2.0/bin/kafka-console-consumer.sh --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS --topic $KAFKA_TOPIC_NAME --from-beginning

  # {"event_time": "2022-07-31 08:15:35.972490", "event_type": "view", "product_id": 12600086, "category_id": 2053013554751078769, "category_code": "appliances.kitchen.grill", "brand": "redmond", "price": 51.46, "user_id": 512391301, "user_session": "fbd30c28-1e91-4900-be0d-e90245a2ebf1", "id": "f477eeb6-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:35.972490", "event_type": "view", "product_id": 1004133, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "xiaomi", "price": 136.4, "user_id": 569305509, "user_session": "664883ca-ebe4-411f-b1f3-a3752a932f8f", "id": "f478b698-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:35.972490", "event_type": "view", "product_id": 1005248, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "inoi", "price": 46.05, "user_id": 566653563, "user_session": "c33975ec-fdf5-4f24-a29a-609ad8c0ef56", "id": "f478b4cc-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:35.972490", "event_type": "view", "product_id": 3600592, "category_id": 2053013563810775923, "category_code": "appliances.kitchen.washer", "brand": "artel", "price": 93.75, "user_id": 548471972, "user_session": "de0225de-7b3a-470b-9292-06f2500954f4", "id": "f483001c-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:35.972490", "event_type": "view", "product_id": 1004739, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "xiaomi", "price": 200.73, "user_id": 540066192, "user_session": "93270524-ae1a-802e-6ae4-da07a30d1d3f", "id": "f47d5266-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:35.972490", "event_type": "view", "product_id": 22700323, "category_id": 2053013556168753601, "category_code": NaN, "brand": "bosch", "price": 20.57, "user_id": 574373384, "user_session": "f5d7aefd-b425-419a-acb0-371da1dad9bc", "id": "f477803e-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:35.972490", "event_type": "cart", "product_id": 2500859, "category_id": 2053013564003713919, "category_code": "appliances.kitchen.oven", "brand": "asel", "price": 46.31, "user_id": 546735350, "user_session": "fc187c5a-bf2b-448c-9f07-4a8132fa8b58", "id": "f488fe2c-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "cart", "product_id": 12719963, "category_id": 2053013553559896355, "category_code": NaN, "brand": "kapsen", "price": 57.92, "user_id": 555931035, "user_session": "b1b32d59-4353-478e-9ccd-f5c374003f69", "id": "f58817b8-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 1307310, "category_id": 2053013558920217191, "category_code": "computers.notebook", "brand": "acer", "price": 300.88, "user_id": 515497865, "user_session": "fc359662-4743-4e8a-8001-ee09fa8022c0", "id": "f570e552-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 7900790, "category_id": 2053013556487520725, "category_code": "furniture.kitchen.chair", "brand": "pituso", "price": 95.73, "user_id": 537293259, "user_session": "e7c4176f-ef93-434d-949b-028880322a7f", "id": "f57bdfac-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 17300752, "category_id": 2053013553853497655, "category_code": NaN, "brand": "versace", "price": 59.31, "user_id": 520186641, "user_session": "58eff6b1-cabe-408f-ab55-963698e62c96", "id": "f5804f42-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 1004767, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "samsung", "price": 264.79, "user_id": 540686713, "user_session": "d8d50d2d-19b2-4490-8a9c-9d7d795f5c06", "id": "f584b668-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 8300180, "category_id": 2053013560220451507, "category_code": NaN, "brand": "chicco", "price": 72.07, "user_id": 544254572, "user_session": "9cf050fb-0804-4b8b-86fa-34701672563d", "id": "f58396a2-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 1005100, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "samsung", "price": 137.92, "user_id": 549133439, "user_session": "f63d7bc7-7778-4707-88e4-bd48f8413c63", "id": "f5746880-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 1004237, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "apple", "price": 1168.6, "user_id": 572707613, "user_session": "c5b715d8-ff24-4f48-8e51-884a19d17613", "id": "f582707e-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 30000071, "category_id": 2127425436764865054, "category_code": "construction.tools.welding", "brand": NaN, "price": 74.36, "user_id": 514666494, "user_session": "831e8606-5622-45d9-b9f8-3bcdd4566d66", "id": "f584806c-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:37.657261", "event_type": "view", "product_id": 19300027, "category_id": 2053013566033757167, "category_code": "appliances.ironing_board", "brand": "nika", "price": 56.6, "user_id": 570922333, "user_session": "d9cc17b6-e945-4273-be75-35ef253ff20a", "id": "f58219bc-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 2501073, "category_id": 2053013564003713919, "category_code": "appliances.kitchen.oven", "brand": "beko", "price": 434.57, "user_id": 560812488, "user_session": "4646382c-fbcd-44dd-9ebb-99954fa606f6", "id": "f6d01404-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 7005060, "category_id": 2053013560346280633, "category_code": "kids.carriage", "brand": "babytime", "price": 56.37, "user_id": 515022336, "user_session": "c2bee0bf-9d1b-49fc-91c1-8e6c42164bc4", "id": "f6c51a36-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 1003571, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "xiaomi", "price": 250.87, "user_id": 567444141, "user_session": "17710265-98c4-4de4-83c8-90c01c003af9", "id": "f6cfcde6-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "cart", "product_id": 1004870, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "samsung", "price": 278.69, "user_id": 570589069, "user_session": "a61ecd01-b7ab-4b11-8887-c248aca9877e", "id": "f6d2fd4a-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 12700931, "category_id": 2053013553559896355, "category_code": NaN, "brand": "nokian", "price": 53.03, "user_id": 513429714, "user_session": "bdf880c7-c808-4da9-b076-6afa6cf2da8d", "id": "f6d3f6fa-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 26400292, "category_id": 2053013563651392361, "category_code": NaN, "brand": "lucente", "price": 185.85, "user_id": 519029992, "user_session": "d986a468-b258-4776-80d0-6e806a8ab844", "id": "f6c788b6-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 19700091, "category_id": 2053013559104766575, "category_code": NaN, "brand": NaN, "price": 8.23, "user_id": 540281175, "user_session": "4f041253-401b-435b-9a16-e1fa90677d7e", "id": "f6c73050-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 1004249, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "apple", "price": 795.9, "user_id": 520115682, "user_session": "9c84d65d-3078-4f48-8791-cd20590ba5e4", "id": "f6ceedcc-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 1005100, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "samsung", "price": 136.76, "user_id": 530588085, "user_session": "dac95799-7b47-4d7e-98e4-dd1082385733", "id": "f6c665da-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:39.869344", "event_type": "view", "product_id": 12703117, "category_id": 2053013553559896355, "category_code": NaN, "brand": "cordiant", "price": 99.1, "user_id": 544568763, "user_session": "50ed6634-8cb9-4ffd-8b05-ebb0789329cf", "id": "f6daa2e8-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 1801766, "category_id": 2053013554415534427, "category_code": "electronics.video.tv", "brand": "artel", "price": 152.72, "user_id": 521077745, "user_session": "65321470-de8f-4d19-8265-05cb78585ebb", "id": "f8228c9c-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 3801058, "category_id": 2053013566176363511, "category_code": "appliances.iron", "brand": "tefal", "price": 180.16, "user_id": 572964110, "user_session": "300339b9-1a11-4a67-a052-eb92e5ee481b", "id": "f82066f6-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 1004873, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "samsung", "price": 383.02, "user_id": 553116689, "user_session": "e935f1b4-7846-4b77-94d1-7de61bc7d59f", "id": "f81682bc-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 4803597, "category_id": 2053013554658804075, "category_code": "electronics.audio.headphone", "brand": "plantronics", "price": 20.57, "user_id": 545857808, "user_session": "6f658f4d-6c8e-4a04-8df0-19e61fa38737", "id": "f81a225a-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "purchase", "product_id": 27000042, "category_id": 2053013564674802599, "category_code": "sport.trainer", "brand": NaN, "price": 218.54, "user_id": 572661524, "user_session": "5ce234d8-87c7-4506-9c7d-274c45f92661", "id": "f81d4c28-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 1004659, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "samsung", "price": 715.33, "user_id": 514085961, "user_session": "5b6905a0-766c-455d-9b1f-133b471e2752", "id": "f82d8fe8-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 1004258, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "apple", "price": 818.53, "user_id": 576927919, "user_session": "fc2c6c1f-561e-4ab7-abaf-4860951f1e97", "id": "f815d66e-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 1701169, "category_id": 2053013553031414015, "category_code": "computers.peripherals.monitor", "brand": "lg", "price": 179.93, "user_id": 558922129, "user_session": "fc313267-ffda-43b0-89f8-b6a9af185cfe", "id": "f8271438-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 2800678, "category_id": 2053013563835941749, "category_code": "appliances.kitchen.refrigerators", "brand": "midea", "price": 270.25, "user_id": 547001537, "user_session": "d5a6dc07-ab88-4534-a017-78889f3e0841", "id": "f815c976-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:42.088549", "event_type": "view", "product_id": 18500016, "category_id": 2053013552695869677, "category_code": "electronics.tablet", "brand": "wacom", "price": 324.08, "user_id": 573771278, "user_session": "54a1e3cb-2837-4ff7-b674-8a9cf808a464", "id": "f82d4e2a-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:44.280538", "event_type": "view", "product_id": 4803585, "category_id": 2053013554658804075, "category_code": "electronics.audio.headphone", "brand": "huawei", "price": 115.55, "user_id": 571848339, "user_session": "7ece8ae2-c1d3-4093-ae07-5f769a939246", "id": "f97c4bd2-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:44.280538", "event_type": "view", "product_id": 1801690, "category_id": 2053013554415534427, "category_code": "electronics.video.tv", "brand": "samsung", "price": 405.92, "user_id": 572646711, "user_session": "a2b0183d-c1e6-48d1-942b-0b190494d208", "id": "f96c6104-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:44.280538", "event_type": "cart", "product_id": 1005115, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "apple", "price": 958.3, "user_id": 572685233, "user_session": "77b1e68b-4e2d-408f-ba4f-64261d8eb736", "id": "f973e6ae-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:44.280538", "event_type": "view", "product_id": 45200032, "category_id": 2106075695351333719, "category_code": NaN, "brand": NaN, "price": 7.98, "user_id": 513555763, "user_session": "0cff33e2-7d41-471a-9f17-f639fb870f8d", "id": "f9797f92-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:44.280538", "event_type": "view", "product_id": 1004781, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "huawei", "price": 262.52, "user_id": 514580299, "user_session": "172da58d-7aef-4955-83f0-093d4ceb45a8", "id": "f9760cb8-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:44.280538", "event_type": "view", "product_id": 1005109, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "apple", "price": 977.97, "user_id": 567032142, "user_session": "1eb08148-7827-488c-b193-473034f4dd9a", "id": "f975e95e-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:44.280538", "event_type": "view", "product_id": 4200545, "category_id": 2053013552351936731, "category_code": "appliances.environment.air_conditioner", "brand": "elenberg", "price": 437.57, "user_id": 530138116, "user_session": "f003ff12-7175-4f03-90cf-0846e275ac60", "id": "f97c13b0-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 11700411, "category_id": 2053013554591695207, "category_code": "electronics.audio.acoustic", "brand": "fender", "price": 1347.78, "user_id": 569402671, "user_session": "95604b8a-4b3d-4f5d-811a-4e5694a64070", "id": "fac774c6-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 1004856, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "samsung", "price": 128.42, "user_id": 512449042, "user_session": "8a6240bc-d07d-491d-a475-50ff991897e3", "id": "fab998c4-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 1004249, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "apple", "price": 796.55, "user_id": 517013349, "user_session": "219b6403-d1ef-4863-8eee-e664ff056b3a", "id": "facd7e66-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 1005004, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "huawei", "price": 243.99, "user_id": 529711599, "user_session": "ce4657a6-231e-4867-baf3-4c40874a83c0", "id": "facdb55c-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 22500081, "category_id": 2053013552469377249, "category_code": NaN, "brand": "onkron", "price": 9.76, "user_id": 522014261, "user_session": "57437960-cf84-4c76-9a90-327b96ab919a", "id": "faba00ca-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 4300363, "category_id": 2053013552385491165, "category_code": NaN, "brand": NaN, "price": 257.38, "user_id": 522753200, "user_session": "38f9c444-0da0-4ad5-891c-9979755b6240", "id": "fabe89b0-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 1003489, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "huawei", "price": 212.36, "user_id": 513400203, "user_session": "74a482b0-f65e-49c1-8ca6-36ee997c54b2", "id": "fabf89a0-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 12400208, "category_id": 2053013556252639687, "category_code": "construction.tools.drill", "brand": "makita", "price": 136.43, "user_id": 513378859, "user_session": "9d2c2322-5712-4e93-9175-7aa3ad8784f0", "id": "fabb0a74-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "cart", "product_id": 1005236, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "oppo", "price": 231.41, "user_id": 513516822, "user_session": "cf533cda-d298-490e-ba15-6509dbb16106", "id": "fab8ca84-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:46.488431", "event_type": "view", "product_id": 1801544, "category_id": 2053013554415534427, "category_code": "electronics.video.tv", "brand": "lg", "price": 643.47, "user_id": 517656538, "user_session": "d9aec5c5-dc74-4d23-b501-cd8467b78c2d", "id": "fac95e6c-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:47.685047", "event_type": "view", "product_id": 18000050, "category_id": 2053013558525952589, "category_code": NaN, "brand": "samsung", "price": 25.71, "user_id": 514451046, "user_session": "795287c6-e224-455c-bb40-d29aa06d64f1", "id": "fb761ea4-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:47.685047", "event_type": "view", "product_id": 21406531, "category_id": 2053013561579406073, "category_code": "electronics.clocks", "brand": NaN, "price": 128.19, "user_id": 524270911, "user_session": "9e67f378-fa97-489a-ac61-1b735c7b979b", "id": "fb85d056-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:47.685047", "event_type": "view", "product_id": 12719632, "category_id": 2053013553559896355, "category_code": NaN, "brand": "kapsen", "price": 56.37, "user_id": 561159890, "user_session": "792b9dd9-a106-49c8-b84c-00f28f794874", "id": "fb72d852-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:47.685047", "event_type": "view", "product_id": 28101813, "category_id": 2053013564918072245, "category_code": NaN, "brand": "karat", "price": 49.77, "user_id": 512458385, "user_session": "d6cbb69d-80bd-4915-b0ac-d3393f96ce45", "id": "fb6a7d88-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:49.892186", "event_type": "view", "product_id": 1003879, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "huawei", "price": 666.43, "user_id": 539959307, "user_session": "c423ddd9-f4d8-4cb6-9820-b71adc4f200f", "id": "fcbf3188-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:49.892186", "event_type": "view", "product_id": 54900002, "category_id": 2146660887203676486, "category_code": "apparel.costume", "brand": NaN, "price": 46.33, "user_id": 572720087, "user_session": "eb471f56-1657-4780-81da-19f97e30ea60", "id": "fccc21ea-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:49.892186", "event_type": "view", "product_id": 28102032, "category_id": 2053013564918072245, "category_code": NaN, "brand": "velvet", "price": 205.93, "user_id": 518602361, "user_session": "d83646ab-dbcb-4ae9-9362-c4b90f7f655a", "id": "fccaf02c-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:49.892186", "event_type": "view", "product_id": 1004848, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "huawei", "price": 643.23, "user_id": 536610279, "user_session": "aae6ba3d-7e03-4c51-9fc2-f62e4da2c1b3", "id": "fcc76fba-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:49.892186", "event_type": "view", "product_id": 2500566, "category_id": 2053013564003713919, "category_code": "appliances.kitchen.oven", "brand": "asel", "price": 43.73, "user_id": 538973383, "user_session": "9d7c2d5b-f266-4da6-8fd8-0edb538b6a82", "id": "fccaa496-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:49.892186", "event_type": "view", "product_id": 9300012, "category_id": 2053013554524586339, "category_code": NaN, "brand": "lg", "price": 148.18, "user_id": 519230729, "user_session": "42f46031-31e1-412b-9a5c-6845bd49d783", "id": "fcc72528-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:51.093973", "event_type": "view", "product_id": 12711941, "category_id": 2053013553559896355, "category_code": NaN, "brand": "kormoran", "price": 38.74, "user_id": 567742743, "user_session": "333e938c-e26d-4d91-9a11-a09e4b37aa38", "id": "fd7a2524-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:51.093973", "event_type": "view", "product_id": 15100000, "category_id": 2053013557024391671, "category_code": NaN, "brand": NaN, "price": 849.19, "user_id": 553329768, "user_session": "3ecdd825-6457-4fcc-a026-adebe5f49b77", "id": "fd74ba62-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:53.295897", "event_type": "view", "product_id": 1004751, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "samsung", "price": 195.31, "user_id": 563585962, "user_session": "1486d3e4-f783-43f7-a6f2-e07a49fcbddb", "id": "fec39e4c-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:53.295897", "event_type": "cart", "product_id": 1004249, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "apple", "price": 739.04, "user_id": 512711851, "user_session": "7b62a3f3-5c94-4fa8-9aaf-11ca01c4bff4", "id": "fed13278-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:53.295897", "event_type": "view", "product_id": 20100080, "category_id": 2053013559473865347, "category_code": NaN, "brand": "nika", "price": 20.57, "user_id": 520652978, "user_session": "5b14fd83-5e49-4e67-8d07-9f1e20d50ec5", "id": "fec851b2-10a8-11ed-adee-0242ac1c0002"}
  # {"event_time": "2022-07-31 08:15:53.295897", "event_type": "view", "product_id": 1005160, "category_id": 2053013555631882655, "category_code": "electronics.smartphone", "brand": "xiaomi", "price": 202.31, "user_id": 536157985, "user_session": "faaa093e-8599-4055-955a-12f0b4a49ecd", "id": "fed66342-10a8-11ed-adee-0242ac1c0002"}
  # Processed a total of 70 messages
```


```python
!kafka_2.12-3.2.0/bin/kafka-topics.sh --bootstrap-server $KAFKA_BOOTSTRAP_SERVERS --list
# __consumer_offsets
# ecommercetopic
```

## Spark Streaming


```python
from pyspark.sql.functions import *
from pyspark.sql.types import *
from pyspark.ml.feature import Normalizer, StandardScaler

import random
import pyspark
import sys
import time
from datetime import datetime

# Postgres constants
POSTGRES_HOST_NAME='localhost'
POSTGRES_PORT='5432'
POSTGRES_DATABASE='postgres'
POSTGRES_TABLE='kafka_pyspark'
POSTGRES_USR_NAME='postgres'
POSTGRES_PASSWORD='postgres'
POSTGRES_JDBC_URL=f'jdbc:postgresql://{POSTGRES_HOST_NAME}:{POSTGRES_PORT}/{POSTGRES_DATABASE}'
POSTGRES_DRIVER_CLASS='org.postgresql.Driver'

def save_to_postgres(current_df, epoch_id):
    db_credentials = {
        'user': POSTGRES_USR_NAME,
        'password': POSTGRES_PASSWORD,
        'driver': POSTGRES_DRIVER_CLASS
    }
    print('Saving to Postgresql')
    current_df \
        .write \
        .jdbc(
            url=POSTGRES_JDBC_URL,
            table=POSTGRES_TABLE,
            mode='append',
            properties=db_credentials
        )

print('Data Processing application started')
print(time.strftime("%Y-%m-%d %H:%M:%S"))

# Data Processing application started
# 2022-07-31 11:31:33

# # Extracting information from Kafka topic
# kafka_stream = spark \
#     .readStream \
#     .format('kafka') \
#     .option('kafka.bootstrap.servers', KAFKA_BOOTSTRAP_SERVERS) \
#     .option('subscribe', KAFKA_TOPIC_NAME) \
#     .option("kafka.security.protocol", "SASL_PLAINTEXT") \
#     .option("startingOffsets","earliest") \
#     .option("maxOffsetsPerTrigger","6000") \
#     .load()
# raw_info = kafka_stream.selectExpr("CAST(key AS STRING)", "CAST(value AS STRING)")

# Extracting information from Kafka topic
kafka_stream = spark \
    .readStream \
    .format('kafka') \
    .option('kafka.bootstrap.servers', KAFKA_BOOTSTRAP_SERVERS) \
    .option('subscribe', KAFKA_TOPIC_NAME) \
    .option("startingOffsets", "earliest") \
    .load()
raw_info = kafka_stream.selectExpr("CAST(value AS STRING)")

# # Extracting information from Kafka topic
# kafka_stream = spark \
#     .read \
#     .format('kafka') \
#     .option('kafka.bootstrap.servers', KAFKA_BOOTSTRAP_SERVERS) \
#     .option('subscribe', KAFKA_TOPIC_NAME) \
#     .option("startingOffsets","earliest") \
#     .option("startingOffsets", """{"ecommercetopic":{"0":5}}""") \
#     .option("endingOffsets", """{"endingOffsets":{"0":50}}""") \
#     .load()
# raw_info = kafka_stream.selectExpr("CAST(value AS STRING)")

# Building a Schema (columns and their types) to the information
# retrieved
df_schema = StructType() \
        .add('id', StringType()) \
        .add('event_time', StringType()) \
        .add('event_type', StringType()) \
        .add('product_id', StringType()) \
        .add('category_id', StringType()) \
        .add('category_code', StringType()) \
        .add('brand', StringType()) \
        .add('price', FloatType()) \
        .add('user_id', StringType()) \
        .add('user_session', StringType())

# Application of the schema to the information retrieved
df_raw = raw_info \
    .select(from_json(col('value'), df_schema).alias('dataframe'))
df_raw = df_raw.select('dataframe.*')

# ----- DATA PREPROCESSING -----

# Removing useless columns
df = df_raw.drop('product_id', 'category_id', 'user_id', 'user_session')\
# Splitting 'category_code' to find the department and product
split_col = split(df['category_code'], '\.')
df = df.withColumn('department', element_at(split_col, 1))
df = df.withColumn('product', element_at(split_col, -1))
# Removing column 'category_code'
df = df.drop('category_code')
# Creating revenue column
df = df.withColumn('revenue', when(df.event_type=='purchase', df.price).otherwise(0))
# Filling nans in 'brand', 'department' and 'product' columns
for c in ['brand', 'department', 'product']:
    df = df.withColumn(c, regexp_replace(c, 'NaN', 'other'))

# query = df \
#     .writeStream \
#     .format("console") \
#     .option("checkpointLocation", "/content/chkpt") \
#     .start()

# query.awaitTermination()

# Storing processed dataframe into POSTGRES database
df \
    .writeStream \
    .trigger(processingTime='15 seconds') \
    .outputMode('update') \
    .foreachBatch(save_to_postgres) \
    .start() \
    .awaitTermination()
```

## Validation


```python
%reload_ext sql
%sql postgresql://{POSTGRES_USR_NAME}:{POSTGRES_PASSWORD}@{POSTGRES_HOST_NAME}/{POSTGRES_DATABASE}

# 'Connected: postgres@postgres'
```

```python
%sql SELECT COUNT(*) FROM $POSTGRES_TABLE;
```

<table>
    <thead>
        <tr>
            <th>count</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>70</td>
        </tr>
    </tbody>
</table>


```python
%sql SELECT * FROM $POSTGRES_TABLE LIMIT 10;
```

<table>
    <thead>
        <tr>
            <th>id</th>
            <th>event_time</th>
            <th>event_type</th>
            <th>brand</th>
            <th>price</th>
            <th>department</th>
            <th>product</th>
            <th>revenue</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>f477eeb6-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:35.972490</td>
            <td>view</td>
            <td>redmond</td>
            <td>51.46</td>
            <td>appliances</td>
            <td>grill</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f478b698-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:35.972490</td>
            <td>view</td>
            <td>xiaomi</td>
            <td>136.4</td>
            <td>electronics</td>
            <td>smartphone</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f478b4cc-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:35.972490</td>
            <td>view</td>
            <td>inoi</td>
            <td>46.05</td>
            <td>electronics</td>
            <td>smartphone</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f483001c-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:35.972490</td>
            <td>view</td>
            <td>artel</td>
            <td>93.75</td>
            <td>appliances</td>
            <td>washer</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f47d5266-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:35.972490</td>
            <td>view</td>
            <td>xiaomi</td>
            <td>200.73</td>
            <td>electronics</td>
            <td>smartphone</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f477803e-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:35.972490</td>
            <td>view</td>
            <td>bosch</td>
            <td>20.57</td>
            <td>&quot;other&quot;</td>
            <td>&quot;other&quot;</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f488fe2c-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:35.972490</td>
            <td>cart</td>
            <td>asel</td>
            <td>46.31</td>
            <td>appliances</td>
            <td>oven</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f58817b8-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:37.657261</td>
            <td>cart</td>
            <td>kapsen</td>
            <td>57.92</td>
            <td>&quot;other&quot;</td>
            <td>&quot;other&quot;</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f570e552-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:37.657261</td>
            <td>view</td>
            <td>acer</td>
            <td>300.88</td>
            <td>computers</td>
            <td>notebook</td>
            <td>0.0</td>
        </tr>
        <tr>
            <td>f57bdfac-10a8-11ed-adee-0242ac1c0002</td>
            <td>2022-07-31 08:15:37.657261</td>
            <td>view</td>
            <td>pituso</td>
            <td>95.73</td>
            <td>furniture</td>
            <td>chair</td>
            <td>0.0</td>
        </tr>
    </tbody>
</table>
