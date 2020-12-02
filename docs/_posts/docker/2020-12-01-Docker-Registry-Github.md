---
title: Docker Registry Github
author: aimpugn
date: 2020-12-01 22:49:00 +0900
categories: [docker.registry, github.registry]
tag: [docker, registry, github]
---

# [깃허브 컨테이너 레지스트리 시작](https://docs.github.com/en/free-pro-team@latest/packages/getting-started-with-github-container-registry/about-github-container-registry)

## [About GitHub Container Registry](https://docs.github.com/en/free-pro-team@latest/packages/getting-started-with-github-container-registry/about-github-container-registry)

### 개요

- 원할하게 도커 컨테이너 이미지를 호스트하고 관리할 수 있다
- 세밀한(fine-grained) 권한을 사용하여 패키지에 대한 접근 및 관리를 구성할 수 있다

### 가능한 깃허브 계정

| accounts                      |
| :---------------------------- |
| GitHub Free                   |
| GitHub Pro                    |
| GitHub Free for organizations |
| GitHub Team                   |
| GitHub Enterprise Cloud       |
| GitHub Enterprise Server 2.22 |
| GitHub One.                   |

### 불가능한 깃허브 계정

| accounts                                                       |
| :------------------------------------------------------------- |
| private repositories of Github with legacy per-repository plan |
| accounts using legacy per-repository plan                      |

### 컨테이너 레지스트리로 할 수 있는 것

- 저장소 대신 컨테이너 이미지 저장 가능
- 세밀한 권한 설정 및 저장소 권한 및 노출과 독릭적으로 관리
- 익명으로 퍼블릭 컨테이너 이미지 접근 가능

### 지원하는 이미지 형식

#### [Docker Image Manifest V2, Schema 2](https://docs.docker.com/registry/spec/manifest-v2-2/)

- [manifest list](https://docs.docker.com/registry/spec/manifest-v2-2/#manifest-list)

#### [Open Container Initiative (OCI) Specifications](https://github.com/opencontainers/image-spec)

- [OCI Image Index](https://github.com/opencontainers/image-spec/blob/master/image-index.md)

### 컨테이너 이미지 공개 여부와 접근 권한

- 관리자 권한 있으면, 이미지를 비공개/공개 설정 가능
- 공개(public) 되면 인증이나 sign-in 없이 cli로 익명으로 접근하여 pull 가능
- 조직과 저장소 레벨에 설정한 권한과 별개로 컨테이너 이미지에 대한 접근 권한 부여도 가능
- 유저 계정이 소유하고 퍼블리싱 한 컨테이너 이미지 &#8594; 누구에게든지 접근 권한 부여 가능
- 조직 계정이 소유하고 퍼블리싱 한 컨테이너 이미지 &#8594; 조직 내의 팀 또는 누구에게나 접근 권한 부여 가능

| Permission role | Access description                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Read            | Can download package.<br/>Can read package metadata.                                                                               |
| Write           | Can upload and download this package.<br/>Can read and write package metadata.                                                     |
| Admin           | Can upload, download, delete, and manage this package.<br/>Can read and write package metadata.<br/>Can grant package permissions. |

## [향상된 컨테이너 지원 활성화](https://docs.github.com/en/free-pro-team@latest/packages/getting-started-with-github-container-registry/enabling-improved-container-support)

### 개인 계정 위한 `GitHub Container Registry` 활성화

1. 우측 상단 프로필 클릭 &#8594; `Feature preview` 클릭
2. `Improved container support` 활성화

### 조직 계정 위한 `GitHub Container Registry` 활성화

## [`GitHub Container Registry` 핵심 개념](https://docs.github.com/en/free-pro-team@latest/packages/getting-started-with-github-container-registry/core-concepts-for-github-container-registry)

### `GitHub Container Registry`

- 도커 이미지 지원하는 컨테이너 레지스트리

### 패키지

- 패키지란?
  - 자급 자족적(self-contained)이고 재사용 가능한
  - 다른 사람들이 사용할 수 있도록 개발자가 한 공간에 코드와 메타데이터를 묶어둔 소프트웨어 조각
- 패키지 메타데이터는 다음 정보를 포함할 수 있다
  - 버전 넘버
  - 이름
  - 코드의 종속성
- 왜 사용하는가? 공통된 문제에 대한 솔루션으로 사용 및 배포
  - 프로젝트를 개발하고 테스트하기 위한 프레임워크
  - 코드 품질 향상 위한 linter
  - 애플리케이션을 강화하기 위한 산업 표준 머신 러팅 툴

### 컨테이너

- 어떤 플랫폼이든 소프트웨어를 확실하게 배포하기 위해 디자인 된 소프트웨어의 단위(unit)
- OS처럼 동일한 호스트의 커널에서 다양한 소프트웨어 패키지와 컴포넌트를 실행할 수 있는 고립된 가상 환경 또는 인스턴스로 작동
- 컨테이너는 Dockerfile, 컨테이너 틀라이언트 또는 런타임 프로그램 같은 컨테이너 이미지를 사용하여 생성된다

### 컨테이너 이미지

- 컨테이너에서 앱을 실행하기 위해 필요한 소프트웨어를 명시한 패키지 아카이브의 한 유형
- 컨테이너 이미지는 보통 앱의 코드, 라이브버리 그리고 런타임 인스트럭션을 포함한다
- 이미지가 배포되고 실행될 때마다 같은 이미지 세부 정보가 사용되도록 하기 위해서 이미지는 자동으로 버전 관리 되고 컨테이너 이미지가 컨테이너에 빌드되면 변경할 수 없다

### 도커 컨테이너

- 도커 플랫폼에 구축된 오픈 소스 컨테이너의 한 종류
- 도커의 원본 이미지 형식은 `OCI(Open Container Initiative) Image Specification`이 되었다

# [깃허브 컨테이너 레지스트리로 컨테이너 이미지 관리하기](https://docs.github.com/en/free-pro-team@latest/packages/managing-container-images-with-github-container-registry)

## [컨테이너 접근 제어 및 공개 여부 구성하기](https://docs.github.com/en/free-pro-team@latest/packages/managing-container-images-with-github-container-registry/configuring-access-control-and-visibility-for-container-images)

### 개인 계정 위한 컨테이너 이미지 접근 구성하기

1. Github &#8594; 우측 상단 프로필 &#8594; `Your profile` 클릭
2. 우측의 `Packages` 탭 클릭

## [도커 이미지 Push/Pull](https://docs.github.com/en/free-pro-team@latest/packages/managing-container-images-with-github-container-registry/pushing-and-pulling-docker-images)

### `GitHub Container Registry`에 인증

#### `PAT`와 권한

- `GitHub Actions`에서 인증하려면 **반드시** `Personal Access Token(PAT)`를 써야 한다. 현재 `GITHUB_TOKEN`는 권한이 없다.
- `PAT`를 `GitHub Actions`에서 사용하려면, [`PAT`에 대한 보안 베스트 프랙티스](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/security-hardening-for-github-actions#considering-cross-repository-access)를 따른다

#### 절차

1. 수행하려는 작업에 맞는 권한을 가진 `PAT` 생성. 조직에서 SSO를 요구하면, 토큰에 대하여 반드시 SSO 활성화. [`PAT`의 생성 방법](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)

> **WARNING** > `write package`를 선택하면, `PAT` 생성 시 `repo` 권한을 선택 해제한다
> `PAT`에 `repo` 권한을 추가하면, 저장소 내의 모든 협력자(collaborator)들에게 접근할 수 있다

| scopes           | 목적                                                    |
| ---------------- | ------------------------------------------------------- |
| `read package`   | 컨테이너 이미지 다운로드 및 메타데이터 읽기             |
| `write package`  | 컨테이너 이미지 다운로드/업로드 및 메타데이터 읽기/쓰기 |
| `delete package` | 컨테이너 이미지 삭제                                    |

2. `PAT`를 환경 변수로 저장하는 것을 추천

```s
$ export CR_PAT=YOUR_TOKEN
```

3. 사용하는 컨테이너의 cli 사용하여 `ghcr.io`의 `GitHub Container Registry` 서비스이 sign in

```s
$ echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
> Login Succeeded
```

```s
# ~/.bashrc 에 export CR_PAT=<PAT> 저장 후, source ~/.bashrc
$ echo $CR_PAT | docker login ghcr.io -u aimpugn --password-stdin
WARNING! Your password will be stored unencrypted in {$HOME}/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded

```

### 컨테이너 이미지 push

#### 최신 버전의 이미지 psuh

```s
$ docker push ghcr.io/{OWNER}/{IMAGE-NAME}:latest
```

#### 특정 버전의 이미지 psuh

```s
$ docker push ghcr.io/{OWNER}/{IMAGE-NAME}:2.5
```

#### 에러

하지만 push 테스트 결과 아래와 같은 에러 발생

```s
$ docker push ghcr.io/aimpugn/pgsb:1.1.0
The push refers to repository [ghcr.io/aimpugn/pgsb]
An image does not exist locally with the tag: ghcr.io/aimpugn/pgsb
```

images 목록을 보면 "ghcr.io/aimpugn/pgsb"라고 태그 되어 있는 이미지가 없다. 그럼 모두 이렇게 태그 해야 하는가?

```s
$ docker images
REPOSITORY                 TAG                 IMAGE ID            CREATED             SIZE
pgsb                       1.1.0               9dab490fcaf8        2 days ago          324MB
golang                     1.15.5-alpine3.12   1de1afaeaa9a        2 weeks ago         299MB
<none>                     <none>              1f1bfd282304        5 months ago        40.6MB
jaegertracing/all-in-one   latest              515cf0d4394e        5 months ago        48.3MB
hello-world                latest              bf756fb1ae65        11 months ago       13.3kB
jaegertracing/all-in-one   1.6                 200b59542ab6        2 years ago         40.6MB
qnib/httpcheck             latest              3df1ccc70b53        4 years ago         286MB
```

[stackoverflow 검색해보면](https://stackoverflow.com/a/48039003/8562273), 기본 레지스트리(docker hub)가 아닌 곳에 push 할 경우
`regitry name`과 `port`를 포함해야 한다
