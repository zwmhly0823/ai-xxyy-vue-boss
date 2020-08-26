<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-25 15:27:42
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
      <el-button
        type="primary"
        slot="searchItems"
        size="mini"
        @click="addEditSchedule(0)"
        >新增招生排期</el-button
      >
      <el-alert
        title="随意新增或编辑招生排期，有可能影响当前线索分配！请谨慎操作！"
        type="error"
        :closable="false"
      >
      </el-alert>
    </div>

    <div class="orderStyle" ref="tableContainer">
      <ele-table
        :tableHeight="tableHeight"
        :dataList="tableData"
        :loading="flags.loading"
        :size="tabQuery.pageSize"
        :page="tabQuery.pageNumber"
        :total="totalPages"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column prop="period" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="periodName"
          label="期名"
          align="center"
          width="90"
        >
        </el-table-column>
        <el-table-column
          prop="startDate"
          width="100"
          align="center"
          label="开始招生"
        ></el-table-column>
        <el-table-column
          prop="endDate"
          width="100"
          align="center"
          label="结束招生"
        ></el-table-column>
        <el-table-column
          prop="courseDay"
          width="100"
          align="center"
          label="开课时间"
        ></el-table-column>
        <el-table-column
          prop="endCourseDay"
          width="100"
          align="center"
          label="结课时间"
        ></el-table-column>
        <el-table-column label="招生级别" align="center" width="80">
          <template slot-scope="scope">
            <div
              v-for="(leve, l_index) in scope.row.wechatCourse"
              :key="l_index"
            >
              {{ leve.courseDifficulty || '' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="带班销售人数"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div v-for="(w, l_index) in scope.row.wechatCourse" :key="l_index">
              {{ w.wechatSize || '0' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="计划招生" align="center">
          <template slot-scope="scope">
            <div v-for="(p, l_index) in scope.row.wechatCourse" :key="l_index">
              {{ p.planSumTeamSize || '0' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="实际招生" align="center">
          <template slot-scope="scope">
            <div v-for="(r, l_index) in scope.row.wechatCourse" :key="l_index">
              {{ r.realSumTeamSize || '0' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="计划开班" align="center">
          <template slot-scope="scope">
            <div v-for="(p, l_index) in scope.row.wechatCourse" :key="l_index">
              {{ p.planTeamSize || '0' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="实际开班" align="center">
          <template slot-scope="scope">
            <div v-for="(r, l_index) in scope.row.wechatCourse" :key="l_index">
              {{ r.realTeamSize || '0' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="130">
          <template slot-scope="scope">
            <div class="editStyle">
              <span style="margin-right:15px" @click="downlaodExcel(scope.row)"
                >下载</span
              >
              <span
                style="margin-right:15px"
                @click="addEditSchedule(scope.row)"
                >编辑</span
              >
              <span @click="go_detail(scope.row)">详细</span>
            </div>
          </template>
        </el-table-column>
      </ele-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EleTable from '@/components/Table/EleTable'
import { formatData } from '@/utils'
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
  computed: {
    ...mapGetters(['subjects'])
  },
  data() {
    return {
      tableHeight: 'auto',
      canClick: true,
      query: '',
      tabIndex: 0,
      tabs: ['体验课', '系统课'],
      totalElements: 0,
      flags: {
        loading: false
      },
      tabQuery: {
        pageSize: 20,
        pageNumber: 1
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
      teacherID: ''
    }
  },
  watch: {},
  async activated() {
    this.tabQuery.pageNumber = 1
    // this.tabQuery.subject = this.subjects.currentSubjectKey || ''
    this.$nextTick(() => this.calcTableHeight())
    await this.getCourseListByType()
  },
  methods: {
    /** adolf-start */
    tabs_click(index) {
      this.tabIndex = index
      this.tabQuery.pageNumber = 1
      this.getCourseListByType()
    },
    // 下载当前行
    async downlaodExcel(row) {
      console.log('row', row.period)
      const params = {
        departmentIds: '',
        teacherId: '',
        level: '',
        courseDifficulties: '',
        courseType: this.tabIndex,
        period: row.period
      }
      const res = await this.$http.writeApp.DownloadExcel.downloadExcelByPeriod(
        params
      )

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
    pageChange_handler(pageNumber) {
      this.tabQuery.pageNumber = pageNumber
      this.getCourseListByType()
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
        courseType: this.tabIndex
      }
      try {
        const {
          content = [],
          totalElements = 0
        } = await this.$http.writeApp.Operating.getCourseListByType(
          this.tabQuery
        )
        this.totalPages = Number(totalElements)

        content.forEach((item) => {
          item.startDate = formatData(item.startDate)
          item.endDate = formatData(item.endDate)
          item.courseDay = formatData(item.courseDay)
          item.endCourseDay = +item.endCourseDay
            ? formatData(item.endCourseDay)
            : ''
          item.status = status[item.status]
        })
        this.flags.loading = false

        this.tableData = content
      } catch (err) {
        this.flags.loading = false
        return new Error(err)
      }
    },
    // 搜索
    handleSearch(data) {
      console.log(data)
    },
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
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
  cursor: pointer;
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
