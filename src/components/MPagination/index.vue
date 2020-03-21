<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-21 19:18:17
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-03-21 19:18:17
 * @Description: 分页组件
 * 参数同 el-pagination
 -->

<template>
  <el-row class="m-pagination" type="flex">
    <el-col>
      <!-- 这里是自定义的附加信息 -->
      <slot></slot>
    </el-col>
    <el-col>
      <el-pagination
        :layout="defaultLayout"
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        :pager-count="pagerCount"
        @current-change="handleCurrentChange"
      >
        <span class="page-slot"> {{ page }} / 共{{ totalPage }}页</span>
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    // 是否需要显示页码，设置 pager
    showPager: {
      type: Boolean,
      default: false
    },
    // 当前页
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 20
    },
    // 总条数 与 pageCount 先其一传值
    total: {
      type: Number,
      default: 0
    },
    // 总页数
    pageCount: {
      type: Number,
      default: 0
    },
    // 最多显示几个页码，showPager为true时有效
    pagerCount: {
      type: Number,
      default: 5
    }
  },
  computed: {
    defaultLayout() {
      // 这里是有顺序的 ！！！
      const layout = this.showPager
        ? 'prev, slot, pager, next, total'
        : 'prev, slot, next, total'
      return layout
    },
    // 总页数. 如果有 pageCount 用 pageCount, 没有用 total / pageSize
    totalPage() {
      return this.pageCount || Math.ceil(this.total / this.pageSize) || 1
    }
  },
  data() {
    return {
      page: this.currentPage
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.page = page
      // 回调
      this.$emit('currentPage', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.m-pagination {
  padding: 15px;
  color: #4d4d4d;
  .el-pagination {
    display: flex;
    justify-content: flex-end;
  }
  .page-slot {
    font-weight: normal;
  }
}
</style>
