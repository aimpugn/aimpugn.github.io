---
title: a bean of type '<T>' that could not be found.
author: aimpugn
date: 2021-03-03 20:00:00+0900
use_math: true
categories: [troubleshooting, java]
---

## 문제

- Spring boot 실행 시 아래와 같은 에러 발생

```java
Description:

Field userRepository in com.pgsb.api.security.JwtTokenFilter required a bean of type 'com.pgsb.core.user.UserRepository' that could not be found.

The injection point has the following annotations:
        - @org.springframework.beans.factory.annotation.Autowired(required=true)


Action:

Consider defining a bean of type 'com.pgsb.core.user.UserRepository' in your configuration.
```

- 하지만 package 이름 정확하고, PgsbApplication.java도 루트 패키지에 위치해 있고, 리파지토리도 존재한다.

## 원인

- repository와 연결되어야 할 datasource가 없어서 발생한 문제로 보인다
- datasource 및 postgres driver가 없어서 발생

## 해결

- `application.yml`에 아래 같은 설정 추가

```yml
spring:
  profiles: dev
  datasource:
    # dirver-class-name: org.postgresql.Driver URL로부터 추론하므로 굳이 명시 불필요
    url: jdbc:postgresql://localhost:5432/aimpugn01
    username: aimpugn
    password: aimpugn
```

- `build.gradle`에 postgres driver 의존성 추가

```gradle
dependencies {
    implementation group: 'org.postgresql', name: 'postgresql', version: '42.2.19'  // postgres driver
}
```
