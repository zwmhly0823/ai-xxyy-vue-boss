<template>
  <div class="search-item small">
    <el-date-picker v-model="time" type="date" @change="onChange" placeholder="选择日期">
    </el-date-picker>
  </div>
</template>
<script>
import { formatData } from '@/utils/index'
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      time:'',
    }
  },
  methods: {
    onChange(type) {
      type = formatData(type)
      this.$emit('result', { [this.name]: type })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    .item-style {
      width: 140px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
/deep/ .el-input__inner {
    height: 28px;
}
</style>
