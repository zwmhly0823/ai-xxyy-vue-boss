<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2020-09-01 14:34:53
-->
<template>
  <div class="coin-content">
    <div class="coin-num-box">
      <div class="coin-item" v-for="(cItem, cKey) in coinNumList" :key="cKey">
        <span class="coin-nums-label">{{ cItem.label }} :</span>
        <span class="coin-nums-val">{{ cItem.value }}</span>
      </div>
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
      transTypeNameArr: [
        '默认',
        '邀请有奖或推荐有礼',
        '完成任务',
        '邀请有奖红包',
        '提现',
        '小熊币兑换',
        '学习奖励',
        '用户注册',
        '运营活动',
        '投诉补偿',
        '大转盘',
        '大转盘'
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
    setTimeout(this.reqGetUserCoin, 2000)
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        this.reqGetUserCoin()
      }
    }
  },
  methods: {
    // 数据接口_用户资产_小熊币
    reqGetUserCoin() {
      this.$http.User.getUserAssetsCoin(
        this.changeSubject,
        this.$route.params.id,
        this.currentPage
      )
        .then((res) => {
          if (res.data.AccountPage && res.data.AccountPage.content.length) {
            res.data.AccountPage.content.forEach((nItem) => {
              // 类型
              nItem.transTypeName = this.transTypeNameArr[+nItem.trans_type]
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
          if (cur.code !== '4' && cur.code !== '5' && cur.code !== '11') {
            return pre + Number(cur.value)
          }
        },
        0
      )
      // 头3数据取自老爹-已消耗
      this.coinNumList[1].value = this.faProps.reduce(
        (pre, cur, index, self) => {
          if (cur.code === '11') {
            return pre + Number(cur.value)
          } else {
            return 0
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
