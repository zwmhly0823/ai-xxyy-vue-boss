<!--
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-13 17:19:54
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/components/LeftBar.vue
 -->
<template>
  <div class="left-container">
    <el-input
      v-model="input"
      placeholder="搜索班级名称"
      prefix-icon="el-icon-search"
    >
    </el-input>
    <el-tree
      :data="classData"
      :props="defaultProps"
      style="marginTop:10px"
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
      classData: [
        {
          label: '体验课班级',
          children: [
            {
              label: '待开课'
            },
            {
              label: '今日开课'
            },
            {
              label: '上课中'
            },
            {
              label: '已结课'
            }
          ]
        },
        {
          label: '系统课班级',
          children: [
            {
              label: '待开课'
            },
            {
              label: '今日开课'
            },
            {
              label: '上课中'
            },
            {
              label: '已结课'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.left-container {
  padding: 10px;
}
</style>
