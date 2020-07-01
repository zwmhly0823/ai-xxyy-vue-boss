<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-30 20:43:45
-->
<template>
  <el-dialog
    title="提示"
    :visible.sync="centerDialog"
    width="30%"
    center
    :before-close="dialogClose"
  >
    <span>需要注意的是内容是默认不居中的</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogOperate('cancel')">取 消</el-button>
      <el-button type="primary" @click="dialogOperate('confirm')"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ['centerDialogVisible'],
  data() {
    return {}
  },
  components: {},
  computed: {
    centerDialog() {
      return this.centerDialogVisible
    }
  },
  methods: {
    dialogClose() {
      this.$emit('dialogOperate', 'cancel')
    },
    dialogOperate(type) {
      this.$emit('dialogOperate', type)
    }
  }
}
</script>
<style lang="sass" scoped></style>
