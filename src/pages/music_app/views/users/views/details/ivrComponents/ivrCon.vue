<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2020-12-19 21:43:21
-->
<template>
  <div class="ivr-content">
    <!-- 搜索条件 -->
    <div class="fliter-content">
      <el-form :inline="true">
        <el-form-item label="通话时间:" class="form-item-margin">
          <DatePicker @result="callTimeData"> </DatePicker>
        </el-form-item>
        <el-form-item label="通话状态:" class="form-item-margin">
          <el-select
            v-model="callStatus"
            placeholder="请选择"
            clearable
            size="mini"
            @change="callStatusData"
          >
            <el-option
              v-for="item in [
                {
                  label: '未接听',
                  value: 21
                },
                {
                  label: '已接听',
                  value: 22
                },
                {
                  label: '异常',
                  value: 23
                }
              ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开课时间:" class="form-item-margin">
          <DatePicker @result="startData"> </DatePicker>
        </el-form-item>
        <el-form-item label="IVR语音通知">
          <el-switch
            v-model="ivrSwitch"
            @change="ivrSwitchChange"
            active-color="#409EFF"
            inactive-color="#909399"
            active-value="ON"
            inactive-value="OFF"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </div>
    <!-- 数据table -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :span-method="objectSpanMethod"
    >
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="eventTypeName" label="事件类型"></el-table-column>
      <el-table-column prop="callTime" label="通话时间"></el-table-column>
      <el-table-column prop="statusName" label="通话状态"></el-table-column>
      <el-table-column prop="addTime" label="参课时间"></el-table-column>
    </el-table>
    <!-- 分页 -->
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
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import { formatData } from '@/utils/index'
export default {
  name: 'ivrCon',
  components: {
    DatePicker
  },
  data() {
    return {
      // 通话状态v-model纯显示
      callStatus: '',
      // 分页
      currentPage: 1,
      allDigit: 1,
      // 查询条件
      ivrSwitch: 'OFF', // ivr开关
      bubbleData: {}, // 五合一(3个条件互斥)

      tableData: [], // table数据

      // 合并单元格之类的云云
      mergeNameTableIndexArr: [],
      mergeAddTimeTableIndexArr: [],
      mergeNameTable: [
        {
          index: 0,
          length: 1
        }
      ],
      mergeAddTimeTable: [
        {
          index: 0,
          length: 1
        }
      ]
    }
  },
  created() {
    this.initSwitch()
    this.reqNotifyPage()
  },
  watch: {
    bubbleData: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.warn('搜索条件发生变化', newValue)
        this.reqNotifyPage(newValue)
      }
    }
  },
  methods: {
    // table数据√
    reqNotifyPage(data = {}) {
      const query = {
        userId: this.$route.params.id, // 锁
        pageSize: 20, // 锁
        pageNum: this.currentPage,
        sjstime: '',
        ejstime: '',
        cdrStatus: '',
        stime: '',
        etime: ''
      }
      Object.assign(query, data)
      this.$http.User.getNotifyPage(query)
        .then((res) => {
          console.log('llll', res)
          if (res.code === 0 && res.status === 'OK') {
            this.allDigit = +res.payload.totalElements
            // arrange list
            this.tableData = res.payload.content
            this.tableData.forEach((tItem, tKey) => {
              // 事件类型
              switch (tItem.eventType) {
                case 0:
                  tItem.eventTypeName = '系统课IVR次日未参课提醒'
                  break
                case 1:
                  tItem.eventTypeName = '系统课IVR当日未参课提醒'
                  break
              }
              // 通话状态
              switch (tItem.status) {
                case 20:
                  tItem.statusName = 'webcall, TTS合成失败'
                  break
                case 21:
                  tItem.statusName = '未接听'
                  break
                case 22:
                  tItem.statusName = '已接听'
                  break
                case 23:
                  tItem.statusName = '异常'
                  break
                case 24:
                  tItem.statusName = 'webcall, 双方接听'
                  break
                case 40:
                  tItem.statusName = '预测外呼,客户未接听'
                  break
                case 41:
                  tItem.statusName = '预测外呼,客户接听'
                  break
                case 42:
                  tItem.statusName = '预测外呼,已呼叫'
                  break
                case 43:
                  tItem.statusName = '预测外呼,双方接听'
                  break
              }
              // 通话时间
              if (!tItem.callTime) {
                tItem.callTime = '--'
              }
            })
            // 头尾  课程名称-参课时间  数据整合↓↓
            // // 合并单元格
            // // 最终拿到的数据：
            // // index: 下标,length:这个下标上的数据要占几个格子
            // // ***IndexArr 表示那些下标有长度，不在这个数组中的，占格数为0
            // this.tableData.reduce((preVal, curVal, index) => {
            //   // 课程名称一样就合起来
            //   if (curVal.courseName !== preVal.courseName) {
            //     this.mergeNameTable.push({
            //       index: index,
            //       length: 1
            //     })
            //   } else {
            //     this.mergeNameTable[this.mergeNameTable.length - 1].length++
            //   }
            //   // 参课时间一样就合起来
            //   if (curVal.addTime !== preVal.addTime) {
            //     this.mergeAddTimeTable.push({
            //       index: index,
            //       length: 1
            //     })
            //   } else {
            //     this.mergeAddTimeTable[this.mergeAddTimeTable.length - 1]
            //       .length++
            //   }
            //   return curVal
            // })
            // this.mergeNameTable.forEach((item) => {
            //   this.mergeNameTableIndexArr.push(item.index)
            // })
            // this.mergeAddTimeTable.forEach((item) => {
            //   this.mergeAddTimeTableIndexArr.push(item.index)
            // })
          } else {
            this.$message.warn('获取用户通知事件记录失败')
          }
        })
        .catch(() => {
          this.$message.error('获取用户通知事件记录失败')
        })
    },
    // 通话时间改变三合一√
    callTimeData(res) {
      if (res) {
        this.bubbleData = {
          stime: formatData(res.octime.gte),
          etime: formatData(res.octime.lte)
        }
      } else {
        this.bubbleData = {
          stime: '',
          etime: ''
        }
      }
    },
    // 开课时间变化三合一√
    startData(res) {
      if (res) {
        this.bubbleData = {
          sjstime: formatData(res.octime.gte),
          ejstime: formatData(res.octime.lte)
        }
      } else {
        this.bubbleData = {
          sjstime: '',
          ejstime: ''
        }
      }
    },
    // 通话状态改变三合一√
    callStatusData(val) {
      this.bubbleData = { cdrStatus: val }
    },
    // 页码变化√
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqNotifyPage(this.bubbleData)
    },
    // 改变switch接口√
    ivrSwitchChange(res) {
      this.$http.User.changeSwitchStatus({
        userId: this.$route.params.id,
        status: this.ivrSwitch
      })
        .then((res) => {
          if (res.payload && res.payload.status) {
            this.ivrSwitch = res.payload.status
            this.$message({
              message: `用户通知开关状态更新成功，当前为${this.ivrSwitch}`,
              type: 'success'
            })
          } else {
            this.$message.error('更新用户通知开关状态失败')
          }
        })
        .catch(() => {
          this.$message.error('更新用户通知开关状态失败')
        })
    },
    // 获取switch状态接口√
    initSwitch() {
      this.$http.User.getSwitchStatus({ userId: this.$route.params.id })
        .then((res) => {
          if (res.payload && res.payload.status) {
            this.ivrSwitch = res.payload.status
          } else {
            this.$message.error('获取用户通知开关状态失败')
          }
        })
        .catch(() => {
          this.$message.error('获取用户通知开关状态失败')
        })
    },
    // table 属性:span-method(ignore)
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === '课程名称') {
        if (this.mergeNameTableIndexArr.includes(rowIndex)) {
          let mIndex = null
          // 这里的循环是为了拿到当前项的下标位于我们自己创建的数组中的位置，以方面后面取length的值
          this.mergeNameTable.forEach((mItem, mKey) => {
            if (mItem.index === rowIndex) {
              mIndex = mKey
            }
          })
          return {
            rowspan: this.mergeNameTable[mIndex].length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      if (column.label === '参课时间') {
        if (this.mergeAddTimeTableIndexArr.includes(rowIndex)) {
          return {
            rowspan: this.mergeAddTimeTable[rowIndex].length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ivr-content {
  padding: 10px;
  margin-bottom: 30px;
  .fliter-content {
    .form-item-margin {
      margin-right: 30px;
      /deep/ .search-item {
        .small {
          width: 300px !important;
          .el-range-separator {
            width: 7%;
          }
        }
      }
    }
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
