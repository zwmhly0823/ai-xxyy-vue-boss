<template>
  <div class="search-item small threeSelect">
    <el-cascader
      placeholder="请选择渠道分类"
      size="mini"
      v-model="channelName"
      @change="onSelect"
      :options="showDatas"
      :props="{
        multiple: true,
        value: 'id',
        label: 'channel_outer_name',
        emitPath: false,
        checkStrictly: false
      }"
      :show-all-levels="true"
      clearable
      filterable
    ></el-cascader>
    <el-select
      style="margin-left:20px;"
      v-model="channelLevels"
      @change="onChangeChannelLevel"
      size="mini"
      placeholder="请选择"
      clearable
      multiple
    >
      <el-option label="S" :value="2">S</el-option>
      <el-option label="A" :value="1">A</el-option>
      <el-option label="B" :value="0">B</el-option>
    </el-select>
  </div>
</template>

<script>
import axios from '@/api/axiosConfig'
export default {
  props: {
    tabIndex: {
      type: String,
      default: ''
    },
    // 1-系统课，0-体验课
    type: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      channelLevels: [], // 渠道等级
      channelName: [],
      channelClassList: null, // 分类条件
      showDatas: null // 三级列表展示数据
    }
  },
  watch: {
    tabIndex(value) {
      this.channelName = []
      this.channelLevels = []
    }
  },
  async created() {
    await this.getChannelClassList()
    this.formatData(this.channelClassList)
  },
  methods: {
    // 获取渠道来源分类 filter: 过滤关键词  eg：filter:"抖音"
    async getChannelClassList() {
      await axios
        .post('/graphql/v1/toss', {
          query: `{
              ChannelClassList(size: 500){
                id
                channel_class_parent_id
                channel_class_name
              }
            }
          `
        })
        .then((res) => {
          this.channelClassList = res.data.ChannelClassList
        })
    },
    // 查询下拉列表
    formatData(classifiData) {
      // 第一级目录
      const arrList = []
      classifiData.forEach((item) => {
        item.channel_outer_name = item.channel_class_name
      })
      const firstNode =
        classifiData &&
        classifiData.filter((item) => {
          if (+item.channel_class_parent_id !== 0) {
            arrList.push(item)
          }
          return +item.channel_class_parent_id === 0
        })

      firstNode.forEach((item) => (item.children = []))
      arrList.forEach((item, index) => {
        firstNode.forEach((val, idx) => {
          if (+item.channel_class_parent_id === +val.id) {
            val.children.push(item)
          }
        })
      })
      firstNode.forEach(
        (item) =>
          item.children && item.children.forEach((vals) => (vals.children = []))
      )

      const result = firstNode.map((item) => {
        if (item.children && item.children.length === 0) {
          item.children = null
        }
        if (item.children) {
          item.children.forEach((sub) => {
            if (sub.children && sub.children.length === 0) sub.children = null
          })
        }
        return item
      })

      this.showDatas = result
    },
    // 渠道筛选列表变化时调用
    onSelect(data) {
      this.$emit('channelSearchValue', data.length > 0 ? data : '')
    },
    // 渠道等级下拉框变化时调用
    onChangeChannelLevel(data) {
      this.$emit('channelLevelValue', data.length > 0 ? data : '')
    }
  }
}
</script>
<style lang="scss">
.threeSelect {
  .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .el-cascader--mini {
    height: 28px;
    .el-input--mini {
      height: inherit;
      .el-input__inner {
        height: 28px !important;
      }
    }
  }
}

.el-cascader-panel {
  max-height: 300px !important;
}
</style>
