---
title: problem with installed package podman-
author: aimpugn
date: 2021-4-18 01:00:00+0900
use_math: true
categories: [troubleshooting, docker]
---

## 문제

- 버전 업그레이드 하려는데 아래와 같은 에러 발생

```
Docker CE Stable - x86_64                                                               117 kB/s |  12 kB     00:00
Package docker-ce-3:19.03.11-3.el7.x86_64 is already installed.
Package docker-ce-cli-1:19.03.11-3.el7.x86_64 is already installed.
Package containerd.io-1.2.6-3.3.el7.x86_64 is already installed.
오류:
 문제 1: problem with installed package podman-1.0.5-1.gitf604175.module_el8.0.0+194+ac560166.x86_64
  - package podman-1.0.5-1.gitf604175.module_el8.0.0+194+ac560166.x86_64 requires runc, but none of the providers can be installed
  - package podman-2.2.1-7.module_el8.3.0+699+d61d9c41.x86_64 requires runc >= 1.0.0-57, but none of the providers can be installed
  - package containerd.io-1.2.6-3.3.el7.x86_64 conflicts with containerd provided by containerd.io-1.4.4-3.1.el8.x86_64
  - package containerd.io-1.4.4-3.1.el8.x86_64 conflicts with runc provided by containerd.io-1.2.6-3.3.el7.x86_64
  - package containerd.io-1.4.4-3.1.el8.x86_64 conflicts with containerd provided by containerd.io-1.2.6-3.3.el7.x86_64
  - cannot install both containerd.io-1.4.4-3.1.el8.x86_64 and containerd.io-1.2.6-3.3.el7.x86_64
  - package containerd.io-1.4.4-3.1.el8.x86_64 conflicts with runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.4.4-3.1.el8.x86_64 obsoletes runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - cannot install the best candidate for the job
  - package runc-1.0.0-56.rc5.dev.git2abd837.module_el8.3.0+569+1bada2e4.x86_64 is filtered out by modular filtering
  - package runc-1.0.0-64.rc10.module_el8.3.0+479+69e2ae26.x86_64 is filtered out by modular filtering
 문제 2: problem with installed package containerd.io-1.2.6-3.3.el7.x86_64
  - package containerd.io-1.3.7-3.1.el8.x86_64 conflicts with runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.3.7-3.1.el8.x86_64 obsoletes runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.3.9-3.1.el8.x86_64 conflicts with runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.3.9-3.1.el8.x86_64 obsoletes runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.4.3-3.1.el8.x86_64 conflicts with runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.4.3-3.1.el8.x86_64 obsoletes runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.4.3-3.2.el8.x86_64 conflicts with runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.4.3-3.2.el8.x86_64 obsoletes runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.4.4-3.1.el8.x86_64 conflicts with runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - package containerd.io-1.4.4-3.1.el8.x86_64 obsoletes runc provided by runc-1.0.0-70.rc92.module_el8.3.0+699+d61d9c41.x86_64
  - problem with installed package buildah-1.5-3.gite94b4f9.module_el8.0.0+58+91b614e7.x86_64
  - package buildah-1.5-3.gite94b4f9.module_el8.0.0+58+91b614e7.x86_64 requires runc >= 1.0.0-26, but none of the providers can be installed
  - package buildah-1.16.7-4.module_el8.3.0+699+d61d9c41.x86_64 requires runc >= 1.0.0-26, but none of the providers can be installed
  - package docker-ce-3:20.10.6-3.el8.x86_64 requires containerd.io >= 1.4.1, but none of the providers can be installed  - package containerd.io-1.2.6-3.3.el7.x86_64 conflicts with containerd provided by containerd.io-1.4.3-3.1.el8.x86_64
  - package containerd.io-1.4.3-3.1.el8.x86_64 conflicts with runc provided by containerd.io-1.2.6-3.3.el7.x86_64
  - package containerd.io-1.4.3-3.1.el8.x86_64 conflicts with containerd provided by containerd.io-1.2.6-3.3.el7.x86_64
  - cannot install both containerd.io-1.4.3-3.1.el8.x86_64 and containerd.io-1.2.6-3.3.el7.x86_64
  - package containerd.io-1.2.6-3.3.el7.x86_64 conflicts with containerd provided by containerd.io-1.4.3-3.2.el8.x86_64
  - package containerd.io-1.4.3-3.2.el8.x86_64 conflicts with runc provided by containerd.io-1.2.6-3.3.el7.x86_64
  - package containerd.io-1.4.3-3.2.el8.x86_64 conflicts with containerd provided by containerd.io-1.2.6-3.3.el7.x86_64
  - cannot install both containerd.io-1.4.3-3.2.el8.x86_64 and containerd.io-1.2.6-3.3.el7.x86_64
  - package containerd.io-1.2.6-3.3.el7.x86_64 conflicts with containerd provided by containerd.io-1.4.4-3.1.el8.x86_64
  - package containerd.io-1.4.4-3.1.el8.x86_64 conflicts with runc provided by containerd.io-1.2.6-3.3.el7.x86_64
  - package containerd.io-1.4.4-3.1.el8.x86_64 conflicts with containerd provided by containerd.io-1.2.6-3.3.el7.x86_64
  - cannot install both containerd.io-1.4.4-3.1.el8.x86_64 and containerd.io-1.2.6-3.3.el7.x86_64
  - cannot install the best candidate for the job
  - package runc-1.0.0-56.rc5.dev.git2abd837.module_el8.3.0+569+1bada2e4.x86_64 is filtered out by modular filtering
  - package runc-1.0.0-64.rc10.module_el8.3.0+479+69e2ae26.x86_64 is filtered out by modular filtering
(try to add '--allowerasing' to command line to replace conflicting packages or '--skip-broken' to skip uninstallable packages or '--nobest' to use not only best candidate packages)
```

## 원인

- 기존 버전과 충돌로 보임

## 해결

- 삭제 후 재설치

```
yum remove docker-ce docker-ce-cli containerd.io

rm -rf /var/lib/docker
rm -rf /var/lib/containerd
```
