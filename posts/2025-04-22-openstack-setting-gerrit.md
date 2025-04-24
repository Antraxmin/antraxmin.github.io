---
title: "OpenStack 개발 환경 구축 - 3. Gerrit 계정 생성 및 커밋 환경 설정"
subtitle: "."
date: '2025-04-22'
category: OSSCA
thumbnail: "https://velog.velcdn.com/images/antraxmin/post/6ce3ba7f-fe1c-4307-a431-66a405363c96/image.png"
---

## Gerrit이란?
Gerrit은 Git 기반의 코드 리뷰 시스템으로, OpenStack 커뮤니티에서 코드 변경사항을 검토하고 병합하는 데 사용된다. OpenStack에 코드를 기여하기 위해서는 반드시 Gerrit을 사용해야만 한다. 

기여 과정은 대략 아래와 같다. 

1. 코드 변경 작성
2. Gerrit에 변경사항 제출
3. 자동화된 CI 테스트 통과
4. 커뮤니티 구성원의 코드 리뷰
5. 필요한 경우 코드 수정
6. 최종 승인 및 병합

OpenStack에 기여하기 위해서는 Gerrit 계정과 더불어 Storyboard(이슈 트래킹 시스템)에 접근할 수 있어야 한다. 두 시스템 모두 Ubuntu One 계정을 통해 통합 관리된다. 

## Ubuntu One 계정 생성 
시작하기 전에 Ubuntu One 계정이 필요하다. 이 계정은 Gerrit, Storyboard 등 OpenStack 관련 서비스에 모두 사용된다. 
![](https://velog.velcdn.com/images/antraxmin/post/a47181b7-569f-4d8d-98bd-61a8918b58a9/image.png)

## Gerrit 계정 생성
Ubuntu One 계정을 생성한 후 Gerrit 계정을 설정할 수 있다. 

![](https://velog.velcdn.com/images/antraxmin/post/1874b818-0813-449c-a352-96f24841f62f/image.png)

> Gerrit 사용자 이름은 이후 Git 구성에 필요하므로 반드시 기록해 두자. 


## SSH 키 생성 및 등록 
Gerrit과 안전하게 통신하려면 SSH 키 쌍이 필요하다. 

### 1) SSH 키 생성

터미널을 열고 다음 명령어를 실행한다.

```bash
ssh-keygen -t rsa -b 4096 -C "이메일 주소"
```
키 저장 위치를 묻는 메시지가 표시되면 기본값(~/.ssh/id_rsa)을 사용하기 위해 Enter 키를 누른다. 암호 설정은 선택 사항이다. 


### 2) SSH 구성 파일 설정

SSH 구성 파일을 만들어 Gerrit 연결을 설정한다. 

```bash
vi ~/.ssh/config
```

```
Host review.opendev.org review
  Hostname review.opendev.org
  Port 29418
  User [gerrit username] 
  IdentityFile ~/.ssh/id_rsa
```

### 3) 공개키 복사 

출력된 내용(ssh-rsa로 시작하는 긴 문자열)을 복사한다. 

```bash
cat ~/.ssh/id_rsa.pub
```

### 4) Gerrit에 공개키 등록 
복사한 공개 키 값을 필드에 저장한다.
![](https://velog.velcdn.com/images/antraxmin/post/ffad2db6-9cf0-4477-bb65-cad62c6dcd0d/image.png)

### 5) SSH 연결 테스트 
SSH 키가 올바르게 구성되었는지 확인한다.

```bash
ssh -p 29418 your_gerrit_username@review.opendev.org
```
성공적으로 연결되면 아래와 같은 메시지가 표시된다. 
![](https://velog.velcdn.com/images/antraxmin/post/c1e7779f-2c4c-4c1e-b49b-178c648f5d78/image.png)


## ICLA 동의
OpenStack에 코드를 기여하기 위해서는 Individual Contributor License Agreement(ICLA)에 동의해야 한다. 

![](https://velog.velcdn.com/images/antraxmin/post/778ba04e-ffa2-4234-876a-2b10e8ea88ac/image.png)

표시되는 ICLA 내용을 검토하고 I Agree 버튼을 클릭한다. ICLA에 동의하면 OpenStack 프로젝트에 코드를 제출할 수 있는 권한이 부여된다. 

## Git-Review 설치
Git-review는 Gerrit과 함께 작업하기 위한 Git 확장 도구로, 코드 리뷰 제출 프로세스를 간소화한다. 

```bash
pip3 install git-review
```

Git-review에 Gerrit 사용자 이름을 설정한다. 

```bash
git config --global --add gitreview.username "gerrit_username"
```

테스트를 위해 OpenDev Sandbox 프로젝트를 클론해 보자. Sandbox는 OpenStack 기여자가 Gerrit 워크플로우를 연습할 수 있는 테스트 프로젝트이다. 

먼저 프로젝트 디렉토리에서 git-review를 초기화한다. 

```bash
git review -s
```
이 명령어는 다음 작업을 수행한다. 

- Gerrit 원격 저장소 설정 추가
- Change-Id 커밋 훅 설정 (커밋 메시지에 자동으로 Change-Id 추가)
- Gerrit 서버와의 연결 테스트

성공적으로 실행되면 출력 없이 명령이 완료된다. 

## 첫 번째 커밋 테스트
실제로 변경사항을 만들고 Gerrit에 제출해 보고자 한다. 

```bash
git checkout -b test-change
echo "This is a test for Gerrit workflow" >> README.md

git add README.md git commit -m "Test: Add a line to README for testing Gerrit workflow"
```

이렇게 테스트 커밋 하나를 작성하면 커밋 메시지에 자동으로 Change-Id가 추가된 것을 확인할 수 있다. 

![](https://velog.velcdn.com/images/antraxmin/post/9e503753-5dd9-4dba-90ca-8fe9f9029835/image.png)

git review 명령어를 통해 gerrit에 커밋을 제출해 보았다. 

![](https://velog.velcdn.com/images/antraxmin/post/6ce3ba7f-fe1c-4307-a431-66a405363c96/image.png)

고인물들의 작업 공간에 뉴비의 작디작은 테스트 커밋이 찍혔다. 

![](https://velog.velcdn.com/images/antraxmin/post/e91a2756-0e87-4fb9-9df2-5792d42ac439/image.png)

굳. 여기까지 해서 OpenStack 기여를 위한 준비가 모두 완료되었다. 상당히 복잡하다. 그래도 별다른 오류 없이 잘 따라가고 있는 것 같다. 
