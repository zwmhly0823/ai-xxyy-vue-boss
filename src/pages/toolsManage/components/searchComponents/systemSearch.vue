<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-05-30 18:43:16
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-01 17:27:44
-->
<template>
  <div>
    <el-input
      size="mini"
      style="width:160px;margin-right:20px;"
      v-model="input"
      @input="systemLabelInput"
      placeholder="请输入标签名称搜索"
      clearable
    ></el-input>
    <el-select
      size="mini"
      @change="onClassification"
      v-model="classification"
      placeholder="标签分类"
      clearable
    >
      <el-option
        v-for="item in classificationList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      style="margin-left:20px"
      size="mini"
      @change="onAttribute"
      v-model="attribute"
      placeholder="标签属性"
      clearable
    >
      <el-option
        v-for="item in attributeList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      classificationList: [],
      classification: '',
      attributeList: [
        {
          value: '0',
          label: '恒量'
        },
        {
          value: '1',
          label: '变量'
        }
      ],
      attribute: ''
    }
  },
  // watch: {
  //   tabIndex(value) {
  //     console.log(value, 'watch')
  //     this.input = ''
  //   }
  // }
  created() {
    this.onFindClassifyList()
  },
  methods: {
    onFindClassifyList() {
      this.$http.ToolsManage.findClassifyList().then((res) => {
        const _data = res.payload
        _data.forEach((item) => {
          item.label = item.name
          item.value = item.id
        })
        this.classificationList = _data
      })
    },
    systemLabelInput(data) {
      this.$emit('systemLabelInputValue', data || '')
    },
    onClassification(data) {
      this.$emit('onClassification', data || '')
    },
    onAttribute(data) {
      this.$emit('onAttribute', data || '')
    }
  }
}
</script>

<style></style>
