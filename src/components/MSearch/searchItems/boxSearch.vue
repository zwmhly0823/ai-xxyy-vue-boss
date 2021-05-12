<!--
 * @Author: zhouzebin
 * @Email: zhouzebin@meishubao.com
 * @Date: 2020-05-13 17:46:53
 * @Last Modified by:   zhouzebin
 * @Last Modified time: 2020-05-13 17:46:53
 * @Description: 物流类型
 -->
<template>
  <div class="search-item small">
    <el-select
      v-model="result"
      size="mini"
      clearable
      :disabled="isLevel"
      placeholder="盒子及硬件"
      @change="onChange"
      class="item-style"
    >
      <el-option
        v-for="(item, index) in typeList"
        :key="index"
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
      default: '',
    },
    LevelArr: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    LevelArr(newVal) {
      if (newVal) {
        this.isLevel = !newVal.some((item, index) => {
          return item.includes('L1')
        })
      }
    },
  },
  data() {
    return {
      isLevel: true,
      result: '硬件及盒子',
      typeList: [
        {
          id: ['10', '6'],
          text: '硬件及盒子',
        },
        {
          id: ['10'],
          text: '硬件',
        },
        {
          id: ['6'],
          text: '盒子',
        },
      ],
    }
  },
  methods: {
    onChange(item) {
      this.$emit('result', item ? { [this.name]: item } : '')
    },
  },
}
</script>

<style lang="scss" scoped>
.search-item {
  &.small {
    .item-style {
      width: 120px !important;
      margin-right: 10px;
    }
    .item-style:last-child {
      margin-right: 0px;
    }
  }
}
</style>