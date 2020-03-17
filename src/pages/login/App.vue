<!--
 * @Date: 2020-03-13 15:20:21
 * @LastEditors: shentong
 * @LastEditTime: 2020-03-16 17:14:14
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/App.vue
 -->
<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
// import AppLayout from '@/components/AppLayout/index.vue'
export default {
  name: 'login',
  components: {
    // AppLayout
  }
}
</script>
