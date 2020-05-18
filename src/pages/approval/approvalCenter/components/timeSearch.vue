<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-05-15 16:43:26
 * @LastEditors: Lukun
 * @LastEditTime: 2020-05-16 17:09:16
-->
<template>
  <div class="select-data-box">
    <select-date
      :name="timeSelectList"
      @result="getTimeData"
      @timeCallBack="getTimeCallBack"
      @clear="onClear"
    />
  </div>
</template>

<script>
import selectDate from '@/components/MSearch/searchItems/selectDate.vue'
export default {
  components: {
    selectDate
  },
  data() {
    return {
      timeSelectList: [{ text: '发起时间', value: 'ctime' }]
    }
  },
  methods: {
    getTimeData(data) {
      this.$emit('result', data)
    },
    onClear() {
      this.$emit('result', '')
    },
    getTimeCallBack(data) {
      console.log('文笔', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.select-data-box {
  margin: 20px;
}
</style>
