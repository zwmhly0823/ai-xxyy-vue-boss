<!--
 * @Author: liuzhiyuan
 * @LastEditors: liuzhiyuan
-->
<template>
  <div>
    <el-select
      style="width:130px;margin-right:20px"
      v-model="contractId"
      filterable
      remote
      :reserve-keyword="true"
      size="mini"
      clearable
      placeholder="请输入合同名称"
      :remote-method="
        (q) => {
          debounce(getData(q), 500)
        }
      "
      :loading="loading"
      @change="handleSelect"
    >
      <el-option
        v-for="item in contractNumbers"
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
      contractId: '',
      contractNumbers: [] // 合同编码
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
          `/api/c/v1/contract/queryContractFilters?key=${queryString}&keyType=3`
        )
        .then((res) => {
          this.loading = false
          if (res?.code === 0 && res.payload) {
            // 合同编码
            this.contractNumbers = res.payload.keys
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSelect(data) {
      //   data.length > 0 ? (this.result[id] = data) : delete this.result[id]
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
