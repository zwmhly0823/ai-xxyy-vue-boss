<!--
 * @Descripttion:
 * @version:
 * @Author: zhaowenming
 * @Date: 2020-04-22 16:08:02
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-28 15:06:50
 -->

<template>
  <div class="app-main channel-orientation-periond">
    <!-- 双周体验课 -->
    <biweekly-exp-class v-if="courseType == 0"></biweekly-exp-class>
    <!-- 单周体验课 -->
    <weekly-exp-class v-if="courseType == 6"></weekly-exp-class>
  </div>
</template>

<script>
import WeeklyExpClass from './weeklyExpClass/index'
import BiweeklyExpClass from './biweeklyExpClass/index'
export default {
  name: 'channelOrientationPeriod',
  components: {
    WeeklyExpClass,
    BiweeklyExpClass
  },
  data() {
    return {
      // 0 双周体验课 6 单周体验课
      courseType: 0
    }
  },

  created() {
    const { courseType } = this.$route.params
    this.courseType = courseType
  }
}
</script>

<style scoped lang="scss">
.channel-orientation-periond {
  background-color: #fff;
  min-height: 500px;
  margin: 10px;
  padding: 15px 10px;
}
</style>