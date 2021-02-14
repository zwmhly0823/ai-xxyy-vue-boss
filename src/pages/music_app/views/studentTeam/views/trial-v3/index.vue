<template>
  <div class="class-manage-main" v-loading="loading">
    <div class="search-part">
      <component-search @searchParams="searchParams"></component-search>
    </div>
    <div class="table-part">
      <el-tabs
        class="class-status"
        v-model="classStatus"
        @tab-click="classTabClick"
      >
        <el-tab-pane label="待开课" name="0"></el-tab-pane>
        <el-tab-pane label="开课中" name="1"></el-tab-pane>
        <el-tab-pane label="已结课" name="2"></el-tab-pane>
        <el-tab-pane label="全部" name="0,1,2"></el-tab-pane>
      </el-tabs>
      <component-content
        ref="componentContent"
        @loading="loadingFun"
      ></component-content>
    </div>
  </div>
</template>

<script>
import componentSearch from './components/classManage/search'
import componentContent from './components/classManage/content'
export default {
  name: 'classManageIndex',
  components: {
    componentSearch,
    componentContent
  },
  data() {
    return {
      loading: false,
      classStatus: '0'
    }
  },
  methods: {
    searchParams(params) {
      this.$refs.componentContent.changeSearchParams(params)
    },
    classTabClick() {
      this.$refs.componentContent.changeTeamState(this.classStatus)
    },
    loadingFun(val) {
      this.loading = val
    }
  }
}
</script>

<style lang="scss" scoped>
.class-manage-main {
  padding: 10px;
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  .search-part {
    margin-bottom: 1px;
  }
  .table-part {
    padding: 0 10px;
    background-color: #fff;
    flex: 1;
    display: flex;
    flex-direction: column;
    .class-status {
      padding: 0 10px;
    }
    /deep/ {
      .el-tabs__header {
        margin-bottom: 0;
      }
    }
  }
}
/deep/ {
  .el-loading-spinner {
    top: 200px;
  }
}
</style>
