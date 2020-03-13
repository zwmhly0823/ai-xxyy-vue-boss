<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="@/assets/logo.png" /> -->
    <p>test</p>
    <el-button type="primary">主要按钮</el-button>
    <p>store: {{ device }}</p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {},
  computed: {
    device() {
      return this.$store.state.app.device
    }
  }
}
</script>
