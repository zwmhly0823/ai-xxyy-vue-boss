<!--
 * @Descripttion: sidebar item
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-03-24 12:49:53
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-08 16:11:33
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
      <i :class="item.meta.icon"></i>
      <span slot="title">{{ item.meta.title }}</span>
    </el-menu-item>
    <!-- 有二级目录的 -->
    <el-submenu :index="index.toString()" v-else>
      <template slot="title">
        <!-- @click.prevent.stop="handleOpen(item, `${index.toString()}`, true)" -->
        <!-- 有二级导航的，点击一级导航不跳转 -->
        <div @click.stop.prevent="() => {}" @mouseenter="handleMouseEndter">
          <i :class="item.meta.icon"></i>
          <span slot="title" style="font-size: 16px;">{{
            item.meta.title
          }}</span>
        </div>
      </template>
      <el-menu-item-group>
        <span slot="title">{{ item.meta.title }}</span>
        <!-- 支持多级的话，此处递归 -->
        <el-menu-item
          :index="`${index}-${cIndex}`"
          v-for="(cItem, cIndex) in item.children"
          :key="cItem.path"
          @click="handleOpen(cItem, `${index}-${cIndex}`)"
          ><em>{{ cItem.meta.title }}</em></el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
    }
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
      const tabItem = {}

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
      Object.assign(tabItem, { [`${pathUrl2}`]: { meta } })
      const multiTabbed =
        JSON.parse(sessionStorage.getItem('multiTabbed')) || {}
      if (!Object.keys(multiTabbed).includes(pathUrl2)) {
        Object.assign(multiTabbed, tabItem)
        sessionStorage.setItem('multiTabbed', JSON.stringify(multiTabbed))
        this.setTabbedList(multiTabbed)
      }
      sessionStorage.setItem('currentMultiTab', pathUrl2)
      this.setCurrentTabbed(pathUrl2)
    },

    // 弹出二级导航的浮层
    handleMouseEndter(e) {
      console.log(e, 'right')
    }
  }
}
</script>

<style lang="scss" scoped></style>
