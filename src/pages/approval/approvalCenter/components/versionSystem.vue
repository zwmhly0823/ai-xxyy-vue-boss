<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-24 18:50:54
 * @LastEditors: Lukun
 * @LastEditTime: 2020-06-02 11:20:19
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="versionId"
      size="mini"
      clearable
      placeholder="随材版本"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="(item, i) in productVersion"
        :key="i"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      productVersion: [],
      versionId: null
    }
  },
  mounted() {
    this.getProductVersion(this.params)
  },
  methods: {
    // 获取多版本盒子
    getProductVersion(params) {
      console.log(params, '---------------------------------')
      this.$http.Teacher.getVersionByCourseVersion(params).then((res) => {
        if (res && res.payload) {
          this.productVersion = res.payload.map((item) => {
            return { name: item.code, value: item.value }
          })
        }
      })
    },
    onChange(data) {
      console.log(data, '------------data')
      this.$emit('result', data ? { [this.name]: data } : '')
    },
    onClear() {
      this.$emit('result', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 108px !important;
  }
}
</style>
