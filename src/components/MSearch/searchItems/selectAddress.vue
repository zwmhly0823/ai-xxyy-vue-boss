<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-21 16:31:03
 * @LastEditors: zhouzebin
 * @LastEditTime: 2020-07-24 15:35:54
 -->
<template>
  <div>
    <el-cascader
      placeholder="省/市/区"
      :options="areaLists"
      :props="{ checkStrictly: true }"
      size="mini"
      filterable
      @change="handleChange"
      clearable
    >
    </el-cascader>
  </div>
</template>

<script>
import areaLists from '@/utils/area.json'
export default {
  name: 'selectAddress',
  props: {
    name: {
      type: Boolean,
      default: false
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      areaLists: areaLists,
      selectData: {}
    }
  },
  methods: {
    // 级联城市级联
    handleChange(data) {
      if (data[0] && data[1] && data[2]) {
        const provinces = this.areaLists.filter(
          (item) => +item.value === +data[0]
        )
        const citys = provinces[0].children.filter(
          (item) => +item.value === +data[1]
        )
        const areas = citys[0].children.filter(
          (item) => +item.value === +data[2]
        )
        this.selectData = {
          provincesCode: provinces[0].label,
          citysCode: citys[0].label,
          areasCode: areas[0].label
        }
      } else if (data[0] && data[1]) {
        const provinces = this.areaLists.filter(
          (item) => +item.value === +data[0]
        )
        const citys = provinces[0].children.filter(
          (item) => +item.value === +data[1]
        )
        this.selectData = {
          provincesCode: provinces[0].label,
          citysCode: citys[0].label
        }
      } else if (data[0]) {
        const provinces = this.areaLists.filter(
          (item) => +item.value === +data[0]
        )
        this.selectData = {
          provincesCode: provinces[0].label
        }
      }

      this.$emit('getAddress', this.selectData)
    }
  }
}
</script>

<style></style>
