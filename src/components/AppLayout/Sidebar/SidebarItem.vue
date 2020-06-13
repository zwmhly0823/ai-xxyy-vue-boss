<!--
 * @Descripttion: sidebar item
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-03-24 12:49:53
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-12 20:49:19
-->
<template>
  <div v-if="!item.hidden">
    <!-- 只有一级的情况 -->
    <el-menu-item
      :index="index.toString()"
      @click="handleOpen(item, `${index.toString()}`)"
      v-if="!item.children"
    >
      <!-- 自定义icon类 -->
      <!-- <i :class="item.meta.icon"></i> -->
      <svg class="iconfont" :class="item.meta.icon" aria-hidden="true">
        <use :xlink:href="`#${item.meta.icon}`"></use>
      </svg>
      <span @contextmenu.prevent="handleRight(item)" slot="title">{{
        item.meta.title
      }}</span>
    </el-menu-item>
    <!-- 有二级目录的 -->
    <el-submenu :index="index.toString()" v-else>
      <template slot="title">
        <!-- @click.prevent.stop="handleOpen(item, `${index.toString()}`, true)" -->
        <!-- 有二级导航的，点击一级导航不跳转 -->
        <div
          @click.stop.prevent="() => {}"
          @mouseenter="handleMouseEndter"
          @mouseleave="handleMouseLeave"
        >
          <!-- <i :class="item.meta.icon"></i> -->
          <svg class="iconfont" :class="item.meta.icon" aria-hidden="true">
            <use :xlink:href="`#${item.meta.icon}`"></use>
          </svg>
          <span slot="title" style="font-size: 14px;">{{
            item.meta.title
          }}</span>
        </div>
      </template>
      <el-menu-item-group>
        <span slot="title">{{ item.meta.title }}</span>
        <!-- 支持多级的话，此处递归 -->
        <!-- 根据children meta的show，是否显示在导航里，false的话，只展示在popmenu里 -->
        <!-- 如果菜单是展开状态 -->
        <template v-if="sidebar.opened">
          <el-menu-item
            :index="`${index}-${cIndex}`"
            v-for="(cItem, cIndex) in item.children.filter((m) => m.meta.show)"
            :key="cItem.path"
            @click="handleOpen(cItem, `${index}-${cIndex}`)"
            @mouseleave="handleRightLeave"
            ><em @contextmenu.prevent="handleRight(cItem)">{{
              cItem.meta.title
            }}</em></el-menu-item
          >
        </template>
        <!-- 菜单是关闭状态，用elment自身pop -->
        <template v-else>
          <el-menu-item
            :index="`${index}-${cIndex}`"
            v-for="(cItem, cIndex) in item.children"
            :key="cItem.path"
            @click="handleOpen(cItem, `${index}-${cIndex}`)"
            ><em>{{ cItem.meta.title }}</em></el-menu-item
          >
        </template>
      </el-menu-item-group>
    </el-submenu>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import '@/assets/fonts/iconfont.js' // iconfont 图标
export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0
    },
    opened: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'rightpop'])
  },
  data() {
    return {
      clicked: false
    }
  },
  methods: {
    ...mapActions('tabbed', ['setCurrentTabbed', 'setTabbedList']),
    // 展开更多
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
    },

    // 弹出二级导航的浮层
    handleMouseEndter() {
      // 如果菜单是收起状态，不执行此逻辑
      if (!this.sidebar.opened) return

      // TODO: 兼容性完善
      const { right, top, width, bottom } = this.$el.getBoundingClientRect()
      const height =
        document.body.clientHeight || document.documentElement.clientHeight
      const payload = {
        show: true,
        itemMenu: this.item,
        left: (right || width) - 6,
        top,
        bottom: 0
      }
      if (bottom > height - 20) {
        Object.assign(payload, {
          bottom: 10
        })
      }
      this.$store.commit('app/TOGGLE_POPMENU', payload)
      this.$store.dispatch('app/setRightPop', {
        show: false
      })
    },
    // 隐藏二级浮层
    handleMouseLeave(e) {
      this.$store.commit('app/TOGGLE_POPMENU', {
        show: false
      })
    },

    // 右键事件
    handleRight(item) {
      const option = {
        top: event.clientY || event.y,
        left: event.clientX || event.x,
        item,
        show: true
      }
      this.$store.dispatch('app/setRightPop', option)
    },
    handleRightLeave() {
      if (!this.rightpop.show) return
      this.$store.dispatch('app/setRightPop', {
        show: false
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
