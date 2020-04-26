<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-26 17:48:57
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-26 17:48:57
 * @Description: 系统课类型 0-双周，3-单周
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="type"
      size="mini"
      clearable
      placeholder="体验课类型"
      @change="onChange"
    >
      <el-option
        v-for="item in list"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: '',
      list: [
        {
          value: '0',
          label: '双周'
        },
        {
          value: '3',
          label: '单周'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    width: 140px !important;
  }
}
</style>
