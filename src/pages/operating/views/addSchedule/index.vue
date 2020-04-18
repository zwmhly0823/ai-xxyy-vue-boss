<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-18 13:47:21
 -->
<template>
  <div class="app-main height add-schedule-container">
    <div class="grid-content">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="scroll-container">
          <h3 class="title-todo">新建体验课招生排期</h3>
          <div class="step-container-status">
            <el-steps :active="stepStatus">
              <el-step title="设置基本信息" icon="el-icon-edit"></el-step>
              <el-step title="选择带班销售" icon="el-icon-s-flag"></el-step>
              <el-step title="设置招生容量" icon="el-icon-s-check"></el-step>
              <el-step title="完成" icon="el-icon-success"></el-step>
            </el-steps>
          </div>
          <!-- 第一步 -->
          <first-step
            v-show="stepStatus == 1"
            :stepStatus="stepStatus"
            @listenStepStatus="oneStepNext"
          ></first-step>

          <!-- 第二步 -->
          <second-step
            v-show="stepStatus == 2"
            :stepStatus="stepStatus"
            @listenStepStatus="twoStepNext"
          ></second-step>
          <!-- 第三步 -->
          <third-step
            v-if="stepStatus == 3"
            :stepStatus="stepStatus"
            @listenStepStatus="onStepStatus"
          ></third-step>
          <!-- 第四步 -->
          <div
            class="step-container step-four-container"
            v-show="stepStatus == 4"
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
export default {
  props: [],
  data() {
    return {
      stepStatus: 1,
      teacherSelectInfo: {}
    }
  },
  components: {
    FirstStep,
    SecondStep,
    ThirdStep
  },
  computed: {},
  watch: {},
  methods: {
    // 第一步 点击下一步 监听
    oneStepNext(val) {
      console.log('oneStepNext', val)
      if (val) {
        this.stepStatus++
      }
    },
    // 第二步 点击下一步 监听
    twoStepNext(type) {
      //   this.teacherSelectInfo = val
      if (type) this.stepStatus++
      else this.stepStatus--
    },
    onStepStatus(type) {
      if (type) this.stepStatus++
      else this.stepStatus--
    },
    handleChange() {},
    pageChange_handler() {},
    nextStep() {
      this.stepStatus++
    },
    containerEdit() {
      const period = 13
      const courseType = '0'
      this.$router.push({
        path: `/addSchedule/${period}/${courseType}`
      })
    },
    backList() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<style lang="scss" scoped>
.add-schedule-container {
  min-width: 1200px;
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
