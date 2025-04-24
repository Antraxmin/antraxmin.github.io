---
title: "OpenStack 개발 환경 구축 - 2. pycharm 설정"
subtitle: "."
date: '2025-04-22'
category: OSSCA
thumbnail: "https://github.com/user-attachments/assets/0eb8b922-be58-4fb0-a068-a49d72465c6c"
---

vscode와 pycharm 모두 사용할 수 있지만 개인적으로는 비교도 안될만큼 pycharm이 훨씬 강력하다고 느껴서 pycharm으로 진행하고자 했다.

#### 사전 요구사항

시작하기 전에 다음 프로그램들이 설치되어 있어야 한다. 

- Python 3.8+ (3.11 권장)
- Git
- PyCharm Community 또는 Professional Edition
- +인터넷 연결

## OpenStack 필수 프로젝트 Clone

우선 개발 환경을 만들기 위해 아래 3개의 프로젝트를 clone 해야 한다.

```bash
git clone https://opendev.org/openstack/python-openstackclient
git clone https://opendev.org/openstack/osc-lib
git clone https://opendev.org/openstack/openstacksdk
```
- python-openstackclient: 메인 OpenStack 커맨드라인 인터페이스 구현
- osc-lib: OpenStack 클라이언트의 공통 라이브러리
- openstacksdk: OpenStack API와의 상호작용을 위한 SDK

(+ 모든 프로젝트를 동일한 디렉토리 아래에 클론해야 나중에 개발 환경 설정이 더 쉬워진다.)

## Python 가상 환경 설정
각 프로젝트별로 독립적인 가상환경을 설정하여 의존성 충돌을 방지한다.

```bash
cd python-openstackclient
python -m venv venv
source venv/bin/activate
```

동일한 작업을 `osc-lib`과 `openstacksdk` 프로젝트에도 적용한 후, 각 프로젝트를 개발 모드로 설치하여 코드 변경사항이 즉시 반영되도록 한다. 

```bash
python setup.py develop
```

각 프로젝트에 독립적인 가상환경을 만들었다면 각각의 가상환경을 활성화한 후 해당 프로젝트에서만 `python setup.py develop`을 실행하면 된다. 그러나 통합 테스트를 위해서는 모든 프로젝트가 서로를 참조할 수 있어야 한다. 



### OpenStack 클라이언트 실행 환경 설정하기
이제 OpenStack 명령어를 실행하기 위한 구성을 설정한다. 

![](https://velog.velcdn.com/images/antraxmin/post/89b76f6b-fd4b-4f1d-b19e-fb6db45f7364/image.png)

1. `python-openstackclient/openstackclient` 디렉토리 내의 `shell.py` 파일을 찾아 우클릭한다. 
2. Run 'shell' 옵션을 선택한다. 
3. 파일이 실행된 후 오른쪽 상단의 실행 구성 드롭다운 메뉴에서 `Edit Configurations...` 을 선택한다. 
4. 다음과 같이 설정을 변경한다. 
   - Parameters: OpenStack 명령어 인자(`server list` 또는 `image list`)
   - Environment variables: OpenStack 서비스에 접근하기 위한 환경 변수
   
#### 환경변수 
```
OS_PROJECT_NAME=admin
OS_TENANT_NAME=admin
OS_USERNAME=admin
OS_PASSWORD=devstack 설치할 때 설정한 password
OS_REGION_NAME=RegionOne
OS_IDENTITY_API_VERSION=3
OS_AUTH_TYPE=password
OS_AUTH_URL=http://$할당받은_공인IP/identity
OS_USER_DOMAIN_ID=default
OS_PROJECT_DOMAIN_ID=default
OS_VOLUME_API_VERSION=3
```

모든 설정이 완료되면 Run 버튼을 클릭하여 OpenStack 명령어를 실행한다. 명령어가 성공적으로 실행되면 PyCharm 하단에 실행 결과가 표시된다.

![](https://velog.velcdn.com/images/antraxmin/post/b0b62df6-31ae-4dc4-aecd-4d664eee50ab/image.png)

실행에 실패한 경우 아래 사항을 체크해 보자. 
- 비밀번호가 올바르게 설정되었는지
- 컨트롤러 노드 IP가 정확한지
- 환경 변수가 모두 올바르게 설정되었는지

이제 PyCharm에서 OpenStack 개발을 위한 기본적인 환경 설정이 완료되었다. 