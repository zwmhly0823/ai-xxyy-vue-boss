<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-18 11:59:52
 -->
<template>
  <div class="app-main height">
    <div class="channel-box-top">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="渠道查询" name="channelQuery">
          <channel-search :tabIndex="tabIndex" />
        </el-tab-pane>
        <el-tab-pane label="渠道信息管理" name="channleInfo">
          <channel-information :tabIndex="tabIndex" />
        </el-tab-pane>
        <el-tab-pane label="二级渠道管理" name="SecChannleInfo">
          <sec-channel-information :tabIndex="tabIndex" />
        </el-tab-pane>
        <el-tab-pane label="渠道订单导入" name="channleUpload">
          <channel-upload />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import channelSearch from './components/channelSearch'
import channelInformation from './components/channelInformation'
import secChannelInformation from './components/secChannelInformation'
import channelUpload from './components/channelUpload'
export default {
  components: {
    channelSearch,
    channelInformation,
    secChannelInformation,
    channelUpload
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
