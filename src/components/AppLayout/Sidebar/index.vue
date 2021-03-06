<template>
  <div :class="{ 'has-logo': showLogo }" @mouseleave="handleLeave">
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
// import routes from '@/router/index'
import routes from '@/config/sidebarMenu/index'
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
    activeMenuCopy() {
      const { path } = this.$route
      const { pathname } = location
      let active = '0'
      let firstIndex = '0'
      let secondIndex = ''
      if (this.routes.length === 0) {
        return active
      }
      for (let i = 0; i < this.routes.length; i++) {
        let item = this.routes[i]
        if (pathname.includes(item.meta.module)) {
          firstIndex = i
          for (let j = 0; j < item.length; j++) {
            let child = item[j]
            if (child.path.includes(path)) {
              secondIndex = j
            }
          }
        }
      }
      // this.routes.forEach((item, index) => {
      //   if (pathname.includes(item.meta.module)) {
      //     // active = index.toString()
      //     firstIndex = index.toString()
      //     if (item.children) {
      //       item.children.forEach((child, cindex) => {
      //         if (child.path.includes(path)) {
      //           // active = `${index}-${cindex}`
      //           secondIndex = cindex.toString()
      //         }
      //       })
      //     }
      //   }
      // })
      active = firstIndex + (secondIndex == '' ? '' : '-' + secondIndex)
      console.log(active)
      return active
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      // TODO: 默认展开菜单，调整时修改此处
      // return !this.sidebar.opened
      return false
    },
    // 默认全部展开
    defaultOpendIndex() {
      const ids = routes.map((_, index) => index.toString())
      return ids
    }
  },
  data() {
    return {
      currentMenu: null,
      activeMenu: '0'
    }
  },
  created() {
    this.getActive()
  },
  activated() {
    this.getActive()
  },
  methods: {
    getActive() {
      let active = localStorage.getItem('menuActive')
      this.activeMenu = active==null?'':active;
    },
    handleLeave() {
      // this.$store.dispatch('app/resetSidebar')
    }
  }
}
</script>
