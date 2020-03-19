<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-19 20:09:08
 -->
<template>
  <div class="left-container">
    <el-input
      v-model="input"
      placeholder="搜索班级名称"
      prefix-icon="el-icon-search"
      size="small"
      v-if="false"
    >
    </el-input>
    <el-tree
      :data="[...showExpressData, ...showSystemData]"
      :props="defaultProps"
      default-expand-all
      highlight-current
      style="marginTop:10px"
      @node-click="nodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  props: {
    expressData: {
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
      } // 定义节点名称
    }
  },
  computed: {
    /**
     * 体验课状态展示数据
     */
    showExpressData() {
      const datas =
        this.expressData.teamStatusCount &&
        this.expressData.teamStatusCount
          .map((item) => {
            item.types = 0
            item.showName = `${item.name}（${item.value}）`
            return item
          })
          .reverse()
      const classData = [
        {
          showName: '体验课班级',
          value: '',
          children: datas
        }
      ]
      return classData
    },
    /**
     * 体验课状态展示数据
     */
    showSystemData() {
      const datas =
        this.systemData.teamStatusCount &&
        this.systemData.teamStatusCount
          .map((item) => {
            item.types = 1
            item.showName = `${item.name}（${item.value}）`
            return item
          })
          .reverse()
      const classData = [
        {
          showName: '系统课班级',
          value: '',
          children: datas
        }
      ]
      return classData
    }
  },
  methods: {
    nodeClick(data) {
      this.$emit('change', data)
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.left-container {
  padding: 10px;
}
</style>
