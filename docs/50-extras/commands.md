# Commands

## Airflow

```
# setup simple
export AIRFLOW_HOME=$(pwd)
export AIRFLOW__CORE__LOAD_EXAMPLES=False
export AIRFLOW__CORE__ENABLE_XCOM_PICKLING=True
airflow db init
airflow users create \
    --username admin \
    --password admin \
    --firstname Sparsh \
    --lastname Agarwal \
    --role Admin \
    --email sparsh@example.com
airflow standalone

# setup extended
export AIRFLOW_HOME=$(pwd)
export AIRFLOW__CORE__LOAD_EXAMPLES=False
export AIRFLOW__CORE__ENABLE_XCOM_PICKLING=True
airflow db init
airflow users create \
    --username admin \
    --password admin \
    --firstname Sparsh \
    --lastname Agarwal \
    --role Admin \
    --email sparsh@example.com
airflow standalone
airflow webserver -p 8081
airflow scheduler
airflow dags list
brew services restart postgresql
airflow db reset
airflow db init
pip install -U Jinja2
pip install jupyter_http_over_ws
jupyter serverextension enable --py jupyter_http_over_ws

# install Airflow using the constraints file
$(eval AIRFLOW_VERSION := 2.3.3)
$(eval PYTHON_VERSION := $(shell python --version | cut -d " " -f 2 | cut -d "." -f 1-2))
$(eval CONSTRAINT_URL := "https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-${PYTHON_VERSION}.txt")
pip install "apache-airflow==${AIRFLOW_VERSION}" --constraint "${CONSTRAINT_URL}"

# setup
# Airflow needs a home. We are using current directory as default,\
# but you can put it somewhere else if you prefer (optional)
$(shell export AIRFLOW_HOME=${PWD})
$(shell export AIRFLOW__CORE__DAGS_FOLDER AIRFLOW_HOME=${PWD}/dags)
airflow config get-value core dags

# standalone
airflow standalone

# not-standalone
airflow db init
airflow users create \
    --username admin \
    --password admin \
    --firstname Sparsh \
    --lastname Agarwal \
    --role Admin \
    --email sparsh@example.com
airflow webserver --port 8080
airflow scheduler

# list all available DAGs
airflow dags list

# docker
#!/bin/bash
# Note: this script is a bit of a "hack" to run Airflow in a single container.
# This is obviously not ideal, but convenient for demonstration purposes.
# In a production setting, run Airflow in separate containers, as explained in Chapter 10.
set -x
SCRIPT_DIR=$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)
docker run \
-ti \
-p 8080:8080 \
-v ${SCRIPT_DIR}/../dags/download_rocket_launches.py:/opt/airflow/dags/download_rocket_launches.py \
--name airflow
--entrypoint=/bin/bash \
apache/airflow:2.0.0-python3.8 \
-c '( \
airflow db init && \
airflow users create --username admin --password admin --firstname Anonymous --lastname Admin --role Admin --email admin@example.org \
); \
airflow webserver & \
airflow scheduler \
'
```

## Cloudformation

```
# create
aws cloudformation create-stack \
--stack-name AthenaSnsWynisco \
--template-body file://template.yml \
--capabilities CAPABILITY_NAMED_IAM \
--parameters ParameterKey=ProjectSuffix,ParameterValue=wynisco

# update
aws cloudformation update-stack \
--stack-name AthenaSnsWynisco \
--template-body file://template.yml \
--capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
--parameters ParameterKey=ProjectSuffix,ParameterValue=wynisco

# list
aws cloudformation list-stack-resources --stack-name AthenaSnsWynisco

# describe
aws cloudformation describe-stacks --stack-name AthenaSnsWynisco

# delete
aws cloudformation delete-stack \
--stack-name AthenaSnsWynisco
```

## dbt

```
# init
dbt init ${PROJECT_NAME}

# debug
dbt debug

# run
dbt run
dbt run --profiles-dir path/to/directory
export DBT_PROFILES_DIR=path/to/directory

# test
dbt test -m model1 [model2]

# seed
dbt seed
```

## Docker

Create a container:

```
docker run CONTAINER --network NETWORK
```

Start a stopped container:

```
docker start CONTAINER NAME
```

Stop a running container:

```
docker stop
```

List all running containers

```
docker ps
```

List all containers including stopped ones

```
docker ps -a
```

Inspect the container configuration. For instance network settings and so on:

```
docker inspect CONTAINER
```

List all available virtual networks:

```
docker network ls
```

Create a new network:

```
docker network create NETWORK --driver bridge
```

Connect a running container to a network

```
docker network connect NETWORK CONTAINER
```

Disconnect a running container from a network

```
docker network disconnect NETWORK CONTAINER
```

Remove a network

```
docker network rm NETWORK
```

Install docker on Cloud9 and EC2

```
sudo apt-get update
sudo apt-get remove docker docker-engine docker.io
sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo apt install gnome-keyring
curl -L https://raw.githubusercontent.com/docker/compose-cli/main/scripts/install/install_linux.sh | sh
VERSION=$(curl --silent https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*\d')
DESTINATION=/usr/bin/docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/${VERSION}/docker-compose-$(uname -s)-$(uname -m) -o $DESTINATION
sudo chmod 755 $DESTINATION
```

Install docker on EC2 in general

```
# #!/bin/bash
# Linux-only installation script
# This script installs the two main required packages to install the separate dockers:
# docker engine to run dockers, and docker compose to run multicontainers together.

sudo apt-get update

sudo apt-get -y install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add docker gpg key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --yes --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up a stable repository for x86_64
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null


  sudo apt-get update
  sudo apt-get -y install docker-ce docker-ce-cli containerd.io
  sudo apt-get install vim

  # Install docker compose
  sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

  # Make docker-compose "executable"
  sudo chmod +x /usr/local/bin/docker-compose

  # Test docker engine
  # sudo docker run hello-world

  # Test docker compose installation
  # sudo docker-compose --version
```

## EFS

```
sudo yum install -y amazon-efs-utils
sudo mkdir efs
sudo vi /etc/amazon/efs/efs-utils.conf
# uncomment region
# save with :wq!
sudo mount -t efs -o tls fs-09fde3805fce56778:/ efs
sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport 172.31.27.236:/ efs
sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport fs-0ef872db37d7aa547.efs.us-east-1.amazonaws.com: /mnt
aws efs describe-file-systems --file-system-id fs-0aafb8da848264e5b


mkdir mypostgres
sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport 172.31.18.216:/ mypostgres
```

## FastAPI

```
# start api
uvicorn app:app --port 5000 --reload
```

## Git

```
git init

git remote add origin https://github.com/datalaker/de

git checkout -b main

git add .

git commit -m "commit"

git pull --rebase origin main

git push origin main
```

## Kafka

```
# list topics
kafka-topics.sh --bootstrap-server localhost:9092 --list

# create topic
kafka-topics.sh --bootstrap-server localhost:9092 --create --topic first-topic

# create topic with partitions and replication factor
kafka-topics.sh --bootstrap-server localhost:9092 --create --topic second-topic --partitions 3 --replication-factor 1
kafka-topics.sh --bootstrap-server localhost:9092 --create --topic third-topic --partitions 3 --replication-factor 1

# describe topic
kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic first-topic
kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic second-topic

# delete topic
kafka-topics.sh --bootstrap-server localhost:9092 --delete --topic third-topic


# produce messages
kafka-console-producer.sh --bootstrap-server localhost:9092 --topic first-topic

# produce messages with keys
kafka-console-producer.sh --bootstrap-server localhost:9092 --topic first-topic --property "parse.key=true" --property "key.separator=:"

# produce messages with ngrok
ngrok tcp 9092
kafka-console-producer.sh --bootstrap-server localhost:9092 --topic first-topic


# consume messages
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic first-topic

# consume messages with ngrok
kafka-console-consumer.sh --bootstrap-server tcp://6.tcp.ngrok.io:15178 --topic first-topic

# consume messages with beginning offset
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic first-topic --from-beginning

# consume messages with timestamp
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic first-topic --formatter kafka.tools.DefaultMessageFormatter --property print.timestamp=true --property print.key=true --property print.value=true --from-beginning

# consume messages with consumer group
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic first-topic --group first-consumer-group
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic first-topic --from-beginning --formatter kafka.tools.DefaultMessageFormatter --property print.timestamp=true --property print.key=true --property print.value=true --from-beginning --group first-consumer-group


# list consumer groups
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list

# describe consumer groups
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group first-consumer-group

# reset offsets of consumer groups
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group first-consumer-group --reset-offsets --to-earliest --execute --all-topics
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group first-consumer-group --reset-offsets --shift-by 2 --execute --topic first-topic
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group first-consumer-group --reset-offsets --shift-by -2 --execute --topic first-topic


# confluent - list topics
confluent kafka topic list

# confluent - create topic
confluent kafka topic create first-topic

# confluent - create topic with partitions
confluent kafka topic create second-topic --partitions 3

# confluent - describe topic
confluent kafka topic describe first-topic

# confluent - delete topic
confluent kafka topic delete first-topic

# confluent - ref: https://docs.confluent.io/confluent-cli/current/command-reference/kafka/topic/confluent_kafka_topic_delete.html


# confluent - product message
confluent kafka topic produce second-topic


# confluent - consume message
confluent kafka topic consume second-topic -b
```

## Pip

```
pip install --no-cache-dir --user -r /requirements.txt --use-deprecated=legacy-resolver
```

## Prefect

```
# install
pip install -r requirements.txt

# version
prefect version

# start
prefect orion start

# cloud
prefect cloud login --key ${KEY} --workspace "sparshcloudgmailcom/sparshcloud"

# storage
prefect storage create

# open-api-docs
open http://127.0.0.1:4200/docs
open http://127.0.0.1:4200/redoc

# open-ui
open http://localhost:4200

# set-api
prefect config set PREFECT_API_URL=http://127.0.0.1:4200/api

# deploy
prefect deployment create ${your_file}.py

# work-queue
prefect work-queue create --tag tutorial tutorial_queue

# work-queue-ls
prefect work-queue ls

# agent-start
prefect agent start '<work-queue-id>'
```

## Shell

```
# Replace file extension of all files in a folder
	for file in *.html
	do
	mv "$file" "${file%.html}.txt"
	done
# Wget download all files from html index
	wget -r -np -nH --cut-dirs=3 -R index.html <url>
```

## Psql

```
CREATE DATABASE <db_name>;
CREATE USER <user_name> WITH ENCRYPTED PASSWORD '<password>';
GRANT ALL ON DATABASE <db_name> TO <user_name>;
GRANT pg_read_server_files TO <user_name>;
\q
```

```
psql -h localhost -p 5432 -d <db_name> -U <user_name> -W
```

## Cloudformation Templates

### AWS Managed Airflow (MWAA)

```yml
AWSTemplateFormatVersion: "2010-09-09"

Parameters:

  EnvironmentName:
    Description: An environment name that is prefixed to resource names
    Type: String
    Default: MWAAEnvironment

  VpcCIDR:
    Description: The IP range (CIDR notation) for this VPC
    Type: String
    Default: 10.192.0.0/16

  PublicSubnet1CIDR:
    Description: The IP range (CIDR notation) for the public subnet in the first Availability Zone
    Type: String
    Default: 10.192.10.0/24

  PublicSubnet2CIDR:
    Description: The IP range (CIDR notation) for the public subnet in the second Availability Zone
    Type: String
    Default: 10.192.11.0/24

  PrivateSubnet1CIDR:
    Description: The IP range (CIDR notation) for the private subnet in the first Availability Zone
    Type: String
    Default: 10.192.20.0/24
  PrivateSubnet2CIDR:
    Description: The IP range (CIDR notation) for the private subnet in the second Availability Zone
    Type: String
    Default: 10.192.21.0/24
  MaxWorkerNodes:
    Description: The maximum number of workers that can run in the environment
    Type: Number
    Default: 2
  DagProcessingLogs:
    Description: Log level for DagProcessing
    Type: String
    Default: INFO
  SchedulerLogsLevel:
    Description: Log level for SchedulerLogs
    Type: String
    Default: INFO
  TaskLogsLevel:
    Description: Log level for TaskLogs
    Type: String
    Default: INFO
  WorkerLogsLevel:
    Description: Log level for WorkerLogs
    Type: String
    Default: INFO
  WebserverLogsLevel:
    Description: Log level for WebserverLogs
    Type: String
    Default: INFO

Resources:
  #####################################################################################################################
  # CREATE VPC
  #####################################################################################################################

  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCIDR
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: MWAAEnvironment

  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: MWAAEnvironment

  InternetGatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      InternetGatewayId: !Ref InternetGateway
      VpcId: !Ref VPC

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [ 0, !GetAZs '' ]
      CidrBlock: !Ref PublicSubnet1CIDR
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName} Public Subnet (AZ1)

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [ 1, !GetAZs  '' ]
      CidrBlock: !Ref PublicSubnet2CIDR
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName} Public Subnet (AZ2)

  PrivateSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [ 0, !GetAZs  '' ]
      CidrBlock: !Ref PrivateSubnet1CIDR
      MapPublicIpOnLaunch: false
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName} Private Subnet (AZ1)

  PrivateSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [ 1, !GetAZs  '' ]
      CidrBlock: !Ref PrivateSubnet2CIDR
      MapPublicIpOnLaunch: false
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName} Private Subnet (AZ2)

  NatGateway1EIP:
    Type: AWS::EC2::EIP
    DependsOn: InternetGatewayAttachment
    Properties:
      Domain: vpc

  NatGateway2EIP:
    Type: AWS::EC2::EIP
    DependsOn: InternetGatewayAttachment
    Properties:
      Domain: vpc

  NatGateway1:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGateway1EIP.AllocationId
      SubnetId: !Ref PublicSubnet1

  NatGateway2:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGateway2EIP.AllocationId
      SubnetId: !Ref PublicSubnet2

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName} Public Routes

  DefaultPublicRoute:
    Type: AWS::EC2::Route
    DependsOn: InternetGatewayAttachment
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnet1RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PublicRouteTable
      SubnetId: !Ref PublicSubnet1

  PublicSubnet2RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PublicRouteTable
      SubnetId: !Ref PublicSubnet2


  PrivateRouteTable1:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName} Private Routes (AZ1)

  DefaultPrivateRoute1:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable1
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway1

  PrivateSubnet1RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PrivateRouteTable1
      SubnetId: !Ref PrivateSubnet1

  PrivateRouteTable2:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub ${EnvironmentName} Private Routes (AZ2)

  DefaultPrivateRoute2:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable2
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway2

  PrivateSubnet2RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PrivateRouteTable2
      SubnetId: !Ref PrivateSubnet2

  SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupName: "mwaa-security-group"
      GroupDescription: "Security group with a self-referencing inbound rule."
      VpcId: !Ref VPC

  SecurityGroupIngress:
    Type: AWS::EC2::SecurityGroupIngress
    Properties:
      GroupId: !Ref SecurityGroup
      IpProtocol: "-1"
      SourceSecurityGroupId: !Ref SecurityGroup

  #####################################################################################################################
  # CREATE MWAA
  #####################################################################################################################

  MwaaEnvironment:
    Type: AWS::MWAA::Environment
    Properties:
      Name: !Sub "${AWS::StackName}-MwaaEnvironment"
      SourceBucketArn: arn:aws:s3:::mwaa-sparsh
      ExecutionRoleArn: arn:aws:iam::390354360073:role/service-role/AmazonMWAA-MyAirflowEnvironment-kTPUEN
      DagS3Path: dags
      RequirementsS3Path: requirements.txt
      NetworkConfiguration:
        SecurityGroupIds:
          - !GetAtt SecurityGroup.GroupId
        SubnetIds:
          - !Ref PrivateSubnet1
          - !Ref PrivateSubnet2
      WebserverAccessMode: PUBLIC_ONLY
      MaxWorkers: !Ref MaxWorkerNodes
      LoggingConfiguration:
        DagProcessingLogs:
          LogLevel: !Ref DagProcessingLogs
          Enabled: true
        SchedulerLogs:
          LogLevel: !Ref SchedulerLogsLevel
          Enabled: true
        TaskLogs:
          LogLevel: !Ref TaskLogsLevel
          Enabled: true
        WorkerLogs:
          LogLevel: !Ref WorkerLogsLevel
          Enabled: true
        WebserverLogs:
          LogLevel: !Ref WebserverLogsLevel
          Enabled: true
  SecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      VpcId: !Ref VPC
      GroupDescription: !Sub "Security Group for Amazon MWAA Environment ${AWS::StackName}-MwaaEnvironment"
      GroupName: !Sub "airflow-security-group-${AWS::StackName}-MwaaEnvironment"
  
  SecurityGroupIngress:
    Type: AWS::EC2::SecurityGroupIngress
    Properties:
      GroupId: !Ref SecurityGroup
      IpProtocol: "-1"
      SourceSecurityGroupId: !Ref SecurityGroup

  SecurityGroupEgress:
    Type: AWS::EC2::SecurityGroupEgress
    Properties:
      GroupId: !Ref SecurityGroup
      IpProtocol: "-1"
      CidrIp: "0.0.0.0/0"

Outputs:
  VPC:
    Description: A reference to the created VPC
    Value: !Ref VPC

  PublicSubnets:
    Description: A list of the public subnets
    Value: !Join [ ",", [ !Ref PublicSubnet1, !Ref PublicSubnet2 ]]

  PrivateSubnets:
    Description: A list of the private subnets
    Value: !Join [ ",", [ !Ref PrivateSubnet1, !Ref PrivateSubnet2 ]]

  PublicSubnet1:
    Description: A reference to the public subnet in the 1st Availability Zone
    Value: !Ref PublicSubnet1

  PublicSubnet2:
    Description: A reference to the public subnet in the 2nd Availability Zone
    Value: !Ref PublicSubnet2

  PrivateSubnet1:
    Description: A reference to the private subnet in the 1st Availability Zone
    Value: !Ref PrivateSubnet1

  PrivateSubnet2:
    Description: A reference to the private subnet in the 2nd Availability Zone
    Value: !Ref PrivateSubnet2

  SecurityGroupIngress:
    Description: Security group with self-referencing inbound rule
    Value: !Ref SecurityGroupIngress

  MwaaApacheAirflowUI:
    Description: MWAA Environment
    Value: !Sub  "https://${MwaaEnvironment.WebserverUrl}"
```

## Docker Compose

### Airbyte Pinot

```yaml title="docker-compose-airbytepinot.yml"
version: '3.7'
services:
  zookeeper:
    image: zookeeper:3.5.6
    hostname: zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
  pinot-controller:
    image: apachepinot/pinot:0.9.3
    command: "StartController -zkAddress zookeeper:2181 -dataDir /data"
    container_name: "pinot-controller"
    volumes:
      - ./config:/config
    restart: unless-stopped
    ports:
      - "9000:9000"
    depends_on:
      - zookeeper
  pinot-broker:
    image: apachepinot/pinot:0.9.3
    command: "StartBroker -zkAddress zookeeper:2181"
    restart: unless-stopped
    container_name: "pinot-broker"
    ports:
      - "8099:8099"
    depends_on:
      - pinot-controller
  pinot-server:
    image: apachepinot/pinot:0.9.3
    command: "StartServer -zkAddress zookeeper:2181"
    restart: unless-stopped
    container_name: "pinot-server"
    depends_on:
      - pinot-broker
  kafka:
    image: wurstmeister/kafka:latest
    restart: unless-stopped
    container_name: "kafka"
    ports:
      - "9092:9092"
    expose:
      - "9093"
    depends_on:
      - zookeeper
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181/kafka
      KAFKA_BROKER_ID: 0
      KAFKA_ADVERTISED_HOST_NAME: kafka
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9093,OUTSIDE://localhost:9092
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9093,OUTSIDE://0.0.0.0:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,OUTSIDE:PLAINTEXT
```

### Airflow

```yaml title="docker-compose-airflow.yml"
version: '3.7'

services:

  airflow:
    build: ./dockerfiles/airflow
    restart: always
    environment:
      - INSTALL_MYSQL=y
      - LOAD_EX=n
      - EXECUTOR=Local
      - AIRFLOW_DATABASE_URL=postgresql://airflow:airflow@postgres/airflow
    volumes:
      - ../airflow_/dags:/usr/local/airflow/dags
      - ../scripts:/usr/local/airflow/includes
      - ../dbt_:/usr/local/airflow/dbt_
      - ../data:/usr/local/airflow/data
      - ../airflow_/logs:/opt/airflow/logs
      - ../airflow_/plugins:/opt/airflow/plugins
    ports:
      - "8087:8080"
      - "7211:7211"
      - "9921:9921"
    command: webserver

networks: 
  default: 
    external: 
      name: local_network_1
```

### MySQL

```yaml title="docker-compose-mysql.yml"
services:
  mysql:
      image: mysql:5.7.27
      environment:
        - MYSQL_ROOT_PASSWORD=mysql
      volumes:
          - ../data:/var/lib/mysql-files/
          - ../scripts/sql/init_mysql.sql:/docker-entrypoint-initdb.d/init_mysql.sql
      ports:
          - "42060:3306"

networks: 
  default: 
    external: 
      name: local_network_1
```

### Postgres

```yaml title="docker-compose-postgres.yml"
services:
  pgdatabase:
    image: postgres:13
    environment:
      - POSTGRES_USER=root
      - POSTGRES_PASSWORD=root
      - POSTGRES_DB=ny_taxi
    volumes:
      - "./ny_taxi_postgres_data:/var/lib/postgresql/data:rw"
    ports:
      - "5432:5432"
  pgadmin:
    image: dpage/pgadmin4
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@admin.com
      - PGADMIN_DEFAULT_PASSWORD=root
    ports:
      - "8080:80"
```

### Postgres v2

```yaml title="docker-compose-postgres-v2.yml"
version: '3.6'
services: 
    postgres:
        build: ./dockerfiles/postgres
        restart: always
        environment: 
            - DATABASE_HOST=127.0.0.1
            - POSTGRES_USER=root
            - POSTGRES_PASSWORD=root
            - POSTGRES_DB=root  
            - POSTGRES_HOST_AUTH_METHOD=trust

        ports: 
            - "5432:5432"
        volumes: 
            - ../scripts/sql/postgres_init.sql:/docker-entrypoint-initdb.d/docker_postgres_init.sql
            
    pgadmin-compose:
        image: dpage/pgadmin4
        environment: 
            PGADMIN_DEFAULT_EMAIL: "test@gmail.com"
            PGADMIN_DEFAULT_PASSWORD: "test123!"
        ports: 
            - "16543:80"
        depends_on: 
            - postgres    

networks: 
  default: 
    external: 
      name: local_network_1
```

### Redash

```yaml title="docker-compose-redash.yml"
version: '2'

x-redash-service: &redash-service
  image: redash/redash:latest
  depends_on:
    - redis2
  env_file: ./.env/redash.env
  restart: always

services:
  server:
    <<: *redash-service
    command: server
    ports:
      - 11111:5000
    environment:
      REDASH_WEB_WORKERS: 4
  scheduler:
    <<: *redash-service
    command: scheduler
    environment:
      QUEUES: "celery"
      WORKERS_COUNT: 1
  scheduled_worker:
    <<: *redash-service
    command: worker
    environment:
      QUEUES: "scheduled_queries,schemas"
      WORKERS_COUNT: 1
  adhoc_worker:
    <<: *redash-service
    command: worker
    environment:
      QUEUES: "queries"
      WORKERS_COUNT: 2

  redis2:
    image: redis:latest
    restart: always

networks: 
  default: 
    external: 
      name: local_network_1
```

### Superset

```yaml title="docker-compose-superset.yml"
x-superset-image: &superset-image apache/superset:${TAG:-latest-dev}
x-superset-depends-on: &superset-depends-on
  - redis
x-superset-volumes: &superset-volumes
  # /app/pythonpath_docker will be appended to the PYTHONPATH in the final container
  - ../superset/docker:/app/docker
  - ../superset:/app/superset_home

version: "3.7"
services:
  redis:
    image: redis:latest
    container_name: superset_cache
    restart: unless-stopped
    volumes:
      - redis:/data

  # db:
  #   env_file: ../superset/docker/.env-non-dev
  #   image: postgres:10
  #   container_name: superset_db
  #   restart: unless-stopped
  #   volumes:
  #     - db_home:/var/lib/postgresql/data

  superset:
    env_file: ../superset/docker/.env-non-dev
    image: *superset-image
    container_name: superset_app
    command: ["/app/docker/docker-bootstrap.sh", "app-gunicorn"]
    user: "root"
    restart: unless-stopped
    ports:
      - 8088:8088
    depends_on: *superset-depends-on
    volumes: *superset-volumes

  superset-init:
    image: *superset-image
    container_name: superset_init
    command: ["/app/docker/docker-init.sh"]
    env_file: ../superset/docker/.env-non-dev
    depends_on: *superset-depends-on
    user: "root"
    volumes: *superset-volumes

  superset-worker:
    image: *superset-image
    container_name: superset_worker
    command: ["/app/docker/docker-bootstrap.sh", "worker"]
    env_file: ../superset/docker/.env-non-dev
    restart: unless-stopped
    depends_on: *superset-depends-on
    user: "root"
    volumes: *superset-volumes

  superset-worker-beat:
    image: *superset-image
    container_name: superset_worker_beat
    command: ["/app/docker/docker-bootstrap.sh", "beat"]
    env_file: ../superset/docker/.env-non-dev
    restart: unless-stopped
    depends_on: *superset-depends-on
    user: "root"
    volumes: *superset-volumes

volumes:
  superset_home:
    external: false
  db_home:
    external: false
  redis:
    external: false

networks: 
  default: 
    external: 
      name: local_network_1
```