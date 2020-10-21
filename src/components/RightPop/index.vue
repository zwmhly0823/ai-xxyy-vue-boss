<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-11 16:06:24
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-16 13:55:39
-->
<template>
  <div class="right-pop" v-if="rightpop && rightpop.show" :style="myPosition">
    <ul>
      <li @click.stop="openTab" @mouseleave="handleRightLeave">
        新标签页打开
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['rightpop']),
    myPosition() {
      const top = `${this.rightpop.top + 10}px`
      const left = `${this.rightpop.left + 10}px`
      return {
        top,
        left
      }
    }
  },
  methods: {
    openTab() {
      this.handleReset()

      const currentItem = this.rightpop.item
      const { path, meta } = currentItem
      const { pathname, origin } = location
      let baseUrl = ''

      if (pathname.includes('test')) {
        const pathArr = pathname.split('/')
        baseUrl = '/' + [pathArr[1]].join('/') // , pathArr[2]
      }
      const pathUrl = `${origin}${baseUrl}/${meta.module}/#${path}`
      console.log(pathUrl)

      window.open(pathUrl, '_blank')
    },
    handleRightLeave() {
      if (!this.rightpop.show) return
      this.$store.dispatch('app/setRightPop', {
        show: false
      })
    },
    handleReset() {
      this.$store.dispatch('app/setRightPop', {
        show: false
      })
      this.$store.commit('app/TOGGLE_POPMENU', {
        show: false
      })
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
  z-index: 3000;
  ul {
    margin: 0;
    padding: 10px;
  }
  li {
    list-style: none;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
