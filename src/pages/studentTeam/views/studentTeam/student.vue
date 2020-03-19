<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-19 11:38:49
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
        <center-bar @change="getRightBarSelect" :classData="classListData" />
      </div>
    </el-col>
    <el-col class="student-team-right ">
      <div class="grid-content right">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <right-bar :classId="classIdData" />
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
      experienceStatusList: {}, // 左栏 体验课状态（数量）
      systemStatusList: {}, // 左栏 系统课状态（数量）
      classStatus: [0, 1, 2], // 选中的课程状态值（传入中栏，获取班级列表）
      classListData: {}, // 中栏 班级列表
      classId: '' // 班级Id
    }
  },
  computed: {
    // 初始化的班级ID(体验课全部中第一条)
    classIdData() {
      if (!this.classId) {
        const data =
          this.classListData.teamStatusPage &&
          this.classListData.teamStatusPage.content[0].id
        return data
      }
      return this.classId
    }
  },
  methods: {
    /**
     * 左栏回调函数
     * @param(回调数据) 获得选中内容
     */
    async getLeftBarSelect(data) {
      if (!data.code) return
      // 状态为全部时 classStatus为[0,1,2]
      if (data.code === '_all') {
        this.classStatus = [0, 1, 2]
        await this.getClassList(data.types)
      } else {
        this.classStatus = [+data.code]
        await this.getClassList(data.types)
      }
    },
    /**
     * 中栏回调函数
     * @param(回调数据) 获得选中内容
     */
    getRightBarSelect(data) {
      console.log(data)
      this.classId = data
    },
    /**
     * 获取体验课状态列表
     * @param(team_type) 0为体验课 1为系统课
     */
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
    /**
     * 获取班级列表
     * @param(team_type) 0为体验课 1为系统课
     */
    async getClassList(data = 0) {
      const queryParams = `{"bool":{"must":[{"terms":{"team_state":[${this.classStatus}]}},{"term":{"team_type":${data}}}]}}`
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
        })
    }
  },
  async created() {
    // 请求体验课状态列表
    await this.getExperienceStatusList(0)
    // 请求系统课状态列表
    await this.getExperienceStatusList(1)
    // 请求班级列表
    await this.getClassList()
    console.log(this.classIdData, 'classIdData')
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
