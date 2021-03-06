<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2021-01-19 14:40:34
-->
<template>
  <div class="coin-content">
    <div class="coin-num-box">
      <div class="coin-item" v-for="(cItem, cKey) of coinNumList" :key="cKey">
        <span class="coin-nums-label">{{ cItem.label }} :</span>
        <span class="coin-nums-val">{{ cItem.value }}</span>
      </div>
    </div>
    <el-table :data="renderTableData" style="width: 100%">
      <el-table-column prop="transTypeName" label="类型"></el-table-column>
      <el-table-column prop="desc" label="操作说明"></el-table-column>
      <el-table-column label="数量">
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
import { formatDate } from '@/utils/mini_tool_lk'
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
      options: {
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
          label: '已兑换',
          value: 0
        },
        {
          label: '剩余钻石',
          value: 0
        }
      ],
      renderTableData: [],
      currentPage: 1,
      allDigit: 0
    }
  },
  mounted() {
    this.reqGetUserDiamond()
    this.top3Show()
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        this.reqGetUserDiamond()
        this.top3Show()
      }
    }
  },
  computed: {},
  methods: {
    // 数据接口_用户资产_钻石
    reqGetUserDiamond() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      this.$http.User.getUserAssetsDiamond(
        this.changeSubject,
        this.$route.params.id,
        this.currentPage
      )
        .then((res) => {
          if (res.data.AccountPage && res.data.AccountPage.content.length) {
            res.data.AccountPage.content.forEach((nItem) => {
              // 类型
              nItem.transTypeName = this.options['' + nItem.trans_type]
              // 操作时间
              nItem.update_date = formatDate(nItem.ctime)
              // 金额颜色-是否减
              nItem.coinDown = +nItem.trans_type === 5 ? 1 : 0
            })
            this.allDigit = Number(res.data.AccountPage.totalElements)
            this.renderTableData = res.data.AccountPage.content
          } else {
            this.allDigit = 0
            this.renderTableData = []
          }
        })
        .catch(() => {
          this.$message.error('获取用户资产_钻石_失败')
        })
        .finally(() => {
          loading.close()
        })
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqGetUserDiamond()
    },
    // 打野容量statistics
    top3Show() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      this.$http.User.getUserAssetsDiamond(
        this.changeSubject,
        this.$route.params.id,
        1,
        500
      )
        .then((res) => {
          if (res.data.AccountPage && res.data.AccountPage.content.length) {
            // 总获取
            this.coinNumList[0].value = res.data.AccountPage.content.reduce(
              (pre, cur, index, self) => {
                if (cur.trans_type === '1' || cur.trans_type === '9') {
                  return pre + cur.amount
                } else {
                  return pre
                }
              },
              0
            )
            // 已消耗
            this.coinNumList[1].value = res.data.AccountPage.content.reduce(
              (pre, cur, index, self) => {
                if (cur.trans_type === '5') {
                  return pre + cur.amount
                } else {
                  return pre
                }
              },
              0
            )
            // 计算剩余
            this.coinNumList[2].value =
              this.coinNumList[0].value - this.coinNumList[1].value
            this.$emit('colorDiamond', this.coinNumList[2].value) // colorDiamond
          } else {
            this.coinNumList[0].value = 0
            this.coinNumList[1].value = 0
            this.coinNumList[2].value = 0
            this.$emit('colorDiamond', this.coinNumList[2].value) // colorDiamond
          }
        })
        .catch(() => {
          this.$message.error('获取用户资产_钻石统计_失败')
        })
        .finally(() => {
          loading.close()
        })
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
        color: #4a93dd;
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
