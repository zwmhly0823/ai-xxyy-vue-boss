<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-03-16 16:58:26
 * @LastEditors: panjian
 * @LastEditTime: 2020-03-17 12:38:03
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
      if (this.$route.path === `${path}`) return
      if (meta.moudle) {
        console.log('path', path)
        location.href = `${path}/#/`
        return
      }
      this.$router.push(path)
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
