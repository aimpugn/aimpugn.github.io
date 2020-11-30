---
title: Makefile Basic
author: aimpugn
date: 2020-11-23 23:00:00 +0900
categories: [Makefile.basic]
tags: [linux,makefile]
math: true
use_math: true
---

# 기본 형식
```
target ... : prerequisites ..
    recipe
    ...
```
`target`
    - 일반적으로 프로그램으로 생성된 파일명
    - `Phony Targets`처럼 요청 시 실행될 레시피에 대한 이름
    - `target`은 주로 여러 파일에 의존한다
`prerequisites`:
    - `target` 생성하기 위한 입력으로 사용되는 파일
`recipe`:
    - `make`가 수행할 액션
    - 모든 `recipe` 앞에 탭을 입력 또는 [`.RECIPEPREFIX` 변수 사용](https://www.gnu.org/software/make/manual/html_node/Special-Variables.html#Special-Variables)

