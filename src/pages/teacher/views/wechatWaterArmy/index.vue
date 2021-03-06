<!--
 * @Descripttion: 水军微信管理
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-26 16:56:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-29 11:49:13
-->
<template>
  <div class="water-army d-flex column">
    <div class="water-army-header d-flex align-center justify-between">
      <search @search="getSearch" />
      <el-button type="primary" size="mini" @click="handleAddWechat"
        >新增微信</el-button
      >
    </div>
    <div class="water-army-container flex-1">
      <basics-table
        ref="table"
        :table="table"
        :loading="loading"
        :list="dataList"
        :get-list="getDataList"
        :columns="columns"
        :list-query="listQuery"
      >
        <template slot-scope="scope" slot="weixin">
          <div class="d-flex align-center">
            <div class="head">
              <img :src="scope.row.headUrl || defaultHead" />
            </div>
            <div class="">{{ scope.row.weixinNo || '-' }}</div>
          </div>
        </template>
        <template slot-scope="scope" slot="handle">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </basics-table>
    </div>

    <modify-wechat
      ref="modifyWechat"
      :current="currentWechat"
      @success="handleReset"
      @close="handleClose"
    />
  </div>
</template>

<script>
import defaultHead from './assets/touxiang.png'
import BasicsTable from '@/components/BasicsTable'
import Search from './components/Search.vue'
import ModifyWechat from './components/ModifyWechat.vue'
import columns from './columns'
export default {
  components: {
    BasicsTable,
    Search,
    ModifyWechat
  },
  data() {
    return {
      defaultHead,
      loading: false,
      columns,
      table: { stripe: false, border: false },
      dataList: [],
      listQuery: {
        currentPage: 1,
        totalElements: 0,
        totalPages: 0,
        pageSize: 20,
        pageSizeArr: [20, 50, 100, 200, 500]
      },
      currentWechat: null,
      searchParams: {},
      showEdit: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getSearch(res) {
      this.searchParams = res
      this.handleReset()
    },

    handleReset() {
      Object.assign(this.listQuery, { currentPage: 1 })
      this.getDataList()
    },

    getDataList(
      currentPage = this.listQuery.currentPage,
      pageSize = this.listQuery.pageSize
    ) {
      Object.assign(this.listQuery, { currentPage, pageSize })
      this.loading = true
      this.$http.Teacher.getWaterArmyPage(
        this.searchParams,
        currentPage,
        pageSize
      )
        .then((res) => {
          const { content = [], totalElements = 0, totalPages = 1 } = res || {}
          console.log(content)
          this.dataList = content
          Object.assign(this.listQuery, {
            totalPages: +totalPages,
            totalElements: +totalElements
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 新增微信
    handleAddWechat() {
      this.currentWechat = null
      this.$refs.modifyWechat.visible = true
      this.$refs.modifyWechat.key = Date.now()
    },

    // 编辑
    handleEdit(row) {
      this.currentWechat = row
      this.$refs.modifyWechat.visible = true
    },

    handleClose() {
      this.currentWechat = null
    }
  }
}
</script>

<style lang="scss" scoped>
.water-army {
  padding: 10px 10px 0 10px;
  height: calc(100vh - 90px);
  overflow: auto;
  &-header,
  &-container {
    background-color: #fff;
  }
  &-header {
    padding: 10px;
    margin-bottom: 10px;
  }

  .head {
    margin-right: 5px;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }

  ::v-deep {
    .online {
      color: #52c41b;
    }
    .unknown {
      color: #6594ee;
    }
    .downline {
      color: #333;
    }
    .el-table__header th {
      padding: 10px 0;
      background-color: #fff;
    }
  }
}
</style>
