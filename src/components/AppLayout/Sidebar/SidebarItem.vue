<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-24 12:49:53
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-03-24 12:49:53
 * @Description: TODO: 目前只支持二级
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
        <div
          @click.prevent.stop="handleOpen(item, `${index.toString()}`, true)"
        >
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
          >{{ cItem.meta.title }}</el-menu-item
        >
      </el-menu-item-group>
    </el-submenu>
  </div>
</template>

<script>
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
    // 展开更多
    handleOpen(item, index = 0, hasChildren = false) {
      const currentItem = item || this.item
      const { path, meta } = currentItem
      const pathname = location.pathname
      let baseUrl = ''

      if (this.clicked && hasChildren) return
      this.clicked = hasChildren

      // https://msb-ai.meixiu.mobi/ai-app-vue-toss-test/student-team/#/ 测试环境
      if (pathname.includes('test')) {
        const pathArr = pathname.split('/')
        baseUrl = '/' + [pathArr[1]].join('/') // , pathArr[2]
      }

      if (this.$route.path === `${path}`) return
      // 同一模块,hash
      if (pathname.includes(meta.module)) {
        if (path.split('/')[1] !== meta.module) {
          this.$router.push(path)
        } else if (this.$route.path !== '/') {
          this.$router.push('/')
        }
      } else {
        if (path.split('/')[1] !== meta.module) {
          location.href = `${baseUrl}/${meta.module}/#${path}`
          return
        }
        location.href = `${baseUrl}${path}/#/`
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
