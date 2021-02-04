<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-12-23 18:15:16
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-09 21:48:04
 {
     label: '参课总人数',
     count: '12',
     total: '100',
     unit: '人数’,
     disabled: true, // 是否可点击
 }
-->
<template>
  <div class="statistics-box">
    <div
      class="statistics-item"
      :class="{ disabled: item.disabled, active: active }"
      @click="handleClick"
      v-if="item && item.type !== 'group'"
    >
      <h3>
        {{ item.count || '0' }}
        <span v-if="item.total || item.total === 0">/{{ item.total }}</span>
        <span v-if="item.unit">{{ item.unit }}</span>
      </h3>
      <p>{{ item.label }}</p>
    </div>
    <div
      class="statistics-item statistics-item-group"
      v-if="item && item.type === 'group'"
    >
      <div class="group-box">
        <div
          class="group-item"
          :class="{ active: i.active }"
          v-for="(i, key) in item.list"
          :key="key"
          @click="clickGroupItem(i, key, item.list)"
        >
          <div class="line-1">{{ i.name }}</div>
          <div class="line-2">{{ i.value }}</div>
        </div>
      </div>
      <p>{{ item.label }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * {
        label: '参课总人数',
        count: '12',
        total: '100',
        unit: '人数’,
        disabled: true, // 是否可点击
    }
    */
    item: {
      type: Object,
      default: () => {}
    },
    active: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      currentItem: '',
      groupKey: -1
    }
  },
  methods: {
    handleClick() {
      if (!this.item || this.item.disabled) return
      this.currentItem = this.index
      this.$emit('current', this.index)
    },
    clickGroupItem(item, key, list) {
      // 记录下当前点的index，如果以后有多个组那就再加个type属性
      if (this.groupKey === key) {
        if (item.active) {
          this.$set(item, 'active', false)
          this.$emit('current-group', item, false, this.index)
        } else {
          this.$set(item, 'active', true)
          this.$emit('current-group', item, true, this.index)
        }
      } else {
        this.groupKey > -1 && this.$set(list[this.groupKey], 'active', false)
        this.groupKey = key
        this.$set(item, 'active', true)
        this.$emit('current-group', item, true, this.index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-box {
  display: inline-block;
  .statistics-item {
    display: inline-block;
    min-width: 90px;
    margin-right: 15px;
    background-color: #fff;
    text-align: center;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid transparent;
    cursor: pointer;
    &.disabled {
      cursor: default;
      &:hover {
        box-shadow: none;
      }
      p {
        background-color: #f8fafc;
      }
    }
    &:hover {
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
    }
    &.active {
      border-color: #2a75ed;
      box-shadow: 0 0 6px rgba(42, 117, 237, 0.5);
    }
    h3 {
      margin: 5px 0;
      padding: 0 5px;
      span {
        font-size: 12px;
        font-weight: normal;
      }
    }
    p {
      margin: 0;
      padding: 0 5px;
      color: #303133;
      font-size: 12px;
      background-color: #f1f8fd;
    }
  }
  .statistics-item-group {
    cursor: default;
    &:hover {
      box-shadow: none;
    }
    .group-box {
      display: flex;
      // display: grid;
      // grid-template-columns: repeat(12, 1fr);
      .group-item {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        border: 1px solid #eee;
        cursor: pointer;
        margin: 0 1px;
        &:hover {
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
        }
        .line-1 {
          border-bottom: 1px solid #eee;
          padding: 0px 5px;
          color: #666;
        }
        .line-2 {
          font-weight: bold;
        }
        &.active {
          border: 1px solid #2a75ed;
          box-shadow: 0 0 3px rgba(42, 117, 237, 1);
        }
      }
    }
  }
}
</style>
