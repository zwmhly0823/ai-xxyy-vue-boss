<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-24 15:22:49
 -->
<template>
  <div>
    <div class="sear-container">
      <div class="description" v-if="resultStatistics">
        当前结果：社群销售<span>{{ resultStatistics.wechatSize }}</span
        >人，计划招生<span>{{ resultStatistics.planSumTeamSize }}</span>
        <span>（</span>
        
        <span
          >{{ SUP_LEVEL_ALL['S1'] }}:{{
            (resultStatistics.S1 && resultStatistics.S1.planSumTeamSize) || 0
          }}
        </span>
        <span
          >{{ SUP_LEVEL_ALL['S2'] }}:{{
            (resultStatistics.S2 && resultStatistics.S2.planSumTeamSize) || 0
          }}
        </span>
        <!-- <span v-if="courseType != '0'"
          >{{ SUP_LEVEL_ALL['S5'] }}:{{
            (resultStatistics.S5 && resultStatistics.S5.planSumTeamSize) || 0
          }}
        </span> -->
        <span
          >{{ SUP_LEVEL_ALL['S3'] }}:{{
            (resultStatistics.S3 && resultStatistics.S3.planSumTeamSize) || 0
          }}
        </span>
        <span v-if="courseType != '0'"
          >{{ SUP_LEVEL_ALL['S4'] }}:{{
            (resultStatistics.S4 && resultStatistics.S4.planSumTeamSize) || 0
          }}
        </span>
        <span>）</span>

        实际招生<span>{{ resultStatistics.realSumTeamSize }}</span>
        <span>（</span>
        
        <span
          >{{ SUP_LEVEL_ALL['S1'] }}:{{
            (resultStatistics.S1 && resultStatistics.S1.realSumTeamSize) || 0
          }}
        </span>
        <span
          >{{ SUP_LEVEL_ALL['S2'] }}:{{
            (resultStatistics.S2 && resultStatistics.S2.realSumTeamSize) || 0
          }}
        </span>
        <!-- <span v-if="courseType != '0'"
          >{{ SUP_LEVEL_ALL['S5'] }}:{{
            (resultStatistics.S5 && resultStatistics.S5.realSumTeamSize) || 0
          }}
        </span> -->
        <span
          >{{ SUP_LEVEL_ALL['S3'] }}:{{
            (resultStatistics.S4 && resultStatistics.S3.realSumTeamSize) || 0
          }}
        </span>
        <span v-if="courseType != '0'"
          >{{ SUP_LEVEL_ALL['S4'] }}:{{
            (resultStatistics.S4 && resultStatistics.S4.realSumTeamSize) || 0
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
            v-if="courseType == '0'"
            align="center"
            prop="levelName"
            label="销售等级"
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
            prop="intruNum"
            label="转介绍招生数"
            width="100"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="marketStuNum"
            label="市场招生数"
            width="100"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="realSumTeamSize"
            label="实际招生数"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="enrollStuRate"
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
            width="120"
          ></el-table-column>
          <el-table-column
            prop="courseCategoryCHN"
            label="课程类型"
            width="120"
            align="center"
          >
            <!-- <template slot-scope="scope">
              <span>{{ courseCategoryCHN }}</span>
            </template> -->
          </el-table-column>
        </ele-table>
      </div>
    </div>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
import { COURSECATEGORY } from '@/utils/enums'
import { SUP_LEVEL_ALL } from '@/utils/supList'
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
      SUP_LEVEL_ALL,
      courseCategory: {
        0: '双周体验课',
        2: '年系统课',
        3: '单周体验课',
        4: '半年系统课'
      },
      courseType: '0',
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
      tableData: []
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
      handler(val) {
        this.tabQuery = {
          ...this.tabQuery,
          ...val,
          pageNum: 1
        }
        // console.log('this.tabQuery', this.tabQuery)
        this.init()
        // 表格内统计
        this.getScheduleDetailStatistic()
      }
    }
  },
  async created() {
    const { period = '', courseType = '0' } = this.$route.params
    this.courseType = courseType
    Object.assign(this.tabQuery, { period, courseType })
    // 表格内统计
    this.getScheduleDetailStatistic()
  },
  methods: {
    async init() {
      this.flags.loading = true

      try {
        const _list = await this.getScheduleDetailList()
        const { content = [] } = _list
        const idsArr = []
        content.forEach((item) => {
          idsArr.push(item.teacherId)
        })
        const query = {
          ids: idsArr.join(','),
          term: this.paramsInfo.period
        }
        // 转介绍招生数
        const intruStuNumRes = await this.getIntroduceCountByIds(query)
        intruStuNumRes.forEach((item) => {
          content.forEach((value) => {
            if (item.id === value.teacherId) {
              value.intruNum = item.count || 0
              // 市场招生数
              value.marketStuNum = value.realSumTeamSize - value.intruNum
              // 招生完成率
              value.enrollStuRate =
                ((value.marketStuNum * 100) / value.planSumTeamSize).toFixed(
                  1
                ) + '%'
            }
          })
        })

        content.forEach((value) => {
          let { courseCategory, courseCategoryCHN = '' } = value
          courseCategory.split(',').forEach((course) => {
            courseCategoryCHN += ' ' + COURSECATEGORY(course)
          })

          value.courseCategoryCHN = courseCategoryCHN
          value.courseDifficulty =
            SUP_LEVEL_ALL[value.courseDifficulty] || ''
        })

        this.tableData = content

        this.totalElements = +_list.totalElements
        this.flags.loading = false
      } catch (err) {}
    },
    // 表格 内 统计数据
    async getScheduleDetailStatistic() {
      try {
        const info = await this.$http.Operating.getScheduleDetailStatistic(
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
          S5: {}
        }

        payload.forEach((item, index) => {
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

          // if (index === 0) {
          //   obj.PS1 = item.planSumTeamSize || '0'
          //   obj.RS1 = item.realSumTeamSize || '0'
          // } else if (index === 1) {
          //   obj.PS2 = item.planSumTeamSize || '0'
          //   obj.RS2 = item.realSumTeamSize || '0'
          // } else if (index === 2) {
          //   obj.PS3 = item.planSumTeamSize || '0'
          //   obj.RS3 = item.realSumTeamSize || '0'
          // }
        })

        this.resultStatistics = obj
      } catch (err) {
        console.log(err)
      }
    },
    // 表格详情数据
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
    // 转介绍招生数
    getIntroduceCountByIds(query) {
      return this.$http.Operating.getIntroduceCountByIds(query)
        .then((res) => {
          if (res.status === 'OK') {
            return res.payload
          }
          return false
        })
        .catch(() => {
          return false
        })
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
<style lang="scss">
.checkBoxStyle {
  .el-checkbox {
    border: none;
    padding-left: 0px !important;
    color: rgb(102, 102, 102) !important;
  }
}
</style>
