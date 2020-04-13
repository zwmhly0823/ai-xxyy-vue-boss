<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-08 16:23:35
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
      teacher_id: null, // 当前登录老师的ID
      teacherIds: [], // 当前老师权限，包含本身和权限下的老师ID
      must: null, // 搜索条件
      filterConditions: null
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
  async created() {
    const teacher = isToss()
    if (teacher) {
      this.teacher_id = teacher
    }
    await this.getTeacherByRole()
    // 请求体验课状态列表
    await this.getExperienceStatusList(0)
    // 请求系统课状态列表
    await this.getExperienceStatusList(1)
    // 请求班级列表
    await this.getClassList()
  },
  methods: {
    /**
     * 老师权限
     */
    async getTeacherByRole() {
      const teacherId = this.teacher_id
      if (!teacherId) return
      const teachers = await this.$http.Permission.getAllTeacherByRole({
        teacherId
      })
      this.teacherIds = teachers
      console.log(teachers)
    },
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
      const config = []
      if (this.teacher_id) {
        config.push({
          terms: { teacher_id: this.teacherIds || [] }
        })
      }
      const must = this.filterConditions
        ? config.concat(this.filterConditions)
        : config
      const queryParams = `{"bool":{"must":${JSON.stringify(must)}}}`

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
            terms: { teacher_id: this.teacherIds || [] }
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
        ]
        if (this.teacher_id) {
          config.push({
            terms: { teacher_id: this.teacherIds || [] }
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
        })
        .catch((err) => console.log(err))
    }
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
