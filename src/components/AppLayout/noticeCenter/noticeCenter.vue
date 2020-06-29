<template>
  <div class="notice-box">
    <el-drawer
      title="通知中心"
      custom-class="notice-drawer"
      :visible.sync="showNoticeDrawer"
      :modal-append-to-body="false"
    >
      <ul class="drawer-list">
        <li
          v-for="(item, key) in listData"
          :key="key"
          class="drawer-item"
          :class="[{ 'drawer-item-hover': item.hover }]"
          @mouseenter="mouseIn(key)"
          @mouseleave="mouseOut(key)"
        >
          <div class="item-title">
            <span>产品动态</span>
            <span class="title-time">时间</span>
          </div>
          <div
            v-show="!item.expand"
            class="item-content"
            @click="clickContent(key, true)"
          >
            通知标题通知标题通知标题通知标题通知标题通知标题通知标题通知标题通知标题
          </div>
          <div
            v-show="item.expand"
            class="item-content"
            @click="clickContent(key, false)"
          >
            <p>学员:<span>圆圆 2344</span>在2020生成已完成订单</p>
            <el-button type="text" @click="clickDetail">查看详情</el-button>
          </div>
        </li>
      </ul>
      <el-button class="drawer-bottom-button" type="text" @click="clickDetail">
        进入通知中心
      </el-button>
    </el-drawer>
  </div>
</template>

<script>
import { debounce } from 'lodash'
export default {
  name: 'noticeCenterComponent',
  data() {
    return {
      showNoticeDrawer: false,
      listData: [
        {
          item: 1
        },
        {
          item: 2
        }
      ]
    }
  },
  methods: {
    openDrawer() {
      this.showNoticeDrawer = true
    },
    closeDrawer() {
      this.showNoticeDrawer = false
    },
    mouseIn: debounce(function(index) {
      this.$set(this.listData[index], 'hover', true)
    }, 200),
    mouseOut: debounce(function(index) {
      this.$set(this.listData[index], 'hover', false)
    }, 200),
    clickContent(index, val) {
      this.$set(this.listData[index], 'expand', val)
    },
    clickDetail() {
      location.href = `${location.protocol}//${location.host}/noticeCenter/#/`
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
/deep/ .el-drawer__header span[role='heading']:focus {
  outline: 0;
}
.notice-box {
  .notice-drawer {
    position: relative;
    .drawer-list {
      border-top: 1px solid #f8f8f8;
      margin-bottom: 60px;
      .drawer-item {
        padding: 15px;
        .item-title {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #b2b2b2;
        }
        .item-content {
          padding: 5px;
          span {
            color: #15b0fe;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
      .drawer-item-hover {
        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
    .drawer-bottom-button {
      position: absolute;
      bottom: 0;
      border-top: 1px solid #f8f8f8;
      width: 100%;
      height: 60px;
    }
  }
}
</style>
