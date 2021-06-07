<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-12 21:15:50
 -->
<template>
  <div class="add-schedule-container">
    <div class="grid-content">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <component :is="curtComponent"></component>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import TrialSchedule from './trialSchedule' // 新版体验课
import SystemCourse from './systemCourse' // 系统课
import {
  singlePeriod,
  doublePeriod,
} from '@/pages/music_app/views/operating/partTools'
export default {
  props: {},
  data() {
    return {
      comps: {},
    }
  },
  components: {
    TrialSchedule,
    SystemCourse
  },
  created() {},
  computed: {
    curtComponent: function () {
      const { period = '0', courseType = '0' } = this.$route.params
      let str = ''
      if (courseType === '2') {
        str = 'system-course'
      } else if (courseType === '0') {
        // 单周体验课
        if (period == 0 || period > singlePeriod) {
          // 版本控制
          str = 'trial-schedule'
        } else {
          str = 'system-course'
        }
      } else if (courseType === '1') {
        // 双周体验课
        if (period == 0 || period > doublePeriod) {
          // 版本控制
          str = 'trial-schedule'
        } else {
          str = 'system-course'
        }
      }
      return str
    },
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
.add-schedule-container {
  background: white;
  min-height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  overflow: hidden;
  .grid-content {
    height: 100%;
    // overflow: scroll;
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
