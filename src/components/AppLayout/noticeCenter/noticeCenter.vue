<template>
  <div class="notice-box">
    <el-drawer
      title="通知中心"
      custom-class="notice-drawer"
      :visible.sync="showNoticeDrawer"
      :modal-append-to-body="false"
      :with-header="false"
    >
      <div class="drawer-header">
        <span>通知中心</span>
        <i class="el-icon-close header-close" @click="closeDrawer"></i>
        <el-button
          plain
          size="mini"
          class="all-read-button"
          @click="allReadClicked"
        >
          全部已读
        </el-button>
      </div>
      <ul
        class="drawer-list"
        v-loading="noticeLoading"
        v-if="noticeData.hasOwnProperty('code')"
      >
        <template v-if="!listData || !listData.length">
          <li class="drawer-item-empty">
            暂时没有未读消息
          </li>
        </template>
        <template v-else>
          <li
            v-for="(item, key) in listData"
            :key="key"
            class="drawer-item"
            :class="[{ 'drawer-item-hover': item.hoverStatus }]"
            @mouseenter="mouseIn(key)"
            @mouseleave="mouseOut(key)"
          >
            <div class="item-title">
              <span>{{ item.typeName }}</span>
              <span
                v-show="item.hoverStatus"
                class="has-read"
                @click="hasRead(item.id, key, true)"
              >
                标为已读
              </span>
              <span v-show="!item.hoverStatus" class="title-time">
                {{ item.notifyTimeFormatted }}
              </span>
            </div>
            <p
              v-show="!item.expand"
              class="item-content"
              @click="clickContent(key, true)"
            >
              {{ item.title }}
            </p>
            <div
              v-show="item.expand"
              class="item-content"
              @click="clickContent(key, false)"
            >
              <p>{{ item.briefIntroduction }}</p>
              <div class="small-text">{{ item.content }}</div>
              <el-button
                type="text"
                @click="clickDetail(item.typeId, item.jumpLink, item.id, key)"
              >
                查看详情
              </el-button>
            </div>
          </li>
          <li>
            <div ref="lazyLoadingBox" class="lazy-loading-box"></div>
          </li>
        </template>
      </ul>
      <el-button
        class="drawer-bottom-button"
        type="text"
        @click="clickNoticeCenter"
      >
        进入通知中心
      </el-button>
    </el-drawer>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { formatData } from '@/utils/index'
import { noticeLinkTo } from '@/pages/art_app/views/noticeCenter/utils/functions'
export default {
  name: 'noticeCenterComponent',
  data() {
    return {
      showNoticeDrawer: false,
      staffId: '',
      noticeData: {},
      listData: [],
      curPage: 1,
      noticeLoading: false,
      repeatMap: new Map()
    }
  },
  created() {
    const staff = localStorage.getItem('staff')
    staff && (this.staffId = JSON.parse(staff).id)
  },
  methods: {
    openDrawer() {
      this.showNoticeDrawer = true
      this.listData = []
      this.getListData()
      // 滚动懒加载
      this.$nextTick(() => {
        this.initListener()
      })
    },
    closeDrawer() {
      this.showNoticeDrawer = false
    },
    mouseIn(index) {
      this.$set(this.listData[index], 'hoverStatus', true)
    },
    mouseOut(index) {
      this.$set(this.listData[index], 'hoverStatus', false)
    },
    clickContent(index, val) {
      this.$set(this.listData[index], 'expand', val)
      // 标为已读，且防止重复请求
      if (this.repeatMap.get(this.listData[index].id)) {
        return
      }
      this.hasRead(this.listData[index].id, index, true, false)
      // 把id存到一个标示数组里
      this.repeatMap.set(this.listData[index].id, 1)
    },
    // 通往消息中心
    clickNoticeCenter() {
      let testUrlAppend = ''
      if (location.hostname.split('.')[0] === 'test') {
        testUrlAppend = 'ai-app-vue-boss-test/'
      }
      location.href = `${location.protocol}//${location.host}/${testUrlAppend}notice-center/#/`
    },
    clickDetail(type, val, id, index) {
      // 查看详情要触发标为已读
      this.hasRead(id, index, false)
      noticeLinkTo(type, val)
    },
    getListData() {
      this.noticeLoading = true
      const query = {
        pageNumber: this.curPage,
        pageSize: 20,
        staffId: this.staffId,
        typeId: '' // 可以传空
      }
      this.$http.NoticeCenter.getAllNotifyByStaffId(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            res.payload.content.forEach((lItem) => {
              lItem.notifyTimeFormatted = formatData(lItem.notifyTime, 's')
            })
            this.noticeData = res
            this.listData = this.listData.concat(res.payload.content)
            this.listData.length < 20 && this.removeListener()
          } else {
            this.$message.error('获取消息列表失败')
          }
          this.noticeLoading = false
        })
        .catch(() => {
          this.noticeLoading = false
          this.$message.error('获取消息列表失败')
        })
    },
    // 标为已读
    // clicked用户点击标为已读（true）还是从其他地方连带着触发的（false）
    hasRead(id, index, clicked, freshList = true) {
      freshList && (this.noticeLoading = true)
      const query = {
        staffId: this.staffId,
        notifyIds: +id
      }
      this.$http.NoticeCenter.updateNotifyIsReadByStaffId(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            freshList && this.listData.splice(index, 1)
            !clicked && this.closeDrawer()
            // 角标消息数-1
            this.$emit('reduceBadge')
          }
          this.noticeLoading = false
        })
        .catch(() => {
          this.noticeLoading = false
        })
    },
    allReadPost() {
      const query = {
        staffId: this.staffId,
        isAllRead: 1
      }
      this.$http.NoticeCenter.arrReadNotifyIsReadByStaffId(query).then(
        (res) => {
          if (res.code === 0 && res.status === 'OK') {
            // 角标消息数-1
            this.$emit('clearBadge')
            this.closeDrawer()
          }
        }
      )
    },
    // 全部已读
    allReadClicked() {
      if (!this.listData.length) {
        this.$message('没有未读消息')
        return
      }
      this.$confirm('您确定要将全部未读通知标为已读?', '全部标及提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.allReadPost()
        })
        .catch(() => {
          this.closeDrawer()
        })
    },
    getNextPageData() {
      this.curPage++
      this.getListData()
    },
    initListener() {
      document
        .getElementsByClassName('el-drawer__body')[0]
        .addEventListener('scroll', this.scrollEvent)
    },
    removeListener() {
      document
        .getElementsByClassName('el-drawer__body')[0]
        .removeEventListener('scroll', this.scrollEvent)
    },
    scrollEvent: debounce(function() {
      // 可视区域高度
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      // 判定元素距离顶部的距离
      const itemToTop = this.$refs.lazyLoadingBox.offsetTop
      // 滚动距离
      const scrollLong = document.getElementsByClassName('el-drawer__body')[0]
        .scrollTop
      // console.log(clientHeight, itemToTop, scrollLong)
      if (clientHeight + scrollLong >= itemToTop + 60) {
        this.getNextPageData()
      }
    }, 100)
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
/deep/ .el-drawer__body {
  overflow: auto;
}
.notice-box {
  .notice-drawer {
    position: relative;
    .drawer-header {
      color: #72767b;
      padding: 20px;
      .header-close {
        float: right;
        font-size: 16px;
        cursor: pointer;
      }
      .all-read-button {
        float: right;
        margin-right: 20px;
        margin-top: -5px;
      }
    }
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
          .has-read {
            color: #15b0fe;
            cursor: pointer;
          }
        }
        .item-content {
          padding: 5px;
          .small-text {
            font-size: 12px;
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
      .drawer-item-empty {
        text-align: center;
        color: #b2b2b2;
        margin-top: 15px;
      }
      .lazy-loading-box {
        height: 10px;
        background-color: #fff;
      }
    }
    .drawer-bottom-button {
      position: absolute;
      bottom: 0;
      border-top: 1px solid #f8f8f8;
      width: 100%;
      height: 60px;
      background-color: #fff;
    }
  }
}
</style>
