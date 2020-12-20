---
title: Couchbase Manage Monitor
author: aimpugn
date: 2020-11-17 11:10:00 +0900
categories: [Couchbase.terminology]
tags: [nosql, couchbase]
math: true
use_math: true
---

# [모니터링 옵션 관리](https://docs.couchbase.com/server/current/manage/monitor/monitoring-stats-configuration.html)

## [통계 구성 변경](https://docs.couchbase.com/server/current/manage/monitor/monitoring-stats-configuration.html#changing-statistics-configuration)

## [통계 파일 경로 변경](https://docs.couchbase.com/server/current/manage/monitor/monitoring-stats-configuration.html#changing-statistics-file-location)

## [클러스터 태스크 모니터링](https://docs.couchbase.com/server/current/manage/monitor/monitoring-stats-configuration.html#monitoring-cluster-tasks)

## [방법](https://docs.couchbase.com/server/current/manage/monitor/monitoring-stats-configuration.html#methods)

# [UI로 모니터링](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html)

## 개요

- 특정 서버 또는 클러스터 전체의 Couchbase, 임시, 그리고 Memcached 버킷 보여준다

## [버킷 통계 접근](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#access-bucket-statistics)

### name

- 버킷의 이름

### items

- 버킷의 아이템 수

### resident

- 램에 존재(resident)하는 상태인 항목의 비율

### RAM

#### used

- 사용중인 램

#### quota

- 할당량

### disk used

- 사용된 디스크 용량

## [일반 제어](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#general-controls)

## [통계 그룹](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#statistics-groups)

### [버킷 모니터링 - 요약 통계]

#### About Operations

- `ops per second`: 이 버킷에서 초당 이뤄지는 전체 작업 수
- `cache miss ratio`: 이 버킷에서 초당 RAM이 아닌 디스크에서 읽는 비율. `ep_bg_fetches` / `cmd_lookup` \* 100
- `gets per sec.`: 이 버킷에서 이뤄지는 초당 GET 작업의 수. `cmd_get`
- `total gets per sec.`: 이 버킷에서 이뤄지는 초당 GET 전체 작업 수. `cmd_get`에 포함되지 않는 `get locked` 같은 GET 작업 포함
- `sets per sec.`: 이 버킷에서 이뤄지는 초당 쓰기(write, set) 작업 수. `cmd_sets`
- `deletes per sec.`: 이 버킷에서 이뤄지는 초당 삭제 작업 수. `delete_hits`
- `CAS ops per sec.`: 이 버킷에 대하여 CAS 식별자와 함께 이뤄지는 초당 작업 수. `cas_hits`
- `bg wait time`: 평균 백그라운드 fetch microseconds

#### About Memory

- `temp OOM per sec.`: 이 버킷에서 "`OOM`(out of memory)" 때문에 클라이언트 SDK로 백오프(back-off)되는 수
- `low water mark`: (버킷에 할당된 RAM 할당량에 기반) 이 버킷에 대한 low water mark. `ep_mem_low_wat`
- `high water mark`: (버킷에 할당된 RAM 할당량에 기반) 이 버킷에 대한 high water mark. `ep_mem_high_wat`
- `memory used`: 이 버킷에서 정보 저장하기 위해 사용되는 메모리의 양. `mem_used`로부터 측정

#### About Disk

- `disk creates per sec.`: 이 버킷에 대하여, 초당 새로운 아이템이 디크스에 생성되는 수.
- `disk updates per sec.`: 이 버킷에 대하여, 초당 아이템이 디스크에 업데이트 되는 수. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.
- `disk reads per sec.`: 이 버킷에 대하여, 초당 디스크 읽기 수. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.
- `disk write queue`: 이 버킷에서 디스크에 쓰기 대기중인 아이템의 수. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.
- `disk read failures`: 디스크 읽기 실패 수. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.
- `disk write failures`: 디스크 쓰기 실패 수. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.
- `disk update time`: 데이터를 디스크에 업데이트하는 데 필요한 microseconds. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.
- `disk commit time`: 데이터를 디스크에 커밋하는 게 필요한 seconds. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.

#### About Documents

- `active docs resident %`: 이 버킷에서 RAM에 캐시된 활성 아이템의 비율. `vb_active_resident_items_ratio`
- `items`: 이 버킷에 저장된 유니크한 아이템(문서)의 수. `curr_items`
- `docs data size`: 저장된 문서 데이터의 크기. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다. `couch_docs_size`로 측정.
- `docs total disk size`: 데이터, 메타데이터 그리고 임시 파일을 포함한 모든 데이터 파일의 크기. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다. `couch_docs_actual_size`로 측정.
- `docs fragmentation %`: 디스크에 데이터로 저장된 문서의 조각화(단편화, fragmentation) 비율. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다. `couch_docs_fragmentation`으로 측정
- `total disk size`: 이 버킷에 대하여, 디스크에 저장된 정보(데이터 및 뷰)의 전체 크기. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.

#### About Views

- `view data size`: 뷰 데이터 정보의 크기. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.
- `views total disk size`: 이 버킷에 대하여, 디스크에 저장된 모든 인덱스의 모든 활성된 아이템의 수
- `views fragmentation %`: 이 버킷에서 뷰 인덱스 파일에 대하여 실제 데이터에 비교하여 얼마나 단편화된 데이터가 압축되었는지. `couch_views_fragmentation`. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.
- `view reads per sec.`: 초당 뷰 읽기 수. 임시(Ephemeral) 버킷이 선택된 경우에는 보이지 않는다.

#### About XDCR

- `Incoming XDCR ops/sec.`: The incoming XDCR operations per second for this bucket.
- `Intra-replication queue`: Number of items remaining to be sent to consumer in this bucket.
- `outbound XDCR mutations`: Number of mutations to be replicated to other clusters. 선택한 버킷이 진행중(ongoing)인 복제의 소스인 경우에만 보인다.

#### About N1QL

- `N1QL queries/sec`: 초당 처리되는 N1QL 수

#### About Index

- `index data size`: 인덱스가 소비(consume)하는 데이터 크기
- `index disk size`: 인덱스가 소비하는 전체 디스크 크기
- `index fragmentation %`: 인덱스의 단편화 비율
- `index scanned/sec`: `indexer`에 의해 초당 인덱스 아이템이 스캔되는 수
- `fts bytes indexed/sec`: 초당 인덱스되는 `FTS(Full Text Search)` 바이트 수
- `fts queries/sec`: 초당 쿼리되는 `FTS` 수
- `fts disk size`: 이 버킷의 `FTS` 디스크 전체 크기
- `avg active drift/mutation`: Average drift (in seconds) per mutation on active vBuckets.
- `avg replica drift/mutation`: Average drift (in seconds) per mutation on replica vBuckets.
- `active ahead exceptions/sec`: Total number of ahead exceptions all active vBuckets.
- `replica ahead exceptions/sec`: Total number of ahead exceptions all replica vBuckets.

### [서버 자원](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#server_stats)

### [vBucket 자원](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#vbucket_stats)

### [Disk Queues](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#disk_stats)

### [DCP Queues](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#dcp_stats)

### [Index Statistics](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#index_stats)

### [Query Statistics](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#query_stats)

### [XDCR Destination](https://docs.couchbase.com/server/current/manage/monitor/ui-monitoring-statistics.html#incoming_xdcr_stats)

# [`cbstats`로 모니터링](https://docs.couchbase.com/server/current/manage/monitor/monitoring-cli.html)
