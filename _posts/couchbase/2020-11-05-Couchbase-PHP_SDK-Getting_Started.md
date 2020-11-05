---
title: Couchbase PHP SDK Getting Started
author: aimpugn
date: 2020-11-05 11:00:00 +0900
categories: [Couchbase.terminology]
tags: [nosql, couchbase]
math: true
use_math: true
---

# 설치 및 PHP SDK 사용

## 개요

- PHP에서 Couchbase 클러스터 연결할 수 있도록 해준다
- PHP native extension이고 C 라이브러리 사용하여 Couchbase binary 프로토콜 통해 클러스터와의 통신을 다룬다
- 3.0 버전은 완전히 재작성
  - 오버로드를 줄여서 노출되는 영역을 간소화
  - [Collections와 Scopes](https://docs.couchbase.com/php-sdk/current/concept-docs/collections.html) 같은 장래의 Couchbase 서버 기능 지원 추가

### [Collection과 Scopes](https://docs.couchbase.com/php-sdk/current/concept-docs/collections.html)

#### Collections

- type이 `Couchbase` 또는 `Ephemeral`인 버킷 내의 데이터 컨테이너
- 버킷 당 1000개의 컬렉션 생성 가능
- content-type에 따라 Bucket-items는 선택적으로 다른 컬렉션에 할당될 수 있다

#### Scopes

- `Collection`을 그룹화하기 위한 메커니즘으로, 버킷당 100개까지 생성될 수 있다.
- 컬렉션의 이름은 스코프 내에서 반드시 유니크해야 한다
- 컬렉션은 content-type 또는 deployment-phase(dev > qa > production)에 따라 다른 scopes에 할당될 수 있다

## 설치

### [C SDK - libcouchbase(LCB)](https://docs.couchbase.com/c-sdk/current/hello-world/start-using-sdk.html)

### [PHP SDK](https://docs.couchbase.com/php-sdk/current/hello-world/start-using-sdk.html#installing-the-sdk)

```
pecl install https://packages.couchbase.com/clients/php/couchbase-3.0.3.tgz
```

## 사용

### PHP-SDK

- Couchbase는 [역할 기반 접근 제어(RBAC)](https://docs.couchbase.com/server/current/learn/security/roles.html) 사용
- 실서비스의 경우 [권한 제어](https://docs.couchbase.com/php-sdk/current/howtos/managing-connections.html#rbac)
- `Cluster`는 `N1Ql` 쿼리, 분석, 풀텍스트 검색 같은 클러스터 레벨의 접근 제공

```
$connectionString = "couchbase://localhost";
$options = new \Couchbase\ClusterOptions();
$options->credentials("Administrator", "password");
$cluster = new \Couchbase\Cluster($connectionString, $options);
```

- `Key/Value API` 또는 `Query views`에 접근하려면 `Bucket`을 열어야 한다

```
// get a bucket reference
$bucket = $cluster->bucket(<BUCKET NAME>);
```

- 기본 `Collection` 또는 `named Collection` 가져오기

```
// get a collection reference
$collection = $bucket->defaultCollection();

// or for named collection
$collection = $bucket->scope("myapp")->collection("my-collection");
```
