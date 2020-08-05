<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-05 20:19:24
-->
<template>
  <el-dialog
    title="渠道线索定向分配设置"
    :visible.sync="centerDialog"
    width="60%"
    top="20vh"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    custom-class="dialog-custom"
  >
    <div class="dialog-center">
      1111111111
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogOperate('cancel')" size="mini">取 消</el-button>
      <el-button @click="dialogOperate('submit')" type="primary" size="mini"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
// import { debounce } from 'lodash'
export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  components: {},
  computed: {
    centerDialog() {
      return this.centerDialogVisible
    }
  },
  created() {},
  mounted() {},
  methods: {
    dialogClose() {
      console.log('on close is invoked')
      this.$emit('dialogOperate', { close: true })
    },
    dialogOperate(type) {
      if (type === 'cancel') {
        this.$emit('dialogOperate', { close: true })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-center {
  border: 1px solid #ebeef3;
  border-radius: 5px;
}
</style>
