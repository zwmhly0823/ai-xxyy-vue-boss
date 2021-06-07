<!--
 * @Author: your name
 * @Date: 2021-02-25 19:01:02
 * @LastEditTime: 2021-05-10 11:47:09
 * @LastEditors: liuzhiyuan
 * @Description: In User Settings Edit
 * @FilePath: /ai-app-vue-boss/src/pages/marketing/views/wechatGroupsend/sendDetail.vue
-->
<template>
  <div class="senddetail">
    <div class="senddetail-search">
      <el-form :inline="true" label-position="right" label-width="80px">
        <el-form-item>
          <contract-name name="name" @result="getContract('name', arguments)" />
        </el-form-item>
        <el-form-item>
          <contract-bodys
            name="body"
            @result="getContract('body', arguments)"
          />
        </el-form-item>
        <el-form-item label="合同类型:">
          <el-select
            clearable
            style="width: 100px"
            size="mini"
            placeholder="请选择"
            v-model="searchQuery.contractType"
            @change="getData"
          >
            <el-option
              v-for="item in contractTypeList"
              :key="item.id"
              :label="item.describe"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="listDom"
      :data="contractList"
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column prop="contract.id" label="合同ID" width="80">
      </el-table-column>
      <el-table-column prop="contract.contractName" label="合同名称">
      </el-table-column>
      <el-table-column prop="contract.contractBody" label="对方合同主体全称">
      </el-table-column>
      <el-table-column
        prop="contractPriceDetailList"
        label="合同结算课单价（元）"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.contractPriceDetailList.length === 0">-</p>
          <p
            v-else
            v-for="(item, index) in scope.row.contractPriceDetailList"
            :key="index"
          >
            {{ item.packageName + ' ' + item.contractPrice }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="contractPriceDetailList"
        label="实际结算课单价（元）"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.contractPriceDetailList.length === 0">-</p>
          <p
            v-else
            v-for="(item, index) in scope.row.contractPriceDetailList"
            :key="index"
            :style="{
              color: item.priceType == 'DISCOUNT' ? '#2E8B57' : '#606266',
            }"
          >
            <!-- DISCOUNT 为绿色 -->
            {{ item.packageName + ' ' + item.settlePrice }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="contractPriceDetailList"
        label="订单入库价格（元）"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.contractPriceDetailList.length === 0">-</p>
          <p
            v-else
            v-for="(item, index) in scope.row.contractPriceDetailList"
            :key="index"
            :style="{
              color: item.priceType == 'DISCOUNT' ? '#2E8B57' : '#606266',
            }"
          >
            {{ item.packageName + ' ' + item.orderPrice }}
          </p>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 40px">
      <el-pagination
        style="margin-top: 10px; float: right"
        @current-change="handleCurrentChange"
        :current-page="listQuery.currentPage"
        layout="prev, pager, next, total"
        :total="listQuery.totalElements"
      >
      </el-pagination>
    </div>
    <div class="btn-group">
      <el-button size="mini" @click="prevSteps">取消</el-button>
      <el-button size="mini" type="primary" @click="submitContract"
        >提交</el-button
      >
    </div>
  </div>
</template>
<script>
import { formatData } from '@/utils/index'
import contractName from '@/components/MSearch/searchItems/contractName'
import contractBodys from '@/components/MSearch/searchItems/contractBodys'
// import contractId from '@/components/MSearch/searchItems/contractId'
export default {
  name: 'contractDialog',
  props: {
    dateId: {
      type: Object,
    },
  },
  components: { contractName, contractBodys },
  data() {
    return {
      contractTypeList: [], // 合同类型
      multipleSelection: [],
      searchQuery: {
        name: '',
        body: '',
        number: '',
        contractType: '',
        beginTime: '',
        endTime: '',
      },
      loading: false,
      contractList: [], // 表格数据
      // 分页
      listQuery: {
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        pageSize: 15,
      },
    }
  },
  mounted() {},
  computed: {},
  watch: {
    // dateId: {
    //   handler(val) {
    //     if (val.id) {
    //       this.getData()
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    // 提交选中
    submitContract() {
      this.$emit('getData', this.multipleSelection)
      console.log(this.multipleSelection)
    },
    // 取消
    prevSteps() {
      this.$emit('close')
    },
    // 合同查询// 合同查询
    getContract(key, res) {
      const search = res && res[0]
      if (search) {
        if (key === 'contractType') {
          // 合同分类
          this.searchQuery = {
            ...this.searchQuery,
            [key]: res,
          }
        } else {
          if (key === 'time') {
            // 选择日期
            this.searchQuery = {
              ...this.searchQuery,
              beginTime: formatData(res[0].time.gte, 's'),
              endTime: formatData(res[0].time.lte, 's'),
            }
          } else {
            this.searchQuery = {
              ...this.searchQuery,
              ...search,
            }
          }
        }
      } else {
        if (key === 'time') {
          this.searchQuery.beginTime = ''
          this.searchQuery.endTime = ''
        }
        this.searchQuery[key] = ''
      }
      this.getData()
      console.log('query', this.searchQuery)
    },
    // 选择表格
    handleSelectionChange(val) {
      console.log(val)
      // 控制单选
      if (val.length > 1) {
        this.$refs.listDom.clearSelection()
        this.$refs.listDom.toggleRowSelection(val.pop())
      } else {
        this.multipleSelection = val
      }
    },
    rowClick(val) {
      let arr = []
      arr.push(val)
      this.$refs.listDom.clearSelection()
      this.$refs.listDom.toggleRowSelection(val)
      this.multipleSelection = arr
    },
    async getData() {
      try {
        this.loading = true
        const pages = {
          page: this.listQuery.currentPage,
          size: this.listQuery.pageSize,
        }
        const {
          code,
          payload: { content = [], totalElements = 0, totalPages = 0 },
        } = await this.$http.Express.getContracts(this.searchQuery, pages)
        if (code === 0) {
          // 渠道合同赋值
          if (content && content.length > 0) {
            content.forEach((item) => {
              item.contract.ctime = item.contract.ctime
                ? formatData(item.contract.ctime, 's')
                : '-'
              item.contract.collaboratorName = item.contract.collaboratorName
                ? item.contract.collaboratorName
                : '-'
              item.contract.linkName = item.contract.linkName
                ? item.contract.linkName
                : '-'
              item.contract.linkPhone = item.contract.linkPhone
                ? item.contract.linkPhone
                : '-'
              this.contractTypeList.forEach((item1) => {
                if (item.contract.contractType === item1.name) {
                  item.contract.contractTypeName = item1.describe
                }
              })
            })
          }
          console.log('-', content)
          this.contractList = content
          Object.assign(this.listQuery, {
            totalElements: +totalElements,
            totalPages: +totalPages,
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    // 分页方法
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
      this.getData()
    },
    getChannelType() {
      // 获取渠道类型
      this.$http.Express.getContractInfo()
        .then((res) => {
          if (res.code === 0 && res.payload?.contractTypeList) {
            this.contractTypeList = res.payload?.contractTypeList
          }
        })
        .then(this.getData())
    },
    backClick() {
      this.$router.push('/wechartsendList')
    },
  },
  created() {
    this.getChannelType()
  },
}
</script>

<style lang="scss" scoped>
.senddetail {
  margin: 10px;
  .senddetail-search {
    margin-bottom: 10px;
  }
  .btn-group {
    text-align: center;
    margin: 10px 0;
  }
  /deep/ .el-table__header-wrapper .el-checkbox {
    display: none;
  }
  .btn-group {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
