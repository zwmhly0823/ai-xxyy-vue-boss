<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-06-23 15:26:34
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-02 17:34:15
-->
<template>
  <div class="select-box">
    <el-card class="search-style" shadow="never">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true">
        <div style="font-size:18px;font-weight:500;margin-bottom:10px;">
          创建推送
        </div>
        <el-form-item style="margin-bottom:0px;" prop="curriculum">
          <el-select
            v-model="ruleForm.curriculum"
            @change="onCurriculumList"
            placeholder="请选择课程"
            size="mini"
          >
            <el-option
              v-for="item in curriculumList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;" prop="stageValue">
          <searchStage
            v-model="ruleForm.stageValue"
            @result="result"
            :isMultiple="isMultiple"
            :type="type"
          />
        </el-form-item>
        <el-form-item style="margin-bottom:0px;" prop="timeDate">
          <el-date-picker
            style="width:180px;"
            size="mini"
            v-model="ruleForm.timeDate"
            type="datetime"
            placeholder="请选择推送时间"
            value-format="timestamp"
            :picker-options="expireTimeOption"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;" prop="investigation">
          <el-select
            v-model="ruleForm.investigation"
            @change="onInvestigationList"
            placeholder="问卷调查"
            size="mini"
          >
            <el-option
              v-for="item in investigationList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;" prop="questionnaire">
          <el-select
            v-model="ruleForm.questionnaire"
            @change="onQuestionnaireList"
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
        <el-form-item style="margin-bottom:0px;">
          <el-button
            @click="onEstablish('ruleForm')"
            style="width:100px;"
            size="mini"
            type="primary"
            >创 建</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import searchStage from '../components/searchStage'
export default {
  components: {
    searchStage
  },
  data() {
    return {
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now() - 8.64e7
        }
      },
      type: '0',
      isMultiple: false,
      curriculumList: [
        {
          value: '0',
          label: '体验课'
        }
      ],
      investigationList: [
        {
          value: '1',
          label: '问卷调查'
        }
      ],
      questionnaireList: [],
      term: '',
      period: 0,
      page: 1,
      pageSize: 20,
      ruleForm: {
        timeDate: '',
        curriculum: '0',
        investigation: '1',
        questionnaire: '',
        stageValue: ''
      },
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
    this.getQuestionnaireList()
  },
  methods: {
    loadMore() {
      this.getQuestionnaireList()
    },
    result(data) {
      this.ruleForm.stageValue = data
      this.period = Object.values(data).toString()
      this.term = Object.keys(data).toString()
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
        if (this.questionnaireList.length === 0) {
          this.questionnaireList = _data
        } else {
          for (let i = 0; i < _data.length; i++) {
            this.questionnaireList.push(_data[i])
          }
        }
        this.page++
      })
    },
    onCurriculumList(data) {
      console.log(data)
    },
    onInvestigationList(data) {
      console.log(data)
    },
    onQuestionnaireList(data) {
      console.log(data)
    },
    // 创建推送
    onEstablish(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            type: this.ruleForm.curriculum,
            term: this.term,
            period: this.period,
            pushType: 'QUESTIONNAIRE',
            titleId: this.ruleForm.questionnaire,
            pushDate: this.ruleForm.timeDate
          }
          this.$http.Operating.pushNotificationsAdd(params).then((res) => {
            console.log(res)
            if (res.code === 0) {
              this.$message.success('创建成功')
              setTimeout(() => {
                this.$emit('onRefresh')
              }, 500)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
