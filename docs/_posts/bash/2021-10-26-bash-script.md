---
title: bash script
author: aimpugn
date: 2021-10-27 21:00:00+0900
use_math: true
categories: [bash]
---

- [커맨드라인 파싱](#커맨드라인-파싱)
- [Command Substitution](#command-substitution)
- [Shell Functions](#shell-functions)
- [문자열 치환](#문자열-치환)
  - [`sed`](#sed)

서버는 대부분 리눅스를 사용하고, 리눅스를 쓰다 보면 반복적으로 타이핑하는 걸 자동으로 하고 싶고, 그러다 보면 찾게 되는 게 bash script다.  
그런데 막상 스크립트 작성하려면 문법을 자꾸 까먹어서 종종 검색하던 걸 정리해 봐야겠다.  

### 커맨드라인 파싱

```bash
#!/bin/bash

printf "\$*: $*, 모든 인자를 하나의 값으로 받는다\n"

# https://stackoverflow.com/a/56098884, https://unix.stackexchange.com/a/433595
printf "\$@: "; printf '%q ' "${@}"; printf "\n"
printf '${*@Q}: %s, 모든 인자를 \n' "${*@Q}"

printf '$0: %s, 현재 실행되는 스크립트의 경로. command-line 그대로 나온다.\n' "$0"

printf '$$: %s, 현재 프로세스의 PID\n' $$

printf '$?: %s, 마지막 실행된 커맨드의 exit code\n' $?

printf '$_: %s, 마지막 실행된 커맨드의 마지막 argument\n' $_

printf '$!: %s, 마지막 실행된 커맨드의 PID\n' $!

printf '$-: %s, 현재 유효한 옵션 플래그\n' $-
```

```bash
[aimpugn@vultr project_sh]$ ./bash_test hello world
$*: hello world, 모든 인자를 하나의 값으로 받는다
$@: hello world 
${*@Q}: 'hello' 'world', 모든 인자를 
$0: ./bash_test
$$: 2965674, 현재 프로세스의 PID
$?: 0, 마지막 실행된 커맨드의 exit code
$_: 0, 마지막 실행된 커맨드의 마지막 argument
$!: , 마지막 실행된 커맨드의 PID
$-: hB, 현재 유효한 옵션 플래그
```

### Command Substitution

- 명령어 대체
- 명령어의 결과를 변수에 저장하는 것

```bash
#!/bin/bash

variable=$(date "+%Y-%m-%d %H:%M:%S")
printf "$variable\n"
```

```bash
[aimpugn@vultr project_sh]$ ./bash_test 
2021-10-26 22:40:32
```

### Shell Functions

- 이름을 가진 복합적인 명령어
- 함수의 이름은 바로 명령어가 되어 다른 명령어와 같은 방식으로 사용할 수 있다
- [source](https://linuxize.com/post/bash-source-command/) 명령어 사용하면 현재 쉘 환경에서 함수를 실행할 수 있다

```bash
#!/bin/bash
testfunction(){
    printf '%s\n' $@
}
```

```bash
[aimpugn@vultr project_sh]$ . bash_test 
[aimpugn@vultr project_sh]$ testfunction test1 test2 test3
test1
test2
test3
```

- 기타 참고할 함수들

```bash
#!/bin/bash
# IP가 유효한지 체크하는 함수
isvalidip() #@ USAGE: isvalidip DOTTED-QUAD
{
 case $1 in
 ## reject the following:
 ## empty string
 ## anything other than digits and dots
 ## anything not ending in a digit
 "" | *[!0-9.]* | *[!0-9]) return 1 ;;
 esac
 ## Change IFS to a dot, but only in this function
 local IFS=.
 ## Place the IP address into the positional parameters;
 ## after word splitting each element becomes a parameter
 set -- $1
 [ $# -eq 4 ] && ## must be four parameters
 ## each must be less than 256
 ## A default of 666 (which is invalid) is used if a parameter is empty
 ## All four parameters must pass the test
 [ ${1:-666} -le 255 ] && [ ${2:-666} -le 255 ] &&
 [ ${3:-666} -le 255 ] && [ ${4:-666} -le 255 ]
}

valint(){ #@ USAGE: valint INTEGER
 case ${1#-} in ## Leading hyphen removed to accept negative numbers
 *[!0-9]*) false;; ## the string contains a non-digit character
 *) true ;; ## the whole number, and nothing but the number
 esac
}

uinfo() #@ USAGE: uinfo [file]
{
 # %12s는 앞에 공백 12개 의미
 printf "%12s: %s\n" \
 USER "${USER:-No value assigned}" \
 PWD "${PWD:-No value assigned}" \
 COLUMNS "${COLUMNS:-No value assigned}" \
 LINES "${LINES:-No value assigned}" \
 SHELL "${SHELL:-No value assigned}" \
 HOME "${HOME:-No value assigned}" \
 TERM "${TERM:-No value assigned}"
} > ${1:-/dev/fd/1} # it expands to the function’s first argument or to /dev/fd/1 (standard output) if no argument is given: 
```

### 문자열 치환

- `sed`, `awk`, `perl` 등을 사용
- [Bash Shell: Replace a String With Another String In All Files Using sed and Perl -pie Options](https://www.cyberciti.biz/faq/unix-linux-replace-string-words-in-many-files/) 참조

#### `sed`

- [How `sed` Works](https://www.gnu.org/software/sed/manual/sed.html#Execution-Cycle)

```bash
#!/bin/bash

FILE=./tmp.txt

# `p` 명령어: 
# - 출력을 suppress 하고 특정 라인만 출력
sed -n '3p' $FILE 
# - 첫줄과 마지막 줄 출력
sed -n '1p ; $p' $FILE 

# `s` 명령어
# - https://www.gnu.org/software/sed/manual/sed.html#The-_0022s_0022-Command
sed 's/second/2nd/' $FILE

# `-i` 옵션
# - in-place로 치환한다
# - `-i<SUFFIX>`로 백업을 만들 수 있다
sed -i.bak.$(date "+%Y%m%d") 's/second/2nd/' $FILE # tmp.txt.bak.20211027 백업 파일이 생성된다

# 여러 명령어 사용하기:
# - https://www.gnu.org/software/sed/manual/sed.html#Multiple-commands-syntax

# Commands for `sed` gurus
# - https://www.gnu.org/software/sed/manual/sed.html#Programming-Commands
```
