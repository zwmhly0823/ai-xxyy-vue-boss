<!--
 * @Author: songyanan
 * @Email: songyanan@meishubao.com
 * @Date: 2020-07-01 11:16:27
 * @Last Modified by:   songyanan
 * @Last Modified time: 2020-07-01 15:24:00
 -->
<template>
  <div class="order-call">
    <!-- 4大块 -->
    <article class="top-box">
      <el-row :gutter="20" type="flex" justify="flex-start">
        <!-- 已完成 3 -->
       <el-col :span="5">
          <div
            class="grid-content"
            :class="{ current: status === '3' }"
            @click="chnageStatus('3')"
          >
            <div class="oride-top">已完成</div>
            <div class="oride-middle">
              <em>{{ +statisticsObj.payed.value.toFixed(2) || 0 }}</em
              >元 {{ statisticsObj.payed.count || 0 }}笔
            </div>
            <!-- <div class="oride-bottom">
              {{ +statisticsObj.payed.value.toFixed(2) || 0 }}元
            </div> -->
          </div>
        </el-col>
        <!-- 未支付 0，1 -->
          <el-col :span="5">
         <div
            class="grid-content"
            :class="{ current: status === '0,1' }"
            @click="chnageStatus('0,1')"
          >
            <div class="oride-top">未支付</div>
            <div class="oride-middle">
              <!-- <em>{{ statisticsObj.topay.count }}</em
              >笔 -->
              <em>{{ +statisticsObj.topay.value.toFixed(2) }}</em
              >元 {{ statisticsObj.topay.count }}笔
            </div>
            <!-- <div class="oride-bottom">
              {{ +statisticsObj.topay.value.toFixed(2) }}元
            </div> -->
          </div>
        </el-col>
        <!-- 退费： 退费中 5，已退费 6，7 -->
        <!-- <el-col :span="5">
          <div
            class="grid-content"
            :class="{ current: status === '5,6,7' }"
            @click="chnageStatus('5,6,7')"
          >
            <div class="oride-top">退费</div>
            <div class="oride-middle">
              <em>{{ +statisticsObj.refund.value.toFixed(2) }}</em
              >元 {{ statisticsObj.refund.count }}笔
            </div>
          </div>
        </el-col> -->
        <!-- 全部订单 -->
       <el-col :span="5">
           <div
            class="grid-content"
            :class="{ current: !status }"
            @click="chnageStatus('')"
          >
            <div class="oride-top">全部订单</div>
            <div class="oride-middle">
              <em>{{ +statisticsObj.total.value.toFixed(2) }}</em
              >元 {{ statisticsObj.total.count }}笔
            </div>
            <!-- <div class="oride-middle">
              <em>{{ statisticsObj.total.count }}</em
              >笔
            </div>
            <div class="oride-bottom">
              <span>{{ +statisticsObj.total.value.toFixed(2) }}元</span>
            </div> -->
          </div>
        </el-col>
      </el-row>
    </article>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- tab列表 -->
    <article class="bottom-box">
      <table-order7
        :topic="topic"
        :status="status"
        :search="searchIn"
        @statistics="getStatistics"
        @get-params="getParams"
      />
    </article>
  </div>
</template>
<script>
import tableOrder7 from './tableOrder7'
import { isToss } from '@/utils/index'
export default {
  components: {
    tableOrder7
  },
  props: {
    // 当前tab - 商品主题
    topic: {
      type: String,
      default: ''
    },
    search: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      statData: [],
      // 获取teacherid
      teacherId: '',
      // 支付状态  已完成:3, 待支付:0,1，已退费:6,7
      status: '3',
      // 搜索
      searchIn: [],
     statistics: {
        '0': { count: 0, value: 0 },
        '1': { count: 0, value: 0 },
        '3': { count: 0, value: 0 },
        '5': { count: 0, value: 0 },
        '6': { count: 0, value: 0 },
        '7': { count: 0, value: 0 }
      },
      finalParams: {}
    }
  },
  
  computed: {
    // statistics format
    
    statisticsObj: {
      
      get() {
        const { statistics } = this
        const obj = {}
        // 未支付 0，1
        obj.topay = {
          count: +statistics['0'].count + +statistics['1'].count,
          value: +statistics['0'].value + +statistics['1'].value
        }
        // 退费：5，6，7
        obj.refund = {
          count:
            +statistics['5'].count +
            +statistics['6'].count +
            +statistics['7'].count,
          value:
            +statistics['5'].value +
            +statistics['6'].value +
            +statistics['7'].value
        }
        obj.payed = {
          count: +statistics['3'].count,
          value: +statistics['3'].value
        }
        obj.total = {
          count: obj.topay.count + obj.refund.count + obj.payed.count,
          value: obj.topay.value + obj.refund.value + obj.payed.value
        }
        return obj
      },
      set(val) {
        return val
      }
    }
  },
  watch: {
    // 切换tab - 商品主题
    topic(val) {
      this.reset()
    },
    // 搜索
    search(val) {
      this.searchIn = val
    }
  },
  created() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
  },
  methods: {
     // 获取订单统计
    getStatistics(res) {
      const obj = {}
      if (res && res.length > 0) {
        this.reset()
        res.forEach((item) => {
          const { code, count, value } = item
          obj[`${code}`] = {
            count,
            value
          }
        })
        this.statistics = {
          ...this.statistics,
          ...obj
        }
      } else {
        this.reset()
      }
    },

    getParams(res) {
      this.finalParams = res
    },

    /**
     * 切换
     */
    chnageStatus(status) {
      this.status = status
      // emit status, 用于搜索组件判断条件
      console.log(status)
      this.$emit('pay-status', status)
    },

    reset() {
      this.statistics = {
        '0': { count: 0, value: 0 },
        '1': { count: 0, value: 0 },
        '2': { count: 0, value: 0 },
        '3': { count: 0, value: 0 },
        '5': { count: 0, value: 0 },
        '6': { count: 0, value: 0 },
        '7': { count: 0, value: 0 }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './statistics.scss';
</style>
