<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-06-13 10:35:39
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-06 18:00:25
 -->
<template>
  <el-row type="flex" class="app-main height teacherContainer">
    <el-col class="teacherContainer-left">
      <div class="grid-content">
        <left-bar @change="leftBarHandler" />
      </div>
    </el-col>
    <el-col class="teacherContainer-right">
      <div class="grid-content">
        <div class="system-container">
          <div class="content-top">
            <!-- <m-search
              @search="handleSearch"
              staffname="realName.keyword"
              class="search-container"
            /> -->
            <employees-role
              employees="role_id"
              phoneNumber="mobile"
              searchName="realName"
              :isShow="true"
              @search="handleSearchEmployees"
              class="search-container"
            />
            <el-button
              type="primary"
              class="button"
              size="mini"
              @click="handleAddEmployees('', 'add')"
              >新增员工</el-button
            >
          </div>
          <ele-table :dataList="tableData" :loading="loading" class="mytable">
            <el-table-column type="index" label="序号" align="center">
            </el-table-column>
            <el-table-column
              label="真实姓名"
              min-width="80"
              align="center"
              prop="realName"
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
              prop="userName"
            ></el-table-column>
            <el-table-column label="部门" min-width="80" align="center" prop="departmentList">
              <template slot-scope="scope">
                <span v-for="(item, index) of scope.row.departmentList" :key="item.id">
                  <span v-if="index + 1 < scope.row.departmentList.length">{{item.name}}/</span>
                  <span v-else>{{item.name}}</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column label="员工角色" min-width="80" align="center" prop="roleList">
              <template slot-scope="scope">
                <div v-for="item of scope.row.roleList" :key="item.id">
                  <span>{{item.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.status === 'TENURE' ? '在职' : '离职' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="handleAddEmployees(scope.row, 'edit')"
                  >编辑</el-button
                >
                <el-button type="text" @click="handleResetPassword(scope.row)"
                  >重置密码</el-button
                >
              </template>
            </el-table-column>
          </ele-table>
          <m-pagination
            @current-change="pageChange_handler"
            :current-page="+tabQuery.pageNum"
            :total="totalElements"
            open="calc(100vw - 95px - 100px)"
            close="calc(100vw - 23px - 50px)"
          />
          <Dialog
            v-if="dialogVisible"
            :title="title"
            :handleType="handleType"
            :dialogVisible="dialogVisible"
            @submit="handleSubmit"
            @cancleDialog="cancleDialog"
            :editItem="editItem"
            ref="dialogForm"
          />
          <!-- 密码重置弹框 -->
          <el-dialog
            title="重置密码"
            :visible.sync="resetPassword"
            width="450px"
            @close="handleSure"
          >
            <div v-if="showTip">
              <svg class="iconhj1" aria-hidden="true">
                <use xlink:href="#iconhj1"></use>
              </svg>
              <span class="reset-name"
                >是否确认重置员工“{{ resetCurrentName }}”的 密码</span
              >
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSureReset">确 定</el-button>
                <el-button @click="resetPassword = false">取 消</el-button>
              </div>
            </div>
            <div v-if="resetTip">
              <span class="reset-name"
                >重置成功，默认密码为“{{ defaultPassword }}”</span
              >
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSure">确 定</el-button>
                <el-button @click="handleSure">取 消</el-button>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      dialogVisible: false,
      tableData: [],
      loading: false,
      tabQuery: {
        pageSize: 20,
        pageNum: 1,
        realName: '',
        staffType: '',
        departmentId: '',
      },
      totalElements: 0,
      handleType: '',
      queryList: [],
      editItem: {},
      searchQuery: '',
      departmentQuery: '',
      resetPassword: false,
      defaultPassword: 'Msb-123456',
      resetCurrentName: '',
      resetCurrentId: '',
      showTip: false,
      resetTip: false,
    }
  },
  mounted() {
    this.getStaffList()
  },
  methods: {
    leftBarHandler(data) {
      const query = {
        pageSize: 20,
        pageNum: 1,
        realName: '',
        staffType: '',
        departmentId: data.id,
      };
      this.tabQuery = query;
      this.getStaffList();

    },
    // 获取员工列表
    async getStaffList() {
      this.loading = true
      try {
        const res = await this.$http.Staff.getStaffList(this.tabQuery);
        this.tableData =
          res.payload.content.length !== 0
            ? res.payload.content
            : []
        this.totalElements = +res.payload.totalElements
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    // 按名字搜索
    handleSearch(data) {
      if (data.length > 0) {
        this.tabQuery.pageNum = 1;
      } else {
        this.searchQuery = ''
      }
      this.getStaffList()
    },
    // 员工身份搜索
    handleSearchEmployees(data) {
      const query = {
        pageSize: 20,
        pageNum: 1,
        departmentId: this.tabQuery.id,
      };
      if (data.length > 0) {
        data.forEach((res) => {
          if (res.roleId) {
            query.roleId = res.roleId.roleId
          }else if(res.mobile) {
            query.mobile = res.mobile.mobile
          }else if(res.realName) {
            query.realName = res.realName.realName
          }
        })
      }
      this.tabQuery = query;
      this.getStaffList();
    },
    // 新增、编辑员工
    handleAddEmployees(item = '', type) {
      this.editItem = Object.assign({}, item)
      this.handleType = type
      this.title = type === 'add' ? '新增员工' : '编辑员工'
      this.dialogVisible = true
    },
    // 取消dialog
    cancleDialog() {
      this.dialogVisible = false
      this.editItem = {}
      this.handleType = ''
    },
    // 提交表单
    async handleSubmit() {
      const form = this.$refs.dialogForm.form;
      let res;
      if(form.id) {
        res = await this.$http.Staff.updateStaff(form);
      }
      else {
        res = await this.$http.Staff.addStaff(form);
      }
      if (res.code === 0) {
        this.$message.success(`${this.title}成功~`)
        this.dialogVisible = false
        this.editItem = {}
        this.handleType = ''
        setTimeout(() => {
          this.getStaffList()
        }, 1000)
      }

    },
    pageChange_handler(page) {
      this.tabQuery.pageNum = page
      this.getStaffList()
    },
    handleResetPassword(item) {
      this.resetPassword = true
      this.showTip = true
      this.resetCurrentName = item.realName
      this.resetCurrentId = item.id
    },
    // 重置密码
    async handleSureReset() {
      try {
        const res = await this.$http.Login.resetPwd(
          this.resetCurrentId,
          this.defaultPassword
        )
        if (res.code === 0) {
          this.resetCurrentName = ''
          this.resetCurrentId = ''
          this.showTip = false
          this.resetTip = true
          setTimeout(() => {
            this.getStaffList()
          }, 1000)
        }
      } catch (error) {
      }
    },
    handleSure() {
      this.showTip = false
      this.resetTip = false
      this.resetPassword = false
    }
  },
  components: {
    // MSearch: () => import('@/components/MSearch/index.vue'),
    EmployeesRole: () => import('@/components/MSearch/index.vue'),
    Dialog: () => import('./dialog.vue'),
    EleTable: () => import('@/components/Table/EleTable'),
    MPagination: () => import('@/components/MPagination/index.vue'),
    LeftBar: () => import('./components/leftBar.vue'),
  }
}
</script>

<style lang="scss" scoped>
.system-container {
  padding: 10px;
  .content-top {
    overflow: hidden;
    .search-container {
      background: none !important;
      display: inline-block;
      vertical-align: top;
    }
    .button {
      float: right;
      margin: 10px 0 0 0;
    }
  }
  .iconhj1 {
    width: 30px;
    height: 30px;
    fill: rgb(219, 154, 79);
    vertical-align: middle;
    margin: 0 0 30px 40px;
  }
  .reset-name {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0 30px 20px;
  }
  .dialog-footer {
    text-align: right;
  }
}
.teacherContainer {
  &-left {
    padding-left: 0px;
    padding-right: 10px;
    width: 240px;
    overflow-x: auto;
    // min-width: 240px;
    border-right: 1px solid #e3e3e3;
  }
  &-right {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
    padding-bottom: 45px;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.right {
      padding: 0;
    }
  }
}
</style>
