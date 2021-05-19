<!--
 * @Author: liuzhiyuan
 * @LastEditors: liuzhiyuan
-->
<template>
  <div>
    <el-select
      style="width:180px;margin-right:20px"
      v-model="contractContent"
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      placeholder="请输入对方合同主体全称"
      :remote-method="
        (q) => {
          debounce(getData(q), 500)
        }
      "
      :loading="loading"
      @change="handleSelect"
    >
      <el-option
        v-for="item in contractBodys"
        :key="item"
        :value="item"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
// import _ from 'lodash'
import axios from '@/api/axiosConfig'
export default {
  name: 'contractName',
  props: {
    name: {
      type: String,
      default: ''
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      contractContent: '',
      contractBodys: [] // 合同主体
    }
  },
  created() {
    this.getData()
  },
  computed: {},
  methods: {
    getData(queryString = '') {
      this.loading = true
      axios
        .post(
          `/api/c/v1/contract/queryContractFilters?key=${queryString}&keyType=2`
        )
        .then((res) => {
          this.loading = false
          if (res?.code === 0 && res.payload) {
            // 合同主体
            this.contractBodys = res.payload.keys
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSelect(data) {
      this.$emit('result', data.length > 0 ? { [this.name]: data } : '')
    },
    // 防抖
    debounce(fn, wait) {
      var timeout = null
      return function() {
        if (timeout !== null) clearTimeout(timeout)
        timeout = setTimeout(fn, wait)
      }
    }
  }
}
</script>
