<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-13 10:26:43
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-13 10:26:43
 * @Description: 活动订单搜索
 -->
<template>
  <el-card
    border="false"
    shadow="never"
    :class="$style.elard"
    class="search-section"
  >
    <el-form :inline="true" label-position="right" label-width="100px">
      <el-form-item label="订单搜索:" :class="{ [$style.marginer]: true }">
        <order-search class="allmini" @result="getOrderSearch" />
      </el-form-item>
      <el-form-item label="商品类型:" :class="{ [$style.marginer]: true }">
        <product-type name="regtype" @result="getProductType" />
      </el-form-item>
      <el-form-item label="转介绍用户:" :class="{ [$style.marginer]: true }">
        <SearchPhoneAndUsername
          @result="getSendUser"
          :custom-style="{ width: '200px' }"
          placeholder="转介绍人手机号/用户名称"
          name="pay_channel_user"
          type="2"
        />
      </el-form-item>
      <br />
      <el-form-item label="下单时间:" :class="{ [$style.marginer]: true }">
        <date-picker
          :class="[$style.fourPoint, 'allmini']"
          @result="getDate"
          name="ctime"
        >
          <template v-slot:buttons>
            <div class="row_colum margin_l10">
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur0 }"
                @click="today"
                >今日</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur1 }"
                @click="yesterday"
                >昨天</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur2 }"
                @click="thisweek"
                >本周</el-button
              >
              <el-button
                size="mini"
                plain
                :class="{ [$style.cur]: cur3 }"
                @click="thismonth"
                >本月</el-button
              >
            </div>
          </template>
        </date-picker>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import OrderSearch from '@/components/MSearch/searchItems/orderSearch.vue'
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import ProductType from '@/components/MSearch/searchItems/productType.vue'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername'
import { isToss } from '@/utils/index'
export default {
  components: {
    OrderSearch,
    DatePicker,
    ProductType,
    SearchPhoneAndUsername
  },
  data() {
    return {
      cur0: false,
      cur1: false,
      cur2: false,
      cur3: false,
      currentBtn: null,
      must: [],
      should: [],
      teacherId: '' // 判断是否是toss环境还是boss环境
    }
  },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
  },
  methods: {
    // 订单号搜索
    getOrderSearch(res) {
      console.log(res)
      const key = Object.keys(res || {})[0]
      const val = res[key] ? res : ''
      this.setSeachParmas(val, [key])
    },

    // 下单时间
    getDate(res) {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      if (!res || !res.quick) this.currentBtn = null
      if (res.quick && this.currentBtn) this[`cur${this.currentBtn}`] = true
      delete res.quick
      this.setSeachParmas(res, ['ctime'], 'range')
    },
    // 4点外移
    today() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur0 = true
      this.currentBtn = '0'
      const start = new Date(new Date().toLocaleDateString()).getTime() // 设定日期,时间默认0点
      const end = Date.now()
      this.$root.$emit('fourpoint', [start, end])
    },
    yesterday() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur1 = true
      this.currentBtn = '1'
      const yester = new Date()
      yester.setDate(new Date().getDate() - 1)
      yester.toLocaleDateString()
      const start = new Date(
        yester.toLocaleDateString() + ' 00:00:00'
      ).valueOf()
      const end = new Date(yester.toLocaleDateString() + ' 23:59:59').valueOf()
      this.$root.$emit('fourpoint', [start, end])
    },
    thisweek() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur2 = true
      this.currentBtn = '2'
      const week = new Date()
      const reverseDays = week.getDay() ? week.getDay() - 1 : 6
      const start =
        new Date(new Date().toLocaleDateString()).getTime() -
        reverseDays * 86400000
      const end = new Date().getTime()
      this.$root.$emit('fourpoint', [start, end])
    },
    thismonth() {
      for (let i = 0; i < 4; i++) {
        this['cur' + i] = false
      }
      this.cur3 = true
      this.currentBtn = '3'
      const date = new Date()
      date.setDate(1)
      const start = new Date(new Date(date).toLocaleDateString()).getTime()
      const end = new Date().getTime()
      this.$root.$emit('fourpoint', [start, end])
    },

    getProductType(res) {
      if (res.regtype.length === 0) res.regtype = ['4', '5', '6']
      this.setSeachParmas(res, ['regtype'], 'terms')
    },

    getSendUser(res) {
      const data = res === '0' ? '' : res
      this.setSeachParmas(data, ['pay_channel_user'])
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
          if (
            item[extraKey] &&
            item[extraKey][k] &&
            (item[extraKey][k] || +item[extraKey][k] === 0)
          )
            temp.splice(index, 1)
        })
      })
      // must
      if (name === 'must') {
        if (res) {
          temp.push({
            // [`${extraKey}`]: `${JSON.stringify(res)}`
            [extraKey]: res
          })
          this.must = temp
        }
        this.$emit('search', temp)
        return
      }
      // should
      if (res) {
        temp.push({
          [`${extraKey}`]: `${JSON.stringify(res)}`
        })
        this.should = temp
      }
      this.$emit('searchShould', temp)
    }
  }
}
</script>

<style lang="scss" module>
.cur {
  background-color: #ecf5ff;
}
.elard {
  border: none;
  margin-top: 5px;
}
.rw100 {
  width: 140px;
}
.marginer {
  margin-bottom: 2px;
}
.fourPoint {
  display: flex;
}
:global {
  /* 定义多个全局样式 */
  .allmini {
    display: flex;
    align-items: center;
    height: 40px;
  }
  .row_colum {
    display: flex;
  }
  .margin_l10 {
    margin-left: 10px;
  }
}
</style>
<style lang="scss" scoped>
.search-section {
  ::v-deep .el-icon-search {
    top: 14px;
  }
}
</style>
<style scoped>
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
  right: 5px;
}
</style>
