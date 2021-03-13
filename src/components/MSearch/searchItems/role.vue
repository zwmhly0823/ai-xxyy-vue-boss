<!--
 * @Descripttion:
 * @version:
 * @Author: songyanan
 * @Date: 2020-06-13 15:39:25
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-13 15:43:00
 -->
<template>
  <el-select
    v-model="selectedValue"
    :size="size"
    clearable
    placeholder="员工角色"
    @change="handleSelect"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
    </el-option>
  </el-select>
</template>

<script>
import consigneePhoneVue from './consigneePhone.vue'
export default {
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    devalueValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedValue: null || this.devalueValue,
      options: []
    }
  },
  mounted() {
    this.getRole()
  },
  methods: {
    async getRole() {
      try {
        const res = await this.$http.SystemRole.getRoleList({
          pageNumber: 1,
          pageSize: 1000,
        })
        this.options = res.payload.content;
        localStorage.setItem('roleLit', JSON.stringify(this.options))
      } catch (error) {
        console.log(error)
      }
    },
    handleSelect(val) {
      this.$emit('result', val)
    }
  }
}
</script>

<style lang="scss" scoped></style>
