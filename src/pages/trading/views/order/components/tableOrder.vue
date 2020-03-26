<template>
  <div class="title-box">
    <el-table style="width: 100%">
      <el-table-column label="商品信息" min-width="100%"></el-table-column>
      <el-table-column label="订单来源" min-width="100%"></el-table-column>
      <el-table-column label="订单状态" min-width="100%"> </el-table-column>
      <el-table-column label="关联物流" min-width="100%"> </el-table-column>
    </el-table>
    <!-- 卡片 -->
    <el-card
      class="box-card"
      shadow="never"
      v-for="(item, index) in 10"
      :key="index"
    >
      <div slot="header" class="card-title">
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content">订单号:12321232123212</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              下单时间:2143245356545436547
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">支付方式:21432543654786</div>
          </el-col>
        </el-row>
      </div>
      <div class="card-content">
        <div class="content-details card-style1">
          <div class="card-style1-left">
            <div>
              <div>小熊美术体验课</div>
              <div class="card-style1-num">8期·s1</div>
            </div>
          </div>
          <div class="card-style1-right">
            <div>
              <div class="card-style1-rmb">人民币：28000</div>
              <div class="sign">×<span>1</span></div>
            </div>
          </div>
        </div>
        <div class="content-details">
          <div>多彩抖音</div>
        </div>
        <div class="content-details">
          <div>已支付</div>
        </div>
        <div class="content-details card-style4">
          <div>
            <div class="card-style4-num">5</div>
            <div>最后一次已发货</div>
          </div>
        </div>
      </div>
    </el-card>
    <m-pagination
      show-pager
      open="calc(100vw - 170px - 30px)"
      close="calc(100vw - 50px - 30px)"
    ></m-pagination>
  </div>
</template>
<script>
import MPagination from '@/components/MPagination/index.vue'
export default {
  components: {
    MPagination
  },
  data() {
    return {
      cardData: [{}]
    }
  },
  methods: {}
}
</script>
<style scoped lang="scss">
@font-face {
  font-family: 'number_font';
  src: url('~@/assets/fonts/TG-TYPE-Bold.otf');
} //引入本地字体数字文件
.box-card {
  // 卡片标题
  .card-title {
    font-size: 14px;
    color: #666;
    .grid-content {
      font-family: 'number_font';
    }
  }
  // 卡片内容
  .card-content {
    font-size: 14px;
    color: #000;
    .content-details {
      width: 25%;
      height: 80px;
      padding: 0 10px;
      float: left;
      display: flex;
      align-items: center;
    }
    .card-style1 {
      padding-left: 0 !important;
      &-left {
        height: 100%;
        width: 50%;
        float: left;
        display: flex;
        align-items: center;
      }
      &-right {
        height: 100%;
        width: 50%;
        float: left;
        display: flex;
        align-items: center;
        .card-style1-rmb {
          font-family: 'number_font';
        }
        .sign {
          float: right;
          span {
            font-family: 'number_font';
          }
        }
      }
    }
    .card-style4 {
      padding-right: 0 !important;
      .card-style4-num {
        font-family: 'number_font';
        color: #409eff;
      }
    }
  }
}
</style>
<style lang="scss">
.title-box {
  padding: 0 10px 30px 10px;
  .el-table::before {
    height: 0px;
  }
  .el-table {
    font-size: 12px;
  }
  .el-table td,
  .el-table th.is-leaf {
    border: none;
  }
  .el-table__empty-block {
    display: none;
  }
  .el-card__body {
    padding: 0 0 10px 10px;
  }
  .el-card {
    border: 1px solid #dcdfe6;
    margin: 0 0 10px 0;
  }
  .el-card__header {
    padding: 10px;
    background: #f5f7fa;
  }
  // 卡片表头
  .el-row {
    padding: 0 !important;
  }
}
</style>
