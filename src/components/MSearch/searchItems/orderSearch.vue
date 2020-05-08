<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:10:01
 * @LastEditors: liukun
 * @LastEditTime: 2020-04-28 15:26:04
 -->
<template>
  <div>
    <el-select
      :class="$style.select"
      v-model="select"
      size="mini"
      slot="prepend"
      placeholder="请选择"
      @change="onChange"
    >
      <el-option label="用户手机号" value="1"></el-option>
      <el-option label="收货人手机号" value="2"></el-option>
      <el-option label="订单号" value="0"></el-option>
    </el-select>
    <el-autocomplete
      placeholder="请输入内容"
      v-model="value"
      size="mini"
      clearable
      :fetch-suggestions="querySearch"
      :maxlength="select !== '0' ? 11 : 50"
      @select="handleSelect"
      ref="input"
    >
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'orderSearch',
  data() {
    return {
      value: '',
      select: '1'
    }
  },
  computed: {
    keyword() {
      let key
      if (this.select === '0') key = 'out_trade_no'
      if (this.select === '1') key = 'uid'
      if (this.select === '2') key = 'uid'
      return key
    }
  },
  methods: {
    onChange(val) {
      console.info(val)
      this.value = ''
    },
    querySearch(query, cb) {
      console.log(query)
      let result = []
      if (!query) {
        cb(result)
        this.$emit('result', { [this.keyword]: '' })
        return
      }
      // 订单号
      if (this.select === '0') {
        this.$http.Order.searchOutTradeNo(query).then((res) => {
          if (res.data && res.data.OrderListEx) {
            result = res.data.OrderListEx.map((item) => {
              if (item.out_trade_no)
                item.value = item.out_trade_no.replace('xiong', '')
              return item
            })
          }
          cb(result)
          // clear输入内容后不能再次显示列表的bug
          this.$refs.input.activated = true
        })
      } else if (this.select === '1') {
        // 下单手机号 -> 用户手机号
        const reg = /^[0-9]*$/
        if (!reg.test(query)) {
          this.value = ''
          return
        }
        this.$http.User.searchUserByPhone(query).then((res) => {
          console.log(res, 'mobile')
          if (res && res.data && res.data.UserListEx) {
            result = res.data.UserListEx.map((item) => {
              item.value = item.mobile
              return item
            })
          }
          cb(result)
          this.$refs.input.activated = true
        })
      } else {
        // 收货人手机号
        // 下单手机号 -> 用户手机号
        const reg = /^[0-9]*$/
        if (!reg.test(query)) {
          this.value = ''
          return
        }
        this.$http.Express.searchExpressByRecieptTel(query).then((res) => {
          console.log(res)
          if (res && res.data && res.data.ExpressListEx) {
            result = res.data.ExpressListEx.map((item) => {
              item.value = item.receipt_tel
              return item
            })
          }
          cb(result)
          this.$refs.input.activated = true
        })
      }
    },
    handleSelect(data) {
      console.log(data)
      const obj = {}
      if (this.select === '0') {
        Object.assign(obj, { [this.keyword]: data.out_trade_no })
      } else if (this.select === '1') {
        Object.assign(obj, { [this.keyword]: data.id })
      } else {
        Object.assign(obj, { [this.keyword]: data.user_id })
      }
      this.$emit('result', obj)
    }
  }
}
</script>

<style lang="scss" module>
.select {
  width: 140px;
}
</style>
