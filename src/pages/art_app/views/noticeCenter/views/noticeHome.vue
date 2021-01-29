<template>
  <div class="notice-home">
    <el-tabs class="notice-tabs" v-model="activeName" type="border-card">
      <el-tab-pane label="重点业务" name="first" :lazy="true">
        <notice-list type="buss"></notice-list>
      </el-tab-pane>
      <!-- <el-tab-pane label="产品动态" name="second" :lazy="true">
        <notice-list type="action"></notice-list>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import noticeList from '../components/noticeList'
export default {
  name: 'noticeHome',
  components: {
    noticeList
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
.notice-home {
  margin: 10px;
  background-color: #fff;
  .notice-tabs {
    min-height: calc(100vh - 70px);
  }
}
</style>
