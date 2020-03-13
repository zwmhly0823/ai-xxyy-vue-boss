<!--
 * @Date: 2020-03-13 16:53:33
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-13 18:28:01
 * @FilePath: /ai-app-vue-toss/src/pages/studentTeam/components/CenterBar.vue
 -->
<template>
  <div class="center-container">
    <div class="headers">
      <span>
        <i class="el-icon-brush" />
      </span>
      <span>
        <i class="el-icon-sort" />
      </span>
    </div>
    <div class="container" style="marginTop:10px">
      <div v-for="o in 4" :key="o" class="cycle-box">
        <el-card class="box-card" shadow="hover">
          <div class="clcle-header">
            <span>80期S1-3班</span>
            <span class="text-icons">W1D1</span>
          </div>
          <div class="clcle-info">
            <span>
              <i class="el-icon-school"></i>
              60
            </span>
            <span>
              <i class="el-icon-user"></i>
              陈实啊
            </span>
            <span>
              <i class="el-icon-date"></i>
              0120-0210
            </span>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.center-container {
  padding: 10px;
  .headers {
    display: flex;
    justify-content: flex-end;
    span {
      width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 24px;
      }
    }
  }
  .container {
    .cycle-box {
      .box-card {
        margin-top: 5px;
        .clcle-header {
          font-size: 14px;
          .text-icons {
            margin-left: 8px;
            padding: 0 5px;
            color: white;
            background: #41a0fa;
          }
        }
        .clcle-info {
          font-size: 12px;
          margin-top: 6px;
          span {
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.box-card {
  .el-card__body {
    padding: 10px;
  }
}
</style>
