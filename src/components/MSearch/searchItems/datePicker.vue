<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-26 16:30:11
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-27 17:37:51
 -->
<template>
  <div class="search-item">
    <el-date-picker
      class="small"
      v-model="timeData"
      value-format="timestamp"
      type="datetimerange"
      prefix-icon="none"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="下单时间start"
      end-placeholder="下单时间end"
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
      type: String,
      default: 'octime'
    },
    datePlaceholder: {
      type: String,
      default: '下单时间'
    }
  },
  components: {},
  data() {
    return {
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
      timeData: ''
    }
  },
  computed: {},
  watch: {},
  methods: {
    changeHandler(data) {
      if (data) {
        const gte = data[0]
        const lte = data[1]
        const octime = { gte, lte }
        this.$emit('result', { [this.name]: octime })
        return
      }
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
  .el-range__icon {
    display: none;
  }
  .el-range-input {
    width: 50%;
  }
}
</style>
