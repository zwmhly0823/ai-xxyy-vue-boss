<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-26 20:12:18
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="channelData"
      multiple
      collapse-tags
      clearable
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
  watch: {
    channelData(val) {
      console.log(val)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 180px !important;
  }
}
</style>
