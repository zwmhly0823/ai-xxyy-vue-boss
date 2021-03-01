<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
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
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
    >
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column
        label="角色名称"
        prop="roleName"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="权限字符"
        prop="roleKey"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
     
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number
            v-model="form.roleSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
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
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          ></el-input>
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
// import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, changeRoleStatus } from "@/api/system/role";
// import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
// import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";

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
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
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
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' },
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getList()
    // this.getDicts("sys_normal_disable").then(response => {
    //   this.statusOptions = response.data;
    // });
    this.statusOptions = [
      {
        searchValue: null,
        createBy: 'admin',
        createTime: '2020-11-20 19:29:49',
        updateBy: null,
        updateTime: null,
        remark: '正常状态',
        params: {},
        dictCode: 6,
        dictSort: 1,
        dictLabel: '正常',
        dictValue: '0',
        dictType: 'sys_normal_disable',
        cssClass: '',
        listClass: 'primary',
        isDefault: 'Y',
        status: '0',
        default: true,
      },
      {
        searchValue: null,
        createBy: 'admin',
        createTime: '2020-11-20 19:29:49',
        updateBy: null,
        updateTime: null,
        remark: '停用状态',
        params: {},
        dictCode: 7,
        dictSort: 2,
        dictLabel: '停用',
        dictValue: '1',
        dictType: 'sys_normal_disable',
        cssClass: '',
        listClass: 'danger',
        isDefault: 'N',
        status: '0',
        default: false,
      },
    ]
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      setTimeout(() => {
        this.roleList = [
          {
            searchValue: null,
            createBy: null,
            createTime: '2020-11-20 19:29:43',
            updateBy: null,
            updateTime: null,
            remark: '超级管理员',
            params: {},
            roleId: 1,
            roleName: '超级管理员',
            roleKey: 'admin',
            roleSort: '1',
            dataScope: '1',
            menuCheckStrictly: true,
            deptCheckStrictly: true,
            status: '0',
            delFlag: '0',
            flag: false,
            menuIds: null,
            deptIds: null,
            admin: true,
          },
          {
            searchValue: null,
            createBy: null,
            createTime: '2020-11-20 19:29:43',
            updateBy: null,
            updateTime: null,
            remark: '普通角色',
            params: {},
            roleId: 2,
            roleName: '普通角色',
            roleKey: 'common',
            roleSort: '2',
            dataScope: '2',
            menuCheckStrictly: true,
            deptCheckStrictly: true,
            status: '0',
            delFlag: '0',
            flag: false,
            menuIds: null,
            deptIds: null,
            admin: false,
          },
        ]
        console.log(this.roleList)
        this.total = 2
        this.loading = false
      }, 500)
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      //   menuTreeselect().then((response) => {
      this.menuOptions = [
        {
          id: 1,
          label: '系统管理',
          children: [
            {
              id: 100,
              label: '用户管理',
              children: [
                {
                  id: 1001,
                  label: '用户查询',
                },
                {
                  id: 1002,
                  label: '用户新增',
                },
                {
                  id: 1003,
                  label: '用户修改',
                },
                {
                  id: 1004,
                  label: '用户删除',
                },
                {
                  id: 1005,
                  label: '用户导出',
                },
                {
                  id: 1006,
                  label: '用户导入',
                },
                {
                  id: 1007,
                  label: '重置密码',
                },
              ],
            },
            {
              id: 101,
              label: '角色管理',
              children: [
                {
                  id: 1008,
                  label: '角色查询',
                },
                {
                  id: 1009,
                  label: '角色新增',
                },
                {
                  id: 1010,
                  label: '角色修改',
                },
                {
                  id: 1011,
                  label: '角色删除',
                },
                {
                  id: 1012,
                  label: '角色导出',
                },
              ],
            },
            {
              id: 102,
              label: '菜单管理',
              children: [
                {
                  id: 1013,
                  label: '菜单查询',
                },
                {
                  id: 1014,
                  label: '菜单新增',
                },
                {
                  id: 1015,
                  label: '菜单修改',
                },
                {
                  id: 1016,
                  label: '菜单删除',
                },
              ],
            },
            {
              id: 103,
              label: '部门管理',
              children: [
                {
                  id: 1017,
                  label: '部门查询',
                },
                {
                  id: 1018,
                  label: '部门新增',
                },
                {
                  id: 1019,
                  label: '部门修改',
                },
                {
                  id: 1020,
                  label: '部门删除',
                },
              ],
            },
            {
              id: 104,
              label: '岗位管理',
              children: [
                {
                  id: 1021,
                  label: '岗位查询',
                },
                {
                  id: 1022,
                  label: '岗位新增',
                },
                {
                  id: 1023,
                  label: '岗位修改',
                },
                {
                  id: 1024,
                  label: '岗位删除',
                },
                {
                  id: 1025,
                  label: '岗位导出',
                },
              ],
            },
            {
              id: 105,
              label: '字典管理',
              children: [
                {
                  id: 1026,
                  label: '字典查询',
                },
                {
                  id: 1027,
                  label: '字典新增',
                },
                {
                  id: 1028,
                  label: '字典修改',
                },
                {
                  id: 1029,
                  label: '字典删除',
                },
                {
                  id: 1030,
                  label: '字典导出',
                },
              ],
            },
            {
              id: 106,
              label: '参数设置',
              children: [
                {
                  id: 1031,
                  label: '参数查询',
                },
                {
                  id: 1032,
                  label: '参数新增',
                },
                {
                  id: 1033,
                  label: '参数修改',
                },
                {
                  id: 1034,
                  label: '参数删除',
                },
                {
                  id: 1035,
                  label: '参数导出',
                },
              ],
            },
            {
              id: 107,
              label: '通知公告',
              children: [
                {
                  id: 1036,
                  label: '公告查询',
                },
                {
                  id: 1037,
                  label: '公告新增',
                },
                {
                  id: 1038,
                  label: '公告修改',
                },
                {
                  id: 1039,
                  label: '公告删除',
                },
              ],
            },
            {
              id: 108,
              label: '日志管理',
              children: [
                {
                  id: 500,
                  label: '操作日志',
                  children: [
                    {
                      id: 1040,
                      label: '操作查询',
                    },
                    {
                      id: 1041,
                      label: '操作删除',
                    },
                    {
                      id: 1042,
                      label: '日志导出',
                    },
                  ],
                },
                {
                  id: 501,
                  label: '登录日志',
                  children: [
                    {
                      id: 1043,
                      label: '登录查询',
                    },
                    {
                      id: 1044,
                      label: '登录删除',
                    },
                    {
                      id: 1045,
                      label: '日志导出',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: '系统监控',
          children: [
            {
              id: 109,
              label: '在线用户',
              children: [
                {
                  id: 1046,
                  label: '在线查询',
                },
                {
                  id: 1047,
                  label: '批量强退',
                },
                {
                  id: 1048,
                  label: '单条强退',
                },
              ],
            },
            {
              id: 110,
              label: '定时任务',
              children: [
                {
                  id: 1049,
                  label: '任务查询',
                },
                {
                  id: 1050,
                  label: '任务新增',
                },
                {
                  id: 1051,
                  label: '任务修改',
                },
                {
                  id: 1052,
                  label: '任务删除',
                },
                {
                  id: 1053,
                  label: '状态修改',
                },
                {
                  id: 1054,
                  label: '任务导出',
                },
              ],
            },
            {
              id: 111,
              label: '数据监控',
            },
            {
              id: 112,
              label: '服务监控',
            },
            {
              id: 113,
              label: '缓存监控',
            },
          ],
        },
        {
          id: 3,
          label: '系统工具',
          children: [
            {
              id: 114,
              label: '表单构建',
            },
            {
              id: 115,
              label: '代码生成',
              children: [
                {
                  id: 1055,
                  label: '生成查询',
                },
                {
                  id: 1056,
                  label: '生成修改',
                },
                {
                  id: 1058,
                  label: '导入代码',
                },
                {
                  id: 1057,
                  label: '生成删除',
                },
                {
                  id: 1059,
                  label: '预览代码',
                },
                {
                  id: 1060,
                  label: '生成代码',
                },
              ],
            },
            {
              id: 116,
              label: '系统接口',
            },
          ],
        },
        {
          id: 4,
          label: '若依官网',
        },
      ]
      //   })
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then((response) => {
        this.deptOptions = response.data
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
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys()
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then((response) => {
        this.menuOptions = response.menus
        return response
      })
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then((response) => {
        this.deptOptions = response.depts
        return response
      })
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm(
        '确认要"' + text + '""' + row.roleName + '"角色吗?',
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
          this.msgSuccess(text + '成功')
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
        (this.deptExpand = true),
        (this.deptNodeAll = false),
        (this.form = {
          roleId: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: '0',
          menuIds: [],
          deptIds: [],
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          remark: undefined,
        })
      this.resetForm('form')
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
      this.ids = selection.map((item) => item.roleId)
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
      } else if (type == 'dept') {
        let treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true : false
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true : false
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      //   this.reset()
      this.getMenuTreeselect()
      this.open = true
      this.title = '添加角色'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      //   this.reset()
      const roleId = row.roleId || this.ids
            this.getMenuTreeselect()
      //   const roleMenu = this.getRoleMenuTreeselect(roleId)
      //   getRole(roleId).then((response) => {
      this.form = {
        searchValue: null,
        createBy: null,
        createTime: '2020-11-20 19:29:43',
        updateBy: null,
        updateTime: null,
        remark: '超级管理员',
        params: {},
        roleId: 1,
        roleName: '超级管理员',
        roleKey: 'admin',
        roleSort: '1',
        dataScope: '1',
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        status: '0',
        delFlag: '0',
        flag: false,
        menuIds: null,
        deptIds: null,
        admin: true,
      }

      this.open = true
      // this.$nextTick(() => {
      //   roleMenu.then((res) => {
      let checkedKeys = []
      checkedKeys.forEach((v) => {
        this.$nextTick(() => {
          this.$refs.menu.setChecked(v, true, false)
        })
      })
      //   })
      // })
      this.title = '修改角色'
      //   })
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            updateRole(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids
      this.$confirm(
        '是否确认删除角色编号为"' + roleIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return delRole(roleIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
  },
}
</script>