<template>
  <div class="container">
    <div class="up">
      <right-up></right-up>
    </div>
    <div class="down">
      <right-down></right-down>
    </div>
  </div>
</template>

<script>
import rightDown from './rightDown'
import rightUp from './rightUp'
export default {
  components: {
    rightUp,
    rightDown
  }
}
</script>

<style lang="scss" scoped>
.container {
}
</style>
