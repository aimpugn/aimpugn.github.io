---
title: Generator and yield
author: aimpugn
date: 2021-12-27 23:40:00+0900
use_math: true
categories: [node, generator, yield]
---

- [`Generator` and `yield`](#generator-and-yield)
  - [개요](#개요)
    - [`Generator`?](#generator)
      - [관련 파일](#관련-파일)
      - [`async` 함수와의 관계?](#async-함수와의-관계)
  - [문법](#문법)
    - [`yield`의 동작 방식?](#yield의-동작-방식)
  - [터미널 입력 계속 받기](#터미널-입력-계속-받기)
  - [기타](#기타)
    - [참고 링크](#참고-링크)

# `Generator` and `yield`

## 개요

- `async/await`가 있지만 `generator/yield`를 쓰는 게 나은 거 같은 경우가 있어서 정리
- 가령 터미널로 명령어를 계속 입력 받고 싶은 경우,
  - 여러 예제에서는 재귀적으로 입력값을 읽어들이는 함수를 계속 실행하게 한다. 하지만 그러면 결국 콜 스택이 계속 쌓일 텐데, 그게 싫어서 다른 방법을 찾아보다 보니 `generator` 예제가 있어서 테스트
  - `generator`로 `readline.question()` 발생 시키고 그때마다 `yield`로 결과를 반환

### `Generator`?

- `generator function`의 인스턴스

#### [관련 파일](https://github.com/v8/v8)

- `src/parsing/parser.cc`: 말 그대로 프로그램을 파싱하는 소스코드
- `src/interpreter/bytecode-generator.cc`: 바이트코드 생성 소스 코드
- `src/objects/js-generator.h`: `Generator` 클래스 정의한 헤더 파일

#### `async` 함수와의 관계?

- `generator/yield`는 ES6에서, `async/await` ES7에서 소개
- [`src/objects/js-generator.h`](https://github.com/v8/v8/blob/17a99fec258bcc07ea9fc5e4fabcce259751db03/src/objects/js-generator.h#L22) 같은 파일에 클래스가 정의되어 있다
- 그리고 [클래스 다이어그램](https://denolib.github.io/v8-docs/classv8_1_1internal_1_1JSGeneratorObject.html)을 보면 결국 `JSAsyncFunctionObject`와 `JSAsyncGeneratorObject` 모두 `JSGeneratorObject`를 상속한다
- [스택오버플로 답변과 댓글](https://stackoverflow.com/a/36245227/8562273)을 보면, 내부적으로는 `async` 함수가 `generator` 관련 API를 사용하고 불필요한 체크들을 스킵
  - <https://github.com/v8/v8/blob/17a99fec258bcc07ea9fc5e4fabcce259751db03/src/builtins/builtins-async-function-gen.cc#L247-L254>
- 2017년도 기준으로 [`async/await`가 2배 정도 더 빠르다](https://medium.com/@markherhold/generators-vs-async-await-performance-806d8375a01a)는 거 같다

## [문법](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)

```js
function* generator(i) {
  yield i;
  yield i + 10;
}

const gen = generator(10); // generator는 constructor(즉 new 키워드)로 생성되지 않는다

console.log(gen.next().value);
// expected output: 10

console.log(gen.next().value);
// expected output: 20
```

### `yield`의 동작 방식?

- 마치 소켓과 같은 역할을 한다
  - `yield` 키워드 위치의 결과를 `generator.next()` 호출한 곳으로 반환한다
  - `generator.next(파라미터)`처럼 어떤 파라미터가 있으면 해당 파라미터를 받아와서 변수에 할당할 수 있다

## 터미널 입력 계속 받기

- [스택오버플로 답변](https://stackoverflow.com/a/64139456/8562273) 참조

```js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator

import readline from "readline";

async function* questions() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let query;
  try {
    while (true) {
      query = yield new Promise((resolve) => {
        if (query) {
          rl.question(query, resolve); // readline으로 입력된 값을 resolve해서 반환
        } else {
          resolve(null); // 처음 yield로 이동 시(generator.next();)에 query가 비어 있으므로 null로 resolve
        }
      });
    }
  } finally {
    rl.close();
  }
}

async function run() {
  let loopCnt = 0;
  const generator = questions();
  // Generator 오브젝트 생성 시 초기 파라미터를 넘기는 경우와 넘기지 않는 경우가 있다
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*#passing_arguments_into_generators
  generator.next(); // 초기 파라미터 넘기지 않으면, `next()`사용해서 초기 yield까지 한번 이동하게 해야 한다
  let generated = await generator.next(`${loopCnt++}번째 질문\n`);
  console.log("Outside of while, first generated", generated);
  while (generated.done === false) {
    generated = await generator.next(`${loopCnt++}번째 질문\n`);
    console.log("Inside of while", generated);
    if (loopCnt == 3) {
      generator.return();
      break;
    }
  }
}

run();
/*
0번째 질문
안녕
Outside of while, first generated { value: '안녕', done: false }
1번째 질문
Hello
Inside of while { value: 'Hello', done: false }
2번째 질문
World
Inside of while { value: 'World', done: false }
*/
```

## 기타

### 참고 링크

- [27.5 Generator Objects](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-generator-objects)
- [Faster async functions and promises](https://v8.dev/blog/fast-async)
- [The saga of async JavaScript: Generators](https://dev.to/romansarder/the-saga-of-async-javascript-generators-5dhi)
- [JavaScript generators: The superior async/await](https://blog.logrocket.com/javascript-generators-the-superior-async-await/)
- [Generators VS Async/Await Performance](https://medium.com/@markherhold/generators-vs-async-await-performance-806d8375a01a)
- [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)
- [Javascript Generator Yield/Next vs Async-Await Overview and Comparison](https://towardsdatascience.com/javascript-generator-yield-next-async-await-8442d2c77185)
- [How to readline infinitely in Node.js](https://stackoverflow.com/questions/24464404/how-to-readline-infinitely-in-node-js/32847518)
