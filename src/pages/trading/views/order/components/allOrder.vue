<template>
  <div>
    <article class="top-box">
      <!-- <div class="total-orider">1</div>
      <div class="experience-orider">2</div>
      <div class="system-orider">3</div>
      <div class="bear-orider">4</div>
      <div class="recommended-order">5</div> -->
      <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">1</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">2</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">3</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">4</div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">5</div></el-col>
      </el-row>
    </article>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.top-box {
  width: 100%;
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
}
</style>
