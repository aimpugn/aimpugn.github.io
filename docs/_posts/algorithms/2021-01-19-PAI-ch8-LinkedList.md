---
title: ch8 Linked List
author: aimpugn
date: 2021-01-19 23:41:00+0900
use_math: true
categories: [PAI, algorithms]
---

- [연결 리스트](#연결-리스트)
  - [개요](#개요)
  - [연결 리스트란?](#연결-리스트란)
    - [배열의 데이터 저장 방식](#배열의-데이터-저장-방식)
    - [연결 리스트의 데이터 저장 방식](#연결-리스트의-데이터-저장-방식)
  - [장점](#장점)
  - [단점](#단점)
  - [종류](#종류)
    - [단방향](#단방향)
      - [구조](#구조)
      - [코드](#코드)
    - [양방향](#양방향)
    - [단방향 환형](#단방향-환형)
    - [양방향 환형](#양방향-환형)
  - [python에서의 사용례](#python에서의-사용례)
  - [참조](#참조)

# 연결 리스트

## 개요

- 배열과 함께 가장 기본이 되는 대표적인 `선형 자료구조` 중의 하나
- 다양한 `추상 자료형`(ADT) 구현의 기반이 된다
- 데이터를 구조체로 묶어서 포인터로 연결

## [연결 리스트란?](https://stackabuse.com/linked-lists-in-detail-with-python-examples-single-linked-lists/)

### 배열의 데이터 저장 방식

- 배열은 연속된 메모리 공간에 데이터를 저장
- 예를 들어, 첫번째 요소가 10번째 인덱스에 15 bytes의 저장된다면, 두번째 요소는 *10 + 15 + 1 = 26번째 인덱스*에 저장

### 연결 리스트의 데이터 저장 방식

- 배열과는 반대로, 연속된 메모리 공간에 저장하지 않는다
- `요소의 값`과 `다음 요소에 대한 포인터 또는 참조`를 저장한다
- 예를 들어 노드가 `30 | 10`로 구성되어 있다면, 이 노드의 값은 30이고 다음 요소가 메모리 위치 10에 위치함을 의미한다
- 연결 리스트를 순회하려면 반드시 첫번째 노드의 메모리 위치 또는 참조를 알아야 한다

## 장점

- 동적으로 새로운 노드 삽입 또는 삭제 산편
- 배열과 달리 연결 구조 통해 물리 메모리 연속적으로 사용하지 않아도 되므로 관리도 쉽다
- 시작 또는 끝 지점에 아이템을 추가/삭제/추출하는 작업은 O(1)에 가능

## 단점

- 특정 인덱스 접근 위해서는 전체를 순서대로 읽어야 하므로 상수 시간에 접근할 수 없으며, 탐색에 O(n) 소요

## 종류

### 단방향

#### 구조

![Singly Linked List](../../assets/images/ch8/Singly-linked-list.png)

#### 코드

```python
class SingleyLinkedList(object):
    class Node(object):
        def __init__(self, data, next: 'Node' = None):
            self.data = data
            self.next = next

    def __init__(self):
        self.start = None

    """
    처음에 삽입
    """
    def insert_at_start(self, data):
        # 새로운 노드 생성
        new = self.Node(data, self.start)
        # 시작 노드에 새로 생성한 노드로 할당
        self.start= new

    """
    끝에 삽입
    """
    def insert_at_end(self, data):
        new = self.Node(data)
        # 시작도 없다면 시작 지점에 삽입
        if self.start is None:
            self.start = new
            return
        curr = self.start
        while curr.next is not None:
            curr = curr.next
        curr.next = new

    """
    특정 요소 다음에 삽입
    """
    def insert_after_item(self, target, data) -> bool:
        curr = self.start
        # 대상 값을 가진 노드가 있는지 확인
        while curr is not None:
            if curr.val == target:
                break
            curr = curr.next
        # 없으면 False
        if curr is None:
            return False
        else:
            # 새로운 노드 생성
            new = self.Node(data, curr.next)
            # target 가진 노드 다음 노드를 새로 생성한 노드로 할당
            curr.next = new

    def print_singley_linked_list(self):
        print('[', end = '')
        curr = self.start
        while curr is not None:
            print(str(curr.data), end = '')
            if curr.next is not None:
                print(' -> ', end = '')
            curr = curr.next
        print(']')
```

### 양방향

![Doubly Linked List](../../assets/images/ch8/Doubly-linked-list.png)

### 단방향 환형

![Circular Linked List](../../assets/images/ch8/Circularly-linked-list.png)

### 양방향 환형

## python에서의 사용례

## 참조

- [Linked List](https://computersciencewiki.org/index.php/Linked_list)
- [Circular Singly Linked List](https://www.geeksforgeeks.org/circular-singly-linked-list-insertion/)
- [Doubly Circular Linked List](https://www.geeksforgeeks.org/doubly-circular-linked-list-set-1-introduction-and-insertion/)
- [Doubly Linked List](https://rosettacode.org/wiki/Doubly-linked_list/Definition#Python)
