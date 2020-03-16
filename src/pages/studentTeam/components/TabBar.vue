<template>
  <div class="tab-box">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="学员" name="students">
        学员
      </el-tab-pane>
      <el-tab-pane label="带班详情" name="details">
        带班详情
      </el-tab-pane>
      <el-tab-pane label="微信群聊" name="groupChat">
        微信群聊
      </el-tab-pane>
      <el-tab-pane label="系统课订单" name="systemOrder">
        系统课订单
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'students'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style scoped lang="scss">
.tab-box {
  padding: 0px 10px;
}
</style>
