<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-04-25 17:10:01
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-11-10 16:08:15
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
      <el-option label="交易流水号" value="3"></el-option>
    </el-select>
    <el-autocomplete
      placeholder="请输入内容"
      v-model="value"
      size="mini"
      clearable
      :fetch-suggestions="querySearch"
      :maxlength="maxLength"
      @select="handleSelect"
      ref="input"
    >
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'orderSearch',
  props: {
    searchProp: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: '',
      select: '1'
    }
  },
  created() {
    if (this.searchProp && this.searchProp.name) {
      this.value = this.searchProp.value
      this.getUidByPhone(this.searchProp.value)
    }
  },
  computed: {
    keyword() {
      let key
      if (this.select === '0') key = 'out_trade_no'
      if (this.select === '1') key = 'uid'
      if (this.select === '2') key = 'uid'
      if (this.select === '3') key = 'id'
      return key
    },
    maxLength() {
      let len = 11
      if (this.select === '0') len = 50
      if (this.select === '3') len = 28
      return len
    }
  },
  methods: {
    onChange(val) {
      this.$emit('clear')
      this.value = ''
    },
    querySearch(query, cb) {
      console.log('sssssssssssssssssssss')
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
                item.value = item.out_trade_no.replace('yy','')
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
        this.$http.Base.getUserNumPhone(query).then((res) => {
          console.log(res, 'mobile')
          if (res && res.data && res.data.UserExtendsListEx) {
            result = res.data.UserExtendsListEx.map((item) => {
              item.value = item.mobile
              return item
            })
          }
          cb(result)
          this.$refs.input.activated = true
        })
      } else if (this.select === '2') {
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
      } else {
        // 交易流水号
        const reg = /^[0-9]*$/
        if (!reg.test(query)) {
          this.value = ''
          return
        }
        const params = {
          // 'transaction_id.like': {
          //   'transaction_id.keyword': `*${this.value}*`
          // },
          transaction_id: this.value,
          status: 2,
          type: 1
        }
        this.$http.Order.searchPaymentPayV2(params).then((res) => {
          if (res?.data?.PaymentPayList) {
            result = res.data.PaymentPayList.map((item) => {
              item.value = item.transaction_id
              return item
            })
          }
          cb(result)
          this.$refs.input.activated = true
        })
      }
    },
    getUidByPhone(num) {
      // this.$http.User.searchUserByPhone(num).then((res) => {
      this.$http.Base.getUserNumPhone(num).then((res) => {
        if (res?.data?.UserExtendsListEx?.length) {
          this.$emit('result', {
            uid: res.data.UserExtendsListEx[0].u_id
          })
        }
        setTimeout(() => {
          localStorage.removeItem('noticeParams')
        }, 0)
      })
    },
    handleSelect(data) {
      const obj = {}
      
      if (this.select === '0') {
        Object.assign(obj, { [this.keyword]: data.out_trade_no })
      } else if (this.select === '1') {
        Object.assign(obj, { [this.keyword]: data.u_id })
      } else if (this.select === '2') {
        Object.assign(obj, { [this.keyword]: data.user_id })
      } else {
        Object.assign(obj, { [this.keyword]: data.oid })
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
