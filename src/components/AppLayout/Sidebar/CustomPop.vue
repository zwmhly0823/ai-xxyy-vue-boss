<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-09 10:52:48
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-11 13:04:07
-->
<template>
  <div
    id="custom-menu"
    class="el-menu--vertical custome-pop-menu"
    :style="myStyle"
    x-placement="right-start"
    v-show="popMenu.show"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <ul role="menu" class="el-menu el-menu--popup el-menu--popup-right-start">
      <li data-v-1c22e290="" class="el-menu-item-group">
        <div class="el-menu-item-group__title" style="padding-left: 20px;">
          <span data-v-1c22e290="">{{ menu && menu.title }}</span>
        </div>
        <ul>
          <li
            class="el-menu-item"
            v-for="(item, index) in menu.list"
            :key="item.path"
            @click="handleOpen(item, `${index.toString()}`)"
          >
            <em data-v-1c22e290="">{{ item.meta.title }}</em>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['popMenu']),
    myStyle() {
      const obj = {
        left: this.popMenu.left + 'px'
      }
      if (this.popMenu.bottom) {
        Object.assign(obj, {
          bottom: this.popMenu.bottom + 'px'
        })
      } else {
        Object.assign(obj, {
          top: this.popMenu.top + 'px'
        })
      }
      return obj
    },
    menu() {
      const { itemMenu } = this.popMenu
      const obj = {}
      if (itemMenu && Object.keys(itemMenu).length > 0) {
        Object.assign(obj, {
          title: itemMenu.meta.title,
          list: itemMenu.children
        })
      }
      return obj
    }
  },
  methods: {
    // ...mapActions('tabbed', ['setCurrentTabbed', 'setTabbedList']),
    handleEnter(e) {
      this.$store.commit('app/TOGGLE_POPMENU', {
        show: true
      })
    },
    handleLeave(e) {
      this.$store.commit('app/TOGGLE_POPMENU', {
        show: false,
        itemMenu: {},
        left: 0,
        top: 0
      })
    },

    handleOpen(item, index = 0, hasChildren = false) {
      console.log(item)

      const currentItem = item || this.item
      const { path, meta } = currentItem
      const pathname = location.pathname
      let baseUrl = ''
      // const tabItem = {}

      if (this.clicked && hasChildren) return
      this.clicked = hasChildren

      // https://msb-ai.meixiu.mobi/ai-app-vue-toss-test/student-team/#/ 测试环境
      if (pathname.includes('test')) {
        const pathArr = pathname.split('/')
        baseUrl = '/' + [pathArr[1]].join('/') // , pathArr[2]
      }

      if (this.$route.path === `${path}`) return
      this.handleLeave()
      // 同一模块,hash
      let pathUrl
      let pathUrl2
      if (pathname.includes(meta.module)) {
        if (path.split('/')[1] !== meta.module) {
          pathUrl = path
          pathUrl2 = `${baseUrl}/${meta.module}/#${path}`
        } else if (this.$route.path !== '/') {
          pathUrl = '/'
          pathUrl2 = `${baseUrl}${path}/#/`
        }
        this.$router.push(pathUrl)
      } else {
        if (path.split('/')[1] !== meta.module) {
          pathUrl2 = `${baseUrl}/${meta.module}/#${path}`
        } else {
          pathUrl2 = `${baseUrl}${path}/#/`
        }
        location.href = pathUrl2
      }

      // 多页签打开
      // Object.assign(tabItem, { [`${pathUrl2}`]: { meta } })
      // const multiTabbed =
      //   JSON.parse(sessionStorage.getItem('multiTabbed')) || {}
      // if (!Object.keys(multiTabbed).includes(pathUrl2)) {
      //   Object.assign(multiTabbed, tabItem)
      //   sessionStorage.setItem('multiTabbed', JSON.stringify(multiTabbed))
      //   this.setTabbedList(multiTabbed)
      // }
      // sessionStorage.setItem('currentMultiTab', pathUrl2)
      // this.setCurrentTabbed(pathUrl2)
    }
  }
}
</script>

<style lang="scss" scoped>
#custom-menu.el-menu--vertical {
  position: fixed;
  z-index: 2000;
  border-left: 3px solid transparent;
  .el-menu--popup {
    .el-menu-item {
      height: 30px !important;
      line-height: 30px !important;
      padding: 0 20px !important;
      // font-size: 13px;
      // background-color: #fff;
      // color: #292f41;
      &:hover {
        background-color: transparent !important;
        color: #2a75ed !important;
      }
    }
  }
}
</style>
