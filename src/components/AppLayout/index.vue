<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <topbar />
        <!-- <multi-tabbed /> -->
        <!-- <Feedback /> -->
      </div>
      <app-main />
    </div>
    <right-pop :item="rightpopParams" />
  </div>
</template>

<script>
import Topbar from './Topbar.vue'
import Sidebar from './Sidebar/index.vue'
import AppMain from './AppMain.vue'
// import MultiTabbed from './MultiTabbed.vue'
import RightPop from '@/components/RightPop/index.vue'
import ResizeMixin from './mixin/ResizeHandler'
// import Feedback from './Feedback/index.vue'
export default {
  name: 'Layout',
  components: {
    Topbar,
    Sidebar,
    AppMain,
    // MultiTabbed,
    RightPop
    // Feedback
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        // TODO: 默认展开菜单，调整时修改此处
        // hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened
        // withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'
      }
    },
    rightpopParams() {
      return this.$store.state.app.rightpop
    }
  },
  created() {
    if (sessionStorage.getItem('store')) {
      // 页面加载前读取sessionStorage里的状态信息
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(decodeURIComponent(sessionStorage.getItem('store')))
        )
      )
    }

    window.addEventListener('beforeunload', () => {
      // 在页面刷新前将vuex里的信息保存到sessionStorage里
      sessionStorage.setItem(
        'store',
        encodeURIComponent(JSON.stringify(this.$store.state))
      )
    })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixin.scss';
@import '~@/assets/styles/variables.scss';
@import '~@/assets/styles/sidebar.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
