<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 19:03:42
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="channelData"
      multiple
      size="mini"
      collapse-tags
      clearable
      filterable
      reserve-keyword
      remote
      :remote-method="remoteMethod"
      placeholder="订单来源"
      @change="onChange"
    >
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
      channelData: null
    }
  },
  async created() {
    await this.getChannel()
  },
  methods: {
    // 获取渠道来源 filter: 过滤关键词  eg：filter:"抖音"
    async getChannel() {
      axios
        .post('/graphql/filter', {
          query: `{
              channelList{
                id
                channel_outer_name
              }
            }
          `
        })
        .then((res) => {
          this.channelList = res.data.channelList
        })
    },
    onChange(data) {
      this.$emit(
        'result',
        data.length > 0 ? { [this.name]: this.channelData } : ''
      )
    },
    remoteMethod(data) {
      if (!data) {
        this.getChannel()
        return
      }
      console.log(data, 'data')
      axios
        .post('/graphql/filter', {
          query: `{
              channelList(filter:"${data}"){
                id
                channel_outer_name
              }
            }
          `
        })
        .then((res) => {
          this.channelList = res.data.channelList
        })
    }
  }
}
</script>
<style lang="scss" scoped></style>
