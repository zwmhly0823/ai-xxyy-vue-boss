<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2020-09-01 14:35:27
-->
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
    </div>

    <el-table :data="renderTableData" style="width: 100%">
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
    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total"
        :page-size="20"
        :total="allDigit"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
export default {
  name: 'couponComponent',
  props: {
    changeSubject: {
      type: Number,
      required: true
    }
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
      faProps: [], // 爹给的
      currentPage: 1,
      allDigit: 0
    }
  },
  mounted() {
    this.$root.$on('coupon', (r) => {
      console.info('老爹给用户资产-优惠券-基础数据', r)
      this.faProps = r || []
      this.top4Show()
    })
    setTimeout(this.reqGetUserAssets, 3000)
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        this.reqGetUserAssets()
      }
    }
  },
  methods: {
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqGetUserAssets()
    },
    // 数据接口_用户资产_优惠券
    reqGetUserAssets() {
      this.$http.User.getUserAssetsCoupon(
        this.changeSubject,
        this.$route.params.id,
        this.currentPage
      )
        .then((res) => {
          if (
            res.data.CouponUserPage &&
            res.data.CouponUserPage.content.length
          ) {
            res.data.CouponUserPage.content.forEach((pItem) => {
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
            this.allDigit = Number(res.data.CouponUserPage.totalElements)
            this.renderTableData = res.data.CouponUserPage.content
          } else {
            this.allDigit = 0
            this.renderTableData = []
          }
        })
        .catch(() => {
          this.$message.error('获取用户资产_优惠券_失败')
        })
    },
    top4Show() {
      this.faProps.forEach((nItem) => {
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
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
