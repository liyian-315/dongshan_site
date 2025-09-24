<template>
  <div class="open-source-projects">
    <router-view class="project-content"></router-view>
  </div>
</template>

<script setup>
</script>

<style scoped>
.open-source-projects {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.project-header h1 {
  color: #1a202c;
  margin-bottom: 10px;
}

.project-header p {
  color: #4a5568;
  margin: 0;
}

.project-content {
  min-height: 500px;
}
</style>
