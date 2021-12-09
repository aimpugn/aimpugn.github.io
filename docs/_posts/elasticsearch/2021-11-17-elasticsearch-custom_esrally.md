---
title: Custom esrally - Custom parameter sources
author: aimpugn
date: 2021-11-17 23:30:00+0900
use_math: true
categories: [elasticsearch, esrally]
---
- [개요](#개요)
  - [목적](#목적)
  - [`esrally` 설치](#esrally-설치)
    - [요구사항](#요구사항)
      - [python3.9 설치](#python39-설치)
      - [git 2.31 설치](#git-231-설치)
      - [jdk](#jdk)
      - [`pbzip2` 설치](#pbzip2-설치)
    - [`pip` 통한 `esrally` 설치](#pip-통한-esrally-설치)
  - [`esrally` 실행](#esrally-실행)
  - [Custom parameter sources](#custom-parameter-sources)

# 개요

- `elasticsearch` 사용하게 돼서 부하 테스트 툴을 찾던 중, 두 가지를 발견
  - `esrally`
    - 2016년 문서인 [Announcing Rally: Our benchmarking tool for Elasticsearch](https://www.elastic.co/blog/announcing-rally-benchmarking-for-elasticsearch)
    - [elastic/rally](https://github.com/elastic/rally) 깃헙
  - `Gatling`
    - [Load testing Elasticsearch with Gatling for fun and profit - May 4, 2021, Elastic Meetup](https://youtu.be/8bRBl29lEAA)
- 이 중에서 `esrally`가 공식 벤치마킹 프레임워크고 제공하는 보고서 지표도 좋아 보여서 사용
- 사용례는 아래와 같이 크게 두 가지로 나뉜다
  - `esrally` 통해서 특정 버전의 `elasticsearch` 배포판을 설치해서 벤치마킹하는 경우
  - 기존에 이미 `elasticsearch`가 구성되어 있고, 벤치마킹만 하는 경우

## 목적

- 기존 데이터에 무작위 쿼리 요청 보내는 [Custom parameter sources](https://esrally.readthedocs.io/en/stable/adding_tracks.html#custom-parameter-sources) 사용법 정리
- `Custom parameter sources` 위해서는 사용자 정의 트랙 리파지토리와 파이썬 스크립트 등이 필요

## [`esrally` 설치](https://esrally.readthedocs.io/en/stable/install.html)

### 요구사항

- python3.8 이상
- git 1.9 이상
- Elasticsearch 실행하는 jdk
  - 요즘 Elasticsearch에는 `{ES_HOME}/jdk/bin/java`에 번들 jdk가 포함되어 있다
  - 또한 참고로 `jvm.options`에서 `-Xms`, `-Xmx`를 코멘트 처리하면, jdk가 최신 버전일 경우 서버 메모리를 체크하여 적당한 힙 메모리를 할당한다

#### python3.9 설치

- CentOS8인데, python39를 지원하는 걸로 보인다

```shell
[root@vultr ~]# repoquery -i python39
Updating Subscription Management repositories.
Unable to read consumer identity

This system is not registered to Red Hat Subscription Management. You can use subscription-manager to register.

Repository rabbitmq_erlang is listed more than once in the configuration
Repository rabbitmq_erlang-source is listed more than once in the configuration
마지막 메타 데이터 만료 확인 : 0:00:14 전에 2021년 11월 18일 (목) 오전 12시 25분 54초.
이름         : python39
버전         : 3.9.6
릴리즈       : 2.module_el8.5.0+897+68c4c210
아키텍처     : x86_64
크기         : 33 k
소스         : python39-3.9.6-2.module_el8.5.0+897+68c4c210.src.rpm
리포지터리   : appstream
요약         : Version 3.9 of the Python interpreter
URL          : https://www.python.org/
특허         : Python
설명         : Python 3.9 is an accessible, high-level, dynamically typed, interpreted
             : programming language, designed with an emphasis on code readability.
             : It includes an extensive standard library, and has a vast ecosystem of
             : third-party libraries.
             :
             : The python39 package provides the "python3.9" executable: the reference
             : interpreter for the Python language, version 3.
             : The majority of its standard library is provided in the python39-libs package,
             : which should be installed automatically along with python39.
             : The remaining parts of the Python standard library are broken out into the
             : python39-tkinter and python39-test packages, which may need to be installed
             : separately.
             :
             : Documentation for Python is provided in the python39-docs package.
             :
             : Packages containing additional libraries for Python are generally named with
             : the "python39-" prefix.
             :
             : For the unversioned "python" executable, see manual page "unversioned-python".
```

- `yum` 통해서 설치

```
yum install python39 python39-pip python39-devel
```

- 설치 후 `update-alternatives`로 현재 사용중인 python의 버전 확인

```shell
[root@vultr ~]# update-alternatives --list | grep python
python3                 manual  /usr/bin/python3.9
python                  manual  /usr/bin/python3.9
```

- 현재 `python3`, `python` 커맨드가 등록되어 있는데, 버전이 맞지 않다면 쓸 명령어에 대한 설정 변경

```shell
[root@vultr ~]# update-alternatives --config python3

3 개의 프로그램이 'python3'를 제공합니다.

  선택    명령
-----------------------------------------------
*  1           /usr/bin/python3.6
   2           /usr/local/bin/python3.7
 + 3           /usr/bin/python3.9

현재 선택[+]을 유지하려면 엔터키를 누르고, 아니면 선택 번호를 입력하십시오:3
```

#### git 2.31 설치

- `gitlab`을 설치하면서 [`gitaly` 통해서 설치](https://docs.gitlab.com/ee/install/installation.html#git)했었음
- 또는 [Install Git 2.30.1 in Ubuntu 20.04 / Linux Mint / CentOS & Fedora](https://www.tipsonunix.com/2021/02/install-git-2-30-1-in-ubuntu-20-04-linux-mint-centos/) 참고

#### jdk

- 번들 jdk를 사용하는 게 elasticsearch와 java 버전 관리 등에 용이하고, 최신버전이어야 `-Xms`, `-Xmx`를 하드웨어 스펙에 맞게 자동으로 설정
- `esrally` 실행할 계정의 `~/.bashrc`에 아래 코드 추가. `pip`를 고려해 `.local/bin`도 미리 같이 선언해 둔다

```bashrc
export JAVA_HOME=/usr/share/elasticsearch/jdk/
PATH="$JAVA_HOME/bin/:$JAVA_HOME:$HOME/.local/bin:$HOME/bin:$PATH"
export PATH
```

#### [`pbzip2` 설치](https://esrally.readthedocs.io/en/stable/install.html#pbzip2)

```shell
yum install pbzip2
```

### `pip` 통한 `esrally` 설치

- `pip` 설치 및 업그레이드

```shell
[aimpugn@vultr ~]$ python3 -m pip install --user --upgrade pip
```

- `esrally` 설치. `~/.local/bin`을 보면 설치되어 있음 확인 가능

```shell
[aimpugn@vultr ~]$ python3 -m pip install --user esrally
[aimpugn@vultr ~]$ $ ll ~/.local/bin/
합계 64
-rwxrwxr-x. 1 aimpugn aimpugn 967 11월 17 01:38 cpuinfo
-rwxrwxr-x. 1 aimpugn aimpugn 212 11월 17 01:38 esrally
-rwxrwxr-x. 1 aimpugn aimpugn 213 11월 17 01:38 esrallyd
-rwxrwxr-x. 1 aimpugn aimpugn 213 11월 17 01:38 jsonschema
-rwxrwxr-x. 1 aimpugn aimpugn 244 11월 17 01:38 normalizer
-rwxrwxr-x. 1 aimpugn aimpugn 220 11월 17 01:36 pip
-rwxrwxr-x. 1 aimpugn aimpugn 220 11월 17 01:36 pip3
-rwxrwxr-x. 1 aimpugn aimpugn 220 11월 17 01:36 pip3.9
-rwxrwxr-x. 1 aimpugn aimpugn 212 11월 17 01:38 pyrsa-decrypt
-rwxrwxr-x. 1 aimpugn aimpugn 212 11월 17 01:38 pyrsa-encrypt
-rwxrwxr-x. 1 aimpugn aimpugn 210 11월 17 01:38 pyrsa-keygen
-rwxrwxr-x. 1 aimpugn aimpugn 233 11월 17 01:38 pyrsa-priv2pub
-rwxrwxr-x. 1 aimpugn aimpugn 206 11월 17 01:38 pyrsa-sign
-rwxrwxr-x. 1 aimpugn aimpugn 210 11월 17 01:38 pyrsa-verify
-rwxrwxr-x. 1 aimpugn aimpugn 209 11월 17 01:38 tabulate
-rwxrwxr-x. 1 aimpugn aimpugn 948 11월 17 01:38 yappi
```

- 임의의 디렉토리에 가상 환경 설정

```shell
[aimpugn@vultr esrally]$ python3 -m venv .venv
```

- 가상 환경 활성화

```shell
[aimpugn@vultr ~]$ . ~/project_py/esrally/.venv/bin/activate
(.venv) [aimpugn@vultr ~]$
```

- `esrally` 버전 체크

```shell
(.venv) [aimpugn@vultr ~]$ esrally --version
esrally 2.3.0
```

## `esrally` 실행

## [Custom parameter sources](https://esrally.readthedocs.io/en/stable/adding_tracks.html#custom-parameter-sources)
