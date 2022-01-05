---
title: ClickHouse와 Spring Data JPA
author: aimpugn
date: 2022-01-05 23:00:00 +0900
use_math: true
categories: [spring, clickhouse, jpa]
---

- [ClickHouse와 Spring Data JPA](#clickhouse와-spring-data-jpa)
  - [개요](#개요)
    - [ClickHouse?](#clickhouse)
    - [Spring Data JPA?](#spring-data-jpa)
  - [ClickHouse 실행하기](#clickhouse-실행하기)
    - [`clickhouse-server`](#clickhouse-server)
    - [`clickhouse-client`](#clickhouse-client)
    - [테스트용 DB와 TABLE](#테스트용-db와-table)
  - [JPA DataSource 구성](#jpa-datasource-구성)
    - [디렉토리 구조](#디렉토리-구조)
    - [`build.gradle`](#buildgradle)
    - [`ClickhouseDataSourceConfig.java`](#clickhousedatasourceconfigjava)
    - [JPA Entity와 `hibernate-types`](#jpa-entity와-hibernate-types)
      - [`package-info.java`](#package-infojava)
      - [`TestTableEntity`](#testtableentity)
      - [`TestTableRepository`](#testtablerepository)
    - [테스트1](#테스트1)
    - [`@MappedSuperclass` 통한 상속 구조](#mappedsuperclass-통한-상속-구조)
      - [`TestTableParentEntity`](#testtableparententity)
      - [`TestTableChildEntity`](#testtablechildentity)
      - [`TestTableSubRepository`](#testtablesubrepository)
      - [테스트2](#테스트2)

# ClickHouse와 Spring Data JPA

## 개요

### [ClickHouse?](https://clickhouse.com/docs/en/)

- [컬럼지향(column-oriented)](https://ko.wikipedia.org/wiki/%EC%BB%AC%EB%9F%BC_%EC%A7%80%ED%96%A5_DBMS) 오픈소스 [OLAP](https://ko.wikipedia.org/wiki/%EC%98%A8%EB%9D%BC%EC%9D%B8_%EB%B6%84%EC%84%9D_%EC%B2%98%EB%A6%AC)
- 쿼리 처리에서 대부분 최소 [100배 이상 더 빠르다](https://clickhouse.com/docs/en/#why-column-oriented-databases-work-better-in-the-olap-scenario)고 한다

### [Spring Data JPA?](https://spring.io/projects/spring-data-jpa)

- JPA 기반 repository 구현을 쉽게 도와주는 모듈
- Data Access Layer 구현이 번잡스럽고 boilerplate 코드가 많아서 이를 줄이기 위함
- 하지만... 구성을 배우는 것 자체가 오히려 고될 수 있다...

## ClickHouse 실행하기

- 서버 띄우고 client로 접근만 하면 돼서 docker로 실행

### [`clickhouse-server`](https://hub.docker.com/r/yandex/clickhouse-server)

```shell
docker run -p 8123:8123 -p 9000:9000 -d --name some-clickhouse-server --ulimit nofile=262144:262144 --volume=C:\PATH\TO\ANY\WHERE:/var/lib/clickhouse yandex/clickhouse-server 
```

- `8123` 포트: [HTTP 인터페이스](https://clickhouse.tech/docs/en/interfaces/http/) 위한 포트
- `9000` 포트: [`clickhouse-client`](https://clickhouse.tech/docs/en/interfaces/tcp/) 위한 포트

### `clickhouse-client`

```shell
docker run -it --rm --link some-clickhouse-server:clickhouse-server yandex/clickhouse-client --host clickhouse-server
```

### 테스트용 DB와 TABLE

```sql
CREATE DATABASE test_db ENGINE = Atomic COMMENT 'test clickhouse db';

CREATE TABLE IF NOT EXISTS test_db.test_table
(
    `c_int8` Int8,
    `c_int16` Int16,
    `c_int32` Int32,
    `c_int64` Int64,
    `c_int128` Int128,
    `c_int256` Int256,
    `c_float32` Float32,
    `c_float64` Float64,
    `c_decimal32_9` Decimal32(9),
    `c_decimal64_18` Decimal64(18),
    `c_decimal128_38` Decimal128(38),
    `c_decimal256_76` Decimal256(76),
    `c_string` String,
    `c_fixedstring` FixedString(2),
    `c_date` Date,
    `c_date32` Date32,
    `c_datetime` DateTime('Asia/Seoul'),
    `c_datetime64` DateTime64(3, 'Asia/Seoul'),
    `c_array_int8` Array(Int8),
    `c_array_int16` Array(Int16),
    `c_array_string` Array(String),
    `c_nested` Nested(nested_c_int32 Int32, nested_c_array_int16 Array(Int16), nested_c_array_string Array(String)),
    `c_tuple` Tuple(Nullable(String), Nullable(String))
)
ENGINE = MergeTree()
PRIMARY KEY c_int8;

INSERT INTO test_db.test_table (c_int8, c_int16, c_int32, c_int64, c_int128, c_int256, c_float32, c_float64,
                                c_decimal32_9, c_decimal64_18, c_decimal128_38, c_decimal256_76, c_string,
                                c_fixedstring, c_date, c_date32, c_datetime, c_datetime64, c_array_int8, c_array_int16,
                                c_array_string, c_nested.nested_c_int32, c_nested.nested_c_array_int16,
                                c_nested.nested_c_array_string, c_tuple)
VALUES (1, 32767, 2147483647, 9223372036854775807, 170141183460469231731687303715884105727,
        57896044618658097711785492504343953926634992332820282019728792003956564819967, 0.09999999999999998,
        0.09999999999999998, 0.9999, 0.999999999, 0.99999999999999, 0.99999999999999999999, 'string test', 'fs',
        1546300800, 4102444800, 1546300800, 1546300800000, array(1, 2, 3), array(100, 1000, 10000),
        array('test', 'string', 'array'), null, null, null, tuple('key1', 'value1'));
```

## JPA DataSource 구성

- [ClickHouse数据库之JPA篇](https://bibichuan.github.io/posts/ac37a5da.html) 참고

### 디렉토리 구조

```shell
main.java.com.learn.spring.learnspring
    .config
      ㄴClickhouseDataSourceConfig
    .entities
        .clickhouse
          ㄴpackage-info.java
          ㄴTestTableChildEntity
          ㄴTestTableEntity
          ㄴTestTableParentEntity
    .repository
        .clickhouse
          ㄴTestTableRepository
          ㄴTestTableSubRepository
test.java.com.learn.spring.learnspring
    .repository.clickhouse
      ㄴTestTableRepositoryTest
```

### `build.gradle`

```groovy
plugins {
 id 'org.springframework.boot' version '2.6.2'
 id "io.spring.dependency-management" version "1.0.11.RELEASE"
 id 'java'
 id 'idea'
}

group = 'com.learn.spring'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '1.15'

configurations {
 developmentOnly
 runtimeClasspath {
  extendsFrom developmentOnly
 }
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
 // postgresql jdbc 사용하기 위한 의존성
 implementation group: 'org.postgresql', name: 'postgresql', version: '42.2.9'
 // groovy 템플릿
 implementation group: 'org.codehaus.groovy', name: 'groovy-all', version: '2.5.9'
 // 오브젝트의 값을 JSON으로 바인딩
 implementation group: 'com.fasterxml.jackson.core', name: 'jackson-databind', version: '2.13.1'
 // @JsonFormat 어노테이션 사용해서 Java8 버전의 date와 time 클래스를 JSON으로 변환하는 것을 도와준다
 implementation group: 'com.fasterxml.jackson.datatype', name: 'jackson-datatype-jsr310', version: '2.13.1'
 // https://mvnrepository.com/artifact/com.fasterxml.jackson.module/jackson-module-jaxb-annotations
 implementation group: 'com.fasterxml.jackson.module', name: 'jackson-module-jaxb-annotations', version: '2.13.1'

 compileOnly 'org.projectlombok:lombok'

 // implementation 'org.springframework.boot:spring-boot-starter-data-jdbc'
 implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
 implementation 'org.springframework.boot:spring-boot-starter-security'
 implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
 implementation 'org.springframework.boot:spring-boot-starter-web'
 implementation 'org.springframework.boot:spring-boot-starter-web-services'
 implementation 'org.springframework.boot:spring-boot-starter-webflux'
 implementation 'org.springframework.session:spring-session-core'
 implementation 'com.squareup.okhttp3:okhttp:4.9.3'  // RestTempalte 대신

 // https://mvnrepository.com/artifact/ru.yandex.clickhouse/clickhouse-jdbc
 implementation group: 'ru.yandex.clickhouse', name: 'clickhouse-jdbc', version: '0.3.2'

 // https://mvnrepository.com/artifact/com.vladmihalcea/hibernate-types-55
 implementation group: 'com.vladmihalcea', name: 'hibernate-types-55', version: '2.14.0'

 developmentOnly 'org.springframework.boot:spring-boot-devtools'

 annotationProcessor 'org.springframework.boot:spring-boot-configuration-processor'
 annotationProcessor 'org.projectlombok:lombok'

 testImplementation('org.springframework.boot:spring-boot-starter-test') {
  exclude group: 'org.junit.vintage', module: 'junit-vintage-engine'
 }
 testImplementation 'io.projectreactor:reactor-test'
 testImplementation 'org.springframework.security:spring-security-test'
}

test {
 useJUnitPlatform()
}
```

### `ClickhouseDataSourceConfig.java`

```java
package com.learn.spring.learnspring.config;

import com.clickhouse.client.config.ClickHouseClientOption;
import com.clickhouse.jdbc.ClickHouseDataSource;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateProperties;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.Map;
import java.util.Properties;

@Slf4j
@Configuration
@EnableJpaRepositories(
        entityManagerFactoryRef = "clickhouseEntityManager",
        transactionManagerRef = "clickhouseTransactionManager",
        basePackages = {
                "com.learn.spring.learnspring.entities.clickhouse",
                "com.learn.spring.learnspring.repository.clickhouse"
        }
)
@RequiredArgsConstructor
public class ClickhouseDataSourceConfig {
    @Value("${spring.datasource.clickhouse1.driver-class-name}")
    private String driverClassName;
    @Value("${spring.datasource.clickhouse1.url}")
    private String url;
    @Value("${spring.datasource.clickhouse1.database}")
    private String database;
    @Value("${spring.datasource.clickhouse1.username}")
    private String username;
    @Value("${spring.datasource.clickhouse1.password}")
    private String password;
    private final JpaProperties jpaProperties;
    private final HibernateProperties hibernateProperties;
    /**
     * https://github.com/ClickHouse/clickhouse-jdbc/blob/d6bcbe412d4c7310bba7dc4b0334140b04614004/clickhouse-jdbc/src/test/java/com/clickhouse/jdbc/JdbcIntegrationTest.java#L106
     * @return
     * @throws SQLException
     */
    public DataSource getClickhouseDataSource() throws SQLException {
        Properties properties = new Properties();
        properties.setProperty(ClickHouseClientOption.DATABASE.getKey(), database);
        properties.setProperty(ClickHouseClientOption.CLIENT_NAME.getKey(), username);
        properties.setProperty("user", username);
        properties.setProperty("password", password);

        return new ClickHouseDataSource(url, properties);
    }

    @Bean(name = "clickhouseDataSource")
    public DataSource clickhouseDataSource() throws SQLException {
        HikariConfig hikariConfig = new HikariConfig();
        hikariConfig.setDataSource(getClickhouseDataSource());
        hikariConfig.setPoolName("clickhouseDataSourcePool");
        hikariConfig.setDriverClassName(driverClassName);

        return new HikariDataSource(hikariConfig);
    }

    @Bean(name = "clickhouseEntityManager")
    public LocalContainerEntityManagerFactoryBean clickhouseEntityManager(EntityManagerFactoryBuilder builder) throws SQLException {

        return builder
                .dataSource(clickhouseDataSource())
                .properties(getVendorProperties())
                .packages("com.learn.spring.learnspring.entities.clickhouse")
                .persistenceUnit("clickhouseEntityManager")
                .build();
    }

    private Map<String, Object> getVendorProperties() {
        Map<String,String> properties=jpaProperties.getProperties();
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        return hibernateProperties.determineHibernateProperties(
                properties, new HibernateSettings());
    }

    @Bean(name = "clickhouseTransactionManager")
    public PlatformTransactionManager clickhouseTransactionManager(LocalContainerEntityManagerFactoryBean clickhouseEntityManager) {
        JpaTransactionManager txManager = new JpaTransactionManager();
        txManager.setEntityManagerFactory(clickhouseEntityManager.getObject());

        return txManager;
    }
}
```

- `ClickHouseDataSource`
  - [`clickhouse-jdbc`](https://github.com/ClickHouse/clickhouse-jdbc) 라이브러리에서 제공하는 `DataSource` 인터페이스 구현 클래스
  - `DataSource`? 물리적인 데이터 소스로의 연결을 제공하는 팩토리. `Connection` 인터페이스 구현한 `ClickHouseConnectionImpl` 인스턴스 반환
- `HikariDataSource`
  - `Connection`을 무한정 추가할 수 없으므로, 일정한 데이터 소스 연결을 pooling하기 위한 데이터 소스
- `LocalContainerEntityManagerFactoryBean`
  - `EntityManagerFactory`를 생성해주는 `FactoryBean` 인터페이스의 구현 클래스
  - [`LocalContainerEntityManagerFactoryBean`과 `LocalEntityManagerFactoryBean`의 차이?](https://stackoverflow.com/q/6156832/8562273)
    - `LocalContainerEntityManagerFactoryBean`는 컨테이너가 관리하는 팩토리 빈
    - `LocalEntityManagerFactoryBean`는 application, 즉 개발자의 코드가 관리하는 팩토리 빈
    - `EntityManagerFactory` 생성 방식이 유일한 차이점이라고 한다
- [`EntityManagerFactoryBuilder`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/orm/jpa/EntityManagerFactoryBuilder.html)
  - 하나 이상의 `LocalContainerEntityManagerFactoryBean`을 [fluent builder pattern](https://dev.to/siy/simple-implementation-of-fluent-builder-safe-alternative-to-traditional-builder-3m1d) 방식으로 생성할 수 있도록 해주는 빌더
  - `dataSource(${DATASOURCE})` 호출하면 `EntityManagerFactoryBuilder.Builder` 인스턴스 반환하고, 빌드해 나간다
- `getVendorProperties()`
  - vendor, 이 경우 clickhouse에서 사용할 속성을 전달한다
  - clickhouse의 경우 hibernate 방언이 별도로 없어서, `org.hibernate.dialect.MySQLDialect` 사용
- `PlatformTransactionManager`
  - 스프링의 피할 수 없는(imperative) 트랜잭션 인프라스트럭처의 중심 인터페이스. 현재 유효한 트랜잭션 가져오기, 트랜잭션 커밋/롤백 메서드를 정의하고 있다.
  - 실제로 `TransactionTemplate` 인스턴스가 트랜잭션을 생성, 커밋, 롤백하는 것을 도와주는 클래스
    - [`TransactionTemplate`?](https://www.baeldung.com/spring-programmatic-transaction-management#transaction-template) 프로그램적인 [트랜잭션 구별(transaction demarcation)](https://stackoverflow.com/a/29123207/8562273)과 예외 처리를 간소화해주는 템플릿 클래스

정리를 하자면,

1. 실제로 클릭하우스 데이터 소스(데이터베이스) 연결을 담당할 인스턴스 생성하고
2. 해당 데이터 소스 연결을 관리(풀링)하기 위핸 커넥션 풀 인스턴스를 생성하고
3. 실제로 연결 인스턴스를 반환해주는 엔터티 관리 팩토리를 생성하는 팩토리 빈을 생성하고
4. 트랜잭션을 관리해줄 트랜잭션 관리자를 생성해준다

이때, `1`, `2`, `3`이 데이터베이스 연결과 직접적으로 관련되어 있고, 그 후 `4`에서 트랜잭션 관리 위한 인스턴스를 생성하게 된다

참고로 `@Value` 어노테이션의 경우, [빈 메서드에 `@ConfigurationProperties` 어노테이션](https://www.baeldung.com/configuration-properties-in-spring-boot#bean) 통해 필요한 `Properties` 인스턴스 생성해서 반환하도록 하여 대체할 수도 있다.

### JPA Entity와 `hibernate-types`

- 클릭하우스의 경우 기존 RDBMS와 달리 array 같은 타입들이 있다. 이 경우 보통 테이블이 분리되는 `@OneToMany`나 `@ManyToOne` 관계는 아니고, `@ElementCollection` 같은 어노테이션을 사용해야 한다
- 그런데 보다 유연하고 다양한 타입을 지원하는 [`hibernate-types`](https://github.com/vladmihalcea/hibernate-types)가 있어서 이를 통해 JPA 결과를 Entity로 맵핑해봤고, 실제로 편했다.

#### `package-info.java`

- [The package-info.java File](https://www.baeldung.com/java-package-info)
  - 패키지 레벨의 문서
  - 패키지 레벨의 어노테이션 정의
- 여기서는 패키지 레벨에서 사용하기 위한 `@Type`을 정의하는 데 사용

```java
@TypeDefs({
        @TypeDef(
                name = "json", typeClass = JsonType.class
        ),
        @TypeDef(
                name = "list-array", typeClass = ListArrayType.class
        )
})

package com.learn.spring.learnspring.entities.clickhouse;
import com.vladmihalcea.hibernate.type.array.ListArrayType;
import com.vladmihalcea.hibernate.type.json.JsonStringType;
import com.vladmihalcea.hibernate.type.json.JsonType;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;
```

#### `TestTableEntity`

```java
package com.learn.spring.learnspring.entities.clickhouse;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "test_table", schema = "test_db")
public class TestTableEntity implements Serializable {
    @Basic
    @Id
    @Column(name = "c_int8", columnDefinition = "tinyint")
    private Integer id; // cInt8에서 id로 이름을 바꾸고, TestTableRepository에서도 바꾸니 정상 실행
    @Basic
    @Column(name = "c_int16", columnDefinition = "int16")
    private Integer cInt16;
    @Basic
    @Column(name = "c_int32", columnDefinition = "int32")
    private Integer cInt32;
    @Basic
    @Column(name = "c_int64", columnDefinition = "int64")
    private Long cInt64;
    @Basic
    @Column(name = "c_int128", columnDefinition = "int128")
    private BigDecimal cInt128;
    @Basic
    @Column(name = "c_int256", columnDefinition = "int256")
    private BigDecimal cInt256;
    @Basic
    @Column(name = "c_float32", columnDefinition = "float32")
    private Float cFloat32;
    @Basic
    @Column(name = "c_float64", columnDefinition = "float64")
    private Float cFloat64;
    @Basic
    @Column(name = "c_decimal32_9", columnDefinition = "Decimal(9,9)")
    private BigDecimal cDecimal329;
    @Basic
    @Column(name = "c_decimal64_18", columnDefinition = "Decimal(18,18)")
    private BigDecimal cDecimal6418;
    @Basic
    @Column(name = "c_decimal128_38", columnDefinition = "Decimal(38,38)")
    private BigDecimal cDecimal12838;
    @Basic
    @Column(name = "c_decimal256_76", columnDefinition = "Decimal(76,76)")
    private BigDecimal cDecimal25676;
    @Basic
    @Column(name = "c_string", columnDefinition = "string")
    private String cString;
    @Basic
    @Column(name = "c_fixedstring", columnDefinition = "fixedstring")
    private String cFixedstring;
    @Basic
    @Column(name = "c_date", columnDefinition = "date")
    private LocalDateTime cDate;
    @Basic
    @Column(name = "c_date32", columnDefinition = "date32")
    private LocalDateTime cDate32;
    @Basic
    @Column(name = "c_datetime", columnDefinition = "datetime")
    private LocalDateTime cDatetime;
    @Basic
    @Column(name = "c_datetime64", columnDefinition = "datetime64")
    private LocalDateTime cDatetime64;
    @Basic
    @Column(name = "c_array_int8", columnDefinition = "array")
    @Type(type = "json")
    private List<Short> cArrayInt8;
    @Basic
    @Column(name = "c_array_int16", columnDefinition = "array")
    @Type(type = "json")
    private List<Integer> cArrayInt16;
    @Basic
    @Column(name = "c_array_string", columnDefinition = "array")
    @Type(type = "list-array")
    private List<String> cArrayString;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TestTableEntity that = (TestTableEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
```

- `columnDefinition`은 일일이 지정하지 않아도 되는데, 만약 `application.yml`에서 `spring.jpa.hibernate.ddl-auto: validate` 설정을 한다면 타입 검증을 빡쎄게 하기 때문에 클릭하우스에서 실제로 어떤 타입인지를 명시해줘야 한다

#### `TestTableRepository`

```java
package com.learn.spring.learnspring.repository.clickhouse;

import com.learn.spring.learnspring.entities.clickhouse.TestTableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestTableRepository extends JpaRepository<TestTableEntity, Short> {
    List<TestTableEntity> findById(Integer id);

}
```

### 테스트1

```java
package com.learn.spring.learnspring.repository.clickhouse;

import com.learn.spring.learnspring.entities.clickhouse.TestTableEntity;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles({"dev"})
class TestTableRepositoryTest {
    @Autowired
    private TestTableRepository testTableRepository;

    @Test
    @DisplayName("Retrieve TestDataEntity from ClickHouse Using JPA")
    void TestTableEntity_Returns_TestTableEntity() {
        List<TestTableEntity> results = testTableRepository.findById(1);
        ArrayList<String> expected = new ArrayList<>();
        expected.add("test");
        expected.add("string");
        expected.add("array");
        Assertions.assertEquals(expected, results.get(0).getCArrayString());
        System.out.println(results.get(0).getCInt256());
    }
}
```

위와 같이 큰 수를 출력해보면, 아래와 같이 `57896044618658097711785492504343953926634992332820282019728792003956564819967`가 출력된다

```
2022-01-06 00:29:33.546  INFO  --- [           main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]
2022-01-06 00:29:33.567  INFO  --- [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'clickhouseEntityManager'
2022-01-06 00:29:35.367  INFO  --- [           main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with [org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@317fa5dd, org.springframework.security.web.context.SecurityContextPersistenceFilter@7ce760af, org.springframework.security.web.header.HeaderWriterFilter@1e160a9e, org.springframework.web.filter.CorsFilter@477906cf, org.springframework.security.web.csrf.CsrfFilter@346e5cc, org.springframework.security.web.authentication.logout.LogoutFilter@c31419f, org.springframework.security.web.savedrequest.RequestCacheAwareFilter@6686507b, org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@72c5064f, org.springframework.security.web.authentication.AnonymousAuthenticationFilter@65234a9, org.springframework.security.web.session.SessionManagementFilter@5e6bbe63, org.springframework.security.web.access.ExceptionTranslationFilter@1a7437d8]
2022-01-06 00:29:38.925  INFO  --- [           main] c.l.s.l.r.c.TestTableRepositoryTest      : Started TestTableRepositoryTest in 12.463 seconds (JVM running for 15.362)
57896044618658097711785492504343953926634992332820282019728792003956564819967
2022-01-06 00:29:39.948  INFO  --- [ionShutdownHook] j.LocalContainerEntityManagerFactoryBean : Closing JPA EntityManagerFactory for persistence unit 'clickhouseEntityManager'
2022-01-06 00:29:39.950  INFO  --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : clickhouseDataSourcePool - Shutdown initiated...
2022-01-06 00:29:39.959  INFO  --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : clickhouseDataSourcePool - Shutdown completed.
```

### `@MappedSuperclass` 통한 상속 구조

#### `TestTableParentEntity`

```java
package com.learn.spring.learnspring.entities.clickhouse;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@MappedSuperclass
@EqualsAndHashCode
public class TestTableParentEntity implements Serializable {
    @Basic
    @Column(name = "c_int16", columnDefinition = "int16")
    private Integer cInt16;
    @Basic
    @Column(name = "c_int32", columnDefinition = "int32")
    private Integer cInt32;
    @Basic
    @Column(name = "c_int64", columnDefinition = "int64")
    private Long cInt64;
    @Basic
    @Column(name = "c_int128", columnDefinition = "int128")
    private BigDecimal cInt128;
    @Basic
    @Column(name = "c_int256", columnDefinition = "int256")
    private BigDecimal cInt256;
    @Basic
    @Column(name = "c_float32", columnDefinition = "float32")
    private Float cFloat32;
    @Basic
    @Column(name = "c_float64", columnDefinition = "float64")
    private Float cFloat64;
    @Basic
    @Column(name = "c_decimal32_9", columnDefinition = "Decimal(9,9)")
    private BigDecimal cDecimal329;
    @Basic
    @Column(name = "c_decimal64_18", columnDefinition = "Decimal(18,18)")
    private BigDecimal cDecimal6418;
    @Basic
    @Column(name = "c_decimal128_38", columnDefinition = "Decimal(38,38)")
    private BigDecimal cDecimal12838;
    @Basic
    @Column(name = "c_decimal256_76", columnDefinition = "Decimal(76,76)")
    private BigDecimal cDecimal25676;
    @Basic
    @Column(name = "c_string", columnDefinition = "string")
    private String cString;
    @Basic
    @Column(name = "c_fixedstring", columnDefinition = "fixedstring")
    private String cFixedstring;
    @Basic
    @Column(name = "c_date", columnDefinition = "date")
    private LocalDateTime cDate;
    @Basic
    @Column(name = "c_date32", columnDefinition = "date32")
    private LocalDateTime cDate32;
    @Basic
    @Column(name = "c_datetime", columnDefinition = "datetime")
    private LocalDateTime cDatetime;
    @Basic
    @Column(name = "c_datetime64", columnDefinition = "datetime64")
    private LocalDateTime cDatetime64;
    @Basic
    @Column(name = "c_array_int8", columnDefinition = "array")
    @Type(type = "json")
    private List<Short> cArrayInt8;
    @Basic
    @Column(name = "c_array_int16", columnDefinition = "array")
    @Type(type = "json")
    private List<Integer> cArrayInt16;
    @Basic
    @Column(name = "c_array_string", columnDefinition = "array")
    @Type(type = "list-array")
    private List<String> cArrayString;
}
```

- `@Entity` 및 `@Table` 어노테이션 제거하고, 실제로 사용할 하위 엔터티에 추가해준다
- `@MappedSuperclass` 어노테이션 사용해서 연관관계 맵핑이 아닌 단일 테이블을 상속 구조로 변경함을 나타낸다
  - 참고로 만약 테이블이 여러 개라면, [`@Inheritance(strategy = InheritanceType.SINGLE_TABLE)`](https://www.baeldung.com/hibernate-inheritance#single-table) 같은 어노테이션 사용해야 한다

#### `TestTableChildEntity`

```java
package com.learn.spring.learnspring.entities.clickhouse;

import javax.persistence.*;

@Entity
@Table(name = "test_table", schema = "test_db") // database를 test_db로 지정했기 때문에 사실 필요 없다
public class TestTableChildEntity extends TestTableParentEntity{
    @Basic
    @Id
    @Column(name = "c_int8", columnDefinition = "tinyint")
    private Integer id; // cInt8에서 id로 이름을 바꾸고, TestTableRepository에서도 바꾸니 정상 실행
}
```

#### `TestTableSubRepository`

```java
package com.learn.spring.learnspring.repository.clickhouse;

import com.learn.spring.learnspring.entities.clickhouse.TestTableChildEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestTableSubRepository extends JpaRepository<TestTableChildEntity, Short> {
    List<TestTableChildEntity> findById(Integer id);

}
```

- 참고로 만약 데이터베이스가 달라서 Repository별로 데이터소스를 별도로 설정하고 싶다면, `ClickhouseDataSourceConfig`에서 해당 Repository용 데이터 소스 구성을 따로 해줘야 한다.
- 또는 [`Multitenancy`](https://www.baeldung.com/hibernate-5-multitenancy) 개념 통해서 여러 클라이언트(혹은 입주자 tenant)를 제공할 수 있도록 해야 한다.

#### 테스트2

```java
@Test
@DisplayName("Retrieve TestDataSubEntity from ClickHouse Using JPA")
void TestTableSubEntity_Returns_TestTableSubEntity() {
    List<TestTableChildEntity> results = testTableSubRepository.findById(1);
    ArrayList<String> expected = new ArrayList<>();
    expected.add("test");
    expected.add("string");
    expected.add("array");
    Assertions.assertEquals(expected, results.get(0).getCArrayString());
    System.out.println(results.get(0).getCInt256());
}
```

```
2022-01-06 00:43:55.618  INFO  --- [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'clickhouseEntityManager'
2022-01-06 00:43:57.160  INFO  --- [           main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with [org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@4bec6682, org.springframework.security.web.context.SecurityContextPersistenceFilter@2c6efee3, org.springframework.security.web.header.HeaderWriterFilter@792b9dd3, org.springframework.web.filter.CorsFilter@2d97344c, org.springframework.security.web.csrf.CsrfFilter@123d0816, org.springframework.security.web.authentication.logout.LogoutFilter@e2ee348, org.springframework.security.web.savedrequest.RequestCacheAwareFilter@3163e03b, org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@56adbb07, org.springframework.security.web.authentication.AnonymousAuthenticationFilter@7f839ec5, org.springframework.security.web.session.SessionManagementFilter@2b4ba2d9, org.springframework.security.web.access.ExceptionTranslationFilter@38c1b1a7]
2022-01-06 00:44:00.670  INFO  --- [           main] c.l.s.l.r.c.TestTableRepositoryTest      : Started TestTableRepositoryTest in 11.408 seconds (JVM running for 13.875)
57896044618658097711785492504343953926634992332820282019728792003956564819967
2022-01-06 00:44:01.821  INFO  --- [ionShutdownHook] j.LocalContainerEntityManagerFactoryBean : Closing JPA EntityManagerFactory for persistence unit 'clickhouseEntityManager'
2022-01-06 00:44:01.825  INFO  --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : clickhouseDataSourcePool - Shutdown initiated...
2022-01-06 00:44:01.830  INFO  --- [ionShutdownHook] com.zaxxer.hikari.HikariDataSource       : clickhouseDataSourcePool - Shutdown completed.
```
