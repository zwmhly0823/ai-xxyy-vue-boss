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
        <search @search="getSearchQuery" v-if="type === 'trialUsers'">
          <!-- 第一版发短信功能先不做 -->
          <!-- <div slot="down">
              <el-button type="primary" size="mini">发送填写地址短信</el-button>
              /api/o/v1/order/sendMsgForTeacher?orderIds=151

              <el-button type="primary" size="mini">发送添加好友短信</el-button>
              http://docker.meixiu.mobi:48766/jsondoc-ui.html?url=/api/o/jsondoc#
              OrderControllerV1 - /v1/order/pushMsgByOrderId
            </div> -->
        </search>
        <!-- 体验课列表 -->
        <trial-list :search="searchResult" v-if="type === 'trialUsers'" />

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
import Search from '../components/Search.vue'
import SearchSystem from '../components/SearchSystem.vue'
import TrialList from './trial/index.vue'
import SystemList from './system/index.vue'

export default {
  components: {
    Search,
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
    // 根据登录老师的dutyId判断是否是对应的班级类型 dutyId: 1-体验课老师， 2-系统课老师
    const teacher = localStorage.getItem('teacher')
    if (teacher) {
      const teacherInfo = JSON.parse(teacher) || {}
      const { dutyId } = teacherInfo
      if (name === 'trialUsers' && +dutyId !== 1) {
        this.$router.push('/system')
        return
      }
      if (name === 'systemUsers' && +dutyId !== 2) {
        this.$router.push('/trial')
      }
    }
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
