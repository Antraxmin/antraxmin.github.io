---
title: "[Java] 자바 프로그램 개발환경 구축"
subtitle: 자바 프로그램 개발환경 구축
date: '2024-08-30'
category: Java
---

## 개요

자바는 엔터프라이즈급 백엔드 개발에서 널리 사용되는 프로그래밍 언어이다. 

**장점과 특징**
* 한 번 작성되면 어디서나 실행할 수 있는 플랫폼 독립성
  * Java Virtual Machine (JVM) 을 통해 구현
  * 컴파일된 Java 바이트 코드는 모든 JVM에서 실행 가능
  * 운영체제나 하드웨어에 관계없이 동일한 코드 실행
* 클래스와 객체 개념을 중심으로 하는 객체지향 프로그래밍 언어
  * 캡슐화, 상속, 다형성 등 객체지향 프로그래밍의 핵심 개념 지원
* 가비지 컬렉션을 통한 자동 메모리 관리
  * 개발자가 명시적으로 메모리를 할당하거나 해제할 필요 없음
  
<br />


  
## 자바 표준 스펙과 구현 

![](https://velog.velcdn.com/images/antraxmin/post/cfb57580-40ff-4721-8e50-316810775443/image.png)

<p style="font-size: 12px; color: #333333">출처: 인프런</p>


**자바 표준 스펙**
- 자바 표준 스펙은 자바 플랫폼의 핵심 기능과 API를 정의하는 공식 문서
- Java Community Process (JCP)를 통해 관리된다. 

**자바 구현**
- 자바 표준 스펙을 기반으로 여러 회사와 조직에서 자체적인 자바 구현체를 개발한다. 
- 이러한 구현들은 모두 Java Compatibility Kit (JCK)를 통과해야 하므로 표준 스펙과의 호환성이 보장된다. 
- 라이선스 조건, 지원 기간, 업데이트 주기 등이 다를 수 있다.

**주요 자바 구현체(예시)**
- `Oracle JDK` : Oracle에서 개발 및 유지보수 (상용 라이선스 필요)
- `OpenJDK` : 오픈 소스 자바 구현체
- `Azul Zulu` : Azul Systems에서 개발한 OpenJDK 배포판 
- `Amazon Corretto` : Amazon에서 개발한 OpenJDK 배포판 (AWS 환경에 최적화) 

<br />

## 컴파일과 실행
![](https://velog.velcdn.com/images/antraxmin/post/3a2493fd-72b5-4723-979a-c46d03563e59/image.png)

### 자바 프로그램의 컴파일 및 실행 과정

#### 1. 소스코드 작성
- 개발자가 소스 코드(`.java` 파일)를 작성한다. 
- 이 코드는 인간이 읽을 수 있는 형태이다. 

#### 2. 바이트 코드로 컴파일
- 컴파일러인 `javac` 가 소스 코드를 바이트코드( `.class` 파일)로 변환한다. 
- 바이트코드는 중간 언어 형태로, 특정 하드웨어나 운영 체제에 종속되지 않는다.

#### 3. JVM에서의 실행
- `java` 명령어를 사용하여 프로그램을 실행하면 JVM이 실행된다. 
- 클래스 로더가 지정된 클래스 파일(.class)을 찾아 JVM의 메모리에 로드한다.
- JVM의 실행 엔진이 바이트코드를 해석하고 실행한다. 

## 자바 개발 및 운영 환경 
![](https://velog.velcdn.com/images/antraxmin/post/5ea4407e-f19b-44ff-bd36-47f4e9f7fb05/image.png)

### 개발환경 구축 
**통합 개발 환경(IDE) **
- 자바 개발에 주로 쓰이는 IDE는 `Eclipse` 와 `IntelliJ` 이며, 강력한 기능과 편의성으로 인해 최근에는 `IntelliJ` 의 점유율이 압도적이다. 
- IntelliJ는 무료 버전인 **커뮤니티 에디션**과 유료 버전인 **얼티밋 에디션**을 제공한다. 
- IntelliJ를 사용하면 코드 작성, 디버깅, 테스트, 배포 등 **전체 개발 주기를 하나의 환경에서 효율적으로 관리**할 수 있다. 

**IntelliJ IDEA 설치**
https://www.jetbrains.com/ko-kr/idea/download/?section=mac 


