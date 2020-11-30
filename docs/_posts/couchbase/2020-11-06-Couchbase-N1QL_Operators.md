---
title: Couchbase N1QL Operators
author: aimpugn
date: 2020-10-26 13:10:00 +0900
categories: [Couchbase.n1ql.operators]
tags: [nosql, couchbase]
math: true
use_math: true
---

# [연산자(Operators)](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/operators.html)

## 개요

### 연산자 종류

1. 산술 연산자
2. 컬렉션 연산자
3. 비교 연산자
4. 조건 연산자
5. 생성 연산자
6. 논리 연산자
7. 중첩 연산자와 표현식
8. 문자열 연산자

### [연산 우선 순위](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/operators.html#operator-precedence)

1. `CASE`
2. `.`
3. `[]`
4. `-`(unary, 단항)
5. `*`, `/`, `%`
6. `+`, `-`
7. `IS`
8. `IN`
9. `BETWEEN`
10. `LIKE`
11. `<`, `<=`, `>`, `=>`
12. `=`, `==`, `<>`, `!=`
13. `NOT`
14. `AND`
15. `OR`

## [산술 연산자](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/arithmetic.html)

## [컬렉션 연산자](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/collectionops.html)

### `ANY`

### `ARRAY`

- 컬렉션, 오브젝트 또는 여러 오브젝트의 속성 또는 요소들을 map과 필터할 때 사용
- `WHEN` 절이 제공될 경우 `WHEN` 절을 만족하는, 연산되는 표현식(operand expression)의 배열
- `ARRAY` <var> `FOR` <var> `IN` <array> `WHEN` <condtions>
  - <array>의 각 요소인 <var>에서
  - <condtions>을 만족하는
  - <var> 배열을 반환

#### 문법

```
ARRAY var1 FOR var1 ( IN | WITHIN ) expr1
   [ ,  var2 ( IN | WITHIN ) expr2 ]*
   [ ( WHEN cond1 [ AND cond2 ] ) ] END
```

```sql
SELECT
    ARRAY
        FOR
            var1 IN sb.arr1,
            var2 WITHIN sb.arr2,
            var3 IN sb.arr3
        WHEN
            var1.some.field = '<condition>' AND
            var2.some.arr[0] > '<condition>' AND
            var3.what < '<condition>'
    END
FROM some_bucket sb
```

##### 인자

- var1, var2, ..., varx &#8594; `ARRAY` 반복문에서 변수명을 나타내는 문자열 또는 [표현식](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/index.html#N1QL_Expressions)
- expr1, expr2, ..., exprX &#8594; 반복할 배열을 나타내는 문자열 또는 [표현식](https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/index.html#N1QL_Expressions)
- cond1, cond2, ..., condX &#8594; 테스트할 제한 또는 매칭 절을 나타내는 표현식

##### 반환

- `ARRAY` 표현식을 만족함 &#8594; 배열 또는 여러 배열
- `ARRAY` 표현식을 만족하지 않음 &#8594; 배열

#### 에제1

##### Query

```sql
SELECT
    ARRAY v FOR v IN usr.shipped_order_history WHEN v.order_datetime > 'Thu Aug  4 22:00:09 2011' END AS arrfor
FROM users_with_orders usr
USE KEYS "Elinor_33313792"
```

##### Result

```json
{
  "results": [
    {
      "arrfor": [
        {
          "order_datetime": "Wed May 30 22:00:09 2012",
          "order_id": "T103929516925"
        }
      ]
    }
  ]
}
```

#### 예제2

##### Query

```sql
SELECT ARRAY v FOR v IN schedule WHEN v.utc > "19:00" AND v.day = 5 END AS fri_evening_flights
FROM `travel-sample`
WHERE
    type="route" AND
    airline="KL" AND
    sourceairport="ABQ" AND
    destinationairport="ATL" AND
    ANY v IN schedule SATISFIES v.utc > "19:00" END;
```

###### `FROM`

- `type="route`: 컬렉션의 타입이 route
- `airline="KL"`: KL 항공사
- `sourceairport="ABQ"`: 출발지가 Albuquerque
- `destinationairport="ATL"`: 목적지가 Atlanta
- `ANY v IN schedule SATISFIES v.utc > "19:00" END`: 저녁 7시 이후인 모든 스케쥴

###### `SELECT`

- `ARRAY v FOR v IN schedule WHEN v.utc > "19:00" AND v.day = 5 END`
  - 5일
  - 저녁 7시 이후인
  - 스케쥴 배열

##### Result

```json
[
  {
    "fri_evening_flights": [
      {
        "day": 5,
        "flight": "KL169",
        "utc": "23:41:00"
      }
    ]
  }
]
```

#### 예제3

##### Query

```sql
SELECT *
FROM users_with_orders usr
USE KEYS "Elinor_33313792"
WHERE ANY v IN usr.shipped_order_history SATISFIES v.order_datetime > 'Thu Aug  4 22:00:09 2011' END
```

###### `FROM`

- users_with_orders 버킷

###### `USE KEYS`

- 키는 Elinor_33313792

###### `WHERE`

- usr.shipped_order_history 배열에서 order_datetime 날짜가 Thu Aug 4 22:00:09 2011 이후를 만족

###### `SELECT`

- 위 조건을 만족하는 완전한 usr 문서

##### Result

```json
{
  "results": [
    {
      "usr": {
        "doc_type": "user_profile",
        "personal_details": {
          "age": 60,
          "display_name": "Elinor Ritchie",
          "email": "Elinor.Ritchie@snailmail.com",
          "first_name": "Elinor",
          "last_name": "Ritchie",
          "state": "Arizona"
        },
        "profile_details": {
          "last_login_time": "Wed Jan 16 22:00:09 2013",
          "loyalty": {
            "friends_referred": [],
            "loyalty_score": 7.44363933614319,
            "membership_type": "Gold",
            "redeemed_points": 903,
            "reward_points": 2016
          },
          "password": "Elinor73",
          "prefs": {
            "promotion_email": false,
            "ui_language": "English",
            "ui_theme": "Beach"
          },
          "user_creation_time": "Tue May 31 22:00:09 2011",
          "user_id": "Elinor_33313792"
        },
        "search_history": [
          {
            "category": "Films",
            "sub-category": [
              "Foreign Films",
              "Drama",
              "Sci-Fi, Fantasy & Horror"
            ]
          },
          {
            "category": "Books",
            "sub-category": ["Humor"]
          }
        ],
        "shipped_order_history": [
          {
            "order_datetime": "Wed May 30 22:00:09 2012",
            "order_id": "T103929516925"
          },
          {
            "order_datetime": "Thu Aug  4 22:00:09 2011",
            "order_id": "T573145204032"
          }
        ]
      }
    }
  ]
}
```

#### 예제4

##### Query

- usr.shipped_order_history 배열에서 order_datetime 날짜가 Thu Aug 4 22:00:09 2011 이후를 만족하는 유저 프로필이 있는 경우
- 그 유저 프로필의 shipped_order_history

```sql
SELECT
    ARRAY v FOR v IN usr.shipped_order_history END AS arrfor
FROM users_with_orders usr
USE KEYS "Elinor_33313792"
WHERE
    ANY v IN usr.shipped_order_history SATISFIES v.order_datetime > 'Thu Aug  4 22:00:09 2011' END
```

###### `FROM`

- users_with_orders 버킷

###### `USE KEYS`

- 키는 Elinor_33313792

###### `WHERE`

- usr.shipped_order_history 배열에서 order_datetime 날짜가 Thu Aug 4 22:00:09 2011 이후를 만족

###### `SELECT`

- `ARRAY v FOR v IN usr.shipped_order_history END`
  - 위 조건을 만족하는 usr 문서에서
  - shipped_order_history 배열

##### Result

```JSON
{
  "results": [
    {
      "arrfor": [
        {
          "order_datetime": "Wed May 30 22:00:09 2012",
          "order_id": "T103929516925"
        },
        {
          "order_datetime": "Thu Aug  4 22:00:09 2011",
          "order_id": "T573145204032"
        }
      ]
    }
  ]
}
```

#### 예제5

##### Query

```sql
SELECT
    ARRAY v FOR v IN usr.shipped_order_history WHEN v.order_datetime > 'Thu Aug  4 22:00:09 2011' END AS arrfor
FROM users_with_orders usr
USE KEYS "Elinor_33313792"
WHERE ANY v IN usr.shipped_order_history SATISFIES v.order_datetime > 'Thu Aug  4 22:00:09 2011' END
```

###### `FROM`

- users_with_orders 버킷

###### `USE KEYS`

- 키는 Elinor_33313792

###### `WHERE`

- usr.shipped_order_history 배열에서 order_datetime 날짜가 Thu Aug 4 22:00:09 2011 이후를 만족

###### `SELECT`

- `ARRAY v FOR v IN usr.shipped_order_history WHEN v.order_datetime > 'Thu Aug 4 22:00:09 2011' END`
  - 위 조건을 만족하는 usr 문서에서
  - shipped_order_history 배열에서
  - order_datetime 날짜가 Thu Aug 4 22:00:09 2011 이후인 배열

##### Result

```json
{
  "results": [
    {
      "arrfor": [
        {
          "order_datetime": "Wed May 30 22:00:09 2012",
          "order_id": "T103929516925"
        }
      ]
    }
  ]
}
```

### `EVERY`

### `EXISTS`

### `FIRST`

### `IN`

### `WITHIN`
