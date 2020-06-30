<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-28 18:37:21
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-30 21:09:41
-->
<template>
  <div class="experience-box">
    <div class="topic-choice-text">题型选择</div>
    <div class="topic-choice-box">
      <el-button @click="addItemRadio" type="text">单选题</el-button>
      <br />
      <el-button @click="addItemCheckboxType" type="text">多选题</el-button>
      <br />
      <el-button @click="addItemFillInTheBlanksType" type="text"
        >单项填空题</el-button
      >
      <br />
    </div>

    <div
      v-if="ruleForms.summaryList.length <= 0"
      class="experience-problem-box"
    >
      <div class="experience-problem-text">体验课调查问卷</div>
      <div style="color:#c2c2c2;">从左侧选择需要添加的题型</div>
    </div>
    <div v-else style="width:100%">
      <div class="experience-problem-box1">
        <div class="experience-problem-text-box">
          <div class="experience-problem-text">体验课调查问卷</div>
        </div>
        <el-form
          ref="ruleForms"
          :model="ruleForms"
          :inline="true"
          label-width="50px"
        >
          <div
            class="experience-form-box"
            v-for="(item, index) in ruleForms.summaryList"
            :key="index"
          >
            <el-form-item
              :label="index + 1 + '.'"
              :prop="'summaryList.' + index + '.title'"
              :rules="moreNotifyOjbectRules.title"
            >
              <el-input placeholder="标题" v-model="item.title"></el-input>
              <el-form
                v-if="
                  item.questionType == 'RADIO' ||
                    item.questionType == 'CHECKBOX'
                "
                ref="ruleForms"
                :model="ruleForms.summaryList[index]"
              >
                <div
                  class="experience-form-box1"
                  v-for="(val, index1) in ruleForms.summaryList[index]
                    .questionOptionList"
                  :key="index1"
                >
                  <el-form-item>
                    <i
                      v-if="
                        ruleForms.summaryList[index].questionType == 'RADIO'
                      "
                      class="experience-form-radius"
                    ></i>
                    <i
                      v-else-if="
                        ruleForms.summaryList[index].questionType == 'CHECKBOX'
                      "
                      class="experience-form-square"
                    ></i>
                  </el-form-item>
                  <el-form-item
                    :prop="'questionOptionList.' + index1 + '.optionContent'"
                    :rules="moreNotifyOjbectRules.describe"
                  >
                    <el-input
                      placeholder="选项描述"
                      size="mini"
                      v-model="val.optionContent"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <i
                      style="font-size:20px;position:relative;top:4px;"
                      class="el-icon-circle-plus-outline"
                      @click="addItemRadios(val, index)"
                    ></i>
                  </el-form-item>
                  <el-form-item>
                    <i
                      style="font-size:20px;position:relative;top:4px;"
                      class="el-icon-remove-outline"
                      @click="deleteItemRadios(val, index, index1)"
                    ></i>
                  </el-form-item>
                </div>
              </el-form>
            </el-form-item>
            <el-form-item>
              <i class="el-icon-delete" @click="deleteItem(item, index)"></i>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="experience-box-btn">
        <el-button type="primary" @click="submitForm">立即创建</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index'
export default {
  props: {
    ruleForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      moreNotifyOjbectRules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('标题不能为空'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        describe: [
          { required: true, message: '描述不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('描述不能为空'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      // 所有数据list
      ruleForms: {
        summaryList: []
      },
      // 单选
      radioType: {
        title: '',
        questionType: 'RADIO',
        questionClass: 'PUBLIC',
        questionState: 'DEFAULT',
        questionOptionList: [
          {
            optionNo: 'A',
            optionContent: '',
            optionSort: '1'
          },
          {
            optionNo: 'B',
            optionContent: '',
            optionSort: '2'
          }
        ]
      },
      // 多选
      checkboxType: {
        title: '',
        questionClass: 'PUBLIC',
        questionType: 'CHECKBOX',
        questionState: 'DEFAULT',
        questionOptionList: [
          {
            optionNo: 'A',
            optionContent: '',
            optionSort: '1'
          },
          {
            optionNo: 'B',
            optionContent: '',
            optionSort: '2'
          }
        ]
      },
      // 必填项
      fillInTheBlanksType: {
        questionClass: 'PUBLIC',
        questionType: 'SUBJECTIVE',
        title: '',
        questionState: 'DEFAULT'
      },
      summaryListValue: true
    }
  },
  methods: {
    submitForm(formNames) {
      // console.log(this.$refs.ruleForms.model.summaryList)
      try {
        const _summaryList = this.ruleForms.summaryList
        _summaryList.forEach((res) => {
          if (res.title) {
            if (res.questionOptionList) {
              res.questionOptionList.forEach((ele) => {
                if (ele.optionContent) {
                  this.summaryListValue = true
                } else {
                  this.summaryListValue = false
                  throw new Error('EndIterative')
                }
              })
            }
          } else {
            this.summaryListValue = false
            throw new Error('EndIterative')
          }
        })
      } catch (e) {
        if (e.message !== 'EndIterative') throw e
      }
      console.log(this.summaryListValue)
      console.log(this.ruleForms.summaryList)
    },
    resetForm() {},
    // 新增单选提
    addItemRadio() {
      const radio = deepClone(this.radioType)
      this.ruleForms.summaryList.push(radio)
    },
    // 新增多选提
    addItemCheckboxType() {
      const checkbox = deepClone(this.checkboxType)
      this.ruleForms.summaryList.push(checkbox)
    },
    // 新增多选提
    addItemFillInTheBlanksType() {
      const fillInTheBlanksType = deepClone(this.fillInTheBlanksType)
      this.ruleForms.summaryList.push(fillInTheBlanksType)
    },
    // 删除单选提 多选提 填空题
    deleteItem(item, index) {
      this.ruleForms.summaryList.splice(index, 1)
    },
    // 新增单选项
    addItemRadios(val, index) {
      const sort = this.radioType.questionOptionList.length
      const obj = {
        optionNo: 'C',
        optionContent: '',
        optionSort: sort
      }
      for (var i = 0; i < this.radioType.questionOptionList.length + 1; i++) {
        obj.optionNo = String.fromCharCode(65 + i)
      }
      const arr = [obj]
      this.$set(this.ruleForms.summaryList[index], 'questionOptionList', [
        ...this.ruleForms.summaryList[index].questionOptionList,
        ...arr
      ])
    },
    // 删除单选项
    deleteItemRadios(val, index, index1) {
      console.log(val, index, index1)
      if (this.ruleForms.summaryList[index].questionOptionList.length > 2) {
        const cloneSummary = deepClone(this.ruleForms.summaryList)
        cloneSummary[index].questionOptionList.splice(index1, 1)
        this.ruleForms.summaryList = cloneSummary
      } else {
        this.$message.error('至少有两个可选项')
      }
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
  .experience-problem-box1 {
    height: 500px;
    overflow: auto;
    width: 100%;
    .experience-problem-text-box {
      display: flex;
      justify-content: center;
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
    .experience-form-box {
      .experience-form-box1 {
        margin-top: 10px;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        .experience-form-radius {
          position: relative;
          top: 5px;
          font-size: 20px;
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 1px solid #d6d6d6;
          border-radius: 50%;
        }
        .experience-form-square {
          position: relative;
          top: 5px;
          font-size: 20px;
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 1px solid #d6d6d6;
        }
      }
    }
  }
  .experience-box-btn {
    padding-top: 15px;
    display: flex;
    justify-content: center;
  }
}
</style>
