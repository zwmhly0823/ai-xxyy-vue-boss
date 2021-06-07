<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: Shentong
 * @LastEditTime: 2021-03-23 20:10:28
 -->·
<template>
  <div>
    <div class="sear-container">
      <div class="description">
        当前结果：社群销售<span>{{ resultStatistics.wechatSize }}</span
        >人，计划招生<span>{{ resultStatistics.planSumTeamSize }}</span>
        <span>（</span>
        <span v-for="(value, key, index) in themeKeyVal" :key="index">
          {{ value }} ：{{
            (resultStatistics[key] && resultStatistics[key].planSumTeamSize) ||
              '0'
          }}
        </span>
        <span>），</span>

        实际招生<span>{{ resultStatistics.realSumTeamSize }}</span>
        <span>（</span>
        <span v-for="(value, key) in themeKeyVal" :key="key">
          {{ value }} ：{{
            (resultStatistics[key] && resultStatistics[key].realSumTeamSize) ||
              '0'
          }}
        </span>
        <span>）</span>
      </div>
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
            min-width="100"
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
            label="主题课名称"
          >
            <template slot-scope="scope">
              {{ themeKeyVal[scope.row.courseDifficulty] }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="planSumTeamSize"
            width="100"
            label="计划招生数"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="realSumTeamSize"
            label="实际招生数"
            width="100"
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
            width="100"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="realTeam"
            label="已开班级数"
            width="100"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="teacherWechatNos"
            label="绑定微信号"
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
    paramsInfo: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    EleTable
  },
  data() {
    return {
      courseType: '5',
      totalElements: 0,
      flags: {
        loading: false
      },
      resultStatistics: {},
      tabQuery: {
        size: 20,
        pageNum: 1
      },
      // 总页数
      totalPages: 1,
      // 当前页数
      // 表格数据
      tableData: [],
      themeKeyVal: {}
    }
  },
  computed: {
    calcIndex() {
      return this.tabQuery.size * (this.tabQuery.pageNum - 1)
    }
  },
  watch: {
    paramsInfo: {
      deep: true,
      immediate: true,
      async handler(val) {
        this.tabQuery = {
          ...this.tabQuery,
          ...val,
          pageNum: 1
        }
        if (!Object.keys(this.themeKeyVal).length) {
          await this.getTabPackage()
        }
        this.init()
        // 表格内统计
        this.getThemeDetailStatistic() // TODO:
      }
    }
  },
  async created() {
    const { period = '', courseType = '5' } = this.$route.params
    this.courseType = courseType
    Object.assign(this.tabQuery, { period, courseType })
  },
  methods: {
    async init() {
      this.flags.loading = true

      try {
        const _list = await this.getThemeDetailList()
        const { content = [] } = _list

        this.tableData = content

        this.totalElements = +_list.totalElements
        this.flags.loading = false
      } catch (err) {}
    },
    // 表格 内 统计数据
    async getThemeDetailStatistic() {
      try {
        const info = await this.$http.Operating.getThemeDetailStatistic(
          this.tabQuery
        )
        const { payload = [] } = info

        const obj = {
          wechatSize: 0, // 带班销售总人数
          planSumTeamSize: 0, // 计划招生总人数
          realSumTeamSize: 0 // 实际招生总人数
        }

        payload.forEach((item) => {
          obj.wechatSize += +item.wechatSize
          obj.planSumTeamSize += +item.planSumTeamSize
          obj.realSumTeamSize += +item.realSumTeamSize
          const sup = {
            [item.courseDifficulty]: {
              planSumTeamSize: item.planSumTeamSize || 0,
              realSumTeamSize: item.realSumTeamSize || 0
            }
          }
          Object.assign(obj, sup)
        })

        this.resultStatistics = obj
      } catch (err) {
      }
    },
    // 表格详情数据
    async getThemeDetailList() {
      try {
        const tableList = this.$http.Operating.getThemeDetailList(this.tabQuery)
        return tableList
      } catch (err) {
        this.flags.loading = false
        return new Error(err)
      }
    },
    /**
     * @description 获取主题课套餐
     */
    async getTabPackage() {
      const { getSpecialOfferPackageName } = this.$http.Order
      const { payload } = await getSpecialOfferPackageName({
        type: 'THEME_COURSE_MAJOR'
      })
      payload.forEach((item) => {
        const { id, name } = item
        this.themeKeyVal[id] = name
      })
      // this.themeKeyVal = payload
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
      color: #2a75ed;
      background: #fff;
    }
  }
}
.sear-container {
  // display: flex;
  // align-items: center;
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
