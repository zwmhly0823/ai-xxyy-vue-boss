<template>
  <div class="ivr-content" v-loading="ivrLoading">
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
              v-for="item in callStatusOptions"
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
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :span-method="objectSpanMethod"
      :row-style="rowStyle"
      header-row-class-name="learning-record-sty"
    >
      <el-table-column prop="courseName" label="课程名称"></el-table-column>
      <el-table-column prop="eventTypeName" label="事件类型"></el-table-column>
      <el-table-column prop="callTime" label="通话时间"></el-table-column>
      <el-table-column prop="statusName" label="通话状态"></el-table-column>
      <el-table-column prop="addTime" label="参课时间"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import DatePicker from '@/components/MSearch/searchItems/datePicker.vue'
import { debounce, cloneDeep } from 'lodash'
import { formatData } from '@/utils/index'
export default {
  name: 'ivrCon',
  props: {
    data: Array,
    studentId: String
  },
  components: {
    DatePicker
  },
  watch: {
    data() {
      this.ivrLoading = false
      this.initData()
    }
  },
  data() {
    return {
      callStatus: '',
      callStatusOptions: [
        {
          label: 'webcall, TTS合成失败',
          value: 20
        },
        {
          label: 'webcall, 客户未接',
          value: 21
        },
        {
          label: 'webcall, 客户接听',
          value: 22
        },
        {
          label: 'webcall, 已呼叫',
          value: 23
        },
        {
          label: 'webcall, 双方接听',
          value: 24
        },
        {
          label: '预测外呼,客户未接听',
          value: 40
        },
        {
          label: '预测外呼,客户接听',
          value: 41
        },
        {
          label: '预测外呼,已呼叫',
          value: 42
        },
        {
          label: '预测外呼,双方接听',
          value: 43
        }
      ],
      ivrSwitch: 'OFF',
      rowStyle: {
        height: '50px',
        lineHeight: '50px'
      },
      tableData: [],
      bubbleData: {},
      ivrLoading: false,
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
    // 列表
    this.initData()
    // 开关
    this.initSwitch()
  },
  methods: {
    initData() {
      this.tableData = cloneDeep(this.data)
      this.tableData.forEach((tItem, tKey) => {
        switch (tItem.eventType) {
          case 0:
            tItem.eventTypeName = '系统课IVR次日未参课提醒'
            break
          case 1:
            tItem.eventTypeName = '系统课IVR当日未参课提醒'
            break
        }
        switch (tItem.status) {
          case 20:
            tItem.statusName = 'webcall, TTS合成失败'
            break
          case 21:
            tItem.statusName = 'webcall, 客户未接'
            break
          case 22:
            tItem.statusName = 'webcall, 客户接听'
            break
          case 23:
            tItem.statusName = 'webcall, 已呼叫'
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
        if (!tItem.callTime) {
          tItem.callTime = '--'
        }
      })
      // 合并单元格
      this.tableData.reduce((preVal, curVal, index) => {
        // 课程名称一样就合起来
        if (curVal.courseName !== preVal.courseName) {
          this.mergeNameTable.push(index)
        } else {
          this.mergeNameTable[this.mergeNameTable.length - 1].length++
        }
        // 参课时间一样就合起来
        if (curVal.addTime !== preVal.addTime) {
          this.mergeAddTimeTable.push(index)
        } else {
          this.mergeAddTimeTable[this.mergeAddTimeTable.length - 1].length++
        }
        return curVal
      })
    },
    initSwitch() {
      this.$http.User.getSwitchStatus({ userId: this.studentId })
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
    callTimeData(res) {
      this.ivrLoading = true
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
      this.bubbleFun()
    },
    callStatusData: debounce(function(val) {
      // console.log(val)
      this.ivrLoading = true
      this.bubbleData = {
        cdrStatus: val
      }
      this.bubbleFun()
    }, 500),
    startData(res) {
      this.ivrLoading = true
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
      this.bubbleFun()
    },
    ivrSwitchChange(res) {
      this.ivrLoading = true
      this.$http.User.changeSwitchStatus({
        userId: this.studentId,
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
          this.ivrLoading = false
        })
        .catch(() => {
          this.ivrLoading = false
          this.$message.error('更新用户通知开关状态失败')
        })
    },
    bubbleFun() {
      this.$emit('ivrBubbleData', this.bubbleData)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === '课程名称') {
        for (let i = 0, len = this.mergeNameTable.length; i < len; i++) {
          if (rowIndex === this.mergeNameTable[i].index) {
            return {
              rowspan: this.mergeNameTable[i].length,
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
      if (column.label === '参课时间') {
        for (let i = 0, len = this.mergeAddTimeTable.length; i < len; i++) {
          if (rowIndex === this.mergeAddTimeTable[i].index) {
            return {
              rowspan: this.mergeAddTimeTable[i].length,
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
}
</script>

<style lang="scss" scoped>
.ivr-content {
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
</style>
