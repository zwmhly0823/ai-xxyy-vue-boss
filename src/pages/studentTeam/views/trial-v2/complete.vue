<!--
 * @Descripttion: 已完课
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-31 18:55:14
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-04 17:25:38
-->
<template>
  <div class="team-layout d-flex" :class="{ closed: !isOpened }">
    <!-- sidebar -->
    <div class="team-layout-sidebar d-flex column">
      <sidebar-handle :status="status" @search="getSearchParams" />
      <div class="team-layout-sidebar-list flex-1">
        <!-- scroll list -->
        <el-scrollbar>
          <!-- 列表筛选条件 -->
          <sidebar-team-list-sort :status="status" @sort="getSortParams" />

          <!-- 列表项 -->
          <sidebar-team-list
            :status="status"
            :search-params="searchParams"
            :sort-params="sortParams"
            @select="getSelectTeam"
            @toggle="handleToggle"
          />
        </el-scrollbar>
      </div>
    </div>

    <!-- right container -->
    <div class="team-layout-container">
      <team-detail :team-id="currentTeamId" />
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index'
import SidebarHandle from './components/Sidebar/SidebarHandle'
import SidebarTeamList from './components/Sidebar/SidebarTeamList'
import SidebarTeamListSort from './components/Sidebar/SidebarTeamListSort'
import TeamDetail from './components/Detail/index'
export default {
  components: {
    SidebarHandle,
    SidebarTeamList,
    SidebarTeamListSort,
    TeamDetail
  },
  props: {},
  data() {
    return {
      status: this.$route.params.status || '2',
      searchParams: {},
      sortParams: { ctime: 'desc' },
      // 当前选中的teamId
      currentTeamId: '',
      isOpened: true
    }
  },

  methods: {
    // 排序条件
    getSortParams(data) {
      console.log(data)
      this.sortParams = data
    },
    // 筛选条件
    getSearchParams(params) {
      this.searchParams = deepClone(params)
      console.log(this.searchParams, 'search data')
    },

    // 获取选中的班级ID
    getSelectTeam(id) {
      this.currentTeamId = id
    },

    handleToggle(data) {
      this.isOpened = data
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/layout.scss';
</style>
