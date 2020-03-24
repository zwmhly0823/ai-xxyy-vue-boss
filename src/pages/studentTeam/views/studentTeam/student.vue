<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-24 11:29:43
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
        <center-bar
          @change="getCenterBarSelect"
          @scrollHandler="infiniteScroll"
          :classData="classListData"
        />
      </div>
    </el-col>
    <el-col class="student-team-right ">
      <div class="grid-content right">
        <el-scrollbar wrap-class="scrollbar-wrapper" id="right-scroll">
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
      classId: '', // 班级Id
      scrollStatus: null,
      type: 0,
      scrollPage: 1,
      teacher_id: null
    }
  },
  computed: {
    // 初始化的班级ID(体验课全部中第一条)
    classIdData() {
      // if (+this.scrollPage === 1) {
      //   const data =
      //     this.classListData.teamStatusPage &&
      //     this.classListData.teamStatusPage.content[0]
      //   return { classId: data, type: this.type }
      // }
      return { classId: this.classId, type: this.type }
    }
  },
  watch: {
    scrollStatus(val, old) {
      if (val !== old) {
        this.classId = ''
      }
    }
  },
  methods: {
    /**
     * 左栏回调函数
     * @param(回调数据) 获得选中内容
     */
    async getLeftBarSelect(data) {
      if (!data.code) return
      this.scrollStatus = data.code
      this.type = data.types
      // 状态为全部时 classStatus为[0,1,2]
      if (data.code === '_all') {
        this.classStatus = [0, 1, 2]
        await this.getClassList(data.types)
      } else {
        this.classStatus = [+data.code]
        await this.getClassList(data.types)
      }
      this.classId =
        this.classListData.teamStatusPage &&
        this.classListData.teamStatusPage.content[0]
    },
    /**
     * 中栏回调函数
     * @param(回调数据) 获得选中内容
     */
    getCenterBarSelect(data) {
      this.classId = data.datas
      this.type = data.type
    },
    /**
     * 中栏下拉滚动
     * @param(type,page,size) 课程类型 页码 数量
     */
    infiniteScroll(data) {
      this.scrollPage = data.page
      this.getClassList(data.type, data.page)
    },
    /**
     * 获取体验课状态列表
     * @param(team_type) 0为体验课 1为系统课
     */
    async getExperienceStatusList(data = 0) {
      const queryParams =
        data === 0
          ? !this.teacher_id
            ? `{"bool":{"must":[{"term":{"team_type":${data}}}]}}`
            : `{"bool":{"must":[{"term":{"team_type":${data}}},{"term":{"teacher_id": ${this.teacher_id}}}]}}`
          : !this.teacher_id
          ? `{"bool":{"must":[{"range":{"team_type":{"gte":${data}}}}]}}`
          : `{"bool":{"must":[{"range":{"team_type":{"gte":${data}}}},{"term":{"teacher_id": ${this.teacher_id}}}]}}`
      // const queryParams = `{"bool":{"must":[{"range":{"team_type":{"gt":${data}}}}]}}`
      await axios
        .get('/graphql/team', {
          params: {
            query: `{
              teamStatusCount(field: "team_state",team_type:${data},query:${JSON.stringify(
              queryParams
            )}) {
                code,
                value,
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
     * @param(team_type) 0为体验课 >=1为系统课
     */
    async getClassList(type = 0, page = 1) {
      let queryParams
      if (type === 0) {
        // queryParams = `{"bool":{"must":[{"terms":{"team_state":[${this.classStatus}]}},{"term":{"team_type":${type}}}]}}`
        queryParams = this.teacher_id
          ? `{"bool":{"must":[{"terms":{"team_state":[${this.classStatus}]}},{"term":{"team_type":${type}}},{"term":{"teacher_id": ${this.teacher_id}}}]}}`
          : `{"bool":{"must":[{"terms":{"team_state":[${this.classStatus}]}},{"term":{"team_type":${type}}}]}}`
      } else {
        // queryParams = `{"bool":{"must":[{"terms":{"team_state":[${this.classStatus}]}},{"range":{"team_type":{"gte":${type}}}}]}}`
        queryParams = this.teacher_id
          ? `{"bool":{"must":[{"terms":{"team_state":[${this.classStatus}]}},{"range":{"team_type":{"gte":${type}}}},{"term":{"teacher_id": ${this.teacher_id}}}]}}`
          : `{"bool":{"must":[{"terms":{"team_state":[${this.classStatus}]}},{"range":{"team_type":{"gte":${type}}}}]}}`
      }
      await axios
        .get('/graphql/team', {
          params: {
            query: `{
              teamStatusPage(query:${JSON.stringify(
                queryParams
              )},page:${page},size:20){
                empty,
                first,
                last,
                number,
                size,
                numberOfElements,
                totalElements,
                totalPages,
                content {
                  id,
                  team_state,
                  team_type,
                  team_name,
                  ctime,
                  sup,
                  term,
                  start_day,
                  end_day,
                  enroll_state,
                  enrolled,
                  pre_enroll,
                  teacher_id,
                  teacher {
                    realname,
                  }
                  current_lesson,
                  week
                }
              }
            }`
          }
        })
        .then((res) => {
          res.data.type = type
          res.data.scrollStatus = `${this.scrollStatus}+${type}`
          this.classListData = res.data
          if (+this.scrollPage === 1) {
            this.classId =
              this.classListData.teamStatusPage &&
              this.classListData.teamStatusPage.content[0]
          }

          // sessionStorage.setItem(
          //   'CenterBarSaveData',
          //   JSON.stringify(this.classId)
          // )
        })
    }
  },
  async created() {
    const teacher = localStorage.getItem('teacher')
    if (teacher) {
      this.teacher_id = JSON.parse(teacher).id
    }
    // 请求体验课状态列表
    await this.getExperienceStatusList(0)
    // 请求系统课状态列表
    await this.getExperienceStatusList(1)
    // 请求班级列表
    await this.getClassList()
  }
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
    width: 245px;
    min-width: 245px;
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
