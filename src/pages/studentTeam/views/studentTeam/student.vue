<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-18 20:04:34
 -->
<template>
  <el-row type="flex" class="app-main height student-team">
    <el-col class="student-team-left">
      <div class="grid-content">
        <left-bar
          @change="getLeftBarSelect"
          :expressData="experienceStatusList"
          :systemData="systemStatusList"
        />
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
    return {
      experienceStatusList: {},
      systemStatusList: {},
      classListData: {},
      classStatus: [0, 1, 2]
    }
  },
  computed: {},
  watch: {},
  methods: {
    getLeftBarSelect(data) {
      if (data.code === '_all') {
        this.classStatus = [0, 1, 2]
      } else {
        this.classStatus = [+data.code]
      }
      console.log(this.classStatus, 'this.classstatus')
    },
    async getExperienceStatusList(data = 0) {
      const queryParams = `{"bool":{"must":[{"term":{"team_type":${data}}}]}}`
      await axios
        .get('/graphql/team', {
          params: {
            query: `{
              teamStatusCount(field: "team_state",query:${JSON.stringify(
                queryParams
              )}) {
                code
                value
                name
              }
            }`
          }
        })
        .then((res) => {
          if (data === 0) {
            this.experienceStatusList = res.data
          }
          if (data === 1) {
            this.systemStatusList = res.data
          }
        })
    },
    async getClassList() {
      const queryParams = `{"bool":{"must":[{"terms":{"team_state":[${this.classStatus}]}},{"term":{"team_type":0}}]}}`
      console.log(queryParams)
      await axios
        .get('/graphql/team', {
          params: {
            query: `{
              teamStatusPage(query:${JSON.stringify(queryParams)},page:1){
                empty
                first
                last
                number
                size
                numberOfElements
                totalElements
                totalPages
                content {
                  id
                  team_state
                  team_type
                  team_name
                  ctime
                  sup
                  term
                  enroll_state
                  enrolled
                  pre_enroll
                  teacher_id
                  teacher {
                    realname
                  }
                  current_lesson
                  week
                }
              }
            }`
          }
        })
        .then((res) => {
          this.classListData = res.data
          console.log(this.classListData, 'this.classListData')
        })
    }
  },
  created() {
    this.getExperienceStatusList(0)
    this.getExperienceStatusList(1)
    this.getClassList()
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
