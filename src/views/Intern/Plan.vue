<template>
  <div class="page-bg">
    <main class="content-container">
      <h1 class="main-title">东山派远程实习生计划</h1>
      <div class="prose max-w-none" v-html="renderedMarkdown"></div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const markdownContent = `

## 一、计划背景与目标

欢迎来到东山社区！

东山社区由山东大学发起，是面向东山的RISC-V开源生态基地。社区集中呈现了山东大学在“东山集群”和“东山派”上已经适配和优化的开源软件、正在研发的开源项目等RISC-V资源，作为教学与科研资料供所有社区成员参考和使用，协力构建以人才培养为核心的开源创新生态。

同时，为进一步优化上述开源资源和RISC-V课程体系，助力“东山计划”吸引更多人才与智慧，构建开放、共享、创新的技术社群，我们发起了“东山—远程实习生计划”，鼓励同学们学有余力时实现从知识学习者到开源贡献者的转变，投身到东山社区发布的开源课程共建和开源项目优化中来，成为RISC-V开源生态的共建者与受益者。社区会针对成员的贡献价值进行评估并发放奖励津贴。

社区将于2025年10月份开展面向全国的“东山·远程实习生计划第一期”，社区技术委员会为社区成员提供了多个RISC-V开源项目实践机会，邀请来自全国各地的同学们参与进来，助力RISC-V生态任务加速落地，推动代码、文档、工具等成果的标准化与复用，同时建立社区人才储备库，为产学研合作输送优质开源人才。

## 二、任务发布机制

### 2.1 任务来源与分类

任务需围绕RISC-V生态核心需求，由社区技术委员会（含山东大学导师、合作企业专家）统筹规划，具体分类如下：

| 任务类型 | 描述 | 示例 |
| :--- | :--- | :--- |
| 课程类 | 根据东山计划开设课程，完成各个核心课程的实验任务 | 完成东山派课程实验并开源实验代码与报告 |
| 开源类 | 参与社区开源项目，按照贡献代码数量与解决 todolist/issue 数量评定工作量 | 面向 RISC-V 大规模处理器的周期精确仿真技术——NullSim 开源模拟器：对实践该模拟器的使用场景、运行效果进行 PR 提交，形成首批 demo，后续基于采纳的 demo 持续优化该模拟器 |
| 企业类 | 参与认证企业发布的开源项目，按照解决项目开发需求的数量与质量评定工作量 | 完成算能、进迭时空等公司发布的开源项目，提交并入主线，解决企业研发实际需求 |
| 其他 | ...... | ...... |

### 2.2 任务发布流程

- ①任务审核与分级

技术委员会对任务进行评估审核，按难度分为基础级（L1）、进阶级（L2）、核心级（L3），并明确任务目标、交付标准、时间周期（1-8周）。

例：基础级任务（如课程实验）周期0-1周，核心级任务（如内核模块开发）周期4-8周。

- ②任务发布

社区定期（每月）通过东山社区官网、Gitee组织仓库、QQ群、邮件发布“任务清单”：

- 东山社区平台：发布任务详情、提交入口；

- Gitee仓库：同步任务看板（Issues），关联代码仓库分支，启用PR（Pull Request）流程管理。

### 2.3 任务认领规则

实习生需通过社区实名认证注册：姓名、学号、学校、手机号码、教育邮箱、个人邮箱、身份证号等信息。如实习生贡献被录用，将以邮件形式收集实习生银行账户信息。【上述信息仅用于统计实习生来源背景和发放实习生津贴，所有信息将严格保密】

### 2.4 项目答辩

为确保项目的任务提交者是实习生本人，并核实任务完成情况，当任务PR被并入主线之后，将由技术委员会3名及以上成员联名发起答辩。答辩人选、时间将通过东山社区官网、Gitee组织仓库、QQ群、邮件列表公示，确定参与答辩的实习生可线上参加答辩，每人/任务15分钟。

- ①答辩环节设计

| 环节 | 内容 | 时长 |
| :--- | :--- | :--- |
| 成果汇报 | 社区成员通过 PPT 展示任务背景、技术方案、实现过程、遇到的问题及解决方案（需录屏备用） | 7 分钟 |
| 技术质询 | 评委围绕代码逻辑、性能优化、兼容性等提问，社区成员现场作答 | 5 分钟 |
| 社区价值评估 | 评委讨论成果对 RISC-V 生态的实际贡献（如是否解决行业痛点、可复用性如何） | 3 分钟 |

- ②评委组成与评分标准

评委：社区技术委员会（2～3人）+ 合作企业技术负责人（1人）+ 社区成员代表（1人，非本任务参与者）；

评分标准：技术完整性（40%）、创新性（25%）、文档质量（20%）、答辩表现（15%），总分≥70分视为通过。

## 三、津贴发放标准

### 3.1 津贴分级与金额

实习生津贴与任务难度、工作量、成果价值、贡献采纳量挂钩。

例如课程实验类任务：

- 完成了课程实验任务并被录用采纳的发放“主线津贴”；

- 未被采用但贡献较大的发放“参与津贴”；

- 额外设计了实验题目并提交实验内容的发放“特别津贴”。

### 3.2 津贴发放条件

成果需同时满足以下条件方可发放津贴：

- PR通过东山社区Gitee仓库管理员审核并合并至主线分支；

- 代码通过自动化测试（覆盖率≥80%）、无高危漏洞（经Clang-Tidy等工具检测）；

- 配套文档（设计说明、使用教程）完整提交至社区知识库。

### 3.3 津贴发放流程

成果提交：实习生完成任务和答辩环节后，通过社区平台提交“成果验收表”（含Gitee PR链接、文档地址、个人账户信息等）；

技术评审：技术委员会在5个工作日内完成审核；

津贴申请：审核通过后，实习生提交银行卡信息至财务组；

发放执行：每月15日、30日前后集中发放，由山东大学财务系统统一打款，附“东山社区贡献津贴”备注。

实习生如对津贴有异议，可通过邮件/QQ群/社区后台等渠道，在7个工作日内向社区技术委员会提交申诉，15个工作日内出具仲裁结果。联系方式：202485009017@sdu.edu.cn。

## 四、采纳量评估方法

### 4.1 量化评估指标

采纳量是衡量任务成果价值的核心指标，需结合任务类型制定差异化标准：

| 采纳方面 | 采纳量评估指标 | 数据来源 |
| :--- | :--- | :--- |
| 代码技术 | 代码合并率（合并 PR 数/提交 PR 数）、代码复用率（被其他项目引用次数）、性能提升幅度（如运行速度） | Gitee 仓库统计、社区性能测试报告 |
| 安全保障 | 经 Clang-Tidy 等工具检测无问题 | 测试管理平台（如 JIRA）、Bug 跟踪系统 |
| 社区认可 | 页面访问量（社区官网统计）、用户好评率（下载后评分≥4.5 星）、被外部文章引用次数 | 社区后台数据、Google Scholar 引用 |

### 4.2 评估周期与应用

周期：基础级任务完成后1个月评估，进阶级3个月，核心级6个月；

应用：并入主线的社区成员可获得“东山社区XX项目核心贡献者”认证，每位社区成员的累积贡献将完整呈现在社区贡献排行榜上，获得优先推荐企业实习或参与国家级RISC-V项目的机会。

## 五、配套支持与激励

### 5.1技术支持：社区技术委员会将动态在线，提供疑难困惑解答；

### 5.2资源共享：可申请RISC-V东山集群算力，试用各类RISC-V开发板（如StarFive VisionFive），使用行业前沿技术文档库；

### 5.3荣誉体系：

- 实习生可随时申请开具实习证明，选择呈现在实习证明上的个人贡献内容和项目。

- 每季度评选“东山社区RISC-V开源之星”，在社区官网公示并颁发证书；

- 每年度Top10贡献者将受邀参与山东大学RISC-V人才培养峰会，与行业专家面对面交流。

（计划最终解释权归东山社区技术委员会所有，如有调整将通过社区官网公告更新。）
`;

const renderedMarkdown = ref(md.render(markdownContent));
</script>

<style scoped>
.page-bg {
  position: relative;
  min-height: calc(100vh - 64px - 76px);
  padding: 28px 18px 32px;
  background:
      radial-gradient(1200px 600px at 10% -10%, rgba(0, 209, 255, 0.10), transparent 60%),
      radial-gradient(1000px 500px at 110% 110%, rgba(99, 102, 241, 0.10), transparent 60%),
      linear-gradient(180deg, #f7fafc, #eef2f7);
  overflow: hidden;
}

.content-container {
  width: min(1120px, 96vw);
  margin: 16px auto 0;
  padding: 0 2px;
}

.main-title {
  margin: 24px 0 16px;
  color: #1e293b;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(to right, #0ea5e9, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Prose增强样式 */
:deep(.prose) {
    --tw-prose-body: #374151;
    --tw-prose-headings: #1e293b;
    --tw-prose-links: #0ea5e9;
    --tw-prose-bold: #1e293b;
    --tw-prose-bullets: #0ea5e9;
    --tw-prose-hr: #e5e7eb;
    --tw-prose-quotes: #475569;
    --tw-prose-quote-borders: #e5e7eb;
}

:deep(.prose h1, .prose h2, .prose h3) {
    background: linear-gradient(to right, #0ea5e9, #6366f1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 800;
}

:deep(.prose a) {
    transition: color 0.2s ease-in-out;
    font-weight: 500;
}

:deep(.prose a:hover) {
    color: #6366f1;
}

:deep(.prose blockquote) {
    border-left-width: 4px;
    border-image-slice: 1;
    border-image-source: linear-gradient(to bottom, #0ea5e9, #6366f1);
    background-color: #f8fafc;
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
}
</style>
