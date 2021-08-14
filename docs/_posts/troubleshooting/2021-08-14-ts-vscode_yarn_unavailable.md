---
title: vscode - AppData\Roaming\npm\yarn.ps1 로드할 수 없습니다
author: aimpugn
date: 2021-8-14 01:00:00+0900
use_math: true
categories: [troubleshooting, vscode, yarn]
---

# AppData\Roaming\npm\yarn.ps1 로드할 수 없습니다

## 문제

- vscode의 터미널에서 yarn으로 패키지 설치하려니 아래와 같은 에러 발생

```
yarn : 이 시스템에서 스크립트를 실행할 수 없으므로 C:\Users\<USERNAME>\AppData\Roaming\npm\yarn.ps1 파일을 로드할 수 없습니다. 자세한 내용은 about_Execution_Policies(https://go.microsoft.com/fwlink/?LinkID=135170)를 참조하십시
오.
위치 줄:1 문자:1
+ yarn
+ ~~~~
    + CategoryInfo          : 보안 오류: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

## 원인

- [여기](https://stackoverflow.com/questions/56199111/visual-studio-code-cmd-error-cannot-be-loaded-because-running-scripts-is-disabl) [저기](https://stackoverflow.com/questions/64767729/vscode-cannot-be-loaded-because-running-scripts-is-disabled-on-this-system) 검색을 해보니 터미널 실행시의 보안 정책 때문인 것으로 보인다.

## 해결

- `"terminal.integrated.shellArgs.windows": ["-ExecutionPolicy", "Bypass"]`를 사용하려니 deprecated 됐다고 나온다
- [문서](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuration)에 따르면 아래와 shell.windows, shellArgs.windows가 아닌 `profiles`를 미리 설정하고 어떤 프로필을 사용할 것인지 설정하는 방식으로 사용할 것을 권장하고 있다
- 물론 [-ExecutionPolicy](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.1#parameters)는 마찬가지로 `Bypass`로 설정해야 한다

```js
"terminal.integrated.profiles.windows": {
    "PowerShell_default": {
        "source": "PowerShell",
        "args": ["-ExecutionPolicy", "Bypass"]
    }
},
"terminal.integrated.defaultProfile.windows": "PowerShell_default",
```
