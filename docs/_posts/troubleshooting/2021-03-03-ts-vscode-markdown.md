---
title: vscode saving Getting code actions from ''markdownlint''
author: aimpugn
date: 2021-03-03 20:00:00+0900
use_math: true
categories: [troubleshooting, vscode]
---

## 문제

- vscode에서 markdown 작업 시 백스페이스로 문자가 지워지지 않음
- 우측 하단에 `vscode saving Getting code actions from ''markdownlint''` 라는 메시지 출력

## 원인

- 구글링 해보니 플러그인 문제로 보임
- 여러 markdown 플러그인 사용 중
  - Markdown All in one
  - Markdown Preview Enhanced
  - Markdown Table Generator
  - markdownlint
  - Markdown+Math
- 플러그인을 모두 disable 후 하나씩 켜보면서 확인해 보니, 메시지와 달리 markdownlint의 문제가 아닌 Markdown+Math 플러그인의 문제.

## 해결

- 더 찾아보기에는 꼭 필요한 기능은 아니라, 그냥 Markdown+Math 플러그인 삭제