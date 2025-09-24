<template>
  <div class="project-detail">
    <h1>{{ project?.name }}</h1>
  </div>
</template>

<script>
export default {
  name: 'OneProject',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      project: null
    }
  },
  created() {
    this.fetchProjectDetail();
  },
  methods: {
    fetchProjectDetail() {
      this.project = {
        id: this.id,
        name: '示例项目',
        description: '这是一个示例项目的详情'
      };
    }
  }
}
</script>
