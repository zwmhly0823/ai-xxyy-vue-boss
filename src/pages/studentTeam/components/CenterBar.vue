<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:33
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-03-16 11:53:55
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
    <el-scrollbar wrap-class="scrollbar-wrapper" style="flex: 1;">
      <div class="container" style="marginTop:10px">
        <div v-for="o in 20" :key="o" class="cycle-box">
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
                洋洋老师
              </span>
              <span>
                <i class="el-icon-date"></i>
                0120-0210
              </span>
            </div>
          </el-card>
        </div>
      </div>
    </el-scrollbar>
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
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 100%;
  .headers {
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #e3e3e3;
    span {
      width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 18px;
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
.center-container .scrollbar-wrapper {
  overflow-x: hidden;
}
</style>
