---
title: "[Mac OS] Node.js 개발환경 구축"
subtitle: Node.js 개발환경 설정하기
date: '2024-08-27'
category: Mac
---

Homebrew를 이용하여 Mac OS에 Node.js 개발환경을 구축할 때 **nvm을 이용하는 방법**과 **직접 특정 버전의 node.js만을 설치하는 방법**이 있다. 

### 1. nvm을 이용하여 다운로드

**nvm**은 `Node Version Manager` 로 Node.js의 버전을 관리하는 도구이다. 시스템 전체에 영향을 주지 않고 각 프로젝트에 사용하는 서로 다른 Node.js 버전을 사용할 수 있다. 

**Homebrew 설치**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**nvm 설치**
```bash
brew install nvm
```

**nvm 설정**
- `~/.zshrc` 파일에 nvm 설정을 추가 
```bash
echo 'export NVM_DIR="$HOME/.nvm"
4 [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
5 [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"' >> ~/.zshrc
```

- 설정 적용
```bash
source ~/.zshrc
```


**Node.js 18 설치**
```bash
nvm install 18
nvm use 18
node -v
```

<br />

### 2. nvm 없이 node만 바로 다운로드

이 방법은 nvm을 사용하지 않고 homebrew를 통해 직접 node.js를 설치한다. 다만 **시스템에 단일 버전의 Node.js를 설치**하기 때문에 버전 관리 측면에서 덜 유연할 수 있다. 

```bash
brew install node@18
node -v
```


