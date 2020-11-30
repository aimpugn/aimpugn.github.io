---
title: Couchbase N1QL tutorial
author: aimpugn
date: 2020-11-05 16:10:00 +0900
categories: [Couchbase.n1ql]
tags: [nosql, couchbase]
math: true
use_math: true
---

# N1QL Basic

- N1QL data model 이름은 비1차 정규형(`Non-first normal form(NF2 or N1NF)`)에서 파생

## Start

### Query

```sql
SELECT 'Hello World' AS Greeting
```

### Result

```json
{
  "results": [
    {
      "Greeting": "Hello World"
    }
  ]
}
```

## User-friendly language

- 반면 필드 키를 지정하면 각 필드가

```json
{
  "results": [
    {
      "age": 56,
      "children": [
        {
          "fname": "Abama",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bebama",
          "age": 21,
          "gender": "m"
        }
      ],
      "email": "ian@gmail.com",
      "fname": "Ian",
      "hobbies": ["golf", "surfing"],
      "lname": "Taylor",
      "relation": "cousin",
      "title": "Mr.",
      "type": "contact"
    }
  ]
}
```

### Query

- Couchbase N1QL에는 스키마가 없으며, 구조가 상이하더라도 N1QL은 쿼리에 매치되는 모든 결과를 반환할 만큼 유연하다

#### Query with asterisk

```sql
SELECT *            -- 반환할 문서일 일부
FROM tutorial       -- data bucket
WHERE fname = 'Ian' -- 조건
```

#### Result with asterisk

- `*(asterisk)` 사용하면 데이터를 버킷의 이름(tutorial)이 실제 데이터를 한번 감싼다

```json
{
  "results": [
    {
      "tutorial": {
        "type": "contact",
        "title": "Mr.",
        "fname": "Ian",
        "lname": "Taylor",
        "age": 56,
        "email": "ian@gmail.com",
        "children": [
          {
            "fname": "Abama",
            "age": 17,
            "gender": "m"
          },
          {
            "fname": "Bebama",
            "age": 21,
            "gender": "m"
          }
        ],
        "hobbies": ["golf", "surfing"],
        "relation": "cousin"
      }
    }
  ]
}
```

#### Query with specific fields

- 필드를 지정하여 사용하면 버킷 이름으로 감싸지 않고 반환된다

```sql
SELECT
    type,
    title,
    fname,
    lname,
    age,
    email,
    children,
    hobbies,
    relation
FROM tutorial
WHERE fname = 'Ian'

```

#### Result with specific fields

```json
{
  "results": [
    {
      "type": "contact",
      "title": "Mr.",
      "fname": "Ian",
      "lname": "Taylor",
      "age": 56,
      "email": "ian@gmail.com",
      "children": [
        {
          "fname": "Abama",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bebama",
          "age": 21,
          "gender": "m"
        }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "cousin"
    }
  ]
}
```

## Documents, not rows

- Couchbase는 데이터를 row/column이 아닌 documents 형태로 저장
- 문서는 문서 안에 요소나 배열을 가질 수 있기 때문에, 몇 가지 추가적인 연산이 필요하다
  - `.` 연산자는 자식 요소를 참조에 사용
  - `[]` 연산자는 배열의 요소를 참조에 사용

### Query

```sql
SELECT children[0].fname AS child_name
FROM tutorial
WHERE fname = 'Dave'
```

### Result

```json
{
  "results": [
    {
      "child_name": "Aiden"
    }
  ]
}
```

## Pattern matching with LIKE

- `LIKE` 키워드 사용하여 패턴 매칭 가능
- `%` 와일드 카드 &#8594; 0개 이상의 문자가 매치
- `_` 와일드 카드 &#8594; 정확히 한 문자 매치

### Query

```sql
SELECT
    fname,
    email
FROM tutorial
WHERE email LIKE '%@yahoo.com'

```

### Result

```json
{
  "results": [
    {
      "email": "harry@yahoo.com",
      "fname": "Harry"
    }
  ]
}
```

## Matching elements in nested arrays with ANY

- 문서 안의 배열에 기반하여 필터하고 싶을 때 사용

### Structure

- `ANY|EVERY` <CUSTOM_NAME_OF_ELEMENT_OF_NESTED_ARRAY>
- `IN` <PATH>.<TO>.<NESTED_ARRAY>
- `SATISFIES` <CUSTOM_NAME_OF_ELEMENT_OF_NESTED_ARRAY>.<PATH>.<TO>.<FIELD>
- `> | = | < ...` <CRITERIA>
- `END`

### Query

```sql
SELECT *
FROM tutorial
WHERE
    ANY child IN tutorial.children
    SATISFIES child.age > 10  END

```

### Result

```json
{
  "results": [
    {
      "tutorial": {
        "type": "contact",
        "title": "Mr.",
        "fname": "Dave",
        "lname": "Smith",
        "age": 46,
        "email": "dave@gmail.com",
        "children": [
          {
            "fname": "Aiden",
            "age": 17,
            "gender": "m"
          },
          {
            "fname": "Bill",
            "age": 2,
            "gender": "f"
          }
        ],
        "hobbies": ["golf", "surfing"],
        "relation": "friend"
      }
    },
    {
      "tutorial": {
        "type": "contact",
        "title": "Mr.",
        "fname": "Earl",
        "lname": "Johnson",
        "age": 46,
        "email": "earl@gmail.com",
        "children": [
          {
            "fname": "Xena",
            "age": 17,
            "gender": "f"
          },
          {
            "fname": "Yuri",
            "age": 2,
            "gender": "m"
          }
        ],
        "hobbies": ["surfing"],
        "relation": "friend"
      }
    },
    {
      "tutorial": {
        "type": "contact",
        "title": "Mr.",
        "fname": "Ian",
        "lname": "Taylor",
        "age": 56,
        "email": "ian@gmail.com",
        "children": [
          {
            "fname": "Abama",
            "age": 17,
            "gender": "m"
          },
          {
            "fname": "Bebama",
            "age": 21,
            "gender": "m"
          }
        ],
        "hobbies": ["golf", "surfing"],
        "relation": "cousin"
      }
    }
  ]
}
```

## Combining multiple conditions with AND

### Query

```sql
SELECT
    fname,
    email,
    children
FROM tutorial
WHERE
    ARRAY_LENGTH(children) > 0 AND
    email LIKE '%@gmail.com'
```

### Result

```json
{
  "results": [
    {
      "children": [
        {
          "fname": "Aiden",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bill",
          "age": 2,
          "gender": "f"
        }
      ],
      "email": "dave@gmail.com",
      "fname": "Dave"
    },
    {
      "children": [
        {
          "fname": "Xena",
          "age": 17,
          "gender": "f"
        },
        {
          "fname": "Yuri",
          "age": 2,
          "gender": "m"
        }
      ],
      "email": "earl@gmail.com",
      "fname": "Earl"
    },
    {
      "children": [
        {
          "fname": "Abama",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bebama",
          "age": 21,
          "gender": "m"
        }
      ],
      "email": "ian@gmail.com",
      "fname": "Ian"
    }
  ]
}
```

## Querying primary keys

- `USE KEYS` 구문 사용하여 버킷의 특정한 `primary key`를 조회할 수 있다
- `["dave", "ian"]`, `["dave"]`, `"dave"` 모두 가능

### Query

```sql
SELECT
    fname,
    lname,
    children,
    email
FROM tutorial
USE KEYS ["dave", "ian"]

```

### Result

```json
{
  "results": [
    {
      "email": "dave@gmail.com",
      "fname": "Dave",
      "lname": "Smith"
    },
    {
      "email": "ian@gmail.com",
      "fname": "Ian",
      "lname": "Taylor"
    }
  ]
}
```

## Quick review

- 문서 내의 배열은 `slice`가 가능

### Query

```sql
SELECT
    fname || " " || lname AS full_name,
    email,
    children[0:2] AS offspring  -- array slicing
FROM tutorial
WHERE email LIKE '%@yahoo.com'
OR ANY child IN tutorial.children SATISFIES child.age > 10 END

```

### Result

```json
{
  "results": [
    {
      "email": "dave@gmail.com",
      "full_name": "Dave Smith",
      "offspring": [
        {
          "age": 17,
          "fname": "Aiden",
          "gender": "m"
        },
        {
          "age": 2,
          "fname": "Bill",
          "gender": "f"
        }
      ]
    },
    {
      "email": "earl@gmail.com",
      "full_name": "Earl Johnson",
      "offspring": [
        {
          "age": 17,
          "fname": "Xena",
          "gender": "f"
        },
        {
          "age": 2,
          "fname": "Yuri",
          "gender": "m"
        }
      ]
    },
    {
      "email": "harry@yahoo.com",
      "full_name": "Harry Jackson"
    },
    {
      "email": "ian@gmail.com",
      "full_name": "Ian Taylor",
      "offspring": [
        {
          "age": 17,
          "fname": "Abama",
          "gender": "m"
        },
        {
          "age": 21,
          "fname": "Bebama",
          "gender": "m"
        }
      ]
    }
  ]
}
```

## Pagination with LIMIT and OFFSET

- 좀 더 작은 단위로 처리하고 싶을 떄 사용
- `LIMIT` &#8594; 결과 수 제한
- `OFFSET` &#8594; 시작 점 지정

### Result without `LIMIT` AND `OFFSET`

```json
{
  "results": [
    {
      "age": 18,
      "fname": "Fred"
    },
    {
      "age": 20,
      "fname": "Harry"
    },
    {
      "age": 40,
      "fname": "Jane"
    },
    {
      "age": 46,
      "fname": "Dave"
    },
    {
      "age": 46,
      "fname": "Earl"
    },
    {
      "age": 56,
      "fname": "Ian"
    }
  ]
}
```

### Query with `LIMIT`

```sql
SELECT
    fname,
    age
FROM tutorial
ORDER BY age
LIMIT 2
```

### Result with `LIMIT`

```json
{
  "results": [
    {
      "age": 18,
      "fname": "Fred"
    },
    {
      "age": 20,
      "fname": "Harry"
    }
  ]
}
```

### Query with `LIMIT` AND `OFFSET`

```sql
SELECT
    fname,
    age
FROM tutorial
ORDER BY age
LIMIT 2
OFFSET 4
```

### Result with `LIMIT` AND `OFFSET`

```json
{
  "results": [
    {
      "age": 46,
      "fname": "Earl"
    },
    {
      "age": 56,
      "fname": "Ian"
    }
  ]
}
```

## Filtering grouped data with HAVING

- 반환되는 그룹을 필터하고 싶을 때 사용
- `GROUP BY` &#8594;

### Query with `GROUP BY`

```SQL
SELECT
    relation,
    COUNT(*) AS count
FROM tutorial
GROUP BY relation
```

### Result with `GROUP BY`

```JSON
{
  "results": [
    {
      "count": 2,
      "relation": "cousin"
    },
    {
      "count": 2,
      "relation": "friend"
    },
    {
      "count": 1,
      "relation": "coworker"
    },
    {
      "count": 1,
      "relation": "parent"
    }
  ]
}
```

## Review

- `SELECT`
- `FROM` &#8594; tutorial bucket의 전체 6개 문서에서 시작
- `UNNEST` &#8594; N1QL 사양에 따라, 내부 배열을 그 부모와 조인하여 내부의 컨텐츠로 접근.

### Query with `UNNEST`

```SQL
SELECT
    t.relation,
    t.fname,
    t.lname,
    t.email,
    t.children
FROM tutorial t
UNNEST t.children c
```

### Result with `UNNEST`

- 아래 결과를 보면 **같은 데이터가 두 개씩 반환**되는데, `UNNEST` 구문을 사용하여 children 필드의 배열이 밖으로 나오게 됐기 때문

```json
{
  "results": [
    {
      "children": [
        {
          "fname": "Aiden",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bill",
          "age": 2,
          "gender": "f"
        }
      ],
      "email": "dave@gmail.com",
      "fname": "Dave",
      "lname": "Smith",
      "relation": "friend"
    },
    {
      "children": [
        {
          "fname": "Aiden",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bill",
          "age": 2,
          "gender": "f"
        }
      ],
      "email": "dave@gmail.com",
      "fname": "Dave",
      "lname": "Smith",
      "relation": "friend"
    },
    {
      "children": [
        {
          "fname": "Xena",
          "age": 17,
          "gender": "f"
        },
        {
          "fname": "Yuri",
          "age": 2,
          "gender": "m"
        }
      ],
      "email": "earl@gmail.com",
      "fname": "Earl",
      "lname": "Johnson",
      "relation": "friend"
    },
    {
      "children": [
        {
          "fname": "Xena",
          "age": 17,
          "gender": "f"
        },
        {
          "fname": "Yuri",
          "age": 2,
          "gender": "m"
        }
      ],
      "email": "earl@gmail.com",
      "fname": "Earl",
      "lname": "Johnson",
      "relation": "friend"
    },
    {
      "children": [
        {
          "fname": "Abama",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bebama",
          "age": 21,
          "gender": "m"
        }
      ],
      "email": "ian@gmail.com",
      "fname": "Ian",
      "lname": "Taylor",
      "relation": "cousin"
    },
    {
      "children": [
        {
          "fname": "Abama",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bebama",
          "age": 21,
          "gender": "m"
        }
      ],
      "email": "ian@gmail.com",
      "fname": "Ian",
      "lname": "Taylor",
      "relation": "cousin"
    }
  ]
}
```

### Query with `UNNEST` ANd `WHERE`

```sql

SELECT
    t.relation,
    t.fname,
    t.lname,
    t.email,
    t.children
FROM tutorial t
UNNEST t.children c
WHERE c.age > 10

```

### Result with `UNNEST` ANd `WHERE`

- Ian Taylor의 데이터만 중복되는데, `UNNEST`된 children 데이터에서 10살이 넘는 아이가 두 명이 있기 때문

```JSON
{
  "results": [
    {
      "children": [
        {
          "fname": "Aiden",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bill",
          "age": 2,
          "gender": "f"
        }
      ],
      "email": "dave@gmail.com",
      "fname": "Dave",
      "lname": "Smith",
      "relation": "friend"
    },
    {
      "children": [
        {
          "fname": "Xena",
          "age": 17,
          "gender": "f"
        },
        {
          "fname": "Yuri",
          "age": 2,
          "gender": "m"
        }
      ],
      "email": "earl@gmail.com",
      "fname": "Earl",
      "lname": "Johnson",
      "relation": "friend"
    },
    {
      "children": [
        {
          "fname": "Abama",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bebama",
          "age": 21,
          "gender": "m"
        }
      ],
      "email": "ian@gmail.com",
      "fname": "Ian",
      "lname": "Taylor",
      "relation": "cousin"
    },
    {
      "children": [
        {
          "fname": "Abama",
          "age": 17,
          "gender": "m"
        },
        {
          "fname": "Bebama",
          "age": 21,
          "gender": "m"
        }
      ],
      "email": "ian@gmail.com",
      "fname": "Ian",
      "lname": "Taylor",
      "relation": "cousin"
    }
  ]
}
```

```SQL

SELECT
    t.relation,
    t.fname,
    t.lname,
    t.email,
    t.children,
    COUNT(*) AS count,
    AVG(c.age) AS avg_age
FROM tutorial t
UNNEST t.children c
WHERE c.age > 10
GROUP BY t.relation HAVING COUNT(*) > 1
ORDER BY avg_age DESC
```

### Query

```sql
SELECT
    t.relation,
    COUNT(*) AS count,
    AVG(c.age) AS avg_age
FROM tutorial t
UNNEST t.children c -- children 배열의 모든 항목들에 접근하기 위해 사용
WHERE c.age > 10
GROUP BY t.relation HAVING COUNT(*) > 1
ORDER BY avg_age DESC
LIMIT 1 OFFSET 1
```

### Expected flow

#### 1. 전체 6개 문서

```json
[
  {
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Dave",
      "lname": "Smith",
      "age": 46,
      "email": "dave@gmail.com",
      "children": [
        { "fname": "Aiden", "age": 17, "gender": "m" },
        { "fname": "Bill", "age": 2, "gender": "f" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "friend"
    }
  },
  {
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Earl",
      "lname": "Johnson",
      "age": 46,
      "email": "earl@gmail.com",
      "children": [
        { "fname": "Xena", "age": 17, "gender": "f" },
        { "fname": "Yuri", "age": 2, "gender": "m" }
      ],
      "hobbies": ["surfing"],
      "relation": "friend"
    }
  },
  {
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Fred",
      "lname": "Jackson",
      "age": 18,
      "email": "fred@gmail.com",
      "hobbies": ["golf", "surfing"],
      "children": null,
      "relation": "coworker"
    }
  },
  {
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Harry",
      "lname": "Jackson",
      "age": 20,
      "email": "harry@yahoo.com",
      "relation": "parent"
    }
  },
  {
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Ian",
      "lname": "Taylor",
      "age": 56,
      "email": "ian@gmail.com",
      "children": [
        { "fname": "Abama", "age": 17, "gender": "m" },
        { "fname": "Bebama", "age": 21, "gender": "m" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "cousin"
    }
  },
  {
    "t": {
      "type": "contact",
      "title": "Mrs.",
      "fname": "Jane",
      "lname": "Edwards",
      "age": 40,
      "email": "jane@gmail.com",
      "contacts": [{ "fname": "Fred" }, { "fname": "Sheela" }],
      "relation": "cousin"
    }
  }
]
```

#### 2.`UNNEST`로 children 배열과 그 부모를 조인

- 이 경우 children이 `null`인 Fred Jackson과 children 자체가 없는 Harry Jackson은 제외된다

```json
[
  {
    "c": { "age": 17, "fname": "Aiden", "gender": "m" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Dave",
      "lname": "Smith",
      "age": 46,
      "email": "dave@gmail.com",
      "children": [
        { "fname": "Aiden", "age": 17, "gender": "m" },
        { "fname": "Bill", "age": 2, "gender": "f" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "friend"
    }
  },
  {
    "c": { "age": 2, "fname": "Bill", "gender": "f" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Dave",
      "lname": "Smith",
      "age": 46,
      "email": "dave@gmail.com",
      "children": [
        { "fname": "Aiden", "age": 17, "gender": "m" },
        { "fname": "Bill", "age": 2, "gender": "f" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "friend"
    }
  },
  {
    "c": { "age": 17, "fname": "Xena", "gender": "f" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Earl",
      "lname": "Johnson",
      "age": 46,
      "email": "earl@gmail.com",
      "children": [
        { "fname": "Xena", "age": 17, "gender": "f" },
        { "fname": "Yuri", "age": 2, "gender": "m" }
      ],
      "hobbies": ["surfing"],
      "relation": "friend"
    }
  },
  {
    "c": { "age": 2, "fname": "Yuri", "gender": "m" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Earl",
      "lname": "Johnson",
      "age": 46,
      "email": "earl@gmail.com",
      "children": [
        { "fname": "Xena", "age": 17, "gender": "f" },
        { "fname": "Yuri", "age": 2, "gender": "m" }
      ],
      "hobbies": ["surfing"],
      "relation": "friend"
    }
  },
  {
    "c": { "age": 17, "fname": "Abama", "gender": "m" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Ian",
      "lname": "Taylor",
      "age": 56,
      "email": "ian@gmail.com",
      "children": [
        { "fname": "Abama", "age": 17, "gender": "m" },
        { "fname": "Bebama", "age": 21, "gender": "m" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "cousin"
    }
  },
  {
    "c": { "age": 21, "fname": "Bebama", "gender": "m" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Ian",
      "lname": "Taylor",
      "age": 56,
      "email": "ian@gmail.com",
      "children": [
        { "fname": "Abama", "age": 17, "gender": "m" },
        { "fname": "Bebama", "age": 21, "gender": "m" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "cousin"
    }
  }
]
```

#### 3. `c(자식)`의 age가 10을 넘는 경우

- Ian Taylor는 자식 둘 모두 10살을 넘어서 두 개의 문서가 반환된다

```json
[
  {
    "c": { "age": 17, "fname": "Aiden", "gender": "m" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Dave",
      "lname": "Smith",
      "age": 46,
      "email": "dave@gmail.com",
      "children": [
        { "fname": "Aiden", "age": 17, "gender": "m" },
        { "fname": "Bill", "age": 2, "gender": "f" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "friend"
    }
  },
  {
    "c": { "age": 17, "fname": "Xena", "gender": "f" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Earl",
      "lname": "Johnson",
      "age": 46,
      "email": "earl@gmail.com",
      "children": [
        { "fname": "Xena", "age": 17, "gender": "f" },
        { "fname": "Yuri", "age": 2, "gender": "m" }
      ],
      "hobbies": ["surfing"],
      "relation": "friend"
    }
  },
  {
    "c": { "age": 17, "fname": "Abama", "gender": "m" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Ian",
      "lname": "Taylor",
      "age": 56,
      "email": "ian@gmail.com",
      "children": [
        { "fname": "Abama", "age": 17, "gender": "m" },
        { "fname": "Bebama", "age": 21, "gender": "m" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "cousin"
    }
  },
  {
    "c": { "age": 21, "fname": "Bebama", "gender": "m" },
    "t": {
      "type": "contact",
      "title": "Mr.",
      "fname": "Ian",
      "lname": "Taylor",
      "age": 56,
      "email": "ian@gmail.com",
      "children": [
        { "fname": "Abama", "age": 17, "gender": "m" },
        { "fname": "Bebama", "age": 21, "gender": "m" }
      ],
      "hobbies": ["golf", "surfing"],
      "relation": "cousin"
    }
  }
]
```

#### 4. relation 필드로 그룹화하고, 그때 그룹된 결과의 수가 1개 초과하는 경우

- 각 그룹별로 relation, count, avg_age 필드를 가지는 한 문서씩 남아야 하지만, 이해를 위해 기존 데이터를 남겨둔다

```json
[
  {
    "freind_group": {
        "result" : {
            "avg_age": 17,
            "count": 2,
            "relation": "friend"
        },
        "original_data": [
            {
                "c": { "age": 17, "fname": "Aiden", "gender": "m" },
                "t": {
                    "type": "contact",
                    "title": "Mr.",
                    "fname": "Dave",
                    "lname": "Smith",
                    "age": 46,
                    "email": "dave@gmail.com",
                    "children": [
                            { "fname": "Aiden", "age": 17, "gender": "m" },
                            { "fname": "Bill", "age": 2, "gender": "f" }
                        ],
                    "hobbies": ["golf", "surfing"],
                    "relation": "friend"
                }
            },
            {
                "c": { "age": 17, "fname": "Xena", "gender": "f" },
                "t": {
                    "type": "contact",
                    "title": "Mr.",
                    "fname": "Earl",
                    "lname": "Johnson",
                    "age": 46,
                    "email": "earl@gmail.com",
                    "children": [
                        { "fname": "Xena", "age": 17, "gender": "f" },
                        { "fname": "Yuri", "age": 2, "gender": "m" }
                    ],
                    "hobbies": ["surfing"],
                    "relation": "friend"
                }
            }
        ]
    },
    "cousin_group": {
        "result":{"avg_age": 19,"count": 2,"relation": "cousin"},
        "original_data": [
            {
                "c": { "age": 17, "fname": "Abama", "gender": "m" },
                "t": {
                "type": "contact",
                "title": "Mr.",
                "fname": "Ian",
                "lname": "Taylor",
                "age": 56,
                "email": "ian@gmail.com",
                "children": [
                    { "fname": "Abama", "age": 17, "gender": "m" },
                    { "fname": "Bebama", "age": 21, "gender": "m" }
                ],
                "hobbies": ["golf", "surfing"],
                "relation": "cousin"
                }
            },
            {
                "c": { "age": 21, "fname": "Bebama", "gender": "m" },
                "t": {
                "type": "contact",
                "title": "Mr.",
                "fname": "Ian",
                "lname": "Taylor",
                "age": 56,
                "email": "ian@gmail.com",
                "children": [
                    { "fname": "Abama", "age": 17, "gender": "m" },
                    { "fname": "Bebama", "age": 21, "gender": "m" }
                ],
                "hobbies": ["golf", "surfing"],
                "relation": "cousin"
                }
            }
        ]
    }
}
```

### 5. 평균 나이로 내림차순 정렬

- cousin 그룹 자식의 평균 나이는 19
- friend 그룹 자식의 평균 나이는 17

```json
[
  {
    "cousin_group": {
        "result":{
            "avg_age": 19,
            "count": 2,
            "relation": "cousin"
        },
        "original_data": [
            {
                "c": {
                    "age": 17,
                    "fname": "Abama",
                    "gender": "m" },
                "t": {
                "type": "contact",
                "title": "Mr.",
                "fname": "Ian",
                "lname": "Taylor",
                "age": 56,
                "email": "ian@gmail.com",
                "children": [
                    { "fname": "Abama", "age": 17, "gender": "m" },
                    { "fname": "Bebama", "age": 21, "gender": "m" }
                ],
                "hobbies": ["golf", "surfing"],
                "relation": "cousin"
                }
            },
            {
                "c": {
                    "age": 21,
                    "fname": "Bebama",
                    "gender": "m"
                },
                "t": {
                "type": "contact",
                "title": "Mr.",
                "fname": "Ian",
                "lname": "Taylor",
                "age": 56,
                "email": "ian@gmail.com",
                "children": [
                    { "fname": "Abama", "age": 17, "gender": "m" },
                    { "fname": "Bebama", "age": 21, "gender": "m" }
                ],
                "hobbies": ["golf", "surfing"],
                "relation": "cousin"
                }
            }
        ]
    },
    "freind_group": {
        "result" : {
            "avg_age": 17,
            "count": 2,
            "relation": "friend"
        },
        "original_data": [
            {
                "c": { "age": 17, "fname": "Aiden", "gender": "m" },
                "t": {
                    "type": "contact",
                    "title": "Mr.",
                    "fname": "Dave",
                    "lname": "Smith",
                    "age": 46,
                    "email": "dave@gmail.com",
                    "children": [
                            { "fname": "Aiden", "age": 17, "gender": "m" },
                            { "fname": "Bill", "age": 2, "gender": "f" }
                        ],
                    "hobbies": ["golf", "surfing"],
                    "relation": "friend"
                }
            },
            {
                "c": { "age": 17, "fname": "Xena", "gender": "f" },
                "t": {
                    "type": "contact",
                    "title": "Mr.",
                    "fname": "Earl",
                    "lname": "Johnson",
                    "age": 46,
                    "email": "earl@gmail.com",
                    "children": [
                        { "fname": "Xena", "age": 17, "gender": "f" },
                        { "fname": "Yuri", "age": 2, "gender": "m" }
                    ],
                    "hobbies": ["surfing"],
                    "relation": "friend"
                }
            }
        ]
    }
}
```

### 6. 0부터 시작하는 데이터에서, 1번째 인덱스 데이터 1개 반환

```JSON
{
    "avg_age": 17,
    "count": 2,
    "relation": "friend"
}
```

# `JOIN`

## `JOIN` clause

- 버킷이 아래와 같이 두 개 있을 경우
  1. users_with_orders
     - 유저 프로필 + 유저가 구매한 주문의 아이디
  2. orders_with_users
     - 어떤 사용자가 구매한 특정 주문에 대한 설명
     - `JOIN` 구문 사용하여 주문 정보로 유저 프로필 조회 가능
- `ARRAY`와 `FIRST`: 컬렉션의 요소를 map 또는 filter

### Query

```sql
SELECT
    usr.personal_details,
    usr.shipped_order_history,
    usr.user_id,
    orders
FROM users_with_orders usr
USE KEYS "Elinor_33313792"  -- 사용자 프로필의 key
JOIN orders_with_users orders
    ON KEYS ARRAY s.order_id
        FOR s IN usr.shipped_order_history END

```

### Expected flow

1. `users_with_orders` 버킷에서 유저 정보를 가져온다
2. `USE KEYS` 절로 Elinor_33313792 아이디에 해당하는 정보는 가져온다
3. `JOIN`으로 `orders_with_users` 버킷을 조인시킨다
4.

### Result

```JSON
{
  "results": [
    {
      "orders": {
        "doc_type": "order",
        "order_details": {
          "order_datetime": "Wed Jun  6 18:53:39 2012",
          "order_id": "T103929516925"
        },
        "payment_details": {
          "payment_mode": "Debit Card",
          "total_charges": 308
        },
        "product_details": {
          "currency": "EUR",
          "list_price": 318,
          "pct_discount": 5,
          "product_id": "P3109994453",
          "sale_price": 303
        },
        "shipping_details": {
          "shipping_charges": 5,
          "shipping_status": "Delivered",
          "shipping_type": "Express"
        },
        "user_id": "Elinor_33313792"
      },
      "personal_details": {
        "age": 60,
        "display_name": "Elinor Ritchie",
        "email": "Elinor.Ritchie@snailmail.com",
        "first_name": "Elinor",
        "last_name": "Ritchie",
        "state": "Arizona"
      },
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
    },
    {
      "orders": {
        "doc_type": "order",
        "order_details": {
          "order_datetime": "Thu Aug 11 18:53:39 2011",
          "order_id": "T573145204032"
        },
        "payment_details": {
          "payment_mode": "NetBanking",
          "total_charges": 569
        },
        "product_details": {
          "currency": "GBP",
          "list_price": 666,
          "pct_discount": 15,
          "product_id": "P9315874155",
          "sale_price": 567
        },
        "shipping_details": {
          "shipping_charges": 2,
          "shipping_status": "Delivered",
          "shipping_type": "Regular"
        },
        "user_id": "Elinor_33313792"
      },
      "personal_details": {
        "age": 60,
        "display_name": "Elinor Ritchie",
        "email": "Elinor.Ritchie@snailmail.com",
        "first_name": "Elinor",
        "last_name": "Ritchie",
        "state": "Arizona"
      },
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
  ]
}
```
