<template>
  <header class="team-info">
    <div class="team-info-bar d-flex align-center">
      <div class="team-info-bar_tag">课</div>
      <h3>{{ lessonInfo.WDInfo }}</h3>
      <h3>《{{ lessonInfo.title }}》</h3>
      <p>放课时间：{{ lessonInfo.send_date }}</p>
    </div>
  </header>
</template>

<script>
// import { formatData } from '@/utils'
import { calculateWD } from '@/utils/validate'
export default {
  props: {
    lesson: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      opened: false
    }
  },
  computed: {
    lessonInfo() {
      // console.log(this.lesson)
      return {
        ...this.lesson,
        WDInfo: calculateWD(this.lesson.current_lesson)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$dangerColor: #f56c6c;
$mainColor: #2a75ed;
$grayColor: #f0f1f2;

.danger {
  color: $dangerColor;
}
// 班级信息
.team-info {
  padding: 8px 20px;
  background-color: #2c3f5d;
  color: #fff;
  &-bar {
    &_tag {
      padding: 3px 4px;
      background-color: #fff;
      border-radius: 4px;
      color: $mainColor;
      font-weight: 500;
    }
    h3 {
      margin: 0 0 0 10px;
      cursor: pointer;
    }
    p {
      margin: 0 10px;
    }
  }
}
</style>
