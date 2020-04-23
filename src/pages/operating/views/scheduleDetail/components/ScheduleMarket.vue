<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-23 16:58:18
 -->
<template>
  <div>
    <div class="sear-container">
      <div class="orderStyle">
        <ele-table
          :dataList="tableData"
          :loading="flags.loading"
          :size="tabQuery.size"
          :page="tabQuery.pageNum"
          :total="totalElements"
          @pageChange="pageChange_handler"
          class="mytable"
        >
          <el-table-column prop="id" label="序号" width="50" align="center">
            <template slot-scope="scope"
              ><span>{{ scope.$index + calcIndex + 1 }} </span></template
            >
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="部门"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="teacherRealName"
            label="真实姓名"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="courseDifficulty"
            label="招生级别"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="planSumTeamSize"
            label="计划招生数"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="realSumTeamSize"
            label="实际招生数"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="enrollRate"
            label="招生完成率"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="planTeam"
            label="计划班级人数"
          ></el-table-column>
          <el-table-column prop="realTeam" label="已开班级数"></el-table-column>
          <el-table-column
            align="center"
            prop="teacherWechatNos"
            label="绑定微信号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="courseVersion"
            label="课程和材料版本"
          ></el-table-column>
        </ele-table>
      </div>
    </div>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
export default {
  props: {
    department: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    EleTable
  },
  data() {
    return {
      totalElements: 0,
      flags: {
        loading: false
      },
      tabQuery: {
        size: 10,
        pageNum: 1
      },
      // 总页数
      totalPages: 1,
      // 当前页数
      // 表格数据
      tableData: []
    }
  },
  computed: {
    calcIndex() {
      return this.tabQuery.size * (this.tabQuery.pageNum - 1)
    }
  },
  watch: {},
  async created() {
    const { period = '', courseType = '0' } = this.$route.params
    Object.assign(this.tabQuery, { period, courseType })

    this.init()
  },
  methods: {
    async init() {
      this.flags.loading = true

      try {
        const _list = await this.getScheduleDetailList()
        const { content = [] } = _list
        this.tableData = content

        this.totalElements = +_list.totalElements
        this.flags.loading = false
      } catch (err) {
        console.log()
      }
    },
    async getScheduleDetailList() {
      try {
        const tableList = this.$http.Operating.getScheduleDetailList(
          this.tabQuery
        )
        return tableList
      } catch (err) {
        this.flags.loading = false
        return new Error(err)
      }
    },
    // 分页
    pageChange_handler(page) {
      this.tabQuery.pageNum = page
      this.init()
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
    span.active {
      color: #409eff;
      background: #fff;
    }
  }
}
.sear-container {
  display: flex;
  align-items: center;
  .el-card {
    border: 0;
  }
}
.orderStyle {
  // padding-bottom: 45px;
  width: 100%;
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
