---
title: 2 Representing and Manipulating Information
author: aimpugn
date: 2021-02-09 19:20:00+0900
use_math: true
categories: ["cs", "csapp"]
---

# 2 정보의 표현과 조작(Representing and Manipulating Information)

## 개요

- 컴퓨터는 두 개의 값으로 된 신호(two-valued signal = binary digit = *bits*)로 표현되는 정보를 저장하고 처리
- 두 개의 값으로 된 신호를 저장하고 연산하는 것은 매우 간단 &#8594; 수백만, 수십억의 회로를 단일 실리콘 칩에 집적 가능
- bits를 묶고 서로 다른 가능한 비트 패턴에 의미를 부여하는 *해석(interpretation)*을 적용 &#8594; 유한한 집합의 요소 표현 가능
  - 비트 묶음(groups of bits)을 사용하여 양의 숫자를 인코딩 가능
  - 표준 문자 코드 사용하여 문서의 문자와 기호들을 인코딩 가능
- 세 가지 가장 중요한 숫자 표현
  - *부호 없는(Unsigned) 수*: 전통적인 이진 표기법에 기으로 0보다 크거나 같은 숫자를 표현
  - *2의 보수(Two's-complement)*: 부호 있는(signed) 음과 양의 정수를 표현하는 가장 흔한 인코딩 방법
  - *Floating-point*: 밑수(`base`)를 2(base-2, 이진수)로 실수(real numbers)를 나타내는 과학적 표기법
- *overflow*: 컴퓨터는 제한된 수의 비트로 숫자를 표현하므로, 결과가 나타내기에 너무 크면 발생
  - 32비트 컴퓨터에서, $200 \times 300 \times 400 \times 500$는 $-884,901,888$이 된다
  - 이는 정수 산술 연산의 속성에 반한다(run counter to)
- 실제 숫자를 표현하는 것에 대해 배움으로써
  - 나타낼 수 있는 값의 범위를 이해하고
  - 서로 다른 산술 연산의 속성을 이해
- 비트 레벨로 표현된 숫자를 직접 조작 &#8594; 산술 식 평가(arithmetic expression evaluation)의 성능을 최적화하려는 컴파일러에 의해 생성된 **기계 레벨의 코드 이해**에 중요

## 2.1 정보 저장소

## 2.2 정수 표현

## 2.3 정소 산술 연산(Integer Arithmetic)

## 2.4 부동소수점(Floating Point)
