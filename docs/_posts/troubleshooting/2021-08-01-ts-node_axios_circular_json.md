---
title: node-Converting circular structure to JSON
author: aimpugn
date: 2021-08-01 01:00:00+0900
use_math: true
categories: [troubleshooting, docker]
---

# Converting circular structure to JSON

## 문제

- fastify의 reply로 응답하려는데 `Converting circular structure to JSON` 에러 발생

## 원인

- response를 통째로 reply해서 보고 싶었는데, 내부에서 JSON.stringify를 하면서 계속 직렬화를 하다 보니 문제가 발생

## 해결

- [스택오버플로](https://stackoverflow.com/a/64738852) 답변에 따라 `response.data` 항목만 리턴
