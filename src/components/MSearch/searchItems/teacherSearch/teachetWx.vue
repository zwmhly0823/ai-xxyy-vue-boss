<template>
  <div class="search-item small">
    <el-select
      v-model="weixinInp"
      class="wx-style"
      clearable
      filterable
      multiple
      :filter-method="weixinCreateFilter"
      @remove-tag="removeTag"
      placeholder="选择微信号"
      @change="onWxSerch"
      @focus="inputFocus"
    >
      <el-option
        v-for="item in weixinSelectData"
        :key="item.id"
        :label="item.wechat_no"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    // 微信搜索状态
    teacherwx: {
      type: String,
      default: ''
    },
    WeChat: {
      type: Array,
      default: null
    },
    onlyWeixin: {
      type: String,
      default: '0'
    },
    onlyPhone: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      // 搜索结果数组
      input: '',
      weixinSelectData: [],
      ids: [],
      select: '1',
      showNewWeChat: false,
      weixinInp: []
    }
  },
  watch: {
    // 监听微信号输入
    weixinInp(val, old) {
      if (val !== old && !val) {
        this.$emit('getWxSerch', '')
      }
    },
    WeChat(val) {
      console.log(val, '000000')
      this.weixinInp = []
      if (val && val.length > 0) {
        val.forEach((val) => {
          const obj = {}
          obj[val.weixinNo] = val.id
          console.log(obj, 'obj')
          this.ids.push(obj)
          this.weixinInp.push(val.weixinNo)
        })
      }
      console.log(this.weixinInp, 'this.weixinInp')
    }
  },
  methods: {
    removeTag(val1) {
      const newarr = []
      this.ids.forEach((item) => {
        for (var key in item) {
          newarr.push(key)
        }
      })
      const majorIndex = newarr.findIndex((item) => {
        return item === +val1
      })
      this.ids.splice(majorIndex, 1)
      // this.ids.forEach((val, index) => {
      //   this.weixinInp.forEach((item) => {
      //     if (Object.keys(val).toString() === item) {
      //       this.ids.splice(index, 1)
      //     }
      //   })
      // })
      console.log(this.ids, 'this.ids')
    },
    inputFocus(val, ind) {
      if (
        this.weixinInp.length === 0 ||
        (this.WeChat && this.WeChat.length !== 0)
      ) {
        this.defaultWx()
      }
    },
    // 默认展示
    defaultWx() {
      this.$http.Teacher.WeChatTeacherList().then((res) => {
        this.weixinSelectData = res.data.WeChatTeacherList
      })
    },
    // 调用微信号搜索接口
    weixinCreateFilter(queryString) {
      // 输入内容匹配到的关联信息（下拉框）
      this.$http.Teacher.getWeChatTeacherListEx(
        'wechat_no.keyword',
        queryString
      ).then((res) => {
        // console.log('微信搜索调用接口', res)
        this.weixinSelectData = res.data.WeChatTeacherListEx || []
        console.log('weixinSelectData', this.weixinSelectData)
      })
    },
    // 微信号搜索（给父组件传值）
    onWxSerch(data) {
      console.log(data, '89898989')
      this.$emit('getWxTeacher', data ? { [this.teacherwx]: data } : '')
    }
  }
}
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.wx-style {
  width: 350% !important;
}
</style>
