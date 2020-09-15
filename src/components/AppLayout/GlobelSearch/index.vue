<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-10 14:49:13
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-09-15 22:03:57
-->
<template>
  <el-input
    minlength="4"
    maxlength="11"
    size="mini"
    placeholder="请输入手机号/ID搜索"
    v-model="student_id"
    @keyup.enter.native="selectStu"
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
      student_id: '',
      currentUrl: ''
    }
  },

  watch: {},
  created() {
    this.currentUrl =
      this.$store.getters.subjects.subjectCode === 1 ? 'write_app' : 'users'
  },
  methods: {
    selectStu() {
      console.log('变化', this.student_id)

      if (!this.student_id) {
        return
      }

      return this.$http.Base.getUserNumPhone(this.student_id).then((res) => {
        console.log(res.data.UserSubjectStatisticsListEx.length)

        if (
          res.data.UserSubjectStatisticsListEx &&
          res.data.UserSubjectStatisticsListEx.length === 1
        ) {
          openBrowserTab(
            `/${this.currentUrl}/#/details/${res.data.UserSubjectStatisticsListEx[0].u_id}`
          )
          this.student_id = ''
        } else if (
          res.data.UserSubjectStatisticsListEx &&
          res.data.UserSubjectStatisticsListEx.length > 1 &&
          this.student_id.length < 11
        ) {
          res.data.UserSubjectStatisticsListEx.map((item, index) => {
            if (item.user_num === this.student_id) {
              return openBrowserTab(
                `/${this.currentUrl}/#/details/${res.data.UserSubjectStatisticsListEx[index].u_id}`
              )
            }
          })
          this.student_id = ''
          this.$message.error('暂无此学员')
        } else {
          this.$message.error('暂无此学员')
          // debugger
          const oldVal = this.student_id
          this.student_id = ''
          console.log(1, this.student_id)
          this.$nextTick(() => {
            this.student_id = oldVal
            console.log(2, this.student_id)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
