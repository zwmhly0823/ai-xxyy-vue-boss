<!--
 * @Descripttion: (批量)发送加好友短信 确认框
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-26 14:39:39
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-30 13:15:34
-->
<template>
  <el-dialog
    title="发送加好友短信"
    :visible.sync="visible"
    width="30%"
    @closed="handleClose"
  >
    <span v-if="user"
      >确定向【{{ user.name }}（{{ user.mobile }}）】发送加好友短信？</span
    >
    <span v-if="userList.length > 1">确定批量发送加好友短信？</span>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">取 消</el-button>
      <el-button
        size="small"
        :disabled="loading"
        v-loading="loading"
        type="primary"
        @click="handleSend"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 选择的要发送短信的用户 userInfo
    userList: {
      type: Array,
      default: null
    },
    // 发送成功后的回调
    result: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      loading: false
    }
  },
  computed: {
    user() {
      if (this.userList.length === 1) {
        const u = this.userList[0]
        return {
          mobile: u?.mobile || u.userInfo?.mobile || '',
          name: u?.username || u.userInfo?.username || ''
        }
      }
      return null
    }
  },

  methods: {
    handleSend() {
      if (!this.userList || this.userList.length === 0) {
        this.$message.error('请选择要发送短信的学员')
        return
      }
      // 组合当前用户的orderId
      // 根据具体的数据结构处理 此处是grapqhl userInfo
      const orderIds = this.userList.map((item) => item.order_no)
      // console.log(orderIds)
      if (orderIds.length === 0) return
      this.loading = true
      const params = orderIds.join()
      this.$http.User.sendMsgForTeacher(params)
        .then((res) => {
          this.$message({
            message: '已发送短信',
            type: 'success'
          })
          this.visible = false
          // this.result && this.result()
          // this.handleClose()
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClose() {
      this.visible = false
      // this.$emit('close')
      this.result && this.result()
    }
  }
}
</script>

<style lang="scss" scoped></style>
