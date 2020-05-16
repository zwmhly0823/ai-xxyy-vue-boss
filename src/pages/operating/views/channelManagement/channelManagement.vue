<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-16 17:00:57
 -->
<template>
  <div>
    <div class="channel-box-top">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="渠道查询" name="channelQuery">
          <channel-search :tabIndex="tabIndex" />
        </el-tab-pane>
        <el-tab-pane label="渠道信息管理" name="channleInfo">
          <channel-information :tabIndex="tabIndex" />
        </el-tab-pane>
        <!-- <el-tab-pane label="渠道订单导入" name="channleUpload">
          <channel-upload />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import channelSearch from './components/channelSearch'
import channelInformation from './components/channelInformation'
// import channelUpload from './components/channelUpload'
export default {
  components: {
    channelSearch,
    channelInformation
    // channelUpload
  },
  data() {
    return { tabIndex: '', activeName: 'channelQuery' }
  },
  methods: {
    // tabs 事件
    handleClick(tab, event) {
      this.tabIndex = tab.index
    }
  }
}
</script>
<style lang="scss" scoped></style>
<style lang="scss"></style>
