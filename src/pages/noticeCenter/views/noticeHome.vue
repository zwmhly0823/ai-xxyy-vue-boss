<template>
  <div class="notice-home">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="重点业务" name="first">重点业务</el-tab-pane>
      <el-tab-pane label="产品动态" name="second">产品动态</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'noticeHome',
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-home {
  padding: 10px;
}
</style>
