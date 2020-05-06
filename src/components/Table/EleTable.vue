<!--
 * @Descripttion: 
 * @version: 
 * @Author: shentong
 * @Date: 2020-03-14 15:11:17
 * @LastEditors: Shentong
 * :max-height="maxHeight"
 * @LastEditTime: 2020-05-06 20:21:20
 -->
<template>
  <div id="tableList" :class="{ 'no-padding': size > total }">
    <el-table
      :size="tableSize"
      :data="dataList"
      :max-height="size > total ? tableHeight : tableHeight + 50"
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
    <div class="page_box" v-if="size <= total">
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
  // props: ['loading', 'dataList', 'size', 'total', 'page'],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default: () => []
    },
    tableSize: {
      type: String,
      default: 'medium'
    },
    tableHeight: {
      type: String,
      default: 'auto'
    },
    size: {
      type: Number,
      default: 20
    },
    page: Number,
    total: Number
  },
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
    // console.log(this.tableHight, 'tableHight')
    // this.maxHeight = `${document.documentElement.clientHeight}` - 250
    // // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
    // window.onresize = () => {
    //   this.maxHeight = `${document.documentElement.clientHeight}` - 250
    // }
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
  position: relative;
  padding-bottom: 50px;
  &.no-padding {
    padding-bottom: 0;
  }
}
.page_box {
  height: 50px;
  display: flex;
  align-items: center;
  text-align: right;
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 15px;
}
</style>
