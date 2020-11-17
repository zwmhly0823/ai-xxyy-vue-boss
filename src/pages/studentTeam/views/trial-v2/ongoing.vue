<!--
 * @Descripttion: 上课中
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-31 19:06:52
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-04 22:20:30
-->
<template>
  <div class="team-layout d-flex" :class="{ closed: !isOpened }">
    <!-- sidebar -->
    <div class="team-layout-sidebar d-flex column">
      <sidebar-handle :status="status" @search="getSearchParams" />
      <div class="team-layout-sidebar-list flex-1">
        <!-- scroll list -->
        <el-scrollbar id="scrollContent">
          <!-- 列表筛选条件 -->
          <sidebar-team-list-sort :status="status" @sort="getSortParams" />

          <!-- 列表项 -->
          <sidebar-team-list
            ref="sidebarTeamList"
            :status="status"
            :search-params="searchParams"
            :sort-params="sortParams"
            @select="getSelectTeam"
            @toggle="handleToggle"
            @openLazyload="openLazyload"
            @oneLazyFinish="oneLazyFinish"
          />

          <div class="lazy-load-bottom" ref="lazyLoadingBox"></div>
        </el-scrollbar>
      </div>
    </div>

    <!-- right container -->
    <div class="team-layout-container">
      <team-detail :team-id="currentTeamId" :key="detailKey" />
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index'
import { debounce } from 'lodash'
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
      status: this.$route.params.status || '1',
      searchParams: {},
      sortParams: { ctime: 'desc' },
      // 当前选中的teamId
      currentTeamId: '',
      isOpened: true,
      onceLazy: true,
      hasCreateLintener: false,
      detailKey: 0
    }
  },

  methods: {
    // 排序条件
    getSortParams(data) {
      // console.log(data)
      this.sortParams = data
    },
    // 筛选条件
    getSearchParams(params) {
      this.searchParams = deepClone(params)
      // console.log(this.searchParams, 'search data')
    },

    // 获取选中的班级ID
    getSelectTeam(id) {
      // console.log(id, 'team_id')
      this.detailKey = Date.now()
      this.$nextTick(() => {
        this.currentTeamId = id
      })
    },

    handleToggle(data) {
      this.isOpened = data
    },

    openLazyload() {
      if (this.hasCreateLintener) {
        this.onceLazy = true
        return
      }
      const dom = document
        .getElementById('scrollContent')
        .getElementsByClassName('el-scrollbar__wrap')[0]
      dom.addEventListener('scroll', debounce(this.scrollEvent, 100))
      this.hasCreateLintener = true
    },
    oneLazyFinish() {
      this.$nextTick(() => {
        this.onceLazy = true
      })
    },

    scrollEvent() {
      // 单次开关
      if (!this.onceLazy) return
      // 可视区域高度
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      // 判定元素距离底部的距离
      const itemToTop = this.$refs.lazyLoadingBox.getBoundingClientRect().top
      if (clientHeight > itemToTop + 20) {
        // console.log('scrollEvent')
        this.$refs.sidebarTeamList.getTeamData()
        this.onceLazy = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/layout.scss';
</style>
