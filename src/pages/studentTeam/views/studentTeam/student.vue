<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-18 16:02:44
 -->
<template>
  <el-row type="flex" class="app-main height student-team">
    <el-col class="student-team-left">
      <div class="grid-content">
        <left-bar @getLeftBarChange="getLeftBarChange" />
      </div>
    </el-col>
    <el-col class="student-team-center">
      <div class="grid-content">
        <center-bar />
      </div>
    </el-col>
    <el-col class="student-team-right ">
      <div class="grid-content right">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <right-bar />
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import LeftBar from '../../components/LeftBar'
import CenterBar from '../../components/CenterBar'
import RightBar from '../../components/RightBar'
import axios from '@/api/axios'

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
  methods: {
    getLeftBarChange(data) {
      console.log(data)
    },
    getData() {
      const res = axios
        .get('/graphql/team', {
          params: {
            query: `{
          teamStatusCount(field: "team_state") {
            code
            value
          }
          teamStatusPage(page: 1) {
            content {
              id
            }
          }
        }`
          }
        })
        .then((res) => {
          console.log(res.data)
        })
      console.log(res)
    }
  },
  created() {
    this.getData()
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.student-team {
  &-left {
    padding-left: 0px;
    width: 180px;
    min-width: 180px;
    border-right: 1px solid #e3e3e3;
  }
  &-center {
    min-width: 240px;
    width: 240px;
    min-width: 240px;
  }
  &-right {
    flex: 1;
    margin: 10px;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.right {
      padding: 0;
    }
  }
}
</style>
<style>
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
