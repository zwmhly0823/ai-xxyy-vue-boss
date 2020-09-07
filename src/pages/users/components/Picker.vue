<!--
 * @Descripttion: 
 * @version: 
 * @Author: songyanan
 * @Date: 2020-08-27 14:51:00
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-07 15:24:04
 -->
<template>
  <div class="search-item">
    <el-date-picker
      v-model="timeData"
      class="small"
      size="mini"
      type="datetimerange"
      value-format="timestamp"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']"
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
      default: 'date'
    }
  },
  data() {
    return {
      timeData: []
    }
  },
  methods: {
    changeHandler(data, quick = false) {
      if (data) {
        const gte = this.timeData[0]
        const lte = this.timeData[1]
        const octime = { gte, lte }
        this.$emit('result', { [this.name]: octime })
        return
      }
      this.$emit('result', '')
    }
  },
  created() {
    this.$root.$on('fourpoint', (r) => {
      this.timeData = r
      this.changeHandler(r, true)
    })
  },
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
  .el-range-separator {
    color: #c0c4cc;
  }
}
</style>
