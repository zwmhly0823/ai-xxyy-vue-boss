<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-20 15:22:37
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-20 15:22:37
 * @Description: 简单 select 组件
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="value"
      @change="onChange"
      clearable
      :multiple="multiple"
      :placeholder="placeholder"
      :style="myStyle"
      size="mini"
      class="item-style"
    >
      <el-option
        v-for="(item, index) in dataList"
        :key="index"
        :label="item.text"
        :value="item.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    // 希望返回的字段名
    name: {
      type: String,
      default: '',
    },
    // placeholder
    placeholder: {
      type: String,
      default: '',
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    // 自定义style样式
    myStyle: {
      type: Object,
      default: () => {},
    },
    searchProp: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      value: [],
      // dataList: []
    }
  },
  created() {
    // search有默认值时
    if (this.searchProp && this.name === this.searchProp.name) {
      let index
      this.dataList.forEach((dItem, dKey) => {
        if (+dItem.id === +this.searchProp.value) {
          index = dKey
        }
      })
      this.value = this.dataList[index].id
      this.onChange(this.searchProp.value)
      setTimeout(() => {
        localStorage.removeItem('noticeParams')
      }, 0)
    }
  },
  methods: {
    onChange(data) {
      this.$emit('result', data !== '' ? { [this.name]: data } : '')
    },
  },
}
</script>
<style lang="scss" scoped>
.search-item {
  .item-style {
    width: 140px;
  }
}
</style>
