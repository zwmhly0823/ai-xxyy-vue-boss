<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: shasen
 * @Date: 2021-01-19 17:20:01
 * @LastEditors: shasen
 * @LastEditTime: 2021-01-19 17:20:01
-->
<template>
  <div>
    <el-button
      class="addaddress"
      type="primary"
      size="mini"
      plain
      @click="addAddress"
      >新增地址</el-button
    >
    <ele-table
      :tableSize="'small'"
      :dataList="tableData"
      :tableHeight="tableHeight"
      :size="tabQuery.size"
      :page="tabQuery.page"
      :total="totalElements"
      :showAllTotalNum="true"
      :headerRowClasFn="headerRowClasFn"
      class="mytable"
    >
      <el-table-column label="收货人" min-width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.receiptName }}
        </template>
      </el-table-column>
      <el-table-column label="收货电话" min-width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.receiptTel }}
        </template>
      </el-table-column>
      <el-table-column label="收货地址" min-width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area
          }}{{ scope.row.addressDetail }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="120" align="center">
        <template slot-scope="scope">
          {{ formatDate(scope.row.ctime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="changeAddress(scope.row)"
            >修改</el-button
          >

          <el-button
            v-if="scope.row.isDefault === 1"
            type="warning"
            size="mini"
            plain
            >默认地址</el-button
          >
          <el-button
            v-else
            type="text"
            style="width:80px!important;"
            @click="setDefaultAddress(scope.row)"
            >设为默认</el-button
          >
        </template>
      </el-table-column>
    </ele-table>
    <!-- 新增修改地址 -->
    <el-dialog
      width="500px"
      :title="title"
      :visible.sync="addChangeAddress"
      append-to-body
      destroy-on-close
      v-if="addChangeAddress"
    >
      <addChangeAddress
        @closeAddChangeAddress="closeAddChangeAddress"
        :echoAddress="echoAddress"
      />
    </el-dialog>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
import addChangeAddress from '../addressComponents/addChangeAddress.vue'
import { formatData } from '@/utils/index'
export default {
  name: 'harvestAddress',
  components: {
    EleTable,
    addChangeAddress
  },
  data() {
    return {
      tableHeight: '200',
      tableData: [],
      tabQuery: {
        size: 20,
        page: 1
      },
      totalElements: 0,
      addChangeAddress: false,
      userID: '',
      title: '新增收货信息',
      echoAddress: {}
    }
  },
  mounted() {
    this.userId = this.$route.params.id
    this.getAddressList()
  },
  methods: {
    // 获取地址列表
    getAddressList() {
      const params = {
        userId: this.userId
      }
      this.$http.User.getAddressList(params).then((res) => {
        const payload = res.payload
        if (payload) {
          this.tableData = payload
        }
      })
    },
    // 新增地址弹窗
    addAddress() {
      if (this.tableData.length >= 10) {
        this.$message({
          message: '收货地址已达上限',
          type: 'error'
        })
      } else {
        this.title = '新增收货地址'
        this.echoAddress = {}
        this.addChangeAddress = true
      }
    },
    // 修改
    changeAddress(row) {
      this.title = '修改收货地址'
      this.echoAddress = row
      this.addChangeAddress = true
    },
    // 设置默认地址
    setDefaultAddress(row) {
      this.$confirm('是否设为默认收货地址', '提示', {
        type: 'warning'
      })
        .then(() => {
          const params = {
            addressId: row.id,
            userId: row.userId
          }
          this.$http.User.updateDefaultAddress(params).then((res) => {
            if (res?.code === 0) {
              this.$message.success('操作成功')
              setTimeout(() => {
                this.getAddressList()
              }, 1000)
              setTimeout(() => {
                this.$emit('modifyAddressExpress')
              }, 5000)
            }
          })
        })
        .catch(() => {})
    },
    // 关闭closeAddChangeAddress弹窗
    closeAddChangeAddress() {
      this.addChangeAddress = false
      this.getAddressList()
      setTimeout(() => {
        this.$emit('modifyAddressExpress')
      }, 5000)
    },
    // 时间转化
    formatDate(date, flag = 's') {
      return formatData(date, flag)
    },
    // 自定义thead样式
    headerRowClasFn() {
      return 'header-row-class'
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .header-row-class th {
  background: #f5f7fa;
  height: 50px;
  text-align: center;
}
.addaddress {
  margin-bottom: 20px;
}
</style>
