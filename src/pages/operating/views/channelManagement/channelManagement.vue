<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 12:09:03
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-26 20:47:45
 -->
<template>
  <div>
    <div class="channel-box-top">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="渠道查询" name="channelQuery">
          <channel-search />
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
    return { activeName: 'channelQuery' }
  },
  methods: {
    // tabs 事件
    handleClick(tab, event) {}
  }
}
</script>
<style lang="scss" scoped></style>
<style lang="scss"></style>
