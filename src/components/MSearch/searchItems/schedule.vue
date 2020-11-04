<!--
 * @Descripttion:课程类型的班级排期 需要传课程类型 teamClass 0是体验课 1是系统课
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-24 18:24:54
 -->
<template>
  <div class="search-item small">
    <el-form @submit.native.prevent>
      <el-autocomplete
        ref="term_autocomplete"
        size="mini"
        name="vals"
        clearable
        class="inline-input"
        v-model="input"
        :fetch-suggestions="querySearch"
        :placeholder="tip"
        :trigger-on-focus="false"
        :popper-class="dataDetail ? 'ppName' : ''"
        @select="inputHandler"
      >
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
        <template slot-scope="{ item }">
          <div style="display:flex">
            <div class="name">{{ item.period_name || '-' }}</div>
          </div>
        </template></el-autocomplete
      >
    </el-form>
  </div>
</template>

<script>
import axios from '@/api/axiosConfig'
export default {
  props: {
    name: {
      type: String,
      default: 'id'
    },
    tip: {
      type: String,
      default: '排期'
    },
    teamClass: {
      type: String,
      default: '' // 获取组件传来的课程类型来获取排期
    }
  },
  components: {},
  data() {
    return {
      input: '',
      dataDetail: [],
      type: ''
    }
  },
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
      const reg = /^[0-9]+/
      if (!reg.test(queryString)) {
        this.input = ''
        return
      }
      const teamList = await this.createFilter(queryString)
      // 调用 callback 返回建议列表的数据
      cb(teamList)
    },

    createFilter(queryString) {
      const queryParams = {
        bool: {
          must: [
            { wildcard: { 'period_name.keyword': `*${queryString}*` } },
            { term: { subject: this.$store.getters.subjects.subjectCode } }
          ]
        }
      }
      if (this.teamClass) {
        queryParams.bool.must.push({ term: { type: `${this.teamClass}` } })
      }
      const q = JSON.stringify(queryParams)
      return axios
        .post('/graphql/v1/toss', {
          query: `{
                  ManagementListEx(query:${JSON.stringify(q)}){
                    id
                    period
                    period_name
                  }
                }`
        })
        .then((res) => {
          this.dataDetail = res.data.ManagementListEx
          return this.dataDetail
        })
    },
    inputHandler(data) {
      this.input = data.period_name
      this.$emit('result', { [this.name]: data.period })
    }
  },
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
  width: 150px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  .el-scrollbar {
    width: 90%;
  }
}
</style>
