<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-26 18:41:46
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-14 18:30:20
 -->
<template>
  <div class="container">
    <tab-content />
  </div>
</template>

<script>
import tabContent from './tabContent'
export default {
  components: {
    tabContent
  }
}
</script>

<style lang="scss" scoped>
.container {
  // width: calc(100vw)-50px;
  overflow: hidden;
}
</style>
<style lang="scss">
.el-image-viewer__wrapper{
  z-index: 2010!important;
}
</style>
