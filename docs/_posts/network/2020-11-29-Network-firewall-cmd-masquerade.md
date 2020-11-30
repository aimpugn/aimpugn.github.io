---
title: Network firewall-cmd --add-masquerade
author: aimpugn
date: 2020-11-29 20:20:00 +0900
categories: [network.masquerade]
tags: [linux, network]
math: true
use_mat: true
---

# firewall-cmd --add-masquerade

## Masquerade

### 개요

- `masquerading`은 Source NAT에 대한 장식적인(fancy) 용어. 다른 네트워크로 소통할 수 있게 해주는 것
  - `NAT`: 내부 네트워크에서 외부 네트워크로 나갈 때 공인 IP를 붙여주는 것
    - `snat`: '내부아이피 &#8594; 외부아이피'로 변경
    - `dnat`: '외부 &#8594; 내부'일 때, 내부 네트워크의 특정 컴퓨터의 포트로 보내주는 것
- `masquerade`는 간단하게 머신으로 하여금 들어온 패킷을 출력 인터페이스로 포워딩하기 전에 출처 주소와 출처 포트를 재작성하게 하는 것

### 목적

- 출처 주소 재작성의 요점은 _출력 네트워크가 처리할 수 있는 주소를 사용하는 것_
- 만약 임의의 주소 범위에서 패킷을 출력 인터페이스로 포워딩하고 네트워크가 출처 주소를 모른다면, 작업이 진행되지 않는다

### 커맨드

#### `POSTROUTING` 확인

- `firewall-cmd`는 특히 nat 테이블의 POSTROUTING 체인에 `iptables` 규칙을 추가
- 이는 `iptables -t nat -nvL POSTROUTING`을 실행해보면 뭐가 실제로 이뤄지는지 볼 수 있다

```text
Chain POSTROUTING (policy ACCEPT 15197 packets, 934K bytes)
pkts bytes target     prot opt in     out     source               destination
0     0 MASQUERADE  all  --  *      !docker0  172.17.0.0/16        0.0.0.0/0
```

### `iptalbes`로 `MASQUERADE` 추가할 경우

- 일반적으로 masquerading 규칙을 생성하는 명령어

```text
 iptables -t nat -A POSTROUTING -o <인터페이스> -j MASQUERADE
```

- 라우팅된 후 인터페이스를 떠나는(`-o <인터페이스>`)에 대해, 출처 주소(source address)를 `<인터페이스>`의 주소로 변경하라는 것
- 자동으로 연결 추적 항목(connection tracking entry)을 추가
- 이 방식으로 `masquerade` 된 연결에 대한 패킷들은 시스템을 통해 돌아올 때 원래 주소와 포트로 복원(reinstated)된다

### [라우팅](https://m.blog.naver.com/rpg2003a/221179917206)

- 라우팅이란 간단하게 시스템이 수신하는 것을 트래픽을 묵묵히(말없이, dumbly) 트래픽의 목적지에 따라 통과시키는 것
- iptables NAT 같은 것은 라우팅이 발생한 후 방출되는 패킷을 변경할 수 있게 한다
- `masquerade`가 서버를 라우터로 만드는 건 아니다.

#### 외부/내부/가상머신 조건

##### <외부 통신 인터페이스>

| 항목 | 내용           |
| ---- | -------------- |
| ipv4 | 192.168.100.50 |
| SM   | 255.255.255.0  |
| GW   | 192.168.100.2  |
| DNS  | 8.8.8.8        |

##### <내부 통신 인터페이스>

| 항목 | 내용              |
| ---- | ----------------- |
| ipv4 | 192.168.**200.2** |
| SM   | 255.255.255.0     |

##### <가상머신>

| 항목 | 내용              |
| ---- | ----------------- |
| ipv4 | 192.168.200.100   |
| SM   | 255.255.255.0     |
| GW   | 192.168.**200.2** |
| DNS  | 8.8.8.8           |

#### 포워딩 허용

```shell
// 포워딩 허용
echo 1 > /proc/sys/net/ipv4/ip_forward
// 시스템 재부팅 후에도 자동 적용
sysctl -w net.ipv4.ip_forward=1
```

#### `firewall` 비활성화

- 모든 패킷에 대해 허용

#### `iptaables` 모든 정책 DROP으로 변경

```bash
iptables -P INPUT DROP
iptables -P OUTPUT DROP
iptables -P FORWARD DROP

# 결과
iptables -L -t nat
Chain PREROUTING (policy DROP)
target     prot opt source               destination

Chain POSTROUTING (policy DROP)
target     prot opt source               destination

Chain OUTPUT (policy DROP)
target     prot opt source               destination
```

#### `FORWARD` 정책에 인터페이스 입/출력 허용

```
iptables -A FORWARD -i <내부 통신 인터페이스> -j ACCEPT                 // <내부 통신 인터페이스>의 입력 포워딩
iptables -A FORWARD -o <내부 통신 인터페이스> -j ACCEPT                 // <내부 통신 인터페이스>의 출력 포워딩
iptables -n nat -A POSTROUTING -o <외부 통신 인터페이스> -j MASQUERADE  // <외부 통신 인터페이스>의 출력 패킷 MASQUERADE
service iptables save
service iptables restart
```

##### `dnat`와 `PREROUTING`

- 패킷 &#8592; 인터페이스 &#8592; raw PREROUTING &#8592; [mangle](https://marcokhan.tistory.com/49) PREROUTING &#8592; nat PREROUTING &#8592; Routing Decision

##### `snat`와 `POSTROUTING`

- raw OUTPUT &#8592; mangle OUPUT &#8592; nat OUTPUT &#8592; filter OUTPUT &#8592; Routing Decision &#8592; mangle POSTROUTING &#8592; nat POSTROUTING

##### `MASQUERADE`

- 가상머신(`192.168.200.100`) &#8592; <내부 통신 인터페이스>(`192.168.200.2`)의 포워딩 &#8592; <외부 통신 인터페이스>(`192.168.200.50`)으로 `MASQUERADE`

## 참조

- [reddit comment](https://www.reddit.com/r/linuxadmin/comments/7iom6e/what_does_firewallcmd_addmasquerade_do/)
- [iptables - masquerade](https://m.blog.naver.com/rpg2003a/221179917206)
- [What is the mangle table in iptables?](https://serverfault.com/questions/467756/what-is-the-mangle-table-in-iptables)
- [3.2. mangle table](http://www.faqs.org/docs/iptables/mangletable.html)
- [IP masquerade + iptables](http://egloos.zum.com/enigma777/v/3279346)
