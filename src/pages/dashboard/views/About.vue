<!--
 * @Descripttion: 
 * @version: 
 * @Author: shentong
 * @Date: 2020-03-13 14:17:45
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-13 18:57:15
 -->
<template>
  <div class="about">
    <h1>{{ title }}</h1>
    <el-button type="primary" @click="getLogin">接口调试1</el-button>
    <el-button type="primary" @click="getLoginOrder">接口调试2</el-button>
  </div>
</template>

<script>
// export default {
//   name: 'Home',
//   components: {},
//   computed: {
//     device() {
//       return this.$store.state.app.device
//     }
//   }
// }
export default {
  data() {
    return {
      title: 'This is an about page'
    }
  },
  mounted() {},
  methods: {
    getLogin() {
      this.$http.User.loginIn()
        .then((res) => {})
        .catch((err) => console.log(err))
    },
    getLoginOrder() {
      this.$http.Order.loginIn()
        .then((res) => {})
        .catch((err) => console.log(err))
    }
  }
}
</script>
