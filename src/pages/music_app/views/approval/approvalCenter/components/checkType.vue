<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-05-08 17:37:00
 * @LastEditors: liukun
 * @LastEditTime: 2021-01-30 02:39:58
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="packageDataInner"
      size="mini"
      clearable
      placeholder="审批类型"
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
  created() {},
  data() {
    return {
      productVersion: [
        { name: '退款', value: 'REFUND' },
        { name: '补发货', value: 'REISSUE' },
        { name: '体验课调级申请', value: 'ADJUSTMENT_SUP_TRIAL' },
        { name: '调期申请', value: 'ADJUSTMENT_STAGE' },
        { name: '系统课调级申请', value: 'ADJUSTMENT_SUP' },
        { name: '调班申请', value: 'ADJUSTMENT_CLASS' },
        { name: '随材打包', value: 'PACKAGE_BOX' },
        { name: '无归属订单审批', value: 'UNCREDITED' },
        { name: '赠品', value: 'PROMOTIONS' }
      ],
      packageDataInner: ''
    }
  },
  methods: {
    onChange(data) {
      console.log(data, 'app-container')
      this.$emit('result', data)
    },
    onClear() {
      this.$emit('result', '')
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.search-item {
  margin-right: 20px;
  &.small {
    width: 130px !important;
  }
}
</style>
