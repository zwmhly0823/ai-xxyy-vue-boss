<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-15 18:21:16
 -->
<template>
  <div class="left-container">
    <div
      ref="treeContainer"
      class="tree-container"
      :style="{ height: containerHeight }"
    >
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
          </span>
          <div class="day-sets" v-if="data.children == null && data.pid != '0'">
            <!-- TODO: -->
            <div class="judge-box" v-if="$route.params.couponId == '5'">
              <span>开课后第</span>
              <!-- <span v-if="!data.edit" style="padding:0 3px;">{{
                data.day
              }}</span> -->
              <el-input
                size="mini"
                v-model="data.day"
                :disabled="period != '' || data.disabled"
                oninput="if(value<1) value=1"
                type="number"
              ></el-input>
              <span>天</span>
              <!-- <i
                class="el-icon-edit edit-styl"
                v-if="period == ''"
                @click="editCurDay(data)"
              ></i> -->
            </div>
            <div class="default-rule" v-else>
              自定义有效期
            </div>
          </div>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
// import { sortByKey } from '@/utils/boss'
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
    isChangeRadio: {
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
  },
  mounted() {
    this.calcTableHeight('treeContainer')
  },
  watch: {
    isChangeRadio(val) {},
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
      handler: async function(deptIds) {
        // console.log('watch deptIds', deptIds)
        /** 回显 tree中id对应的天数day */
        await this.$nextTick()

        setTimeout(() => {
          this.connectDeptIdDays(this.deptFlatList, deptIds)

          this.$refs.tree.setCheckedKeys(Object.keys(deptIds))
          /** 如果是新增模块，当选择当前期返回内容为空{}时，选中所有tree，设置默认值3 */
          if (!this.period) {
            if (!Object.keys(deptIds).length) {
              this.checkedAllNode()
              this.deptTreeCl(this.deptFlatList)
            }
          }

          if (this.isChangeRadio) {
            this.checkedAllNode()
            this.$emit('update:isChangeRadio', false)
          }
        }, 500)
      },
      deep: true
    }
  },
  methods: {
    /** 把天数和对应的id关联到tree-node中 */
    connectDeptIdDays(deptArr = [], deptIds = {}) {
      deptArr.forEach((item, index) => {
        const { id, children } = item
        // let baseDay = '3'
        // 查看模式
        item.disabled = false
        if (this.period !== '') {
          item.day = deptIds[id]
          item.disabled = true
        } else {
          item.day = deptIds[id]
          if (item.day === 0) {
            item.disabled = true
          }
        }
        // this.period !== '' && (item.disabled = true)
        item = {
          ...item
        }
        if (children && children.length)
          this.connectDeptIdDays(children, deptIds)
      })
    },
    handleCheckChange() {
      const res = this.$refs.tree.getCheckedNodes()
      return res.filter((item) => {
        const { children, pid } = item

        return children == null && pid !== '0'
      })
    },
    editCurDay(data) {
      console.log('cur-data', data)
      data.edit = !data.edit
    },
    nodeInput() {},
    // tree全选
    checkedAllNode() {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.deptFlatList)
      })
    },
    initTree() {
      const loadingInstance = this.$loading({
        target: 'body',
        lock: true,
        text: '加载中...',
        fullscreen: true
      })

      try {
        this.$http.Teacher.getDepartmentTree(1).then((res) => {
          const arr = (res && res.payload) || []
          if (!arr.length) return arr
          const department = arr.filter((dept) => dept.name === '美术AI销售')
          console.log('department', department)
          // const department = sortByKey(arr, 'id')
          // 组织结构第一层排序
          // department.sort(this.handle('sort'))
          // 多层排序
          this.recursive(department)
          this.departmentList[0].children = department

          /** 把天数和对应的id关联到tree-node中 */
          this.connectDeptIdDay(department, this.dayDept)

          this.deptFlatList = department

          // 新建模式下
          if (this.period === '') this.checkedAllNode()
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
        item.day = '3'
        item = {
          ...item
        }
        if (children && children.length) this.deptTreeCl(children)
      })
    },
    // clearTreeData() {
    //   this.$refs.tree.setCheckedKeys([])
    //   this.deptTreeCl(this.deptFlatList)
    // },
    /** 把天数和对应的id关联到tree-node中 */
    connectDeptIdDay(deptArr = [], deptIds = {}) {
      deptArr.forEach((item, index) => {
        const { id, children } = item
        item.day = deptIds[id] || '3'

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
        const tableTopHeight = this.$refs.treeContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const containerHeight =
          document.body.clientHeight - tableTopHeight - 100

        this.containerHeight = containerHeight + 'px'
      })
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.left-container {
  // height: 500px;
  .tree-container {
    overflow-y: scroll;
  }
  .title {
    font-size: 18px;
    padding: 10px 0px 10px 20px;
  }
  // padding: 10px 0px;
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
      .default-rule {
        color: #333;
      }
      .edit-styl {
        color: green;
        cursor: pointer;
        :hover {
          color: #2a75ed;
        }
      }
      /deep/ div.el-input {
        margin: 0 10px;
        width: 70px;
      }
      /deep/ input {
        width: 70px;
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
