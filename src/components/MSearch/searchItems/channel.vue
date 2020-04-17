<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-17 15:55:43
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="channelData"
      multiple
      size="mini"
      clearable
      reserve-keyword
      placeholder="订单来源"
      @change="onChange"
    >
      <!-- remote -->
      <!-- filterable -->
      <!-- :remote-method="remoteMethod" -->
      <el-option
        v-for="item in channelList"
        :key="item.id"
        :label="item.channel_outer_name"
        :value="item.id"
      >
      </el-option>
    </el-select>
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
      channelClassList: null // 分类条件
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
            ChannelList(size: 200) {
                id
                channel_class_id
                channel_outer_name
              }
            }
          `
        })
        .then((res) => {
          this.channelList = res.data.ChannelList
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
    formatData(data, classifiData) {
      console.log(data)
      console.log(classifiData)
    },
    onChange(data) {
      this.$emit(
        'result',
        data.length > 0 ? { [this.name]: this.channelData } : ''
      )
    }
  }
}
</script>
<style lang="scss" scoped></style>
