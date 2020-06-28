<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-23 18:50:41
 * @LastEditors: panjian
 * @LastEditTime: 2020-06-28 17:31:58
-->
<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="课程类型" prop="name">
        <el-input
          disabled
          style="width:180px;"
          size="mini"
          v-model="ruleForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="课程排期" prop="stageValue">
        <searchStage
          v-model="ruleForm.stageValue"
          @result="result"
          :isMultiple="isMultiple"
          :type="type"
          :tableRow="tableRow"
        />
      </el-form-item>
      <el-form-item label="推送时间" prop="timeDate">
        <el-date-picker
          style="width:180px;"
          size="mini"
          v-model="ruleForm.timeDate"
          type="datetime"
          placeholder="请选择推送时间"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="问卷调查" prop="questionnaire">
        <el-select
          v-model="ruleForm.questionnaire"
          @change="onQuestionnaire"
          placeholder="请选择问卷"
          size="mini"
          v-loadmore="loadMore"
        >
          <el-option
            v-for="item in questionnaireList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import searchStage from '../components/searchStage'
export default {
  components: {
    searchStage
  },
  props: {
    tableRow: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      type: '0',
      isMultiple: false,
      questionnaireList: [],
      ruleForm: {
        timeDate: '',
        curriculum: '0',
        investigation: '1',
        questionnaire: '',
        stageValue: ''
      },
      page: 0,
      pageSize: 500,
      questionnaires: '',
      period: '',
      term: '',
      rules: {
        timeDate: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change'
          }
        ],
        curriculum: [
          {
            required: true,
            message: '请选择课程',
            trigger: 'change'
          }
        ],
        investigation: [
          {
            required: true,
            message: '请选择问卷调查',
            trigger: 'change'
          }
        ],
        questionnaire: [
          {
            required: true,
            message: '请选择问卷',
            trigger: 'change'
          }
        ],
        stageValue: [
          {
            required: true,
            message: '请选择排期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.ruleForm.name = this.tableRow.type
    this.ruleForm.stageValue = this.tableRow.term
    this.period = this.tableRow.period
    this.ruleForm.timeDate = +this.tableRow.pushDates

    this.getQuestionnaireList()
  },
  methods: {
    loadMore() {
      this.getQuestionnaireList()
    },
    getQuestionnaireList() {
      this.$http.Operating.queryQuestionnairePage(
        this.page,
        this.pageSize
      ).then((res) => {
        const _data = res.payload.content
        _data.forEach((ele) => {
          ele.value = ele.id
          ele.label = ele.title
        })
        _data.forEach((res) => {
          if (+res.value === +this.tableRow.titleId) {
            this.ruleForm.questionnaire = res.label
            this.questionnaires = res.value
          }
        })
        this.questionnaireList = _data
        this.page++
      })
    },
    result(data) {
      this.period = Object.values(data).toString()
      this.term = Object.keys(data).toString()
    },
    onQuestionnaire(data) {
      this.questionnaires = data
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.tableRow.id,
            period: this.period ? this.period : this.tableRow.period,
            term: this.term ? this.term : this.tableRow.term,
            pushDate: this.ruleForm.timeDate,
            titleId: this.questionnaires
          }
          this.$http.Operating.pushNotificationsUpdate(params).then((res) => {
            if (res.code === 0) {
              this.$message.success('创建成功')
              setTimeout(() => {
                this.$emit('onRefreshForm')
              }, 500)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$emit('closeForm')
    }
  }
}
</script>

<style></style>
