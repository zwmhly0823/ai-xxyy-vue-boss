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
      <el-table-column prop="desc" label="操作"></el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          <span v-if="scope.row.amount - 0 > 0" class="green-text-color">
            + ¥:{{ scope.row.amount }}</span
          >
          <span v-else-if="scope.row.amount - 0 < 0" class="red-text-color">
            - ¥:{{ scope.row.amount }}</span
          >
          <span v-else> 0 </span>
        </template>
      </el-table-column>
      <el-table-column prop="update_date" label="操作时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { formatData } from '@/utils/index'
export default {
  name: 'coinComponent',
  props: {
    propData: Array,
    assetNumData: Object
  },
  created() {
    this.renderTableData = cloneDeep(this.propData)
    this.initData()
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
      }
    }
  },
  methods: {
    initData() {
      if (!this.renderTableData.length) {
        return
      }
      // console.log(this.assetNumData)
      this.assetNumData.accountUserCollect.forEach((nItem) => {
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
      this.coinNumList[2].value =
        this.coinNumList[0].value - this.coinNumList[1].value
      this.renderTableData.forEach((item) => {
        item.update_date = item.update_date ? formatData(item.update_date) : '-'
        // switch(item.trans_type - 0) {
        //   case 0:
        //     item.trans_type_name = '默认'
        //     break
        //   case 1:
        //     item.trans_type_name = '邀请有奖或推荐有礼'
        //     break
        //   case 2:
        //     item.trans_type_name = '完成任务'
        //     break
        //   case 3:
        //     item.trans_type_name = '邀请有奖红包'
        //     break
        //   case 4:
        //     item.trans_type_name = '提现'
        //     break
        //   case 5:
        //     item.trans_type_name = '小熊币兑换 宝石兑换'
        //     break
        //   case 6:
        //     item.trans_type_name = '学习奖励'
        //     break
        // }
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
