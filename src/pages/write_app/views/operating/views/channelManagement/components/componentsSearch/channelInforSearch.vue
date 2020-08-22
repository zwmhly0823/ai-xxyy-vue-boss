<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-22 18:09:05
 -->
<template>
  <div class="search-item small threeSelect">
    <el-input
      size="mini"
      style="width:160px;margin-right:20px;"
      v-model="input"
      @input="channelInput"
      placeholder="请输入渠道ID"
      clearable
    ></el-input>
    <el-cascader
      placeholder="请选择渠道"
      size="mini"
      v-model="channelName"
      @change="onSelect"
      :options="showDatas"
      :props="{
        multiple: true,
        value: 'id',
        label: 'channel_outer_name',
        emitPath: true,
        checkStrictly: false
      }"
      :show-all-levels="true"
      clearable
      filterable
    ></el-cascader>
    <el-select
      style="margin-left:20px;"
      v-model="channelLevel"
      @change="onChangeChannelLevel"
      size="mini"
      placeholder="渠道等级"
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
    name: {
      type: String,
      default: 'channelid'
    }
  },
  data() {
    return {
      input: '',
      channelLevel: '', // 渠道等级
      channelName: [],
      dataList: [],
      channelList: [],
      channelData: null,
      channelClassData: [],
      channelClassList: [], // 分类条件
      showDatas: null // 三级列表展示数据
    }
  },
  watch: {
    tabIndex(value) {
      this.channelName = []
      this.input = ''
    }
  },
  async created() {
    await this.getChannel()
    await this.getChannelClassList()
    this.formatData(this.channelList, this.channelClassList)
  },
  methods: {
    // 获取渠道来源 filter: 过滤关键词  eg：filter:"抖音"
    async getChannel() {
      await axios
        .post('/graphql/v1/toss', {
          query: `{
            ChannelAllList {
                id
                channel_class_id
                channel_outer_name
              }
            }
          `
        })
        .then((res) => {
          this.channelList = res.data.ChannelAllList
        })
    },
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
    formatData(classdata, classifiData = []) {
      if (!classifiData) return
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

      classdata.forEach((content, num) => {
        arrList.forEach((datas, nums) => {
          if (+content.channel_class_id === +datas.id) {
            datas.children.push(content)
          }
        })
      })

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
    onSelect(data) {
      this.$emit('channelSearchValue', data.length > 0 ? data : '')
    },
    onChangeChannelLevel(data) {
      this.$emit('channelLevelValue', data.length > 0 ? data : '')
    },
    channelInput(data) {
      this.$emit('channelInputValue', data || '')
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
