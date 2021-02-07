<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-22 20:32:42
 -->
<template>
  <div class="left-container" @mouseleave="outTools">
    <!-- <div class="title">组织结构</div> -->
    <el-scrollbar class="elScrollbar" wrap-class="scrollbar-wrapper">
      <div class="tree-container">
        <el-tree
          class="left-container-tree"
          :data="departmentList"
          :default-expand-all="false"
          node-key="id"
          :current-node-key="0"
          :expand-on-click-node="false"
          :default-expanded-keys="['1']"
          highlight-current
          style="color:#2F2E31"
          @node-click="nodeClick"
          @contextmenu.prevent="defaultHandler()"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span :title="data.id">{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
// TODO: 优化 -> 程伟华
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
  components: {},
  data() {
    return {
      input: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }, // 定义节点名称
      toolsCount: null, // 是否显示配置按钮
      toolsMenu: false, // 右键配置显示列表
      departmentList: []
    }
  },
  computed: {},

  methods: {
    // 点击节点
    nodeClick(data) {
      this.$emit('changeOrgDept', data)
    },
    // 鼠标移入显示icon
    showTools(index) {
      this.toolsCount = +index
    },
    // 右击icon，显示菜单
    menuTools(e) {
      const oMenu = document.getElementById('menu')

      this.toolsMenu = true
      if (+e.button === 2) {
        e.preventDefault()
        const _x = e.clientX
        const _y = e.clientY
        oMenu.style.display = 'block'
        oMenu.style.left = _x - 175 + 'px'
        oMenu.style.top = _y - 50 + 'px'
      }
    },
    // 鼠标移除隐藏
    outTools() {
      this.toolsCount = null
    },
    defaultHandler() {}
  },
  created() {
    this.$http.Teacher.getDepartmentTree(1).then((res) => {
      const arr = (res && res.payload) || []
      if (arr.length === 0) return arr
      const department = sortByKey(arr, 'id')
      // 加一级销售部
      const tree = {
        id: '0',
        name: '销售部',
        pid: null,
        children: department
      }
      this.departmentList = [tree]
    })
  }
}
</script>
<style lang="scss" scoped>
.left-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;

  .elScrollbar {
    height: 350px;
    padding: 15px 0;
  }
  .tree-container {
    padding: 0 15px;
  }
  .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    white-space: nowrap;
  }
  // .scrollbar-wrapper {
  //   overflow-x: hidden;
  // }
  .title {
    font-size: 18px;
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
