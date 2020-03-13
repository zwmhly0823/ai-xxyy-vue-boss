<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-13 20:10:20
 -->
<template>
  <div class="bg-color">
    <el-row :gutter="8" type="flex">
      <el-col style="paddingLeft:0px;width:160px">
        <div class="grid-content">
          <left-bar />
        </div>
      </el-col>
      <el-col style="width:260px">
        <div class="grid-content">
          <center-bar />
        </div>
      </el-col>
      <el-col style="flex:1">
        <div class="grid-content">
          <right-bar />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LeftBar from '../../components/LeftBar'
import CenterBar from '../../components/CenterBar'
import RightBar from '../../components/RightBar'

export default {
  props: [],
  components: {
    LeftBar,
    RightBar,
    CenterBar
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.bg-color {
  background: #e3e3e3;
  height: 100vh;
  .grid-content {
    background: white;
    height: 100vh;
  }
}
</style>
