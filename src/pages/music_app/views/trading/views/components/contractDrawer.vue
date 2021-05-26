<!--
 * @Author: liuzhiyuan
 * @LastEditors: liuzhiyuan
-->
<template>
  <el-drawer
    :title="tit"
    :visible="drawerContract"
    :destroy-on-close="true"
    size="50%"
    class="drawer-approval-detail"
    :before-close="handleClose"
  >
    <el-tabs type="border-card" v-model="active" @tab-click="handleClick">
      <el-tab-pane label="价格调整记录" name="list">
        <div class="drawer-table" v-if="pricesTableData.length > 0">
          <el-table
            :data="pricesTableData"
            :loading="loading"
            class="table-setmeal"
          >
            <el-table-column label="当前状态" width="58">
              <template slot-scope="scope">
                {{
                  scope.row.del === '1'
                    ? '待生效'
                    : scope.row.del === '2'
                    ? '已生效'
                    : '已失效'
                }}
              </template>
            </el-table-column>
            <el-table-column prop="packageName" label="套餐名称">
            </el-table-column>
            <el-table-column prop="settlePrice" label="临时活动价格（元）">
            </el-table-column>
            <el-table-column prop="orderPrice" label="订单入库价格（元）">
            </el-table-column>
            <el-table-column label="临时价格有效期" width="189">
              <template slot-scope="scope">
                <p>{{ '生效日期:' + scope.row.vaildateStart }}</p>
                <p>{{ '终止日期:' + scope.row.vaildateEnd }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="operationUser" label="操作人" width="65">
            </el-table-column>
            <el-table-column label="操作" width="55">
              <template slot-scope="scope">
                <el-link
                  v-if="scope.row.del === '1'"
                  type="primary"
                  size="mini"
                  :underline="false"
                  @click="del(scope.row.id)"
                  >失效</el-link
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else>
          暂无数据
        </div>
      </el-tab-pane>
      <el-tab-pane label="临时活动价格配置" class="drawer-form" name="active">
        <div class="txt">
          功能说明：
          <p class="txt_item">
            可依据临时活动政策变更实际结算价格。活动时间开始后，期间内该渠道进入的订单金额都为临时活动价格。活动期间结束，自动恢复为原合同签署的实际结算价格。（临时活动价格与实际结算价格对应）
          </p>
        </div>
        <div class="txt">
          操作规则：
          <p class="txt_item">
            1、配置的临时活动价格未到开始日期可以删除，超过开始时间不能删除；
            <br />
            2、预设临时活动价格相同时间只能配置一个价格；
          </p>
        </div>
        <el-form label-position="right" label-width="110px">
          <el-form-item label="临时活动价格" required>
            <el-table
              ref="tables"
              :data="tableData"
              border
              style="width: 90%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="45"> </el-table-column>
              <el-table-column
                prop="packageName"
                label="套餐名称"
                min-width="60"
              >
              </el-table-column>
              <el-table-column prop="settlePrice" label="临时活动课单价（元）">
                <template slot-scope="scope">
                  <el-input-number
                    style="width: 80%;"
                    size="mini"
                    :controls="false"
                    :min="0"
                    :max="9999.99"
                    :precision="2"
                    v-model.number="scope.row.settlePrice"
                    clearable
                    placeholder="价格（元）"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="订单入库价格（元）">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.orderPrice === '0'
                      ? '0元'
                      : '套餐价格' + scope.row.price + '元'
                  }}</span>
                </template>
              </el-table-column>
            </el-table></el-form-item
          >
          <el-form-item label="临时价格有效期" required>
            <datePickerDisabledDate
              name="time"
              :list="timeData"
              @result="getDate"
            />
          </el-form-item>
          <div class="bottom_choose">
            <el-button size="mini" type="primary" @click="saveContract"
              >提交</el-button
            >
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script>
import { formatData } from '@/utils/index'
import datePickerDisabledDate from '@/components/MSearch/searchItems/datePickerDisabledDate.vue'
export default {
  name: 'contractDrawer',
  components: {
    datePickerDisabledDate
  },
  props: {
    // 抽屉标题
    tit: {
      type: String,
      default: ''
    },
    // 显隐
    drawerContract: {
      type: Boolean,
      default: false
    },
    // 抽屉-合同数据
    packageOperation: {
      type: Object,
      default: () => {}
    }
  },
  computed: {},
  data() {
    return {
      multipleSelection: [],
      active: 'list',
      timeData: [], // 时间段
      loading: false,
      queryData: {
        beginTime: '',
        endTime: ''
      }, //  提交数据
      tableData: [], // 套餐数据
      pricesTableData: [], // 记录套餐更改数据
      // 套餐数据，，，需要获取套餐中 price 的套餐价格
      // 前端写死套餐，变更需要同时更改 ../contractManage/addContract.vue 中set_mealList
      set_mealList: [
        {
          packageName: '49元双周体验课',
          packageId: '500',
          classHour: '2',
          price: '49'
        },
        {
          packageName: '29元单周体验课',
          packageId: '502',
          classHour: '1',
          price: '29'
        },
        {
          packageName: '29元双周体验课',
          packageId: '503',
          classHour: '2',
          price: '29'
        },
        {
          packageName: '9.9元双周体验课',
          packageId: '505',
          classHour: '2',
          price: '9.9'
        },
        {
          packageName: '19元单周体验课',
          packageId: '506',
          classHour: '1',
          price: '19'
        },
        {
          packageName: '9.9元单周体验课',
          packageId: '507',
          classHour: '1',
          price: '9.9'
        }
      ]
    }
  },

  watch: {
    tableData: {
      handler: function(val) {
        val.forEach((item, i) => {
          // 赋值订单入库价格 单选框
          if (item.settlePrice === 0) {
            item.orderPrice = '0'
          } else if (item.settlePrice > 0) {
            item.orderPrice = item.price
          }
        })
      },
      deep: true
    },
    drawerContract: {
      // 抽屉开关 显隐
      handler(val) {
        // 进入抽屉默认是列表数据
        if (val === true) {
          this.active = 'list'
        }
        // 合同id查询套餐变更记录
        if (this.packageOperation?.contract?.id) {
          //  获取记录套餐变更数据
          this.getPricesTableData(this.packageOperation.contract.id)
        }
        const arr = this.packageOperation.contractPriceDetailList
        if (arr && arr.length) {
          // 映射有需要的字段
          this.tableData = arr.map((item) => {
            // 获取套餐价格
            var price = ''
            this.set_mealList.forEach((i) => {
              if (item.packageId === i.packageId) {
                return (price = i.price)
              }
            })
            return {
              contractId: item.contractId,
              contractPrice: item.contractPrice,
              operationUser: item.operationUser,
              packageId: item.packageId,
              packageName: item.packageName,
              settlePrice: item.settlePrice,
              orderPrice: item.orderPrice,
              price // price 用此字段控制套餐0，原价
            }
          })
          // 默认全选
          this.$nextTick((_) => {
            this.tableData &&
              this.tableData.forEach((item) => {
                this.$refs.tables.toggleRowSelection(item, true)
              })
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 选择表格
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleClick(tab, even) {
      if (tab.name === 'list') {
        //  获取记录套餐变更数据
        this.getPricesTableData(this.packageOperation.contract.id)
      }
    },
    // 关闭抽屉
    handleClose() {
      this.$emit('closedrawer')
      this.timeData = []
      this.active = 'list'
    },
    // 提交
    saveContract() {
      const tableArr = this.multipleSelection
      if (tableArr && tableArr.length === 0) {
        this.$message.error('选择需要修改套餐')
        return
      }
      if (!this.queryData.beginTime || !this.queryData.endTime) {
        this.$message.error('价格有效期不能为空')
        return
      }
      if (tableArr && tableArr.length > 0) {
        for (let i = 0; i < tableArr.length; i++) {
          if (!tableArr[i].settlePrice && tableArr[i].settlePrice !== 0) {
            this.$message.error(
              `${tableArr[i].packageName}临时活动课单价不能为空`
            )
            return
          }
          // 开始结束日期放入数组
          tableArr[i].vaildateStart = this.queryData.beginTime
          tableArr[i].vaildateEnd = this.queryData.endTime
        }
      }
      this.loading = true
      this.$http.Express.createContractPrice(tableArr)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success('提交成功')
            // 关闭弹框，数据清空
            this.$emit('closedrawer')
            this.timeData = []
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          this.loading = false
        })
    },
    // 失效
    del(id) {
      if (id) {
        this.$confirm('是否确认失效此条价格调整！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            this.loading = true
            try {
              const res = await this.$http.Express.deleteContractDetailById(id)

              if (res.code === 0) {
                this.$message.success('操作成功')
                //  获取记录套餐变更数据
                this.getPricesTableData(this.packageOperation.contract.id)
              } else {
                this.$message.error('操作失败')
              }
            } catch (err) {
              console.log(err)
            } finally {
              this.loading = false
            }
          })
          .catch((e) => {
            console.log('取消')
          })
      } else {
        this.$message.error('合同id错误')
      }
    },
    // 选择日期
    getDate(res) {
      if (res) {
        this.queryData.beginTime = res.time.gte
        this.queryData.endTime = res.time.lte
      } else {
        this.queryData.beginTime = this.queryData.endTime = ''
      }
    },
    async getPricesTableData(id) {
      try {
        // 获取记录套餐变更数据
        this.loading = true
        const res = await this.$http.Express.getOperationRecordById(id)

        if (res.code === 0) {
          // 处理日期数据
          res.payload.forEach((item) => {
            // 校验删除按钮显隐
            const itmeStamp = Date.parse(new Date())
            // del标识 1待生效可以失效，2已生效，0已失效 --按照status状态判断最终失效
            item.del = +item.vaildateStart <= itmeStamp ? '2' : '1'
            if (item.status === 'CLOSE') {
              item.del = '0'
            }

            item.vaildateStart = formatData(item.vaildateStart, 's')
            item.vaildateEnd = formatData(item.vaildateEnd, 's')
          })
          this.pricesTableData = res.payload || []
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.bottom_choose {
  display: flex;
  justify-content: center;
}
.drawer-table {
  height: calc(100vh - 145px);
  .table-setmeal {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
  }
}
.drawer-form {
  height: calc(100vh - 145px);
  overflow-y: auto;
}
.drawer-approval-detail {
  .txt {
    color: #606266;
    line-height: 21px;
    margin-bottom: 10px;
    .txt_item {
      display: inline-table;
      width: 84%;
    }
  }
  .el-form {
    border-top: 1px solid #ccc;
    padding-top: 20px;
  }
}
.drawer-approval-detail .el-tabs,
.drawer-approval-detail .el-tabs__content {
  height: 100%;
}
.drawer-approval-detail {
  /deep/ .el-drawer__header {
    margin-bottom: 10px;
    padding-top: 10px;
  }
}
/deep/ .el-table__header-wrapper .el-checkbox {
  display: none;
}
</style>
