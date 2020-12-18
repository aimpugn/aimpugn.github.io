---
title: Java Build configuration help
date: 2020-12-19 00:00:00+0900
author: aimpugn
---

# 개요

- `bash configure --help`로 출력된, java configure 시 필요한 또는 사용 가능한 값들을 정리
- [Building the JDK](http://openjdk.java.net/groups/build/doc/building.html) 참조
- [Demystifying the JVM: JVM Variants, Cppinterpreter and TemplateInterpreter](https://metebalci.com/blog/demystifying-the-jvm-jvm-variants-cppinterpreter-and-templateinterpreter/) 참조

## configure 스크립트

- 실행 가능한 configure 스크립트 없으면 configure support 통해 생성할 수 있다

```s
/{$path_to_unzipped}/jdk/build/.configure-support/generated-configure.sh

/root/downloads/jdk/build/.configure-support/generated-configure.sh
```

- 또는 `autoconf`(/usr/bin/autoconf) 사용해서 구성할 수 있다

```s
/root/downloads/jdk/configure [OPTION]... [VAR=VALUE]...
```

- `CC`, `CFLAGS` 같은 환경 변수를 할당하려면, `VAR=VALUE` 같은 식으로 지정한다.
- 변수 설명은 아래를 참고. 기본값은 괄호 안에 지정되어 있다

## Configuration

| 옵션                  | 설명                                         | 기본값                  |
| --------------------- | -------------------------------------------- | ----------------------- |
| -h, --help            | 도움말 보여주고 종료                         |                         |
| --help=short          | 이 패키지 한정된 옵션 출력                   |                         |
| --help=recursive      | 모든 포함된 패키지에 대한 간략한 도움말 출력 |                         |
| -V, --version         | 버전 정보                                    |                         |
| -q, --quiet, --silent | 'checking ...' 메시지 출력하지 않는다        |                         |
| -q, --quiet, --silent | 'checking ...' 메시지 출력하지 않는다        |                         |
| --cache-file=FILE     | FILE에 캐치 테스트 결과 저장                 | `disabled`              |
| -C, --config-cache    | `--cache-file=config.cache`의 별칭           |                         |
| -n, --no-create       | 출력 파일을 생성하지 않는다                  |                         |
| --srcdir={$DIR}       | {$DIR}에서 소스 파일을 찾는다                | configure dir 또는 `..` |

## 설치 디렉토리(Installation directories)

| 옵션            | 설명                                      | 기본값       |
| --------------- | ----------------------------------------- | ------------ |
| --prefix=PREFIX | PREFIX에 아키텍처 독립적인 파일들을 설치  | `/usr/local` |
| --exec-prefix   | EPREFIX에 아키텍처 의존적인 파일들을 설치 | `PREFIX`     |

### `make`

- 기본적으로 `make install`은 모든 파일을 `/usr/local/bin`, `/usr/local/lib` 등에 설치한다
- `--prefix` 옵션 사용하여 `/usr/local`이 아닌 다른 곳에 설치 가능. 예를 들어 `--prefix=$HOME`

### Fine tuning of the installation directories:

#### EPREFIX

| 옵션             | 설명                                            | 기본값            |
| ---------------- | ----------------------------------------------- | ----------------- |
| --bindir=DIR     | 사용자가 실행할 수 있는                         | `EPREFIX/bin`     |
| --libdir=DIR     | 오브젝트 코드 라이브러리(object code libraries) | `EPREFIX/lib`     |
| --libexecdir=DIR | 프로그램이 실행할 수 있는                       | `EPREFIX/libexec` |
| --sbindir=DIR    | 시스템 관리자가 실행할 수 있는                  | `EPREFIX/sbin`    |

#### PREFIX

| 옵션                 | 설명                                                | 기본값           |
| -------------------- | --------------------------------------------------- | ---------------- |
| --sysconfdir=DIR     | 읽기만 가능한 단일 머신 데이터(single-machine data) | `PREFIX/etc`     |
| --sharedstatedir=DIR | 수정 가능한 아키텍처 독립적인 데이터                | `PREFIX/com`     |
| --localstatedir=DIR  | 수정 가능한 단일 머신 데이터                        | `PREFIX/var`     |
| --includedir=DIR     | C 헤더 파일                                         | `PREFIX/include` |
| --oldincludedir=DIR  | gcc 아닌 C 헤더 파일                                | `/usr/include`   |
| --datarootdir=DIR    | 읽기만 가능한 아키텍처 독립적인 데이터 루트         | `PREFIX/share`   |

#### DATAROOTDIR

| 옵션            | 설명                                   | 기본값                    |
| --------------- | -------------------------------------- | ------------------------- |
| --datadir=DIR   | 읽기만 가능한 아키텍처 독립적인 데이터 | `DATAROOTDIR`             |
| --infodir=DIR   | info documentation                     | `DATAROOTDIR/info`        |
| --localedir=DIR | locale-dependent data                  | `DATAROOTDIR/locale`      |
| --mandir=DIR    | man documentation                      | `DATAROOTDIR/man`         |
| --docdir=DIR    | documentation root                     | `DATAROOTDIR/doc/openjdk` |

#### DOCDIR

| 옵션          | 설명               | 기본값   |
| ------------- | ------------------ | -------- |
| --htmldir=DIR | html documentation | `DOCDIR` |
| --dvidir=DIR  | dvi documentation  | `DOCDIR` |
| --pdfdir=DIR  | pdf documentation  | `DOCDIR` |
| --psdir=DIR   | ps documentation   | `DOCDIR` |

### X features:

| 옵션              | 설명                                    | 기본값 |
| ----------------- | --------------------------------------- | ------ |
| --x-includes=DIR  | DIR에 있는 X 포함 파일들(include files) |        |
| --x-libraries=DIR | DIR에 있는 X 라이브러리 파일들          |        |

### System types:

| 옵션            | 설명                                                          | 기본값    |
| --------------- | ------------------------------------------------------------- | --------- |
| --target=TARGET | TARGET에 대한 컴파일러 빌딩 위한 구성                         | `HOST`    |
| --host=HOST     | HOST에서 실행되도록 프로그램을 빌드하도록 `cross-compile`[^1] | `BUILD`   |
| --build=BUILD   | BUILD에 빌드함을 설정                                         | `guessed` |

[^1]: cross-comiplation https://www.gnu.org/software/automake/manual/html_node/Cross_002dCompilation.html

### Optional Features

| 옵션                               | 설명                                                                        | 기본값                                             |
| ---------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| --disable-option-checking          | 식별할 수 없는 --enable/--with 옵션 무시                                    |                                                    |
| --disable-FEATURE                  | do not include FEATURE (same as --enable-FEATURE=no)                        |                                                    |
| --enable-FEATURE[=ARG]             | include FEATURE                                                             | [ARG=yes]                                          |
| --enable-deprecated-ports          | Deprecated. Option is kept for backwards. compatibility and is ignored      |                                                    |
| --enable-openjdk-only              | suppress building custom source even if present                             | `disabled`                                         |
| --enable-debug                     | enable debugging (shorthand for --with-debug-level=fastdebug)               | [disabled]                                         |
| --disable-absolute-paths-in-output | 빌드 출력이 되는 빌드에서 절대 경로를 방지하려면 disable                    | 릴리즈 빌드에서 `disabled`, 그 외 `enabled`        |
| --enable-keep-packaged-modules     | enable keeping of packaged modules in jdk image                             | `enabled`                                          |
| --enable-headless-only             | only build headless (no GUI) support                                        | `disabled`                                         |
| --enable-linktime-gc               | use link time gc on unused code sections in the JDK build                   | `auto`                                             |
| --enable-full-docs                 | build complete documentation                                                | `enabled` if all tools found                       |
| --enable-unlimited-crypto          | enable unlimited crypto policy                                              | `enabled`                                          |
| --enable-static-build              | enable static library build                                                 | `disabled`                                         |
| --enable-reproducible-build        | enable reproducible builds (not yet fully functional)                       | `enabled`(--with-source-date, no abs path Windows) |
| --enable-warnings-as-errors        | consider native warnings to be an error                                     | `auto`                                             |
| --enable-native-coverage           | enable native compilation with code coverage data                           | `disabled`                                         |
| --enable-asan                      | enable AddressSanitizer                                                     | `disabled`                                         |
| --enable-libffi-bundling           | enable bundling of libffi.so to make the built JDK runnable on more systems | `disabled`                                         |

#### jvm-feature in Optional Features

| 옵션                               | 설명                                                                                 | 기본값 |
| ---------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| --enable-aot                       | alias for --enable-jvm-feature-aot                                                   |        |
| --enable-cds                       | alias for --enable-jvm-feature-cds                                                   |        |
| --enable-dtrace                    | alias for --enable-jvm-feature-dtrace                                                |        |
| --enable-jvm-feature-aot           | enable jvm feature 'aot' (enable ahead of time compilation (AOT))                    |        |
| --enable-jvm-feature-cds           | enable jvm feature 'cds' (enable class data sharing (CDS))                           |        |
| --enable-jvm-feature-compiler1     | enable jvm feature 'compiler1' (enable hotspot compiler C1)                          |        |
| --enable-jvm-feature-compiler2     | enable jvm feature 'compiler2' (enable hotspot compiler C2)                          |        |
| **--enable-jvm-feature-dtrace **   | enable jvm feature 'dtrace' (enable dtrace support)                                  |        |
| --enable-jvm-feature-epsilongc     | enable jvm feature 'epsilongc' (include the epsilon (no-op) garbage collector)       |        |
| --enable-jvm-feature-g1gc          | enable jvm feature 'g1gc' (include the G1 garbage collector)                         |        |
| **--enable-jvm-feature-graal **    | enable jvm feature 'graal' (enable Graal (jdk.internal.vm.compiler))                 |        |
| **--enable-jvm-feature-jfr **      | enable jvm feature 'jfr' (enable JDK Flight Recorder (JFR))                          |        |
| --enable-jvm-feature-jni-check     | enable jvm feature 'jni-check' (enable -Xcheck:jni support)                          |        |
| **--enable-jvm-feature-jvmci **    | enable jvm feature 'jvmci' (enable JVM Compiler Interface (JVMCI))                   |        |
| **--enable-jvm-feature-jvmti **    | enable jvm feature 'jvmti' (enable Java Virtual Machine Tool Interface (JVM TI))     |        |
| --enable-jvm-feature-link-time-opt | enable jvm feature 'link-time-opt' (enable link time optimization)                   |        |
| --enable-jvm-feature-management    | enable jvm feature 'management' (enable java.lang.management API support)            |        |
| --enable-jvm-feature-minimal       | enable jvm feature 'minimal' (support building variant 'minimal')                    |        |
| --enable-jvm-feature-nmt           | enable jvm feature 'nmt' (include native memory tracking (NMT))                      |        |
| --enable-jvm-feature-opt-size      | enable jvm feature 'opt-size' (optimize the JVM library for size)                    |        |
| --enable-jvm-feature-parallelgc    | enable jvm feature 'parallelgc' (include the parallel garbage collector)             |        |
| --enable-jvm-feature-serialgc      | enable jvm feature 'serialgc' (include the serial garbage collector)                 |        |
| --enable-jvm-feature-services      | enable jvm feature 'services' (enable diagnostic services and client attaching)      |        |
| --enable-jvm-feature-shenandoahgc  | enable jvm feature 'shenandoahgc' (include the Shenandoah garbage collector)         |        |
| --enable-jvm-feature-static-build  | enable jvm feature 'static-build' (build static library instead of dynamic)          |        |
| --enable-jvm-feature-vm-structs    | enable jvm feature 'vm-structs' (export JVM structures to the Serviceablility Agent) |        |
| --enable-jvm-feature-zero          | enable jvm feature 'zero' (support building variant 'zero')                          |        |
| --enable-jvm-feature-zgc           | enable jvm feature 'zgc' (include the Z garbage collector)                           |        |
| --enable-jvm-feature-cmsgc         | Deprecated. Option is kept for backwards. compatibility and is ignored               |        |
| --enable-jvm-feature-trace         | Deprecated. Option is kept for backwards. compatibility and is ignored               |        |

#### etc in Optional Features

| 옵션                           | 설명                                                                   | 기본값                                         |
| ------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------- |
| --enable-hotspot-gtest         | Deprecated. Option is kept for backwards. compatibility and is ignored |                                                |
| --enable-jtreg-failure-handler | enable keeping of packaged modules in jdk image                        | [enabled if jtreg is present]                  |
| --enable-generate-classlist    | enable generation of a CDS classlist at build time                     | `enabled` if `cds` enabled for all JVM vriants |

### Optional Packages:

--with-PACKAGE[=ARG] use PACKAGE [ARG=yes]
--without-PACKAGE do not use PACKAGE (same as --with-PACKAGE=no)
--with-target-bits build 32-bit or 64-bit binaries (for platforms that
support it), e.g. --with-target-bits=32 [guessed]
--with-debug-level set the debug level (release, fastdebug, slowdebug,
optimized) [release]
--with-jvm-variants JVM variants to build, separated by commas (server
client minimal core zero custom) [server]
--with-devkit use this devkit for compilers, tools and resources
--with-sys-root alias for --with-sysroot for backwards compatability
--with-sysroot use this directory as sysroot
--with-tools-dir alias for --with-toolchain-path for backwards
compatibility
--with-toolchain-path prepend these directories when searching for
toolchain binaries (compilers etc)
--with-extra-path prepend these directories to the default path
--with-sdk-name use the platform SDK of the given name. [macosx]
--with-conf-name use this as the name of the configuration [generated
from important configuration options]
--with-output-sync set make output sync type if supported by make.
[recurse]
--with-macosx-codesign-identity
specify the code signing identity
--with-default-make-target
set the default make target [exploded-image]
--with-log [default vaue for make LOG argument [warn]]
--with-jdk-rc-name Set JDK RC name. This is used for FileDescription
and ProductName properties of MS Windows binaries.
[not specified]
--with-vendor-name Set vendor name. Among others, used to set the
'java.vendor' and 'java.vm.vendor' system
properties. [not specified]
--with-vendor-url Set the 'java.vendor.url' system property [not
specified]
--with-vendor-bug-url Set the 'java.vendor.url.bug' system property [not
specified]
--with-vendor-vm-bug-url
Sets the bug URL which will be displayed when the VM
crashes [not specified]
--with-version-string Set version string [calculated]
--with-version-pre Set the base part of the version 'PRE' field
(pre-release identifier) ['internal']
--with-version-opt Set version 'OPT' field (build metadata)
[<timestamp>.<user>.<dirname>]
--with-version-build Set version 'BUILD' field (build number) [not
specified]
--with-version-feature Set version 'FEATURE' field (first number) [current
source value]
--with-version-interim Set version 'INTERIM' field (second number) [current
source value]
--with-version-update Set version 'UPDATE' field (third number) [current
source value]
--with-version-patch Set version 'PATCH' field (fourth number) [not
specified]
--with-version-extra1 Set 1st version extra number [not specified]
--with-version-extra2 Set 2nd version extra number [not specified]
--with-version-extra3 Set 3rd version extra number [not specified]
--with-version-date Set version date [current source value]
--with-vendor-version-string
Set vendor version string [not specified]
--with-macosx-bundle-name-base
Set the MacOSX Bundle Name base. This is the base
name for calculating MacOSX Bundle Names. [not
specified]
--with-macosx-bundle-id-base
Set the MacOSX Bundle ID base. This is the base ID
for calculating MacOSX Bundle IDs. [not specified]
--with-macosx-bundle-build-version
Set the MacOSX Bundle CFBundleVersion field. This
key is a machine-readable string composed of one to
three period-separated integers and should represent
the build version. Defaults to the build number.
--with-boot-jdk path to Boot JDK (used to bootstrap build) [probed]
--with-boot-jdk-jvmargs specify additional arguments to be passed to Boot
JDK tools [none]
--with-build-jdk path to JDK of same version as is being built[the
newly built JDK]
--with-cacerts-file specify alternative cacerts file
--with-copyright-year Set copyright year value for build [current year]
--with-jni-libpath override default JNI library search path
--with-import-modules import a set of prebuilt modules either as a zip
file or an exploded directory
--with-toolchain-type the toolchain type (or family) to use, use '--help'
to show possible values [platform dependent]
--with-extra-cflags extra flags to be used when compiling jdk c-files
--with-extra-cxxflags extra flags to be used when compiling jdk c++-files
--with-extra-ldflags extra flags to be used when linking jdk
--with-extra-asflags extra flags to be passed to the assembler
--with-toolchain-version
the version of the toolchain to look for, use
'--help' to show possible values [platform
dependent]
--with-msvc-toolset-version
specific MSVC toolset version to use, passed as
-vcvars_ver argument to pass to vcvarsall.bat
(Windows only)
--with-build-devkit Devkit to use for the build platform toolchain
--with-jtreg Regression Test Harness [probed]
--with-jmh Java Microbenchmark Harness for building the OpenJDK
Microbenchmark Suite
--with-jib Jib dependency management tool [not used]
--with-source-date how to set SOURCE_DATE_EPOCH ('updated', 'current',
'version' a timestamp or an ISO-8601 date) [updated]
--with-macosx-version-max
error on use of newer functionality. [macosx]
--with-abi-profile specify ABI profile for ARM builds
(arm-vfp-sflt,arm-vfp-hflt,arm-sflt,
armv5-vfp-sflt,armv6-vfp-hflt,aarch64) [toolchain
dependent]
--with-native-debug-symbols
set the native debug symbol configuration (none,
internal, external, zipped) [varying]
--with-external-symbols-in-bundles
which type of external native debug symbol
information shall be shipped in product bundles
(none, public, full) (e.g. ship full/stripped pdbs
on Windows) [none]
--with-jcov jcov library location
--with-jcov-input-jdk jdk image to instrument
--with-jcov-filters filters to limit code for jcov instrumentation and
report generation
--with-stdc++lib=<static>,<dynamic>,<default>
force linking of the C++ runtime on Linux to either
static or dynamic, default is static with dynamic as
fallback
--with-msvcr-dll path to microsoft C runtime dll (msvcr*.dll)
(Windows only) [probed]
--with-msvcp-dll path to microsoft C++ runtime dll (msvcp*.dll)
(Windows only) [probed]
--with-vcruntime-1-dll path to microsoft C++ runtime dll (vcruntime\*\_1.dll)
(Windows x64 only) [probed]
--with-ucrt-dll-dir path to Microsoft Windows Kit UCRT DLL dir (Windows
only) [probed]
--with-x use the X Window System
--with-cups specify prefix directory for the cups package
(expecting the headers under PATH/include)
--with-cups-include specify directory for the cups include files
--with-fontconfig specify prefix directory for the fontconfig package
(expecting the headers under PATH/include)
--with-fontconfig-include
specify directory for the fontconfig include files
--with-freetype specify whether to use 'system' or 'bundled'
freetype. The selected option applies to both build
time and run time. The default behaviour can be
platform dependent. If using 'system' and either the
include files or libraries cannot be located
automatically, then additionally specify both using
--with-freetype-include and --with-freetype-lib.
--with-freetype-include specify directory for the freetype include files
--with-freetype-lib specify directory for the freetype library
--with-alsa specify prefix directory for the alsa package
(expecting the libraries under PATH/lib and the
headers under PATH/include)
--with-alsa-include specify directory for the alsa include files
--with-alsa-lib specify directory for the alsa library
--with-libffi specify prefix directory for the libffi package
(expecting the libraries under PATH/lib and the
headers under PATH/include)
--with-libffi-include specify directory for the libffi include files
--with-libffi-lib specify directory for the libffi library
--with-libjpeg use libjpeg from build system or OpenJDK source
(system, bundled) [bundled]
--with-giflib use giflib from build system or OpenJDK source
(system, bundled) [bundled]
--with-libpng use libpng from build system or OpenJDK source
(system, bundled) [bundled]
--with-zlib use zlib from build system or OpenJDK source
(system, bundled) [bundled]
--with-lcms use lcms2 from build system or OpenJDK source
(system, bundled) [bundled]
--with-harfbuzz use harfbuzz from build system or OpenJDK source
(system, bundled) [bundled]
--with-graalunit-lib specify location of 3rd party libraries used by
Graal unit tests
--with-gtest specify prefix directory for the gtest framework
--with-jvm-features JVM features to enable (foo) or disable (-foo),
separated by comma. Use '--help' to show possible
values [none]
--with-hotspot-build-time
timestamp to use in hotspot version string, empty
for on-the-fly [empty]
--with-with-cpu-port Deprecated. Option is kept for backwards
compatibility and is ignored
--with-exclude-translations
a comma separated list of locales to exclude
translations for. Default is to include all
translations present in the source.
--with-num-cores number of cores in the build system, e.g.
--with-num-cores=8 [probed]
--with-memory-size memory (in MB) available in the build system, e.g.
--with-memory-size=1024 [probed]
--with-jobs number of parallel jobs to let make run [calculated
based on cores and memory]
--with-test-jobs number of parallel tests jobs to run [based on build
jobs]
--with-ccache-dir where to store ccache files [~/.ccache]

Some influential environment variables:
BASH Override default value for BASH
CAT Override default value for CAT
CHMOD Override default value for CHMOD
CP Override default value for CP
CUT Override default value for CUT
DATE Override default value for DATE
DIFF Override default value for DIFF
ECHO Override default value for ECHO
EXPR Override default value for EXPR
FIND Override default value for FIND
GUNZIP Override default value for GUNZIP
GZIP Override default value for GZIP
HEAD Override default value for HEAD
LN Override default value for LN
LS Override default value for LS
MKDIR Override default value for MKDIR
MKTEMP Override default value for MKTEMP
MV Override default value for MV
AWK Override default value for AWK
PRINTF Override default value for PRINTF
RM Override default value for RM
RMDIR Override default value for RMDIR
SH Override default value for SH
SORT Override default value for SORT
TAIL Override default value for TAIL
TAR Override default value for TAR
TEE Override default value for TEE
TOUCH Override default value for TOUCH
TR Override default value for TR
UNAME Override default value for UNAME
WC Override default value for WC
XARGS Override default value for XARGS
GREP Override default value for GREP
EGREP Override default value for EGREP
FGREP Override default value for FGREP
SED Override default value for SED
DF Override default value for DF
NICE Override default value for NICE
READLINK Override default value for READLINK
PATHTOOL Override default value for PATHTOOL
LSB_RELEASE Override default value for LSB_RELEASE
CMD Override default value for CMD
CMP Override default value for CMP
UNIQ Override default value for UNIQ
XCODEBUILD Override default value for XCODEBUILD
PKGHANDLER Override default value for PKGHANDLER
MAKE Override default value for MAKE
CHECK_GMAKE Override default value for CHECK_GMAKE
CHECK_MAKE Override default value for CHECK_MAKE
CHECK_TOOLSDIR_GMAKE
Override default value for CHECK_TOOLSDIR_GMAKE
CHECK_TOOLSDIR_MAKE
Override default value for CHECK_TOOLSDIR_MAKE
PANDOC Override default value for PANDOC
UNZIP Override default value for UNZIP
ZIPEXE Override default value for ZIPEXE
READELF Override default value for READELF
DOT Override default value for DOT
HG Override default value for HG
GIT Override default value for GIT
STAT Override default value for STAT
TIME Override default value for TIME
FLOCK Override default value for FLOCK
DTRACE Override default value for DTRACE
PATCH Override default value for PATCH
DSYMUTIL Override default value for DSYMUTIL
MIG Override default value for MIG
XATTR Override default value for XATTR
CODESIGN Override default value for CODESIGN
SETFILE Override default value for SETFILE
ULIMIT Override default value for ULIMIT
PKG_CONFIG path to pkg-config utility
JAVAC_CHECK Override default value for JAVAC_CHECK
JAVA_CHECK Override default value for JAVA_CHECK
JAVA Override default value for JAVA
JAVAC Override default value for JAVAC
JAVADOC Override default value for JAVADOC
JAR Override default value for JAR
POTENTIAL_CC
Override default value for POTENTIAL_CC
CC C compiler command
CFLAGS C compiler flags
LDFLAGS linker flags, e.g. -L<lib dir> if you have libraries in a
nonstandard directory <lib dir>
LIBS libraries to pass to the linker, e.g. -l<library>
CPPFLAGS (Objective) C/C++ preprocessor flags, e.g. -I<include dir> if
you have headers in a nonstandard directory <include dir>
POTENTIAL_CXX
Override default value for POTENTIAL_CXX
CXX C++ compiler command
CXXFLAGS C++ compiler flags
CPP C preprocessor
CXXCPP C++ preprocessor
LD Override default value for LD
LD_JAOTC Override default value for LD_JAOTC
AS Override default value for AS
AR Override default value for AR
LIPO Override default value for LIPO
OTOOL Override default value for OTOOL
INSTALL_NAME_TOOL
Override default value for INSTALL_NAME_TOOL
MT Override default value for MT
RC Override default value for RC
DUMPBIN Override default value for DUMPBIN
STRIP Override default value for STRIP
NM Override default value for NM
OBJCOPY Override default value for OBJCOPY
OBJDUMP Override default value for OBJDUMP
CXXFILT Override default value for CXXFILT
BUILD_CC Override default value for BUILD_CC
BUILD_CXX Override default value for BUILD_CXX
BUILD_AS Override default value for BUILD_AS
BUILD_AR Override default value for BUILD_AR
BUILD_LD Override default value for BUILD_LD
BUILD_NM Override default value for BUILD_NM
BUILD_OBJCOPY
Override default value for BUILD_OBJCOPY
BUILD_STRIP Override default value for BUILD_STRIP
JTREGEXE Override default value for JTREGEXE
XMKMF Path to xmkmf, Makefile generator for X Window System
FREETYPE_CFLAGS
C compiler flags for FREETYPE, overriding pkg-config
FREETYPE_LIBS
linker flags for FREETYPE, overriding pkg-config
ALSA_CFLAGS C compiler flags for ALSA, overriding pkg-config
ALSA_LIBS linker flags for ALSA, overriding pkg-config
LIBFFI_CFLAGS
C compiler flags for LIBFFI, overriding pkg-config
LIBFFI_LIBS linker flags for LIBFFI, overriding pkg-config
PNG_CFLAGS C compiler flags for PNG, overriding pkg-config
PNG_LIBS linker flags for PNG, overriding pkg-config
LCMS_CFLAGS C compiler flags for LCMS, overriding pkg-config
LCMS_LIBS linker flags for LCMS, overriding pkg-config
HARFBUZZ_CFLAGS
C compiler flags for HARFBUZZ, overriding pkg-config
HARFBUZZ_LIBS
linker flags for HARFBUZZ, overriding pkg-config
ICECC_CMD Override default value for ICECC_CMD
ICECC_CREATE_ENV
Override default value for ICECC_CREATE_ENV
ICECC_WRAPPER
Override default value for ICECC_WRAPPER
CCACHE Override default value for CCACHE

Use these variables to override the choices made by `configure' or to help
it to find libraries and programs with nonstandard names/locations.

Report bugs to <build-dev@openjdk.java.net>.
OpenJDK home page: <http://openjdk.java.net>.

## Additional (non-autoconf) OpenJDK Options:

| 옵션                    | 설명                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| --openjdk-target=TARGET | cross-compile with TARGET as target platform.(i.e. the one you will run the resulting binary on). |
|                         | Equivalent to --host=TARGET --target=TARGET --build=<current platform>                            |
| --debug-configure       | Run the configure script with additional debug logging enabled.                                   |

The following toolchains are valid as arguments to --with-toolchain-type.
Which are available to use depends on the build platform.

| 옵션      | 설명                    |
| --------- | ----------------------- |
| gcc       | GNU Compiler Collection |
| clang     | clang/LLVM              |
| xlc       | IBM XL C/C++            |
| microsoft | Microsoft Visual Studio |

The following JVM features are valid as arguments to --with-jvm-features.
Which are available to use depends on the environment and JVM variant.

|               |                                                     |
| ------------- | --------------------------------------------------- |
| aot           | enable ahead of time compilation (AOT)              |
| cds           | enable class data sharing (CDS)                     |
| compiler1     | enable hotspot compiler C1                          |
| compiler2     | enable hotspot compiler C2                          |
| dtrace        | enable dtrace support                               |
| epsilongc     | include the epsilon (no-op) garbage collector       |
| g1gc          | include the G1 garbage collector                    |
| graal         | enable Graal (jdk.internal.vm.compiler)             |
| jfr           | enable JDK Flight Recorder (JFR)                    |
| jni-check     | enable -Xcheck:jni support                          |
| jvmci         | enable JVM Compiler Interface (JVMCI)               |
| jvmti         | enable Java Virtual Machine Tool Interface (JVM TI) |
| link-time-opt | enable link time optimization                       |
| management    | enable java.lang.management API support             |
| minimal       | support building variant 'minimal'                  |
| nmt           | include native memory tracking (NMT)                |
| opt-size      | optimize the JVM library for size                   |
| parallelgc    | include the parallel garbage collector              |
| serialgc      | include the serial garbage collector                |
| services      | enable diagnostic services and client attaching     |
| shenandoahgc  | include the Shenandoah garbage collector            |
| static-build  | build static library instead of dynamic             |
| vm-structs    | export JVM structures to the Serviceablility Agent  |
| zero          | support building variant 'zero'                     |
| zgc           | include the Z garbage collector                     |

**NOTE**
Please be aware that, when cross-compiling, the OpenJDK configure script will
generally use `target` where autoconf traditionally uses `host`.

Also note that variables must be passed on the command line. Variables in the
environment will generally be ignored, unlike traditional autoconf scripts.
