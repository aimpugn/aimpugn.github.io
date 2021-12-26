---
title: A Very Big Sum
author: aimpugn
date: 2021-12-25 21:00:00+0900
use_math: true
categories: [hackerrank, algorithms]
---

- [A Very Big Sum](#a-very-big-sum)
  - [문제](#문제)
  - [조건](#조건)
  - [예제](#예제)
  - [해결](#해결)
    - [1st](#1st)
    - [1st 코드](#1st-코드)
      - [나눗셈 함수](#나눗셈-함수)
    - [1st 결과(성공)](#1st-결과성공)

# [A Very Big Sum](https://www.hackerrank.com/challenges/a-very-big-sum/problem?isFullScreen=true)

## 문제

> 요소들의 합을 계산. 정수들이 매우 클 수 있다는 점에 주의

## 조건

- $0 \le n \le 10$
- $0 \le arr[i] \le 10^{10}$

## 예제

```
5
1000000001 1000000002 1000000003 1000000004 1000000005

5000000015
```

- 주의: 32비트 정수의 범위는
  - $(-2^{31}) to (2^{31} - 1)$
  - $[-2147483648, 2147483647]$

## 해결

### 1st

- 문자열로 더하는 함수를 구현한다

### 1st 코드

#### 나눗셈 함수

```js
// https://www.hackerrank.com/challenges/a-very-big-sum/problem?isFullScreen=true
function sumBigNumbers(num1, num2) {
  let num1Arr = Array.from(String(num1), Number);
  let num2Arr = Array.from(String(num2), Number);
  let sum = "";
  let carry = 0;
  while (num1Arr.length > 0 || num2Arr.length > 0 || carry > 0) {
    const n1 = num1Arr.pop();
    const n2 = num2Arr.pop();
    let newVal = 0;
    let tmp = 0;
    if (n1 && n2) {
      tmp = n1 + carry + n2;
    } else if (n1) {
      tmp = n1 + carry;
    } else if (n2) {
      tmp = n2 + carry;
    } else {
      tmp = carry;
    }
    newVal = tmp % 10;
    carry = (tmp / 10) >>> 0;
    sum = `${newVal}${sum}`;
  }

  return sum;
}

function aVeryBigSum(ar) {
  // Write your code here
  let answer = "";
  for (let i = 0; i < ar.length; i++) {
    answer = sumBigNumbers(answer, ar[i]);
  }

  return answer;
}

console.log(
  aVeryBigSum([1000000001, 1000000002, 1000000003, 1000000004, 1000000005])
);

```

### 1st 결과(성공)

Test case 0, 1 성공
