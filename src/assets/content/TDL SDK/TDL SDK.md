# 东山派系列 V1.0 TDL SDK 及应用示例 

​	Cvitek 所提供的 TDL（Turnkey Deep Learning）集成算法，用以缩短应用程序开发所需
的时间。 
​	此架构实现了 TDL 所需算法包含其前后处理 提供统一且便捷的编程接口。 
目前 TDL SDK 包含 移动侦测，人脸检测，人脸识别，人脸追踪，行人检测，语义分割，
车牌辨识，车牌检测，活体识别，IR 活体识别，婴儿检测，哭声检测，姿态检测，手势侦测，
手势识别 等算法。 

## 一、编译 
​	TDL-SDK 程序需要在 PC 主机的 Linux 环境下进行交叉编译，推荐 Ubuntu 22.04 系统。 

​	提示： 目前 Duo 系列开发板的固件有 V1 和 V2 两个版本，相关说明请参考 资源下载汇总。
适用于这两个版本固件的 TDL-SDK 也不相同，以下分别介绍适用于这两个版本固件的 TDL-
SDK 示例的编译方法。 

### 适用于 V1 版本固件的 TDL-SDK 示例 
#### 下载交叉编译工具链： 
wget https://sophon-file.sophon.cn/sophon-prod-s3/drive/23/03/07/16/host-tools.tar.gz 

#### 解压工具链： 

tar xvf host-tools.tar.gz 

#### 进入工具链目录中将工具链的路径导出到环境变量中： 

cd host-tools 
export PATH=$PATH:$(pwd)/gcc/riscv64-linux-musl-x86_64/bin 

#### 验证工具链是否可用： 

riscv64-unknown-linux-musl-gcc -v 

#### 能够正常显示交叉编译工具链的版本信息，即工具链可用： 

$ riscv64-unknown-linux-musl-gcc -v 
Using built-in specs. 
COLLECT_GCC=riscv64-unknown-linux-musl-gcc 
... 
Thread model: posix 
Supported LTO compression algorithms: zlib 
gcc version 10.2.0 (Xuantie-900 linux-5.10.4 musl gcc Toolchain V2.6.1 B-20220906) 

#### 下载 TDL-SDK 源码，Duo 和 Duo256M/DuoS 仓库有所不同： 

Duo256M 版本的： 
git clone https://github.com/milkv-duo/cvitek-tdl-sdk-sg200x.git 
cd cvitek-tdl-sdk-sg200x 
后续仓库代码如有更新，可以在代码目录中执行 git pull 拉取最新的代码，比如 Duo256M 
和 DuoS： 
cd cvitek-tdl-sdk-sg200x 
git pull 
拉取到最新代码后再继续编译。

#### 编译： 

cd sample 
./compile_sample.sh 
生成的示例程序位于相应的子目录中，比如人脸检测示例 sample_vi_fd 位于： 
cvi_tdl/sample_vi_fd 
若需要清除编译后生成的文件，运行如下指令： 
./compile_sample.sh clean 

### 适用于 V2 版本固件的 TDL-SDK 示例 

#### 获取 TDL-SDK 示例源码： 

git clone https://github.com/milkv-duo/duo-tdl-examples.git 
后续仓库代码如有更新，可以在代码目录中执行 git pull 拉取最新的代码，拉取到最新
代码后再继续编译。 
下面以以编译人脸检测的程序为例，介绍编译的过程。 

#### 进入代码目录： 

cd duo-tdl-examples 

#### 加载编译环境： 

source envsetup.sh 
第一次加载会自动下载所需的编译工具链，下载后的目录名为 host-tools，下次再加载
编译环境时，会检测该目录，如果已存在则不会再次下载。 
加载编译环境时需要按提示输入所需编译目标： 

```
Select Product: 
1. Duo (CV1800B) 
2. Duo256M (SG2002) or DuoS (SG2000) 
```

如果目标板是 Duo 则选择 1，如果目标板是 Duo256M 或者 DuoS 则选择 2。由于Duo256M 和 DuoS 支持 RISCV 和 ARM 两种架构，还需要按提示继续选择： 

```
Select Arch: 
1. ARM64 
2. RISCV64 
Which would you like: 
```

如果测试程序需要在 ARM 系统中运行，选择 1，如果是 RISCV 系统则选择 2。 
同一个终端中，只需要加载一次编译环境即可。 

#### 人脸检测的示例程序为 sample_vi_fd，进入到 sample_vi_fd 目录： 

cd sample_vi_fd 

#### 使用 make 命令编译： 

make 

#### 将当前目录中生成的 sample_vi_fd 程序通过 scp 或者其他方式上传到 Duo 系列开发

板中进行测试。如需清除编译生成的程序，可以执行 make clean 清除。 
通过网络直接上传到 Duo 开发板中的程序，可能没有执行权限，需要先在开发板的系统里
通过 chmod 命令添加可执行权限： 
chmod +x sample_vi_fd 

#### 在开发板中测试该人脸检测示例的命令为 sample_vi_fd + 人脸检测模型文件。注意 Duo 

和 Duo256M/DuoS 中使用的模型是不同的。： 
./sample_vi_fd /mnt/cvimodel/scrfd_768_432_int8_1x.cvimodel

模型下载链接：https://github.com/milkv-duo/tdl-models。 
此时将摄像头对准人脸，终端日志中会打印当前检测到人脸的数量。如需通过电脑实时
预览视频画面，可参考下一节 

### 模型支持列表 

TDK-SDK 模型下载（Sophgo）：https://github.com/sophgo/tdl_models/tree/main 

### 示例说明 

各示例的详细说明及运行方法，请参考后面章节。 

### 参考文档 

#### 中文版： 

深度学习 SDK 软件开发指南 
Html：http://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x
/zh/01.software/TPU/TDL_SDK_Software_Development_Guide/build/html/index.html 
Pdf：https://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x/
zh/01.software/TPU/TDL_SDK_Software_Development_Guide/build/TDLSDKSoftwareDevelopme
ntGuide_zh.pdf 

YOLO 系列开发指南 
Html：http://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x
/zh/01.software/TPU/YOLO_Development_Guide/build/html/index.html 
Pdf：http://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x/z
h/01.software/TPU/YOLO_Development_Guide/build/YOLODevelopmentGuide_zh.pdf 

#### 英文版： 

TDL SDK Software Development Guide 
Html：http://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x
/en/01.software/TPU/TDL_SDK_Software_Development_Guide/build/html/index.html 
Pdf：http://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x/e
n/01.software/TPU/TDL_SDK_Software_Development_Guide/build/TDLSDKSoftwareDevelopmen
tGuide_en.pdf 

YOLO Development Guide 
Html：http://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x
/en/01.software/TPU/YOLO_Development_Guide/build/html/index.html 
Pdf：http://doc.sophgo.com/cvitek-develop-docs/master/docs_latest_release/CV180x_CV181x/e
n/01.software/TPU/YOLO_Development_Guide/build/YOLODevelopmentGuide_en.pdf 

## 人脸检测 
该测试程序会拉取摄像头数据，加入人脸检测算法，使用 VLC 等工具可以实时拉流查
看效果。 

### 编译

人脸检测程序源码位置：https://github.com/milkv-duo/cvitek-tdl-sdk-sg200x/blob/main/s
ample/cvi_tdl/sample_vi_fd.c 
参考上一节的方法编译示例程序 

### 上传测试程序和模型文件到 Duo256M 中 
#### 参考如下步骤烧录好系统： 
1）准备 
必要的 
Duo，Duo256M 或者 DuoS 
大于 1GB 的 microSD 卡 
Type-C 数据线 
可选的 
USB to TTL 串口模块 
2）下载镜像和工具 
首先从此网址下载系统镜像： 
V1 版本镜像 
https://github.com/milkv-duo/duo-buildroot-sdk/releases/ 
V2 版本镜像（支持 Duo256M 和 DuoS 的 RISC-V 核心和 ARM 核心镜像） 
https://github.com/milkv-duo/duo-buildroot-sdk-v2/releases/ 
随后下载烧录工具： 
balenaEtcher：https://etcher.balena.io/ 
或 
Rufus：https://rufus.ie/en/ 
3）烧录镜像 
以 BalenaEtcher 为例： 

1、点击 Flash from file 

![1、TDL SDK_p4_1](
https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/1%E3%80%81TDL%20SDK_p4_1.jpeg)

2、点击 Select target

![1、TDL SDK_p5_1](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/1%E3%80%81TDL%20SDK_p5_1.jpeg)

3、点击 Flash 

#### 如下图连接好摄像头以后，上电开机： 

![1、TDL SDK_p5_2](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/1%E3%80%81TDL%20SDK_p5_2.jpeg)

#### 将编译生成的 sample_vi_fd 在电脑上通过 scp 命令上传到开发板中： 
scp sample_vi_fd root@192.168.42.1:/root/ 
#### 同样用 scp 将 cvimodel 目录中用于人脸检测的模型文件上传到 Duo 开发板中： 
Duo256M/DuoS 中的模型为 scrfd_768_432_int8_1x.cvimodel 

### 运行示例 
#### 通过串口或者 ssh 登陆到 Duo 的终端。 

#### 在终端中为测试程序添加可执行权限 
chmod +x sample_vi_fd 

#### 在终端中执行测试程序： 
./sample_vi_fd scrfd_768_432_int8_1x.cvimodel 
会看到类似如下信息： 
Initialize RTSP

rtsp://127.0.1.1/h264 
prio:0 
version: 1.4.0 
scrfd768432 Build at 2023-12-25 01:21:44 For platform cv181x 
Max SharedMem size:1658880 
此时用摄像头对准人脸，Duo 终端中会打印摄像头实时检测到的人脸个数： 
face count: 5 
face count: 6 
face count: 5 
face count: 4 
face count: 0 
face count: 1 
face count: 0 

### PC 端使用 VLC 拉流查看效果 
打开 VLC media player，点击左上角 Media，选择 Open Network Stream，输入 URL。如
果使用的是 USB Net(USB-NCM)，地址为： 
rtsp://192.168.42.1/h264 

![1、TDL SDK_p6_1](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/1%E3%80%81TDL%20SDK_p6_1.jpeg)

如果使用的是底板 IO-Board 上的网口，或者 DuoS 上集成的网口，URL 中的 IP 地址
需换成网口的 IP（可在 Duo 终端中使用 ifconfig 命令查看）。 
点开左下角的 Show more options 选项，可以设置 Caching 选项来调整延时，默认是
1000 毫秒，也就是 1 秒。网络环境较好时比如在局域网内，可以将其调低来降低延迟，可
以设置为 100 到 300。如果网络环境较差或者画面出现卡顿时，可以尝试将其调高。 
配置好之后，点击 Play，即可查看摄像头的人脸检测效果。


![1、TDL SDK_p7_1](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/1%E3%80%81TDL%20SDK_p7_1.jpeg)
