<!--
 * @Author: liuzhiyuan
 * @LastEditors: liuzhiyuan
-->
<template>
  <div class="contract-app">
    <div class="contract-search">
      <el-form :inline="true" label-position="right" label-width="70px">
        <el-form-item>
          <contract-name name="name" @result="getContract('name', arguments)" />
        </el-form-item>
        <el-form-item>
          <contract-bodys
            name="body"
            @result="getContract('body', arguments)"
          />
        </el-form-item>
        <!-- <el-form-item>
          <contract-id
            name="number"
            @result="getContract('number', arguments)"
          />
        </el-form-item> -->
        <el-form-item label="合同类型:">
          <el-select
            clearable
            style="width:100px"
            size="mini"
            placeholder="请选择"
            v-model="searchQuery.contractType"
            @change="getContract('contractType', arguments)"
          >
            <el-option
              v-for="item in contractTypeList"
              :key="item.id"
              :label="item.describe"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:">
          <datePicker name="time" @result="getContract('time', arguments)" />
        </el-form-item>
        <el-button
          type="primary"
          size="mini"
          style="margin-top:5px"
          @click="link('0')"
          >创建合同</el-button
        >
      </el-form>
    </div>
    <div class="contract-body">
      <basics-table
        ref="table"
        :table="table"
        :loading="loading"
        :list="contractList"
        :get-list="getTableList"
        :columns="columns"
        :list-query="listQuery"
      >
        <template slot-scope="scope" slot="index">
          {{ scope.$index + 1 + +num * listQuery.pageSize }}
        </template>
        <template slot-scope="scope" slot="before">
          <p v-if="scope.row.contractPriceDetailList.length === 0">-</p>
          <p
            v-else
            v-for="(item, index) in scope.row.contractPriceDetailList"
            :key="index"
          >
            {{ item.packageName + ' ' + item.contractPrice }}
          </p>
        </template>
        <template slot-scope="scope" slot="now">
          <p v-if="scope.row.contractPriceDetailList.length === 0">-</p>
          <p
            v-else
            v-for="(item, index) in scope.row.contractPriceDetailList"
            :key="index"
            :style="{
              color: item.priceType == 'DISCOUNT' ? '#2E8B57' : '#606266'
            }"
          >
            <!-- DISCOUNT 为绿色 -->
            {{ item.packageName + ' ' + item.settlePrice }}
          </p>
        </template>
        <template slot-scope="scope" slot="store">
          <p v-if="scope.row.contractPriceDetailList.length === 0">-</p>
          <p
            v-else
            v-for="(item, index) in scope.row.contractPriceDetailList"
            :key="index"
            :style="{
              color: item.priceType == 'DISCOUNT' ? '#2E8B57' : '#606266'
            }"
          >
            {{ item.packageName + ' ' + item.orderPrice }}
          </p>
        </template>

        <template slot-scope="scope" slot="handle">
          <el-link
            type="primary"
            :underline="false"
            style="margin-right:8px;"
            @click="link('1', scope.row.contract.id)"
            >详情</el-link
          >
          <el-link
            type="primary"
            style="margin-right:8px;"
            :underline="false"
            @click="del(scope.row)"
            >删除</el-link
          >
          <el-link
            type="primary"
            style="margin-right:8px;"
            :underline="false"
            @click="link('2', scope.row.contract.id)"
            >编辑</el-link
          >
          <br />
          <el-link
            type="primary"
            :underline="false"
            @click="handleLink(scope.row)"
            >临时价格配置</el-link
          >
        </template></basics-table
      >
    </div>
    <!-- 详情 -->
    <contract-drawer
      :tit="title"
      :drawerContract="drawerShow"
      :packageOperation="packageOperation"
      @closedrawer="closeDrawer"
    >
    </contract-drawer>
  </div>
</template>
<script>
import { formatData } from '@/utils/index'
import contractName from '@/components/MSearch/searchItems/contractName'
import contractBodys from '@/components/MSearch/searchItems/contractBodys'
// import contractId from '@/components/MSearch/searchItems/contractId'
import BasicsTable from '@/components/BasicsTable'
import datePicker from '@/components/MSearch/searchItems/datePicker.vue'
import contractDrawer from '../components/contractDrawer'
import columns from '../components/clumns/contractPage'

export default {
  components: {
    contractName,
    contractBodys,
    // contractId,
    BasicsTable,
    contractDrawer,
    datePicker
  },
  data() {
    return {
      contractTypeList: [], // 合同类型
      packageOperation: {}, // 操作套餐抽屉数据
      // 滑块title
      drawerShow: false,
      title: '临时价格配置', // 配置结算价格
      table: { stripe: true, border: false },

      columns,
      contractList: [], // 表格数据
      searchQuery: {
        name: '',
        body: '',
        contractType: '',
        beginTime: '',
        endTime: ''
      },
      loading: false,
      num: 0,
      listQuery: {
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        pageSize: 15
      }
    }
  },
  methods: {
    closeDrawer() {
      this.drawerShow = false
      // 关闭抽屉，刷新列表
      this.getTableList()
    },
    // 新增0，详情1，编辑2
    link(val, id = '') {
      this.$router.push({
        path: '/contractManageAdd',
        query: { flag: val, id }
      })
    },
    // 删除
    del(val) {
      if (val.contract.id) {
        this.$confirm('是否确认删除此条合同！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            this.loading = true
            try {
              const res = await this.$http.Express.deleteContractById(
                val.contract.id
              )

              if (res.code === 0) {
                this.$message.success('删除成功')
                this.getTableList()
              }
            } catch (err) {
              console.log(err)
            } finally {
              this.loading = false
            }
          })
          .catch((e) => {
            console.log('取消')
          })
      } else {
        this.$message.error('合同id错误')
      }
    },
    // 配置价格
    handleLink(val) {
      if (val.contract.id) {
        this.drawerShow = true
        // 抽屉数据
        this.packageOperation = val
      }
    },
    // 合同查询
    getContract(key, res) {
      const search = res && res[0]
      if (search) {
        if (key === 'time') {
          // 选择日期
          this.searchQuery = {
            ...this.searchQuery,
            beginTime: formatData(res[0].time.gte, 's'),
            endTime: formatData(res[0].time.lte, 's')
          }
        } else {
          this.searchQuery = {
            ...this.searchQuery,
            ...search
          }
        }
      } else {
        if (key === 'time') {
          this.searchQuery.beginTime = this.searchQuery.endTime = ''
        }
        this.searchQuery[key] = ''
      }
      this.getTableList()
    },
    getTableList(page = 1, size = 15) {
      this.loading = true
      this.$http.Express.getContracts(this.searchQuery, {
        page: (this.listQuery.currentPage = page),
        size: (this.listQuery.pageSize = size)
      })
        .then((res) => {
          const { content, totalElements = 0, totalPages = 0, number } =
            res?.payload || {}
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
          this.contractList = content
          this.num = number // 序号
          Object.assign(this.listQuery, {
            totalElements: +totalElements,
            totalPages: +totalPages
          })
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.loading = false
        })
    },
    getChannelType() {
      // 获取渠道类型
      this.$http.Express.getContractInfo()
        .then((res) => {
          if (res.code === 0 && res.payload?.contractTypeList) {
            this.contractTypeList = res.payload?.contractTypeList
          }
        })
        .then(this.getTableList())
    }
  },
  created() {
    this.getChannelType()
  }
}
</script>

<style lang="scss" scoped>
.contract-app {
  padding: 10px;
  .contract-search {
    background-color: #fff;
    padding: 10px 20px;
    margin-bottom: 10px;
  }
  .contract-body {
    margin-bottom: 30px;
    .el-table .has-gutter {
      background-color: #fff;
    }
  }
}
</style>
