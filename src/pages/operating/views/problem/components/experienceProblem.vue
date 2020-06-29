<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-28 18:37:21
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-29 15:20:28
-->
<template>
  <div class="experience-box">
    <div class="topic-choice-text">题型选择</div>
    <div class="topic-choice-box">
      <el-button @click="addItem" type="text">单选题</el-button>
      <br />
      <el-button type="text">多选题</el-button>
      <br />
      <el-button type="text">单项填空题</el-button>
      <br />
    </div>

    <div class="experience-problem-box">
      <div class="experience-problem-text">体验课调查问卷</div>
      <!-- <div style="color:#c2c2c2;">从左侧选择需要添加的题型</div> -->

      <el-form ref="form" :inline="true" :model="inputForm" label-width="100px">
        <!-- <div v-for="(item, index) in summaryList" :key="index"> -->
        <div v-for="(item, index) in inputForm.inputRadioList" :key="index">
          <el-form-item
            :label="index + 1 + '.'"
            :prop="'inputRadioList.' + index + '.name'"
            placeholder="标题"
            :rules="{
              required: true,
              message: '标题不能为空',
              trigger: 'blur'
            }"
          >
            <el-input v-model="item.name"></el-input>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-delete" @click="deleteItem(item, index)"></i>
          </el-form-item>
        </div>
        <!-- </div> -->
      </el-form>
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
  },
  data() {
    return {
      // 所有数据list
      summaryList: [],
      // 单选题input
      inputForm: {
        name: '',
        phone: '',
        inputRadioList: []
      }
    }
  },
  methods: {
    addItem() {
      this.inputForm.inputRadioList.push({
        // name: '',
        // phone: ''
      })
      // this.summaryList.push(this.inputForm)
    },
    deleteItem(item, index) {
      this.inputForm.inputRadioList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.experience-box {
  display: flex;
  .topic-choice-text {
    position: absolute;
    font-size: 24px;
    font-weight: 700;
    top: 20px;
  }
  .topic-choice-box {
    height: 500px;
    width: 150px;
    border-right-style: solid;
    border-right-width: 1px;
    border-right-color: #c2c2c2;
  }

  .experience-problem-box {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .experience-problem-text {
      text-align: center;
      width: 200px;
      border-bottom-style: solid;
      border-bottom-color: #c2c2c2;
      border-bottom-width: 1px;
      position: absolute;
      font-size: 24px;
      font-weight: 700;
      top: 20px;
    }
  }
}
</style>
