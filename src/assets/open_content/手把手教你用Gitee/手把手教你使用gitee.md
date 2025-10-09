# 手把手教你使用gitee

**1.Gitee介绍**

Gitee译为码云，是国内创建的一个类似与github的网站，可以上传自己的代码放在云端保存，下面介绍Gitee如何使用，github类似使用操作。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_1.png)

**2.Gitee注册**

进入官网注册，必须绑定手机号，**用其他方式登录也必须绑定手机号**

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_2.png)

注册后进入如下界面，点击右上角的设置，进入邮箱管理，新增邮箱，会给你的邮箱发送短信，然后点开邮件里的网站完成邮箱绑定。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_3.png)

**3.软件安装**

我们首先需要安装**git（一个版本控制工具），**以及**tortoise git（git的一个图形化界面工具），如果您不需要使用图形化界面工具的话，只使用git命令的话，不用下载。**

**重点:一定要先安装git，再安装tortoise git。**

**3.1下载git**

官方下载链接：

网页点开后 ，因为我的电脑系统为Windows，所以点击紫圈中的按钮。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_4.png)

因为我的电脑是64位，基于x64的处理器（通过设置→系统→系统信息查看），所以选择紫圈中的版本。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_5.png)

**3.2下载tortoise git**

下载链接

同理，点击下载：

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_6.png)

**3.3安装git**

找到下载的软件，一定要先安装git，双击安装程序。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_7.png)

点击next，同意协议后出现如下界面，安装路径C:\\Program Files\\Git，不要更改，因为后续tortoise git安装时会自动到该路径下寻找git的配置。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_8.png)

一直点next，然后install，等待安装完成。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_9.png)

把View Release Notes取消勾选，然后finish即可。

安装完成后，右键点击桌面空的地方，显示更多选项，有这两个按钮即可视为安装成功。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_10.png)

**3.4安装tortoise git​​​​​​​**

双击运行

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_11.png)

一路点击next然后install，不做任何修改然后点击finish。（此步骤忘记截图了所以借用了别人的图片）

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_12.png)

然后弹出如下界面，只能选择英文版然后下一页。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_13.png)

然后它会自己找到git的安装路径，直接点击下一页

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_14.png)

接下来需要输入用户名和邮箱，

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_15.png)

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_16.png)

用户名即个人主页中@后面紫框里的部分，所以我需要在Name里填入zyrv

邮箱要填写刚刚注册git时绑定的邮箱，然后点击下一页→完成。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_17.png)

依旧桌面右击，显示更多选项，看到框中几个按钮，表示两个软件都已安装成功。

**4.建立仓库**

**在gitee主页点击如下：**

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_18.png)

给仓库起个名称，路径和地址会自动设置好，这里我设置为开源仓库，最下面三个框不勾选。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_19.png)

点击创建以后来到如下页面，创建成功。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_20.png)

点击HTTPS/SSH即可显示相应协议的链接，点击右侧复制一下HTTPS协议的链接。

**5.git工具主要操作**

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_21.png)

此章分为使用tortoise git的操作与不使用图形化界面工具的git命令操作两部分，如果使用图形化界面工具请根据5.1、5.3、5.5节进行操作，否则根据5.2、5.4、5.6节操作。

**5.1克隆远程仓库到本地电脑（图形化界面工具）**

在想管理代码的文件夹里空白处点击右键→Git Clone，弹出如下界面，URL处会自动粘贴刚刚复制的库链接，Directory是仓库即将克隆到的路径。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_22.png)

点击OK，看到success，说明克隆成功。此时当前目录下生成了一个test文件夹，此文件夹就是将远程的仓库克隆到本地来的。进入文件夹后，打开查看隐藏的项目选项，可以看到一个隐藏的.git文件夹。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_23.png)

**5.2克隆远程仓库到本地电脑（git命令）**

使用WIN+R快捷键，输入cmd点击确定，打开终端，分别输入如下命令

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_24.png)

成功在try文件夹中克隆了一个test文件夹作为本地仓库，因为我的gitee仓库中并没有代码文件，所以报了一个warning。

**5.3添加、提交、推送——add、commit、push（图形化界面工具）**

小标题的三步意义如下：

add-将代码添加到本地仓库

commit-提交代码到本地仓库

push-推送本次添加操作到远程仓库

首先在本地仓库，test文件夹中更新一个项目文件test\_c。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_25.png)

右击空白处，选择TortoiseGit→Add...

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_26.png)

选择添加仓库管理的文件，这个图形化界面工具会搜索这个目录（工作区）下，所有文件及其内容的改变，告知git工具哪些文件（改变的文件）需要进行版本管理。我们可知在这个文件目录（或者叫文件夹）下创建文件，并不是在本地仓库中创建文件。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_27.png)

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_28.png)

点击Commit，（如果不小心关掉这个界面，右键文件夹空白处选择git commit即可）

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_29.png)

显示success，说明第二步commit成功完成了。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_30.png)

继续，点击Push，（如果不小心点了close，右键文件夹空白处点击tortoisegit→push即可）

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_31.png)

点击OK，如果是第一次push，需要输入用户名和密码

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_32.png)

此用户名和密码为注册Gitee的时候的用户名和密码，

如果输入错误的用户名密码导致报“Incorrect username of password”的话，可以点击键盘上的win，然后在左下角弹出的页面中搜索“凭据管理器”，点击Windows凭据，找到gitee相关的凭据并删除

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_33.png)

然后重试刚才进行失败的步骤，这时会重新要求输入用户名密码。输入正确的用户名与密码后，看到success说明代码已推送到远程仓库。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_34.png)

现在可以在个人主页中看到远程仓库已更新，点进去可以查看文件详情，找到.c文件可以查看代码内容。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_35.png)

**5.4添加、提交、推送——add、commit、push（git命令）**

先在工作目录下建立新的项目文件，图中所框选的文件即是。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_36.png)

在文件管理器路径处输入cmd并回车，即可在当前目录下打开终端。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_37.png)

add：①将grade\_judge.c添加到本地仓库缓冲区，

commit：②commit正式更新仓库作为一个版本更新

③使用git status查看仓库状态：显示还有一个在本地仓库目录下还有一个文件没有更新到仓库。

push：④使用git push将本地仓库代码更新到gitee仓库

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_38.png)

提交成功，仓库里多了一个grade\_judge.c文件。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_39.png)

**5.5更新本地仓库——pull（图形化界面工具）**

如果远程仓库的文件已更新，需要将本地仓库更新为gitee仓库的内容。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_40.png)

右键文件夹空白处→TortoiseGit→Pull...→OK即可

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_41.png)

**5.6更新本地仓库——pull（git命令）**

如果远程仓库的文件已更新，需要将本地仓库更新为gitee仓库的内容。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_42.png)

依据上文方法打开终端，输入git pull指令即可。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_43.png)

**6.git分支操作**

分支可以是一种后悔药，以自己写的一段文字记录为例，复制出一个一模一样的文档，在新复制出的文档上修改内容，然后再合并到原始文档时，对比两个文档可以看到哪些地方做了修改，如果觉得副本中一些有价值的原始记录内容被删除了，可以继续修改副本，以免一份文档修改后，原本写的有价值的文字也被删除，就得不偿失了。

分支另一个很大的作用就是方便并行开发，例如我们团队有两个人，那我们同时在一个份代码上开发。一个人写了一个bug，另一个人也没法运行程序测试和开发了，完了！那我们就创建分支，各种开发各自的，测试完成后合到一起，这样我们就能并行开发了。

使用git branch命令查看当前仓库中存在的所有分支。当前的分支前面会有一个“\*”号标记。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_44.png)

使用下列命令创建并切换到新分支，也可以直接使用git switch -c [分支名]命令来创建并切换到一个新分支。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_45.png)

使用git branch -m [旧分支名] [新分支名]命令来重命名当前分支。如果当前不在要重命名的分支上，需要先切换到该分支或使用-M选项来强制重命名。

现在在此分支上做开发，新创建一个README文本文件，在里面随意做些仓库说明后保存，将文件后缀改成.md

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_46.png)

依据前面的方法将本地仓库推送到远程仓库。

现在在gitee网页端能看到有两个分支，其中test\_branch分支有刚刚更新的README.md文件，master分支没有。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_47.png)

因为我们是在test\_branch分支上提交的，而master分支此刻的提交点并没有变，为了在master主分支上能看到新的提交，要将test\_branch分支合并到master分支。首先切换到master分支，然后使用如下图所示的git merge [分支名]命令将指定分支的修改合并到当前分支，再使用git status查看状态，提示本地仓库有一个提交。于是使用git push origin [分支名]命令将本地分支推送到远程仓库。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_48.png)

完成以后，查看gitee仓库，master分支下也有了README.md文件。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_49.png)

合并完成后，test\_branch分支对于我们来说就没用了，那么test\_branch分支就可以删除掉，注意如果当前正处于某分支下，就不能删除当前分支。使用git branch -d [分支名]命令删除已经合并到当前分支的指定分支。如果分支上有未合并的修改，Git会拒绝删除该分支。

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_50.png)

如果要删除远程仓库的分支，可以使用git push origin --delete test\_branch指令，或是在gitee网页端点入分支页面，删除分支即可。

**7.提交PullRequest**

**附：**

Git常用命令速查表

![image](https://dongshan-markdown-image.oss-cn-beijing.aliyuncs.com/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E4%BD%BF%E7%94%A8gitee_51.png)
