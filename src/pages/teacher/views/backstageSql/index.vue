<!--
 * @Descripttion: 水军微信管理
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2021-01-26 16:56:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-25 17:25:14
-->
<template>
  <div class="backstage d-flex column">
    <div class="backstage-header d-flex align-center justify-between">
      <el-button type="primary" size="mini" @click="handleAddWechat"
        >新增数据</el-button
      >
    </div>
    <div class="backstage-container flex-1">
      <basics-table
        ref="table"
        :table="table"
        :loading="loading"
        :list="dataList"
        :get-list="getDataList"
        :columns="columns"
        :list-query="listQuery"
      >
        <template slot-scope="scope" slot="handle">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </basics-table>
    </div>

    <modify-wechat
      ref="modifyWechat"
      :current="currentWechat"
      @success="handleReset"
      @close="handleClose"
    />

    <el-dialog
      width="40%"
      title="删除数据"
      :visible="visible1"
      :close-on-click-modal="false"
      @close="onCloseDelete"
    >
      <div>确定要删除数据吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible1 = false" size="mini">取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="handleSaveDelete"
          size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BasicsTable from '@/components/BasicsTable'
import ModifyWechat from './components/ModifyWechat.vue'
import columns from './columns'
export default {
  components: {
    BasicsTable,
    ModifyWechat,
  },
  data() {
    return {
      loading: false,
      visible1: false,
      columns,
      deleteId: null,
      table: { stripe: false, border: false },
      dataList: [],
      listQuery: {
        currentPage: 0,
        totalElements: 0,
        totalPages: 0,
        pageSize: 20,
        pageSizeArr: [20, 50, 100, 200, 500],
      },
      currentWechat: null,
      showEdit: false,
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    handleReset() {
      Object.assign(this.listQuery, { currentPage: 0 })
      this.getDataList()
    },

    getDataList(
      currentPage = this.listQuery.currentPage,
      pageSize = this.listQuery.pageSize
    ) {
      Object.assign(this.listQuery, { currentPage, pageSize })
      this.loading = true
      this.$http.Teacher.getUpgradeConfigList(currentPage, pageSize)
        .then((res) => {
          const { payload = {} } = res && res
          const { totalElements = 0, totalPages = 1 } = res && res.payload
          console.log(payload, '列表数据')
          this.dataList = payload.content
          Object.assign(this.listQuery, {
            totalPages: +totalPages,
            totalElements: +totalElements,
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
    // 删除
    handleDelete(row) {
      ;(this.deleteId = row.id), (this.visible1 = true)
    },
    handleSaveDelete() {
      this.$http.Teacher.deleteUpgradeConfigList(this.deleteId)
        .then((res) => {
          if (res.code !== 0) {
            return
          }
          this.$message.success('删除成功')
          this.getDataList()
          this.visible1 = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClose() {
      this.currentWechat = null
    },
    onCloseDelete() {
      this.visible1 = false
    },
  },
}
</script>

<style lang="scss" scoped>
.backstage {
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
<style lang="scss">
.el-table__row .cell {
  white-space: pre-line;
}
</style>
