<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-03-14 17:56:29
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-25 20:46:30
 -->
<template>
  <section class="app-main with-watermark">
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
import tool from '@/utils/watermark'
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  },
  data() {
    return {
      watermarkBackground: ''
    }
  },
  mounted() {
    this.watermarkBackground = tool.addWaterMark()
  }
}
</script>

<style lang="scss">
@import '~@/assets/styles/variables.scss';
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - #{$topBarWidth} - #{$multiTabbedHeight});
  width: 100%;
  position: relative;
  overflow: hidden;
  // 设置app-main的固定高度
  &.height {
    height: calc(100vh - #{$topBarWidth} - #{$multiTabbedHeight});
  }
  &-container {
    margin: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    background-color: #fff;
    .el-scrollbar {
      height: 100%;
      .app-main-container-scrollbar {
        width: 100%;
        height: 100%;
        padding: 10px 10px 0 10px;
        overflow: hidden;
      }
    }
  }
}
.fixed-header + .app-main {
  padding-top: calc(#{$topBarWidth} + #{$multiTabbedHeight});
}

.primary-text {
  color: $blueTextColor !important;
  cursor: pointer;
}
.danger-text {
  color: $dangerColor !important;
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
