<!--
 * @Descripttion:
 * @version:
 * @Author: songyanan
 * @Date: 2020-06-13 15:39:25
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-13 15:43:00
 -->
<template>
  <div class="role">
    <el-col :span="11">
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
    </el-col>
    <el-col :span="15" :offset="1" v-if="isShow">
      <el-input
        v-model="phoneNumber"
        type="number"
        oninput="if(value.length>11)value=value.slice(0,11)"
        clearable
        @change="selectPhone"
        @clear="clearPhone"
        placeholder="请输入手机号码"
      ></el-input>
    </el-col>
    <el-col :span="15" :offset="1" v-if="isShow">
      <el-input
        v-model="name"
        type="text"
        oninput="if(value.length>11)value=value.slice(0,11)"
        clearable
        @change="selectName"
        @clear="clearName"
        placeholder="请输入姓名"
      ></el-input>
    </el-col>
  </div>
</template>

<script>
import consigneePhoneVue from './consigneePhone.vue'
export default {
  props: {
    size: {
      type: String,
      default: 'mini',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    devalueValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedValue: null || this.devalueValue,
      options: [],
      phoneNumber: '',
      name:''
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
        this.options = res.payload.content
        localStorage.setItem('roleLit', JSON.stringify(this.options))
      } catch (error) {
        console.log(error)
      }
    },
    handleSelect(val) {
      this.$emit('result', val)
    },
    selectPhone(val) {
      this.$emit('resultPhone', val)
    },
    selectName(val) {
      this.$emit('resultName', val)
    },
    clearName(val) {
      this.$emit('resultName', val)
    },
    clearPhone(val) {
      this.$emit('resultPhone', val)
    },
  },
}
</script>

<style lang="scss" scoped>
.role {
  display: flex;
}
/deep/ .el-input__inner {
  height: 28px;
}

/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
/deep/ input[type='number'] {
  -moz-appearance: textfield !important;
}
</style>
