<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :default-openeds="defaultOpendIndex"
        menu-trigger="click"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in routes"
          :key="route.path"
          :item="route"
          :index="index"
          :base-path="route.path"
          :opened="defaultOpendIndex"
        />
      </el-menu>
    </el-scrollbar>
    <custom-pop />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import CustomPop from './CustomPop.vue'
import routes from '@/router/index'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, Logo, CustomPop },
  computed: {
    ...mapGetters(['sidebar']),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    routes() {
      return routes.filter((item) => !item.hidden)
    },
    // 高亮选中状态
    activeMenu() {
      const { path } = this.$route
      const { pathname } = location
      let active = '0'
      if (this.routes.length === 0) return active
      this.routes.forEach((item, index) => {
        if (pathname.includes(item.meta.module)) {
          active = index.toString()
          if (item.children) {
            item.children.forEach((child, cindex) => {
              if (child.path.includes(path)) active = `${index}-${cindex}`
            })
          }
        }
      })
      return active
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    // 默认全部展开
    defaultOpendIndex() {
      const ids = routes.map((_, index) => index.toString())
      return ids
    }
  }
}
</script>
