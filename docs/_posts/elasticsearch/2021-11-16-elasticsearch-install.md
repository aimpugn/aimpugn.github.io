---
title: Elasticsearch 설치
author: aimpugn
date: 2021-11-16 23:30:00+0900
use_math: true
categories: [elasticsearch, esrally]
---
- [개요](#개요)
  - [Install Elasticsearch with RPM](#install-elasticsearch-with-rpm)
    - [GPG key imort](#gpg-key-imort)
    - [RPM repository 통해 설치](#rpm-repository-통해-설치)
  - [RPM 통해 설치 후 구조](#rpm-통해-설치-후-구조)
    - [system service](#system-service)
    - [데이터 경로](#데이터-경로)
  - [`systemctl elasticsearch start`](#systemctl-elasticsearch-start)
  - [Troubleshooting](#troubleshooting)
    - [at least one of of [discovery.seed_hosts, discovery.seed_providers, cluster.initial_master_nodes] must be configured](#at-least-one-of-of-discoveryseed_hosts-discoveryseed_providers-clusterinitial_master_nodes-must-be-configured)
      - [문제](#문제)
      - [원인](#원인)
      - [해결](#해결)
    - [failed to obtain node locks, tried [[/var/lib/elasticsearch]] with lock id [0]](#failed-to-obtain-node-locks-tried-varlibelasticsearch-with-lock-id-0)
      - [문제](#문제-1)
      - [원인](#원인-1)
      - [해결](#해결-1)

# 개요

- `elasticsearch`를 `rpm`으로 설치

## [Install Elasticsearch with RPM](https://www.elastic.co/guide/en/elasticsearch/reference/current/rpm.html#rpm)

### GPG key imort

```shell
rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
```

### RPM repository 통해 설치

`/etc/yum.repos.d/elasticsearch.repo` 생성

```shell
cat <<EOF > /etc/yum.repos.d/elasticsearch.repo
[elasticsearch]
name=Elasticsearch repository for 7.x packages
baseurl=https://artifacts.elastic.co/packages/7.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=0
autorefresh=1
type=rpm-md
EOF
```

`yum` 통해 설치

```shell
sudo yum install --enablerepo=elasticsearch elasticsearch
```

## RPM 통해 설치 후 구조

- /etc
  - elasticsearch
    - `jvm.options: jvm` 옵션 설정
    - `elasticsearch.yml`: elasticsearch 전반에 대한 구성 파일
  - sysconfig
    - `elasticsearch`: 환경변수를 저장해두는 파일
- /usr
  - share
    - elasticsearch
      - bin
      - jdk
      - modules
- /var
  - run
    - elasticsearch
      - elasticsearch.pid: 현재 기동중인 엘라스틱서치 프로세스의 아이디를 저장하는 파일

### system service

```shell
[root@vultr ~]# cat /usr/lib/systemd/system/elasticsearch.service
[Unit]
Description=Elasticsearch
Documentation=https://www.elastic.co
Wants=network-online.target
After=network-online.target

[Service]
Type=notify
RuntimeDirectory=elasticsearch
PrivateTmp=true
Environment=ES_HOME=/usr/share/elasticsearch
Environment=ES_PATH_CONF=/etc/elasticsearch
Environment=PID_DIR=/var/run/elasticsearch
Environment=ES_SD_NOTIFY=true
EnvironmentFile=-/etc/sysconfig/elasticsearch

WorkingDirectory=/usr/share/elasticsearch

User=elasticsearch
Group=elasticsearch

ExecStart=/usr/share/elasticsearch/bin/systemd-entrypoint -p ${PID_DIR}/elasticsearch.pid --quiet

# StandardOutput is configured to redirect to journalctl since
# some error messages may be logged in standard output before
# elasticsearch logging system is initialized. Elasticsearch
# stores its logs in /var/log/elasticsearch and does not use
# journalctl by default. If you also want to enable journalctl
# logging, you can simply remove the "quiet" option from ExecStart.
StandardOutput=journal
StandardError=inherit

# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65535

# Specifies the maximum number of processes
LimitNPROC=4096

# Specifies the maximum size of virtual memory
LimitAS=infinity

# Specifies the maximum file size
LimitFSIZE=infinity

# Disable timeout logic and wait until process is stopped
TimeoutStopSec=0

# SIGTERM signal is used to stop the Java process
KillSignal=SIGTERM

# Send the signal only to the JVM rather than its control group
KillMode=process

# Java process is never killed
SendSIGKILL=no

# When a JVM receives a SIGTERM signal it exits with code 143
SuccessExitStatus=143

# Allow a slow startup before the systemd notifier module kicks in to extend the timeout
TimeoutStartSec=75

[Install]
WantedBy=multi-user.target

# Built for packages-7.15.2 (packages)
```

### 데이터 경로

```yml
# /etc/elasticsearch/elasticsearch.yml
# 
# ----------------------------------- Paths ------------------------------------
#
# Path to directory where to store the data (separate multiple locations by comma):
#
path.data: /var/lib/elasticsearch
#
# Path to log files:
#
path.logs: /var/log/elasticsearch
```

## `systemctl elasticsearch start`

- `-Xms`, `-Xmx`는 java 최신 버전의 경우 서버 리소스에 맞게 자동 할당. java `1.8` 버전인 경우에는 정상적으로 작동하지 않았다.

```shell
[root@vultr ~]# /usr/share/elasticsearch/jdk/bin/java --version
openjdk 17.0.1 2021-10-19
OpenJDK Runtime Environment Temurin-17.0.1+12 (build 17.0.1+12)
OpenJDK 64-Bit Server VM Temurin-17.0.1+12 (build 17.0.1+12, mixed mode, sharing)

[root@vultr ~]# systemctl start elasticsearch
[root@vultr ~]# ps -ef | grep elasticsearch

/usr/share/elasticsearch/jdk/bin/java \
  -Xshare:auto \
  -Des.networkaddress.cache.ttl=60 \
  -Des.networkaddress.cache.negative.ttl=10 \
  -XX:+AlwaysPreTouch \
  -Xss1m \
  -Djava.awt.headless=true \
  -Dfile.encoding=UTF-8 \
  -Djna.nosys=true \
  -XX:-OmitStackTraceInFastThrow \
  -XX:+ShowCodeDetailsInExceptionMessages \
  -Dio.netty.noUnsafe=true \
  -Dio.netty.noKeySetOptimization=true \
  -Dio.netty.recycler.maxCapacityPerThread=0 \
  -Dio.netty.allocator.numDirectArenas=0 \
  -Dlog4j.shutdownHookEnabled=false \
  -Dlog4j2.disable.jmx=true \
  -Djava.locale.providers=SPI,COMPAT \
  --add-opens=java.base/java.io=ALL-UNNAMED \
  -XX:+UseG1GC \
  -Djava.io.tmpdir=/tmp/elasticsearch-9517931333804689362 \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/lib/elasticsearch \
  -XX:ErrorFile=/var/log/elasticsearch/hs_err_pid%p.log \
  -Xlog:gc*,gc+age=trace,safepoint:file=/var/log/elasticsearch/gc.log:utctime,pid,tags:filecount=32,filesize=64m \
  -Xms3884m \
  -Xmx3884m \
  -XX:MaxDirectMemorySize=2036334592 \
  -XX:G1HeapRegionSize=4m \
  -XX:InitiatingHeapOccupancyPercent=30 \
  -XX:G1ReservePercent=15 \
  -Des.path.home=/usr/share/elasticsearch \
  -Des.path.conf=/etc/elasticsearch \
  -Des.distribution.flavor=default \
  -Des.distribution.type=rpm \
  -Des.bundled_jdk=true \
  -cp /usr/share/elasticsearch/lib/* org.elasticsearch.bootstrap.Elasticsearch \
  -p /var/run/elasticsearch/elasticsearch.pid --quiet
```

## Troubleshooting

### at least one of of [discovery.seed_hosts, discovery.seed_providers, cluster.initial_master_nodes] must be configured

#### 문제

```shell
ERROR: [1] bootstrap checks failed. You must address the points described in the following [1] lines before starting Elasticsearch.
bootstrap check failure [1] of [1]: the default discovery settings are unsuitable for production use; at least one of [discovery.seed_hosts, discovery.seed_providers, cluster.initial_master_nodes] must be configured
ERROR: Elasticsearch did not exit normally - check the logs at /var/log/elasticsearch/elasticsearch.log
```

#### 원인

- 클러스터 구성 시 마스터 적격 노드들에 대한 설정이 필요

#### 해결

- 하지만 개인적으로 사용하는 서버가 하나라 [`Single-node discovery`](https://www.elastic.co/guide/en/elasticsearch/reference/current/bootstrap-checks.html#single-node-discovery) 사용

### failed to obtain node locks, tried [[/var/lib/elasticsearch]] with lock id [0]

#### 문제

```shell
java.lang.IllegalStateException: failed to obtain node locks, tried [[/var/lib/elasticsearch]] with lock id [0]; maybe these locations are not writable or multiple nodes were started without increasing [node.max_local_storage_nodes] (was [1])?
Likely root cause: java.nio.file.AccessDeniedException: /var/lib/elasticsearch/nodes/0/node.lock
```

#### 원인

- 디렉토리 권한이 `elasticsearch` 계정의 아이디와 `elasticsearch` 그룹의 아이디로 부여되어 있는데도 노드의 락 획득에 실패

#### 해결

- 파일 소유자를 다시 설정하고 재실행하니 되긴 했는데, 근본적인 문제 해결인지는 의문

```
chown -R elasticsearch:elasticsearch /var/lib/elasticsearch
```
