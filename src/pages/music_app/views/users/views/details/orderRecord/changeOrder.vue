<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-11-20 18:10:48
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-02-06 16:59:22
-->
<template>
  <div>
    <el-table
      :data="Tabledata"
      style="width: 100%"
      :header-cell-style="{ background: '#f0f9fc' }"
    >
      <el-table-column label="订单业务类型">
        <template slot-scope="scope">
          <div>{{ scope.row.regtype_text }}</div>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="ctime"> </el-table-column>
      <el-table-column label="商品信息">
        <template slot-scope="scope">
          <div>
            {{ scope.row.packages_name ? scope.row.packages_name : '-' }}
          </div>
          <div>{{ scope.row.amount >= 0 ? scope.row.amount : '-' }}个</div>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          <div>{{ turnPayType(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="消耗">
        <template slot-scope="scope">
          <div>{{ turnPayNum(scope.row) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <div>{{ scope.row.order_status ? scope.row.order_status : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="out_trade_no" width="220">
      </el-table-column>

      <!-- <el-table-column label="最新物流状态">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.express && scope.row.express.last_express_status
                ? scope.row.express.last_express_status
                : '暂无物流记录'
            }}
          </div>
        </template>
      </el-table-column> -->

      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <div>
              <span
                class="logistics"
                style="color:#0099FF"
                @click="showExpressDetail(scope.row)"
                >物流追踪</span
              >
            </div>
            <!-- <div>
              共
              <span
                v-if="scope.row.express && scope.row.express.express_total"
                class="logistics"
                >{{ scope.row.express.express_total }}</span
              >
              <span v-else>0</span>
              条物流记录
            </div> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'logistics',
  components: {},
  mounted() {},
  props: {
    Tabledata: {}
  },
  data() {
    return {}
  },

  methods: {
    showExpressDetail(val) {
      this.$emit('goTrack', val)
    },
    turnPayType(val) {
      if (+val.regtype === 4) {
        return '宝石'
      } else if (+val.regtype === 5 && +val.topic_id < 10) {
        return '小熊币'
      } else if (+val.regtype === 6) {
        return '赠送'
      } else {
        return '人民币'
      }
    },
    turnPayNum(val) {
      if (+val.regtype === 4) {
        return `${val.amount}个宝石`
      } else if (+val.regtype === 5 && +val.topic_id < 10) {
        return `${val.amount}个小熊币`
      } else if (+val.regtype === 6) {
        return '--'
      } else {
        return `${val.amount}人民币`
      }
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.logistics {
  cursor: pointer;
}
</style>
