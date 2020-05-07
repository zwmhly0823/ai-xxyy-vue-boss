<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-07 11:28:01
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="versionId"
      size="mini"
      clearable
      :disabled="disableClick"
      placeholder="随材版本"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="(item, i) in productVersion"
        :key="i"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
// import axios from '@/api/axios'
import { mapState } from 'vuex'
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productVersion: [
        { name: 'V1.4', value: 'V1.4' },
        { name: 'V1.5', value: 'V1.5' },
        { name: 'V1.6', value: 'V1.6' },
        { name: 'V1.7', value: 'V1.7' }
      ],
      versionId: null
    }
  },
  watch: {
    versionId(val) {
      console.log(val, 'verSionId')
    }
  },
  computed: {
    ...mapState({
      disableClick: (state) => {
        return state.leftbar.disableClick
      }
    })
  },
  // async created() {
  //   await this.getProductTopic()
  // },
  methods: {
    // 获取商品主题
    // async getProductTopic() {
    //   // axios
    //   //   .post('/graphql/filter', {
    //   //     query: `{
    //   //         productTopic{
    //   //           id
    //   //           name
    //   //         }
    //   //       }
    //   //     `
    //   //   })
    //   //   .then((res) => {
    //   //     this.productVersion = res.data.productTopic
    //   //   })
    // },
    onChange(data) {
      console.log(data, '------------data')
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
    width: 108px !important;
  }
}
</style>
