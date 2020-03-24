<template>
  <div class="order-box">
    <article class="top-box">
      <el-row :gutter="20">
        <!-- 订单总计 -->
        <el-col :span="6">
          <div class="grid-content bg-purple total-order">
            <div class="oride-top">订单总计</div>
            <div class="oride-middle">3005笔</div>
            <div class="oride-bottom">
              <span>121111元</span>
              <span>0币</span>
              <span>0宝石</span>
            </div>
          </div>
        </el-col>
        <!-- 体验课 -->
        <el-col :span="4">
          <div class="grid-content bg-purple experience-order">
            <div class="oride-top">体验课</div>
            <div class="oride-middle">1234笔</div>
            <div class="oride-bottom">214354元</div>
          </div>
        </el-col>
        <!-- 系统课 -->
        <el-col :span="4">
          <div class="grid-content bg-purple system-order">
            <div class="oride-top">系统课</div>
            <div class="oride-middle">123243笔</div>
            <div class="oride-bottom">1234元</div>
          </div>
        </el-col>
        <!-- 小熊商城 -->
        <el-col :span="4">
          <div class="grid-content bg-purple bear-order">
            <div class="oride-top">小熊商城</div>
            <div class="oride-middle">0笔</div>
            <div class="oride-bottom">0币</div>
          </div>
        </el-col>
        <!-- 推荐有礼 -->
        <el-col :span="4">
          <div class="grid-content bg-purple recommended-order">
            <div class="oride-top">推荐有礼</div>
            <div class="oride-middle">0笔</div>
            <div class="oride-bottom">0宝石</div>
          </div>
        </el-col>
      </el-row>
    </article>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- tab列表 -->
    <article class="bottom-box">
      <table-order />
    </article>
  </div>
</template>
<script>
import tableOrder from './tableOrder'
export default {
  components: {
    tableOrder
  }
}
</script>
<style lang="scss" scoped>
.top-box {
  width: 100%;
  height: 100%;
  // 订单总计
  .total-order {
    span {
      width: 33.3%;
      display: inline-block;
    }
    .oride-top {
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      text-align: center;
      padding: 10px 0;
    }
  }
  // 体验课
  .experience-order {
    .oride-top {
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      text-align: center;
      padding: 10px 0;
    }
  }
  // 系统课
  .system-order {
    .oride-top {
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      text-align: center;
      padding: 10px 0;
    }
  }
  // 小熊商城
  .bear-order {
    .oride-top {
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      text-align: center;
      padding: 10px 0;
    }
  }
  // 推荐有礼
  .recommended-order {
    .oride-top {
      text-align: center;
      padding: 10px 0;
    }
    .oride-middle {
      text-align: center;
      padding: 10px 0;
    }
    .oride-bottom {
      text-align: center;
      padding: 10px 0;
    }
  }
}
.bottom-box {
  margin: 20px 0 0 0;
}
.el-divider--horizontal {
  margin: 0 0 0 -10px !important;
}
</style>
<style lang="scss">
.order-box {
  .el-row {
    padding: 0px 0 20px 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #f5f6f7;
  }
  .bg-purple {
    background: #f5f6f7;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding-left: 0;
  }
}
</style>
