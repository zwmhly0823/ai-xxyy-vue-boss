<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2020-09-09 19:57:08
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

    <el-table :data="faProps" style="width: 100%">
      <el-table-column prop="coupon[name]" label="券名"></el-table-column>
      <el-table-column
        prop="coupon[typeName]"
        label="优惠券类型"
        width="100"
      ></el-table-column>
      <el-table-column label="面值" width="100">
        <template slot-scope="scope">
          <div>
            {{ `¥ ${scope.row.coupon.amount}` }}
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
        :total="allDigit"
        :current-page="currentPage"
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
      faProps: [], // 爹给的(已深拷贝)
      currentPage: 1,
      allDigit: 0
    }
  },
  mounted() {
    this.$root.$on('coupon', (r) => {
      console.info('老爹给用户资产-优惠券table-基础数据list计算出来', r)
      this.faProps = r
    })
  },
  watch: {
    faProps: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.reqGetUserAssets()
          this.top4Show()
        }
      }
    }
  },
  methods: {
    // 数据接口_用户资产_优惠券
    reqGetUserAssets() {
      console.count('llllll')
      if (this.faProps && this.faProps.length) {
        this.faProps.forEach((pItem) => {
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
        this.allDigit = this.faProps.length
      }
    },
    top4Show() {
      let i = 0
      while (i < 4) {
        this.couponNumList[i].value = 0
        i++
      }
      console.count('kkkk')
      this.couponNumList[0].value = this.faProps.length
      this.faProps.forEach((nItem) => {
        if (nItem.status === '0' || nItem.status === '3') {
          this.couponNumList[2].value++ // 无效
        } else if (nItem.status === '1') {
          this.couponNumList[1].value++ // 可用
        } else if (nItem.status === '2') {
          this.couponNumList[3].value++ // 已使用
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
