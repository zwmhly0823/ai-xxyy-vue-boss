<!--
 * @Descripttion: 
 * @version: 
 * @Author: Shentong
 * @Date: 2020-03-16 17:04:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-17 18:51:29
 -->
<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'login',
  components: {}
}
</script>
