---
title: troubleshooting php
author: aimpugn
date: 2020-10-27 08:10:00 +0900
categories: [troubleshooting.php]]
tags: [php,troubleshooting]
math: true
use_math: true
---

## PHP Fatal error: Allowed memory size of 2147483648 bytes exhausted (tried to allocate 28672 bytes)

### 문제

1. 약 76만개의 데이터 처리중 php 로그에 Fatal error 발생

### 원인

1. 메모리 한계 이상 사용하여 종료

#
1. 10만00개 단위로 분할
