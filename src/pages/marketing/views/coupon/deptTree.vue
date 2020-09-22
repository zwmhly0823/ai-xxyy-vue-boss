<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-22 22:35:06
 -->
<template>
  <div class="left-container" ref="treeContainer">
    <el-tree
      ref="tree"
      class="left-container-tree"
      :data="departmentList"
      show-checkbox
      default-expand-all
      node-key="id"
      :current-node-key="0"
      :expand-on-click-node="false"
      highlight-current
      style="color:#2F2E31"
    >
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span class="menu-box">
          <span :title="data.id" class="menu-name">{{ `${data.name}` }}</span>
          <!-- <span v-if="data.name === '小熊项目'">{{ `(${qbSize})` }}</span>
          <span v-else>{{ data.size ? `(${data.size} )` : `(0)` }}</span> -->
        </span>
        <div class="day-sets" v-if="data.children == null && data.pid != '0'">
          <span>开课后第</span>
          <el-input
            size="mini"
            v-model="data.day"
            @input="nodeInput"
            type="number"
          ></el-input>
          <span>天</span>
        </div>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { sortByKey } from '@/utils/boss'
// import { deepClone } from '@/utils/index'
export default {
  props: {
    dayDeptId: {
      type: Object,
      default: () => {}
    },
    systemData: {
      type: Object,
      default: () => {}
    },
    dayDept: {
      type: Object,
      default: () => {}
    },
    submit: {
      type: Boolean,
      default: false
    },
    period: {
      type: String,
      default: ''
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
      deptFlatList: [],
      containerHeight: ''
    }
  },
  created() {
    this.initTree()
    // this.getDepartmentTree()
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.containerHeight = this.calcTableHeight('treeContainer')
        console.log(this.containerHeight, 'containerHeight')
      }, 1000)
    })
  },
  watch: {
    period(val, oldVal) {
      console.log(val, oldVal)
    },
    submit(val, oldVal) {
      const checkedNode = this.handleCheckChange()
      const { deptFlatList } = this
      this.$emit('changeSubmit', {
        val,
        oldVal,
        deptFlatList,
        checkedNode
      })
    },
    dayDeptId: {
      handler: function(deptIds) {
        console.log('tree-deptIds', deptIds)
        /** 回显 tree中id对应的天数day */
        // this.deptTreeCl(this.deptFlatList)
        // const department = deepClone(this.deptFlatList)
        this.$nextTick(() => {
          setTimeout(() => {
            this.connectDeptIdDays(this.deptFlatList, deptIds)
            this.$refs.tree.setCheckedKeys(Object.keys(deptIds))
          }, 1000)
        })
      },
      deep: true
    }
  },
  methods: {
    /** 把天数和对应的id关联到tree-node中 */
    connectDeptIdDays(deptArr = [], deptIds = {}) {
      deptArr.forEach((item, index) => {
        const { id, children } = item
        item.day = deptIds[id] || ''
        item = {
          ...item
        }
        if (children && children.length)
          this.connectDeptIdDays(children, deptIds)
      })
    },
    closure(arg) {
      // const deptIds = arg
      // return function(deptIds) {}
    },
    handleCheckChange() {
      const res = this.$refs.tree.getCheckedNodes()
      return res.filter((item) => {
        return item.children == null && item.pid !== '0'
      })
    },
    nodeInput() {},
    // getDepartmentTree() {
    //   this.$http.Teacher.departmentTree().then((res) => {
    //     this.qbSize = res.payload
    //   })
    // },
    initTree() {
      const loadingInstance = this.$loading({
        target: '.app-main',
        lock: true,
        text: '加载中...',
        fullscreen: true
      })

      try {
        this.$http.Teacher.getDepartmentTree(1).then((res) => {
          const arr = (res && res.payload) || []
          if (arr.length === 0) return arr
          const department = sortByKey(arr, 'id')
          // 组织结构第一层排序
          department.sort(this.handle('sort'))
          // 多层排序
          this.recursive(department)
          this.departmentList[0].children = department

          /** 把天数和对应的id关联到tree-node中 */
          this.connectDeptIdDay(department, this.dayDept)

          this.deptFlatList = department
          console.log('init=dept', this.deptFlatList)
        })
      } catch (error) {
        console.log(error)
      } finally {
        loadingInstance.close()
      }
    },
    deptTreeCl(deptArr = []) {
      deptArr.forEach((item, index) => {
        const { children } = item
        item.day = ''
        deptArr[index] = {
          ...item
        }
        if (children && children.length) this.deptTreeCl(children)
      })
    },
    clearTreeData() {
      this.$refs.tree.setCheckedKeys([])
      this.deptTreeCl(this.deptFlatList)
    },
    /** 把天数和对应的id关联到tree-node中 */
    connectDeptIdDay(deptArr = [], deptIds = {}) {
      deptArr.forEach((item, index) => {
        const { id, children } = item
        item.day = deptIds[id] || ''
        deptArr[index] = {
          ...item
        }
        if (children && children.length)
          this.connectDeptIdDay(children, deptIds)
      })
    },
    // 点击节点
    nodeClick(data) {
      console.log('点击节点', data)
      this.$emit('change', data)
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
        if (item.children && item.children.length) {
          item.children.sort(this.handle('sort'))
          this.recursive(item.children)
        }
      })
    },
    calcTableHeight(ref) {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs[ref].getBoundingClientRect().y
        //  document.body.clientHeight 返回body元素内容的高度
        const containerHeight =
          document.body.clientHeight - tableTopHeight - 60 + ''
        return containerHeight
      })
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.left-container {
  height: 500px;
  overflow-y: scroll;
  .title {
    font-size: 18px;
    padding: 10px 0px 10px 20px;
  }
  padding: 10px 0px;
  overflow-x: auto;
  .custom-tree-node {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    .menu-box {
      display: flex;
    }
    .day-sets {
      /deep/ div {
        margin: 0 10px;
        width: 40px;
      }
      /deep/ input {
        width: 40px;
        height: 20px;
        padding: 3px;
        text-align: center;
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
