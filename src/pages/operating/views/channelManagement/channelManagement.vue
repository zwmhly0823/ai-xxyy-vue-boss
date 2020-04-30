<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-29 18:50:35
 -->
<template>
  <div>
    <div class="channel-box-top">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="渠道查询" name="channelQuery">
          <channel-search :tabIndex="tabIndex" />
        </el-tab-pane>
        <!-- <el-tab-pane label="渠道信息" name="channleInfo"></el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import channelSearch from './components/channelSearch'
export default {
  components: {
    channelSearch
  },
  data() {
    return { tabIndex: '', activeName: 'channelQuery' }
  },
  methods: {
    // tabs 事件
    handleClick(tab, event) {
      console.log(tab.index)
      this.tabIndex = tab.index
    }
  }
}
</script>
<style lang="scss" scoped></style>
<style lang="scss"></style>
