<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-27 20:11:33
 -->
<template>
  <div class="scroll-container">
    <base-config
      v-if="stepStatus == 1"
      :stepStatus="stepStatus"
      :category="trial_28_category"
      @listenStepStatus="oneStepNext"
    ></base-config>

    <!-- 插入一步 设置分配线索 仅体验课显示 -->
    <set-leads
      v-if="stepStatus == 2"
      @listenStepStatus="fSstepStatus"
      @setExcelStatus="excelStatus"
      :category="trial_28_category"
    ></set-leads>

    <!-- 第三步 v-if="isShowThirdStep" -->
    <set-volume
      v-if="stepStatus == 3"
      :stepStatus="stepStatus"
      @listenStepStatus="fSstepStatus"
      :category="trial_28_category"
    ></set-volume>
    <!-- 渠道定向分配 -->
    <channel-distribution
      v-if="stepStatus == 4"
      @listenStepStatus="fSstepStatus"
      :category="trial_28_category"
    ></channel-distribution>
  </div>
</template>

<script>
import { courseTypeObj } from '@/pages/music_app/views/operating/courseType'
import BaseConfig from './components/BaseConfig'
import ChannelDistribution from './components/ChannelDistribution'
import SetVolume from './components/SetVolume'
import SetLeads from './components/SetLeads'
export default {
  props: [],
  data() {
    return {
      isComplete: false,
      stepStatus: 0,
      teacherSelectInfo: {},
      courseType: '0',
      courseName: '体验课',
      trial_28_category: ''
    }
  },
  components: {
    BaseConfig,
    ChannelDistribution,
    SetVolume,
    SetLeads
  },
  computed: {},
  async created() {
    const { courseType = '0' } = this.$route.params

    this.courseType = courseType
    this.courseName = courseTypeObj[courseType]

    this.stepStatus = 1
  },
  methods: {
    // 第一步 点击下一步 监听
    oneStepNext(val) {
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
</style>
