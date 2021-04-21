<template>
  <div class="search-item small">
    <el-date-picker type="date" @change="onChange" placeholder="选择日期">
    </el-date-picker>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  methods: {
    onChange(type) {
      this.$emit('result', { [this.name]: item })
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
