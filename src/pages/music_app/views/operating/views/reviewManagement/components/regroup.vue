<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-06-10 14:38:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-17 11:16:25
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
            label="用户手机号:"
            label-position="right"
            label-width="150px"
          >
            <el-input
              clearable
              placeholder="请键入用户手机号进行查询"
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
      <el-table :data="tableData" v-loading="loading">
        <el-table-column label="用户信息" prop="user" min-width="180" fixed>
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
        <el-table-column label="业绩归属老师" min-width="220">
          <template slot-scope="scope">
            <!-- 续费情况  v-if="scope.row.regtype && scope.row.regtype !== 3" -->
            <div>
              <p>
                {{ scope.row.salesman ? scope.row.salesman.realname : '-' }}
                <span
                  v-if="trialTeamUid[scope.row.uid]"
                  :class="{
                    'primary-text': trialTeamUid[scope.row.uid].team_name,
                  }"
                  @click="
                    openDetail(trialTeamUid[scope.row.uid].id, scope.row, 0)
                  "
                  >（{{
                    courseLevelReplace(trialTeamUid[scope.row.uid].team_name)
                  }}）</span
                >
                <span v-else>-</span>
              </p>
              <p>
                {{
                  scope.row.salesman
                    ? scope.row.salesman.area_name ||
                      scope.row.salesman.department_name ||
                      scope.row.salesman.group_name
                      ? scope.row.salesman.group_name ||
                        scope.row.salesman.department_name ||
                        scope.row.salesman.area_name
                      : '-'
                    : '-'
                }}
              </p>
            </div>
            <!-- <div v-else>
            <p>-</p>
            <p>-</p>
          </div>-->
          </template>
        </el-table-column>
        <el-table-column label="服务老师" min-width="180">
          <template slot-scope="scope">
            <!-- 非续费 v-if="scope.row.regtype !== 3" -->
            <div>
              <p>
                {{ scope.row.teacher ? scope.row.teacher.realname : '-' }}
                <span
                  :class="{ 'primary-text': scope.row.team }"
                  @click="openDetail(scope.row.team.id, scope.row, 2)"
                  >({{
                    scope.row.team
                      ? courseLevelReplace(scope.row.team.team_name)
                      : '-'
                  }})</span
                >
              </p>
              <p>
                {{
                  scope.row.teacher
                    ? scope.row.teacher.area_name ||
                      scope.row.teacher.department_name ||
                      scope.row.teacher.group_name
                      ? scope.row.teacher.group_name ||
                        scope.row.teacher.department_name ||
                        scope.row.teacher.area_name
                      : '-'
                    : '-'
                }}
              </p>
            </div>
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

        <el-table-column label="推荐人信息" min-width="120">
          <template slot-scope="scope">
            <p
              v-if="scope.row.first_send_user"
              :class="{ 'primary-text': scope.row.first_send_user }"
              @click="openUserDetail(scope.row.first_send_user.id)"
            >
              {{
                scope.row.first_send_user
                  ? scope.row.first_send_user.username
                  : '-'
              }}
            </p>
            <p>
              {{
                scope.row.first_send_user
                  ? scope.row.first_send_user.mobile
                  : '-'
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="orderTimeLabel" min-width="180">
          <template slot-scope="scope">
            <p v-if="status === '3'">
              {{ scope.row.buytime ? scope.row.buytime : '-' }}
            </p>
            <p v-else>{{ scope.row.ctime ? scope.row.ctime : '-' }}</p>
            <p>
              {{
                scope.row.out_trade_no
                  ? scope.row.out_trade_no.replace('xiong', '')
                  : '-'
              }}
            </p>
          </template>
        </el-table-column>
       <el-table-column label="订单状态" min-width="80">
          <template slot-scope="scope">{{
            scope.row.order_status ? scope.row.order_status : '-'
          }}</template>
        </el-table-column>
        <el-table-column label="关联订单类型及订单号" min-width="180">
          <template slot-scope="scope">
            <p>
              {{
                scope.row.associated_order_regtype === 1 ? '预付款优惠券' : '-'
              }}
            </p>
            <p>
              {{
                scope.row.associated_order_out_trade_no
                  ? scope.row.associated_order_out_trade_no
                  : '-'
              }}
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="tableData.length === 0" class="noData">暂无数据</div>
    </div>
  </section>
</template>

<script>
import { timestamp } from '@/utils/index'
export default {
  data() {
    return {
      timestamp,
      cellphone: '',
      tableData: [],
    }
  },
  watch: {
    // cellphone: {
    //   immediate: true,
    //   deep: true,
    //   async handler(newValue) {
    //     if (!newValue) {
    //       this.tableData = []
    //     }
    //     if (newValue.length === 11 && Number.isInteger(Number(newValue))) {
    //       const { code, payload } = await this.$http.Order.orderPage(
    //         newValue
    //       ).catch((err) => {
    //         console.info(err)
    //         this.$message({
    //           message: '接口报错',
    //           type: 'error',
    //         })
    //         this.tableData = []
    //       })
    //       if (!code && payload.length !== 0) {
    //         this.tableData = payload
    //       } else {
    //         this.$message({
    //           message: '数据获取失败',
    //           type: 'warning',
    //         })
    //         this.tableData = []
    //       }
    //     }
    //   },
    // },
  },
  created() {
    // this.$http.Operating.getVerification('13512345678')
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
