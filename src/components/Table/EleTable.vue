<!--
 * @Descripttion: 
 * @version: 
 * @Author: shentong
 * @Date: 2020-03-14 15:11:17
 * @LastEditors: Shentong
 * :max-height="maxHeight"
 * @LastEditTime: 2020-04-17 17:41:39
 -->
<template>
  <div id="tableList">
    <el-table
      :data="dataList"
      style="width: 100%"
      :header-cell-style="{
        fontSize: '12px',
        color: '#666',
        fontWeight: 'normal'
      }"
      v-loading="loading"
      element-loading-text="玩命加载中~"
      element-loading-spinner="el-icon-loading"
      @sort-change="sortChange"
      id="outTable"
    >
      <slot></slot>
    </el-table>
    <div class="page_box">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="pageChange_handler"
        :current-page="page"
        :page-size.sync="size"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
/*
 * @Author: 沈童
 * @Date: 2019-07-27 14:57:16
 * @LastEditors: 沈童
 * @LastEditTime: 2019-07-27 18:23:23
 * @Description: table 二次封装
 */
export default {
  props: ['loading', 'dataList', 'size', 'total', 'page'],
  components: {},
  data() {
    return {
      maxHeight: null
    }
  },
  methods: {
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.$emit('pageChange', page)
    },
    /**
     * @description 排序 回调事件
     */
    sortChange(column) {
      this.$emit('sort-change', column)
    }
  },
  mounted() {
    this.maxHeight = `${document.documentElement.clientHeight}` - 250
    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
    window.onresize = () => {
      this.maxHeight = `${document.documentElement.clientHeight}` - 250
    }
  },
  created() {},
  watch: {
    page() {
      console.log(this.page, 'page------')
    }
  }
}
</script>
<style lang="scss" scoped>
#tableList {
  min-width: 900px;
}
.page_box {
  margin: 0 20px 20px 0;
  text-align: right;
  text-align: right;
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
