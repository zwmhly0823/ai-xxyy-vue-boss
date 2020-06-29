<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-28 18:37:21
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-29 10:48:41
-->
<template>
  <div class="experience-box">
    <div class="topic-choice-box">
      <div>题型选择</div>
      <el-button type="text">单选题</el-button>
      <br />
      <el-button type="text">多选题</el-button>
      <br />
      <el-button type="text">单项填空题</el-button>
      <br />
    </div>
    <div class="experience-problem-box">
      <div>体验课调查问卷</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ruleForm: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.experience-box {
  display: flex;
  .topic-choice-box {
    height: 500px;
  }
  .experience-problem-box {
  }
}
</style>
