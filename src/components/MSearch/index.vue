<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:20:12
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 15:15:45
 -->

<template>
  <el-card class="search-style" shadow="never">
    <el-form :inline="true">
      <el-form-item>
        <!-- 有无收货地址 -->
        <has-receiptaddress
          @result="getHasaddress"
          v-if="hasaddress"
          :name="hasaddress"
        />
      </el-form-item>
      <el-form-item>
        <!-- 下拉时间选择 -->
        <data-select v-if="changeData" :name="changeData"></data-select>
      </el-form-item>
      <el-form-item>
        <!-- 渠道 -->
        <channel-select
          @result="getChannel"
          v-if="channel"
          :name="channel"
        ></channel-select>
      </el-form-item>

      <el-form-item>
        <!-- 主题 -->
        <product-topic
          @result="getProductTopic"
          v-if="topicType"
          :name="topicType"
        ></product-topic>
      </el-form-item>
      <el-popover width="100%" trigger="click">
        <!-- 期数、难度、级别 -->
        <stage-sup-levels
          @stageCallBack="stageCallBack"
          @supCallBack="supCallBack"
          @levelCallBack="levelCallBack"
          v-if="level || sup || stage"
          :stageName="stage"
          :supName="sup"
          :levelName="level"
        ></stage-sup-levels>
        <el-button slot="reference">期数、难度、级别</el-button>
      </el-popover>
    </el-form>
  </el-card>
</template>
<script>
import HasReceiptaddress from './searchItems/localSelect.vue'
import DataSelect from './searchItems/dateSelect.vue'
import ChannelSelect from './searchItems/channel.vue'
import ProductTopic from './searchItems/productTopic.vue'
import StageSupLevels from './searchItems/stageSupLevels.vue'

export default {
  props: {
    // 有无收货地址
    hasaddress: {
      type: String,
      default: '' // hasaddress
    },
    changeData: {
      type: String,
      default: '' // hasaddress
    },
    // 渠道
    channel: {
      type: String,
      default: '' // channelid
    },
    // 主题
    topicType: {
      type: String,
      default: '' // topicType
    },
    // 期数
    stage: {
      type: String,
      default: '' // stage
    },
    // 难度
    sup: {
      type: String,
      default: '' // sup
    }, // 级别
    level: {
      type: String,
      default: '' // current_level
    }
  },
  components: {
    HasReceiptaddress,
    DataSelect,
    ChannelSelect,
    ProductTopic,
    StageSupLevels
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
      this.setSeachParmas(res, [this.hasaddress || 'hasaddress'])
    },
    // 选择渠道
    getChannel(res) {
      this.setSeachParmas(res, [this.channel || 'channelid'], 'terms')
    },
    // 主题
    getProductTopic(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.topicType || 'topicType'])
    },
    // 期数
    stageCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.stage || 'stage'])
    },
    // 难度
    supCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.sup || 'sup'])
    },
    // 级别
    levelCallBack(res) {
      console.log(res, 'res')
      this.setSeachParmas(res, [this.level || 'current_level'])
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
<style lang="scss" scoped>
.search-style {
  margin-bottom: 10px;
}
</style>
<style lang="scss">
.search-style {
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
</style>
