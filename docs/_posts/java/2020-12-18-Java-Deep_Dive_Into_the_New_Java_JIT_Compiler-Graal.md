---
title: Deep dive into the new java JIT compiler, Graal
date: 2020-12-18 23:07:00+0900
author: aimpugn
---

- [출처](#출처)
- [개요](#개요)
- [JIT 컴파일러란?](#jit-컴파일러란)
- [`JIT 컴파일러`에 대해 더 상세하기 보기](#jit-컴파일러에-대해-더-상세하기-보기)
    - [`C1`](#c1)
    - [`C2`](#c2)
  - [계층화된 컴파일](#계층화된-컴파일)
  - [서버 컴파일러](#서버-컴파일러)
- [프로젝트 `GraalVM`](#프로젝트-graalvm)
  - [Java로 작성된 JIT 컴파일러 Graal](#java로-작성된-jit-컴파일러-graal)
  - [`JVMCI(JVM Compiler Interface)`](#jvmcijvm-compiler-interface)
  - [Graal in Action](#graal-in-action)
- [기타](#기타)

# 출처

- https://www.baeldung.com/graal-java-jit-compiler
- 위 내용을 번역

# 개요

- [`Graal`](https://github.com/oracle/graal) 이라 불리는 Java JIT 컴파이러에 대해 깊이 살펴본다

# JIT 컴파일러란?

- `javac` 커맨드 사용해서 Java 프로그램 컴파일 시, 이진 표현의 JVM `bytecode`로 컴파일된 소스코드를 얻게 된다
- `bytecode`는 소스코드보다 간단하고 더 간결(compact)하지만, 전통적인 프로세서는 이를 실행시킬 수 없다
- Java 프로그램 실행 위해서는, JVM이 `bytecode`를 해석해야 한다
- 해석기(interpreter)는 실제 프로세서에서 네이티브 코드를 실행시키는 것보다 느리기 때문에, JVM은 `bytecode`를 프로세서가 실행할 수 있는 머신 코드로 컴파일하는 다른 컴파일러를 사용할 수 있으며, 이를 `JIT(Just In Time) 컴파일러`라고 한다
- `JIT(Just In Time) 컴파일러`는 `javac` 컴파일러보다 훨씬 복잡하고, 고성능의 머신 코드 생성 위해서는 복잡한 최적화를 수행한다

# `JIT 컴파일러`에 대해 더 상세하기 보기

- 오라클이 구현한 JDK는 오픈소스 OpenJDK 프로젝트에 기반한다
- 이 JDK는 `HotSpot virtual machine`을 포함하며, 이는 두 개의 전통적인 JIT 컴파일러를 포함한다
  - `C1`이라 불리는 클라이언트 컴파일러
  - `opto` 또는 `C2`라 불리는 서버 컴파일러

### `C1`

- 더 빠르게 실행하고 덜 최적화된 코드를 만들어내도록 설계
- JIT 커파일러 떄문에 길게 멈추길 원치 않기 때문에, 데스크톱 애플리케이션에 더 맞다

### `C2`

- 실행헤 시간이 더 걸리지만, 더 최적화된 코드를 만들어낸다
- 컴파일에 더 오랜 시간을 쓸 수 있는, 오랜 시간 실행되는 서버 애플리케이션에 더 맞다

## 계층화된 컴파일

- 오늘날 Java installation은 일반적인 프로그램 실행 동안 두 JIT 컴파일러를 사용한다
- `javac`로 컴파일된 자바 프로그램은 `bytecode`가 해석된 모드에서 실행된다
- JVM은 자주 호출되는 메서드를 추적하고 컴파일하며, 이를 위해 `C1`을 컴파일에 사용한다
- 하지만 HotSpot은 여전히 그 메서드들이 앞으로 호출될 것을 주시하다가 호출 수가 증가하면, `C2`를 사용하여 그 메서드들은 다시 한번 컴파일한다

## 서버 컴파일러

- `C2`는 매우, 최적화되었고 C++과 경쟁하거나 더 빠른 코드를 생산한다
- 서버 컴파일러(`C2`) 자체가 C++의 특정 방언으로 작성되었다
- 그러나 몇 가지 이슈가 있다
  - C++의 [세그먼트 오류](https://kb.iu.edu/d/aqsj) 때문에, VM이 충돌할 수 있다
  - 그리고 지난 몇 년간 주요 개선사항이 구현되지 않았다
  - `C2`는 관리하기 어려워졌고, 현재 설계로는 주요한 향상을 기대할 수 없다
- 이 결과 `GraalVM`이라 명명된 새로운 JIT 컴파일러 프로젝트 생성

# [프로젝트 `GraalVM`](https://www.graalvm.org/)

- `GraalVM`은 오라클이 만든 리서치 프로젝트다
- `GraalVM`을 여러 연결된 프로젝트로 볼 수 있는데
  - HotSpot에 빌드되는 새로운 JIT 컴파일러
  - 새로운 [polyglot VM](https://www.graalvm.org/reference-manual/polyglot-programming/)
- Java와 JVM 기반 언어 집합에 포괄적인 생태계를 제공
  - JavaScript
  - Ruby
  - Python
  - R
  - C/C++
  - 기타 [LLVM](https://ko.wikipedia.org/wiki/LLVM) 기반 언어

## Java로 작성된 JIT 컴파일러 Graal

- `Graal`은 고성능의 JIT 컴파일러로, JVM 바이트코드를 받아서 머신 코드를 생산한다
- 자바로 컴파일러를 작성한 몇 가지 이점이 있다
  - 충돌(crash) 대신 예외(Exception)가 발생하고 실제 메모리 누수가 없는 안정성(safety)
  - 좋은 IDE 지원이 있어서 debugger, profiler 그리고 기타 편리한 툴 사용할 수 있다
  - HotSpot에 독립적일 수 있으며, 더 빠른 JIT 컴파일된 버전을 생산할 수 있다
- VM과 통신하기 위해 새로운 컴파일러 인터페이스 [`JVMCI`](https://openjdk.java.net/jeps/243)를 사용한
- 새로운 JIT 컴파일러 사용하려면, cli로 자바 실행 시 옵션 설정 필요

```s
-XX:+UnlockExperimentalVMOptions -XX:+EnableJVMCI -XX:+UseJVMCICompiler
```

- 세 가지 방식으로 프로그램을 실행할 수 있음을 의미한다
  1. 정규적인 계층화된 컴파일러
  2. 자바10에서 JVMCI 버전의 Graal
  3. GraalVM

## `JVMCI(JVM Compiler Interface)`

- `JVMCI`는 JDK 9부터 OpenJDK의 일부가 됐고, Graal 실행 위해 어떤 표준 OpenJDK나 오라클 JDK를 사용할 수 있다
- `JVMCI`는 표준 계층화된 컴파일을 제외하고, 새로운 컴파일러 Graal을 JVM 변경 없이 플러그인할 수 있게 해준다
- 인터페이스는 매우 간단하다.
  - `Graal`이 메서드 컴파일할 때, 해당 메서드의 `bytecode`를 `JVMCI`에 입력(input)으로 넘긴다(byte arrays)
  - 출력으로 컴파일된 머신 코드를 얻는다(byte arrays)

```java
interface JVMCICompiler {
    byte[] compileMethod(byte[] bytecode);
}
```

- 실제 시나리오에서, 보통 로컬 변수의 개수, 스택 사이즈, 해석기의 프로파일링에서(from profiling in the interpreter) 수집된 정보 등이 필요하고, 이를 통해 실제로 코드가 어떻게 실행되는지 알 수 있따
- 본질적으로, [JVMCICompiler](https://github.com/md-5/OpenJDK/blob/master/src/jdk.internal.vm.ci/share/classes/jdk.vm.ci.runtime/src/jdk/vm/ci/runtime/JVMCICompiler.java)의 `compileMethod()` 메서드 호출 시, `CompilationRequest` 오브젝트를 전달해야 한다
- 그러면 컴파일하려는 Java 메서드를 반환하고, 그 메서드에서 우리가 원하는 정보를 찾을 수 있다

- [공식 사이트의 예제](https://www.graalvm.org/examples/java-performance-examples/)

```java
public class CountUppercase {
    static final int ITERATIONS = Math.max(Integer.getInteger("iterations", 1), 1);

    public static void main(String[] args) {
        String sentence = String.join(" ", args);
        for (int iter = 0; iter < ITERATIONS; iter++) {
            if (ITERATIONS != 1) {
                System.out.println("-- iteration " + (iter + 1) + " --");
            }
            long total = 0, start = System.currentTimeMillis(), last = start;
            for (int i = 1; i < 10_000_000; i++) {
                total += sentence
                  .chars()
                  .filter(Character::isUpperCase)
                  .count();
                if (i % 1_000_000 == 0) {
                    long now = System.currentTimeMillis();
                    System.out.printf("%d (%d ms)%n", i / 1_000_000, now - last);
                    last = now;
                }
            }
            System.out.printf("total: %d (%d ms)%n", total, System.currentTimeMillis() - start);
        }
    }
}
```

실행

```s
javac CountUppercase.java
java -XX:+UnlockExperimentalVMOptions -XX:+EnableJVMCI -XX:+UseJVMCICompiler
```

## Graal in Action

- Graal 그 자체는 VM에 의해 실행되므로, [`hot`](https://stackoverflow.com/a/30855298)해질 때 우선 해석되어 JIT 컴파일러된다
  - `hot`은 말 그대로 뜨거워지는, 자주 호출되는 것을 의미한다. `-XX:CompileThreshold=<num>`로 설정 가능

# 기타

- https://metebalci.com/blog/demystifying-the-jvm-jvm-variants-cppinterpreter-and-templateinterpreter/
- https://github.com/oracle/graal
