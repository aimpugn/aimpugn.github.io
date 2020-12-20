---
title: GitHub Pages Error No such file or directory @ rb_sysopen
author: aimpugn
date: 2020-12-21 00:37:00+0900
categories: ["troubleshooting", "GitHub Pages"]
---

## 문제

- `bundle exec jekyll serve` 시 다음과 같은 에러 발생

```s
jekyll 3.9.0 | Error:  No such file or directory @ rb_sysopen -

...

  Writing: C:/Users/daybreak/vscode_projects/proejct_docs/aimpugn.github.io/docs/_site/couchbase/2020-11-09-Couchbase-Create_the_Right_Index_Get_the_Right_Performance/2te_the_Right_Index_Get_the_Right_Performance.html
           Writing: C:/Users/daybreak/vscode_projects/proejct_docs/aimpugn.github.io/docs/_site/couchbase/2020-11-17-Couchbase-Blog-Using_Eviction_Effectively_to_Manage_Memory_U20/11/17/Couchbase-Blog-Using_Eviction_Effectively_to_Manage_Memory_Usage_in_Couchbase_GSI.html
/2020-11-17-Couchbase-Blog-Using_Eviction_Effectively_to_Manage_Memory_Usage_in_Couchbase_GSI/2020/11/17/Couchbase-Blog-Using_Eviction_Effectively_to/2020-11-17-Couchbase-Blog-U_Manage_Memory_Usage_in_Couchbase_GSI.html                                                                                                           hbase_GSI.html
Traceback (most recent call last):
```

## 원인

- 파일명이 너무 길어서 발생
- 그럼 이전에는 왜 발생하지 않았을까?
  - 이전에는 bundle로 굳이 로컬에서 실행해보지 않았었음
  - 따라서 에러가 발생하는지 확인하고 push 하지는 않았었다

## 해결

- 파일명을 줄이니 해결
