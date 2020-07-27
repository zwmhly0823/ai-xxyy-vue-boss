<template>
  <div class="coin-content">
    <div class="coin-num-box">
      <div class="coin-item" v-for="(cItem, cKey) in coinNumList" :key="cKey">
        <span class="coin-nums-label">{{ cItem.label }} :</span>
        <span class="coin-nums-val">{{ cItem.value }}</span>
      </div>
    </div>
    <el-table
      :data="renderTableData"
      style="width: 100%"
      :row-style="rowStyle"
      header-row-class-name="learning-record-sty"
    >
      <el-table-column prop="transTypeName" label="类型"></el-table-column>
      <el-table-column prop="desc" label="操作"></el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.trans_type - 0 === 4 || scope.row.trans_type - 0 === 5
            "
            class="red-text-color"
          >
            - {{ scope.row.amount }}</span
          >
          <span v-else class="green-text-color"> + {{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_date" label="操作时间"></el-table-column>
    </el-table>
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="handleSizeChange"
      show-pager
      open="calc(100vw - 195px)"
      close="calc(100vw - 75px)"
    ></m-pagination>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import MPagination from '@/components/MPagination/index.vue'
// import { formatData } from '@/utils/index'
export default {
  name: 'coinComponent',
  components: {
    MPagination
  },
  props: {
    propData: Object
  },
  created() {
    this.initRenderData()
    this.initNum()
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
      renderTableData: null,
      rowStyle: {
        height: '57px',
        lineHeight: '57px'
      },
      currentPage: 1,
      totalPages: 0,
      totalElements: 0
    }
  },
  watch: {
    propData() {
      this.initRenderData()
    }
  },
  methods: {
    initRenderData() {
      this.renderTableData = cloneDeep(this.propData.AccountPage.content)
      // console.log(this.propData)
      if (!this.renderTableData.length) {
        return
      }
      this.renderTableData.forEach((item, key) => {
        item.update_date = item.update_date ? item.update_date : '-'
      })
      const transTypeNameArr = [
        '默认',
        '邀请有奖或推荐有礼',
        '完成任务',
        '邀请有奖红包',
        '提现',
        '小熊币兑换',
        '学习奖励',
        '用户注册',
        '运营活动',
        '投诉补偿'
      ]
      this.renderTableData.forEach((nItem) => {
        nItem.transTypeName = transTypeNameArr[+nItem.trans_type]
      })
    },
    initNum() {
      this.totalPages = +this.propData.AccountPage.totalPages
      this.totalElements = +this.propData.AccountPage.totalElements
      this.propData.accountUserCollect.forEach((nItem) => {
        switch (nItem.code - 0) {
          case 4:
          case 5:
            this.coinNumList[1].value += nItem.value - 0
            break
          default:
            this.coinNumList[0].value += nItem.value - 0
            break
        }
      })
      const transTypeNameArr = [
        '默认',
        '邀请有奖或推荐有礼',
        '完成任务',
        '邀请有奖红包',
        '提现',
        '小熊币兑换',
        '学习奖励',
        '用户注册',
        '运营活动',
        '投诉补偿'
      ]
      this.renderTableData.forEach((nItem) => {
        nItem.transTypeName = transTypeNameArr[+nItem.trans_type]
      })
      this.coinNumList[2].value =
        this.coinNumList[0].value - this.coinNumList[1].value
    },
    handleSizeChange(page) {
      this.currentPage = page
      this.$emit('changePagenation', {
        curPane: 'coin',
        page: this.currentPage
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
</style>
