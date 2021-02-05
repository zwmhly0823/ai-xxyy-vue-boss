<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-27 16:41:08
 -->
<template>
  <div class="app-main height add-schedule-container">
    <div class="grid-content">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="scroll-container">
          <h3 class="title-todo">新建{{ courseName }}招生排期</h3>
          <div class="step-container-status">
            <el-steps :active="stepStatus">
              <el-step title="设置基本信息" icon="el-icon-edit"></el-step>
              <el-step
                v-if="courseType == '0'"
                title="设置分配线索规则"
                icon="el-icon-s-tools"
              ></el-step>
              <el-step title="选择带班销售" icon="el-icon-s-flag"></el-step>
              <el-step title="设置招生容量" icon="el-icon-s-check"></el-step>
              <!-- <el-step title="完成" icon="el-icon-success"></el-step> -->
            </el-steps>
          </div>
          <!-- 第一步 -->
          <first-step
            v-show="stepStatus == 1"
            :stepStatus="stepStatus"
            @listenStepStatus="oneStepNext"
          ></first-step>

          <!-- 插入一步 设置分配线索 仅体验课显示 -->
          <set-leads
            v-if="courseType == '0' && stepStatus == 2"
            @listenStepStatus="fSstepStatus"
            @setExcelStatus="excelStatus"
          ></set-leads>

          <!-- 第二步 -->
          <second-step
            v-show="isShowSecondStep"
            :stepStatus="stepStatus"
            @listenStepStatus="fSstepStatus"
          ></second-step>
          <!-- 第三步 -->
          <third-step
            v-if="isShowThirdStep"
            :stepStatus="stepStatus"
            @listenStepStatus="fSstepStatus"
          ></third-step>
          <!-- 第四步 -->
          <div
            class="step-container step-four-container"
            v-show="isShowLastStep"
          >
            <div class="complete-container">
              <i class="el-icon-success"></i>
              <p>保存成功</p>
              <div class="succ-operate">
                <el-button size="small" type="info" @click="containerEdit"
                  >继续修改</el-button
                >
                <el-button size="small" type="success" @click="backList"
                  >返回列表</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import FirstStep from './components/FirstStep'
import SecondStep from './components/SecondStep'
import ThirdStep from './components/ThirdStep'
import SetLeads from './components/SetLeads'
export default {
  props: [],
  data() {
    return {
      isComplete: false,
      stepStatus: 1,
      teacherSelectInfo: {},
      courseType: '0',
      courseName: '体验课'
    }
  },
  components: {
    FirstStep,
    SecondStep,
    ThirdStep,
    SetLeads
  },
  computed: {
    isShowSecondStep() {
      return (
        (this.courseType === '0' && this.stepStatus === 3) ||
        (this.courseType === '1' && this.stepStatus === 2)
      )
    },
    isShowThirdStep() {
      return (
        (this.courseType === '0' && this.stepStatus === 4) ||
        (this.courseType === '1' && this.stepStatus === 3)
      )
    },
    isShowLastStep() {
      return (
        (this.courseType === '0' && this.stepStatus === 5) ||
        (this.courseType === '1' && this.stepStatus === 4)
      )
    }
  },
  created() {
    const { courseType = '0' } = this.$route.params
    this.courseType = courseType
    this.courseName = courseType === '0' ? '体验课' : '系统课'
  },
  methods: {
    // 第一步 点击下一步 监听
    oneStepNext(val) {
      console.log(val)
      if (val) this.stepStatus++
    },
    /**
     * @description 第一，二步 点击下一步 监听
     * @param {type } 0： 上一步；1: 下一步
     */
    fSstepStatus(type) {
      if (type) this.stepStatus++
      else this.stepStatus--
    },
    nextStep() {
      this.stepStatus++
    },
    containerEdit() {
      this.stepStatus = 1
    },
    backList() {
      this.$store.commit('setSchedulePeriod', '')
      this.$store.commit('setScheduleTeacher', [])
      this.$router.push({ path: '/operatingSchedule' })
    },
    /**
     * @description "设置分配线索规则"步骤中的《导入数据》工能emit值
     * @params {res}
     * @type 返回为'complete'代表导入数据成功，此时直接跳转到完成步骤
     */
    excelStatus(res) {
      res === 'complete' && (this.stepStatus = this.courseType === '0' ? 5 : 4)
    }
  }
}
</script>
<style lang="scss" scoped>
.add-schedule-container {
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.right {
      padding: 0;
    }
  }
  .scroll-container {
    padding: 0 20px 20px 20px;
    .step-container-status {
      width: 70%;
      margin: 0 auto;
      margin: 20px auto;
    }
    .step-container {
      &.step-four-container {
        .complete-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 100px 0;
          p {
            margin: 30px 0 60px 0;
          }
          > i {
            color: #67c23a;
            font-size: 150px;
          }
        }
      }
    }
  }
}
</style>
