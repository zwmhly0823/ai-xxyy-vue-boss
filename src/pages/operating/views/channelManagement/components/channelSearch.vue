<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-04-25 14:55:58
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-25 17:40:56
 -->
<template>
  <div class="channel">
    <div class="channel-search">
      <el-cascader
        style="width:300px;"
        @change="handleChange"
        v-model="channelValue"
        placeholder="请选择渠道"
        :options="channelList"
        :props="optionProps"
        filterable
      ></el-cascader>
    </div>
  </div>
</template>

<script>
export default {
  name: 'channelSearch',
  data() {
    return {
      channelList: [],
      channelValue: '',
      optionProps: {
        value: 'id',
        label: 'name'
      }
    }
  },
  created() {
    this.onCreatedSelect()
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    onCreatedSelect() {
      // 关联老师选择部门
      this.$http.Teacher.getDepartmentTree().then((res) => {
        this.channelList = res.payload
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.channel {
  .channel-search {
    // border: 1px solid red;
    // height: 100px;
  }
}
</style>
