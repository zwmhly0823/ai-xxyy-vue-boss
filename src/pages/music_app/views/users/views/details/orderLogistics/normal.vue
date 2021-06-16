<!--
 * @Descripttion:
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-11-23 20:59:38
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-12-04 20:09:01
-->
<template>
  <div>
    <el-table
      :header-cell-style="{ background: '#f0f9fc' }"
      :data="Tabledata"
      style="width: 100%"
    >
      <el-table-column label="商品信息" prop="product_name" width="200">
        <template slot-scope="scope">
          {{ scope.row.center_product_code }}<br />
          {{ scope.row.product_name }}
        </template>
      </el-table-column>
      <el-table-column label="商品类型" prop="product_name">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.product_type_text ? scope.row.product_type_text : '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收货人信息" width="250">
        <template slot-scope="scope">
          <div>
            <p style="display: flex">
              <span> {{ `${scope.row.receipt_name}` }}<br /> </span>
              <span style="color: #2a75ed">
                {{ scope.row.receipt_tel }}
              </span>
              <span>
                <i
                  v-if="scope.row.receipt_tel"
                  style="margin-left: 10px; color: #2a75ed"
                  class="el-icon-view mg-l-5 trail"
                  @click="getNumber(scope.row.id)"
                ></i>
              </span>
            </p>

            <p>
              {{
                `${scope.row.province}-${scope.row.city}-${scope.row.area}-${scope.row.address_detail}`
              }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物流状态" prop="express_status_text">
      </el-table-column>
      <el-table-column label="备注" prop="express_remark">
        <template slot-scope="scope">
          <span
            v-if="
              statusList.indexOf(+scope.row.express_status) > -1 &&
              scope.row.express_remark
            "
          >
            {{ scope.row.express_remark }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="物流信息" prop="express_company" width="200">
        <template slot-scope="scope">
          物流公司：{{
            scope.row.express_company ? scope.row.express_company : '-'
          }}
          <br />
          快递单号：{{ scope.row.express_nu ? scope.row.express_nu : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="物流时效" width="200">
        <template slot-scope="scope">
          创建：{{ scope.row.ctime }} <br />
          审核：{{ scope.row.center_ctime }} <br />
          揽收：{{ scope.row.delivery_collect_time }} <br />
          签收：{{ scope.row.signing_time }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span style="color: #3a8ee6" @click="goTrack(scope.row)">追踪</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'logistics',
  props: {
    Tabledata: [],
  },
  components: {},
  mounted() {
    this.operatorId = JSON.parse(localStorage.getItem('staff')).id
  },
  data() {
    return {
      statusList: [6, 7, 9],
      regData: {
        0: '体验课盒子随材',
        1: '系统课盒子随材',
        2: '小熊商城',
        3: '推荐有礼',
        4: '邀请有奖', // 宝石兑换
        5: '补货商品', // 积分兑换
        6: '关单赠品', // 赠送
        7: '转介绍',
        8: '兑吧',
        9: '转盘，抽奖',
        10: '市场活动',
      },
      operatorId: '',
    }
  },
  methods: {
    //获取学生号码
    getNumber(uid, type) {
      this.$http.User.getExpressrPhoneNumber({
        uid: uid,
        teacherId: this.operatorId,
      }).then((res) => {
        if (res.code == 0) {
          this.Tabledata.forEach((item, index) => {
           if (item.id == uid) {
              this.Tabledata[index].receipt_tel = res.payload.mobile
            }
          })
        } else {
          this.$message.error('网络异常，请稍后再试！')
        }
      })
    },
    goTrack(val) {
      this.$emit('goTrack', val)
    },
  },
  computed: {},
}
</script>

<style lang="scss" scoped></style>
