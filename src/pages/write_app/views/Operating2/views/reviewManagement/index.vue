<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 10:08:48
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-15 17:46:00
 */
 -->
<template>
  <div class="container">
    <div class="top-tabs">
      <div
        v-for="(item, index) in tabStatus"
        :key="index"
        :class="{ active: index == tabIndex }"
        @click="handleClick(item, index)"
      >
        {{ item.label }}
      </div>
    </div>
    <component :is="renderComponent" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: '0',
      tabStatus: [
        {
          index: '0',
          label: '语音库'
        },
        {
          index: '1',
          label: '作业点评'
        }
      ]
    }
  },
  computed: {
    renderComponent() {
      return this.tabIndex === '0' ? 'AudioLib' : 'WorkRiview'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.tabIndex = tab.index
    }
  },
  components: {
    AudioLib: () => import('./components/audioLib'),
    WorkRiview: () => import('./components/workRiview')
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 10px;
  .top-tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: #f0f1f2;
    > div {
      margin-right: 20px;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      transition: 0.1s;
      font-weight: 500;
      padding: 9px 15px;
      border-radius: 20px;
      font-size: 12px;
      &.active {
        background: #2a75ed;
        color: #fff;
      }
    }
  }
}
</style>
