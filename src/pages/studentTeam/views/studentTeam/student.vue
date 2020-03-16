<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-03-16 11:54:13
 -->
<template>
  <el-row type="flex" class="app-main height student-team">
    <el-col class="student-team-left">
      <div class="grid-content">
        <left-bar />
      </div>
    </el-col>
    <el-col class="student-team-center">
      <div class="grid-content">
        <center-bar />
      </div>
    </el-col>
    <el-col class="student-team-right">
      <div class="grid-content">
        <right-bar />
        <tab-bar />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import LeftBar from '../../components/LeftBar'
import CenterBar from '../../components/CenterBar'
import RightBar from '../../components/RightBar'
import TabBar from '../../components/TabBar'

export default {
  props: [],
  components: {
    LeftBar,
    RightBar,
    CenterBar,
    TabBar
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
.student-team {
  &-left {
    padding-left: 0px;
    width: 140px;
    border-right: 1px solid #e3e3e3;
  }
  &-center {
    width: 240px;
  }
  &-right {
    flex: 1;
    margin: 10px;
  }
  .grid-content {
    background: white;
    height: 100%;
  }
}
</style>
