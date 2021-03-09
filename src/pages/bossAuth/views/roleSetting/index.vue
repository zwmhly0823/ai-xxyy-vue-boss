<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" style="margin-bottom: 20px">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-minus"
          size="mini"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="角色编号" prop="id" width="120" />
      <el-table-column
        label="角色名称"
        prop="name"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="角色描述"
        prop="describe"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="ctime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ctime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name=""
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination
        background
        layout="prev,pager,next,jumper,total"
        :total="total"
        :page-size="queryParams.pageSize"
        :current-page.sync="queryParams.pageNum"
        @current-change="handlePageChange"
      />
    </div>
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input v-model="form.describe" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event, 'menu')"
            >展开/折叠</el-checkbox
          >
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event, 'menu')"
            >全选/全不选</el-checkbox
          >
          <el-checkbox
            v-model="form.menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
            >父子联动</el-checkbox
          >
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'Role',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,

      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限',
        },
        {
          value: '2',
          label: '自定数据权限',
        },
        {
          value: '3',
          label: '本部门数据权限',
        },
        {
          value: '4',
          label: '本部门及以下数据权限',
        },
        {
          value: '5',
          label: '仅本人数据权限',
        },
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {
        menuCheckStrictly: true,
      },
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
        describe: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getList()
    this.getMenuTree();
  },
  methods: {
    handlePageChange() {
      this.getList();
    },
    /** 查询角色列表 */
    getList() {
      this.$http.SystemRole.getRoleList(this.queryParams)
      .then(res => {
        this.loading = false;
        if(res.code === 0) {
          this.roleList = res.payload.content;
          this.total = res.payload.totalElements | 0;
        }
      })
    },
    getMenuTree() {
      this.$http.SystemMenu.getMenuTree()
      .then(res => {
        if(res.code === 0) {
          this.menuOptions = res.payload;
        }
      })
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys()
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm(
        '确认要"' + text + '""' + row.name + '"角色吗?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return changeRoleStatus(row.roleId, row.status)
        })
        .then(() => {
          Message(text + '成功')
        })
        .catch(function () {
          row.status = row.status === '0' ? '1' : '0'
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },

    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      ;(this.menuExpand = false),
        (this.menuNodeAll = false),
        (this.form = {
          id: undefined,
          name: undefined,
          describe: undefined,
          menus: [],
          menuCheckStrictly: true,
        })
      // this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true : false
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      //   this.reset()
      this.open = true
      this.title = '添加角色'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.title = '修改角色';
      this.open = true;
      let checkedKeys = [];

      row.menuList && row.menuList.map(item => {
        checkedKeys.push(item.id);
        this.$nextTick(() => {
          this.$refs.menu.setChecked(item.id, true, false)
        })
      })

      this.form = {
        id: row.id,
        name: row.name,
        describe: row.describe,
        menus: checkedKeys,
        menuCheckStrictly: true,
      }

    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.menus = this.getMenuAllCheckedKeys();
          console.log('form', this.form);
          if (this.form.id) {
            this.$http.SystemRole.updateRole(this.form)
            .then((res) => {
              if(res.code === 0) {
                this.open = false
                Message('修改成功')
                this.getList();
                this.reset();
              }
              else {
                  Message('新增失败')
              }
            })
          } else {
            this.$http.SystemRole.addRole(this.form)
            .then(res => {
              if(res.code === 0) {
                this.open = false;
                Message('新增成功');
                this.getList();
                this.reset();
              }
              else {
                  Message('新增失败')
              }
            })
          }
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.id ? [row.id] : this.ids;
      const that = this;
      this.$confirm(
        '是否确认删除角色编号为"' + roleIds.join('/\n') + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      .then(function () {
        return that.$http.SystemRole.deleteRole({
          ids:roleIds,
        })
      })
      .then((res) => {
        if(res.code === 0) {
          this.getList()
          Message('删除成功')
        }
        else {
          Message('删除失败')
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .pagination-wrapper{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 10px;
    line-height: 40px;
    background: #fff;
  }
</style>
