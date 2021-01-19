---
title: ch8 Linked List
author: aimpugn
date: 2021-01-19 23:41:00+0900
use_math: true
categories: [PAI, algorithms]
---
- [연결 리스트](#연결-리스트)
  - [개요](#개요)
  - [장점](#장점)
  - [단점](#단점)
  - [종류](#종류)
    - [단방향](#단방향)
    - [양방향](#양방향)
    - [단방향 환형](#단방향-환형)
    - [양방향 환형](#양방향-환형)
  - [참조](#참조)

# 연결 리스트

## 개요

- 배열과 함께 가장 기본이 되는 대표적인 `선형 자료구조` 중의 하나
- 다양한 `추상 자료형`(ADT) 구현의 기반이 된다
- 데이터를 구조체로 묶어서 포인터로 연결

## 장점

- 동적으로 새로운 노드 삽입 또는 삭제 산편
- 배열과 달리 연결 구조 통해 물리 메모리 연속적으로 사용하지 않아도 되므로 관리도 쉽다
- 시작 또는 끝 지점에 아이템을 추가/삭제/추출하는 작업은 O(1)에 가능

## 단점

- 특정 인덱스 접근 위해서는 전체를 순서대로 읽어야 하므로 상수 시간에 접근할 수 없으며, 탐색에 O(n) 소요

## 종류

### 단방향

![Singly Linked List](/docs/assets/images/ch8/Singly-linked-list.png)

### 양방향

![Doubly Linked List](/docs/assets/images/ch8/Doubly-linked-list.png)

### 단방향 환형

![Circular Linked List](/docs/assets/images/ch8/Circularly-linked-list.png)

### 양방향 환형

## 참조

- [Linked List](https://computersciencewiki.org/index.php/Linked_list)
- [Circular Singly Linked List](https://www.geeksforgeeks.org/circular-singly-linked-list-insertion/)
- [Doubly Circular Linked List](https://www.geeksforgeeks.org/doubly-circular-linked-list-set-1-introduction-and-insertion/)
- [Doubly Linked List](https://rosettacode.org/wiki/Doubly-linked_list/Definition#Python)
