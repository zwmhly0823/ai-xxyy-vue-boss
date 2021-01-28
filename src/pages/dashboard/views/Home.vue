<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-05-18 18:52:36
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-19 16:19:18
-->
<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="@/assets/logo.png" /> -->
    <!-- <p>store: {{ device }}</p> -->
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {},
  computed: {
    device() {
      return this.$store.state.app.device
    }
  }
}
</script>
