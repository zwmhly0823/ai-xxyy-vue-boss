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

const menuList = JSON.parse(localStorage.getItem('menuList')) || {}
var staff = JSON.parse(localStorage.getItem('staff')) || {}

function parseAuthorRouters ( routers, author ) {
  let data
  routers.map((route, index) => {
    if ( route.path === author ) {
      data = route
    } else {
      if ( route.children && route.children.length ) {
        parseAuthorRouters(route.children, author)
      }
    }
  })
  return data
}

export default {
  components: { SidebarItem, Logo, CustomPop },
  computed: {
    ...mapGetters(['sidebar']),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    routes() {
      let result = [];
      const newRoutes = routes.filter((item) => !item.hidden);
      if(staff && staff.admin) {
        result = newRoutes;
      }
      else {
        menuList.map(author => {
          let route = parseAuthorRouters(newRoutes, author);
          if (route) {
            result.push(route)
          }
        })
      }
      if(menuList && menuList.length > 0) {
        result.map(like => {
          let arr = []
          if (like.children) {
            menuList.map((author, i) => {
              let router = parseAuthorRouters(like.children, author)
              if (router) {
                arr.push(router)
              }
            })
            like.children = arr
          }
        })
      }
      return result;
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
      currentMenu: null
    }
  },
  methods: {
    handleLeave() {
      // this.$store.dispatch('app/resetSidebar')
    }
  }
}
</script>
