<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:20:12
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-24 19:54:16
 -->

<template>
  <el-card class="search-style" shadow="never">
    <el-form>
      <el-form-item>
        <!-- 有无收货地址 -->
        <has-receiptaddress
          @result="getHasaddress"
          v-if="hasaddress"
          :name="hasaddress"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import HasReceiptaddress from './searchItems/hasReceiptaddress.vue'
export default {
  props: {
    // 有无收货地址
    hasaddress: {
      type: String,
      default: '' // hasaddress
    }
  },
  components: {
    HasReceiptaddress
  },
  data() {
    return {
      showErr: false,
      errTips: '搜索条件不能为空',
      must: [],
      should: []
    }
  },
  computed: {},
  methods: {
    // 有无收货地址
    getHasaddress(res) {
      this.setSeachParmas(res, [this.hasaddress])
    },

    /**  处理接收到的查询参数
     * @res: Object, 子筛选组件返回的表达式对象，如 {sup: 2}
     * @key: Array 指定res的key。如课程类型+期数选项，清除课程类型时，期数也清除了，这里要同步清除must的数据
     * @extraKey: String 默认must数组的每项值为 {term: {}}, 如果不为 term，单独指定
     * 如 {range: {lte:0,gte:0}} -> 'range'
     * @name: String 结果放到上层表达式中的位置，默认must. 可指定 should
     */
    setSeachParmas(res, key = [], extraKey = 'term', name = 'must') {
      const { must, should } = this
      const temp = name === 'must' ? must : should
      key.forEach((k) => {
        temp.forEach((item, index) => {
          if (item[extraKey] && (item[extraKey][k] || +item[extraKey][k] === 0))
            temp.splice(index, 1)
        })
      })
      // must
      if (name === 'must') {
        if (res) {
          temp.push({
            [extraKey]: res
          })
          this.must = temp
        }
        // emit result to parent component
        // 父组件的 page 设为1
        this.$emit('search', temp)
        return
      }
      // should
      if (res) {
        temp.push({
          [extraKey]: res
        })
        this.should = temp
      }
      this.$emit('searchShould', temp)
    }
  }
}
</script>

<style lang="scss">
.search-style {
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
