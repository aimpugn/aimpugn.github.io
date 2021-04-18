---
title: windows terminal ssh
author: aimpugn
date: 2021-4-15 20:00:00+0900
use_math: true
categories: [troubleshooting, ssh, windows_terminal]
---

## 문제

- 보안 관련 경고 출력되면서 SSH 접속 실패

> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  
> @         WARNING: UNPROTECTED PRIVATE KEY FILE!          @  
> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  
> Permissions for '\<PRIVATE KEY\>' are too open.  
> It is required that your private key files are NOT accessible by others.  
> This private key will be ignored.  
> Load key '\<PRIVATE KEY\>' : bad permissions

- .ppk 파일을 로드하도록 했는데, 무효한 포맷이라는 에러 발생하며 SSH 접속 실패

> Load key '\<PRIVATE KEY\>' invalid format

## 원인

- 보안 관련 경고는 private key 파일과 그 디렉토리 권한 문제
- `Load key '<PRIVATE KEY>' invalid format` 에러는 .ppk 파일로 ssh 접속 하려 했기 때문

## 해결

### [보안 관련 경고](https://techsoda.net/windows10-pem-file-permission-settings/)

- 디렉토리 우 클릭 > 속성 > 보안 > 고급
- 상속 삭제
- 추가 > 보안 > 주체 선택에 현재 로그인 계정 입력하여 이름 확인 후 자동 선택되는 대로 저장
- 파일도 같은 과정을 거치면 `Permissions for '<PRIVATE KEY>' are too open.` 경고는 사라진다

### [invalid format](https://serverfault.com/a/1004777)

- `.ppk` 파일은 PuTTYgen 상요해서 생성
- `.ppk`가 아닌 OpenSSH 키로 추출하여 사용
