<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-21 20:33:03
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-21 20:41:55
 -->
<template>
  <div class="container">
    <div class="up">
      <right-up @search="search" :dataExp="dataExp" />
    </div>
    <div class="down">
      <right-down :dataExp="dataExp" :search="searchData" />
    </div>
  </div>
</template>

<script>
import rightDown from './rightDown'
import rightUp from './rightUp'
export default {
  props: ['dataExp'],
  components: {
    rightUp,
    rightDown
  },
  data() {
    return {
      searchData: ''
    }
  },
  mounted() {
    console.log(this.dataExp, '00000changer')
  },
  methods: {
    search(search) {
      this.searchData = search
      console.log('search', this.searchData)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .up {
    margin-bottom: 10px;
  }
  .down {
    flex: 1;
  }
}
</style>
