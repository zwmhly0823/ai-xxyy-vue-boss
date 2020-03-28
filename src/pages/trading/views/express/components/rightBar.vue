<template>
  <div class="container">
    <div class="up">
      <right-up></right-up>
    </div>
    <div class="down"><right-down :dataExp="dataExp" /></div>
  </div>
</template>

<script>
import rightDown from './rightDown'
import rightUp from './rightUp'
export default {
  props: ['dataExp'],
  components: {
    rightUp,
    rightDown
  },
  data() {
    return {}
  },
  mounted() {
    console.log(this.dataExp, '00000changer')
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .up {
    margin-bottom: 10px;
  }
  .down {
    flex: 1;
  }
}
</style>
