---
title: Couchbase Learn Data Model
author: aimpugn
date: 2020-11-07 10:47:00 +0900
categories: [Couchbase.learn.data_model]
tags: [nosql, couchbase]
math: true
use_math: true
---

# The Couchbase Data Model

## 개요

- 가볍고 유연한 스키마 제공

## [Couchbase Server and JSON: The Benefits](https://docs.couchbase.com/server/current/learn/data/document-data-model.html#couchbase-server-and-json-the-benefits)

- 간단하고, 가볍고, 사람이 읽기 쉬운 표현방식을 제공하는 JSON 기반
- 지원 데이터 타입
  - `basic`: 숫자, 문자열
  - `complex`: 하위 문서(embedded documents)와 배열
- 빠른 직렬화와 역직렬화, JavaScript 기본, 가장 흔한 REST API 반환 타입 등
- 개별 문서는 애플리케이션 코드에서 오브젝트의 한 인스턴스를 나타낸다
  - `document` &#8594; RDBMS의 `row`
  - `attributes` &#8594; RDBMS의 `column`
- 다양한 `schemas`로 JSON 문서를 저장할 수 있어서 훨씬 유연하다
- 또한 `document`는 중첩된 구조(nested structures)를 포함할 수 있기 때문에, `reference` 또는 `junction` 테이블 없이 `many-to-many` 관계를 나타낼 수 있으며, 계층 구조를 자연스럽게 표현할 수 있다

## [Documents versus Tables](https://docs.couchbase.com/server/current/learn/data/document-data-model.html#documents-versus-tables)

### Tables

|     Airline      |      Flight       |     Schedule      |
| :--------------: | :---------------: | :---------------: |
|   Airline Name   |                   |                   |
|     Address      |                   |                   |
|                  |     Aircraft      |                   |
|                  |                   |   Arrival Time    |
| **Carrier Code** | **Carrier Code**  |
|                  |                   |        Day        |
|                  |                   |  Departure Time   |
|   Description    |                   |                   |
|                  | **Flight Number** | **Flight Number** |
|                  |       From        |                   |
|                  |        To         |                   |

### Documents

|                                                                                                        Route                                                                                                         |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                                         From                                                                                                         |
|                                                                                                          To                                                                                                          |
| <table><thead><tr><th>Schedule[]</th></tr></thead><tbody><tr><td>Airline</td></tr><tr><td>Arrival Time</td></tr><tr><td>Day</td></tr><tr><td>Departure Time</td></tr><tr><td>Flight Number</td></tr></tbody></table> |

- 각 문서는 다른 것과 관계 필요없이 자급 자족적
- 애플리케이션 요청을 빠르게 충족
- `확장성(scalability)`과 `지연 시간(latency)`에 중요한 영향
  - 다른 문서 접근할 필요없이 복제되거나 원자적으로 수정 가능
  - 노드 간의 복잡한 협업 제거
  - 경합(contention) 최소화

## [유연하고 동적인 스키마](https://docs.couchbase.com/server/current/learn/data/document-data-model.html#flexible-dynamic-schema)

- 문서 모델에서, `schema` &#8594; `애플리케이션이 문서를 구조화한 결과`로, 스키마는 전적으로 애플리케이션에 의해 정의되고 관리
-
