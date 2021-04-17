<template>
  <div :class="{ 'has-logo': showLogo }" @mouseleave="handleLeave">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
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

function parseAuthorRouters(routers, author) {
  let data
  routers.map((route, index) => {
    if (author.path === route) {
      data = author
    } else {
      if (author.children && author.children.length) {
        parseAuthorRouters(author.children, route)
      }
    }
  })
  return data
}

export default {
  components: { SidebarItem, Logo, CustomPop },
  computed: {
    ...mapGetters(['sidebar']),
    // 高亮选中状态
    activeMenu() {
      const { path } = this.$route
      const { pathname } = location
      let active = '0'
      const routes = this.routes
      if (routes.length === 0) return active
      // 写字项目：根据切换科目默认跳转路径设置导航默认选中项，现在默认是 学员管理-我的学员
      if(pathname.includes('music_app')){
        // 音乐项目
        routes.forEach((item, index) => {
          index = index.toString()
          if (item?.meta?.module && pathname.includes(item.meta.module)) {
            if (item.path === path) {
              active = index
            }
            // TODO: 特殊处理-显示老版体验课班级入口
            // if (location.hash === '#/trialTeam') {
            //    active = '0-0'
            // }
            if (item.children) {
              const children = item.children.filter((item) => item.meta.show)
              children.forEach((child, cindex) => {
                // if (child.path.includes(path)) active = `${index}-${cindex}`
                if (child.path === path) active = `${index}-${cindex}`
                console.log(active)
              })
            }
          } else {
            if (item.path === path) {
              active = index
            }
            if (item.children) {
              const children = item.children.filter((item) => item.meta.show)
              children.forEach((child, cindex) => {
                // if (child.path.includes(path)) active = `${index}-${cindex}`
                if (child.path === path) active = `${index}-${cindex}`
              })
            }
          }
        })
      }
      return active
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    routes() {
      let result = []
      const newRoutes = routes.filter((item) => !item.hidden)

      // console.log('menuList', menuList)
      // console.log('newRoutes', newRoutes)
      if (staff && staff.admin) {
        result = newRoutes
      } else {
        newRoutes.map((author) => {
          let route = parseAuthorRouters(menuList, author)
          if (route) {
            result.push(route)
          }
        })
      }
      if (menuList && menuList.length > 0) {
        result.map((like) => {
          let arr = []
          if (like.children) {
            like.children.map((author, i) => {
              let router = parseAuthorRouters(menuList, author)
              if (router) {
                arr.push(router)
              }
            })
            like.children = arr
          }
        })
      }
      // console.log('result', result);
      return result
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
     // 默认全部展开
    defaultOpendIndex() {
      // const ids = routes.map((_, index) => index.toString())
      const ids = ['0', '1', '2'];
      return ids
    }
  },
  data() {
    return {
      currentMenu: null,
      // 让每一项传过来的数据进行对比
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
      this.activeMenu = active == null ? '' : active
    },
    handleLeave() {
      // this.$store.dispatch('app/resetSidebar')
    },
  },
}
</script>
