<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-22 20:07:47
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-22 20:07:47
 * @Description: 模糊搜索用户手机号和用户名称 username
 * 通过 u_user表中的 status 区分体验课用户和系统课用户
    status = 1 或 status = 2, 体验课
    status > 2, 体验课
 -->
<template>
  <div class="search-item small">
    <el-select
      class="item-style"
      :style="customStyle"
      v-model="value"
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      :placeholder="placeholder"
      :remote-method="handleDebounce"
      :loading="loading"
      @change="onChange"
    >
      <el-option
        v-for="item in dataList"
        :key="item.id"
        :label="`${item.mobile} / ${item.username}`"
        :value="item.id"
      ></el-option>
    </el-select>
    <i class="el-icon-search"></i>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import axios from '@/api/axiosConfig'
export default {
  props: {
    customStyle: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: ''
    },
    // 1-系统课，0-体验课 2-全部
    type: {
      type: String,
      default: '0'
    },
    placeholder: {
      type: String,
      default: '请输入学员手机号或昵称'
    }
  },
  data() {
    return {
      loading: false,
      value: '',
      dataList: []
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.getData, 500)
    }
  },
  created() {
    // this.getData()
  },
  methods: {
    getData(value = '') {
      if (!value) return
      this.loading = true
      // 系统课
      let range = {
        range: { status: { gt: 2 } }
      }
      // 体验课
      if (this.type === '0') {
        range = { terms: { status: ['1', '2'] } }
      }
      // 全部
      if (this.type === '2') {
        range = {
          range: { status: { gt: 0 } }
        }
      }
      const query = `{"bool":{"must":[${JSON.stringify(
        range
      )}],"filter":{"bool":{"should":[{"wildcard":{"username.keyword":"*${value}*"}},{"wildcard":{"mobile.keyword":"*${value}*"}}]}}}}`
      const q = JSON.stringify(query)

      const sort = `{"id":"desc"}`
      axios
        .post('/graphql/v1/toss', {
          query: `{
                  UserListEx(query: ${q}, sort: ${JSON.stringify(sort)}){
                    id
                    username
                    mobile
                  }
                }`
        })
        .then((res) => {
          this.loading = false
          this.dataList = res.data.UserListEx
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取选中的
    onChange(data) {
      console.log(data)

      this.$emit('result', data ? { [this.name]: data } : '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  position: relative;
  .item-style {
    width: 140px;
    /deep/ input {
      padding-left: 25px;
    }
  }
  i {
    position: absolute;
    left: 10px;
    top: 7px;
    color: #999;
  }
}
</style>
