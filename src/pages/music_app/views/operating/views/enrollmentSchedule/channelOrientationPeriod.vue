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
    <!-- 单周体验课 -->
    <biweekly-exp-class v-if="courseType == 0"></biweekly-exp-class>
    <!-- 双周体验课 -->
    <weekly-exp-class v-if="courseType == 1"></weekly-exp-class>
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
      //1 双周体验课 0 单周体验课
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