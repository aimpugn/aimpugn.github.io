---
title: CI/CD Pipeline
author: aimpugn
date: 2021-04-18 15:00:00 +0900
categories: [docker]
tag: [docker, ci/cd]
---

- [Docker 사용한 CI/CD](#docker-사용한-cicd)
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
      - [kubectl 설치](#kubectl-설치)
      - [kubeadm 설치](#kubeadm-설치)
        - [swap space 제거](#swap-space-제거)
        - [iptables가 브리지된 트래픽을 보게 하기](#iptables가-브리지된-트래픽을-보게-하기)
        - [kubeadm, kubelet 및 kubectl 설치](#kubeadm-kubelet-및-kubectl-설치)
        - [컨트롤 플레인 노드에서 kubelet이 사용하는 cgroup 드라이버 구성](#컨트롤-플레인-노드에서-kubelet이-사용하는-cgroup-드라이버-구성)
        - [`kubeadm init`](#kubeadm-init)
        - [옵션들](#옵션들)
          - [`--apiserver-advertise-address`](#--apiserver-advertise-address)
          - [`--pod-network-cidr`](#--pod-network-cidr)
          - [`--service-cidr`](#--service-cidr)
        - [트러블 슈팅](#트러블-슈팅)
          - [init 결과](#init-결과)
      - [Network](#network)
        - [Kubernetes Networking](#kubernetes-networking)
        - [Cluster Networking](#cluster-networking)
  - [gitlab 설치(Cent OS 7)](#gitlab-설치cent-os-7)
    - [1. 필요 dependencies 설치 및 구성](#1-필요-dependencies-설치-및-구성)
    - [2. Gitlab 패키지 리파지토리 추가 및 패키지 설치](#2-gitlab-패키지-리파지토리-추가-및-패키지-설치)
      - [script.rpm.sh](#scriptrpmsh)
      - [config_file.repo](#config_filerepo)
      - [구성 설정 파일로 설치](#구성-설정-파일로-설치)
    - [3. GitLab Docker images](#3-gitlab-docker-images)
  - [참조](#참조)

# Docker 사용한 CI/CD

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

###### 로그아웃 후 다시 로그인 하거나 시스템 재시작하여 snap의 경로가 정확하게 업데이트 됐는지 확인

```terminal
# snap install core;
Download snap "core" (10958) from channel "stable"                                                                         0%  464kB/s 3m43s2021-04-15T20:34:29+09:00 INFO Waiting for automatic snapd restart...
core 16-2.49.2 from Canonical✓ installed
# snap refresh core
snap "core" has no updates available
```

###### snap 사용한 certbot 설치

```terminal
# snap install --classic certbot
certbot 1.14.0 from Certbot Project (certbot-eff✓) installed
# ln -s /snap/bin/certbot /usr/bin/certbot
```

###### [권한 동의서](https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf) 확인

###### nginx 설정 변경

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
  
## Docker + Kubernetes + Helm

### Docker

#### [Docker - install on centos](https://docs.docker.com/engine/install/centos/)

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

### Kubernetes

#### Kubernetes 개요

- `kubectl` $\to$ curl GET REST API $\to$ `API(objects, pod, deployment)` $\to$ `dtcd`(B+tree key-value storing sequestered database)

##### Controller Node

- `etcd`
- `apiserver`
- `scheduler`

##### Worder Node

- `kublet`: 포드가 사용 가능함 확인하기 위해 요청을 컨테이너 엔진으로 넘긴다
- `kube-proxy`: 모든 노드에서 실행되며 iptables 사용하여 Kubernetes 컴포넌트에 연결하는 인터페이스 제공
- `supervisord`: `kubelet`과 docker process들이 사용 가능한지 모니터링
- `network agent`: `weave` 같은 소프트웨어로 정의된 네트워크 솔루션 구현
- `logging`: CNCF 프로젝트 `Flentd` 사용. `Fluentd` 에이전트는 반드시 k8s 노드에 설치되어야 함

#### [kubectl 설치](https://kubernetes.io/ko/docs/tasks/tools/install-kubectl-linux/)

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

version --client
Client Version: version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.0", GitCommit:"cb303e613a121a29364f75cc67d3d580833a7479", GitTreeState:"clean", BuildDate:"2021-04-08T16:31:21Z", GoVersion:"go1.16.1", Compiler:"gc", Platform:"linux/amd64"}
```

#### [kubeadm 설치](https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)

##### swap space 제거

```bash
vi /etc/fstab
# swap 부분을 주석 처리
# /dev/mapper/centos-swap ... 
```

- 왜 스왑 제거?
  - [swap 메모리 사용하도록 노드 실행하면, 많은 isolation 속성들을 잃게 된다.](https://discuss.kubernetes.io/t/swap-off-why-is-it-necessary/6879)
  - [Kubelet/Kubernetes should work with Swap Enabled](https://github.com/kubernetes/kubernetes/issues/53533)
  - [Why Kubernetes Hates Linux Swap?](https://medium.com/tailwinds-navigator/kubernetes-tip-why-disable-swap-on-linux-3505f0250263)

##### iptables가 브리지된 트래픽을 보게 하기

- br_netfilter 모듈이 로드되었는지 확인
  
```
lsmod | grep br_netfilter

br_netfilter           24576  0
bridge                188416  1 br_netfilter
```

- sysctl 구성에서 `net.bridge.bridge-nf-call-iptables` 가 1로 설정되어 있는지 확인
  - `net.bridge.bridge-nf-call-iptables`는? [bridge로 송수신(traversing the bridge)되는 패킷을 처리하기 위해 `iptables`로 보낼 것인지 여부 제어](https://wiki.libvirt.org/page/Net.bridge.bridge-nf-call_and_sysctl.conf)
  - CentOS에서 `net.bridge.bridge-nf-call-iptables` 기본값은 0 $\to$ bridge 네트워크 통해 송/수신되는 패킷이 iptable 설정을 우회함을 의미
  - [bridge 컨텍스트에서, `FORWARD`는 한 브릿지 포트에서 다른 브릿지 포트로 패킷을 포워딩함을 의미](https://news.ycombinator.com/item?id=16427686)

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

##### [kubeadm, kubelet 및 kubectl 설치](https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)

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

##### [컨트롤 플레인 노드에서 kubelet이 사용하는 cgroup 드라이버 구성](https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#%EC%BB%A8%ED%8A%B8%EB%A1%A4-%ED%94%8C%EB%A0%88%EC%9D%B8-%EB%85%B8%EB%93%9C%EC%97%90%EC%84%9C-kubelet%EC%9D%B4-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-cgroup-%EB%93%9C%EB%9D%BC%EC%9D%B4%EB%B2%84-%EA%B5%AC%EC%84%B1)

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

##### `kubeadm init`

##### 옵션들

###### `--apiserver-advertise-address`

###### `--pod-network-cidr`

- 왜 `cidr` 사용? 클러스터 내의 `pods` 간에 통신하기 위해 특별한 가상 네트워크를 생성하는 데 [Container Network Interface](https://github.com/containernetworking/cni) 사용

###### `--service-cidr`

##### 트러블 슈팅

- [[kubelet-check] Initial timeout of 40s passed 발생 시](https://stackoverflow.com/a/57655546)
- 6443 포트에 대한 연결이 계속 끊기는데 왜?
  - `kubeadm init`이 정상적으로 마치지 않았기 때문
  - `dnf install -y iproute-tc` 설치하고 다시 시도하니 80초 걸려서 됐는데, 정확히 이 때문인지는 모르겠다. 계속 기다려서 실패한 적도 있기 때문에, `tc` 명령어가 없어서 그랬던 게 아닌가 싶다.

###### init 결과

```bash
[aimpugn@vultr ~]$ kubectl cluster-info
Kubernetes control plane is running at https://IP_ADDRESS:6443
CoreDNS is running at https://IP_ADDRESS:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.

[aimpugn@vultr ~]$ kubectl get nodes
NAME          STATUS     ROLES                  AGE   VERSION
vultr.guest   NotReady   control-plane,master   12m   v1.21.0
```

#### Network

##### [Kubernetes Networking](https://github.com/coreos/coreos-kubernetes/blob/master/Documentation/kubernetes-networking.md)

##### [Cluster Networking](https://kubernetes.io/docs/concepts/cluster-administration/networking/)

## gitlab 설치(Cent OS 7)

### 1. 필요 dependencies 설치 및 구성

- 방화벽에 HTTP, HTTPS, SSH 접근 허용. 이미 되어 있다면 불필요.

```bash
sudo yum install -y curl policycoreutils-python openssh-server perl
sudo systemctl enable sshd
sudo systemctl start sshd
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld
```

- 알림 이메일 전송 위한 Postfix 설치. 이메일 전송에 다른 솔루션 사용하고 싶다면 스킵하고 외부 SMTP 서버 설정.

```bash
sudo yum install postfix
sudo systemctl enable postfix
sudo systemctl start postfix
```

### 2. Gitlab 패키지 리파지토리 추가 및 패키지 설치

```
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
```

#### script.rpm.sh

- detect_os() 함수에서 현재 os명(centos, poky, opensuse, fedora 등)과 dist 버전 판별
- 설정 스크립트를 가져올 url 결정하여 구성 파일 가져와서 `yum_repo_path=/etc/yum.repos.d/gitlab_gitlab-ee.repo`에 저장

```bash
https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/config_file.repo?os={$os}&dist={$dist}&source=script
https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/config_file.repo?os=centos&dist=8&source=script
```

#### config_file.repo

```ini
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://packages.gitlab.com/gitlab/gitlab-ee/el/8/$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey
       https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey/gitlab-gitlab-ee-3D645A26AB9FBD22.pub.gpg
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

[gitlab_gitlab-ee-source]
name=gitlab_gitlab-ee-source
baseurl=https://packages.gitlab.com/gitlab/gitlab-ee/el/8/SRPMS
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey
       https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey/gitlab-gitlab-ee-3D645A26AB9FBD22.pub.gpg
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300
```

#### 구성 설정 파일로 설치

```bash
finalize_yum_repo ()
{
  if [ "$_skip_pygpgme" = 0 ]; then
    echo "Installing pygpgme to verify GPG signatures..."
    yum install -y pygpgme --disablerepo='gitlab_gitlab-ee'
    pypgpme_check=`rpm -qa | grep -qw pygpgme`
    if [ "$?" != "0" ]; then
      echo
      echo "WARNING: "
      echo "The pygpgme package could not be installed. This means GPG verification is not possible for any RPM installed on your system. "
      echo "To fix this, add a repository with pygpgme. Usualy, the EPEL repository for your system will have this. "
      echo "More information: https://fedoraproject.org/wiki/EPEL#How_can_I_use_these_extra_packages.3F"
      echo

      # set the repo_gpgcheck option to 0
      sed -i'' 's/repo_gpgcheck=1/repo_gpgcheck=0/' /etc/yum.repos.d/gitlab_gitlab-ee.repo
    fi
  fi

  echo "Installing yum-utils..."
  yum install -y yum-utils --disablerepo='gitlab_gitlab-ee'
  yum_utils_check=`rpm -qa | grep -qw yum-utils`
  if [ "$?" != "0" ]; then
    echo
    echo "WARNING: "
    echo "The yum-utils package could not be installed. This means you may not be able to install source RPMs or use other yum features."
    echo
  fi

  echo "Generating yum cache for gitlab_gitlab-ee..."
  yum -q makecache -y --disablerepo='*' --enablerepo='gitlab_gitlab-ee'

  echo "Generating yum cache for gitlab_gitlab-ee-source..."
  yum -q makecache -y --disablerepo='*' --enablerepo='gitlab_gitlab-ee-source'
}
```

### 3. [GitLab Docker images](https://docs.gitlab.com/omnibus/docker/)

## 참조

- [Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application)
- [Building a private CI/CD pipeline with Java and Docker in the Cloud](https://youtu.be/sMvxauOLKLs)
- [Containerizing microservices](https://openliberty.io/guides/containerize.html)
