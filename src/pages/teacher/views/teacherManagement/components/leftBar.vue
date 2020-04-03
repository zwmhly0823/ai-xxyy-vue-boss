<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-03 16:33:19
 -->
<template>
  <div class="left-container" @mouseleave="outTools">
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
        @mouseover="showTools(data.value)"
      >
        <span :title="data.value">{{ data.showName }}</span>
        <span
          class="el-icon-s-tools toolsIcon"
          slot="reference"
          @contextmenu.prevent="menuTools"
          v-if="+toolsCount === +data.value"
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
        label: 'showName'
      }, // 定义节点名称
      toolsCount: null, // 是否显示配置按钮
      toolsMenu: false, // 右键配置显示列表
      experiencelist: [
        {
          showName: '小熊销售部',
          value: '13',
          children: [
            {
              showName: '小熊销售1部（1）',
              value: '14',
              children: [
                {
                  showName: '小熊1部S1组（1）',
                  value: '1'
                },
                {
                  showName: '小熊1部S2组（2）',
                  value: '2'
                },
                {
                  showName: '小熊1部S3组（222）',
                  value: '3'
                }
              ]
            },
            {
              showName: '小熊先锋战队（9）',
              value: '15',
              children: [
                {
                  showName: '先锋战队S1组（1）',
                  value: '4'
                },
                {
                  showName: '先锋战队S2组（2）',
                  value: '5'
                },
                {
                  showName: '先锋战队S3组（2）',
                  value: '6'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {},

  methods: {
    nodeClick(data) {
      this.$emit('change', data)
    },
    showTools(index) {
      this.toolsCount = +index
      console.log(index)
    },
    menuTools(e) {
      const oMenu = document.getElementById('menu')

      this.toolsMenu = true
      if (+e.button === 2) {
        e.preventDefault()
        console.log(e, 'oMenu')

        var _x = e.clientX
        var _y = e.clientY
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
  created() {}
}
</script>
<style lang="scss" scoped>
.left-container {
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
