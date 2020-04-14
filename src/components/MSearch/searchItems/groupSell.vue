<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-14 17:57:44
 -->
<template>
  <div class="search-item small">
    <el-form @submit.native.prevent>
      <el-autocomplete
        size="mini"
        name="vals"
        clearable
        class="inline-input"
        v-model="input"
        :fetch-suggestions="querySearch"
        :placeholder="tip"
        :trigger-on-focus="false"
        :popper-class="selectData ? 'ppName' : ''"
        @select="inputHandler"
      >
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
        <template slot-scope="{ item }">
          <div style="display:flex">
            <div class="name">{{ item.realname || '-' }}</div>
          </div>
        </template></el-autocomplete
      >
    </el-form>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  props: {
    name: {
      type: String,
      default: 'realname.keyword'
    },
    tip: {
      type: String,
      default: '社群销售'
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
      console.log(val !== old && !val)
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  methods: {
    async querySearch(queryString, cb) {
      const reg = /^([\u4e00-\u9fa5]){0,7}$/
      if (!reg.test(queryString)) {
        this.$message('当前只支持汉字查询')
        this.input = ''
        return
      }
      const searchUid = await this.createFilter(queryString)
      console.log(searchUid, '匹配到的数据')
      const results = queryString ? searchUid : this.selectData
      // 调用 callback 返回建议列表的数据
      console.log(results, '结果')
      cb(searchUid)
    },
    createFilter(queryString) {
      const queryParams = JSON.stringify(`
      {"bool":{"must":[{"wildcard":{"realname.keyword":"*${queryString}*"}}]}}
      `)
      return axios
        .post('/graphql/v1/toss', {
          query: `{TeacherListEx(query:${queryParams}){
    id
    realname
  }
   }       `
        })
        .then((res) => {
          this.selectData = res.data.TeacherListEx
          return this.selectData
        })
    },
    inputHandler(data) {
      this.input = data.realname
      this.$emit('result', { [this.name]: data.id })
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 140px !important;
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
