<template>
  <div class="search-item small">
    <el-select
      v-model="type"
      size="mini"
      clearable
      :placeholder="placeholder"
      @change="onChange"
      class="item-style"
    >
      <el-option
        v-for="item in typeList"
        :key="item.id"
        :value="item.id"
        :label="item.text"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '体验课类型'
    }
  },
  data() {
    return {
      type: null,
      typeList: [
        {
          id: '5',
          text: '直播名称'
        },
        {
          id: '11',
          text: '直播名称'
        }
      ]
    }
  },
  methods: {
    onChange(type) {
      this.$emit('result', { [this.name]: item })
    }
  }
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
</style>