<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-28 18:37:21
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-07-29 19:14:53
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
        >填空题</el-button
      >
      <br />
      <el-button @click="addItemShortAnswerType" type="text">简答题</el-button>
    </div>

    <div
      v-if="ruleForms.summaryList.length <= 0"
      class="experience-problem-box"
    >
      <div class="experience-problem-text">修改体验课调查问卷</div>
      <div style="color:#c2c2c2;">从左侧选择需要添加的题型</div>
    </div>
    <div v-else style="width:100%">
      <div class="experience-problem-box1">
        <div class="experience-problem-text-box">
          <div class="experience-problem-text">修改体验课调查问卷</div>
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
              <el-input
                style="width:450px;"
                placeholder="标题"
                v-model="item.title"
              ></el-input>

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
                      style="width:200px"
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
            <el-form-item
              v-if="
                ['SUBJECTIVE', 'SUBJECTIVE_DESC'].includes(item.questionType)
              "
              style="margin-left:50px;"
            >
              <el-checkbox v-model="item.isMusts">是否必填</el-checkbox>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="experience-box-btn">
        <el-button type="text" @click="lookResetForm">
          <svg
            style="position:relative;top:5px;"
            t="1593575369481"
            class="icon"
            viewBox="0 0 1536 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1773"
            width="20"
            height="20"
          >
            <path
              d="M768 0C260.5056 0 0 479.9488 0 479.9488s196.608 480.0512 768 480.0512c517.4272 0 768-478.208 768-478.208S1283.4816 0 768 0z m0 768c-167.1168 0-288.0512-125.952-288.0512-288.0512 0-161.9968 120.832-287.9488 288.0512-287.9488 167.1168 0 288.0512 125.952 288.0512 287.9488C1056.0512 642.048 935.2192 768 768 768z m0-480.0512a194.1504 194.1504 0 0 0-192 192.1024c0 102.7072 85.8112 192 192 192s192-89.2928 192-192c0-102.912-85.8112-192.2048-192-192z"
              p-id="1774"
              fill="#2a75ed"
            ></path>
          </svg>
          预览</el-button
        >
        <el-button
          style="height:40px;margin-left:30px;"
          type="primary"
          size="mini"
          @click="submitForm"
        >
          <i style="font-size:15px;" class="el-icon-check"></i>
          立即创建</el-button
        >
      </div>
    </div>
    <div>
      <el-dialog
        :visible.sync="dialogFormVisibles"
        width="750px"
        append-to-body
      >
        <look-form
          v-if="dialogFormVisibles"
          @onClose="onClose"
          :lookFormValue="ruleForms"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import lookForm from './lookForm'
import { deepClone } from '@/utils/index'
export default {
  components: {
    lookForm
  },
  props: {
    questionnaireId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogFormVisibles: false,
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
        isMusts: 1,
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
        isMusts: 1,
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
        questionState: 'DEFAULT',
        isMusts: false
      },
      //
      shortAnswerType: {
        questionClass: 'PUBLIC',
        questionType: 'SUBJECTIVE_DESC',
        title: '',
        questionState: 'DEFAULT',
        isMusts: false
      },
      summaryListValue: true
    }
  },
  created() {
    this.onQueryQuestionnaire()
    // this.ruleForms.summaryList = this.updateRuleForms.summaryList
  },
  methods: {
    onQueryQuestionnaire() {
      this.$http.Operating.queryQuestionnaire(this.questionnaireId).then(
        (res) => {
          const _data = res.payload.questionList
          _data.forEach((ele) => {
            ele.isMusts = !ele.isMust
          })
          this.ruleForms.summaryList = _data
        }
      )
    },
    // 关闭预览
    onClose() {
      this.dialogFormVisibles = false
    },
    // 保存
    submitForm() {
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
      if (this.summaryListValue) {
        const _data = this.ruleForms.summaryList
        _data.forEach((res) => {
          res.isMust = res.isMusts ? 0 : 1
          delete res.isMusts
        })
        const params = {
          id: this.questionnaireId,
          questionList: _data
        }
        this.$http.Operating.saveQuestionnaire(params).then((res) => {
          if (res.code === 0) {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$emit('onCloseUpdateSaveQuestionnaire')
            }, 200)
          }
        })
      } else {
        this.$message.error('请将问卷填写完成！')
      }
    },
    // 预览
    lookResetForm() {
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
      if (this.summaryListValue) {
        this.dialogFormVisibles = true
      } else {
        this.$message.error('请将问卷填写完成！')
      }
    },
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
    // 新增简答题
    addItemShortAnswerType() {
      const shortAnswerType = deepClone(this.shortAnswerType)
      this.ruleForms.summaryList.push(shortAnswerType)
    },
    // 删除单选提 多选提 填空题
    deleteItem(item, index) {
      this.ruleForms.summaryList.splice(index, 1)
    },
    // 新增单选项
    addItemRadios(val, index) {
      const sort = this.ruleForms.summaryList[index].questionOptionList.length
      const obj = {
        optionNo: 'C',
        optionContent: '',
        optionSort: sort
      }
      for (var i = 0; i < sort + 1; i++) {
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
      width: 250px;
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
        width: 250px;
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
    align-items: center;
  }
}
</style>
