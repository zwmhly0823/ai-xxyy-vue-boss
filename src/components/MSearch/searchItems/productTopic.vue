<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 21:37:03
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="topicData"
      size="mini"
      clearable
      placeholder="选择商品类型"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="item in pruductTopicList"
        :key="item.id"
        :label="item.name"
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
      default: 'topicType'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pruductTopicList: [],
      topicData: null
    }
  },
  watch: {
    topicData(val) {
      console.log(val, 'newTopic')
    }
  },
  async created() {
    await this.getProductTopic()
  },
  methods: {
    // 获取商品主题
    async getProductTopic() {
      axios
        .post('/graphql/filter', {
          query: `{
              productTopic{
                id
                name
              }
            }
          `
        })
        .then((res) => {
          this.pruductTopicList = res.data.productTopic
        })
    },
    onChange(data) {
      this.$emit('result', data ? { [this.name]: data } : '')
    },
    onClear() {
      this.$emit('result', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 138px !important;
  }
}
</style>
