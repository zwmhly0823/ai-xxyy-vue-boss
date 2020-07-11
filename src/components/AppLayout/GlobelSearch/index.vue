<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-10 14:49:13
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-07-11 14:54:02
-->
<template>
  <el-input
    minlength="4"
    maxlength="11"
    size="mini"
    placeholder="请输入手机号/ID搜索"
    v-model="student_id"
    @change="selectStu"
    clearable
  >
    <i slot="prefix" class="el-input__icon el-icon-search"></i>
  </el-input>
</template>

<script>
import { openBrowserTab } from '@/utils/index'
export default {
  data() {
    return {
      student_id: ''
    }
  },
  watch: {},
  created() {},
  methods: {
    selectStu() {
      console.log('变化', this.student_id)
      if (!this.student_id) {
        return
      }
      const params =
        this.student_id.length === 11
          ? {
              mobile: this.student_id
            }
          : {
              user_num: this.student_id
            }
      return this.$http.User.getUserInfo(JSON.stringify(params)).then((res) => {
        if (res.data.User && res.data.User.id) {
          openBrowserTab(`/users/#/details/${res.data.User.id}`)
          this.student_id = ''
        } else {
          this.$message.error('暂无此学员')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
