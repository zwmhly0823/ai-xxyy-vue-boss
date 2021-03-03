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
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="del"
          disabled="multipleSelection.length>0"
          >删除</el-button
        >
      </el-col> -->
    </el-row>
    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- @selection-change="handleSelectionChange" -->

      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column
        prop="name"
        label="菜单名称"
        :show-overflow-tooltip="true"
        width="160"
      ></el-table-column>

      <el-table-column
        prop="path"
        label="路径"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="sort" label="排序" width="60"></el-table-column>

      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ scope.row.ctime }}</span>
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
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

    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :before-close="cancel"
    >
      <el-tree
        :data="menuList"
        :props="{ label: 'name' }"
        ref="tree"
        show-checkbox
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
        highlight-current
        auto-expand-parent
        accordion
        node-key="id"
        :default-checked-keys="form.parentIdArr"
      ></el-tree>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="step != 1">
            <el-form-item label="上级菜单">
              <!-- <el-tree
                :data="menuList"
                :props="{ label: 'name' }"
                show-checkbox
                @node-click="handleNodeClick"
                @check-change="handleCheckChange"
                highlight-current
                auto-expand-parent
                accordion
                node-key="id"
                :default-checked-keys="form.parentIdArr"
              ></el-tree> -->
              <!-- :default-expanded-keys="expandedArr" -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type" v-if="step != 1">
              <el-radio-group v-model="form.type">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="权限标识">
              <el-input
                v-model="form.permission"
                placeholder="请权限标识"
                maxlength="50"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否缓存">
              <el-radio-group v-model="form.keepAlive">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'Menu',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      expandedArr: [],
      form: {
        menuType: 'boss',
        icon: '',
        keepAlive: false,
        menuType: '',
        name: '',
        parentId: 0,
        path: '',
        permission: '',
        sort: 0,
        type: '',
        parentIdArr: [],
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' },
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' },
        ],
      },
      multipleSelection: [],
      step: 1,
    }
  },
  watch: {
    'form.parentIdArr': (a,b) => {
      console.log(a)
      console.log(b)
    },
  },
  created() {
    this.getList()
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick(data) {
      console.log(data)
    },

    // 表单重置
    reset() {
      this.expandedArr = []
      this.form = {
        icon: '',
        keepAlive: false,
        menuType: '',
        name: '',
        parentId: 0,
        path: '',
        permission: '',
        sort: 0,
        type: '',
        parentIdArr: [],
      }
       this.$refs.tree.setCheckedKeys([]);
      //TODO:
      console.log(this)
      this.$refs['form'].resetFields()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      console.log('rowrowrow', row)
      this.expandedArr = []
  
      this.getTreeList()

      if (row != null && row.id) {
        this.step = 2
        this.expandedArr.push(row.id)
        let arr = []
        arr.push(row.id)
        this.form.parentIdArr = arr
        // console.log(this.form)
        this.form.parentId = row.id
      } else {
        this.step = 1
        this.form.parentId = 0
      }
      this.open = true
      // this.reset()
      this.title = '添加'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      this.reset()
      this.getTreeList()
      getMenu(row.menuId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      console.log(this.form)
      console.log(this.$refs['form'])
      this.$refs['form'].validate((valid) => {
        console.log(valid)

        if (valid) {
          let params = {
            ...this.form,
            icon: '',
          }

          if (this.form.menuId != undefined) {
            // updateMenu(this.form).then((response) => {
            //   Message('修改成功')
            //   this.open = false
            //   this.getList()
            // })
          } else {
            console.log(params)
            params.type = '0'
            console.log(params)
            this.$http.SystemMenu.add(params).then((response) => {
              if (response.code == 0) {
                Message('新增成功')
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },

    // TODO:完毕

    // 取消按钮

    cancel() {
      this.open = false
      this.reset()
    },
    del(ids) {
      console.log(ids)

      this.$http.SystemMenu.del({ ids: ids }).then((res) => {
        console.log(res)
      })
    },
    handleDelete(row) {
      let that = this
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          let ids = []
          that.treeData([row]).map((item) => {
            ids.push(item.id)
          })
          return that.del(ids)
        })
        .then(() => {
          that.getList()
          Message('删除成功')
        })
    },
    getTreeList() {
      this.$http.SystemMenu.getMenuTree()
        .then((res) => {
          console.log(res)
          if (res.payload.length) {
            this.menuOptions = res.payload
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    getList() {
      this.loading = true
      this.$http.SystemMenu.getMenuList()
        .then((res) => {
          console.log(res.payload)
          if (res.payload.length) {
            this.menuList = this.handleTree(res.payload, 'id')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // TODO:批量选择 子级 checkbox状态有问题
    handleSelectionChange(val) {
      let data = []
      if (val.length === 0) {
        data = val
      } else {
        this.treeData(val).map((item) => {
          data.push(item.id)
        })
      }
      console.log(data)
      this.multipleSelection = data
    },
    handleTree(data, id, parentId, children, rootId) {
      id = id || 'id'
      parentId = parentId || 'parentId'
      children = children || 'children'
      rootId =
        rootId ||
        Math.min.apply(
          Math,
          data.map((item) => {
            return item[parentId]
          })
        ) ||
        '0'
      console.log(rootId)
      //对源数据深度克隆
      const cloneData = JSON.parse(JSON.stringify(data))
      //循环所有项
      const treeData = cloneData.filter((father) => {
        let branchArr = cloneData.filter((child) => {
          //返回每一项的子级数组
          return father[id] === child[parentId]
        })
        branchArr.length > 0 ? (father.children = branchArr) : ''
        //返回第一层
        return father[parentId] === rootId
      })
      return treeData != '' ? treeData : data
    },
    treeData(data, treeMap = [], depth = 0) {
      if (!(data && data.length)) return
      depth++
      return data.reduce((acc, cur) => {
        cur.depth = depth
        acc.push(cur)
        if (cur.children && cur.children.length) {
          this.treeData(cur.children, treeMap, depth)
        }
        return acc
      }, treeMap)
    },
  },
}
</script>