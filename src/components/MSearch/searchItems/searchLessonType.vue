<template>
  <el-select
    v-model="type"
    size="mini"
    clearable
    :placeholder="placeholder"
    @change="stageTypeChange"
    class="item-style"
  >
    <el-option
      v-for="(item, index) in stageTypeOption"
      :key="index"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '体验课类型',
    },
    name: {
      type: String,
      default: '',
    },
    odd: {
      type: Array,
      default: () => [],
    },
    double: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      type: null,
      now: new Date().getTime(),
      stageTypeOption: [],
    }
  },
  created() {
    this.initList()
  },
  methods: {
    initList() {
      let oddArr = this.odd.map((item) => {
        return item.id
      })
      let doubleArr = this.double.map((item) => {
        return item.id
      })
      this.stageTypeOption = [
        {
          label: '双周体验课',
          value: doubleArr,
        },
        {
          label: '单周体验课',
          value: oddArr,
        },
      ]
    },
    stageTypeChange(item) {
      if (!item) {
        item = [500, 503, 505, 508, 502, 506, 507]
      }
      if (this.name) {
        this.$emit('stageTypeRes', { packages_id: item })
      } else {
        this.$emit('stageTypeRes', { category: item })
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
