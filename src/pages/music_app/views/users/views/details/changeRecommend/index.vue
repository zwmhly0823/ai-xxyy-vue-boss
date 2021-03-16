<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-27 10:17:03
 * @LastEditors: liukun
 * @LastEditTime: 2020-12-26 19:37:26
-->
<template>
  <div class="user-capital">
    <el-tabs v-model="assetCurPane">
      <el-tab-pane label="体验课推荐记录" name="changeRecord">
        <changeRecord />
      </el-tab-pane>
      <el-tab-pane label="转介绍截图" name="changeImg">
        <changeImg />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import changeImg from './changeImg'
import changeRecord from './changeRecord'

export default {
  components: {
    changeImg,
    changeRecord
  },
  data() {
    return {
      assetCurPane: 'changeRecord'
    }
  },
  watch: {},
  mounted() {
    this.$root.$on('jumpPartRecommend', (r) => {
      this.assetCurPane = r
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.user-capital {
  padding: 10px;
}
</style>
