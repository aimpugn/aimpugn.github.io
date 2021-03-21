---
title: ch13 최단 경로 문제
author: aimpugn
date: 2021-03-21 20:00:00+0900
use_math: true
categories: [PAI, algorithms]
---

- [최단 경로 문제](#최단-경로-문제)
  - [개요](#개요)
  - [다익스트라 알고리즘](#다익스트라-알고리즘)
    - [코드](#코드)
    - [설명](#설명)
    - [단점](#단점)
  - [A* 알고리즘](#a-알고리즘)
    - [Episode 1 - pseudocode](#episode-1---pseudocode)
    - [Episode 2 - grid](#episode-2---grid)
    - [Episode 3 - astar](#episode-3---astar)
    - [Episode 4 - heap](#episode-4---heap)
    - [Episode 5 - units](#episode-5---units)
    - [Episode 6 - weights](#episode-6---weights)
    - [Episode 7 - smooth weights](#episode-7---smooth-weights)
    - [Episode 8 - smooth path](#episode-8---smooth-path)
    - [Episode 9 - smooth path 02](#episode-9---smooth-path-02)
    - [Episode 10 - threading](#episode-10---threading)
  - [참고 내용](#참고-내용)

# 최단 경로 문제

## 개요

> 각 간선의 가중치 합이 최소가 되는 두 정점(또는 노드) 사이의 경로를 찾는 문제

- 용어
  - 정점(vertex): 교차로
  - 간선(edge): 길
  - 가중치(weight): 이동 비용
- 그래프의 종류와 특성에 따라 다양한 최단 경로 알고리즘 존재. 가장 유명한 것은 다익스트라 알고리즘

## [다익스트라 알고리즘](https://ko.wikipedia.org/wiki/%EB%8D%B0%EC%9D%B4%ED%81%AC%EC%8A%A4%ED%8A%B8%EB%9D%BC_%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)

![Dijkstra_Animation](../../assets/images/pai/ch13/Dijkstra_Animation.gif)

### 코드

```python
function Dijkstra(Graph, source):
  create vertex set Q
  # 초기화
  for each vertex v in Graph:     
    # 소스에서 v까지의 아직 모르는 길이는 무한으로 설정. 실제 무한은 아니고, 아직 방문하지 않았음을 의미.   
    dist[v] = INFINITY 
    # 소스에서 최적 경로의 이전 꼭짓점
    prev[v] = UNDEFINED
    # 모든 노드는 초기에 Q에 속해있다 (미방문 집합)
    add v to Q

  # 소스에서 소스까지의 길이
  dist[source] = 0

  while Q is not empty:
    # 최소 거리를 갖는 꼭짓점을 가장 먼저 선택하고 제거(우선순위 큐 사용)
    u = vertex in Q with min dist[u]
    remove u from Q

    # v는 Q에 남아 있는 정점으로, 최소 거리 갖는 현재 노드의 인접 노드들
    for each neighbor v of u:
      # v 까지의 더 짧은 경로를 찾았을 때
      alt = dist[u] + length(u, v)
      if alt < dist[v]:
        # 다음 인점 노드 v까지의 거리
        dist[v] = alt
        # v 이전 노드 업데이트
        prev[v] = u

return dist[], prev[]
```

### 설명

- 항상 노드 주변의 최단 경로만을 택하는 대표적인 그리디(Greedy) 알고리즘 중 하나
- 노드 주변 탐색 시 BFS 이용하는 대표적인 알고리즘
- 여러 갈림길을 탐색하며 가장 먼저 도착한 길을 선택
- 하지만 가중치가 음수인 경우는 처리할 수 없다
- heap?
  - 완전 이진 트리의 일종.
  - 우선순위 큐를 위해 만들어진 자료 구조
  - max heap: 부모 노드의 키 값 >= 자식 노드의 키 값
  - min heap: 부모 노드의 키 값 <= 자식 노드의 키 값

### 단점

- 임의의 정점을 출발 집합에 더할 때, 그 **정점까지의 최단 거리는 계산이 끝났다는 확신**을 갖고 더한다.
- 만일 이후에 더 짧은 경로가 존재한다면 다익스트라 알고리즘의 논리적 기반이 무너진다.
  - 모두 값을 더해서 양수로 변환하는 방법
  - 벨만-포드 알고리즘 같은 음수 가중치 계산할 수 있는 다른 알고리즘 사용
  - 최장 거리 구하는 데에는 사용 불가

## [A* 알고리즘](https://ko.wikipedia.org/wiki/A*_%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)

- [SebLague/Pathfinding](https://github.com/SebLague/Pathfinding) 코드 내용을 분석하며 공부

### Episode 1 - pseudocode

```java
OPEN //the set of nodes to be evaluated
CLOSED //the set of nodes already evaluated
add the start node to OPEN
 
loop
  current = node in OPEN with the lowest f_cost
            remove current from OPEN
            add current to CLOSED

  if current is the target node //path has been found
    return

  foreach neighbour of the current node
    if neighbour is not traversable or neighbour is in CLOSED
      skip to the next neighbour

    if new path to neighbour is shorter OR neighbour is not in OPEN
      set f_cost of neighbour
      set parent of neighbour to current
      if neighbour is not in OPEN
        add neighbour to OPEN
```

- `OPEN`:
  - 평가될 노드 집합
- `CLOSED`:
  - 이미 평가된 노드 집합
- `current`:
  - `OPEN`에서 `f_cost`가 가장 작은 노드
  - `OPEN`에서 제거하고, `CLOSED`에 추가
- `current`가 `target`이면 종료

### Episode 2 - grid

### Episode 3 - astar

### Episode 4 - heap

### Episode 5 - units

### Episode 6 - weights

### Episode 7 - smooth weights

### Episode 8 - smooth path

### Episode 9 - smooth path 02

### Episode 10 - threading

## 참고 내용

<iframe width="560" height="315" src="https://www.youtube.com/embed/-L-WgKMFuhE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/OQ5jsbhAv_M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/T8mgXpW1_vc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/X3x7BlLgS-4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/-L-WgKMFuhE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<iframe width="560" height="315" src="https://www.youtube.com/embed/nhiFx28e7JY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- [SebLague/Pathfinding](https://github.com/SebLague/Pathfinding)
- [A* Pathfinding for Beginners](https://www.gamedev.net/tutorials/programming/artificial-intelligence/a-pathfinding-for-beginners-r2003/)
