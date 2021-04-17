<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-10 14:38:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-17 14:15:43
-->
<template>
  <section class="bianju10">
    <div class="seartch_item">
      <div class="title">
        <i class="el-icon-setting"></i>
        <span>查询条件</span>
      </div>
      <div class="seartch_item_z">
        <el-form>
          <el-form-item
            label="订单号:"
            label-position="right"
            label-width="150px"
          >
            <el-input
              clearable
              placeholder="请键入用户订单号"
              v-model="cellphone"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="result_item">
      <div class="title">
        <i class="el-icon-s-data"></i>
        <span>查询结果</span>
      </div>
      <el-table :data="tableData">
        <el-table-column label="用户信息" prop="user" min-width="180">
          <template slot-scope="scope">
            <user
              courseType="system"
              :user="scope.row.user"
              :singleData="scope.row"
            />
          </template>
        </el-table-column>
        <el-table-column label="归属地" prop="QCellCore" min-width="120">
          <template slot-scope="scope">
            <p>
              {{ scope.row.user ? scope.row.user.mobile_province || '-' : '-' }}
              ·
              {{ scope.row.user ? scope.row.user.mobile_city || '-' : '-' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" min-width="80">
          <template slot-scope="scope">
            <p>
              {{
                scope.row.regtype
                  ? +scope.row.regtype === 2
                    ? '首单'
                    : +scope.row.regtype === 3
                    ? '续费'
                    : '-'
                  : '-'
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" min-width="150">
          <template slot-scope="scope">
            <p>
              {{
                scope.row.packages_name
                  ? scope.row.packages_name || '-'
                  : scope.row.product_name || '-'
              }}
            </p>
            <!-- 人民币 ， 宝石，小熊币 -->
            <p>
              {{ scope.row.currency ? scope.row.currency : '人民币 ' }}
              {{
                scope.row.amount
                  ? scope.row.amount
                  : scope.row.regtype === 6
                  ? ''
                  : '-'
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="订单来源" min-width="180">
          <template slot-scope="scope">
            <p>体验课:{{ scope.row.trial_pay_channel_text || '-' }}</p>
            <p>
              系统课:{{
                scope.row.channel ? scope.row.channel.channel_outer_name : '-'
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >重新分班</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import { timestamp } from '@/utils/index'
import User from './User.vue'
export default {
  data() {
    return {
      timestamp,
      cellphone: '',
      tableData: [],
    }
  },
  components: {
    User,
  },
  watch: {
    cellphone: {
      immediate: true,
      deep: true,
      async handler(newValue) {
        if (!newValue) {
          this.tableData = []
        }
        let queryObj = {};
        if (newValue) {
          queryObj.out_trade_no = newValue
          const { data } = await this.$http.Order.orderPage(
            `${JSON.stringify(queryObj)}`,1
          ).catch((err) => {
            console.info(err)
            this.$message({
              message: '接口报错',
              type: 'error',
            })
            this.tableData = []
          })
          if (data.OrderPage.content) {
            this.tableData = data.OrderPage.content
          } else {
            this.$message({
              message: '数据获取失败',
              type: 'warning',
            })
            this.tableData = []
          }
        }
      },
    },
  },
  created() {
    // this.$http.Operating.getVerification('13512345678')
  },
  methods: {
    handleClick(row) {},
  },
}
</script>

<style lang="scss" scoped>
.bianju10 {
  padding: 10px;
}
.seartch_item {
  background-color: #fff;
  margin-bottom: 10px;
}
.seartch_item_z {
  height: 80px;
  display: flex;
  align-items: center;
}
.el-input {
  width: 400px;
}
.result_item {
  background-color: #fff;
}
.title {
  padding-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  font-size: 18px;
  i {
    color: grey;
  }
  span {
    margin-left: 10px;
  }
}
</style>
