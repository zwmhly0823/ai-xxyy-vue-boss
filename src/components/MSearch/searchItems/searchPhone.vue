<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-01 21:24:03
 -->
<template>
  <div class="search-item small">
    <el-autocomplete
      size="mini"
      name="vals"
      clearable
      class="inline-input"
      v-model="input"
      :fetch-suggestions="querySearch"
      placeholder="手机号查询"
      :trigger-on-focus="false"
      :popper-class="+onlyPhone ? 'ppName' : ''"
      @select="inputHandler"
    >
      <template slot-scope="{ item }">
        <div style="display:flex">
          <div class="name">{{ item.mobile || '-' }}</div>
          <div class="name" v-if="+onlyPhone">
            /{{ item.wechat_nikename || '-' }}
          </div>
        </div>
      </template></el-autocomplete
    >
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  props: {
    name: {
      type: String,
      default: 'out_trade_no'
    },
    onlyPhone: {
      type: String,
      default: '0'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      input: '',
      selectData: []
    }
  },
  computed: {},
  watch: {
    input(val, old) {
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  methods: {
    async querySearch(queryString, cb) {
      const reg = /^[0-9]*$/
      if (!+this.onlyPhone) {
        if (!reg.test(queryString)) {
          this.input = ''
          return
        }
      }
      const searchUid = await this.createFilter(queryString)
      console.log(searchUid, '匹配到的数据')
      const results = queryString ? searchUid : this.selectData
      // 调用 callback 返回建议列表的数据
      console.log(results, '结果')
      cb(searchUid)
    },
    createFilter(queryString) {
      return axios
        .post('/graphql/user', {
          query: `{
              blurrySearch(mobile:"${queryString}") {
                  mobile
                  wechat_nikename
                  id
                }
            }
          `
        })
        .then((res) => {
          this.selectData = res.data.blurrySearch
          return this.selectData
        })
    },
    inputHandler(data) {
      this.input = data.mobile
      this.$emit('result', data.mobile ? { [this.name]: data.id } : '')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 160px !important;
  }
}
</style>
<style lang="scss">
.ppName {
  width: 220px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .el-scrollbar {
    width: 100%;
  }
}
</style>
