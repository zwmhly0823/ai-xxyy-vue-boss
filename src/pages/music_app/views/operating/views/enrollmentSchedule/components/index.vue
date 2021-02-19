<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-15 17:31:21
 -->
<template>
  <div>
    <div class="tabs-operate">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="{ active: index == tabIndex }"
        @click="tabs_click(index)"
      >
        <span>{{ tab }}</span>
      </div>
    </div>
    <div class="sear-container">
      <!-- <m-search @search="handleSearch" stage="stage" sup="sup" />TODO: -->
      <el-button type="primary" slot="searchItems" size="mini" @click="addEditSchedule(0)">新增招生排期</el-button>
      <el-alert title="随意新增或编辑招生排期，有可能影响当前线索分配！请谨慎操作！" type="error" :closable="false"></el-alert>
    </div>

    <div class="orderStyle">
      <ele-table
        :dataList="tableData"
        :loading="flags.loading"
        :size="tabQuery.size"
        :page="tabQuery.page"
        :total="totalPages"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column prop="period" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="periodName" label="期名" align="center" width="90"></el-table-column>
        <el-table-column prop="startDate" width="100" align="center" label="开始招生"></el-table-column>
        <el-table-column prop="endDate" width="100" align="center" label="结束招生"></el-table-column>
        <el-table-column prop="courseDay" width="100" align="center" label="开课时间"></el-table-column>
        <el-table-column prop="endCourseDay" width="100" align="center" label="结课时间"></el-table-column>
        <el-table-column label="招生级别" align="center" width="80">
          <template slot-scope="scope">
            <div
              v-for="(leve, l_index) in scope.row.wechatCourse"
              :key="l_index"
            >{{ supLevelUpper[leve.courseDifficulty] || '' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="带班销售人数" width="100" align="center">
          <template slot-scope="scope">
            <div
              v-for="(w, l_index) in scope.row.wechatCourse"
              :key="l_index"
            >{{ w.wechatSize || '0' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="计划招生" align="center">
          <template slot-scope="scope">
            <div
              v-for="(p, l_index) in scope.row.wechatCourse"
              :key="l_index"
            >{{ p.planSumTeamSize || '0' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="实际招生" align="center">
          <template slot-scope="scope">
            <div
              v-for="(r, l_index) in scope.row.wechatCourse"
              :key="l_index"
            >{{ r.realSumTeamSize || '0' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="计划开班" align="center">
          <template slot-scope="scope">
            <div
              v-for="(p, l_index) in scope.row.wechatCourse"
              :key="l_index"
            >{{ p.planTeamSize || '0' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="实际开班" align="center">
          <template slot-scope="scope">
            <div
              v-for="(r, l_index) in scope.row.wechatCourse"
              :key="l_index"
            >{{ r.realTeamSize || '0' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <div class="editStyle">
              <span style="margin-right:15px" @click="downlaodExcel(scope.row)">下载</span>
              <span style="margin-right:15px" @click="addEditSchedule(scope.row)">编辑</span>
              <span style="margin-right:15px" @click="go_detail(scope.row)">详细</span>
              <span
                v-if="tabIndex === 0"
                :class="[
                  {
                    'cant-click-button':
                      scope.row.intruSwitchName === '招生完毕'
                  }
                ]"
                @click="
                  click_intru_switch(
                    scope.$index,
                    scope.row.period,
                    scope.row.intruSwitchName
                  )
                "
              >{{ scope.row.intruSwitchName }}</span>
            </div>
          </template>
        </el-table-column>
      </ele-table>
    </div>
  </div>
</template>

<script>
// import MSearch from '@/components/MSearch/index.vue' TODO:
import EleTable from '@/components/Table/EleTable'
import { formatData } from '@/utils'
import { SUP_LEVEL_TRIAL, SUP_LEVEL_SYSTEM } from '@/utils/supList'
export default {
  props: {
    department: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    // MSearch,
    EleTable
  },
  data() {
    return {
      canClick: true,
      query: '',
      tabIndex: 0,
      tabs: ['体验课', '系统课'],
      totalElements: 0,
      flags: {
        loading: false
      },
      tabQuery: {
        size: 20,
        page: 1
      },
      sex: {
        // 0: '-',
        0: '男',
        1: '女'
        // 3: '保密'
      },
      // 总页数
      totalPages: 1,
      // 当前页数
      currentPage: 1,
      // 多选选择项
      checkList: [],
      // 表格数据
      tableData: [],
      // 老师id
      teacherID: '',
      supLevelUpper: {}
    }
  },
  computed: {},
  watch: {},
  async activated() {
    await this.getCourseListByType()
  },
  created() {
    this.tabs_click(this.tabIndex)
  },
  methods: {
    /** adolf-start */
    tabs_click(index) {
      this.supLevelUpper = +index ? SUP_LEVEL_SYSTEM:SUP_LEVEL_TRIAL

      this.tabIndex = index
      this.tabQuery.page = 1
      this.getCourseListByType()
    },
    // 下载当前行
    async downlaodExcel(row) {
      const params = {
        departmentIds: '',
        teacherId: '',
        level: '',
        courseDifficulties: '',
        courseType: this.tabIndex,
        period: row.period
      }
      const res = await this.$http.DownloadExcel.downloadExcelByPeriod(params)

      if (res && Object.prototype.toString.call(res) === '[object Blob]') {
        const name = !+params.courseType ? '体验课' : '系统课'
        this.downloadFn(res, `${name}-第${params.period}期`, () => {
          // this.$emit('setExcelStatus', 'complete')
        })
      } else {
        this.$message.error('下载失败')
      }
    },
    // 下载文件
    downloadFn(data, fileName = '下载', cb) {
      if (!data) return
      const blob = new Blob([data])
      var downloadElement = document.createElement('a')
      var href = window.URL.createObjectURL(blob) // 创建下载的链接
      downloadElement.href = href
      downloadElement.download = `${fileName}.xls` // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
      // const elink = document.createElement('a')
      // elink.download = fileName
      // elink.style.display = 'none'
      // elink.href = URL.createObjectURL(blob)
      // document.body.appendChild(elink)
      // elink.click()
      // URL.revokeObjectURL(elink.href) // 释放URL 对象
      // document.body.removeChild(elink)

      cb && cb()
    },
    // 新增、编辑
    addEditSchedule(row) {
      const { period = 0 } = row // TODO:

      this.$router.push({ path: `/addSchedule/${period}/${this.tabIndex}` })
    },
    // 查看详情
    go_detail(row) {
      const { period = '' } = row
      this.$router.push({
        path: `/scheduleDetail/${period}/${this.tabIndex}`
      })
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getCourseListByType()

      // console.log(aa, 'aa')
    },
    /** adolf-end */
    async getCourseListByType() {
      this.flags.loading = true
      const status = {
        '0': '待开始',
        '1': '招生中',
        '2': '待开课',
        '3': '上课中',
        '4': '已结课'
      }
      this.tabQuery = {
        ...this.tabQuery,
        // page: --this.tabQuery.page,
        courseType: this.tabIndex
      }
      // TODO:
      try {
        const {
          content = [],
          totalElements = 0
        } = await this.$http.Operating.getCourseListByType(this.tabQuery)
        this.totalPages = Number(totalElements)

        const periodsArr = []

        content.forEach((item) => {
          item.startDate = formatData(item.startDate)
          item.endDate = formatData(item.endDate)
          item.courseDay = formatData(item.courseDay)
          item.endCourseDay = +item.endCourseDay
            ? formatData(item.endCourseDay)
            : ''
          item.status = status[item.status]
          periodsArr.push(item.period)
        })
        // 然后再获取招生的状态
        const enrollStudentStatus = await this.getStatusByperiods(periodsArr)

        if (!enrollStudentStatus) {
          this.$message.error('获取招生状态失败')
          return
        }
        // 把结果等于0的筛出来
        const enrollArr = []
        Object.keys(enrollStudentStatus).forEach((item) => {
          if (+enrollStudentStatus[item] === 0) {
            enrollArr.push(item)
          }
        })
        content.forEach((item) => {
          if (['待开课', '上课中', '已结课'].includes(item.status)) {
            item.intruSwitchName = '招生完毕'
          } else if (['待开始', '招生中'].includes(item.status)) {
            // item.intruSwitchName = '停止招生'
            item.intruSwitchName = '停止转介绍'
          }
          if (enrollArr.includes(item.period + '')) {
            // item.intruSwitchName = '恢复招生'
            item.intruSwitchName = '恢复转介绍'
          }
          
          if(item.wechatCourse&&item.wechatCourse.length>0){
            let reg = /\d/
            item.wechatCourse.forEach(weItem=>{
              weItem.myCourseLevelId = +weItem.courseDifficulty.match(reg)[0]
            })
            
            item.wechatCourse.sort((a,b)=>{
              return a.myCourseLevelId - b.myCourseLevelId
            })
          }
        })
        this.flags.loading = false
        this.tableData = content
        console.log(content)
      } catch (err) {
        this.flags.loading = false
        return new Error(err)
      }
    },
    getStatusByperiods(periodsArr) {
      return this.$http.Operating.getStatusByperiods(periodsArr.join(','))
        .then((res) => {
          if (res.status === 'OK') {
            return res.payload
          } else {
            return false
          }
        })
        .catch(() => {
          return false
        })
    },
    // 搜索
    handleSearch(data) {
      console.log(data)
    },
    click_intru_switch(index, period, name) {
      if (name === '招生完毕') {
        return
      }
      console.log(name)
      const params = {
        period: period,
        status: name === '停止转介绍' ? 'NOOPEN' : 'OPEN'
      }
      console.log(params)
      this.flags.loading = true
      this.$http.Operating.updateStatusByPeriod(params)
        .then((res) => {
          if (res.status === 'OK') {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$set(
              this.tableData[index],
              'intruSwitchName',
              name === '停止转介绍' ? '恢复转介绍' : '停止转介绍'
            )
          } else {
            this.$message.error('修改失败')
          }
        })
        .catch(() => {
          this.$message.error('修改失败')
        })
        .finally(() => {
          this.flags.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-operate {
  background: #f5f7fa;
  display: flex;
  > div {
    height: 50px;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &.active {
      background: #fff;
      span {
        color: #2a75ed;
      }
    }
  }
}
.sear-container {
  display: flex;
  margin: 10px;
  align-items: center;
  .el-card {
    border: 0;
  }
  ::v-deep {
    .el-alert--error {
      margin: 0 auto;
      width: 600px;
      text-align: center;
      .el-alert__content {
        margin: 0 auto;
      }
    }
  }
}
.editStyle {
  color: #0401ff;
  span {
    cursor: pointer;
  }
  .cant-click-button {
    color: #909399;
    cursor: auto;
  }
}
</style>
<style lang="scss">
.checkBoxStyle {
  .el-checkbox {
    border: none;
    padding-left: 0px !important;
    color: rgb(102, 102, 102) !important;
  }
}
</style>
