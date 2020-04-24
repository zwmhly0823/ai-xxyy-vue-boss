<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-03-14 17:56:29
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-24 17:47:19
 -->
<template>
  <section class="app-main">
    <!-- <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition> -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="key" />
      </keep-alive>
    </transition>

    <transition name="fade-transform" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - #{$topBarWidth});
  width: 100%;
  position: relative;
  overflow: hidden;
  // 设置app-main的固定高度
  &.height {
    height: calc(100vh - #{$topBarWidth});
  }
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
