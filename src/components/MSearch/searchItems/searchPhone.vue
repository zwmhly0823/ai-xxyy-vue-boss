<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:28:45
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 18:01:50
 -->
<template>
  <div class="search-item small">
    <el-input
      placeholder="手机号/订单号"
      v-model="input"
      clearable
      @input="inputHandler"
    >
    </el-input>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  data() {
    return {
      input: ''
    }
  },
  computed: {},
  watch: {},
  methods: {
    inputHandler() {
      console.log(this.input, 'data')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped></style>
