---
title: "Nvidia 드라이버 및 CUDA 설치"
subtitle: 게시물 부제목
date: '2024-09-01'
category: Infra
thumbnail: "https://github.com/user-attachments/assets/a725c32e-3b1b-4f46-9824-8b25904cec16"
---

#### 사용 가능한 드라이버 확인 
```bash
ubuntu-drivers devices
```

#### 권장 드라이버 자동 설치 
```bash
sudo ubuntu-drivers autoinstall
```

#### 현재 GCC 버전 확인
```bash
gcc --version
```

#### 로그 파일 확인 
```bash
sudo cat /var/log/cuda-installer.log
```

#### 호환되는 GCC 버전 설치 
CUDA 11.8은 일반적으로 GCC 10 버전과 호환된다.  아래 명령어로 GCC 10을 설치할 수 있다.  
```bash
sudo apt update sudo apt install gcc-10 g++-10
```

#### GCC 버전 전환
```bash
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-10 100 --slave /usr/bin/g++ g++ /usr/bin/g++-10
sudo update-alternatives --config gcc
```

#### CUDA 설치
```bash
sudo sh cuda_11.8.0_520.61.05_linux.run
```

#### NVIDIA 드라이브 설치 확인
![](image.png)

#### CUDA toolkit 설치
```bash
sudo apt install nvidia-cuda-toolkit
```

#### CUDA 설치 상태 확인
```bash
nvidia-smi
nvcc --version
```

#### 환경 변수 설정 
```bash
echo 'export PATH=/usr/local/cuda-11.8/bin${PATH:+:${PATH}}' >> ~/.bashrc echo 'export LD_LIBRARY_PATH=/usr/local/cuda-11.8/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}' >> ~/.bashrc source ~/.bashrc
```

