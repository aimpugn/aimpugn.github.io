---
title: CI/CD Pipeline
author: aimpugn
date: 2021-05-10 20:00:00 +0900
categories: [docker]
tag: [docker, ci/cd]
---

- [서버 설정](#서버-설정)
  - [vultr 서버에 도메인 등록](#vultr-서버에-도메인-등록)
    - [godaddy 네임서버 설정](#godaddy-네임서버-설정)
    - [vultr DNS 도메인 설정](#vultr-dns-도메인-설정)
  - [Let's encrypt 인증서 설치](#lets-encrypt-인증서-설치)
    - [nginx + CentOS/RHEL 8 crtbot](#nginx--centosrhel-8-crtbot)
      - [확인 사항](#확인-사항)
      - [`certbot` 설치](#certbot-설치)
        - [Installing snap on CentOS](#installing-snap-on-centos)
        - [로그아웃 후 다시 로그인 하거나 시스템 재시작하여 snap의 경로가 정확하게 업데이트 됐는지 확인](#로그아웃-후-다시-로그인-하거나-시스템-재시작하여-snap의-경로가-정확하게-업데이트-됐는지-확인)
        - [snap 사용한 certbot 설치](#snap-사용한-certbot-설치)
        - [권한 동의서 확인](#권한-동의서-확인)
        - [nginx 설정 변경](#nginx-설정-변경)
- [Docker + Kubernetes + Helm](#docker--kubernetes--helm)
  - [Docker](#docker)
    - [Docker - install on centos](#docker---install-on-centos)
- [Kubernetes](#kubernetes)
  - [Kubernetes 개요](#kubernetes-개요)
    - [Controller Node](#controller-node)
    - [Worder Node](#worder-node)
  - [kubeadm, kubelet 및 kubectl 설치](#kubeadm-kubelet-및-kubectl-설치)
    - [kubectl 설치](#kubectl-설치)
    - [kubeadm 설치](#kubeadm-설치)
      - [swap space 제거](#swap-space-제거)
      - [iptables가 브리지된 트래픽을 보게 하기](#iptables가-브리지된-트래픽을-보게-하기)
      - [컨트롤 플레인 노드에서 kubelet이 사용하는 cgroup 드라이버 구성](#컨트롤-플레인-노드에서-kubelet이-사용하는-cgroup-드라이버-구성)
      - [`kubeadm init`](#kubeadm-init)
        - [옵션들](#옵션들)
          - [`--apiserver-advertise-address`](#--apiserver-advertise-address)
          - [`--pod-network-cidr`](#--pod-network-cidr)
          - [`--service-cidr`](#--service-cidr)
        - [트러블 슈팅](#트러블-슈팅)
          - [[[kubelet-check] Initial timeout of 40s passed 발생 시](https://stackoverflow.com/a/57655546)](#kubelet-check-initial-timeout-of-40s-passed-발생-시)
          - [The connection to the server localhost:8080 was refused - did you specify the right host or port?](#the-connection-to-the-server-localhost8080-was-refused---did-you-specify-the-right-host-or-port)
        - [init 결과](#init-결과)
  - [Network](#network)
    - [Network 개요](#network-개요)
    - [Pod 네트워크 플러그인](#pod-네트워크-플러그인)
      - [Falnnel](#falnnel)
      - [Weave](#weave)
      - [Calico](#calico)
      - [AWS VPC](#aws-vpc)
    - [pod 네트워크 애드온 설치](#pod-네트워크-애드온-설치)
      - [Weave - Integrating Kubernetes via the Addon](#weave---integrating-kubernetes-via-the-addon)
      - [`kubeadm join`](#kubeadm-join)
        - [토큰 생성 방법](#토큰-생성-방법)
        - [`kubeadm join`으로 클러스터에 조인](#kubeadm-join으로-클러스터에-조인)
        - [`kubeadm join` 트러블슈팅](#kubeadm-join-트러블슈팅)
          - [ERROR FileContent--proc-sys-net-ipv4-ip_forward](#error-filecontent--proc-sys-net-ipv4-ip_forward)
          - [The cluster-info ConfigMap does not yet contain a JWS signature for token ID "TOKEN_ID", will try again](#the-cluster-info-configmap-does-not-yet-contain-a-jws-signature-for-token-id-token_id-will-try-again)
    - [Kubernetes Networking](#kubernetes-networking)
    - [Cluster Networking](#cluster-networking)
- [Ansible](#ansible)
  - [Ansible 개요](#ansible-개요)
  - [Ansible 설치 on CentOS](#ansible-설치-on-centos)
  - [Ansible command sheel completion](#ansible-command-sheel-completion)
  - [`hosts` 설정](#hosts-설정)
- [Helm charts](#helm-charts)
  - [Helm charts 개요](#helm-charts-개요)
  - [Helm charts 설치](#helm-charts-설치)
- [GitLab](#gitlab)
  - [GitLab 개요](#gitlab-개요)
  - [GitLab 리눅스 패키지로 설치](#gitlab-리눅스-패키지로-설치)
    - [GitLab 리눅스 패키지로 설치 시 요구 사항](#gitlab-리눅스-패키지로-설치-시-요구-사항)
      - [OS](#os)
      - [Git](#git)
      - [GraphicsMagick](#graphicsmagick)
      - [Mail server](#mail-server)
      - [Exiftool](#exiftool)
      - [Ruby](#ruby)
      - [Go](#go)
      - [Node](#node)
      - [System users](#system-users)
      - [postgresql](#postgresql)
        - [설치된 패키지 정보 확인](#설치된-패키지-정보-확인)
        - [내장 PostgreSQL 모듈 비활성화](#내장-postgresql-모듈-비활성화)
        - [postgresql12 설치](#postgresql12-설치)
- [참조](#참조)

# 서버 설정

## vultr 서버에 도메인 등록

### godaddy 네임서버 설정

- 네임 서버 추가

| DNS           |
| ------------- |
| ns1.vultr.com |
| ns2.vultr.com |

### [vultr DNS 도메인 설정](https://www.vultr.com/docs/introduction-to-vultr-dns)

| Type  | Name   | Data               | TTL |
| ----- | ------ | ------------------ | --- |
| A     |        | `IP ADDRESS`       | 300 |
| A     | www    | `IP ADDRESS`       | 300 |
| A     | gitlab | `IP ADDRESS`       | 300 |
| CNAME | *      | `DOMAIN NAME`      | 300 |
| MX    |        | `mail.DOMAIN NAME` |     |

## Let's encrypt 인증서 설치

### [nginx + CentOS/RHEL 8 crtbot](https://certbot.eff.org/lets-encrypt/centosrhel8-nginx)

#### 확인 사항

- cli
- 80 포트 오픈된 http 웹사이트
- server에 호스트되고, ssh 통해 접근 가능하고 sudo 권한 있어야 함
- (옵션) 와일드카드 인증서 필요한 경우 `DNS Credentials` 필요

#### `certbot` 설치

> The Certbot snap supports the x86_64, ARMv7, and ARMv8 architectures.  
> While we strongly recommend that most users install Certbot through the snap,  
> you can find alternate installation instructions [here](https://certbot.eff.org/docs/install.html#snap).

##### [Installing snap on CentOS](https://snapcraft.io/docs/installing-snap-on-centos)

```bash
dnf install epel-release
dnf upgrade

yum install snapd
systemctl enable --now snapd.socket
ln -s /var/lib/snapd/snap /snap
```

##### 로그아웃 후 다시 로그인 하거나 시스템 재시작하여 snap의 경로가 정확하게 업데이트 됐는지 확인

```terminal
# snap install core;
Download snap "core" (10958) from channel "stable"                                                                         0%  464kB/s 3m43s2021-04-15T20:34:29+09:00 INFO Waiting for automatic snapd restart...
core 16-2.49.2 from Canonical✓ installed
# snap refresh core
snap "core" has no updates available
```

##### snap 사용한 certbot 설치

```terminal
# snap install --classic certbot
certbot 1.14.0 from Certbot Project (certbot-eff✓) installed
# ln -s /snap/bin/certbot /usr/bin/certbot
```

##### [권한 동의서](https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf) 확인

##### nginx 설정 변경

- `certbot --nginx` 명령어 실행하면 자동으로 Nginx 설정을 변경하여 적용
- 만약 직접 수정하고 싶은 경우 `certbot certonly --nginx` 사용

```terminal
# certbot --nginx

Which names would you like to activate HTTPS for?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: vhost0.aimpugn.me
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
Requesting a certificate for vhost0.aimpugn.me
Performing the following challenges:
http-01 challenge for vhost0.aimpugn.me
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/aimpugn.me.conf
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/aimpugn.me.conf

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://vhost0.aimpugn.me
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   <PATH>
   Your key file has been saved at:
   <PATH>
   Your certificate will expire on 2021-07-14. To obtain a new or
   tweaked version of this certificate in the future, simply run
   certbot again with the "certonly" option. To non-interactively
   renew *all* of your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

- 설정 변경 후 conf 테스트, 그리고 [설정 리로드](https://docs.nginx.com/nginx/admin-guide/basic-functionality/runtime-control/)

```terminal
# nginx -t
# nginx -s reload
```
  
# Docker + Kubernetes + Helm

## Docker

### [Docker - install on centos](https://docs.docker.com/engine/install/centos/)

- 컨테이너 런타임으로 도커 설치
- 쿠버네티스는 `컨테이너 런타임 인터페이스(CRI)`를 사용하여 사용자가 선택한 컨테이너 런타임과 인터페이스(대면)
  - `컨테이너 런타임 인터페이스(CRI)`? kubelet과 컨테이너 런타임을 통합시키기 위한 API
- [컨테이너 런타임#도커](https://kubernetes.io/ko/docs/setup/production-environment/container-runtimes/#%EB%8F%84%EC%BB%A4)] 참조

```bash
yum remove  docker \
            docker-client \
            docker-client-latest \
            docker-common \
            docker-latest \
            docker-latest-logrotate \
            docker-logrotate \
            docker-engine

yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 최신 버전으로 설치된다
yum install docker-ce docker-ce-cli containerd.io
```

- 컨테이너의 `cgroup` 관리에 systemd를 사용하도록 도커 데몬을 구성
  - `cgroup`? Control group은 프로세스에 할당된 리소스를 제한하는데 사용

```bash
# https://kubernetes.io/ko/docs/setup/production-environment/container-runtimes/#containerd
# 컨테이너 런타임과 kubelet이 systemd를 cgroup 드라이버로 사용하도록 설정을 변경하면 시스템이 안정화된다. 
# 도커에 대해 구성하려면, native.cgroupdriver=systemd를 설정한다.
mkdir /etc/docker
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

cat /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}

sudo systemctl enable docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

# Kubernetes

## Kubernetes 개요

- `kubectl` $\to$ curl GET REST API $\to$ `API(objects, pod, deployment)` $\to$ `dtcd`(B+tree key-value storing sequestered database)
- `pod`: Kubernetes installation을 구현한 것
- `namespace`: 직접 생성한 것과 자동으로 생성된 것을 구별하기 위해 사용

### Controller Node

- `etcd`
- `apiserver`
- `scheduler`

### Worder Node

- `kublet`: 포드가 사용 가능함 확인하기 위해 요청을 컨테이너 엔진으로 넘긴다
- `kube-proxy`: 모든 노드에서 실행되며 iptables 사용하여 Kubernetes 컴포넌트에 연결하는 인터페이스 제공
- `supervisord`: `kubelet`과 docker process들이 사용 가능한지 모니터링
- `network agent`: `weave` 같은 소프트웨어로 정의된 네트워크 솔루션 구현
- `logging`: CNCF 프로젝트 `Flentd` 사용. `Fluentd` 에이전트는 반드시 k8s 노드에 설치되어야 함

## [kubeadm, kubelet 및 kubectl 설치](https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)

| 패키지    | 설명                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `kubeadm` | 클러스터를 부트스트랩하는 명령                                                         |
| `kubelet` | 클러스터의 모든 머신에서 실행되는 파드와 컨테이너 시작과 같은 작업을 수행하는 컴포넌트 |
| `kubectl` | 클러스터와 통신하기 위한 커맨드 라인 유틸리티                                          |

- `kubeadm`이 설치하려는 쿠버네티스 컨트롤 플레인의 버전과 `kubelet` 또는 `kubectl` 버전이 일치하는지 확인
  - 컨트롤 플레인 버전과 `kubelet`:
    - 하나의 마이너 버전 차이 지원
  - `kubelet` 버전과 API 서버 버전:
    - `kubelet` 버전은 API 서버 버전보다 높을 수 없다
    - `kubelet` 버전 < `kube-apiserver` 버전
- redha distribution

### [kubectl 설치](https://kubernetes.io/ko/docs/tasks/tools/install-kubectl-linux/)

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

version --client
Client Version: version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.0", GitCommit:"cb303e613a121a29364f75cc67d3d580833a7479", GitTreeState:"clean", BuildDate:"2021-04-08T16:31:21Z", GoVersion:"go1.16.1", Compiler:"gc", Platform:"linux/amd64"}
```

### [kubeadm 설치](https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)

#### swap space 제거

```bash
vi /etc/fstab
# swap 부분을 주석 처리
# /dev/mapper/centos-swap ... 
```

- 왜 스왑 제거?
  - [swap 메모리 사용하도록 노드 실행하면, 많은 isolation 속성들을 잃게 된다.](https://discuss.kubernetes.io/t/swap-off-why-is-it-necessary/6879)
  - [Kubelet/Kubernetes should work with Swap Enabled](https://github.com/kubernetes/kubernetes/issues/53533)
  - [Why Kubernetes Hates Linux Swap?](https://medium.com/tailwinds-navigator/kubernetes-tip-why-disable-swap-on-linux-3505f0250263)

#### iptables가 브리지된 트래픽을 보게 하기

- br_netfilter 모듈이 로드되었는지 확인
  
```
lsmod | grep br_netfilter

br_netfilter           24576  0
bridge                188416  1 br_netfilter
```

- sysctl 구성에서 `net.bridge.bridge-nf-call-iptables` 가 1로 설정되어 있는지 확인
  - `net.bridge.bridge-nf-call-iptables`는?
    - [bridge로 송수신(traversing the bridge)되는 패킷을 처리하기 위해 `iptables`로 보낼 것인지 여부 제어](https://wiki.libvirt.org/page/Net.bridge.bridge-nf-call_and_sysctl.conf)
  - CentOS에서 `net.bridge.bridge-nf-call-iptables` 기본값은 0
    - bridge 네트워크 통해 송/수신되는 패킷이 iptable 설정을 우회함을 의미
  - `net.bridge.bridge-nf-call-iptables`를 1로 변경하는 것은, [bridge 컨텍스트에서, `FORWARD`는 한 브릿지 포트에서 다른 브릿지 포트로 패킷을 포워딩함을 의미](https://news.ycombinator.com/item?id=16427686)
  - `firewalld`는 내부적으로 `iptables`를 사용하고, [RHEL/CentOS7에서 `iptables`를 우회해서 트래픽이 정확하게 라우팅되지 않는 이슈가 있음](https://github.com/kubernetes/website/issues/3943#issuecomment-306542260)

```
sysctl --all | grep bridge
net.bridge.bridge-nf-call-arptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-filter-pppoe-tagged = 0
net.bridge.bridge-nf-filter-vlan-tagged = 0
net.bridge.bridge-nf-pass-vlan-input-dev = 0
```

- [네트워크 플러그인 요구 사항](https://kubernetes.io/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EC%9A%94%EA%B5%AC-%EC%82%AC%ED%95%AD)
  - iptables 프록시가 올바르게 작동하는지 확인

```bash
# repo 추가
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# permissive 모드로 SELinux 설정(효과적으로 비활성화)
# 컨테이너가 호스트 파일시스템(예를 들어, 파드 네트워크에 필요한)에 접근하도록 허용하는 데 필요
sudo setenforce 0
sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

sudo systemctl enable --now kubelet

Created symlink /etc/systemd/system/multi-user.target.wants/kubelet.service → /usr/lib/systemd/system/kubelet.service.
```

- kubelet에서 cgroup driver를 systemd 사용하도록 수정 필요한 경우
  - [The kubelet drop-in file for systemd](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd)
  - [Failed to get kubelets cgroup](https://stackoverflow.com/a/57456786)

#### [컨트롤 플레인 노드에서 kubelet이 사용하는 cgroup 드라이버 구성](https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#%EC%BB%A8%ED%8A%B8%EB%A1%A4-%ED%94%8C%EB%A0%88%EC%9D%B8-%EB%85%B8%EB%93%9C%EC%97%90%EC%84%9C-kubelet%EC%9D%B4-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-cgroup-%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B2%84-%EA%B5%AC%EC%84%B1)

- 도커 사용 시
  - kubeadm은 `kubelet 용 cgroup 드라이버`를 자동으로 감지
  - 런타임 중에 `/var/lib/kubelet/config.yaml` 파일에 설정
- 컨테이너 런타임과 kubelet이 systemd를 cgroup 드라이버로 사용하도록 설정을 변경하면 시스템이 안정화된다.
- 도커에 대해 구성하려면, native.cgroupdriver=systemd를 설정한다.
- 또한 `kubelet`에서 사용하는 `cgroupDriver` 항목도 `systemd`로 설정

```yaml
# kubeadm-custom-config.yaml
# kubeadm init --config /path/to/kubeadm-custom-config.yaml 
# https://kubernetes.io/ko/docs/setup/production-environment/container-runtimes/#containerd
# https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/
# kubeadm-config.yaml
kind: ClusterConfiguration # required
apiVersion: kubeadm.k8s.io/v1beta2
# kubernetesVersion: v1.21 # version "v1.21" doesn't match patterns for neither semantic version nor labels (stable, latest, ...) 에러 발생
# https://github.com/kubernetes/kubernetes/blob/0f1d105f8d3e114f0bf47307513fe519a71351a2/cmd/kubeadm/app/util/version.go#L72 참조
kubernetesVersion: latest-1.21
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

- kubelet 등 포트 오픈 필요한 경우 [firewalld로 open](https://medium.com/platformer-blog/kubernetes-on-centos-7-with-firewalld-e7b53c1316af)

```bash
# 컨트롤 플레인 노드
firewall-cmd --zone=public --permanent --add-port=6443/tcp
firewall-cmd --zone=public --permanent --add-port=2379-2380/tcp
firewall-cmd --zone=public --permanent --add-port=10250/tcp
firewall-cmd --zone=public --permanent --add-port=10251/tcp
firewall-cmd --zone=public --permanent --add-port=10252/tcp

systemctl restart firewalld

# 워커 노드
firewall-cmd --zone=public --permanent --add-port=10250/tcp
firewall-cmd --zone=public --permanent --add-port=30000-32767/tcp
systemctl restart firewalld

# 불필요 rule이 있어서 삭제
# https://stackoverflow.com/a/47015978
firewall-cmd --zone=public --permanent --remove-rich-rule='rule family="ipv4" source address="172.17.0.0/16" accept'
```

- [reload가 안 된다면 종료 후 재시작](https://stackoverflow.com/a/50544307)

```bash
systemctl stop firewalld
pkill -f firewalld
systemctl start firewalld
```

- CentOS8에서 아래처럼 `tc`가 없다고 하는 경우 `dnf install -y iproute-tc`로 설치

```bash
[preflight] Running pre-flight checks
        [WARNING FileExisting-tc]: tc not found in system path
```

#### `kubeadm init`

##### 옵션들

###### `--apiserver-advertise-address`

###### `--pod-network-cidr`

왜 `cidr` 사용? 클러스터 내의 `pods` 간에 통신하기 위해 특별한 가상 네트워크를 생성하는 데 [Container Network Interface](https://github.com/containernetworking/cni) 사용

###### `--service-cidr`

##### 트러블 슈팅

###### [[kubelet-check] Initial timeout of 40s passed 발생 시](https://stackoverflow.com/a/57655546)

- 6443 포트에 대한 연결이 계속 끊기는데 왜?
  - `kubeadm init`이 정상적으로 마치지 않았기 때문
  - 이번에 수정한 건 두 가지인데
    - `dnf install -y iproute-tc` 설치
    - `firewalld` 비활성화(TO-DO: 이래도 되나? 더 확인해보자...)
  - `dnf install -y iproute-tc` 설치하고 다시 시도하니 80초 걸려서 됐는데, 정확히 이 때문인지 아니면 방화벽을 비활성화해서 괜찮아진 건지 모르겠다

###### The connection to the server localhost:8080 was refused - did you specify the right host or port?

- `admin.conf` 설정이 안 되어 있어서 발생
- 루트 아닌 계정으로는 `$HOME/.kube/config` 파일 생성 필요

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

- 루트 계정인 경우 `export KUBECONFIG=/etc/kubernetes/admin.conf`로도 가능. 단 계정 변경해도 `KUBECONFIG`로 export된 변수가 남아 있으므로, 루트 계정 아닌 다른 계정으로 변경하면, `KUBECONFIG`를 새로 export해야 한다

##### init 결과

```bash
[aimpugn@vultr ~]$ kubectl cluster-info
Kubernetes control plane is running at https://IP_ADDRESS:6443
CoreDNS is running at https://IP_ADDRESS:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.

[aimpugn@vultr ~]$ kubectl get nodes
NAME          STATUS     ROLES                  AGE   VERSION
vultr.guest   NotReady   control-plane,master   12m   v1.21.0
```

## Network

### Network 개요

- [`CNI`](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#cni) 기반 네트워크 플러그인 설치 안 되면, `Cluster DNS (CoreDNS)`가 시작되지 않는다
- 파드 통신을 위해 네트워크 애드온이 반드시 설치되어야 한다
- `CNI(Container Network Interface)`는 플러그인과 함께 네트워크 구현
- 네트워크 종류

| 종류                           |
| ------------------------------ |
| container 간 네트워크          |
| pod 간 네트워크                |
| pod와 service 간 네트워크      |
| external과 service 간 네트워크 |

- `network-policy`와 `RBAC` 지원하는 애드온 찾아야 한다

### [Pod 네트워크 플러그인](https://kubernetes.io/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model)

#### Falnnel

- `VXLAN` 같은 여러 백엔드 메커니즘을 사용할 수 있는 클러스트 노드 간의 3계층 IPv4 네트워크

#### Weave

- `CNI` 활성화된 쿠버네티스 클러스터에서 흔히 사용되는 애드온

#### Calico

- IP 캡슐화 사용하는 3계층 네트워크 솔루션
- Kubernetes, OpenStack, OpenShift, Docker 등에서 사용

#### AWS VPC

- AWS 환경에서 사용되는 네트워크 플러그인

### [pod 네트워크 애드온 설치](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)

#### [Weave - Integrating Kubernetes via the Addon](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/)

- [TCP 6783, UDP 6783/6784](https://www.weave.works/docs/net/latest/faq/#ports) 포트가 열려 있어야 한다
- `TCP 6781/6782` 포트는 [`metrics`](https://www.weave.works/docs/net/latest/tasks/manage/metrics#metrics-endpoint-addresses)에 사용
- `kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"` 명령어 사용하면, 아래 파일을 받게 된다

```
# https://cloud.weave.works/k8s/net?k8s-version=Q2xpZW50IFZlcnNpb246IHZlcnNpb24uSW5mb3tNYWpvcjoiMSIsIE1pbm9yOiIyMSIsIEdpdFZlcnNpb246InYxLjIxLjAiLCBHaXRDb21taXQ6ImNiMzAzZTYxM2ExMjFhMjkzNjRmNzVjYzY3ZDNkNTgwODMzYTc0NzkiLCBHaXRUcmVlU3RhdGU6ImNsZWFuIiwgQnVpbGREYXRlOiIyMDIxLTA0LTA4VDE2OjMxOjIxWiIsIEdvVmVyc2lvbjoiZ28xLjE2LjEiLCBDb21waWxlcjoiZ2MiLCBQbGF0Zm9ybToibGludXgvYW1kNjQifQo=
[root@vultr ~]# kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
serviceaccount/weave-net created
clusterrole.rbac.authorization.k8s.io/weave-net created
clusterrolebinding.rbac.authorization.k8s.io/weave-net created
role.rbac.authorization.k8s.io/weave-net created
rolebinding.rbac.authorization.k8s.io/weave-net created
daemonset.apps/weave-net created
```

- 네임스페이스 확인

```
[root@vultr ~]# kubectl get pods --all-namespaces
NAMESPACE     NAME                                  READY   STATUS    RESTARTS   AGE
kube-system   coredns-558bd4d5db-9d5b5              1/1     Running   0          5d
kube-system   coredns-558bd4d5db-kpzcd              1/1     Running   0          5d
kube-system   etcd-vultr.guest                      1/1     Running   0          5d
kube-system   kube-apiserver-vultr.guest            1/1     Running   0          5d
kube-system   kube-controller-manager-vultr.guest   1/1     Running   0          5d
kube-system   kube-proxy-tjqwq                      1/1     Running   0          5d
kube-system   kube-scheduler-vultr.guest            1/1     Running   0          5d
kube-system   weave-net-tld6h                       2/2     Running   1          3m19s
```

- 노드 확인하면 상태는 `Ready`이며, 이는 노드가 한 개인 클러스트가 설정 됐으며, 다른 노드 조인 가능함 의미

```
[root@vultr ~]# kubectl get nodes
NAME          STATUS   ROLES                  AGE   VERSION
vultr.guest   Ready    control-plane,master   5d    v1.21.0
```

#### `kubeadm join`

##### [토큰 생성 방법](https://www.serverlab.ca/tutorials/containers/kubernetes/how-to-add-workers-to-kubernetes-clusters/)

##### `kubeadm join`으로 클러스터에 조인

- worker 노드에서 `kubeadm join` 명령어 실행

```bash
kubeadm join <IP_ADDRESS>:6443 --token <TOKEN_ID>.<TOKEN> \ 
                               --discovery-token-ca-cert-hash <hash-type>:<hex-encoded-value>
[preflight] Running pre-flight checks
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Starting the kubelet
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster
```

- 컨트롤 플레인에서 nodes를 조회하면 worker가 조인 되었음 확인 가능하다

```
# kubectl get nodes
NAME             STATUS   ROLES                  AGE    VERSION
vultr.guest      Ready    control-plane,master   5d     v1.21.0
worker-aimpugn   Ready    <none>                 104s   v1.21.0
```

##### `kubeadm join` 트러블슈팅

###### ERROR FileContent--proc-sys-net-ipv4-ip_forward

> [ERROR FileContent--proc-sys-net-ipv4-ip_forward]: /proc/sys/net/ipv4/ip_forward contents are not set to 1  
> [preflight] If you know what you are doing, you can make a check non-fatal with `--ignore-preflight-errors=...`

- [`br_netfilter` 모듈이 필수](https://stackoverflow.com/a/55533372)
- `br_netfilter` 커널 모듈 활성화 $to$ 패킷이 브릿지로 이동하여 iptables에 의해 처리된다
- `echo '1' > /proc/sys/net/ipv4/ip_forward` 명령어로 해결

###### The cluster-info ConfigMap does not yet contain a JWS signature for token ID "TOKEN_ID", will try again

> I0426 15:29:47.674860  391575 token.go:221] [discovery] The cluster-info ConfigMap does not yet contain a JWS signature for token ID "TOKEN_ID", will try again

- 토큰이 만료돼서 join을 하지 못하는 상황
- `kubeadm token create --print-join-command`로 새로운 토큰 발급 받아서 조인 가능

### [Kubernetes Networking](https://github.com/coreos/coreos-kubernetes/blob/master/Documentation/kubernetes-networking.md)

### [Cluster Networking](https://kubernetes.io/docs/concepts/cluster-administration/networking/)

# [Ansible](https://www.ansible.com/)

## Ansible 개요

- 자동화 엔진
  - [클라우드 프로비저닝](https://www.ansible.com/provisioning?hsLang=en-us)
    - [프로비저닝이란?](https://www.redhat.com/ko/topics/automation/what-is-provisioning)
  - [구성 관리](https://www.ansible.com/use-cases/configuration-managements)
  - [애플리케이션 배포](https://www.ansible.com/application-deployment?hsLang=en-us)
  - [인트라 서비스 오케스트레이션](https://www.ansible.com/orchestration?hsLang=en-us)
- agent 사용하지 않으며, 추가적인 custom security infrastructure 불필요
- [`Ansible Playbooks`에서 `YAML` 사용](https://docs.ansible.com/)
- 효과적인 아키텍처
  - 노드에 연결하여 `Ansible modules`라 불리는 작은 프로그램을 push하는 방식으로 작동
  - `Ansible modules`는 원하는 상태의 시스템의 리소스 모델이 되도록 작성
  - 모듈의 라이브러리는 어떤 머신에든 있을 수 있고, 서버, 데몬, 데이터베이스가 필요 없다
- 인벤토리를 간단한 텍스트 파일로 관리
  - 그룹으로 관리되는 머신들의 정보를 갖는 ini 파일을 사용

## [Ansible 설치 on CentOS](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-rhel-centos-or-fedora)

```
# yum install ansible

# ansible --version
ansible 2.9.20
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/root/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python3.6/site-packages/ansible
  executable location = /usr/bin/ansible
  python version = 3.6.8 (default, Aug 24 2020, 17:57:11) [GCC 8.3.1 20191121 (Red Hat 8.3.1-5)]
```

## [Ansible command sheel completion](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#adding-ansible-command-shell-completion)

```
yum install python3-argcomplete
```

## [`hosts` 설정](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#inventory-basics-formats-hosts-and-groups)

```ini
# /etc/ansible/hosts
# - 빈 라인은 무시된다
# - 호스트 그룹은 `[header]` 엘리먼트로 구별된다
# - `hostname` 또는 `ip` 입력 가능
# - `hostname` 또는 `ip`는 여러 그룹의 멤버가 될 수 있다

# 그룹 없는 호스트들은 그룹 헤더 앞에 위치
## green.example.com
## blue.example.com
## 192.168.100.1
## 192.168.100.10

## [webservers] # `webservers` 그룹에 속한 호스트
## alpha.example.org http_port=80 maxRequestsPerChild=808
## beta.example.org
## 192.168.1.100
## 192.168.1.110

## www[001:006].example.com 패턴 있는 여러 호스트의 경우

## [dbservers] `dbservers` 그룹에 속한 데이터베이스 서버들
## db01.intranet.mydomain.net
## db02.intranet.mydomain.net
## 10.25.1.56
## db-[99:101]-node.example.com
master.com

[webservers]
worker.domain.com
```

- ini 설정은 아래와 같이 yaml 설정으로 바꿔 쓸 수 있다

```yaml
all:
  hosts:
    green.example.com:
    blue.example.com:
    192.168.100.1:
    192.168.100.10:
  children:
    webservers:
      hosts:
        alpha.example.org:
          http_port: 80
          maxRequestsPerChild: 808
        beta.example.org:
        192.168.1.100:
        192.168.1.110:
    dbservers:
      hosts:
        db01.intranet.mydomain.net:
        db02.intranet.mydomain.net:
        10.25.1.56:
        db-[99:101]-node.example.com:
```

# Helm charts

## Helm charts 개요

- 쿠버네티스 위한 패키지 매니저이며, `chart`라는 패키징 포맷 사용
  - [`chart`](https://helm.sh/docs/topics/charts/)? 관련된 쿠버네티스 리소스 집합을 기술하는 파일의 모음
- 쉽게 애플리케이션을 패키징, 구성 및 배포할 수 있도록 개발자와 SRE를 돕는다

## [Helm charts 설치](https://helm.sh/docs/intro/install/)

- 설치 스크립트 사용

```
# curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
# chmod 700 get_helm.sh
# ./get_helm.sh
Downloading https://get.helm.sh/helm-v3.5.4-linux-amd64.tar.gz
Verifying checksum... Done.
Preparing to install helm into /usr/local/bin
helm installed into /usr/local/bin/helm
```

- Helm Chart Repository 추가

```
# helm repo add stable https://charts.helm.sh/stable
"stable" has been added to your repositories
```

- [QuickStart Guide](https://helm.sh/docs/intro/quickstart/) 있지만, [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) 인증 기반일 경우 `ServiceAccount` 역할 사용
  - [역할 기반 접근 제어 설정](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#service-account-permissions) 참조
  - 검색해보면 `helm2`에서는 `Tiller`가 있지만, `helm3`에서는 없는데, [쿠버네티스 1.6부터 `RBAC`가 기본 활성화 되므로, 더이상 필요 없게 됐다](https://itnext.io/helm2-vs-helm3-part-1-c76c29106e99)
- `RBAC`가 기본 활성화되는데...
  - [역할 기반 접근 제어로 활성화](https://gardener.cloud/documentation/guides/client_tools/helm/)
  - [Helm Tutorial: How To Install and Configure Helm](https://devopscube.com/install-configure-helm-kubernetes/)
- [`Ingress-nginx`](https://github.com/kubernetes/ingress-nginx) [설치](https://github.com/kubernetes/ingress-nginx/tree/master/charts/ingress-nginx)
  - [Installation Guide](https://kubernetes.github.io/ingress-nginx/deploy/)
  - [Install Chart](https://github.com/kubernetes/ingress-nginx/tree/master/charts/ingress-nginx)

```
# helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
# helm repo update
# helm install ingress-nginx ingress-nginx/ingress-nginx
NAME: ingress-nginx
LAST DEPLOYED: Wed Apr 28 23:55:09 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The ingress-nginx controller has been installed.
It may take a few minutes for the LoadBalancer IP to be available.
You can watch the status by running 'kubectl --namespace default get services -o wide -w ingress-nginx-controller'

An example Ingress that makes use of the controller:

  apiVersion: networking.k8s.io/v1beta1
  kind: Ingress
  metadata:
    annotations:
      kubernetes.io/ingress.class: nginx
    name: example
    namespace: foo
  spec:
    rules:
      - host: www.example.com
        http:
          paths:
            - backend:
                serviceName: exampleService
                servicePort: 80
              path: /
    # This section is only required if TLS is to be enabled for the Ingress
    tls:
        - hosts:
            - www.example.com
          secretName: example-tls

If TLS is enabled for the Ingress, a Secret containing the certificate and key must also be provided:

  apiVersion: v1
  kind: Secret
  metadata:
    name: example-tls
    namespace: foo
  data:
    tls.crt: <base64 encoded cert>
    tls.key: <base64 encoded key>
  type: kubernetes.io/tls
```

- 실행 상태 확인

```
# kubectl --namespace default get services -o wide -w ingress-nginx-controller
NAME                       TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE   SELECTOR
ingress-nginx-controller   LoadBalancer   10.110.64.189   <pending>     80:30687/TCP,443:32008/TCP   45s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=ingress-nginx,app.kubernetes.io/name=ingress-nginx
```

# GitLab

## GitLab 개요

- 오픈소스 DevOps 플랫폼
- [CI/CD pipelines](https://docs.gitlab.com/ee/ci/pipelines/)?
  - [지속적인 통합, 제공(delivery), 배포(deployment)](https://www.redhat.com/ko/topics/devops/what-is-ci-cd)
    - `통합`: 애플리케이션에 대한 새로운 코드 변경 사항이 정기적으로 빌드 및 테스트되어 공유 리포지토리에 통합
    - `제공`: 애플리케이션에 적용한 변경 사항이 버그 테스트를 거쳐 리포지토리에 자동으로 업로드되는 것
    - `배포`: 개발자의 변경 사항을 리포지토리에서 고객이 사용 가능한 프로덕션 환경까지 자동으로 릴리스하는 것
  - [Mastering continuous software development](https://about.gitlab.com/webcast/mastering-ci-cd/)

## [GitLab 리눅스 패키지로 설치](https://docs.gitlab.com/omnibus/installation/)

- [helm 차트로 설치 시 트레이드 오프](https://docs.gitlab.com/ee/install/#choose-the-installation-method)를 고려하여 패키지 설치로 변경

### [GitLab 리눅스 패키지로 설치 시 요구 사항](https://docs.gitlab.com/ee/install/requirements.html)

#### OS

- CentOS8

#### [Git](https://www.programmersought.com/article/33738258266/)

- [.28 이상 추천](https://gitlab.com/gitlab-org/gitaly/-/issues/2959)
- [`gitaly` 설치](https://gitlab.com/gitlab-org/gitaly)
- 버전은 stable 버전에서 최신 버전 선택

```bash
git clone https://gitlab.com/gitlab-org/gitaly.git -b 13-11-stable /tmp/gitaly
cd /tmp/gitaly
make git GIT_PREFIX=/usr/local

git --version # git version 2.31.1
```

#### [GraphicsMagick](https://docs.gitlab.com/ee/install/installation.html#graphicsmagick)

- [CentOS8에 설치하기](https://serverfault.com/a/1004155)

```bash
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm -y
dnf install GraphicsMagick
```

#### [Mail server](https://docs.gitlab.com/ee/install/installation.html#mail-server)

```
dnf install postfix
```

#### [Exiftool](https://docs.gitlab.com/ee/install/installation.html#exiftool)

- [GitLab Workhorse](https://gitlab.com/gitlab-org/gitlab/tree/master/workhorse)에서 업로드된 이미지에서 EXIF 데이터 제거하기 위해서 `exiftool` 필요
- `Workhorse`는?
  - GitLab 위한 리버스 프록시
  - 파일 다운로드, 업로드 Git push/pull 그리고 Git archive 같은 큰(large) HTTP 요청을 핸들링

```bash
dnf install perl-Image-ExifTool
```

#### [Ruby](https://www.tecmint.com/install-ruby-on-centos-rhel-8/)

- Ruby 2.7 이상

```bash
dnf install gnupg2 curl tar
dnf install @ruby

curl -sSL https://get.rvm.io | bash

usermod -aG rvm aimpugn # rvm 그룹에 사용자 추가

source /etc/profile.d/rvm.sh # 시스템 환경 변수 업데이트

rvm reload

rvm requirements # 패키지 요구 사항 설치

rvm list known # 설치 끝나면 설치 가능한 Ruby 버전들 확인 가능

rvm install ruby 2.7.3 # 3.0.1도 있지만, 최신 버전이라 호환이 안 될 수도 있으니 2.7.3 설치
```

- 설치하다 실패. 서버 CPU 사용량이 95%까지 오르더니 멈췄다.
  - 2 cpu + 4GB mem $\to$ 4 cpu + 8GM mem 으로... 업그레이드...

#### [Go](https://docs.gitlab.com/ee/install/installation.html#3-go)

- Go는 설치된 상태라 스킵

```bash
go version
go version go1.15.5 linux/amd64
```

#### [Node](https://docs.gitlab.com/ee/install/installation.html#4-node)

- 데비안이면 `deb.nodesource.com`, 페도라/CentOS면 `rpm.nodesource.com`

```bash
curl -sL "https://rpm.nodesource.com/setup_16.x" | bash - # 리파지토리 추가

yum install nodejs # 설치 완료 후 실행

## Run `sudo yum install -y nodejs` to install Node.js 16.x and npm.
## You may also need development tools to build native addons:
sudo yum install gcc-c++ make
## To install the Yarn package manager, run:
curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
sudo yum install yarn

node --version # v16.1.0
```

#### [System users](https://docs.gitlab.com/ee/install/installation.html#5-system-users)

- `adduser --disabled-login --gecos 'GitLab' git`인데, CentOS의 `adduser`에는 `--disabled-login` 옵션이 없다
- CentOS/Fedora에서 기본적으로 useradd를 사용하면, password 설정 전까지 계정이 disabled 된다. [따라서 password 설정하지 않으면 `--disabled-login`과 같다.](https://serverfault.com/a/514619)
- `adduser -M --system -c 'GitLab' git`
  - `-M`: 홈 디렉토리 생성하지 않음
  - `-c`: `GECOS` 필드 셋업(코멘트)
  - `--system`: 시스템 계정

```bash
adduser -M --system -c 'GitLab' git
```

#### [postgresql](https://docs.gitlab.com/ee/install/installation.html#6-database)

- PostgreSQL 11+ 필요하다
- [CentOS8에 PostgreSQL 12 설치하기](https://computingforgeeks.com/how-to-install-postgresql-12-on-centos-7/) 참조
- 13버전은 [How To Install PostgreSQL 13 on CentOS 7](https://computingforgeeks.com/how-to-install-postgresql-13-on-centos-7/) 참조

```bash
yum install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
```

##### 설치된 패키지 정보 확인

```bash
rpm -qi pgdg-redhat-repo

Name        : pgdg-redhat-repo
Version     : 42.0
Release     : 17
Architecture: noarch
Install Date: 2021년 05월 10일 (월) 오후 09시 56분 50초
Group       : Unspecified
Size        : 11735
License     : PostgreSQL
Signature   : DSA/SHA1, 2021년 05월 05일 (수) 오후 08시 52분 04초, Key ID 1f16d2e1442df0f8
Source RPM  : pgdg-redhat-repo-42.0-17.src.rpm
Build Date  : 2021년 05월 05일 (수) 오후 08시 51분 18초
Build Host  : koji-rhel8-x86-64-pgbuild
Relocations : (not relocatable)
Vendor      : PostgreSQL Global Development Group
URL         : https://yum.postgresql.org
Summary     : PostgreSQL PGDG RPMs- Yum Repository Configuration for Red Hat / CentOS
Description :
This package contains yum configuration for Red Hat Enterprise Linux, CentOS,
and also the GPG key for PGDG RPMs.
```

##### 내장 PostgreSQL 모듈 비활성화

```bash
dnf search postgresql12
dnf -qy module disable postgresql
```

##### postgresql12 설치

```bash
install postgresql13 postgresql12-server
```

- db 초기화(메인 구성 파일은 `/var/lib/pgsql/12/data/postgresql.conf`에 위치)

```bash
# PGDATA 경로 확인
[root@vultr ~]# systemctl show -p Environment postgresql-13.service
Environment=PGDATA=/var/lib/pgsql/12/data/ PG_OOM_ADJUST_FILE=/proc/self/oom_score_adj PG_OOM_ADJUST_VALUE=0

[root@vultr downloads]# /usr/pgsql-13/bin/postgresql-13-setup initdb
Initializing database ... OK
```

- db 서버 시작 및 활성화

```bash
systemctl enable --now postgresql-12
```

- postgres 어드민 유저 설정

```bash
psql -c "ALTER USER postgres WITH PASSWORD '<PASSWORD>'"
```

- GitLab 위한 데이터베이스 유저 생성

```bash
sudo -u postgres psql -d template1 -c "CREATE USER git CREATEDB;"
```

- `pg_trgm` 확장 설치.

```bash
sudo -u postgres psql -d template1 -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

- [`ERROR: could not open extension control file ".../extension/pg_trgm.control": No such file or directory"` 에러 발생 시 `postgresql12-contrib` 설치](https://dba.stackexchange.com/a/165301)

```bash
dnf install postgresql12-contrib
```

- `btree-gist` 확장 설치

```bash
sudo -u postgres psql -d template1 -c "CREATE EXTENSION IF NOT EXISTS btree_gist;"
```

- GitLab 프로덕션 데이터베이스 생성 및 데이터베이스의 모든 권한을 `git` 사용자에 부여

```bash
sudo -u postgres psql -d template1 -c "CREATE DATABASE gitlabhq_production OWNER git;"
```

- [`pg_hba.conf` 파일에서 접근 인증 방식을 `peer`에서 `md5`로 변경](https://gist.github.com/AtulKsol/4470d377b448e56468baef85af7fd614)하고 재시작
- [스택오버플로 링크](https://stackoverflow.com/a/21889759)

```shell
$ vi /var/lib/pgsql/12/data/pg_hba.conf

# TYPE DATABASE USER ADDRESS METHOD
local  all      all          md5


$ systemctl restart postgresql-12
```

- `pg_trgm`과 `btree_gist` 확장이 활성화 되어 있는지 확인

```sql
SELECT name, true AS enabled
FROM pg_available_extensions
WHERE name IN ('pg_trgm', 'btree_gist')
AND installed_version IS NOT NULL;

    name    | enabled
------------+---------
 pg_trgm    | t
 btree_gist | t
(2 rows)
```

# 참조

- [Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application)
- [Building a private CI/CD pipeline with Java and Docker in the Cloud](https://youtu.be/sMvxauOLKLs)
- [Containerizing microservices](https://openliberty.io/guides/containerize.html)
- [Creating a cluster with kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
