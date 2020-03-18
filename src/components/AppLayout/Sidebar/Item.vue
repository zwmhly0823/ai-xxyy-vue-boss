<!--
 * @Descripttion: 
 * @version: 
<<<<<<< HEAD
 * @Author: panjian
 * @Date: 2020-03-16 16:58:26
 * @LastEditors: Shentong
 * @LastEditTime: 2020-03-17 18:47:52
=======
 * @Author: YangJiyong
 * @Date: 2020-03-16 11:38:09
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-03-16 14:11:56
>>>>>>> develop
 -->
<template>
  <div>
    <div class="item d-flex align-center justify-between" v-if="levelOne">
      <!-- <i :class="icon" v-if="levelOne"></i> -->
      <span class="flex-1">{{ title }}</span>
      <!-- <i class="el-icon-arrow-right" v-if="levelOne || hasChildren"></i> -->
    </div>
    <div
      class="item d-flex align-center justify-between"
      @click.stop.prevent="handleOpen"
      v-if="hasChildren"
    >
      <i :class="icon" v-if="hasChildren"></i>
      <span class="flex-1">{{ title }}</span>
      <i class="el-icon-arrow-right" v-if="levelOne || hasChildren"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    // icon 类名，在sidebar.scss中统一定义 'el-icon-share'
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    levelOne: {
      type: Boolean,
      default: false
    },
    hasChildren: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 展开更多
    handleOpen() {
      const { path, meta } = this.item
      const pathname = location.pathname
      let baseUrl = ''

      // https://msb-ai.meixiu.mobi/frontend/ai-app-vue-toss/student-team/#/ 测试环境
      if (pathname.includes('frontend')) {
        const pathArr = pathname.split('/')
        baseUrl = '/' + [pathArr[1], pathArr[2]].join('/')
      }

      if (this.$route.path === `${path}`) return
      // 同一模块,hash
      // if (meta.module === pathname.split('/')[1]) {
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

      // TODO: 更多二级菜单弹层
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/common.scss';
.item {
  font-size: 16px;
  font-weight: bold;
  i {
    position: relative;
    width: 18px;
    height: 18px;
  }
  .el-icon-arrow-right {
    right: -15px;
  }
  span {
    margin-left: 10px;
  }
}
</style>
