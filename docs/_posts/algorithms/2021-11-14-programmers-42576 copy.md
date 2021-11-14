---
title: 전화번호 목록
author: aimpugn
date: 2021-11-14 22:00:00+0900
use_math: true
categories: [programmers, algorithms]
---

- [전화번호 목록](#전화번호-목록)
  - [문제](#문제)
  - [조건](#조건)
  - [예제](#예제)
  - [해결](#해결)
    - [1st(실패)](#1st실패)
      - [생각](#생각)
      - [1st 코드](#1st-코드)
    - [1st 결과](#1st-결과)
    - [2nd(성공)](#2nd성공)
      - [2nd 생각](#2nd-생각)
      - [2nd 코드](#2nd-코드)
      - [2nd 결과](#2nd-결과)

# [전화번호 목록](https://programmers.co.kr/learn/courses/30/lessons/42577)

## 문제

> 전화번호부에 적힌 전화번호 중, 한 번호가 다른 번호의 접두어인 경우가 있는지 확인하려 합니다.  
> 전화번호가 다음과 같을 경우, 구조대 전화번호는 영석이의 전화번호의 접두사입니다.  
>
> - 구조대 : 119  
> - 박준영 : 97 674 223  
> - 지영석 : 11 9552 4421
> 전화번호부에 적힌 전화번호를 담은 배열 phone_book 이 solution 함수의 매개변수로 주어질 때, 어떤 번호가 다른 번호의 접두어인 경우가 있으면 false를 그렇지 않으면 true를 return 하도록 solution 함수를 작성해주세요.

- `phone_book`: 전화번호 문자열을 담은 배열

## 조건

- phone_book의 길이는 1 이상 1,000,000 이하입니다.
  - $1 \ge phone_book.length \le 1,000,000$
- 각 전화번호의 길이는 1 이상 20 이하입니다.
  - $1 \ge phone_book[i] \le 20$
- 같은 전화번호가 중복해서 들어있지 않습니다.

## 예제

```java
["119", "97674223", "1195524421"] false
["123","456","789"] true
["12","123","1235","567","88"] false
```

## 해결

### 1st(실패)

#### 생각

- 문자열에서 우선 공백을 제거해서 공백은 고려치 않도록 한다
- ~~현재 숫자 기준으로 다음으로 나열된 숫자들의 접두어인지만 체크~~(잘못된 생각)
  - 앞 번호가 뒷 번호의 접두어일 수 있고, 뒷 번호가 앞 번호의 접두어일 수 있다
- ~~2중첩 반복문이어도 되지 않을까?~~ 이 생각도 문제였다. 2중첩 반복문에서 현재 숫자 이후의 숫자들만 체크한다고 해도,
  - 전화번호 3개인 경우 2 + 1회 = 3
  - 전화번호 4개인 경우 3 + 2 + 1회 = 6
  - 전화번호 5개인 경우 4 + 3 + 2 + 1회 = 10
  - 전화번호 n개인 경우 (n - 1) + ... + 3 + 2 + 1회
  - 최악의 경우 499,999,500,000 된다

#### 1st 코드

```java
public boolean solution_1st_fail(String[] phone_book) {
    boolean answer = true;
    int phone_book_size = phone_book.length;

    for (int idx = 0; idx < phone_book_size; idx++) {
        phone_book[idx] = phone_book[idx].trim();
    }

    for (int from = 0; from < phone_book_size; from++) {
        for (int next = from + 1; next < phone_book_size; next++) {
            if (phone_book[next].trim().startsWith(phone_book[from].trim())) {
                return false;
            }
        }
    }

    return answer;
}
```

### 1st 결과

```
테스트 1 〉 통과 (0.06ms, 75.5MB)
테스트 2 〉 통과 (0.03ms, 84.3MB)
테스트 3 〉 통과 (0.02ms, 73MB)
테스트 4 〉 통과 (0.02ms, 76.5MB)
테스트 5 〉 통과 (0.05ms, 74.2MB)
테스트 6 〉 통과 (0.04ms, 69.1MB)
테스트 7 〉 통과 (0.06ms, 74.8MB)
테스트 8 〉 실패 (0.07ms, 76.7MB)
테스트 9 〉 실패 (0.09ms, 77.3MB)
테스트 10 〉 통과 (0.03ms, 81.8MB)
테스트 11 〉 통과 (0.07ms, 78.4MB)
테스트 12 〉 통과 (0.02ms, 71.7MB)
테스트 13 〉 통과 (0.03ms, 76.3MB)
테스트 14 〉 통과 (9.21ms, 79.4MB)
테스트 15 〉 통과 (10.53ms, 72.1MB)
테스트 16 〉 통과 (11.51ms, 81.3MB)
테스트 17 〉 통과 (15.76ms, 90.1MB)
테스트 18 〉 통과 (24.62ms, 79MB)
테스트 19 〉 실패 (29.00ms, 85.1MB)
테스트 20 〉 통과 (36.87ms, 82.8MB)
효율성  테스트
테스트 1 〉 통과 (4.68ms, 57.4MB)
테스트 2 〉 통과 (3.66ms, 55.9MB)
테스트 3 〉 실패 (시간 초과)
테스트 4 〉 실패 (시간 초과)
```

### 2nd(성공)

#### 2nd 생각

- 접두어가 있는지만 체크하면 되는 거라면, 전화번호에서 가능한 접두어만 모아서 정리 후 체크하자
- `substring`을 오랜만에 써서 좀 틀렸지만...
  - `12345.substring(0, 1)`: `1`
  - `12345.substring(0, 2)`: `12`
  - `12345.substring(1, 2)`: `2`
  - `string.substring(begin, end)`: `string[begin:end - 1]`

#### 2nd 코드

```java
public boolean solution(String[] phone_book) {
    boolean answer = true;
    // 전화번호부의 숫자로 가능한 접두어 체크 해시 맵을 만든다
    HashMap<String, Boolean> prefixChecker = new HashMap<>();
    for (String phoneNumber : phone_book) {
        phoneNumber = phoneNumber.trim();
        for (int end = 1; end < phoneNumber.length(); end++) { // 접두어가 되려면 적어도 끝에 문자 하나는 있어야 하므로, 전화번호 그대로는 체커에 넣지 않는다
            String prefixToCheck = phoneNumber.substring(0, end);
            if (! prefixChecker.containsKey(prefixToCheck)) {
                prefixChecker.put(prefixToCheck, true);
            }
        }
    }

    for (String phoneNumber : phone_book) {
        if (prefixChecker.containsKey(phoneNumber)) {
            return false;
        }
    }

    return answer;
}
```

#### 2nd 결과

```shell
정확성  테스트
테스트 1 〉 통과 (0.05ms, 70.9MB)
테스트 2 〉 통과 (0.06ms, 74.1MB)
테스트 3 〉 통과 (0.05ms, 75.8MB)
테스트 4 〉 통과 (0.04ms, 75MB)
테스트 5 〉 통과 (0.05ms, 80.4MB)
테스트 6 〉 통과 (0.04ms, 78.6MB)
테스트 7 〉 통과 (0.05ms, 73.4MB)
테스트 8 〉 통과 (0.06ms, 73.1MB)
테스트 9 〉 통과 (0.04ms, 74.7MB)
테스트 10 〉 통과 (0.05ms, 76.3MB)
테스트 11 〉 통과 (0.04ms, 74.7MB)
테스트 12 〉 통과 (0.03ms, 74.9MB)
테스트 13 〉 통과 (0.02ms, 73.6MB)
테스트 14 〉 통과 (3.25ms, 79MB)
테스트 15 〉 통과 (3.11ms, 79.2MB)
테스트 16 〉 통과 (7.99ms, 76.7MB)
테스트 17 〉 통과 (8.93ms, 88.5MB)
테스트 18 〉 통과 (11.45ms, 89.8MB)
테스트 19 〉 통과 (12.09ms, 83.5MB)
테스트 20 〉 통과 (13.04ms, 104MB)
효율성  테스트
테스트 1 〉 통과 (41.72ms, 67.1MB)
테스트 2 〉 통과 (38.71ms, 64.8MB)
테스트 3 〉 통과 (264.90ms, 227MB)
테스트 4 〉 통과 (2313.25ms, 414MB)
채점 결과
정확성: 83.3
효율성: 16.7
합계: 100.0 / 100.0
```
