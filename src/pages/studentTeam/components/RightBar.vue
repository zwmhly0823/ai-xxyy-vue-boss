<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:41
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-19 19:12:08
 -->
<template>
  <div class="right-container">
    <el-card shadow="never" class="box-card1">
      <div class="header">
        <div class="header-left">
          <div class="title">
            <span>100202:80期S1-S3班</span>
            <span class="text-icons">体验课</span>
            <span class="text-icons">W1D1</span>
            <span class="text-icons">上课中</span>
          </div>
          <div class="info">
            <span>学员:60</span>
            <span>辅导老师:陈实</span>
            <span>辅导老师微信:陈老师</span>
            <span style="margin-right:0px">
              <span>01-23开班</span>
              <span>02-16结课</span>
            </span>
            <span style="margin-right:0px">
              <span>01-20</span>
              <span>19:20:45创建</span>
            </span>
          </div>
        </div>
        <!-- <div class="header-right">
          <el-card shadow="never">
            <i class="el-icon-plus"></i>
            <span>关联微信群</span>
          </el-card>
        </div> -->
      </div>
      <div class="body">
        <div class="body-boxLeft">
          <div class="order-title">累计订单</div>
          <div class="order-number">3</div>
          <div class="order-count">
            <span>今日1</span>
            <span>昨日5</span>
          </div>
        </div>
        <div class="body-boxCenter">
          <div class="Conversion-title">累计转化率</div>
          <div class="Conversion-number">15.7</div>
          <div class="Conversion-count">
            <span>今日1%</span>
            <span>昨日3%</span>
          </div>
        </div>
        <div class="body-boxRight">
          <div class="params-top">
            <div>
              <div>1</div>
              <div>待发货</div>
            </div>
            <div>
              <div>2</div>
              <div>待登录</div>
            </div>
            <div>
              <div>3</div>
              <div>待加好友</div>
            </div>
            <div>
              <div>4</div>
              <div>待进群</div>
            </div>
            <div>
              <div>5</div>
              <div>今日参课</div>
            </div>
            <div>
              <div>6</div>
              <div>昨日参课</div>
            </div>
          </div>
          <div class="params-bottom">
            <div>
              <div>1</div>
              <div>今日完课</div>
            </div>
            <div>
              <div>2</div>
              <div>昨日完课</div>
            </div>
            <div>
              <div>3</div>
              <div>今日作品</div>
            </div>
            <div>
              <div>4</div>
              <div>昨日作品</div>
            </div>
            <div>
              <div>5</div>
              <div>今日点评</div>
            </div>
            <div>
              <div>6</div>
              <div>昨日点评</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <tab-bar />
  </div>
</template>

<script>
import TabBar from './TabPane/TabBar.vue'
export default {
  props: {
    classId: {
      type: Object,
      default: null
    }
  },
  components: {
    TabBar
  },
  data() {
    return {}
  },
  computed: {},
  watch: {
    classId(vals) {
      console.log(vals)
    }
  },
  methods: {},
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';
.right-container {
  .box-card1 {
    border-bottom: 10px solid $gray-e3;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      .header-left {
        .title {
          font-size: 16px;
          .text-icons {
            margin-left: 8px;
            padding: 0 5px;
            color: white;
            background: #41a0fa;
          }
        }
        .info {
          font-size: 12px;
          color: gray;
          margin-top: 5px;
          span {
            margin-right: 8px;
          }
        }
      }
    }
    .body {
      background: #fff;
      color: gray;
      display: flex;
      font-size: 12px;
      &-boxLeft,
      &-boxCenter,
      &-boxRight {
        padding: 10px;
        margin-right: 15px;
        background: rgba(241, 242, 242, 1);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      &-boxLeft {
        flex: 0.3;
        .order-title {
          margin-bottom: 10px;
          flex: 1;
        }
        .order-number {
          font-size: 18px;
          margin-bottom: 10px;
          flex: 1;
        }
        .order-count {
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex: 1;
        }
      }
      &-boxCenter {
        flex: 0.3;
        .Conversion-title {
          margin-bottom: 10px;
          flex: 1;
        }
        .Conversion-number {
          font-size: 18px;
          margin-bottom: 10px;
          flex: 1;
        }
        .Conversion-count {
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex: 1;
        }
      }
      &-boxRight {
        flex: 1;
        margin-right: 0px;
        .params-top {
          width: 100%;
          display: flex;
          margin-bottom: 10px;
          div {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
        .params-bottom {
          width: 100%;
          display: flex;
          div {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      }
    }
  }
  .el-tabs--border-card {
    border: none;
  }
}
</style>

<style lang="scss">
.box-card1 {
  border-radius: 0;
  .el-card__body {
    padding: 15px;
  }
}
.header-right {
  white-space: nowrap;
  .el-card__body {
    font-size: 14px;
    padding: 10px 15px;
    span {
      cursor: pointer;
    }
  }
}
</style>
