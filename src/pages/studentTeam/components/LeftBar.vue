<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-18 15:00:26
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
      :data="classData"
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
  props: [],
  components: {},
  data() {
    return {
      input: '',
      ExperienceNum: {
        all: 0,
        classWait: 0,
        classToday: 0,
        classNow: 0,
        classOver: 0
      }, // 体验课num
      systemNum: {
        all: 0,
        classWait: 0,
        classToday: 0,
        classNow: 0,
        classOver: 0
      }, // 系统课num
      classData: [], // 节点
      defaultProps: {
        children: 'children',
        label: 'label'
      } // 定义节点名称
    }
  },
  methods: {
    nodeClick(data) {
      this.$emit('getLeftBarChange', data)
      console.log(data, 'data')
    }
  },
  created() {},
  mounted() {
    this.classData = [
      {
        label: '体验课班级',
        children: [
          {
            label: `全部（${this.ExperienceNum.all}）`
          },
          {
            label: `待开课（${this.ExperienceNum.classWait}）`
          },
          {
            label: `今日开课（${this.ExperienceNum.classToday}）`
          },
          {
            label: `上课中（${this.ExperienceNum.classNow}）`
          },
          {
            label: `已结课（${this.ExperienceNum.classOver}）`
          }
        ]
      },
      {
        label: '系统课班级',
        children: [
          {
            label: `全部（${this.systemNum.all}）`
          },
          {
            label: `待开课（${this.systemNum.classWait}）`
          },
          {
            label: `今日开课（${this.systemNum.classToday}）`
          },
          {
            label: `上课中（${this.systemNum.classNow}）`
          },
          {
            label: `已结课（${this.systemNum.classOver}）`
          }
        ]
      }
    ]
  }
}
</script>
<style lang="scss" scoped>
.left-container {
  padding: 10px;
}
</style>
