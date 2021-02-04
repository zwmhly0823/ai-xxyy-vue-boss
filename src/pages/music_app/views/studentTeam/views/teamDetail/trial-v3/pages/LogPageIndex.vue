<template>
  <div class="log-page-index">
    <div class="top-radio-box" v-if="!this.isSpecial9dot9">
      <el-radio-group v-model="radioVal" size="small">
        <el-radio-button label="学员维度"></el-radio-button>
        <el-radio-button label="课程维度"></el-radio-button>
      </el-radio-group>
    </div>
    <log-page-user
      v-show="radioVal === '学员维度'"
      :team-info="teamInfo"
    ></log-page-user>
    <log-page-class
      v-show="radioVal === '课程维度'"
      :team-info="teamInfo"
    ></log-page-class>
  </div>
</template>

<script>
import LogPageUser from './LogPageUser.vue'
import LogPageClass from './LogPageClass.vue'
export default {
  name: 'LogPageIndex',
  components: {
    LogPageUser,
    LogPageClass
  },
  props: {
    teamInfo: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.initLimit()
  },
  data() {
    return {
      radioVal: '学员维度',
      isSpecial9dot9: false
    }
  },
  methods: {
    initLimit() {
      // 判断是不是9.9特价课
      if (this.teamInfo.category === 11) {
        this.isSpecial9dot9 = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.log-page-index {
  margin-top: 2px;
  .top-radio-box {
    text-align: center;
    margin-bottom: 10px;
    /deep/ {
      .el-radio-button__inner {
        padding: 9px 30px;
      }
    }
  }
}
</style>
