<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2021-01-18 12:43:27
-->
<template>
  <div class="coin-content">
    <div class="coin-num-box">
      <div class="coin-item" v-for="(cItem, cKey) of coinNumList" :key="cKey">
        <span class="coin-nums-label">{{ cItem.label }} :</span>
        <span class="coin-nums-val">{{ cItem.value }}</span>
      </div>
    </div>
    <div class="searchItem" v-if="changeSubject === 0">
      <el-form :inline="true" size="mini">
        <el-form-item label="任务类型:" style="margin-right:30px">
          <el-select
            v-model="taskType"
            clearable
            collapse-tags
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="(task, index) in taskTypes"
              :key="index"
              :label="task.label"
              :value="task.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获取时间:">
          <el-date-picker
            v-model="timeRange"
            unlink-panels
            type="daterange"
            size="mini"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="renderTableData" style="width: 100%">
      <el-table-column prop="taskType" label="任务类型"></el-table-column>
      <el-table-column prop="taskName" label="任务名称"></el-table-column>
      <el-table-column prop="desc" label="说明"></el-table-column>
      <el-table-column label="小熊币">
        <template slot-scope="scope">
          <span v-if="scope.row.coinDown" class="red-text-color">
            - {{ scope.row.amount }}</span
          >
          <span v-else class="green-text-color"> + {{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_date" label="操作时间"></el-table-column>
    </el-table>
    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total"
        :page-size="20"
        :total="allDigit"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import { formatDateByType } from '@/utils/mini_tool_lk'
export default {
  name: 'coinComponent',
  props: {
    changeSubject: {
      type: Number,
      required: true
    },
    pUserId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      studentId: '',
      taskType: [], // 任务类型-[]
      timeRange: null, // 获取时间-null
      taskTypes: [
        {
          label: '获取',
          value: [2, 6, 8, 9, 10, 12]
        },
        {
          label: '消耗',
          value: [5, 11, 13, 14]
        }
      ],
      taskKeyVal: {},
      options: {
        // 前端滤掉0和7
        0: '默认',
        1: '邀请有奖或推荐有礼',
        2: '完成任务',
        3: '邀请有奖红包',
        4: '提现',
        5: '小熊币宝石兑换',
        6: '学习奖励',
        7: '用户注册',
        8: '运营活动',
        9: '投诉补偿',
        10: '小熊币抽奖',
        11: '大转盘消耗',
        12: '小熊币兑吧添加',
        13: '小熊币兑吧扣除',
        14: '运营扣除'
      },
      // 获取对应的值
      acquire: {
        2: '任务奖励',
        6: '学习奖励',
        8: '系统导入',
        9: '系统导入',
        10: '抽奖活动',
        12: '活动收入'
      },
      // 消耗对应的值
      consume: {
        5: '兑换消耗',
        11: '抽奖消耗',
        13: '活动消耗',
        14: '系统扣除'
      },
      coinNumList: [
        {
          label: '共获取',
          value: 0
        },
        {
          label: '已消耗',
          value: 0
        },
        {
          label: '剩余',
          value: 0
        }
      ],
      renderTableData: [],
      faProps: [], // 爹给的
      currentPage: 1,
      allDigit: 0
    }
  },
  created() {
    if(!this.$route.params.isShort){
      this.studentId = this.$route.params.id;
    }
    this.taskKeyVal = Object.assign({}, this.acquire, this.consume)
  },
  mounted() {
    this.$root.$on('bearCoin', (r) => {
      this.faProps = r || []
      this.top3Show()
    })
    setTimeout(this.reqGetUserCoin.bind(this, 'mounted'), 2000)
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        this.reqGetUserCoin()
      }
    },
    taskType: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.info('捕获任务类型改变', newValue, oldValue)
        this.reqGetUserCoin()
      }
    },
    timeRange: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        this.reqGetUserCoin()
      }
    },
    pUserId(value) {
      if(value && this.$route.params.isShort) {
        this.studentId = value
        this.top3Show()
      }
    }
  },
  computed: {
    // 获取时间筛选对象
    ctime() {
      const ctime = {}
      ctime.gte = this.timeRange ? this.timeRange[0] : 0 // 清空之后2030年↓
      ctime.lte = this.timeRange ? this.timeRange[1] : 1902591374054
      return ctime
    }
  },
  methods: {
    // 数据接口_用户资产_小熊币
    reqGetUserCoin(other) {
      console.log('reqGetUserCoin', this.studentId)
      this.$http.User.getUserAssetsCoin(
        this.changeSubject,
        this.studentId,
        this.currentPage,
        Array.isArray(this.taskType) && this.taskType.length
          ? this.taskType
          : Object.keys(this.taskKeyVal), // 清空之后全类型
        this.ctime
      )
        .then((res = {}) => {
          const { content = [] } = res.data?.AccountPage || {}
          if (content.length) {
            content.forEach((item = {}) => {
              const { trans_type: transType } = item
              // 任务类型
              if (Object.keys(this.consume).includes(transType)) {
                item.taskType = '消耗'
              } else if (Object.keys(this.acquire).includes(transType)) {
                item.taskType = '获取'
              } else {
                item.taskType = '未知'
              }
              // 任务名称
              item.taskName = this.taskKeyVal[transType]
              // 金额颜色
              item.coinDown = Object.keys(this.consume).includes(transType)
            })
            this.allDigit = Number(res.data.AccountPage.totalElements)
            this.renderTableData = content
          } else {
            this.allDigit = 0
            this.renderTableData = []
          }
        })
        .catch((res) => {
          this.$message.error('获取用户资产_小熊币_失败')
        })
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val
      this.reqGetUserCoin()
    },
    top3Show() {
      // 头3数据取自老爹-总获取
      this.coinNumList[0].value = this.faProps.reduce(
        (pre, cur, index, self) => {
          if (Object.keys(this.acquire).includes(cur.code)) {
            return pre + Number(cur.value)
          } else {
            return pre + 0
          }
        },
        0
      )
      // 头3数据取自老爹-已消耗
      this.coinNumList[1].value = this.faProps.reduce(
        (pre, cur, index, self) => {
          if (Object.keys(this.consume).includes(cur.code)) {
            return pre + Number(cur.value)
          } else {
            return pre + 0
          }
        },
        0
      )
      // 头3数据取自老爹-计算剩余
      this.coinNumList[2].value =
        this.coinNumList[0].value - this.coinNumList[1].value

      this.$emit('colorBear', this.coinNumList[2].value)
    }
  }
}
</script>

<style lang="scss" scoped>
.coin-content {
  .coin-num-box {
    margin-bottom: 10px;
    height: 40px;
    line-height: 40px;
    .coin-item {
      display: inline-block;
      .coin-nums-label {
        color: rgb(174, 174, 174);
      }
      .coin-nums-val {
        margin: 0 30px 0 10px;
      }
    }
  }
  .green-text-color {
    color: #67c23a;
  }
  .red-text-color {
    color: crimson;
  }
}
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
