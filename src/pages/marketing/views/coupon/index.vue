<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-08-15 14:35:51
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-21 16:14:37
-->

<template>
  <el-row type="flex" class="app-main coupon">
    <el-col class="coupon-content">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div ref="tableContainer">
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'small'"
              :dataList="tableData"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :showAllTotalNum="true"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable add-first-cell-bg"
            >
              <el-table-column
                label="优惠券名称"
                min-width="120"
                prop="name"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="类型"
                min-width="110"
                prop="status"
                align="center"
                ><template>
                  <div>代金券</div>
                </template></el-table-column
              >
              <el-table-column
                label="面额"
                min-width="100"
                prop="amount"
                align="center"
              >
                <template slot-scope="scope">
                  <div>{{ `${scope.row.amount}元` }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
                min-width="200"
                prop="description"
                align="center"
              ></el-table-column>
              <el-table-column
                label="绑定套餐"
                min-width="100"
                prop="packgeDes"
                align="center"
              ></el-table-column>
              <el-table-column
                label="操作"
                min-width="100"
                prop="course_day"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="opt">
                    <span @click="operate_set(scope.row)">定向发放配置</span>
                  </div>
                </template>
              </el-table-column>
            </ele-table>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
export default {
  components: { EleTable },
  data() {
    return {
      tableHeight: 'auto',
      flags: {
        loading: false
      },
      // 总页数
      totalElements: 0,
      tableData: [],
      tabQuery: {
        size: 20,
        page: 0
      }
    }
  },

  created() {
    this.getCouponList()
  },

  mounted() {
    this.calcTableHeight()
  },

  methods: {
    async getCouponList() {
      this.flags.loading = true

      const couponList = await this.$http.Marketing.getCouponList(
        this.tabQuery
      ).catch((err) => {
        console.log(err)
      })

      const { payload: { content = [] } = {}, totalElements = 0 } =
        couponList || {}

      this.packgeData(content)
      this.tableData = content

      this.totalElements = +totalElements
      this.flags.loading = false
    },
    packgeData(list = []) {
      list.forEach((item) => {
        const [name = '', packgeDes = ''] = item.name.split('&*^%')

        item.name = name
        item.packgeDes = packgeDes
      })
    },
    operate_set(row) {
      const { id = -1 } = row
      this.$router.push({ path: `/grantRule/${id}` })
    },
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getCouponList()
    },
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.coupon {
  &-content {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .team-name-pointer {
    cursor: pointer;
    color: #2a75ed;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
  }
  .opt {
    color: #2a75ed;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
