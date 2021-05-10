<!--
 * @fileheader.Author: liuzhiyuan
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="changeclass-diaolog">
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      width="30%"
    >
      <div v-if="returnSuccess.length" class="changeclass-diaolog-group">
        <el-alert
          title="导入成功"
          type="success"
          center
          effect="dark"
          :closable="false"
        >
        </el-alert>
        <div class="item-content">
          <div v-for="(item, i) in returnSuccess" :key="i">
            {{ item }}
          </div>
        </div>
      </div>
      <!-- <div v-if="returnErr.length" class="changeclass-diaolog-group">
        <el-alert
          title="导入失败"
          type="error"
          center
          effect="dark"
          :closable="false"
        >
        </el-alert>
        <div class="item-content">
          <div v-for="(item, i) in returnErr" :key="i">
            {{ item.errorMsg }}
          </div>
        </div>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="$router.go(0)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentMenu: null
    }
  },
  props: {
    returnSuccess: {
      type: Array
    },
   dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
}
</script>
<style lang="scss">
.changeclass-diaolog .el-dialog {
  .el-dialog__body {
    height: 80%;
    overflow: auto;
    .changeclass-diaolog-group {
      .item-content {
        div {
          margin: 3px 0;
        }
      }
    }
  }
}
</style>
