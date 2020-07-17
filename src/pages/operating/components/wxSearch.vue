<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-07-15 20:45:14
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-17 15:51:57
-->
<template>
  <div class="wx-search">
    <!-- 微信号 -->
    <el-autocomplete
      v-model="weixinInp"
      size="mini"
      clearable
      filterable
      reserve-keyword
      :fetch-suggestions="weixinSearch"
      :trigger-on-focus="false"
      placeholder="微信号搜索"
      @select="onWxSerch"
      ref="wxnum"
    >
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
      <template slot-scope="{ item }">
        <div style="display:flex">
          <div class="name">{{ item.wechat_no || '-' }}</div>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>
<script>
export default {
  props: {
    // 微信搜索状态
    wxSerch: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      weixinInp: ''
    }
  },
  watch: {
    // 监听微信号输入
    weixinInp(val, old) {
      if (val !== old && !val) {
        this.$emit('getWxSerch', '')
      }
    },
    // 侦听手机号输入
    mobileInp(val, old) {
      if (val !== old && !val) {
        this.$emit('getPhone', '')
      }
    },
    // 监听输入wechat_id
    wechatId(val, old) {
      if (val !== old && !val) {
        this.$emit('getWxIdSerch', '')
      }
    },
    // 监听输入wechat_record_id
    wechatRecordId(val, old) {
      if (val !== old && !val) {
        this.$emit('getWechatRecordIdSearch', '')
      }
    }
  },
  methods: {
    // 输入微信号
    async weixinSearch(queryString, cb) {
      const reg = /^\w+$/
      if (!+this.onlyWeixin) {
        if (!reg.test(queryString)) {
          this.weixinInp = ''
          return
        }
      }
      // 输入内容查找到的关联信息（下拉框）
      const list = await this.weixinCreateFilter(queryString)
      // console.log('*****list******', list)
      // cb 展示列表数据
      cb(list)
      this.$refs.wxnum.handleFocus()
    },
    // 调用微信号搜索接口
    weixinCreateFilter(queryString) {
      // 输入内容匹配到的关联信息（下拉框）
      return this.$http.Weixin.getWeChatTeacherListEx(
        'wechat_no.keyword',
        queryString
      ).then((res) => {
        // console.log('微信搜索调用接口', res)
        this.weixinSelectData = res.data.WeChatTeacherListEx || []
        return this.weixinSelectData
      })
    },
    // 微信号搜索（给父组件传值）
    onWxSerch(data) {
      // 输入文本框的值
      console.log(data, 'data', this.wxSerch)
      this.weixinInp = data.wechat_no
      this.$emit(
        'getWxSerch',
        data.wechat_no ? { [this.wxSerch]: data.id } : ''
      )
    }
  }
}
</script>
