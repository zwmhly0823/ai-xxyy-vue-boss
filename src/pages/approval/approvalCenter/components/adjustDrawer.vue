<template>
  <el-drawer
    ref="adjustDrawer"
    :title="adjustDrawerData.title"
    :visible.sync="adjustDrawerShow"
    direction="rtl"
    class="adjust-drawer-class"
    :modal-append-to-body="false"
    :before-close="handleDrawerClose"
    v-loading="adjustDrawerData.loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-form :model="adjustDrawerData" class="adjust-drawer-form">
      <el-form-item
        v-for="(dItem, dKey) in adjustDrawerData.content"
        :key="dKey"
        :label="dItem.label"
        :label-width="adjustDrawerData.width"
      >
        <span>{{ dItem.value }}</span>
      </el-form-item>
    </el-form>
    <div
      v-if="adjustDrawerData.type === 'notDone'"
      class="adjust-drawer-button-box"
    >
      <el-button @click="adjustDrawerPass('reject')">拒 绝</el-button>
      <el-button type="primary" @click="adjustDrawerPass('pass')"
        >同 意</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'adjustDrawer',
  props: ['adjustDrawerData'],
  data() {
    return {
      adjustDrawerShow: false
    }
  },
  methods: {
    adjustDrawerPass(data) {
      this.$emit('result', data)
    },
    handleDrawerOpen() {
      this.adjustDrawerShow = true
    },
    handleDrawerClose() {
      this.adjustDrawerShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.adjust-drawer-class {
  margin-top: 50px;
  /deep/ .el-drawer__body {
    overflow: auto;
    .el-form-item {
      margin-bottom: 3px;
      .el-form-item__content {
        padding-left: 20px;
        word-wrap: break-word;
      }
    }
  }
  /deep/ .el-drawer__header span[role='heading']:focus {
    outline: 0;
  }
  .adjust-drawer-form {
    margin-bottom: 60px;
  }
  .adjust-drawer-button-box {
    text-align: center;
    height: 60px;
    line-height: 60px;
    width: 100%;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
