<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-04 15:08:46
 -->
<template>
  <div>
    <div class="sear-container">
      <div class="description" v-if="resultStatistics">
        当前结果：社群销售<span>{{ resultStatistics.wechatSize }}</span
        >人，计划招生<span>{{ resultStatistics.planSumTeamSize }}</span>
        <span>（</span>
        <span v-if="courseType == '1'"
          >{{ SUP_LEVEL_ALL['S4'] }}:{{
            (resultStatistics.S4 && resultStatistics.S4.planSumTeamSize) || 0
          }}
        </span>
        <span
          >{{ courseType != '3' ? SUP_LEVEL_ALL['S1'] : 'S1' }}:{{
            calcLevelNum('S1', 'planSumTeamSize')
          }}
        </span>
        <span
          >{{ courseType != '3' ? SUP_LEVEL_ALL['S2'] : 'S2' }}:{{
            calcLevelNum('S2', 'planSumTeamSize')
          }}
        </span>
        <span v-if="courseType == '1'"
          >{{ SUP_LEVEL_ALL['S5'] }}:{{
            (resultStatistics.S5 && resultStatistics.S5.planSumTeamSize) || 0
          }}
        </span>
        <span
          >{{ courseType != '3' ? SUP_LEVEL_ALL['S3'] : 'S3' }}:{{
            calcLevelNum('S3', 'planSumTeamSize')
          }}
        </span>
        <span>）</span>

        实际招生<span>{{ resultStatistics.realSumTeamSize }}</span>
        <span>（</span>
        <span v-if="courseType == '1'"
          >{{ SUP_LEVEL_ALL['S4'] }}:{{
            (resultStatistics.S4 && resultStatistics.S4.realSumTeamSize) || 0
          }}
        </span>
        <span
          >{{ courseType != '3' ? SUP_LEVEL_ALL['S1'] : 'S1' }}:{{
            calcLevelNum('S1', 'realSumTeamSize')
          }}
        </span>
        <span
          >{{ courseType != '3' ? SUP_LEVEL_ALL['S2'] : 'S2' }}:{{
            calcLevelNum('S2', 'realSumTeamSize')
          }}
        </span>
        <span v-if="courseType == '1'"
          >{{ SUP_LEVEL_ALL['S5'] }}:{{
            (resultStatistics.S5 && resultStatistics.S5.realSumTeamSize) || 0
          }}
        </span>
        <span
          >{{ courseType != '3' ? SUP_LEVEL_ALL['S3'] : 'S3' }}:{{
            calcLevelNum('S3', 'realSumTeamSize')
          }}
        </span>
        <span>）</span>

        <!--        平均招生完成率
        <span v-for="(val, key) in enrollRateData" :key="key">
          <template v-if="val && val.length > 0">
            {{ key }}（S: {{ val[0].enrollRate }}%，A:
            {{ val[1].enrollRate }}%，B: {{ val[2].enrollRate }}）
          </template>
          <template v-else>{{ key }}（S: 0%，A: 0%，B: 0%）</template>
        </span>-->
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
            width="100"
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
          <el-table-column align="center" label="市场数/状态" width="100">
            <template slot-scope="scope">
              <span>
                {{ scope.row.marketNum || 0 }}/{{
                  scope.row.marketStatus == 1 ? '开' : '关'
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="转介绍数/状态" width="100">
            <template slot-scope="scope">
              <span>
                {{ scope.row.conversionNum || 0 }}/{{
                  scope.row.conversionStatus == 1 ? '开' : '关'
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="转介绍超量状态" width="120">
            <template slot-scope="scope">{{
              scope.row.overshootStatus == 1 ? '开' : '关'
            }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="定向分配数"
            prop="directNum"
          ></el-table-column>
          <!--          <el-table-column align="center" label="S">
            <template slot-scope="scope">
              {{ scope.row.sCount }}/{{ scope.row.sPercent }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="A">
            <template slot-scope="scope">
              {{ scope.row.aCount }}/{{ scope.row.aPercent }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="B">
            <template slot-scope="scope">
              {{ scope.row.bCount }}/{{ scope.row.bPercent }}
            </template>
          </el-table-column>-->
          <el-table-column
            align="center"
            label="今日招生数"
            prop="todayNum"
          ></el-table-column>
          <el-table-column align="center" prop="enrollRate" label="招生完成率">
            <template slot-scope="scope"
              >{{
                (
                  (scope.row.realSumTeamSize / scope.row.planSumTeamSize) *
                  100
                ).toFixed(1)
              }}%</template
            >
          </el-table-column>
          <el-table-column
            align="center"
            prop="planTeamPeopleNum"
            label="计划班级人数"
            width="100"
          ></el-table-column>
          <el-table-column prop="teamNum" label="已开班级数"></el-table-column>
          <el-table-column
            align="center"
            prop="weixinNo"
            label="绑定微信号"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="courseVersion"
            label="课程和材料版本"
            width="120"
          ></el-table-column>
          <el-table-column label="课程类型" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ classIdTranName(scope.row.courseCategory) }}</span>
            </template>
          </el-table-column>
        </ele-table>
      </div>
    </div>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
import { COURSECATEGORY } from '@/utils/enums'
import {
  SUP_LEVEL_ALL,
  SUP_LEVEL_LIST_UPPER,
  Sup_scheduleSubmit,
} from '@/utils/supList'
export default {
  props: {
    paramsInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    EleTable,
  },
  data() {
    return {
      SUP_LEVEL_ALL,
      courseCategory: {
        0: '双周体验课',
        2: '年系统课',
        3: '单周体验课',
        4: '半年系统课',
      },
      courseType: '0',
      totalElements: 0,
      flags: {
        loading: false,
      },
      resultStatistics: {},
      tabQuery: {
        size: 20,
        pageNum: 1,
      },
      // 总页数
      totalPages: 1,
      // 当前页数
      // 表格数据
      tableData: [],
      // 平均招生完成率
      enrollRateData: {
        S1: [],
        S2: [],
        S3: [],
      },
    }
  },
  computed: {
    calcIndex() {
      return this.tabQuery.size * (this.tabQuery.pageNum - 1)
    },

    // 课程类型 id转换 name
    classIdTranName() {
      return (data) => {
        if (data && data.length) {
          return data
            .split(',')
            .map((item) => COURSECATEGORY(item))
            .join(' ')
        }
        return ''
      }
    },

    // 招生级别数
    calcLevelNum() {
      return (val, key) => {
        const findVal = SUP_LEVEL_LIST_UPPER.find((item) => item.id === val)
        return (
          this.resultStatistics[findVal.text]?.[key] ||
          this.resultStatistics[val]?.[key] ||
          0
        )
      }
    },
  },
  watch: {
    paramsInfo: {
      deep: true,
      immediate: true,
      handler(val) {
        this.tabQuery = {
          ...this.tabQuery,
          ...val,
          pageNum: 1,
        }
        this.init()
        // 表格内统计
        // this.getTrialDetailStatistic()
        // 平均招生完成率
        // this.getTrialEnrollRate()
      },
    },
  },
  async created() {
    this.init()

    // 表格内统计
  },
  methods: {
    async init() {
      this.flags.loading = true
      const { period = '', courseType = '0' } = this.$route.params
      this.courseType = courseType
      Object.assign(this.tabQuery, {
        period,
        courseType: Sup_scheduleSubmit[courseType],
      })
      try {
        this.getTrialDetailStatistic()
        const _list = await this.getTrialDetailList()
        const { content = [] } = _list
        this.tableData = content

        this.totalElements = +_list.totalElements
        this.flags.loading = false
      } catch (err) {}
    },

    // 表格 内 统计数据
    async getTrialDetailStatistic() {
      try {
        const info = await this.$http.Operating.getTrialDetailStatistic(
          this.tabQuery
        )
        const { payload = [] } = info

        const obj = {
          wechatSize: 0, // 带班销售总人数
          planSumTeamSize: 0, // 计划招生总人数
          realSumTeamSize: 0, // 实际招生总人数
          // PS1: 0,
          // PS2: 0,
          // PS3: 0,
          // RS1: 0,
          // RS2: 0,
          // RS3: 0
          S1: {},
          S2: {},
          S3: {},
          S4: {},
          S5: {},
        }

        payload.forEach((item, index) => {
          obj.wechatSize += +item.wechatSize
          obj.planSumTeamSize += +item.planSumTeamSize
          obj.realSumTeamSize += +item.realSumTeamSize
          const sup = {
            [item.courseDifficulty]: {
              planSumTeamSize: item.planSumTeamSize || 0,
              realSumTeamSize: item.realSumTeamSize || 0,
            },
          }
          Object.assign(obj, sup)
        })

        this.resultStatistics = obj
      } catch (err) {
      }
    },

    // 平均招生完成率
    async getTrialEnrollRate() {
      try {
        const { payload = {} } = await this.$http.Operating.getTrialEnrollRate(
          this.tabQuery
        )
        // 拼凑 key:S1 S2 S3
        for (const key in payload) {
          const getKey = key.substring(key.length - 2).toLocaleUpperCase()
          this.enrollRateData[getKey] = payload[key]
        }
      } catch (e) {
      }
    },

    // 表格详情数据
    async getTrialDetailList() {
      try {
        const tableList = this.$http.Operating.getTrialDetailList(this.tabQuery)
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
    },
  },
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
<style lang="scss">
.checkBoxStyle {
  .el-checkbox {
    border: none;
    padding-left: 0px !important;
    color: rgb(102, 102, 102) !important;
  }
}
</style>
