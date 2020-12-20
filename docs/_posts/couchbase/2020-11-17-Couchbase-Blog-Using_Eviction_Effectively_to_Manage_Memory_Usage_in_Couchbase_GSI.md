---
title: Couchbase Blog Using Eviction Effectively to Manage Memory Usage in Couchbase GSI
author: aimpugn
date: 2020-11-17 09:00:00 +0900
categories: [Couchbase.memory, Couchbase.eviction]
tags: [nosql, couchbase]
---

# [Using Eviction Effectively to Manage Memory Usage in Couchbase GSI](https://blog.couchbase.com/using-eviction-effectively-to-manage-memory-usage-in-couchbase-gsi/)

## Eviction

- Couchbase Server에서 GSI에서 사용되는 Plasma 저장소 하위시스템은 메모리 할당량으로 사용할 특정 값으로 초기화된다
- 저장소 하위 시스템은 메모리 사용량을 지속적으로 추적하고 할당 됐지만 필수적이지 않은 메모리를 확보 메모리 할당량을 유지하는데, 메모리 확보는 종종 `eviction(축출, 퇴거)`라고 한다
  - 저장소 하위시스템은 저장소 하위시스템이 관리하는 데이터를 메모리상에 가변 크기의 페이지로 구성
  - 메모리 사용량을 추적하고 메모리 사용량이 할당량을 초과하면 `페이지를 디스크로 퇴거`시킨다
  - 할당량 이하로 메모리를 내리기 위해 충분한 수의 페이지를 제거한 후, `eviction`은 중지
- 한 노드의 모든 플라즈마 인스턴스에 적용 가능한 메모리 할당량은 GSI를 통해 설정된다
- 플라즈마 저장소 하위 시스템은 모든 인스턴스가 필수적이지 않은 메모리를 확보함으로써 메모리 할당량을 유지할 수 있도록 한다
- 사용되는 메모리가 할당량을 초과할 때, 작업 집합에 포함되지 않는 페이지가 발견되면 `swapper thread`에 의해 축출되고 사용되는 메모리를 낮춘다

### `Burst Eviction`

- 메모리 할당량을 넘어서 메모리가 사용될 때 축출을 촉발시키는 프로세스를 `Burst Eviction`이라고 한다
- 변화(`mutation`)을 멈추고 메모리가 그 할당량 이하로 내려갈 때까지 스캔
- 이 과정은 시스템의 CPU 사용량, 지연시간, 그리고 처리량에 부정적인 영향을 끼친다
- `Burst Eviction`은 메모리가 그 할당량 이하로 사용되면 멈춘다
-

### `Periodic Eviction`

- `Periodic Eviction`은 `Burst Eviction`의 부정적인 영향을 완화시킬 수 있다
- `sweep interval`이라고 볼리는 정기적인 간격으로 실행되며, 메모리상의 페이지를 스캔하고 활발하게(actively) 사용되는 페이지 추적
- 현재 `sweep`과 이전 `sweep` 사이에 수정 또는 스캔에 사용되는 일부 페이지는 `작업 집합(working set)`이라 한다
- `작업 집합`에 포함되지 않는 페이지를 축출하는 것은 메모리 사용이 급증(in case of a spike in memory usage)할 경우 헤드룸(headroom)을 만들어주고 필요한 페이지는 메모리상에 유지시켜준다

## 파라미터 구성

### `evictSweepInterval`
