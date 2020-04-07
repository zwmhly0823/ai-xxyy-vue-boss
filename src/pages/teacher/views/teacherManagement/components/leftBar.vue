<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-07 14:34:35
 -->
<template>
  <div class="left-container" @mouseleave="outTools">
    <div class="title">组织结构</div>
    <el-tree
      class="left-container-tree"
      :data="experiencelist"
      default-expand-all
      node-key="customId"
      :current-node-key="0"
      highlight-current
      style="color:#2F2E31"
      @node-click="nodeClick"
      @contextmenu.prevent="defaultHandler()"
    >
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
        @mouseover="showTools(data.id)"
      >
        <span :title="data.id">{{ data.name }}</span>
        <!-- （{{ data.id ? data.id : 0 }}） -->
        <span
          class="el-icon-s-tools toolsIcon"
          slot="reference"
          @contextmenu.prevent="menuTools"
          v-if="+toolsCount === +data.id"
          style="margin-left:10px"
        >
          <el-card id="menu">
            <div>
              <div>新建下级部门</div>
              <div>新建平级部门</div>
              <div>编辑部门</div>
              <div>停用部门</div>
            </div>
          </el-card>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
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
      experiencelist: []
    }
  },
  computed: {},

  methods: {
    nodeClick(data) {
      alert(data.id)
      this.$emit('change', data)
    },
    showTools(index) {
      this.toolsCount = +index
    },
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
    outTools() {
      this.toolsCount = null
    },
    defaultHandler() {
      console.log('哈哈')
    }
  },
  async created() {
    await this.$http.Teacher.getDepartmentTree(1).then((res) => {
      this.experiencelist = res.payload
      console.log(res)
    })
  }
}
</script>
<style lang="scss" scoped>
.left-container {
  .title {
    font-size: 18px;
    padding: 10px 0px 10px 20px;
  }
  padding: 10px 0px;
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
    .el-tree-node__content {
      background: #ebebeb !important;
      // background: rgba(240, 241, 242, 1) !important;
    }
  }
}
</style>
