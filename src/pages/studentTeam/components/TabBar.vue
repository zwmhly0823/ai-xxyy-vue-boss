<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-19 11:12:25
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-19 22:11:40
 -->
<template>
  <div class="tab-box">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="border-card"
      style="height:100%"
    >
      <el-tab-pane label="学员" name="students">
        <studens-tab />
      </el-tab-pane>
      <el-tab-pane label="带班详情" name="details">
        <details-tab />
      </el-tab-pane>
      <el-tab-pane label="微信群聊" name="groupChat">
        <groupchat-tab />
      </el-tab-pane>
      <el-tab-pane label="系统课订单" name="systemOrder">
        <systemorder-tab />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import StudensTab from './StudentsTab'
import DetailsTab from './DetailsTab'
import GroupchatTab from './GroupchatTab'
import SystemorderTab from './SystemorderTab'
export default {
  components: {
    StudensTab,
    DetailsTab,
    GroupchatTab,
    SystemorderTab
  },
  data() {
    return {
      activeName: 'students'
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
<style scoped lang="scss">
.tab-box {
  padding: 0px 10px 10px;
  flex: 1;
}
</style>
