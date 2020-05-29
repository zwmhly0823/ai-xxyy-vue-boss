<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-05-08 17:37:00
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-15 17:43:08
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="packageDataInner"
      size="mini"
      clearable
      placeholder="选择课程"
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
    packageData: {
      type: String,
      default: ''
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.packageDataInner = this.packageData
  },
  data() {
    return {
      productVersion: [
        { name: '体验课', value: 'EXPERIENCE_COURSE' },
        { name: '系统课', value: 'SYSTEM_COURSE' }
      ],
      packageDataInner: ''
    }
  },
  methods: {
    onChange(data) {
      this.$emit('result', data)
    },
    onClear() {
      this.$emit('result', '')
    }
  },
  mounted() {
    this.$root.$on('qingkong', () => {
      this.packageDataInner = ''
    })
  }
}
</script>
<style lang="scss" scoped>
.search-item {
  &.small {
    width: 130px !important;
  }
}
</style>
