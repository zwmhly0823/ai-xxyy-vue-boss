<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-05-06 20:22:29
 -->
<template>
  <div>
    <div class="channel-box-top">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="渠道查询" name="channelQuery">
          <channel-search :tabIndex="tabIndex" />
        </el-tab-pane>
        <!-- <el-tab-pane label="添加渠道" name="channleInfo">
          <channel-add />
        </el-tab-pane>
        <el-tab-pane label="渠道订单信息导入" name="channleUpload">
          <channel-upload />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import channelSearch from './components/channelSearch'
// import channelAdd from './components/channelAdd'
// import channelUpload from './components/channelUpload'
export default {
  components: {
    channelSearch
    // channelAdd,
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
