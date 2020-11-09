---
title: Couchbase Learn Services and Indexes - Indexes
author: aimpugn
date: 2020-11-07 10:47:00 +0900
categories: [Couchbase.learn.data_model]
tags: [nosql, couchbase]
math: true
use_math: true
---

# [Indexes](https://docs.couchbase.com/server/current/learn/services-and-indexes/indexes/indexes.html)

## 인덱스 종류

### Primary

- [`Index Servic`e](https://docs.couchbase.com/server/current/learn/services-and-indexes/services/index-service.html)가 제공
- 지정된 버킷의 모든 항목(item)들의 유니크 키에 기반한다
- 모든 기본 인덱스(primary index)는 비동기로 유지된다
- 필터 또는 술어(predicates) 없는 간단한 쿼리에 사용
- [`CREATE PRIMARY INDEX`](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/createprimaryindex.html) 참조

### Secondary

- [`Index Service`](https://docs.couchbase.com/server/current/learn/services-and-indexes/services/index-service.html)가 제공
- `문서 내(within)`의 속성에 기반한다
- 속성과 연관된 값은 `scalar`, `object`, 또는 `array` 과 같은 모든 유형이 가능
- 보조 인덱스는 주로 `GSI`

### Full Text

- [`Search Service`](https://docs.couchbase.com/server/current/learn/services-and-indexes/services/search-service.html)가 제공
- 하나 또는 그 이상의 버킷에 있는 문서의 텍스트 컨텐츠에의 타켓을 포함하는, 목적 색인(purposed index)
- 정확도의 정도가 다른 텍스트 매치 검색에 사용

### View

- 문서에서 추출된 필드들과 정보를 포함한 `Couchbase Views` 지원

### Shadow Data Set

- [Analytics Srvice](https://docs.couchbase.com/server/current/analytics/introduction.html)가 제공

## [`GSI(Global Secondary Index)`]

- `GSI`는 `Query Service`가 문서의 속성(`attributes`)에 대해 생성한 쿼리를 지원한다
- 광범위한(extensive) 필터링 지원

### 장점

#### `Advanced Scaling`

- 특정 노드 선택하여 독립적으로 할당 가능
- 이 경우 기존 부하는 영향을 미치지 않는다

#### `Predictable Performace`

- 인덱스의 수가 매우 많더라도, 키 기반 작업은 예측 가능한 낮은 지연시간을 유지
- 데이터 변경 부하가 크더라도, 인덱스 유지 관리(index maintenance)는 키 기반 작업과 경쟁하지 않는다

#### `Low Latency Querying`

- GSI 인덱스들은 인덱스 서비스 노드로 독립적으로 분할될 수 있다
- vBucket으로의 데이터 해시 분할을 따를 필요 없다
- 모든 데이터 서비스 노드에 대한 광범위한 팬 아웃(fan-out)이 필요하지 않으므로, 클러스터가 증가할 때도 낮은 지연 시간 달성 가능

#### `Independent Partitioning`

- `Index Service`는 분할 독립성(partition independence) 제공하여, 데이터와 그 인덱스는 서로 다른 파티션 키를 가질 수 있다
- 각 인덱스는 자신만의 파티션 키를 가질 수 있고, 특정 쿼리에 매치되도록 독립적으로 분할될 수 있다

### [가용성과 성능](https://docs.couchbase.com/server/current/learn/services-and-indexes/indexes/index-replication.html)

#### `Index Replication`

#### `Index Partitioning`

#### `Index Consistency`

#### `Index Snapshots`

#### `Index Rollback`

### [Indexing](https://docs.couchbase.com/server/current/learn/services-and-indexes/indexes/indexing-and-query-perf.html)

#### 개요

- 올바른 인덱스 생성이 중요
  - 올바른 키
  - 올바른 순서
  - 올바른 표현식으로 사용
- 두 종류의 인덱스 가능
  - Standard Global Secondary Index
  - Memory-optimized Global Secondary Index

##### 표준 `GSI`

- `ForestDB` 저장 엔진 사용하여 B-Tree 인덱스 저장하고 버퍼에 최적의 작업 집합(working set)을 유지
- 인덱스의 총 사이즈는 각 인덱스 노드의 사용 가능한 메모리 양보다 훨씬 클 수 있음을 의미
-

##### 메모리 최적화 `GSI`

- lock-free skiplist 사용하여 인덱스를 관리하고 모든 인덱스 데이터를 메모리에 유지한다
- 메모리 최적화 인덱스가 인덱스 스캔에 대한 더 나은 지연시간을 가지고 데이터 변화 처리를 더 빠르게 수행한다

#### Primary Index

- 기본 인덱스
- 비동기로 관리된다
- 전체 버킷의 문서 키에 대한 인덱스
- Couchbase 데이터 계층은 문서 키에 대한 유일성 제약 조건을 강제

```sql
CREATE PRIMARY INDEX ON `travel-sample`;
```

##### 사용 경우

- 쿼리에 필터(술어, predicate)가 없는 경우
- 다른 인덱스 또는 접근 경로(access path)가 사용되지 않는 경우

##### Metadata for Primary Index

```json
SELECT * FROM system:indexes WHERE name = '#primary';

Results:
[
  {
    "indexes": {
      "datastore_id": "http://127.0.0.1:8091",  // 인덱스가 존재하는 곳
      "id": "1b7ac1abf01d9038",
      "index_key": [],
      "is_primary": true,
      "keyspace_id": "travel-sample",
      "name": "#primary",
      "namespace_id": "default",
      "state": "online",                        // 인덱스 상태
      "using": "gsi"                            // 인덱스 메서드
    }
  }
]
```

#### Named Primary Index

- 이름 있는 기본 인덱스
- 시스템에 여러 기본 인덱스를 가질 수 있다
- 중복 인덱스는 높은 가용성과 인덱스 간의 쿼리 부하 분산에 도움

```sql
CREATE PRIMARY INDEX def_primary ON `travel-sample`;
```

#### Secondary Index

- 보조 인덱스
- key-value 또는 문서 키에 대한 인덱스
- 문서 내의 모든 키를 사용할 수 있고, 키의 타입은 [`scalar`](https://softwareengineering.stackexchange.com/a/238045), `object`, 또는 `array` 등 모두 가능하다
- 쿼리 엔진이 같은 인덱스를 사용하도록 쿼리는 같은 타입의 오브젝트를 사용할 필요가 있다

##### Key is a Simple Scalar Value

```sql
CREATE INDEX travel_name ON `travel-sample`(name);

# Name is a simple scalar value such as:
{
    "name": "Air France"
}
```

##### Key is an Object, Embedded Within the Document

```sql
CREATE INDEX travel_geo on `travel-sample`(geo);

-- geo is an object, embedded within the document such as:
"geo": {
    "alt": 12,
    "lat": 50.962097,
    "lon": 1.954764
}
```

##### Keys from Nested Objects

```sql
CREATE INDEX travel_geo on `travel-sample`(geo.alt);

CREATE INDEX travel_geo on `travel-sample`(geo.lat);
```

##### Keys is an Array of Objects

```sql

CREATE INDEX travel_schedule ON `travel-sample`(schedule);

-- Schedule is an array of objects with flight details.
-- This command indexes the complete array and is useful only if you're looking for the entire array.
-- Example Results:
"schedule": [
        {
            "day": 0,
            "flight": "AF198",
            "utc": "10:13:00"
            },
        {
            "day": 0,
            "flight": "AF547",
            "utc": "19:14:00"
            },
        {
            "day": 0,
            "flight": "AF943",
            "utc": "01:31:00"
            },
        {
            "day": 1,
            "flight": "AF356",
            "utc": "12:40:00"
            },
        {
            "day": 1,
            "flight": "AF480",
            "utc": "08:58:00"
            },
        {
            "day": 1,
            "flight": "AF250",
            "utc": "12:59:00"
            }
    ]
```

#### Composite Secondary Index

- 복합 보조 인덱스
- 여러 필터(술어, predicate)를 가진 쿼리는 매우 흔한데, 그런 경우 여러 키로 구성된 인덱스를 사용하여, 한정된 문서 키만 반환
- 추가적으로, 쿼리가 인덱스의 키만 참조할 경우, 쿼리 엔진은 데이터 노드에서 가져오지 않고 간단하게 인덱스 스캔 결과로부터 응답을 한다
- 각 키는 간단한 scalar field, 오브젝트 또는 배열 가능하다
- 인덱스 필터링이 악용되는 경우에 대해, 필터는 쿼리 필터에 각각의 오브젝트 타입을 사용할 필요가 있다
- 인덱스에서 문서 키를 필터할 필요가 있다면, 보조 인덱스는 문서 키(meta().id)를 명시적으로 포함할 수

#### Functional Index

#### Array Index

#### Partial Index

#### Duplicate Index

#### Covering Index

### [Scans](https://docs.couchbase.com/server/current/learn/services-and-indexes/indexes/index-scans.html)

#### 개요

- 쿼리 실행 동안
  - 인덱스 경로 선택
  - 반환할 값의 범위(쿼리 플랜에서 `span`) 제공하며 스캔 요청
- 인덱스 스캔은 쿼리 플랜 생성과 실행 최적화에 중요한 역할

#### 절차

1. 애플리케이션 및 데이터베이스 드라이버에서 클러스터의 사용 가능한 쿼리 노드 중 하나에 N1QL 쿼리 제출
2. 쿼리 노드는 쿼리를 분석하고, 최적의 실행 플랜을 찾아내기 위해 오브젝트의 메타데이터를 사용하고, 그 다음에 이를 실행
3. 실행 동안, 쿼리에 따라, 적용 가능한 인덱스를 사용하여, 쿼리 노드는 해당 인덱스와 데이터 노드와 함께 작동하여 계획된 작업을 검색하고 수행

#### 쿼리 실행 상세 내용

1. Client | REST API 통해 쿼리 제출

```sql
SELECT
    t.airportname,
    t.city
FROM `tracvel-sample` t
WHERE
    type = "airport" AND
    tz = "America/Anchorage" AND
    geo.alt >= 2100;
```

2. Query Service | 파싱, 분석, 계획 생성
3. Index Service | Scan Request; index filter
4. Index Service | 한정된(qualified) 문서 키 가져오기
5. Data Service | Fetch Request, doc keys
6. Data Service | Fetch Documents
7. Query Service | Evaluate: Doucuments to results
8. Clients | Query result(JSON)
