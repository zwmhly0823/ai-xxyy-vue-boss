<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-16 13:56:15
 
 -->
<template>
  <div class="left-container">
    <div class="title">组织架构</div>
    <el-tree
      class="left-container-tree"
      :data="departmentList"
      node-key="pid"
      :current-node-key="0"
      :expand-on-click-node="false"
      :default-expanded-keys="['99999']"
      highlight-current
      style="color:#2F2E31"
      @node-click="nodeClick"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
        @mouseover="showTools(data)"
        @mouseleave="hiddenTools(data)"
      >
        <span class="menu-box">
          <span :title="data.id" class="menu-name">{{ `${data.name}` }}</span>
          <span v-if="data.name === '小熊项目'">{{ `(${qbSize})` }}</span>
          <span v-else>{{ data.size ? `(${data.size} )` : `(0)` }}</span>
        </span>
        <span
          v-show="nowId == data.id && isShowEditIcon"
          class="el-icon-more"
          @click.stop="editTools(data)"
        ></span>
        <el-card
          v-show="nowId == data.id && showMenu && data.name === '小熊项目'"
        >
          <div v-for="(item, index) in editMenuListNodel" :key="index">
            <div @click.stop="handleMenuItem(data, item)">
              {{ item.lable }}
            </div>
          </div>
        </el-card>
        <el-card
          v-show="nowId == data.id && showMenu && data.name !== '小熊项目'"
        >
          <div v-for="(item, index) in editMenuList" :key="index">
            <div @click.stop="handleMenuItem(data, item)">
              {{ item.lable }}
            </div>
          </div>
        </el-card>
      </span>
    </el-tree>
    <DialogMenu
      v-if="dialogVisible"
      :editCurrentData="editCurrentData"
      :currentItem="editCurrentItem"
      :dialogVisible="dialogVisible"
      :departmentFlatList="departmentFlatList"
      @handleDialog="handleDialog"
      ref="dialogRef"
    />
  </div>
</template>

<script>
import { sortByKey } from '@/utils/boss'
export default {
  props: {
    experienceData: {
      type: Object,
      default: () => ({})
    },
    systemData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      qbSize: '',
      departmentList: [
        {
          name: '小熊项目',
          pid: '99999',
          children: []
        }
      ],
      isShowEditIcon: false,
      nowId: null,
      showMenu: false,
      editMenuList: [
        {
          lable: '新建',
          type: 'childLevel'
        },
        {
          lable: '修改',
          type: 'edit'
        },
        {
          lable: '删除',
          type: 'delete'
        }
      ],
      editMenuListNodel: [
        {
          lable: '新建',
          type: 'childLevel'
        },
        {
          lable: '修改',
          type: 'edit'
        }
      ],
      dialogVisible: false,
      editCurrentItem: {},
      editCurrentData: {},
      departmentFlatList: [],
      menuType: null
    }
  },
  async created() {
    this.initTree()
    this.getDepartmentTree()
  },
  methods: {
    getDepartmentTree() {
      this.$http.Teacher.departmentTree().then((res) => {
        this.qbSize = res.payload
      })
    },
    async initTree() {
      try {
        await this.$http.Teacher.getDepartmentTree(1).then((res) => {
          const arr = (res && res.payload) || []
          if (arr.length === 0) return arr
          const department = sortByKey(arr, 'id')
          // 组织结构第一层排序
          department.sort(this.handle('sort'))
          // 多层排序
          this.recursive(department)
          this.departmentList[0].children = department
          console.log('列表', department)
          this.departmentFlatList = department
        })
      } catch (error) {
        console.log(error)
      }
    },
    // 点击节点
    nodeClick(data) {
      console.log('点击节点', data)
      this.$emit('change', data)
    },
    // 鼠标移入显示icon
    showTools(item) {
      this.isShowEditIcon = true
      this.nowId = item.id
    },
    // 鼠标移出消失icon
    hiddenTools(item) {
      this.isShowEditIcon = false
      this.nowId = null
      this.showMenu = false
    },
    // 点击icon
    editTools(item) {
      this.showMenu = true
    },
    // 点击菜单item
    handleMenuItem(data, item) {
      this.showMenu = false
      this.dialogVisible = true
      this.editCurrentItem = JSON.parse(JSON.stringify(item))
      this.editCurrentData = JSON.parse(JSON.stringify(data))
      this.menuType = item.type
    },
    handleDialog(type) {
      const { menuType } = this
      if (type === 'submit') {
        switch (menuType) {
          case 'delete':
            this.deleMenu()
            break
          case 'sameLevel':
            this.addMenu()
            break
          case 'childLevel':
            this.addMenu()
            break
          case 'edit':
            this.addMenu()
            break
          default:
            return ''
        }
      } else {
        this.initProps()
      }
    },
    // 增加菜单
    async addMenu() {
      const { menuType, editCurrentData } = this
      const form = this.$refs.dialogRef
      console.log(form)
      let pid = ''
      // 创建栏目时,一级创建同级时为0，创建子栏目时为当前id;二级、三级创建同级时为当前数据的pid,创建子级时为当前id
      switch (menuType) {
        case 'sameLevel':
          pid = editCurrentData.flag === 1 ? '0' : editCurrentData.pid
          break
        case 'childLevel':
          pid = form._data.departfather
          // pid = ''
          break
        case 'edit':
          pid = form._data.departs
          break
        default:
          pid = ''
      }
      let params = {
        name: form[menuType].name,
        sort: form[menuType].sort,
        id: menuType === 'edit' ? editCurrentData.id : '',
        // id: ['edit', 'childLevel'].includes(menuType)
        //   ? form._data.departfather
        pid: pid
      }
      if (params.name === '') {
        this.$message.warning('名称是必填项哦～')
        return
      }
      try {
        const res = await this.$http.Teacher.createDepartment(params)
        if (res.code === 0) {
          if (menuType === 'sameLevel' || menuType === 'childLevel') {
            this.$message.success(`新增栏目"${params.name}"成功`)
          } else {
            this.$message.success(`更改栏目"${params.name}"成功`)
          }
          params = {}
          this.initProps()
          this.initTree()
        }
      } catch (error) {
        params = {}
        console.log(error)
      }
    },
    // 删除菜单
    async deleMenu() {
      try {
        const res = await this.$http.Teacher.deleteDepartmentById(
          this.editCurrentData.id
        )
        if (res.code === 0) {
          this.$message.success(`已成功删除${this.editCurrentData.name}`)
          this.initProps()
          this.initTree()
        }
      } catch (error) {
        console.log(error)
      }
    },
    initProps() {
      this.dialogVisible = false
      this.editCurrentItem = {}
      this.editCurrentData = {}
      this.menuType = null
    },
    // 右击icon，显示菜单
    menuTools(e) {
      const oMenu = document.getElementById('menu')

      if (+e.button === 2) {
        e.preventDefault()
        const _x = e.clientX
        const _y = e.clientY
        oMenu.style.display = 'block'
        oMenu.style.left = _x - 175 + 'px'
        oMenu.style.top = _y - 50 + 'px'
      }
    },
    // 组织结构排序
    handle(property) {
      return function(a, b) {
        const val1 = a[property]
        const val2 = b[property]
        return val2 - val1
      }
    },
    // 递归排序
    recursive(value) {
      value.forEach((item) => {
        if (item.children && item.children.length > 0) {
          item.children.sort(this.handle('sort'))
          this.recursive(item.children)
        }
      })
    }
  },
  components: {
    DialogMenu: () => import('./dialogMenu')
  }
}
</script>
<style lang="scss" scoped>
.left-container {
  overflow: scroll;
  .title {
    font-size: 18px;
    padding: 10px 0px 10px 20px;
  }
  padding: 10px 0px 130px;
  overflow-x: auto;
  .custom-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    .menu-box {
      display: flex;
      .menu-name {
        // width: 60px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
    }
  }
  /deep/ .el-tree-node__children {
    overflow: initial;
  }
  .el-icon-more {
    transform: rotate(90deg);
  }
  /deep/ .el-card {
    position: absolute;
    top: 15px;
    right: 0px;
    z-index: 999;
    line-height: 30px;
  }
}
#menu {
  display: none;
  position: absolute;
  z-index: 2;
}

#menu ul li {
  list-style: none;
}
/deep/ .custom-tree-node {
  padding-right: 20px;
}
</style>
<style lang="scss">
.left-container-tree {
  .is-current {
    > .el-tree-node__content {
      background: #ebebeb !important;
    }
  }
  .el-card__body {
    padding: 15px 15px 5px 15px !important;
    p {
      margin: 0px 0 10px 0;
    }
  }
}
</style>
