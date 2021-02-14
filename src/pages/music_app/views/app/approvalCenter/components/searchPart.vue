<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-05-16 17:43:36
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-16 18:00:42
-->
<template>
  <div class="container">
    <el-input
      placeholder="申请人/申请人部门"
      v-model="input"
      size="mini"
      clearable
      suffix-icon="el-icon-search"
      @input="inputHandler"
    >
    </el-input>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  data() {
    return {
      input: ''
    }
  },
  watch: {
    input(val, old) {
      if (val !== old && !val) {
        this.$emit('result', '')
      }
    }
  },
  computed: {
    handleDebounce() {
      return debounce(this.inputHandler, 500)
    }
  },
  methods: {
    inputHandler(data) {
      this.$emit('result', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 135px !important;
}
</style>
