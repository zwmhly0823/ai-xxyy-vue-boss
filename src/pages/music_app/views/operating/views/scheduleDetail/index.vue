<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-14 18:28:44
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-16 15:39:59
 -->
<template>
  <div class="app-main height add-schedule-container">
    <div class="grid-content">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="scroll-container">
          <component
            :is="curtComponent"
            v-bind="$attrs"
            :period="period"
            :courseType="courseType"
          ></component>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {
  singlePeriod,
  doublePeriod,
} from '@/pages/music_app/views/operating/partTools'
import campDetail from './campDetail'
import usualDetail from './usualDetail'
import themeDetail from './themeDetail'
import systemDetail from './systemDetail'
import trialDetail from './trialDetail'

export default {
  data() {
    return {
      courseType: '0',
      period: '',
    }
  },
  components: {
    campDetail,
    usualDetail,
    themeDetail,
    systemDetail,
    trialDetail,
  },
  computed: {
    curtComponent() {
      const { courseType = '0', period } = this.$route.params
      let str = ''
      if (courseType === '2') {
        str = 'system-detail'
      } else if (courseType === '0') {
        // 单周体验课
        if (period > singlePeriod) {
          // 版本控制
          str = 'trial-detail'
        } else {
          str = 'usual-detail'
        }
      } else if (courseType === '1') {
        // 双周体验课
        if (period > doublePeriod) {
          // 版本控制
          str = 'trial-detail'
        } else {
          str = 'usual-detail'
        }
      }
      return str
    },
  },
  created() {
    const { courseType = '0', period = '' } = this.$route.params
    this.courseType = courseType
    this.period = period
  },
  watch: {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
}
.add-schedule-container {
  min-width: 1200px;
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    .el-scrollbar {
      flex: 1;
    }
    &.right {
      padding: 0;
    }
  }
  .scroll-container {
    padding: 0 20px 20px 20px;
  }
}
</style>
