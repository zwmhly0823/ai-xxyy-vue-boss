<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2020-10-15 20:12:39
-->
<template>
  <div class="coin-content">
    <div class="coin-num-box">
      <div class="coin-item" v-for="(cItem, cKey) in coinNumList" :key="cKey">
        <span class="coin-nums-label">{{ cItem.label }} :</span>
        <span class="coin-nums-val">{{ cItem.value }}</span>
      </div>
    </div>
    <div class="searchItem" v-if="changeSubject === 0">
      <el-form :inline="true" size="mini">
        <el-form-item label="任务类型:" style="margin-right:30px">
          <el-select
            v-model="value1"
            clearable
            multiple
            collapse-tags
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="(value, name) in options"
              :key="name"
              :label="value"
              :value="name"
              :disabled="name === '0' || name === '7'"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="获取时间:">
          <el-date-picker
            v-model="value2"
            type="daterange"
            size="mini"
            unlink-panels
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
      <el-table-column prop="transTypeName" label="类型"></el-table-column>
      <el-table-column prop="desc" label="操作"></el-table-column>
      <el-table-column label="金额">
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
export default {
  name: 'coinComponent',
  props: {
    changeSubject: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      value1: [], // 任务类型-[]
      value2: null, // 获取时间-null
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
  mounted() {
    this.$root.$on('bearCoin', (r) => {
      console.info('老爹给用户资产-小熊币-基础数据', r)
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
    value1: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.info('捕获任务类型改变', newValue, oldValue)
        this.reqGetUserCoin()
      }
    },
    value2: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.info('捕获时间改变', newValue, oldValue)
        this.reqGetUserCoin()
      }
    }
  },
  computed: {
    // 获取时间筛选对象
    ctime() {
      const ctime = {}
      ctime.gte = this.value2 ? this.value2[0] : 0 // 清空之后2030年↓
      ctime.lte = this.value2 ? this.value2[1] : 1902591374054
      return ctime
    }
  },
  methods: {
    // 数据接口_用户资产_小熊币
    reqGetUserCoin(other) {
      this.$http.User.getUserAssetsCoin(
        this.changeSubject,
        this.$route.params.id,
        this.currentPage,
        Array.isArray(this.value1) && this.value1.length
          ? this.value1
          : [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14], // 清空之后全类型
        this.ctime
      )
        .then((res) => {
          if (res.data.AccountPage && res.data.AccountPage.content.length) {
            res.data.AccountPage.content.forEach((nItem) => {
              // 类型
              nItem.transTypeName = this.options['' + nItem.trans_type]
              // 操作时间
              nItem.update_date = nItem.update_date ? nItem.update_date : '-'
              // 金额颜色
              nItem.coinDown =
                +nItem.trans_type === 4 ||
                +nItem.trans_type === 5 ||
                +nItem.trans_type === 11
                  ? 1
                  : 0
            })
            this.allDigit = Number(res.data.AccountPage.totalElements)
            this.renderTableData = res.data.AccountPage.content
          } else {
            this.allDigit = 0
            this.renderTableData = []
          }
        })
        .catch(() => {
          this.$message.error('获取用户资产_小熊币_失败')
        })
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqGetUserCoin()
    },
    top3Show() {
      // 头3数据取自老爹-总获取
      this.coinNumList[0].value = this.faProps.reduce(
        (pre, cur, index, self) => {
          if (
            cur.code !== '5' &&
            cur.code !== '11' &&
            cur.code !== '13' &&
            cur.code !== '14'
          ) {
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
          if (
            cur.code === '5' ||
            cur.code === '11' ||
            cur.code === '13' ||
            cur.code === '14'
          ) {
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
