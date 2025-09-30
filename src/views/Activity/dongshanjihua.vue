<template>
  <!-- 东山计划 · 教学计划（纯标题+内容样式） -->
  <div class="act-bg">
    <!-- 顶部横幅：标题 + 右侧插图 -->
    <header class="hero">
      <div class="hero-text">
        <h1>东山计划——教学计划</h1>
      </div>
      <div class="hero-illu">
        <el-image :src="heroImg" fit="contain" class="hero-img" />
      </div>
    </header>

    <!-- 计划简介 -->
    <section class="section">
      <p>
        “<strong>东山计划</strong>”得名于《孟子·尽心上》“孔子登东山而小鲁，登泰山而小天下”，寓意开展RISC-V教学、培养RISC-V技术人才需要胸怀全局、勇攀高峰，是一个专注于RISC-V的教学计划
      </p>
      <p>
        计划旨在构建从基础教育到高等教育的全阶段RISC-V人才培养体系，到2030年实现“<strong>双万目标</strong>”：累计培养覆盖中学生、本科生、研究生的RISC-V人才超10,000人，推动全球RISC-V生态贡献提交数突破100,000次，为中国芯片产业自主创新注入源头活水。
      </p>
      <p>
        复旦大学双聘顶尖人才、上海开放处理器产业创新中心秘书长、“松竹梅计划”发起人——谢涛教授担任计划牵头人，山东大学戴鸿君教授担任执行负责人。
      </p>
      <p>
        “<strong>松竹梅计划</strong>”取自“<strong>岁寒三友</strong>”一词，这三种植物都象征着高尚的品格，能够在严冬中保持旺盛的生命力。面对国外限制我国AI、GPU等领域的发展困境，
        “<strong>松竹梅计划</strong>”致力于全面突破多个AI建设的功能指标、性能指标和社区活跃指标。<strong>其中，“东山集群”和“甲辰计划”将作为重要支撑体系</strong>：一方面，
        “甲辰计划”致力于在2036年实现与其他主流架构类似的成熟RISC-V硬件和软件生态系统，集聚了100多家芯片和解决方案制造商以及500多家软件开发公司，
        为“松竹梅计划”提供了丰富的RISC-V实践机会和教学案例参考；另一方面，“东山计划”依托“东山集群”平台和“东山派”开源项目，
        构建了“硬件支撑+课程改革+实践赋能”三位一体的RISC-V人才培养体系，为“松竹梅计划”培养了源源不断的RISC-V人才和产学研发展方向。
        “<strong>东山计划</strong>”和“<strong>甲辰计划</strong>”将进一步紧密互动，集中力量助力实现松竹梅计划目标：在三年时间内（至2027年11月），
        在大规模量产的基于RISC-V AI指令集扩展的AI加速卡/加速模块/加速IP（包含训练和推理、云侧和端侧）上，适配PyTorch、TensorFlow、Triton、
        飞浆等主流AI框架。
      </p>
      <p>
        为实现上述愿景，“东山计划”将重点推动以下工作：
      </p>
      <p>
        <strong>优化现有硬件支撑</strong>，依托为RISC-V社区贡献者开放的“东山1号集群”，为计划成员提供远程登陆等教学资源支持，持续推动融合软硬件能力的“东山派项目”，
        发挥“东山派”开发板作为教学工具的实践价值，加大“东山2号集群”研发力度，完善山东大学RISC-V重要教育实体体系构建；
      </p>
      <p>
        <strong>改革课程教案体系</strong>，设计涵盖初中生、高中生、低/高年级大学生的RISC-V启蒙与钻研培养路径，建立从“青苗计划”到“产业精英”的全周期培养机制，
        推动RISC-V知识融入10门高校主干课程，覆盖计算机、软件、电子信息集成电路等100个学院（系），形成“必修+选修+实践”的立体化课程矩阵；
      </p>
      <p>
        <strong>丰富学生RISC-V竞赛渠道</strong>，筹办2025年“算能杯ICAN创新创业大赛”RISC-V专项赛道等赛事，结合“东山派”等开发板，提高学生动手实践能力，
        为优秀参赛者提供丰厚的奖金，推荐学生参与到“甲辰计划·开源实习生联合招聘培养”的绿色实习通道，赋能学生全面发展。
      </p>
      <p>
        除此之外，山东大学将建设面向东山的RISC-V开源生态基地——东山社区，在其中集中呈现“东山集群”和“东山派”已适配和优化的开源软件、
        正在研发的开源项目等资源，作为教学资料供计划师生参考，加速RISC-V教学任务落地。
      </p>
      <p>
        “东山计划”将联合更多RISC-V教学合作伙伴，持续推动“RISC-V人才认证体系”建设，让学生在RISC-V课程中学到先进本领，
        逐步推进中国RISC-V人才生态高地建设，为开源芯片领域注入新动能，为全球RISC-V生态发展注入新动力。
      </p>
    </section>
  </div>
</template>

<script setup>
import heroImg from '@/assets/img/dongshan.svg';
</script>

<style scoped>
/* 背景与布局 */
.act-bg {
  position: relative;
  min-height: calc(100vh - 64px - 76px);
  padding: 28px 18px 32px;
  background:
      radial-gradient(1200px 600px at 10% -10%, rgba(0, 209, 255, 0.10), transparent 60%),
      radial-gradient(1000px 500px at 110% 110%, rgba(99, 102, 241, 0.10), transparent 60%),
      linear-gradient(180deg, #f7fafc, #eef2f7);
  overflow: hidden;
}

/* 顶部横幅（保留） */
.hero{
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 12px;
  padding: 20px 22px;
  margin: 0 auto 8px;
  width: min(1120px, 96vw);
}
.hero-text h1{
  margin: 0 0 8px;
  color:#0f172a;
  font-size: 50px;
  font-weight: bold;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", sans-serif;
}
.lead{ margin: 0; color:#475569; line-height: 1.8; }
.hero-illu{ display:flex; align-items:center; justify-content:center; }
.hero-img{ width: 88%; max-width: 420px; }

/* 内容区块（直排） */
.section{
  width: min(1120px, 96vw);
  margin: 16px auto 0;
  padding: 0 2px; /* 更像正文页，不再卡片化 */
}
.sub{
  margin: 0 0 10px;
  color:#0f172a;
  font-size: 26px;
}
.h3{ margin: 12px 0 6px; color:#0f172a; font-size: 18px; }

.section p{
  color:#475569;
  line-height: 1.9;
  margin: 0 0 10px;
  text-indent: 2em;
}
.section ul{ margin: 6px 0 12px 20px; color:#475569; line-height: 1.9; }

.intern-title {
  margin: 24px 0 16px;
  color: #1e293b;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}

/* 行内统计 */
.stats-inline{
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding: 0;
  margin: 8px 0 0;
  list-style: none;
}
.stats-inline li{ color:#334155; }
.stats-inline strong{ font-weight: 800; }

/* 响应式 */
@media (max-width: 1024px){
  .hero{ grid-template-columns: 1fr; }
  .hero-img{ width: 60%; max-width: 380px; }
}
</style>
