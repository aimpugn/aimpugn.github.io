---
title: toy
author: aimpugn
date: 2021-02-19 00:00:00+0900
use_math: true
categories: [toy]
---

> 주저리 주저리
> 프로젝트라고 하기도 뭐하고, 알고리즘과 이론 말고 뭐라도 만들어봐야지...
>
> - 뭔가 시각화 하는 걸 하고 싶다!
> - 자연어 처리 같은, 뭔가 그런 것도 해보고 싶고.
> - 이미지 분석 같은 것도

# 자바 15 설치

## 다운로드

- <https://jdk.java.net/15/>

## 설치

### 압축 해제

> C:\java\jdk-15.0.2

### 환경 변수 설정

- 윈도우 설정 > 시스템 > 고급 설정 > 환경 변수
- JAVA_HOME을 `C:\java\jdk-15.0.2`로 설정
- Path에 `%JAVA_HOME%\bin` 추가

### 버전 확인

```
java --version
openjdk 15.0.2 2021-01-19
OpenJDK Runtime Environment (build 15.0.2+7-27)
OpenJDK 64-Bit Server VM (build 15.0.2+7-27, mixed mode, sharing)
```

# vscode로 spring boot initialize

## gradle

```gradle
plugins {
    id 'org.springframework.boot' version '2.4.2-SNAPSHOT'
    id 'io.spring.dependency-management' version '1.0.10.RELEASE'
    id 'java'
    id 'war'
}

group = 'com.pgsb'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '15'

configurations {
    compileOnly {
        extendsFrom annotationProcessor
    }
}

repositories {
    mavenCentral()
    maven { url 'https://repo.spring.io/milestone' }
    maven { url 'https://repo.spring.io/snapshot' }
}

dependencies {
    annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
    annotationProcessor 'org.projectlombok:lombok'
    
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
    
    // spring data rest
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-data-rest'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    
    providedRuntime 'org.springframework.boot:spring-boot-starter-tomcat'

    runtimeOnly 'com.h2database:h2'
    
    testImplementation 'io.projectreactor:reactor-test'
    testImplementation('org.springframework.boot:spring-boot-starter-test') {
        exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
    }
}

test {
    useJUnitPlatform()
}

```

## settings.gradle

```gradle
pluginManagement {
    repositories {
        maven { url 'https://repo.spring.io/milestone' }
        maven { url 'https://repo.spring.io/snapshot' }
        gradlePluginPortal()
    }
    resolutionStrategy {
        eachPlugin {
            if (requested.id.id == 'org.springframework.boot') {
                useModule("org.springframework.boot:spring-boot-gradle-plugin:${requested.version}")
            }
        }
    }
}
rootProject.name = 'pgsb'
```

## vscode setting json

```json
{
    "java": {
        "home": "C:\\java\\jdk-15.0.2\\",
        "configuration": [
            
        ],
        "refactor": {
            "renameFromFileExplorer": "autoApply"
        },
        "format": {
            "settings": "https://raw.githubusercontent.com/google/styleguide/gh-pages/eclipse-java-google-style.xml",
            "comments": {
                "enabled": true
            },
            "onType": {
                "enabled": true
            }
        }
    }
}
```

## db는?

- 도커로 돌려 보자. 안되면 postgre라도 설치하고.
