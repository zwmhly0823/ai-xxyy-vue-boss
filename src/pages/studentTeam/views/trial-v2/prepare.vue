<!--
 * @Descripttion: 待上课
 * @version: 2.0.0
 * @Author: YangJiyong
 * @Date: 2020-07-31 18:56:34
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-04 17:25:49
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
            @closeLazyload="closeLazyload"
          />

          <div class="lazy-load-bottom" ref="lazyLoadingBox"></div>
        </el-scrollbar>
      </div>
    </div>

    <!-- right container 班级详情 -->
    <div class="team-layout-container">
      <team-detail :team-id="currentTeamId" />
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
      status: this.$route.params.status || '0',
      searchParams: {},
      sortParams: { ctime: 'desc' },
      // 当前选中的teamId
      currentTeamId: '',
      isOpened: true,
      closeLazyLoad: false
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
      console.log(id, 'team_id')
      this.currentTeamId = id
    },

    handleToggle(data) {
      this.isOpened = data
    },

    openLazyload() {
      const dom = document
        .getElementById('scrollContent')
        .getElementsByClassName('el-scrollbar__wrap')[0]
      dom.addEventListener('scroll', debounce(this.scrollEvent, 200))
    },
    closeLazyload() {
      // 不知道为什么removeEventListener清不掉监听
      this.closeLazyLoad = true
      // const dom = document
      //   .getElementById('scrollContent')
      //   .getElementsByClassName('el-scrollbar__wrap')[0]
      // dom.removeEventListener('scroll', this.scrollEvent)
    },

    scrollEvent() {
      if (this.closeLazyLoad) return
      // 可视区域高度
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      // 滚动距离
      const scrollLong = document
        .getElementById('scrollContent')
        .getElementsByClassName('el-scrollbar__wrap')[0].scrollTop
      // 判定元素距离顶部的距离
      const itemToTop = this.$refs.lazyLoadingBox.offsetTop
      if (clientHeight + scrollLong >= itemToTop) {
        this.$refs.sidebarTeamList.getTeamData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/layout.scss';
</style>
