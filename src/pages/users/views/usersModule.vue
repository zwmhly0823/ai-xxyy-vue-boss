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
      <!-- 体验课列表 -->
      <trial-list v-if="type === 'trialUsers'" />

      <!-- 系统课 -->
      <div class="app-main-container-scrollbar" v-if="type === 'systemUsers'">
        <!-- 系统课 -->
        <!-- <search-system @search="getSearchQuery" /> -->
        <!-- 系统课学员列表 -->
        <system-list :search="searchResult" />
      </div>
      <all-list v-if="type === 'allUsers'"></all-list>
    </div>
  </el-row>
</template>
<script>
// import SearchSystem from '../components/SearchSystem.vue'
import TrialList from './trial-v2/index.vue'
import SystemList from './system-v2/index.vue'
import AllList from './all-list/index.vue'

export default {
  components: {
    // SearchSystem,
    TrialList,
    SystemList,
    AllList
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
