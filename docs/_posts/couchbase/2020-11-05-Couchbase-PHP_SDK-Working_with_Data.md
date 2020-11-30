---
title: Couchbase PHP SDK Working with Data
author: aimpugn
date: 2020-11-05 12:00:00 +0900
categories: [Couchbase.sdk.php.working_with_data]
tags: [couchbase]
math: true
use_math: true
---

# [Key Value Operations](https://docs.couchbase.com/php-sdk/current/howtos/kv-operations.html)

## 개요

- `Key Valeu(KV)` 또는 [data service](https://docs.couchbase.com/server/current/learn/services-and-indexes/services/data-service.html)는 키를 알고 있는 데이터를 가져오거나 수정(mutate)하기 가장 쉬운 방법 제공
- 이 문서에서 커버하게 될 내용
  1. CRUD 작업
  2. 문서 만료(document expiration)
  3. `CAS(Compare And Swap)`로 낙관적 락(optimistic locking)
     - [[MSSQL] Pessimistic, Optimistic Locking - 비관적 잠금과 낙관적 잠금 (DB)](https://m.blog.naver.com/smart_guy/100196538467)
     - [Optimistic vs. Pessimistic locking](https://stackoverflow.com/a/129397)

### [CAS](https://docs.couchbase.com/php-sdk/current/howtos/concurrent-document-mutations.html)

- `Concorrent`(병행, 동시) 문서 수정을 어떻게 다룰 것인지 제어하기 위해 사용
- 부주의로 어떤 변화가 유실되거나 다른 클라이언트에 의해 변화가 덮어쓰여지는 잠재적인 경합 상태(race condition)을 피하고 제어하는 것을 돕는다
- `CAS` 값
  - 항목의 현재 상태를 나타내며, 해당 항목이 변경될 때마다 `CAS` 값은 변한다
  - 문서에 접근할 때마다 문서 메타데이터의 일부로 반환된다
  - `replace` 또는 `remove` 작업의 매개변수로 전달할 수 있다
- 애플리케이션이 `CAS`를 제공하는 경우
  - `애플리케이션의 CAS` == `문서의 CAS` &#8594; 수정 작업 성공
  - `애플리케이션의 CAS` != `문서의 CAS` &#8594; 수정 작업 실패

## Docouments

- `document`는 데이터베이스의 항목(RDBMS에서는 `row`)을 참조
- `document`는 유일한 `ID`(RDBMS에서는 `primary key`)를 가진다
- `document`는 실제 애플리케이션 데이터를 가진다
- [`document`의 데이터 모델](https://docs.couchbase.com/php-sdk/current/concept-docs/documents.html) 참조

## CRUD 작업

- Couchbase Server에 대한 핵심 인터페이스는 완전한 `full document`에 대한 간단한 KV 작업이다

### CREATE

```PHP
$document = [
    "foo" => "bar",
    "bar" => "foo"
];
$res = $collection->insert("document-key-new", $document);
printf("document \"document-key\" has been created with CAS \"%s\"\n", $res->cas());
```

- `CAS` 값을 설정하는 것은 `낙관적 락`의 한 형태(a form of optimistic locking)
- `CAS` 값은 항목의 현재 상태, 각 항목이 수정된 시간을 나타낸다

### [READ](https://docs.couchbase.com/php-sdk/current/howtos/kv-operations.html#retrieving-full-documents)

- get(<document-key>) 메서드 사용하여 완전한 `full document`를 가져올 수 있다

```PHP
es = $collection->get("document-key");
$doc = $res->content();
printf("document \"document-key\" has content: \"%s\" CAS \"%s\"\n", json_encode($doc), $res->cas());
```

## [Expiration / TTL](https://docs.couchbase.com/php-sdk/current/howtos/kv-operations.html#expiration-ttl)

### 개요

- 기본적으로, Couchbase 문서는 만료되지 않지만, 사용자 세션, 캐시 똔느 기타 임시 문서들에 대해 임시(`transient`, `temporary`) 데이터가 필요할 수 있다
- 특정 문서가 설정한 시간 이후 만료
- [Java SDK 예제](https://docs.couchbase.com/java-sdk/current/howtos/kv-operations.html#document-expiration)
- [`Bucket`의 `Expiration`과 비교](https://docs.couchbase.com/server/6.5/learn/buckets-memory-and-storage/expiration.html#expiration-bucket-versus-item)

### TouchOption()

```php
$opts = new TouchOptions();
$opts->timeout(500000 /* microseconds */);
$collection->touch($key, 60 /* seconds */);
```

### getAndTouch()

```php
$res = $collection->getAndTouch($key, 1 /* seconds */);
printf("[getAndTouch] document content: %s\n", var_export($res->content(), true));

sleep(2); // wait until the document will expire

try {
    $collection->get($key);
} catch (Couchbase\DocumentNotFoundException $ex) {
    printf("The document does not exist\n");
}
```

## [Atomic Counter](https://docs.couchbase.com/php-sdk/current/howtos/kv-operations.html#atomic-counters)

- 원자성 카운터
- 문서의 값을 원자적으로 증(increment)/감(decrement)

### INCREMENT

```php
// increment binary value by 1 (default)
$binaryCollection = $collection->binary();
$res = $binaryCollection->increment(<KEY>);
```

### INCREMENT(with options)

```php
$key = "phpDevguideExampleCounter";
$opts = new IncrementOptions();
# Create a document and assign it to 10
$opts = $opts->initial(10);  # if it doesn't exist, counter works atomically by first creating a document
$opts = $opts->delta(2);     # if it exist, the same method will increment/decrement per the "delta" parameter

$res = $binaryCollection->increment($key, $opts);
// Should print 10
printf("Initialized Counter: %d\n", $res->content());
```

### DECREMENT

```php
// decremtnt binary value by 1 (default)
$res = $binaryCollection->decrement("foo");
```

### DECREMENT (with options)

```php
$opts = new DecrementOptions();
$opts->initial(10)->delta(4);
// Decrement value by 4 to 8
$res = $binaryCollection->decrement($key, $opts);
// Should print 8
printf("Decremented Counter: %d\n", $res->content());
```

# 하위 문서(Sub-Document) 작업

## 개요

- 문서의 `일부(parts)`에 효과적으로 접근하기 위해 사용
- `upsert`, `replace`, 그리고 `get` 같은 `완전한(full)` 문서 작업보다 더 빠르고 네트워크 효율적일 수 있다
  - 네트워크 통해 문서에 접근한 부분만 전달
  - 내장된 병행 제어로 문서에 대한 원자적인, 안전한 수정이 가능하다

## 하위 문서(Sub-Document)

- 문서의 일부로서, `sub-documents`라 부른다
- 완전한 문서 조회는 전체 문서를 가져오고, 완전한 문서 업데이트는 완전한 문서를 전달해야 한다
- 반면 하위 문서 조회는 전체 문서의 일부만 반환하며, 하위 문서 언데이트는 수정된 일부만 전달하면 된다
- 단 여기서 기술한느 내용은 `KV` 요청에 대한 것이며, `N1QL` 쿼리에 대한 하위 문서 작업은 [Querying with N1QL](https://docs.couchbase.com/php-sdk/current/howtos/n1ql-queries-with-sdk.html)에 설명되어 있다

## 작업

### 예제 데이터

```json
customer123.json
{
  "name": "Douglas Reynholm",
  "email": "douglas@reynholmindustries.com",
  "addresses": {
    "billing": {
      "line1": "123 Any Street",
      "line2": "Anytown",
      "country": "United Kingdom"
    },
    "delivery": {
      "line1": "123 Any Street",
      "line2": "Anytown",
      "country": "United Kingdom"
    }
  },
  "purchases": {
    "complete": [339, 976, 442, 666],
    "abandoned": [157, 42, 999]
  }
}
```

### `lookupIn(\Couchbase\Collection)`: [조회(Retrieving)](https://docs.couchbase.com/php-sdk/current/howtos/subdocument-operations.html#retrieving)

- \Couchbase\Collection\ class의 `lookupIn` 메서드 사용
- `name`, `addresses.billing.country`, `purchases.complete[0]`은 모두 유효한 `경로(path)`다
- `lookup-in` 작업은 특정 경로에 대한 문서를 문의(query)하고, 해당 경로들을 반환받는다
  1. `subdoc-get` 하위 문서 작업을 사용하여 문서 경로를 조회하거나
  2. `subdoc-exists` 하위 문서 작업을 사용하여 간단하게 경로가 존재하는지 문의할 수 있다

#### SUBDOC-GET: LookupGetSpec(<PATH>)

```PHP
$result = $collection->lookupIn("customer123", [
    new \Couchbase\LookupGetSpec("addresses.delivery.country")
]);
$country = $result->content(0);
printf("%s\n", $country);
// "United Kingdom"
```

#### SUBDOC-EXISTS: LookupExistsSpec(<PATH>)

```php
$result = $collection->lookupIn("customer123", [
    new \Couchbase\LookupExistsSpec("purchases.pending[-1]")
]);
printf("Path exists? %s\n", $result->exists(0) ? "true" : "false");
// Path exists? false
```

#### 다중 조회 작업

```php
$result = $collection->lookupIn("customer123", [
    new \Couchbase\LookupGetSpec("addresses.delivery.country"),
    new \Couchbase\LookupExistsSpec("purchases.pending[-1]")
]);
# $result는 \Couchbase\LookupInResult class
printf("%s\n", $result->content(0));
printf("Path exists? %s\n", $result->exists(1) ? "true" : "false");
// United Kingdom
// Path exists? false
```

### `mutateIn(\Couchbase\Collection)`: [수정(Mutating)](https://docs.couchbase.com/php-sdk/current/howtos/subdocument-operations.html#mutating)

- \Couchbase\Collection\ class의 `mutateIn` 메서드 사용
  - `atomic` 작업으로, 만약 한 작업이라도 실패하면, 전체 문서가 변경없는 상태로 유지된다
- 문서의 하나 또는 그 이상의 경로를 수정
- 이 작업 중 가장 간단한 것은 `subdoc-upsert`로, 완전한 문서(fulldoc) 레벨의 `upsert`와 비슷하지만,
  1. 기존 경로의 값이 존재하면 수정
  2. 기존 경로의 값이 존재하지 않으면 새로 생성

#### SUBDOC-UPSERT: MutateUpsertSpec()

```php
$result = $collection->mutateIn("customer123", [
    new \Couchbase\MutateUpsertSpec("fax", "311-555-0151")
]);
```

#### SUBDOC-INSERT: MutateInsertSpec()

```PHP
$result = $collection->mutateIn("customer123", [
    new \Couchbase\MutateInsertSpec("purchases.complete", [42, true, "None"])
]);
// SubdocPathExistsError
```

#### SUBDOC-REMOVE/REPPLACE: MutateRemoveSpec()/MutateReplaceSpec()

```PHP
$result = $collection->mutateIn("customer123", [
    new \Couchbase\MutateRemoveSpec("addresses.billing"),  // 삭제
    new \Couchbase\MutateReplaceSpec("email", "dougr96@hotmail.com")  // 치환
]);
```

#### SUBDOC-ARRAY-APPEND: MutateArrayAppendSpec()

```PHP
/* BEFORE
"purchases": {
    "complete": [339, 976, 442, 666],
    "abandoned": [157, 42, 999]
}
*/

$result = $collection->mutateIn("customer123", [
    new \Couchbase\MutateArrayAppendSpec("purchases.complete", [777])
]);

/* AFTER
"purchases": {
    "complete": [339, 976, 442, 666, 777*],
    "abandoned": [157, 42, 999]
}
*/
```

#### SUBDOC-ARRAY-PREPEND: MutateArrayPrependspec()

```PHP
/* BEFORE
"purchases": {
    "complete": [339, 976, 442, 666, 777],
    "abandoned": [157, 42, 999]
}
*/

$result = $collection->MutateIn("customer123", [
    new \Couchbase\MutateArrayPrependspec("purchases.abandoned", [18])
]);

/* AFTER
"purchases": {
    "complete": [339, 976, 442, 666, 777],
    "abandoned": [18*, 157, 42, 999]
}
*/
```

#### 배열만 담는 문서 필요한 경우

```php
$result = $collection->upsert("my_array", []);
$result = $collection->mutateIn("my_array", [
    new \Couchbase\MutateArrayAppendSpec("", ["some element"])
]);
/* the document my_array:
[
    "some element"
]
*/
```

#### COLLECTION OF MULTIPLE ELEMENTS

```PHP
$collection_of_multiple_elements = [
    [
        "element1",
        "element2",
        "element3"
    ]
];

$result = $collection->mutateIn("my_array", [
    new \Couchbase\MutateArrayAppendSpec("", $collection_of_multiple_elements)
]);
/* the document my_array:
[
    "some element",
    [
        "element1",
        "element2",
        "element3"
    ]
]
*/
```

#### MULTIPLE ELEMENTS

```PHP
$multiple_elements = [
    "element1",
    "element2",
    "element3"
];

$result = $collection->mutateIn("my_array", [
    new \Couchbase\MutateArrayAppendSpec("", $multiple_elements)
]);
/* the document my_array:
[
    "some element",
    [
        "element1",
        "element2",
        "element3"
    ],
    "element1",
    "element2",
    "element3"
]
*/
```
