---
title: ch18 Binary Search
author: aimpugn
date: 2021-04-25 17:00:00+0900
use_math: true
categories: [PAI, algorithms]
---

- [ch18 Binary Search](#ch18-binary-search)
  - [개요](#개요)
  - [전제 조건](#전제-조건)
  - [pseudocode](#pseudocode)
  - [이진 검색 알고리즘 버그](#이진-검색-알고리즘-버그)

# [ch18 Binary Search](https://en.wikipedia.org/wiki/Binary_search_algorithm)

## 개요

- 찾으려는 값을 배열 중앙의 요소와 비교하여 같지 않으면 찾으려는 값이 있을 수 없는 절반은 버리고, 남은 절반에서 탐색
- 시간복잡도: O(log n)의 로그 시간 알고리즘
- [이진 탐색 트리(Binary Search Tree)와의 차이점?](https://stackoverflow.com/a/21588248)

| 이진 검색                    | 이진 탐색 트리              |
| ---------------------------- | --------------------------- |
| 알고리즘                     | 자료구조                    |
| 정렬된 배열에서 값을 찾는 것 | 정렬된 구조를 저장하고 탐색 |

## 전제 조건

- 데이터가 정렬되어 있을 것
- 자료 구조의 모든 요소가 상수 시간으로 접근 가능해야 한다
  - 배열, 맵, dictionary처럼 [인덱스 또는 키를 통해 범위를 좁혀가기 때문](https://www.geeksforgeeks.org/complexity-analysis-of-binary-search/)
  - 따라서 [연결 리스트는 이진 검색에 적합하지 않다](https://www.quora.com/Why-is-binary-search-not-possible-using-linked-list/answer/Vedansh-Gurunathan?ch=10&share=db2dbc37&srid=xQc4)

## pseudocode

```py
function binary_search(A, n, T) is
    L := 0
    R := n − 1
    while L ≤ R do
        m := floor((L + R) / 2)
        if A[m] < T then
            L := m + 1
        else if A[m] > T then
            R := m − 1
        else:
            return m
    return unsuccessful


function binary_search_alternative(A, n, T) is
    L := 0
    R := n − 1
    while L != R do
        m := ceil((L + R) / 2)
        if A[m] > T then
            R := m − 1
        else:
            L := m
    if A[L] = T then
        return L
    return unsuccessful
```

## 이진 검색 알고리즘 버그

```py
mid = (left + right) // 2
```

- left와 right를 더해서 자료형 최댓값을 넘는 값이 될 수 있다
- `left + right`의 오버플로를 막으려면 `right - left`를 사용

```py
mid = left + (right - left) // 2
```
