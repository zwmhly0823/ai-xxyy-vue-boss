<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: liukun
 * @LastEditTime: 2020-05-18 17:31:02
 -->
<template>
  <div class="search-item small">
    <el-autocomplete
      :size="size"
      name="vals"
      class="inline-input"
      v-model="input"
      clearable
      :fetch-suggestions="querySearch"
      :placeholder="tip"
      :trigger-on-focus="false"
      :popper-class="+onlyPhone ? 'ppName' : ''"
      @select="inputHandler"
    >
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
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
import axios from '@/api/axiosConfig'
import { mapGetters } from 'vuex'

export default {
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    name: {
      type: String,
      default: ''
    },
    onlyPhone: {
      type: String,
      default: '0'
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    },
    // team_id
    teamId: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    tip: {
      type: String,
      default: '手机号查询'
    },
    last_team_id: {
      type: String,
      default: ''
    },
    teamType: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      input: '',
      selectData: []
    }
  },
  computed: {
    ...mapGetters(['team']),
    searchPhone() {
      return (
        (this.team && this.team.userByPhone && this.team.userByPhone.phone) ||
        ''
      )
    }
  },
  watch: {
    input(val, old) {
      // 相当于emit出去一个change
      this.$emit('inputChange')
      console.log(val !== old && !val)
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    },
    searchPhone(val) {
      this.input = val
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
      const queryParams = `{"mobile":"${queryString}","team_id":"${this.teamId}","team_type":"${this.teamType}"}`
      return axios // 未加工
        .post('/graphql/user', {
          query: `{
              blurrySearch(query: ${JSON.stringify(queryParams)}) {
                  mobile
                  wechat_nikename
                  id
                  last_team_id

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
      this.$emit(
        'result',
        this.last_team_id
          ? { [this.last_team_id]: data.last_team_id }
          : data.mobile
          ? { [this.name]: data.id }
          : ''
      )
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.inline-input {
  width: 100%;
}
.search-item {
  &.small {
    width: 140px;
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
