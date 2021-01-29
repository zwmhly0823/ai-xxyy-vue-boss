<template>
  <div class="search-item small">
    <!-- 微信号 -->
    <el-autocomplete
      v-model="weixinInp"
      size="mini"
      clearable
      filterable
      reserve-keyword
      :fetch-suggestions="weixinSearch"
      :trigger-on-focus="false"
      :popper-class="+onlyWeixin ? 'ppName' : ''"
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
    <!-- 手机号 -->
    <el-autocomplete
      v-model="mobileInp"
      size="mini"
      clearable
      filterable
      reserve-keyword
      :fetch-suggestions="phoneSearch"
      :trigger-on-focus="false"
      :popper-class="+onlyPhone ? 'ppName' : ''"
      placeholder="手机号搜索"
      @select="onPhoneSerch"
      ref="wxphone"
    >
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
      <template slot-scope="{ item }">
        <div style="display:flex">
          <div class="name">{{ item.phone || '-' }}</div>
        </div>
      </template>
    </el-autocomplete>

    <!-- 使用状态 -->
    <!-- <el-select
      v-model="statueData"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="全部状态"
      @change="onWxStatus"
    >
      <el-option
        v-for="item in status"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select> -->
    <!-- 是否关联老师 -->
    <el-select
      v-model="concatTeacherData"
      size="mini"
      clearable
      filterable
      reserve-keyword
      placeholder="是否已关联老师"
      @change="onWxConcatTeacher"
    >
      <el-option
        v-for="item in concatTeacher"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <!-- wxid搜索 -->
    <el-autocomplete
      v-model="wechatId"
      size="mini"
      clearable
      filterable
      reserve-keyword
      :fetch-suggestions="wxIdSerch"
      :trigger-on-focus="false"
      placeholder="微信ID搜索"
      @select="onWxIdSerch"
      ref="wxid"
      class="custom-width"
    >
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
      <template slot-scope="{ item }">
        <div style="display:flex">
          <div class="name">{{ item.wechat_id || '-' }}</div>
        </div>
      </template>
    </el-autocomplete>
    <!-- 艾客wxid搜索 -->
    <el-autocomplete
      v-model="wechatRecordId"
      size="mini"
      clearable
      filterable
      reserve-keyword
      :fetch-suggestions="wxRecordIdSerch"
      :trigger-on-focus="false"
      placeholder="艾客微信ID搜索"
      @select="onWxRecordSerch"
      ref="wxrid"
    >
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
      <template slot-scope="{ item }">
        <div style="display:flex">
          <div class="name">{{ item.wechat_record_id || '-' }}</div>
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
    },
    // 手机号码搜索状态
    wxTeacherPhone: {
      type: String,
      default: ''
    },
    // 使用状态
    wxStatus: {
      type: String,
      default: ''
    },
    // 是否关联老师状态
    wxConcatTeacher: {
      type: String,
      default: ''
    },
    onlyWeixin: {
      type: String,
      default: '0'
    },
    onlyPhone: {
      type: String,
      default: '0'
    },
    // wechat_id
    wxId: {
      type: String,
      default: 'wechat_id'
    },
    // wechat_id
    wxRecordId: {
      type: String,
      default: 'wechat_record_id'
    }
  },
  data() {
    return {
      // 搜索结果数组
      input: '',
      weixinSelectData: [],
      phoneSelectData: [],
      select: '1',
      showNewWeChat: false,
      mobileInp: '',
      weixinInp: '',
      wechatId: '',
      wechatRecordId: '',
      status: [
        { name: '启用', id: '0' },
        {
          name: '停用',
          id: '1'
        }
      ],
      concatTeacher: [
        {
          name: '是',
          id: '1'
        },
        {
          name: '否',
          id: '0'
        }
      ],
      // 使用状态value
      statueData: null,
      // 是否关联老师value
      concatTeacherData: null,
      selectedInput: 0
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
      console.log(this.onlyWeixin)

      // const reg = /^\w+$/
      // if (!+this.onlyWeixin) {
      //   if (!reg.test(queryString)) {
      //     this.weixinInp = ''
      //     return
      //   }
      // }
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
    // 输入的手机号
    async phoneSearch(queryString, cb) {
      const reg = /^[0-9]*$/
      if (!+this.onlyPhone) {
        if (!reg.test(queryString)) {
          this.mobileInp = ''
          return
        }
      }
      const list = await this.phoneCreateFilter(queryString)
      cb(list)
      this.$refs.wxphone.handleFocus()
    },
    // 调用手机号搜索接口
    phoneCreateFilter(queryString) {
      return this.$http.Weixin.getTeacherListEx(
        'phone.keyword',
        queryString
      ).then((res) => {
        this.phoneSelectData = res.data.TeacherListEx || []
        return this.phoneSelectData
      })
    },
    // 微信号搜索（给父组件传值）
    onWxSerch(data) {
      // 输入文本框的值
      this.weixinInp = data.wechat_no
      this.$emit(
        'getWxSerch',
        data.wechat_no ? { [this.wxSerch]: data.wechat_no } : ''
      )
    },
    // 微信ID搜索（给父组件传值）
    onWxIdSerch(data) {
      console.log('====data====', data)
      // 输入文本框的值
      this.wechatId = data.wechat_id
      this.$emit(
        'getWxIdSerch',
        data.wechat_id ? { [this.wxId]: data.wechat_id } : ''
      )
    },
    // 艾客微信号搜索（给父组件传值）
    onWxRecordSerch(data) {
      // console.log('+_+_+_+_+_this.weixinInp+_+_+_+_+_+_+_+_', this.weixinInp)
      this.wechatRecordId = data.wechat_record_id
      this.$emit(
        'getWechatRecordIdSearch',
        data.wechat_record_id
          ? { [this.wxRecordId]: data.wechat_record_id }
          : ''
      )
      // this.wxSerch字段名称
      // console.log('$+++wxInput.vue+++$$wxSerch$$$', this.wxSerch)
    },
    // 老师手机号搜索（给父组件传值）
    onPhoneSerch(data) {
      this.mobileInp = data.phone
      let teacherId = ''
      this.phoneSelectData.forEach((item) => {
        if (item.phone === data.phone) {
          teacherId = item.id
        }
      })
      this.$emit(
        'getPhone',
        data.phone ? { [this.wxTeacherPhone]: teacherId } : ''
      )
    },
    // 使用状态搜索（给父组件传值）
    onWxStatus(data) {
      this.$emit(
        'getWxStatus',
        data ? { [this.wxStatus]: this.statueData } : ''
      )
    },
    // 是否关联老师（给父组件传值）
    onWxConcatTeacher(data) {
      this.$emit(
        'getWxConcatTeacher',
        data ? { [this.wxConcatTeacher]: this.concatTeacherData } : ''
      )
    },
    // 输入wxid
    async wxIdSerch(queryString, cb) {
      // 输入内容查找到的关联信息（下拉框）
      const list = await this.weixinidCreateFilter('wechat_id', queryString)
      // cb 展示列表数据
      cb(list)
      this.$refs.wxid.handleFocus()
    },
    // 输入wxid
    async wxRecordIdSerch(queryString, cb) {
      // 输入内容查找到的关联信息（下拉框）
      const list = await this.weixinidCreateFilter(
        'wechat_record_id',
        queryString
      )
      // cb 展示列表数据
      cb(list)
      this.$refs.wxrid.handleFocus()
    },
    // 调用微信ID搜索接口
    weixinidCreateFilter(id, queryString) {
      // 输入内容匹配到的关联信息（下拉框）
      return this.$http.Weixin.getWechatIdListEx(id, queryString).then(
        (res) => {
          console.log('微信搜索调用接口', res)
          this.weixinSelectData = res.data.WeChatTeacherListEx || []
          return this.weixinSelectData
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 100%;
    display: flex;
    /deep/ .item-style {
      width: 140px !important;
      margin-left: 20px !important;
    }
    /deep/.el-input__inner {
      width: 140px !important;
      margin-left: 20px;
    }
    .custom-width {
      /deep/.el-input__inner {
        width: 180px !important;
        margin-left: 20px;
      }
    }
  }
}
</style>
