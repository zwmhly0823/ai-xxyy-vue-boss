<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-08-15 15:42:18
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-15 17:13:28
-->
<template>
  <el-row type="flex" class="app-main coupon">
    <el-col class="coupon-content">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div ref="tableContainer"></div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },

  created() {},

  mounted() {},

  methods: {}
}
</script>

<style lang="scss" scoped>
.coupon {
  &-content {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .team-name-pointer {
    cursor: pointer;
    color: #2a75ed;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
  }
  .opt {
    color: #2a75ed;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
