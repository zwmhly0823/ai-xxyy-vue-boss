<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:20:12
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 17:57:46
 -->

<template>
  <el-card class="search-style" shadow="never">
    <el-form :inline="true">
      <el-form-item>
        <!-- 手机号、订单号搜索 -->
        <search-phone @result="getPhoneHander" v-if="phone" :name="phone" />
      </el-form-item>

      <el-form-item>
        <!-- 下单时间 -->
        <date-picker
          v-if="date"
          :name="date"
          @result="getDate"
          :date-placeholder="datePlaceholder"
        />
      </el-form-item>

      <el-form-item>
        <!-- 渠道 -->
        <channel-select @result="getChannel" v-if="channel" :name="channel" />
      </el-form-item>

      <el-form-item>
        <!-- 主题 -->
        <product-topic
          @result="getProductTopic"
          v-if="topicType"
          :name="topicType"
        />
      </el-form-item>
      <el-form-item>
        <stage-sup-levels
          @stageCallBack="stageCallBack"
          @supCallBack="supCallBack"
          @levelCallBack="levelCallBack"
          v-if="level || sup || stage"
          :stageName="stage"
          :supName="sup"
          :levelName="level"
          style="margin-bottom:0px"
        />
      </el-form-item>

      <!-- <el-form-item>
        <el-popover width="100%" trigger="click">
          <stage-sup-levels
            @stageCallBack="stageCallBack"
            @supCallBack="supCallBack"
            @levelCallBack="levelCallBack"
            v-if="level || sup || stage"
            :stageName="stage"
            :supName="sup"
            :levelName="level"
            style="margin-bottom:0px"
          />
          <el-button slot="reference" style="color:#c0c4cc ;font-weight: 400;">
            期数
            <i class="el-icon-arrow-down" />
            难度
            <i class="el-icon-arrow-down" />
            级别
            <i class="el-icon-arrow-down" />
          </el-button>
        </el-popover>
      </el-form-item> -->
    </el-form>
  </el-card>
</template>
<script>
import DatePicker from './searchItems/datePicker.vue'
import ChannelSelect from './searchItems/channel.vue'
import ProductTopic from './searchItems/productTopic.vue'
import StageSupLevels from './searchItems/stageSupLevels.vue'
import SearchPhone from './searchItems/searchPhone.vue'

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
    },
    // 级别
    level: {
      type: String,
      default: '' // current_level
    },
    // 下单时间
    date: {
      type: String,
      default: '' // octime
    },
    // datepicker placeholder
    datePlaceholder: {
      type: String,
      default: '下单时间'
    },
    // 手机号、订单号
    phone: {
      type: String,
      default: '' // phone
    }
  },
  components: {
    ChannelSelect,
    ProductTopic,
    StageSupLevels,
    DatePicker,
    SearchPhone
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
    // 选择订单下单时间
    getDate(res) {
      this.setSeachParmas(res, [this.date || 'octime'], 'range')
    },
    // 选择手机号、订单号
    getPhoneHander(res) {
      this.setSeachParmas(res, [this.phone || 'umobile'], 'wildcard')
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
  .el-card__body {
    padding: 20px 15px 0px 15px;
  }
  // .el-form-item {
  //   margin-bottom: 0px !important;
  // }
}
</style>
