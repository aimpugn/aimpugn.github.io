---
title: Node - node-cache와 lru-cache 비교
author: aimpugn
date: 2021-08-14 22:00:00+0900
use_math: true
categories: [node, cache]
---

- 레디스 말고 애플리케이션 내에서 캐시를 써보려고 비교를 해봤다

|              |                                            | weekly donwload        | Last publish |
| ------------ | ------------------------------------------ | ---------------------- | ------------ |
| `node-cache` | <https://github.com/node-cache/node-cache> | 1,583,358 (2021-08-14) | a year ago   |
| `lru-cache`  | <https://github.com/isaacs/node-lru-cache> | 49,365,028(2021-08-14) | a year ago   |

- 결론적으로는 `lru-cache`를 선택했다
  - 키가 있을 때 가져오는 속도는 비슷하거나 `node-cache`가 조금 더 빨랐다
  - 하지만 키가 없을 때는 `lru-cache`에 비해 `node-cache`가 대체로 더 느렸다. 몇 번인가 심하면 두 배까지 차이가 났다.
  - 있는 걸 찾는 건 비슷한 거 같은데 없는 걸 더 빠르게 판단하는 것에 더 가중치를 뒀다
    - 일단 무조건 `get`하고, `undefined`면 없을 때 로직 수행
    - `has`는 `set`할 때만 쓰거나, 시간 갱신 위해 그냥 `has`도 안 쓰고 `set`을 하면 될 거 같아서 `has`의 속도는 크게 신경쓰지 않았다

## 테스트 환경

- 프로세서 Intel(R) Core(TM) i7-7700HQ CPU @ 2.80GHz, 2801Mhz, 4 코어, 8 논리 프로세서
- 설치된 실제 메모리(RAM) 16.0GB
- 파일 시스템 NTFS
- SAMSUNG MZVLW256HEHP-00000

## 테스트 결과

### key가 짧은 경우

```
dummyData {
  data: 'da33dccd1a4f8d0395beb264f11aa996d1cc874bdf80b133e7e1373c43119550',
  time: 1628953322504,
  id: '63640264849a87c90356129d99ea165e37aa5fabc1fea46906df1a7ca50db492'
}
oauthtoken {
  access_token: 'YWNjZXNzX3Rva2Vu',
  refresh_token: 'cmVmcmVzaF90b2tlbg==',
  expires_at: '2021-08-14T15:02:02.504Z',
  issued_at: '2021-08-14T15:02:02.504Z',
  scopes: [ 'read', 'write', 'update', 'etc' ]
}
set at 389 into lruCache
set at 389 into nodeCache
                                               compare cache 10000000
┌───────────────────────────┬───────────────────────────────────────────────────────────────────────────┬──────────┐
│                 test name │                                                                 nodeCache │ lruCache │
├───────────────────────────┼───────────────────────────────────────────────────────────────────────────┼──────────┤
│        checkHas dummyData │                                                                  1.17135s │ 1.38061s │
│        checkGet dummyData │                                                                  1.61401s │ 2.36723s │
│  checkHasAndGet dummyData │                                                                  3.02493s │ 3.69347s │
│       checkHas oauthtoken │                                                                  1.27652s │ 1.22411s │
│       checkGet oauthtoken │                                                                  1.44388s │ 2.19147s │
│ checkHasAndGet oauthtoken │                                                                  2.44148s │ 3.75010s │
│         checkHas notexist │                                                                  0.21517s │ 0.15306s │
│         checkGet notexist │                                                                  0.32762s │ 0.18949s │
│   checkHasAndGet notexist │                                                                  0.48620s │ 0.31368s │
│                    sizeof │                                                                     82240 │   111184 │
│                     stats │ {"hits":40000000,"misses":20000000,"keys":402,"ksize":2709,"vsize":96464} │      402 │
└───────────────────────────┴───────────────────────────────────────────────────────────────────────────┴──────────┘
The script uses approximately 6.2 MB
```

### key가 긴 경우

```
dummyData {
  data: 'da33dccd1a4f8d0395beb264f11aa996d1cc874bdf80b133e7e1373c43119550',
  time: 1628953960258,
  id: '63640264849a87c90356129d99ea165e37aa5fabc1fea46906df1a7ca50db492'
}
oauthtoken {
  access_token: 'YWNjZXNzX3Rva2Vu',
  refresh_token: 'cmVmcmVzaF90b2tlbg==',
  expires_at: '2021-08-14T15:12:40.258Z',
  issued_at: '2021-08-14T15:12:40.258Z',
  scopes: [ 'read', 'write', 'update', 'etc' ]
}
set at 197 into lruCache
set at 197 into nodeCache
                                                                          compare cache 10000000
┌─────────────────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────┬──────────┐
│                                                                       test name │                                                                 nodeCache │ lruCache │
├─────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────┼──────────┤
│       checkHas da33dccd1a4f8d0395beb264f11aa996d1cc874bdf80b133e7e1373c43119550 │                                                                  1.17427s │ 1.17595s │
│       checkGet da33dccd1a4f8d0395beb264f11aa996d1cc874bdf80b133e7e1373c43119550 │                                                                  1.58265s │ 2.00813s │
│ checkHasAndGet da33dccd1a4f8d0395beb264f11aa996d1cc874bdf80b133e7e1373c43119550 │                                                                  2.68041s │ 3.27058s │
│                                                             checkHas oauthtoken │                                                                  1.13869s │ 1.20256s │
│                                                             checkGet oauthtoken │                                                                  1.35612s │ 2.04521s │
│                                                       checkHasAndGet oauthtoken │                                                                  2.38696s │ 3.25056s │
│                                                               checkHas notexist │                                                                  0.19533s │ 0.13683s │
│                                                               checkGet notexist │                                                                  0.31592s │ 0.16072s │
│                                                         checkHasAndGet notexist │                                                                  0.43426s │ 0.22215s │
│                                                                          sizeof │                                                                     82350 │   111294 │
│                                                                           stats │ {"hits":40000000,"misses":20000000,"keys":402,"ksize":2764,"vsize":96464} │      402 │
└─────────────────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────┴──────────┘
The script uses approximately 6.17 MB
```

## 테스트 코드

```js
import LRU from 'lru-cache';
import crypto from 'crypto';
import NodeCache from 'node-cache';
import sizeof from 'object-sizeof';
import { Table } from 'console-table-printer';

const maxSize = 500;
const lruCache = new LRU({
  max: maxSize,
  maxAge: 1000 * 60 * 60, // 1시간
  stale: true, // 캐시 시간 만료된 후 꺼낼 때 삭제 전에 해당 값을 리턴한다
  noDisposeOnSet: true,
  updateAgeOnGet: true,
});

const nodeCache = new NodeCache({
  maxKeys: maxSize,
  deleteOnExpire: true, // 만료 시 삭제
  stdTTL: 60 * 60 * 2, // 2시간
  checkperiod: 60 * 10, // 10분마다 체크
  useClones: false,
});

const dummyData = {
  data: crypto.createHmac('sha256', 'some kind of secret key').update('some kind of data').digest().toString('hex'),
  time: new Date().getTime(),
  id: crypto.createHash('sha256').update('12345678910').digest('hex'),
};
const oauthtoken = {
  access_token: Buffer.from('access_token', 'utf8').toString('base64'),
  refresh_token: Buffer.from('refresh_token', 'utf8').toString('base64'),
  expires_at: new Date().toISOString(),
  issued_at: new Date().toISOString(),
  scopes: ['read', 'write', 'update', 'etc'],
};
console.log('dummyData', dummyData);
console.log('oauthtoken', oauthtoken);
// const dummyDataKey = 'dummyData';
const dummyDataKey = dummyData.data;
const oauthtokenKey = 'oauthtoken';
const noexistkey = 'notexist';

const randomPosition = Math.floor(Math.random() * (400 - 100) + 100);

for (let i = 0; i < 400; i++) {
  const fakeKey = `fake${i}`;
  const fakeData = {
    key: fakeKey,
    value: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ],
    obj: {
      name: 'obj in fake data',
      value: i,
    },
  };
  lruCache.set(fakeKey, fakeData);
  nodeCache.set(fakeKey, fakeData);
  if (i === randomPosition) {
    console.log(`set at ${randomPosition} into lruCache`);
    lruCache.set(dummyDataKey, dummyData?.data);
    lruCache.set(oauthtokenKey, oauthtoken);
    console.log(`set at ${randomPosition} into nodeCache`);
    nodeCache.set(dummyDataKey, dummyData?.data);
    nodeCache.set(oauthtokenKey, oauthtoken);
  }
}

const testLoopCnt = 10000000;
const caches = {
  nodeCache,
  lruCache,
};
const testCases = [
  dummyDataKey,
  oauthtokenKey,
  noexistkey,
];

const firstColumnName = 'test name';
const columns = [{ name: firstColumnName }];
const contentsToPrint = {};
const rows = [];

let start;
const tests = {};
Object.keys(caches).forEach((cacheName) => {
  columns.push({ name: cacheName });
  contentsToPrint[cacheName] = {
    tests: [],
  };
  const cache = caches[cacheName];

  testCases.forEach((testCase) => {
    let label = `checkHas ${testCase}`;
    if (!tests[label]) {
      tests[label] = {};
    }
    start = performance.now();
    for (let i = 0; i < testLoopCnt; i++) {
      cache.has(testCase);
    }
    tests[label][firstColumnName] = label;
    tests[label][cacheName] = getElapsedTime(start);

    label = `checkGet ${testCase}`;
    if (!tests[label]) {
      tests[label] = {};
    }
    start = performance.now();
    for (let i = 0; i < testLoopCnt; i++) {
      cache.get(testCase);
    }

    tests[label][firstColumnName] = label;
    tests[label][cacheName] = getElapsedTime(start);

    label = `checkHasAndGet ${testCase}`;
    if (!tests[label]) {
      tests[label] = {};
    }
    start = performance.now();
    for (let i = 0; i < testLoopCnt; i++) {
      cache.has(testCase);
      cache.get(testCase);
    }
    tests[label][firstColumnName] = label;
    tests[label][cacheName] = getElapsedTime(start);
  });

  if (!tests.sizeof) {
    tests.sizeof = {};
    tests.sizeof[firstColumnName] = ['sizeof'];
  }
  if (!tests.stats) {
    tests.stats = {};
    tests.stats[firstColumnName] = ['stats'];
  }
  tests.sizeof[cacheName] = sizeof(cache);
  if (cacheName === 'lruCache') {
    tests.stats[cacheName] = lruCache.itemCount;
  } else if (cacheName === 'nodeCache') {
    tests.stats[cacheName] = JSON.stringify(nodeCache.getStats());
  }
});

const table = new Table({
  title: `compare cache ${testLoopCnt}`,
  columns,
});
table.addRows(Object.values(tests));
table.printTable();

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

function getElapsedTime(start) {
  return `${((performance.now() - start) / 1000).toFixed(5)}s`;
}
```
