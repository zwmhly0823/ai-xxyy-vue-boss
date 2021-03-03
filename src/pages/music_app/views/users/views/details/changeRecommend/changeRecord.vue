<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-06 17:13:23
 * @LastEditors: liukun
 * @LastEditTime: 2021-01-14 22:21:51
-->
<template>
  <div class="changeRecommend">
    <div>
      购买体验课人数：
      <span style="margin-right:25px">{{ allDigit }}</span>已转化人数：
      <span>{{ systemCount }}</span>
    </div>
    <div class="table">
      <el-table :data="tableData">
        <el-table-column prop label="被推荐人用户手机/ID" align="center" width="180px">
          <template slot-scope="scope">
            <div>{{ scope.row.cellphone }}</div>
            <el-link
              type="primary"
              :href="'/music_app/#/details/' + scope.row.u_id"
              target="_blank"
            >{{ 'ID:' + scope.row.userNum }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="ctime" label="购买体验课时间" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.buyTime }}</div>
            <div>{{ scope.row.buyTimeUnder + ' 小熊美术体验课' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="buyChannel" label="购买体验课渠道" align="center"></el-table-column>
        <el-table-column prop="status" label="转化结果" align="center">
          <template slot-scope="scope">
            <div
              :class="
                scope.row.changeResult === '已年课' ||
                scope.row.changeResult === '已半年课'
                  ? 'redColor'
                  : ''
              "
            >{{ scope.row.changeResult }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total,sizes,jumper"
        :total="allDigit"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/mini_tool_lk'

export default {
  name: 'changeRecord',
  data() {
    return {
      // 分页
      allDigit: 0,
      pageSize: 20,
      currentPage: 1,

      systemCount: 0, // 系统课计数

      tableData: [],
      searchJson: {
        subject: 0,
        pay_channel_user: this.$route.params.id,
        regtype: 1,
        status: 3
      }
    }
  },

  methods: {
    // 页容量变化
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getData(this.searchJson, this.currentPage, val)
      this.currentPage = 1 // 处理当前第30页-页容量5=>改页容量100后,页码不归1的组件内部问题
    },
    // 当前页变化
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getData(this.searchJson, val, this.pageSize)
    },
    // 数据接口(传当前页,页容量 取总数据，总条目)
    async getData(searchJson, page, size) {
      await this.$http.User.OrderPageRecord(searchJson, page, size)
        .then((res) => {
          if (res.data && res.data.OrderPage) {
            const content = res.data.OrderPage.content
            const totalElements = res.data.OrderPage.totalElements
            if (content && content.length) {
              // 全部整合
              content.forEach((item) => {
                item.cellphone = item.user ? item.user.mobile : '-' // 手机号
                item.userNum = item.user ? item.user.user_num : '-' // 用户6位编号
                item.u_id = item.user ? item.user.id : '-' // 用户id用于跳转
                item.buyTime = formatDate(item.buytime) // 购买时间
                item.buyTimeUnder = item.sup_text // 时间下面的文字
                item.buyChannel = item.channelDetail
                  ? item.channelDetail.channel_outer_name
                  : '-' // 渠道
                if (item.user) {
                  // 转化结果
                  const status = item.user.status
                  if (status === '5' || status === '6' || status === '7') {
                    item.changeResult = '已年课'
                  } else if (
                    status === '11' ||
                    status === '12' ||
                    status === '13'
                  ) {
                    item.changeResult = '已半年课'
                  } else {
                    item.changeResult = '未转化'
                  }
                }
              })
              // 赋值
              this.tableData = content
              this.pageSize = size // 就取本地设订的可以嘛？server也是听本地的传值(统一接口成功再变化分页信息)
              this.currentPage = page // 就取本地设订的可以嘛？server也是听本地的传值(统一接口成功再变化分页信息)
              this.allDigit = +totalElements // 总量
              this.getDataStatiscs()
            } else {
              this.$root.$emit('recordDataCount', 0)
            }
          }
        })
        .catch(() => {
          this.$message.error('转介绍记录接口失败')
        })
    },
    // 前端计算统计-体验课系统课个数
    async getDataStatiscs() {
      const {
        data: {
          OrderPage: { content }
        }
      } = await this.$http.User.OrderPageRecord(this.searchJson, 1, 300).catch(
        () => {
          this.$message.error('转介绍记录-前端统计')
        }
      )
      if (content&&content.length) {
        // 统计系统可数
        this.systemCount = content.reduce((pre, cur) => {
          const status = cur.user.status
          if (/5|6|7|11|12|13/.test(status)) {
            return pre + 1
          } else {
            return pre
          }
        }, 0)
        this.$root.$emit('recordDataCount', content.length)
      } else {
        this.$root.$emit('recordDataCount', 0)
      }
    },
    // 给学员首页提供的转介绍信息
    async getDataStatiscsForDetailInDex() {
      const {
        data: { Order }
      } = await this.$http.User.getDataStatiscsForDetailInDex({
        subject: 3,
        uid: this.$route.params.id,
        regtype: 1,
        status: 3
      })
      if (Order && Order.pay_channel_user_extends) {
        this.$root.$emit('recordData', Order.pay_channel_user_extends)
        console.warn('取回转介绍对象', Order.pay_channel_user_extends)
      }
      // Order &&
      //   Order.pay_channel_user_extends &&
    }
  },
  computed: {},
  mounted() {
    this.getData(this.searchJson, this.currentPage, this.pageSize)
    this.getDataStatiscsForDetailInDex() // 独立出来-转介绍人信息
  }
}
</script>

<style lang="scss" scoped>
.redColor {
  color: red;
}
.changeRecommend {
  padding: 10px;
}
/deep/ .el-icon-circle-close {
  color: #f84e5e;
}
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 10px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 66;
}
</style>
