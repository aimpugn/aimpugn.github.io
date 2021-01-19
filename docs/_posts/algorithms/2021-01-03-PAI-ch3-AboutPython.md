---
title: ch3 About Pythonm
author: aimpugn
date: 2021-01-18 23:25:00+0900
use_math: true
categories: [PAI, algorithms]
---
- [문법](#문법)
  - [인덴트](#인덴트)
  - [네이밍 컨벤션](#네이밍-컨벤션)
  - [타입 힌트](#타입-힌트)
  - [리스트 컴프리헨션](#리스트-컴프리헨션)
  - [제네레이터](#제네레이터)

## 문법

### 인덴트

- 공식 가이드 PEP 8에 따라 `공백
- 첫번째 줄에 파라미터가 있다면, 파라미터가 시작되는 부분에 맞춘다

```python
foo = long_func_nm(var_one, var_two,
                   var_three, var_four)
```

- 첫번째 줄에 파라미터가 없다면, 공백 4칸 인덴트를 한 번 더 추가하여 다른 행과 구분되게 한다

```python
def long_func_nm(
    var_one, var_two, var_three,
    var_four):
    print(var_one)
```

- 여러 줄로 나눠쓸 경우, 다음 행과 구분되도록 인덴트 추가

```python
foo = long_func_nm(
    var_one, var_two,
    var_three, var_four)
```

### 네이밍 컨벤션

- 각 단어를 밑줄(`_`)로 구분하여 표기하는 스네이크 케이스(Snake Case) 따른다
- 최소한 직접 작성하는 코드는 소문자 변수명과 함수명을 기본으로 해야 한다
- 카멜 케이스 및 자바 스타일 코딩을 지양

### 타입 힌트

- 동적 타이핑 언어이지만, PEP 484 문서에 타입 힌트가 추가됐다
- python 3.5부터 사용할 수 있다

```python
a: str = "1"
b: int = 1
```

- 기존에는 함수 이름만 선언해서 사용

```python
def fn(a):
```

- 하지만 큰 프로젝트에서는 어떤 타입의 어떤 파라미터를 넘겨야 할지 알 수 없고, 리턴 값도 명확치 않아 가독성이 떨어지고 버그 유발의 주범
- 다음과 같이 타입 힌트를 명시할 수 있다

```python
def fn(a: int) -> bool:
```

- 하지만 강제가 아니며, 여전히 동적 할당 가능하므로, 문자열에 정수 할당하는 등의 방식은 절대 지양

```python
a: str = 1
type(a)
<class 'int'>
```

- 온라인 코테의 경우 mypy 통해 타입 힌트에 오류 없는지 자동으로 확인 가능

```
pip install mypy
```

### 리스트 컴프리헨션

- map, filter 같은 함수형(`Functional`) 기능 지원
- 람다 표현식 지원

```python
list(map(lambda x: x + 10, [1, 2, 3]))
```

- 하지만 리스트 컴프리헨션 사용하는 것이 파이썬다운 방식이라고 하며, map이나 filter 섞어서 사용하는 것보다 가독성이 좋다
- 리스트 컴프리헨션 사용 시

```python
[n * 2 for n in range(1, 10 + 1) if n % 2 == 1]
[2, 6, 10, 14, 18]
```

- 리스트 컴프리헨션 미사용 시

```python
a = []
for n in range(1, 10 + 1):
    if n % 2 == 0:
        a.append(n * 2)

[2, 6, 10, 14, 18]
```

- 리스프 컴프리헨션이라는 이름과는 별개로, 버전 2.7 이후 딕셔너리 등도 가능
- 리스트 컴프리헨션 사용 시

```python
a = {key : value for key, value in original.items()}
```

- 리스트 컴프리헨션 미사용 시

```python
a = {}
for key, value in original.items():
    a[key] = value
```

### 제네레이터

- 2.2 버전에 추가된 기능 중 하나
- 루프의 반복(`iteration`) 동작을 제어할 수 있는 루틴 형태
- 숫자 1억 개를 계산한다고 했을 때, 제네레이터 없으면 1억 개의 숫자를 메모리에 보관
- 하지만 제네레이터 사용하면 필요할 때 언제든 숫자를 만들어낼 수 있다
