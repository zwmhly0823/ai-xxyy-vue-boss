<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-06-13 10:35:39
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-16 18:26:10
 -->
<template>
  <div class="system-container">
    <div class="content-top">
      <m-search
        @search="handleSearchName"
        teachername="name"
        class="search-container"
      />
      <employees-role
        employees="name"
        @search="handleSearchEmployees"
        class="search-container"
      />
      <el-button
        type="primary"
        class="button"
        size="mini"
        @click="handleAddEmployees('add')"
        >新增员工</el-button
      >
    </div>
    <ele-table
      :dataList="tableData"
      :loading="loading"
      :size="tabQuery.size"
      :page="tabQuery.page"
      :total="totalElements"
      @pageChange="pageChange_handler"
      class="mytable"
    >
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column
        label="真实姓名"
        min-width="80"
        align="center"
        prop="real_name"
      ></el-table-column>
      <el-table-column
        label="手机号"
        min-width="80"
        align="center"
        prop="mobile"
      ></el-table-column>
      <el-table-column
        label="登录账号"
        min-width="80"
        align="center"
        prop="user_name"
      ></el-table-column>
      <el-table-column label="员工角色" min-width="80" align="center">
        <template slot-scope="scope">
          <div v-for="item of roleList" :key="item.id">
            <span>{{ scope.row.role_id === item.id ? item.name : '' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="员工角色" min-width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.is_login === '0' ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="handleAddEmployees(scope.row, 'edit')"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </ele-table>
    <m-pagination
      @current-change="pageChange_handler"
      :current-page="+tabQuery.page"
      :total="totalElements"
      open="calc(100vw - 95px - 100px)"
      close="calc(100vw - 23px - 50px)"
    />
    <Dialog
      v-if="dialogVisible"
      :title="title"
      :dialogVisible="dialogVisible"
      @submit="handleSubmit"
      @cancleDialog="cancleDialog"
      :editItem="editItem"
      ref="dialogForm"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        id: ''
      },
      title: '',
      dialogVisible: false,
      tableData: [],
      loading: false,
      tabQuery: {
        size: 20,
        page: 1
      },
      totalElements: 0,
      handleType: '',
      queryList: [],
      editItem: {}
    }
  },
  created() {
    this.roleList = JSON.parse(localStorage.getItem('roleLit'))
  },
  mounted() {
    this.getStaffList()
  },
  methods: {
    async getStaffList() {
      if (this.queryList.length === 0) {
        this.queryList = `""`
      }
      this.loading = true
      try {
        const res = await this.$http.Teacher.getStaffList(
          this.tabQuery.page,
          this.queryList
        )
        this.tableData =
          res.data.StaffPage.content.length !== 0
            ? res.data.StaffPage.content
            : []
        this.totalElements = +res.data.StaffPage.totalElements
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    handleSearchName(res) {
      this.form.name = res.length !== 0 ? res[0].term.name : ''
      const channelClassid = {
        real_name: this.form.name
      }
      this.queryList =
        res.length !== 0
          ? `${JSON.stringify(JSON.stringify(channelClassid))}`
          : []
      this.getStaffList()
    },
    handleSearchEmployees(res) {
      this.form.id = res.length !== 0 && res[0].term
      const channelClassid = {
        role_id: this.form.id
      }
      this.queryList =
        res.length !== 0
          ? `${JSON.stringify(JSON.stringify(channelClassid))}`
          : []
      this.getStaffList()
    },
    handleAddEmployees(item = '', type) {
      this.editItem = Object.assign({}, item)
      this.handleType = type
      this.title = type === 'add' ? '新增员工' : '编辑员工'
      this.dialogVisible = true
    },
    cancleDialog() {
      this.dialogVisible = false
      this.editItem = {}
    },
    async handleSubmit() {
      const form = this.$refs.dialogForm.form
      const userInfo =
        localStorage.getItem('staff') &&
        JSON.parse(localStorage.getItem('staff'))
      let params = {}
      params.staff = Object.assign({}, form)
      params.staff.id = this.handleType === 'add' ? '' : userInfo.id
      params.role = {}
      params.role.id = form.id
      try {
        const res = await this.$http.Teacher.addStaff(params)
        if (res.code === 0) {
          this.$message.success(`${this.title}成功~`)
          this.dialogVisible = false
        }
      } catch (error) {
        console.log(error)
      }
      params = {}
    },
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getStaffList()
    }
  },
  components: {
    MSearch: () => import('@/components/MSearch/index.vue'),
    employeesRole: () => import('@/components/MSearch/index.vue'),
    Dialog: () => import('./dialog.vue'),
    EleTable: () => import('@/components/Table/EleTable'),
    MPagination: () => import('@/components/MPagination/index.vue')
  }
}
</script>

<style lang="scss" scoped>
.system-container {
  padding: 10px;
  .content-top {
    overflow: hidden;
    .search-container {
      width: 200px;
      background: none !important;
      display: inline-block;
      vertical-align: top;
    }
    .button {
      float: right;
      margin: 10px 0 0 0;
    }
  }
}
</style>
