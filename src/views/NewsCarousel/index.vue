<template>
  <el-card>
    <h2>最新学术新闻</h2>
    <el-carousel height="180px" indicator-position="outside">
      <el-carousel-item v-for="(item, idx) in newsList" :key="idx">
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
      </el-carousel-item>
    </el-carousel>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElCarousel, ElCarouselItem, ElCard } from 'element-plus'

const newsList = ref([
  { title: 'AI 助力学术研究', content: '人工智能正在改变学术研究的方式。' },
  { title: '开放获取资源增长', content: '越来越多的学术资源实现开放获取。' },
  { title: '国际会议动态', content: '最新国际学术会议资讯一览。' }
])
</script>
