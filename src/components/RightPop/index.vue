<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-11 16:06:24
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-11 16:52:29
-->
<template>
  <div class="right-pop" :style="myPosition">
    <ul>
      <li @click="openTab">
        新标签打开
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    //   事件获取元素坐标
    position: {
      type: Object,
      default: () => {}
    },
    // 当前路由内容
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['rightpop']),
    myPosition() {
      const top = `${this.rightpop.top}px`
      const left = `${this.rightpop.left}px`
      return {
        top,
        left
      }
    }
  },
  methods: {
    openTab() {
      console.log(this.rightpop.item)

      // window.open(path, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.right-pop {
  position: fixed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.2);
}
</style>
