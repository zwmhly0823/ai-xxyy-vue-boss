<!--
 * @Date: 2020-03-13 15:33:48
 * @LastEditors: Shentong
 * @LastEditTime: 2020-05-22 13:20:41
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/views/studentTeam/index.vue
 -->
<template>
  <el-row type="flex" class="app-main height student-team">
    <el-col class="student-team-right ">
      <div class="grid-content right">
        <el-scrollbar wrap-class="scrollbar-wrapper" id="right-scroll">
          <right-bar :classObj="classIdData" />
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import RightBar from '../../components/RightBar'

export default {
  props: [],
  components: {
    RightBar
  },
  data() {
    return {
      teamId: '', // 班级Id
      type: 0
    }
  },
  computed: {
    // 初始化的班级ID(体验课全部中第一条)
    classIdData() {
      return { teamId: this.teamId, type: this.type }
    }
  },
  async created() {
    // 新页面：TODO:
    const { id, type = 0 } = this.$route.params

    this.teamId = id
    this.type = type
  }
}
</script>
<style lang="scss" scoped>
.student-team {
  &-left {
    padding-left: 0px;
    width: 160px;
    min-width: 160px;
    border-right: 1px solid #e3e3e3;
  }
  &-center {
    width: 242px;
    min-width: 242px;
  }
  &-right {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.right {
      padding: 0;
    }
  }
}
</style>
<style>
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
