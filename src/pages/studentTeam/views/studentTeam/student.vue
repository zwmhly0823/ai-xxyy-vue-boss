<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-10 16:00:38
 -->
<template>
  <el-row type="flex" class="app-main height student-team">
    <el-col class="student-team-left">
      <div class="grid-content">
        <left-bar
          @change="getLeftBarSelect"
          @filter="filterHandler"
          :experienceData="experienceStatusList"
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
          <right-bar :classId="classIdData" :team-date="teamDate" />
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import LeftBar from '../../components/LeftBar'
import CenterBar from '../../components/CenterBar'
import RightBar from '../../components/RightBar'
import { isToss } from '@/utils/index'

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
      scrollStatus: '',
      type: 0,
      scrollPage: 1,
      teacher_id: null,
      must: null, // 搜索条件
      filterConditions: null,
      teamDate: {}
    }
  },
  computed: {
    // 初始化的班级ID(体验课全部中第一条)
    classIdData() {
      console.log(this.classId, 'this.classId')

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
    // 左栏筛选条件
    async filterHandler(res) {
      this.scrollStatus = JSON.stringify(...res)
      console.log(this.scrollStatus, '接口内字段唯一标识')
      this.filterConditions = res
      // 请求体验课状态列表
      await this.getExperienceStatusList(0)
      setTimeout(() => {
        // 请求系统课状态列表
        this.getExperienceStatusList(1)
      }, 500)
      await this.getClassList(this.type)

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
      this.teamDate = data.datas
      this.type = data.type
    },
    /**
     * 中栏下拉滚动
     * @param(type,page,size) 课程类型 页码 数量
     */
    async infiniteScroll(data) {
      this.scrollPage = data.page
      await this.getClassList(data.type, data.page)
    },
    /**
     * 获取课程状态列表
     * @param(team_type) 0为体验课 1为系统课
     */
    async getExperienceStatusList(data = 0) {
      const queryParams = `{"bool":{"must":${JSON.stringify(
        this.filterConditions ? this.filterConditions : []
      )}}}`

      this.$http.StudentTerm.getTeamStatusCount({
        data: data,
        teacherId: this.teacher_id,
        queryParams: queryParams
      })
        .then((res) => {
          if (data === 0) {
            this.experienceStatusList = res.data
          }
          if (data === 1) {
            this.systemStatusList = res.data
          }
        })
        .catch((err) => console.log(err))
    },
    /**
     * 获取班级列表
     * @param(team_type) 0为体验课 >=1为系统课
     */
    async getClassList(type = 0, page = 1) {
      let queryParams
      if (type === 0) {
        const config = [
          { terms: { team_state: this.classStatus } },
          { term: { team_type: type } }
        ]
        if (this.teacher_id) {
          config.push({
            term: { teacher_id: this.teacher_id ? this.teacher_id : '' }
          })
        }
        this.must = this.filterConditions
          ? config.concat(this.filterConditions)
          : config
        queryParams = `{"bool":{"must":${JSON.stringify(this.must)}}}`
      } else {
        const config = [
          { terms: { team_state: this.classStatus } },
          { range: { team_type: { gte: type } } }
          // { term: { teacher_id: this.teacher_id ? this.teacher_id : '' } }
        ]
        if (this.teacher_id) {
          config.push({
            term: { teacher_id: this.teacher_id ? this.teacher_id : '' }
          })
        }
        this.must = this.filterConditions
          ? config.concat(this.filterConditions)
          : config
        queryParams = `{"bool":{"must":${JSON.stringify(this.must)}}}`
      }
      this.$http.StudentTerm.getTeamStatusPage({
        queryParams: queryParams,
        type: type,
        teacherId: this.teacher_id,
        page: page,
        classStatus: this.classStatus
      })
        .then((res) => {
          res.data.type = type
          res.data.scrollStatus = `${this.scrollStatus}${type}`
          this.classListData = res.data
          if (+this.scrollPage === 1) {
            this.classId =
              this.classListData.teamStatusPage &&
              this.classListData.teamStatusPage.content[0]
          }
          const idArr = res.data.teamStatusPage.content.map((item) => item.id)
          if (idArr.length === 0) return
          this.$http.StudentTerm.getCalculationTeamInfo(idArr).then((val) => {
            const calculationTeam = val.payload || []
            const objDate = {}
            calculationTeam.forEach((item) => {
              objDate[item.id] = {
                start_day: item.startDay,
                end_day: item.endDay
              }
            })
            res.data.teamStatusPage.content.forEach((item) => {
              const temp = objDate[item.id] || { start_day: '', end_day: '' }
              item.start_day = temp.start_day
              item.end_day = temp.end_day
            })
            this.classListData = res.data

            if (+this.scrollPage === 1) {
              this.teamDate =
                this.classListData.teamStatusPage &&
                this.classListData.teamStatusPage.content[0]
              // this.classId =
              //   this.classListData.teamStatusPage &&
              //   this.classListData.teamStatusPage.content[0]
            }
          })
        })
        .catch((err) => console.log(err))
    }
  },
  async created() {
    const teacher = isToss()
    if (teacher) {
      this.teacher_id = teacher
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
    width: 160px;
    min-width: 160px;
    border-right: 1px solid #e3e3e3;
  }
  &-center {
    width: 242px;
    min-width: 242px;
  }
  &-right {
    overflow-x: hidden;
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
