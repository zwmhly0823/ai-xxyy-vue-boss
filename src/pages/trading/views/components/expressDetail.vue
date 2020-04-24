<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lukun
 * @Date: 2020-04-15 15:18:49
 * @LastEditors: Lukun
 * @LastEditTime: 2020-04-23 18:19:37
 -->
<template>
  <div class="container">
    <el-drawer
      class="drawer-detail "
      :visible.sync="drawer"
      :direction="direction"
      :modal="modal"
      :with-header="false"
      size="40%"
    >
      <div class="what">
        <div class="left-click" v-if="leftRow.length > 1">
          <div
            @click="getexpressInformation(item, i)"
            :class="[{ active: isActive == i }, 'inactive']"
            :key="i"
            v-for="(item, i) in leftRow"
          >
            {{ item.product_name }}
          </div>
        </div>
        <div class="line" v-if="leftRow.length > 1"></div>
        <div class="right-detail">
          <div class="img" @click="handleClose">
            <i class="el-icon-close"></i>
          </div>

          <div class="line-time">
            <div class="logistics">
              <span>商品信息：{{ this.expressInformation.product_name }}</span>
              <span
                >物流公司：{{ this.expressInformation.express_company }}</span
              >
              <span>快递单号：{{ this.expressInformation.express_nu }}</span>
            </div>
          </div>
          <div class="horizontal-line"></div>
          <div class="waitFor" v-if="waitFor">快递待揽收</div>
          <!-- 
<el-timeline v-show="timeLine">
        <el-timeline-item
          v-for="(value, index) in expressDetail"
          :key="index"
          :color="activities.color"
        >
        
        </el-timeline-item>
      </el-timeline> -->

          <el-timeline class="right-timeline">
            <el-timeline-item
              v-for="(value, index) in activities"
              :key="index"
              :color="color"
            >
              <div class="statebox">
                <div class="statebox" v-for="(item, key) in value" :key="key">
                  <div class="state" v-if="key === 0">{{ item.status }}</div>
                  <div class="content">{{ item.context }}</div>
                  <div class="time">{{ item.time }}</div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  // 传递来源 如 订单使用  物流使用
  // 需要传递的信息  物流单号 物流商品名称
  props: ['transferExpress', 'order_id'],
  data() {
    return {
      drawer: false,
      color: '#0bbd87',
      modal: false,
      direction: 'rtl',
      timeLine: false,
      waitFor: false,
      orderInformation: [],
      expressInformation: [],
      activities: [],
      isActive: 0,
      leftRow: [],
      orderId: '',
      expressNu: '' // 物流单号
    }
  },
  watch: {
    transferExpress(val) {
      this.expressInformation = val
      this.expressNu = this.expressInformation.express_nu
      this.expressList(this.expressNu)
    },
    order_id(val) {
      this.orderId = val
      this.getexpressMess(this.orderId)
    }
  },
  methods: {
    // 获取物流id 商品信息
    getexpressInformation(item, i) {
      this.isActive = i
      this.expressInformation = item
      this.expressList(item.express_nu)
    },
    handleClose() {
      this.drawer = false
    },
    // 获取订单页面物流信息
    getexpressMess(id) {
      // 这里需要传递用户Id来获取
      const queryParams = JSON.stringify(`
      {"bool":{"must":[{"term":{"order_id":${id}}}]}}
      `)
      return axios
        .post('/graphql/v1/toss', {
          query: `{
                  ExpressList(query: ${queryParams}) {
                     id
                      product_name
                      express_company
                      express_nu
                  }
                }`
        })
        .then((res) => {
          this.leftRow = res.data.ExpressList
          this.getexpressInformation(this.leftRow[0], 0)
        })
    },
    // 物流列表信息
    expressList(id) {
      this.$http.Express.ExpressList({
        expressNo: id
      })
        .catch((err) => console.log(err))
        .then((res) => {
          if (res && res.payload) {
            this.waitFor = false
            const lastData = {}
            res.payload[0].data.forEach((item) => {
              if (item.status === '揽收') {
                lastData.begin = lastData.begin == null ? [] : lastData.begin
                lastData.begin.push(item)
              } else if (
                item.status === '在途' ||
                item.status === '派件' ||
                item.status === '疑难'
              ) {
                lastData.onway = lastData.onway == null ? [] : lastData.onway
                lastData.onway.push(item)
              } else {
                lastData.receive =
                  lastData.receive == null ? [] : lastData.receive
                lastData.receive.push(item)
              }
              this.activities = lastData
            })
          } else {
            this.activities = []
            this.waitFor = true
          }
          console.log(this.activities, 'this.activities')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  .drawer-detail {
    margin: 50px 10px 10px 10px;
  }
  .what {
    padding: 20px;
    display: flex;
    flex-direction: row;
    .left-click {
      width: 21%;
      display: flex;
      height: 550px;
      flex-direction: column;
      overflow-y: auto;
      overflow: hidden;
      .inactive {
        text-align: center;
        padding: 4px;
        background-color: #f2f2f2;
        margin-bottom: 2px;
        cursor: pointer;
      }
      .active {
        color: white;
        text-align: center;
        padding: 4px;
        background-color: #409eff;
        margin-bottom: 2px;
      }
    }
    .line {
      margin-left: 10px;
      border-right: 2px solid #f2f2f2;
    }
    .right-detail {
      margin-left: 10px;
      width: 100%;
      height: 700px;
      overflow-y: auto;
      overflow: hidden;
      .img {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .line-time {
        .logistics {
          display: flex;
          flex-direction: column;
          font-size: 16px;
          span:nth-child(2) {
            margin: 3px 0 3px 0;
          }
        }
      }
      .horizontal-line {
        margin: 15px 0px;
        border-bottom: 1.2px solid #ddd;
      }
      .waitFor {
        text-align: center;
        color: #ccc;
        font-size: 20px;
      }
      .right-timeline {
        .statebox {
          .state {
            font-size: 20px;
          }
          .content {
            margin: 8px;
            color: #666;
            font-size: 14px;
          }
          .time {
            color: #999;
            font-size: 12px;
          }
          margin-bottom: 10px;
        }
        margin-bottom: 20px;
      }
    }
  }
}
</style>
