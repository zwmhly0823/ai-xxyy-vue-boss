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
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
    >
      <el-table-column label="商品信息" prop="product_name" width="200">
        <template slot-scope="scope">
          {{ scope.row.center_product_code }}<br />
          {{ scope.row.product_name }}
        </template>
      </el-table-column>
      <el-table-column label="物流类型" prop="product_name">
        <template slot-scope="scope">
          <div>
            {{ sourceData[scope.row.source_type] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="收货人信息" width="250">
        <template slot-scope="scope">
          <div>
            {{ `${scope.row.receipt_name}-${scope.row.receipt_tel}` }}<br />
            {{
              `${scope.row.province}-${scope.row.city}-${scope.row.area}-${scope.row.address_detail}`
            }}
          </div>
          <div>
            <el-button
              v-show="
                scope.row.id === current.id &&
                  scope.row.address_id !== '0' &&
                  scope.row.express_status === '6'
              "
              icon="el-icon-edit"
              size="mini"
              type="primary"
              plain
              @click="editAddress(scope.row)"
              >修改地址</el-button
            >
          </div>
          <div>
            <el-button
              v-show="
                scope.row.id === current.id && scope.row.address_id === '0'
              "
              icon="el-icon-edit"
              size="mini"
              type="primary"
              plain
              @click="editAddress(scope.row)"
              >填写地址</el-button
            >
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
    <!-- 待审核修改地址弹框 -->
    <div v-if="address_id !== '0'">
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="showModifyAddress"
        width="30%"
        title="修改收货信息"
      >
        <modify-address
          @modifyAddressExpress="modifyAddressExpress"
          :modifyFormData="modifyFormData"
          :showChoiceModel="false"
          v-if="showModifyAddress"
        />
      </el-dialog>
    </div>
    <!-- 无地址页面修改地址弹框 -->
    <div v-if="address_id === '0'">
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="showModifyAddress"
        width="30%"
        title="新增收货信息"
      >
        <logisticsForm
          @addExpress="modifyAddressExpress"
          :formData="modifyFormData"
          v-if="showModifyAddress"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import modifyAddress from '@/pages/music_app/views/studentTeam/components/TabPane/components/modifyAddress'
import logisticsForm from '@/pages/music_app/views/studentTeam/components/TabPane/components/logisticsForm'
export default {
  name: 'logistics',
  props: {
    Tabledata: {}
  },
  components: {
    modifyAddress,
    logisticsForm
  },
  mounted() {},
  data() {
    return {
      address_id: '',
      modifyFormData: {},
      showModifyAddress: false,
      current: {},
      statusList: [6, 7, 9],
      sourceData: {
        0: '活动物流',
        1: '随材物流',
        2: '随材物流',
        3: '随材物流',
        4: '赠品物流',
        5: '补发物流',
        7: '兑换物流',
        8: '兑换物流'
      }
    }
  },
  methods: {
    // 鼠标进入显示操作栏
    handleMouseEnter(row) {
      console.log(row, row.address_id)
      this.current = row
    },
    handleMouseLeave(row) {
      this.current = {}
      console.log(row, row.address_id)
    },
    // 修改地址
    editAddress(rowData) {
      this.address_id = rowData.address_id
      const id = rowData.id
      const userid = rowData.user && rowData.user.id
      const orderid = rowData.order_id
      const modifyFormData = {
        id,
        userid,
        orderid,
        row: { ...rowData, mobile: rowData.receipt_tel }
      }
      this.modifyFormData = modifyFormData
      this.showModifyAddress = true
    },
    modifyAddressExpress(data) {
      this.showModifyAddress = false
      if (data === 1) {
        this.$emit('reqgetOrderPage')
      } else {
        this.modifyFormData = {}
      }
    },
    goTrack(val) {
      console.log(111, val)
      this.$emit('goTrack', val)
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped></style>
