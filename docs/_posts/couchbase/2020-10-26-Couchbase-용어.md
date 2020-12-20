---
title: Couchbase 용어
author: aimpugn
date: 2020-10-26 13:10:00 +0900
categories: [Couchbase.terminology]
tags: [nosql, couchbase]
math: true
use_math: true
---

# [용어](https://docs.couchbase.com/server/current/learn/glossary.html)

## Cluster

### 개념

1. 하나 이상의 Couchbase Server 인스턴스로서
   - 서로 독립적인 노드에서 실행되지만
   - 하나의 통합된 시스템을 형성하기 위해서
   - 다른 노드의 서버들과 협력
2. 자원은 공유되고 데이터 접근과 관리 위한 단일 인터페이스 제공

## Bucket

### 개념

1. 항목(items)들을 그룹화하는, 논리적인, 사용자가 명명한 개체(entity)

### 특징

1.  데이터 접근 가능
2.  인덱스 가능
3.  레플리케이션 가능
4.  접근 제어 가능

### 종류

1.  Couchbase: 메모리와 디스크에 데이터 유지
2.  Ephemeral: 메모리에만 데이터 유지
3.  Memcached: 다른 데이터 플랫폼(RDBMS) 등의 컨텍스트에서 사용되도록 디자인 됨
