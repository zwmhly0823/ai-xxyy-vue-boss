<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-04-22 15:58:14
 -->
<template>
  <div class="search-item small threeSelect">
    <el-cascader
      placeholder="订单来源"
      size="mini"
      @change="onSelect"
      :options="showDatas"
      :props="{
        multiple: true,
        value: 'id',
        label: 'channel_outer_name',
        emitPath: false,
        checkStrictly: false
      }"
      :show-all-levels="false"
      clearable
    ></el-cascader>
  </div>
</template>

<script>
import axios from '@/api/axios'
export default {
  props: {
    name: {
      type: String,
      default: 'channelid'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      channelList: [],
      channelData: null,
      channelClassData: [],
      channelClassList: null, // 分类条件
      showDatas: null // 三级列表展示数据
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
        .post('/graphql/channel', {
          query: `{
            channelAllList(size: 500) {
                id
                channel_class_id
                channel_outer_name
              }
            }
          `
        })
        .then((res) => {
          this.channelList = res.data.channelAllList
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
    formatData(classdata, classifiData) {
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
      // console.log(firstNode, '第一梯队')
      // console.log(arrList, '分类数减去第一梯队')

      // console.log(classdata, '渠道总数')
      // console.log(classifiData, '渠道分类总数')
      // console.log(this.showDatas)
    },
    onChange(data) {
      console.log(data)
      this.$emit(
        'result',
        data.length > 0 ? { [this.name]: this.channelData } : ''
      )
    },
    onSelect(data) {
      console.log(data)
      this.$emit('result', data.length > 0 ? { [this.name]: data } : '')
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
}

.el-cascader-panel {
  max-height: 300px !important;
}
</style>
