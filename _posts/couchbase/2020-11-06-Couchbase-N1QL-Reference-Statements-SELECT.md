---
title: Couchbase N1QL Reference Statements SELECT
author: aimpugn
date: 2020-11-06 16:00:00 +0900
categories: [Couchbase.terminology]
tags: [nosql, couchbase]
math: true
use_math: true
toc: true
---

# [SELECT](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/selectintro.html)

## 개요

## [`SELECT` 문법]()

## [`SELECT` 절]()

## [`WITH` 절]()

## [`FROM` 절]()

## [`USE` 절](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/hints.html)

- `USE` 절을 사용하여 쿼리가 특정 키 또는 특정 인덱스를 사용하도록 지정할 수 있다

### 목적

- `FROM` 절 내에서 사용된다
- 쿼리가 특정 키 또는 인덱스를 사용하도록 쿼리 서비스에 힌트를 제공

### 전제 조건

- 문서 또는 키스페이스에서 문서를 조회하려면, 반드시 `query_select` 권한이 있어야 한다
- 자세한 사항은 권한 부여([Authorization](https://docs.couchbase.com/server/current/learn/security/authorization-overview.html)) 참조

### 문법

```
use-clause ::= use-keys-clause | use-index-clause
```

### `USE KEYS` 절

#### 목적

- 이 문법을 사용하여 문서의 유니크한 문서 키를 참조할 수 있다
- 해당 문서 키를 가진 문서만 쿼리에 대한 입력(input)으로 포함

#### 문법

```
use-keys-clause ::= USE use-keys-term
```

```
use-keys-term ::= [ PRIMARY ] KEYS expr
```

- `use-keys-clause`는 `USE use-keys-term`로 구성
- `USE use-keys-term`는 `[ PRIMARY ] KEYS expr`로 구성
- `USE KEYS`오 `USE PRIMARY KEYS`는 동의어

#### 인자

##### expr

- 문서 키
- 콤마로 구별되는 문서 키 배열

#### 예제1

##### Query

```sql
SELECT *
FROM `travel-sample`
USE KEYS "airport_1254";
```

##### Result

```json
[
  {
    "travel-sample": {
      "airportname": "Calais Dunkerque",
      "city": "Calais",
      "country": "France",
      "faa": "CQF",
      "geo": {
        "alt": 12,
        "lat": 50.962097,
        "lon": 1.954764
      },
      "icao": "LFAC",
      "id": 1254,
      "type": "airport",
      "tz": "Europe/Paris"
    }
  }
]
```

#### 예제2

##### Query

```sql
SELECT *
FROM `travel-sample`
USE KEYS ["airport_1254","airport_1255"];
```

##### Result

```json
[
  {
    "travel-sample": {
      "airportname": "Calais Dunkerque",
      "city": "Calais",
      "country": "France",
      "faa": "CQF",
      "geo": {
        "alt": 12,
        "lat": 50.962097,
        "lon": 1.954764
      },
      "icao": "LFAC",
      "id": 1254,
      "type": "airport",
      "tz": "Europe/Paris"
    }
  },
  {
    "travel-sample": {
      "airportname": "Peronne St Quentin",
      "city": "Peronne",
      "country": "France",
      "faa": null,
      "geo": {
        "alt": 295,
        "lat": 49.868547,
        "lon": 3.029578
      },
      "icao": "LFAG",
      "id": 1255,
      "type": "airport",
      "tz": "Europe/Paris"
    }
  }
]
```

### `USE INDEX` 절

#### 목적

- 인덱스 또는 여러 인덱스가 쿼리 실행의 일부로 사용되도록 지정
- 인덱스가 쿼리에 적용 가능하면 쿼리 엔진은 지정된 인덱스 사용 시도
- Couchbase Server 6.6 이상부터는 index 이름을 생략하고 index type만 지정해도 되며, 이 경우 쿼리 서비스는 지정된 타입의 모든 가능한 인덱스를 고려한다

#### 문법

```
use-index-clause ::= USE use-index-term
```

```
use-index-term ::= INDEX '(' index-ref [ ',' index-ref ]* ')'
```

```
index-ref ::= [ index-name ] [ index-type ]
```

```
index-type ::= USING ( GSI | FTS )
```

- 사용한 인덱스 형식 지정
- `GSI`
  - 기본값
  - Global Secondary Index
  - 인덱스 노드에 존재하며 데이터 노드에서 분리될 수 있다
- `FTS`:
  - 옵션
  - Full Text Search Index
  - 쿼리에서 [Search functions](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/searchfun.html) 포함하는 경우 사용
  - 6.6 EE 이상
    - 쿼리가 Full Text Search index 사용하는 [Flex Index](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/flex-indexes.html) 쿼리임을 지정하는 힌트로 사용할 수 있다
  - 6.6 CE 이상
    - 쿼리에 [Search functions](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/searchfun.html) 없으면 이 힌트는 무시된다

```
USE INDEX ([ index-name ] USING ( GSI | FTS ))
```

#### 인자

##### `index-name`

- 6.6 이상부터 옵션
- 쿼리에서 사용될 인덱스를 나타내는 문자열 또는 표현식

#### 예제1

##### Query with GSI

```sql
-- airlines와 destination airports의 인덱스 생성
CREATE INDEX idx_destinations
ON `travel-sample` (airlineid, airline, destinationairport)
WHERE type="route";
```

```sql
-- SFO(San Francisco)에서 온 비행기 조회하는 쿼리
SELECT
    airlineid,
    airline,
    sourceairport,
    destinationairport
FROM `travel-sample`
    USE INDEX (idx_destinations USING GSI)
WHERE sourceairport = "SFO";
```

#### 예제2

##### Query with FTS

```sql
SELECT META().id
FROM `travel-sample` USE INDEX (USING FTS)
WHERE type = "hotel" AND (state = "Corse" OR state = "California");
```

## [`JOIN` 절]()

## [`NEST` 절]()

## [`UNNEST` 절]()

## [`LET` 절]()

## [`WHERE` 절]()

## [`GROUP BY` 절]()

## [`UNION`, `INTERSECT`, `EXCEPT` 절]()

## [`ORDER BY` 절]()

## [`LIMIT` 절]()

## [`OFFSET` 절]()
