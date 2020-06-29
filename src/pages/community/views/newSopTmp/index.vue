<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-29 18:52:01
-->
<template>
  <el-row type="flex" class="new-sop app-main">
    <el-col class="new-sop-container">
      <div class="scroll-container">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div>new-sop</div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {}
  },
  components: {},
  computed: {},
  methods: {}
}
</script>
<style rel="stylesheet/scss" lang="scss">
.new-sop {
  .new-sop-container {
    position: relative;
    margin: 10px;
    background: #fff;
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
    .scroll-container {
      background: white;
      height: 100%;
      display: flex;
      flex-direction: column;
      .scrollbar-wrapper {
        overflow-x: hidden;
      }
      .el-scrollbar {
        flex: 1;
      }
    }
  }
}
</style>
