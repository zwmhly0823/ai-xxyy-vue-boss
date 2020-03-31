<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:27
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-30 17:26:19
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
      class="left-container-tree"
      :data="[...showExperienceData, ...showSystemData]"
      :props="defaultProps"
      default-expand-all
      node-key="customId"
      :current-node-key="0"
      highlight-current
      style="color:#2F2E31"
      @node-click="nodeClick"
    ></el-tree>
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
      experiencelist: [
        {
          showName: '体验课班级',
          value: '',
          children: [
            {
              showName: '全部（0）',
              value: '_all'
            },
            {
              showName: '待开课（0）',
              value: '0'
            },
            {
              showName: '今日开课（0）',
              value: '3'
            },
            {
              showName: '上课中（0）',
              value: '1'
            },
            {
              showName: '已结课（0）',
              value: '2'
            }
          ]
        }
      ],
      systemlist: [
        {
          showName: '系统课班级（0）',
          value: '',
          children: [
            {
              showName: '全部（0）',
              value: '_all'
            },
            {
              showName: '待开课（0）',
              value: '0'
            },
            {
              showName: '今日开课（0）',
              value: '3'
            },
            {
              showName: '上课中（0）',
              value: '1'
            },
            {
              showName: '已结课（0）',
              value: '2'
            }
          ]
        }
      ]
    }
  },
  computed: {
    /**
     * 体验课状态展示数据
     */
    showExperienceData() {
      const datas = this.experiencelist[0].children.map((values, index) => {
        values.types = 0
        values.code = values.value
        values.customId = +`${index}0`
        this.experienceData.teamStatusCount &&
          this.experienceData.teamStatusCount.filter((v) => {
            if (v.code === values.value) {
              values.showName = `${values.showName.split('（')[0]}（${
                v.value ? v.value : 0
              }）`
            }
          })
        return values
      })
      const showExperience = [
        {
          showName: '体验课班级',
          value: '',
          children: datas
        }
      ]
      return showExperience
    },
    /**
     * 系统课状态展示数据
     */
    showSystemData() {
      const datas = this.systemlist[0].children.map((values, index) => {
        values.types = 1
        values.code = values.value
        values.customId = +`${index}1`
        this.systemData.teamStatusCount &&
          this.systemData.teamStatusCount.filter((v) => {
            if (v.code === values.value) {
              values.showName = `${values.showName.split('（')[0]}（${
                v.value ? v.value : 0
              }）`
            }
          })
        return values
      })
      const showStstem = [
        {
          showName: '系统课班级',
          value: '',
          children: datas
        }
      ]
      return showStstem
    }
  },
  methods: {
    nodeClick(data) {
      this.$emit('change', data)
      console.log(data, 'changedata')
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.left-container {
  padding: 10px 0px;
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
