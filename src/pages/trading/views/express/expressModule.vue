<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 15:13:40
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-24 19:49:18
 -->
<template>
  <el-row type="flex" class="app-main height express-main">
    <el-col class="express-main-left">
      <div class="express-main-left-content">
        <left-bar @change="dataExpress" />>
      </div>
    </el-col>
    <el-col class="express-main-right">
      <div class="express-main-right-content">
        <!-- <el-scrollbar wrap-class="scrollbar-wrapper" id="right-scroll"> -->
        <right-bar :dataExp="Express" @search="search" />
        <!-- </el-scrollbar> -->
      </div>
    </el-col>
  </el-row>
</template>

<script>
import leftBar from './components/leftBar'
import rightBar from './components/rightBar'

export default {
  props: [],
  components: {
    leftBar,
    rightBar
  },
  data() {
    return {
      Express: { id: '0,1,2,3,6' }
    }
  },
  computed: {},
  watch: {},
  methods: {
    dataExpress(val) {
      this.Express = val ? (this.Express = val) : this.Express
    },
    search(val) {
      console.log(val, 'search')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.express-main {
  background-color: #f0f1f2;
  &-left {
    padding-left: 0px;
    width: 180px;
    min-width: 180px;
    border-right: 1px solid #e3e3e3;
    &-content {
      // height: 100%;
      height: 100%;
    }
  }
  &-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    &-content {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }
}
</style>
<style>
.express-main-right-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.express-main-right-content .el-scrollbar {
  flex: 1;
}
</style>
