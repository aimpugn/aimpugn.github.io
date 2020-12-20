---
title: Docker Network
author: aimpugn
date: 2020-11-29 22:47:00 +0900
---

## [No network connectivity to/from Docker CE container on CentOS 8](https://serverfault.com/a/987687/602508)

### 문제

- 도커에서 외부 허브에서 이미지를 가져오지 못함

```
go: github.com/stretchr/testify@v1.6.1: Get "https://proxy.golang.org/github.com/stretchr/testify/@v/v1.6.1.mod": dial tcp: lookup proxy.golang.org on 8.8.4.4:53: read udp 172.17.0.2:35077->8.8.4.4:53: read: no route to host
```

### 원인

- 도커 내의 go 코드에서 [dial](https://golang.org/pkg/net/#Dial)로 패키지를 가져오려고 함
- 'proxy.golang.org on 8.8.4.4:53'를 조회
- 하지만 돌아올 `172.17.0.2`는 외부에 노출된 호스트가 아님
- no route to host 에러 발생

### 해결

#### `docker`의 출처 주소 확인

```sh
sudo iptables -t nat -nvL POSTROUTING

Chain POSTROUTING (policy ACCEPT 85 packets, 5196 bytes)
pkts bytes target     prot opt in     out     source               destination
3   184 MASQUERADE  all  --  *      !docker0  172.17.0.0/16        0.0.0.0/0
```

#### `docker` 허용 규칙 추가 및 masquerade

```sh
firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 source address=172.17.0.0/16 accept'
firewall-cmd --zone=public --add-masquerade --permanent
firewall-cmd --reload
```

### 참조 링크

- [No network connectivity to/from Docker CE container on CentOS 8](https://serverfault.com/questions/987686/no-network-connectivity-to-from-docker-ce-container-on-centos-8)
- [NO ROUTE TO HOST network request from container to host-ip:port published from other container](https://forums.docker.com/t/no-route-to-host-network-request-from-container-to-host-ip-port-published-from-other-container/39063)
