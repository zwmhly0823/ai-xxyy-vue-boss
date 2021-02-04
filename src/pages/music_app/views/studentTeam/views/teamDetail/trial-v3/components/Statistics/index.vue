<!--
 * @Descripttion: 统计区域
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-23 18:15:09
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-12-26 19:51:26
 list: [
        {
          label: '参课总人数',
          count: '12',
          total: '100',
          unit: '',
          disabled: true // 是否可点击
        },
        {
          label: '参课总人数',
          count: '12',
          total: '100',
          unit: ''
          // disabled: true // 是否可点击
        },
        {
          label: '参课总人数4532',
          count: '12',
          total: '130',
          unit: ''
          // disabled: true // 是否可点击
        }
      ],
-->
<template>
  <div class="statistics-section">
    <statistic-item
      :item="item"
      :index="index"
      :active="current === index"
      v-for="(item, index) in list"
      :key="index"
      @current="handleSelect"
      @current-group="handleSelectGroup"
    />
  </div>
</template>

<script>
import StatisticItem from './Item'
export default {
  components: {
    StatisticItem
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 点击的列表的index
      current: ''
    }
  },
  methods: {
    handleSelect(index, name) {
      // 再次点击已选中的，取消选中
      this.current = this.current === index ? '' : index
      for (let i = 0, len = this.list.length; i < len; i++) {
        const listItem = this.list[i]
        if (listItem.type === 'group') {
          this.list[i].list.forEach((child) => {
            if (child.active) {
              child.active = false
            }
          })
        }
      }
      this.$emit('result', this.current, name)
    },
    handleSelectGroup(item, active, index) {
      // 清空其他部分的选中
      this.current = ''
      // 清空其他Group部分的选中
      for (let i = 0, len = this.list.length; i < len; i++) {
        const listItem = this.list[i]
        if (listItem.type === 'group' && i !== index) {
          this.list[i].list.forEach((child) => {
            if (child.active) {
              child.active = false
            }
          })
        }
      }
      this.$emit('result-group', item.filter, active)
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-section {
  padding: 10px;
  background-color: #f0f1f2;
}
</style>
