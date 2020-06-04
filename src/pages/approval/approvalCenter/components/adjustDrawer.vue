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
    <el-form :model="adjustDrawerData" class="adjust-drawer-form" v-if="reload">
      <el-form-item
        v-for="(dItem, dKey) in adjustDrawerData.content"
        :key="dKey"
        :label="dItem.label"
        :label-width="adjustDrawerData.width"
      >
        <template v-if="dItem.type === 'img'">
          <template
            v-if="
              dItem.value.indexOf('mp4') > -1 ||
                dItem.value.indexOf('mov') > -1 ||
                dItem.value.indexOf('flv') > -1 ||
                dItem.value.indexOf('rmvb') > -1
            "
          >
            <video
              style="width: 220px; height: 120px;"
              :src="dItem.value"
              controls
            ></video>
          </template>
          <template v-else>
            <el-image
              style="width: 220px; height: 120px;"
              :src="dItem.value"
              fit="contain"
              :preview-src-list="[dItem.value]"
            >
            </el-image>
          </template>
        </template>
        <template v-else>
          <span>{{ dItem.value }}</span>
        </template>
      </el-form-item>
    </el-form>
    <div
      v-if="adjustDrawerData.type === 'notDone' && isStaffId"
      class="adjust-drawer-button-box"
    >
      <el-button @click="adjustDrawerPass('reject')">拒 绝</el-button>
      <el-button type="primary" @click="adjustDrawerPass('pass')"
        >同 意</el-button
      >
    </div>
    <div
      v-if="adjustDrawerData.financeStatus === 'DECLINE'"
      class="adjust-drawer-button-box"
    >
      <el-button @click="rejectedDrawerPass('left')">
        {{ adjustDrawerData.leftButtonText }}
      </el-button>
      <el-button
        type="primary"
        v-show="adjustDrawerData.hasEdit"
        @click="rejectedDrawerPass('right')"
      >
        {{ adjustDrawerData.rightButtonText }}
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'adjustDrawer',
  props: ['adjustDrawerData', 'isStaffId'],
  data() {
    return {
      adjustDrawerShow: false,
      reload: true
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
    },
    reloadFun() {
      this.reload = false
      this.$nextTick(() => {
        this.reload = true
      })
    },
    rejectedDrawerPass(data) {
      this.$emit('drawButtonEmit', data)
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
