<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-06-09 10:52:48
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-09 17:09:55
-->
<template>
  <div
    id="custom-menu"
    class="el-menu--vertical custome-pop-menu"
    :style="myStyle"
    x-placement="right-start"
    v-show="popMenu.show"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <ul role="menu" class="el-menu el-menu--popup el-menu--popup-right-start">
      <li data-v-1c22e290="" class="el-menu-item-group">
        <div class="el-menu-item-group__title" style="padding-left: 20px;">
          <span data-v-1c22e290="">物流中心</span>
        </div>
        <ul>
          <li class="el-menu-item">
            <em data-v-1c22e290="">体验课</em>
          </li>
          <li class="el-menu-item">
            <em data-v-1c22e290="">系统课</em>
          </li>
          <li class="el-menu-item">
            <em data-v-1c22e290="">活动商品</em>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['popMenu']),
    myStyle() {
      return {
        top: this.popMenu.top + 'px',
        left: this.popMenu.left + 'px'
      }
    }
  },
  methods: {
    handleEnter(e) {
      this.$store.commit('app/TOGGLE_POPMENU', {
        show: true
        // itemMenu: {},
        // left: 0,
        // top: 0
      })
    },
    handleLeave(e) {
      this.$store.commit('app/TOGGLE_POPMENU', {
        show: false,
        itemMenu: {},
        left: 0,
        top: 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#custom-menu.el-menu--vertical {
  position: fixed;
  z-index: 2000;
  border-left: 3px solid transparent;
  .el-menu--popup {
    .el-menu-item {
      height: 30px !important;
      line-height: 30px !important;
      padding: 0 20px !important;
      // font-size: 13px;
      // background-color: #fff;
      // color: #292f41;
      &:hover {
        background-color: transparent !important;
      }
    }
  }
}
</style>
