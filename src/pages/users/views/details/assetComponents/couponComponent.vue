<template>
  <div class="coupon-content">
    <div class="coupon-num-box">
      <div
        class="coupon-item"
        v-for="(cItem, cKey) in couponNumList"
        :key="cKey"
      >
        <span class="coupon-nums-label">{{ cItem.label }} :</span>
        <span class="coupon-nums-val">{{ cItem.value }}</span>
      </div>
      <el-button
        class="send-coupon-button"
        type="primary"
        size="small"
        @click="presentCoupon"
        >发券</el-button
      >
    </div>

    <el-table
      :data="renderTableData"
      style="width: 100%"
      header-row-class-name="learning-record-sty"
    >
      <!-- 全选按钮 -->
      <!-- <el-table-column type="selection" width="40px"></el-table-column> -->
      <el-table-column prop="coupon[name]" label="券名"></el-table-column>
      <el-table-column
        prop="coupon[typeName]"
        label="优惠券类型"
        width="100"
      ></el-table-column>
      <el-table-column label="面值" width="100">
        <template slot-scope="scope">
          <div>
            {{ `¥: ${scope.row.coupon.amount}` }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <div :class="[{ 'green-text-color': scope.row.statusAbled }]">
            {{ scope.row.statusName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="end_date" label="到期时间"></el-table-column>
      <el-table-column prop="start_date" label="获得时间"></el-table-column>
      <el-table-column label="使用时间·方式">
        <template slot-scope="scope">
          <template
            v-if="
              !scope.row.order ||
                (!scope.row.order.ctime && !scope.row.order.packages_name)
            "
          >
            -
          </template>
          <template v-else>
            {{ scope.row.order.packages_name }}
            <br />
            {{ scope.row.order.ctime }}
          </template>
        </template>
      </el-table-column>
    </el-table>
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="handleSizeChange"
      show-pager
    ></m-pagination>
    <!-- 弹窗 -->
    <coupon-popover
      ref="couponPopover"
      :couponData="couponData"
      :selectUserId="selectUserId"
      @couponSendSucc="couponSendSucc"
    />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { formatData } from '@/utils/index'
import MPagination from '@/components/MPagination/index.vue'
import CouponPopover from '../../../../studentTeam/components/TabPane/components/couponPopover'
export default {
  name: 'couponComponent',
  components: {
    CouponPopover,
    MPagination
  },
  props: {
    propData: Object
  },
  created() {
    this.initRenderData()
    this.initNum()
    this.couponList()
  },
  data() {
    return {
      couponNumList: [
        {
          label: '总券数',
          value: 0
        },
        {
          label: '可用数',
          value: 0
        },
        {
          label: '无效数',
          value: 0
        },
        {
          label: '已用数',
          value: 0
        }
      ],
      renderTableData: [],
      // 优惠卷接口数据
      couponData: [],
      // 选择按钮用户id
      selectUserId: [],
      currentPage: 1,
      totalPages: 0,
      totalElements: 0
    }
  },
  watch: {
    propData() {
      this.initRenderData()
    }
  },
  methods: {
    initRenderData() {
      // console.log(this.propData)
      this.renderTableData = cloneDeep(this.propData.CouponUserPage.content)
      if (!this.renderTableData.length) {
        return
      }
      this.renderTableData.forEach((pItem) => {
        switch (pItem.coupon.type - 0) {
          case 0:
            pItem.coupon.typeName = '代金券'
            break
          case 1:
            pItem.coupon.typeName = '折扣券'
            break
          case 2:
            pItem.coupon.typeName = '满减券'
            break
        }
        switch (pItem.status - 0) {
          case 0:
            pItem.statusName = '不可用'
            break
          case 1:
            pItem.statusName = '可用'
            pItem.statusAbled = true
            break
          case 2:
            pItem.statusName = '已使用'
            break
          case 3:
            pItem.statusName = '已过期'
            break
        }
        pItem.end_date = formatData(pItem.end_date, 's')
        pItem.start_date = formatData(pItem.start_date, 's')
        if (pItem.order) {
          pItem.order.ctime = formatData(pItem.order.ctime, 's')
        } else {
          pItem.order = {
            ctime: '-'
          }
        }
      })
    },
    initNum() {
      this.totalPages = +this.propData.CouponUserPage.totalPages
      this.totalElements = +this.propData.CouponUserPage.totalElements
      this.propData.couponUserCollect.forEach((nItem) => {
        if (nItem.code === '_all') {
          this.couponNumList[0].value = nItem.value - 0
        } else if (nItem.code - 0 === 0) {
          // 不可用
          this.couponNumList[2].value += nItem.value - 0
        } else if (nItem.code - 0 === 1) {
          // 可用
          this.couponNumList[1].value = nItem.value - 0
        } else if (nItem.code - 0 === 2) {
          // 已使用
          this.couponNumList[3].value = nItem.value - 0
        } else if (nItem.code - 0 === 3) {
          // 已过期
          this.couponNumList[2].value += nItem.value - 0
        }
      })
    },
    // 优惠卷列表接口
    couponList() {
      this.$http.Team.getAllCoupons(0).then((res) => {
        this.couponData = (res.payload && res.payload.content) || []
      })
    },
    presentCoupon() {
      this.selectUserId = [this.propData.userId]
      this.$refs.couponPopover.issueCoupons = true
      this.$refs.couponPopover.couponsTime = ''
    },
    // 优惠券发放成功
    couponSendSucc() {
      this.$emit('couponSendSucc')
    },
    handleSizeChange(page) {
      this.currentPage = page
      this.$emit('changePagenation', {
        curPane: 'coupon',
        page: this.currentPage
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon-content {
  .coupon-num-box {
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    .coupon-item {
      display: inline-block;
      .coupon-nums-label {
        color: rgb(174, 174, 174);
      }
      .coupon-nums-val {
        margin: 0 30px 0 10px;
      }
    }
    .send-coupon-button {
      float: right;
      margin-right: 20px;
    }
  }
  .green-text-color {
    color: #67c23a;
  }
  .batch-btn {
    line-height: 10px;
    min-width: 110px;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
