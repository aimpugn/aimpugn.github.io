---
title: ch21 greedy
author: aimpugn
date: 2021-05-20 21:00:00+0900
use_math: true
categories: [PAI, algorithms]
---

- [탐욕 알고리즘](#탐욕-알고리즘)
  - [개요](#개요)
  - [목표](#목표)
  - [대상이 되는 문제들](#대상이-되는-문제들)
    - [`탐욕 선택 속성`을 갖는 `최적 부분 구조`인 문제들](#탐욕-선택-속성을-갖는-최적-부분-구조인-문제들)
    - [그리디 알고리즘이 잘 작동하는 예](#그리디-알고리즘이-잘-작동하는-예)
  - [다이나믹 프로그래밍과의 비교](#다이나믹-프로그래밍과의-비교)
  - [배낭 문제(Knapsack Problem)](#배낭-문제knapsack-problem)
    - [분할 가능 - 그리디 알고리즘](#분할-가능---그리디-알고리즘)
    - [분할 불가능 - 다이나믹 프로그래밍](#분할-불가능---다이나믹-프로그래밍)
  - [동전 바꾸기 문제](#동전-바꾸기-문제)
  - [가장 큰 합](#가장-큰-합)

# [탐욕 알고리즘](https://ko.wikipedia.org/wiki/%ED%83%90%EC%9A%95_%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98)

## 개요

- 글로벌 최적을 찾기 위해 각 단계에서 로컬 최적의 선택을 하는 휴리스틱 문제 해결 알고리즘  
  - [휴리스틱(heuristics) 또는 발견법(發見法)](https://ko.wikipedia.org/wiki/%ED%9C%B4%EB%A6%AC%EC%8A%A4%ED%8B%B1_%EC%9D%B4%EB%A1%A0)이란 불충분한 시간이나 정보로 인하여 합리적인 판단을 할 수 없거나, 체계적이면서 합리적인 판단이 굳이 필요하지 않은 상황에서 사람들이 빠르게 사용할 수 있게 보다 용이하게 구성된 간편추론의 방법
  - [What's the difference between greedy and heuristic algorithm?](https://stackoverflow.com/questions/21537028/whats-the-difference-between-greedy-and-heuristic-algorithm)
- 눈앞의 이익만을 좇는 알고리즘
- 로컬 최적해(Locally Optimum Solution) 찾는 탐욕스런 방법
- 로컬 최적해 찾기 위해 문제를 더 작게 줄여 나가는 형태

## 목표

- 최적화 문제를 대상으로 한다
- 최적해 찾기, 없으면 그런대로 괜찮은 해 찾기

## 대상이 되는 문제들

### `탐욕 선택 속성`을 갖는 `최적 부분 구조`인 문제들

- `탐욕 선택 속성(Greedy Choice Property)`:
  - 앞의 선택이 이후 선택에 영향을 주지 않는 것
  - 선택을 다시 고려하지 않는다
- `최적 부분 구조(Optimal Substructure)`:
  - 최적 해결 방법은 부분 문제에 대한 최적 해결 방법으로 구성되는 경우

### 그리디 알고리즘이 잘 작동하는 예

- 다익스트라 알고리즘
- 허프만 코딩 알고리즘
  - [Huffman_coding#Compression](https://en.wikipedia.org/wiki/Huffman_coding#Compression)
  - [허프만 알고리즘](https://namu.wiki/w/%ED%97%88%ED%94%84%EB%A7%8C%20%EC%BD%94%EB%93%9C#s-3)
  - [[압축 알고리즘] 허프만 부호화 (Huffman coding) + JAVA 구현](https://suyeon96.tistory.com/11)
- 의사결정(Decision Tree) 알고리즘으로 유명한 ID3 알고리즘
  - [ID3_algorithm#Pseudocode](https://en.wikipedia.org/wiki/ID3_algorithm#Pseudocode)
  - [A Step by Step ID3 Decision Tree Example(번역)](https://a292run.tistory.com/entry/A-Step-by-Step-ID3-Decision-Tree-Example-1)
  - [A Step by Step ID3 Decision Tree Example(원본)](https://sefiks.com/2017/11/20/a-step-by-step-id3-decision-tree-example/)

## [다이나믹 프로그래밍과의 비교](https://pediaa.com/what-is-the-difference-between-greedy-method-and-dynamic-programming/)

| 그리디                                                 | 다이나믹 프로그래밍                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 부분 최적해로 전체 최적해를 찾으려는 문제해결 휴리스틱 | 겹치는 부분 문제와 최적의 하부 구조 속성을 가진 문제들을 푸는 데 도움을 주는 알고리즘 |
| 덜 효율적이다                                          | 더 효율적이다                                                                         |
| 처음 선택 시 최선으로 보이는 것으로 부분 문제들을 해결 | 모든 부분 문제를 풀고 최적 솔루션을 찾는 데 도움을 주는 하나를 선택                   |
| 첫 단계를 고려하여 의사 결정                           | 모든 단계에서 의사 결정                                                               |

## [배낭 문제(Knapsack Problem)](https://namu.wiki/w/%EB%B0%B0%EB%82%AD%20%EB%AC%B8%EC%A0%9C)

- 항목들이 분할 가능한 경우(12kg을 나눠서 담을 수 있음)
- 조합 최적화(Combinational Optimization) 분야의 매우 유명한 문제
- 배낭의 가치가 최대가 되도록 담을 짐을 고르는 방법을 찾는 문제

### 분할 가능 - 그리디 알고리즘

- 단가 계산

| 항목  |   $   |  kg   | 단가  |
| :---: | :---: | :---: | :---: |
|   A   |   4   |  12   | 0.33  |
|   D   |   1   |   1   |   1   |
|   E   |   2   |   2   |   1   |
|   B   |   2   |   1   |   2   |
|   C   |  10   |   4   |  2.5  |

```py
def fractional_knapsack(cargo):
    capacity = 15
    pack = []
    for c in cargo:
        # (단가, 가격, 무게)
        pack.append((c[0] / c[1], c[0], c[1]))
    pack.sort(reverse = True)

    # 단가 순 그리디 계산
    total_value: float = 0
    for p in pack:
        if capacity - p[2] >= 0:
            # 항목 전체를 그대로 넣을 수 있는 경우
            print('in if capacity: {}, p: {}'.format(capacity, p))
            capacity -= p[2] # 담을 무게만큼 배낭 무게 제거
            total_value += p[1]
        else:
            # 항목 전체를 그대로 넣을 수 없는 경우 분할
            print('in else capacity: {}, p: {}'.format(capacity, p))
            fraction = capacity / p[2]
            total_value += p[1] * fraction
            break
    return total_value

cargo = [
    (4, 12),
    (2, 1),
    (10, 4),
    (1, 1),
    (2, 2),
]
print(fractional_knapsack(cargo))
```

### 분할 불가능 - 다이나믹 프로그래밍

- 항목들이 분할 불가능한 경우(12kg을 그대로 담아야 함)
- p.632

## [동전 바꾸기 문제](https://en.wikipedia.org/wiki/Change-making_problem)

> 주어진 금액이 되는 최소 동전 수를 찾는 문제

- 거스름돈 교환 문제라고도 한다
- 동전 액면이 이전 액면의 배수 이상인 경우
  - **그리디 알고리즘**으로 풀 수 있다
  - `주어진 금액`: 160원
  - `동전`: 10원, 50원, 100원 등
  - `최소 동전 수`: 100 + 50 + 10 = 3개
- 동전 액면이 이전 액면의 배수 이상이 아닌 경우
  - **다이나믹 프로그래밍**으로 풀 수 있다
  - `주어진 금액`: 160원
  - `동전`: 10원, 50원, **80원**, 100원 등
  - `최소 동전 수`: 80 + 80 = 2개

```py
# https://www.geeksforgeeks.org/greedy-algorithm-to-find-minimum-number-of-coins/
def findMin(money, monetary_units):
    n = len(monetary_units)
    ans = []
    # Traverse through all denomination
    i = n - 1
    while(i >= 0):
        # Find denominations
        while (money >= monetary_units[i]):
            money -= monetary_units[i]
            ans.append(monetary_units[i])
        i -= 1

    return ans

print(findMin(160, [10, 50, 100]))
print(findMin(160, [10, 50, 80, 100])) # 최적해 아니다
```

## 가장 큰 합

> 노드를 계속 더해가다가 마지막에 가장 큰 합이 된느 경로를 찾는 문제

- 그리디 알고리즘의 실패 사례
  - 부분적으로는 최적해, 전체적으로는 최적해 실패

```py
        7
        └───┐
    3       12
             └─┐
  99  8    5   6
```

- 당장 앞의 큰 값만 찾아가다 보면 99를 찾을 수 없다
- 이진 트리 정렬 등 추가 작업하지 않는 한, 그리디 알고리즘으로는 풀이할 수 없다
