<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-19 11:58:13
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-19 11:58:13
 * @Description: 学员中心
 -->
<template>
  <el-row type="flex" class="app-main height">
    <div class="app-main-container">
      <!-- <el-scrollbar wrap-class="user-wrapper" id="users-scroll"> -->
      <div class="app-main-container-scrollbar">
        <!-- 搜索 -->
        <!-- <search @search="getSearchQuery" v-if="type === 'trialUsers'"> </search> -->
        <!-- 体验课列表 -->
        <trial-list v-if="type === 'trialUsers'" />

        <!-- 系统课 -->
        <search-system @search="getSearchQuery" v-if="type === 'systemUsers'" />
        <!-- 系统课学员列表 -->
        <system-list :search="searchResult" v-if="type === 'systemUsers'" />
      </div>
      <!-- </el-scrollbar> -->
    </div>
  </el-row>
</template>
<script>
// import Search from '../components/Search.vue'
import SearchSystem from '../components/SearchSystem.vue'
import TrialList from './trial-v2/index.vue'
import SystemList from './system/index.vue'

export default {
  components: {
    // Search,
    SearchSystem,
    TrialList,
    SystemList
  },
  data() {
    return {
      type: '',
      searchResult: {}
    }
  },
  created() {
    const { name } = this.$route
    this.type = name
  },
  methods: {
    getSearchQuery(res) {
      console.log(res, 'search result')
      this.searchResult = res
    }
  }
}
</script>

<style lang="scss" scoped></style>
