<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-29 21:23:34
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-07-31 20:46:36
-->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container">
      <router-view />
    </div>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      status: '0' // @status: 0-待上课，1-上课中，2-已完课
    }
  },

  computed: {
    statusText() {
      let text = ''
      switch (this.status) {
        case '0':
          text = '待上课'
          break
        case '1':
          text = '上课中'
          break
        case '2':
          text = '已完课'
          break
        default:
          break
      }
      return text
    }
  },

  mounted() {
    const {
      params: { status }
    } = this.$route
    this.status = status
  },

  methods: {}
}
</script>
