<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-10 14:38:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-19 10:35:37
-->
<template>
  <section class="bianju10">
    <div class="seartch_item">
      <div class="tips_system">注意:系统课请先删除已有物流！</div>
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
        <el-table-column label="用户信息" prop="user" width="150">
          <template slot-scope="scope">
            <user
              courseType="system"
              :user="scope.row.user"
              :singleData="scope.row"
            />
          </template>
        </el-table-column>
        <el-table-column label="归属地" prop="QCellCore" width="150">
          <template slot-scope="scope">
            <p>
              {{ scope.row.user ? scope.row.user.mobile_province || '-' : '-' }}
              ·
              {{ scope.row.user ? scope.row.user.mobile_city || '-' : '-' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" width="120">
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
        <el-table-column label="商品信息" width="200">
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
        <el-table-column label="订单来源" width="100">
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
            <el-button
              v-if="!scope.row.team"
              @click="handleClick(scope.row)"
              type="text"
              size="small"
              >重新分班</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span style="white-space: pre-line">您确定要重新分班吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="regroupClick">确 定</el-button>
        </span>
      </el-dialog>
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
      dialogVisible: false,
      tableData: [],
      queryObj: {},
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
        let queryObj = {}
        if (newValue) {
          queryObj.out_trade_no = newValue
          const { data } = await this.$http.Order.orderPage(
            `${JSON.stringify(queryObj)}`,
            1
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
    async handleClick(row) {
      this.dialogVisible = true
      this.queryObj.orderId = row.id
      this.queryObj.operatorId = JSON.parse(
        window.localStorage.getItem('staff')
      ).id
    },
    handleClose(done) {
      done()
    },
    async regroupClick() {
      let result = await this.$http.Order.getRegrounpreSendOrder(this.queryObj)
      if (result.code == 0) {
        this.$message.success('分班成功')
        this.dialogVisible = false
      } else {
        this.dialogVisible = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bianju10 {
  padding: 10px;
  color: #fff;
}
.tips_system {
  background-color: #f56c6c;
  width: 400px;
  height: 50px;
  border-radius: 10px;
  line-height: 50px;
  text-align: center;
  margin: 0 auto;
  font-size: 22px;
  transform: translate(0,15px);
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
