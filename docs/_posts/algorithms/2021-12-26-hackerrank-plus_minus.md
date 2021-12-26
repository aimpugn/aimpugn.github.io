---
title: Plus Minus
author: aimpugn
date: 2021-12-26 21:00:00+0900
use_math: true
categories: [hackerrank, algorithms]
---

- [Plus Minus](#plus-minus)
  - [문제](#문제)
  - [조건](#조건)
  - [예제](#예제)
  - [해결](#해결)
    - [1st](#1st)
    - [1st 코드](#1st-코드)
      - [나눗셈 함수](#나눗셈-함수)
      - [문제 풀이 코드](#문제-풀이-코드)
    - [1st 결과(성공)](#1st-결과성공)

# [Plus Minus](https://www.hackerrank.com/challenges/plus-minus/problem?isFullScreen=true)

## 문제

> 주어진 정수 배열에서, 양수/음수/0의 비율을 계산하시오  
> Note: 이 문제를 정밀도 문제를 야기한다. 테스트 케이스는 소수점 이하 여섯째자리까지 스케일(sacle)된다. 절대 오차(absolute error)는 $10^{-4}$까지 허용된다.

- [절대 오차](https://www.scienceall.com/%EC%A0%88%EB%8C%80-%EC%98%A4%EC%B0%A8absolute-error/):
  - 측정값과 참값이 절대적으로 얼마나 차이가 나는지 말하는 것으로, 오차의 크기 그 자체를 의미
  - $E = M - T$
    - `E`: 절대 오차
    - `M`: 측정값
    - `T`: 참값

## 조건

- $0 < n \le 100$
- $-100 \le arr[i] \le 100$

## 예제

```
STDIN           Function
-----           --------
6               arr[] size n = 6
-4 3 -9 0 4 1   arr = [-4, 3, -9, 0, 4, 1]

0.500000
0.333333
0.166667
```

## 해결

### 1st

- `plus`, `minus`, `zero`를 각각 센다
- 두 수로 나눠서 특정 자릿수까지 표현하는 함수 구현

### 1st 코드

#### 나눗셈 함수

```js
function div(numerator, denominator, options) {
  if (denominator == 0) return Infinity;
  let positive = denominator > 0;
  let sign = "";
  if (!positive) {
    denominator = ~denominator + 1;
    sign = "-";
  }
  let rounds = options?.rounds ?? true;
  let precision = options?.precision ?? 6;
  if (rounds) {
    precision++;
  }
  // 정수부
  let integerPart;
  [integerPart, numerator] = getQuotientAndRemainder(numerator, denominator);

  // 소수부
  let decimalParts = [];
  while (precision > 0) {
    let decimalPart = 0;
    if (numerator > 0) {
      [decimalPart, numerator] = getQuotientAndRemainder(
        (numerator *= 10),
        denominator
      );
    }
    decimalParts.push(decimalPart);
    precision--;
  }
  // 반올림
  if (rounds) {
    let lastOfDecimal = decimalParts.pop();
    if (lastOfDecimal >= 5) {
      let carry = 1;
      for (let i = decimalParts.length - 1; i >= 0; i--) {
        decimalParts[i] += carry;
        [carry, decimalParts[i]] = getQuotientAndRemainder(decimalParts[i], 10);
        if (carry == 0) {
          break;
        }
      }

      // 소수점 이하에서 올라가는 올림수가 있으면 정수부에 더한다
      if (carry > 0) {
        integerPart += carry;
      }
    }
  }

  return `${sign}${integerPart}.${decimalParts.join("")}`;
}

// quotient(몫)과 remainder(나머지) 반환
function getQuotientAndRemainder(numerator, denominator) {
  let quotient = 0;
  while (numerator >= denominator) {
    numerator -= denominator;
    quotient++;
  }
  return [quotient, numerator];
}

console.log(div(11, 4, { precision: 1, rounds: true })); // 0.28
console.log(div(0, 10)); // 0.000000
console.log(div(10, 0)); // Infinity
console.log(div(10, -1)); // -10.000000
console.log(div(10, -11)); // -0.909091, 반올림한 상태
console.log(div(999999999999, 10000000)); // 100000.000000
console.log(div(999999999999, 10000000, { rounds: false })); // 99999.999999
console.log(div(1000, 4)); // 250.000000
```

#### 문제 풀이 코드

```js
function plusMinus(arr) {
  let denominator = arr.length;
  let plus = 0;
  let minus = 0;
  let zero = 0;
  arr.forEach((el) => {
    if (el > 0) {
      plus++;
    } else if (el < 0) {
      minus++;
    } else if (el == 0) {
      zero++;
    }
  });
  console.log(div(plus, denominator));
  console.log(div(minus, denominator));
  console.log(div(zero, denominator));
}
```

### 1st 결과(성공)

Test case 0 ~ 11 성공
