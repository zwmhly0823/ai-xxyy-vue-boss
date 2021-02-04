<template>
  <div class="class-detail-page">
    <!-- 暂时照搬之前的，之后迭代 -->
    <team-detail :team-id="teamId" :key="now" />
  </div>
</template>

<script>
import teamDetail from '@/pages/music_app/views/studentTeam/views/trial-v2/components/Detail/index'
export default {
  name: 'classDetailPage',
  components: {
    teamDetail
  },
  mounted() {
    // 之所以放到mounted里是因为要触发teamDetail的watch，迭代之后可以看情况去除
    this.teamId = this.$route.params.id
  },
  data() {
    return {
      teamId: '',
      now: new Date().getTime()
    }
  }
}
</script>

<style lang="scss" scoped>
.class-detail-page {
  background-color: #fff;
  padding: 10px;
}
</style>
