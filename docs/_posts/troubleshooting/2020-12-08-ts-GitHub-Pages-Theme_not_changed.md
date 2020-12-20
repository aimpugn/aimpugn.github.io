---
title: Troubleshooting GitHub Pages theme not change
author: aimpugn
date: 2020-12-08 00:08:00 +0900
---

## GitHub Pages 테마 변경이 바로 안 보이는 경우

### 문제

- 아무리 push를 해도 사이트 변경이 이뤄지지 않음

### 원인

- 빌드가 안 되는 건가 했는데, 캐시 때문
- [링크](https://github.com/cotes2020/jekyll-theme-chirpy/issues/135#issuecomment-694934056)에 따르면,

```
웹사이트가 업데이트될 때마다 브라우저의 PWA 프로세스가 백그라운드에서 서버의 최신 컨텐츠를 체크하고 로컬 캐시를 업데이트
그 전에는, 브라우저에서 보여지는 컨텐츠는 이전 버전에서 캐시된 것
보통 수십초에서 몇 분씩 소요되므로, force refresh 불필요
바로 확인하고 싶으면 익명 모드로 접속
```

### 해결

- *Chrome Browser > Developer Tools > Application > Clear Storage*에서 저장된 스토리지 삭제하고 새로고침 하니 페이지가 정상으로 나온다
