<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:30:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 22:27:33
 -->
<template>
  <div class="search-item">
    <el-select
      class="searchSelect"
      v-model="selectedInData"
      size="mini"
      clearable
      placeholder="时间类型"
      @change="onChange"
      @clear="onClear"
    >
      <el-option
        v-for="item in name"
        :key="item.value"
        :label="item.text"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-date-picker
      class="small"
      :disabled="selectedInData ? false : true"
      v-model="timeData"
      value-format="timestamp"
      type="datetimerange"
      size="mini"
      prefix-icon="none"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right"
      @change="changeHandler"
    >
    </el-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: Array,
      default: null
    },
    // 是否只返回值，如果是，父组件获得值后根据实际表达式组装数据
    onlyValue: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      selectedInData: null, // 下拉框选择内容
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      timeData: null
    }
  },
  computed: {},
  methods: {
    changeHandler(data) {
      if (data) {
        const gte = this.timeData[0]
        const lte = this.timeData[1]
        const octime = { gte, lte }
        this.$emit('result', { [this.selectedInData]: octime })
        return
      }
      this.$emit('result', '')
    },
    onChange(val) {
      this.$emit('timeCallBack', val)
    },
    onClear() {
      this.timeData = null
      this.$emit('result', '')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.search-item {
  .small {
    width: 380px !important;
  }
}
</style>
<style lang="scss">
.search-item {
  .searchSelect {
    width: 100px !important;
  }
  .el-range__icon {
    display: none;
  }
  .el-range-input {
    width: 50%;
  }
}
</style>
