<template>
  <div class="notice-box">
    <el-drawer
      title="通知中心"
      custom-class="notice-drawer"
      :visible.sync="showNoticeDrawer"
      :modal-append-to-body="false"
    >
      <ul
        class="drawer-list infinite-list"
        v-loading="noticeLoading"
        v-if="noticeData.hasOwnProperty('code')"
      >
        <template v-if="!listData || !listData.length">
          <li class="drawer-item-empty">
            暂无数据
          </li>
        </template>
        <template v-else>
          <li
            v-for="(item, key) in listData"
            :key="key"
            class="drawer-item infinite-list-item"
            :class="[{ 'drawer-item-hover': item.hoverStatus }]"
            @mouseenter="mouseIn(key)"
            @mouseleave="mouseOut(key)"
          >
            <div class="item-title">
              <span>{{ item.typeName }}</span>
              <span
                v-show="item.hoverStatus"
                class="has-read"
                @click="hasRead(item.id, key)"
                >标为已读</span
              >
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
                @click="clickDetail(item.typeId, item.jumpLink)"
              >
                查看详情
              </el-button>
            </div>
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
import { noticeLinkTo } from '@/pages/noticeCenter/utils/functions'
export default {
  name: 'noticeCenterComponent',
  data() {
    return {
      showNoticeDrawer: false,
      staffId: '',
      noticeData: {},
      listData: [],
      curPage: 1,
      noticeLoading: false
    }
  },
  created() {
    this.staffId = JSON.parse(localStorage.getItem('staff')).id
  },
  methods: {
    openDrawer() {
      this.showNoticeDrawer = true
      this.getListData()
    },
    closeDrawer() {
      this.showNoticeDrawer = false
    },
    mouseIn: debounce(function(index) {
      this.$set(this.listData[index], 'hoverStatus', true)
    }, 100),
    mouseOut: debounce(function(index) {
      this.$set(this.listData[index], 'hoverStatus', false)
    }, 100),
    clickContent(index, val) {
      this.$set(this.listData[index], 'expand', val)
    },
    // 通往消息中心
    clickNoticeCenter() {
      let testUrlAppend = ''
      if (location.hostname.split('.')[0] === 'test') {
        testUrlAppend = 'ai-app-vue-boss-test/'
      }
      location.href = `${location.protocol}//${location.host}/${testUrlAppend}notice-center/#/`
    },
    clickDetail(type, val) {
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
    hasRead(id, index) {
      this.noticeLoading = true
      const query = {
        staffId: +this.staffId,
        notifyIds: +id
      }
      this.$http.NoticeCenter.updateNotifyIsReadByStaffId(query)
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            this.listData.splice(index, 1)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          } else {
            this.$message.error('修改失败')
          }
          this.noticeLoading = false
        })
        .catch(() => {
          this.noticeLoading = false
          this.$message.error('修改失败')
        })
    },
    getNextPageData() {
      this.curPage++
      this.getListData()
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
      overflow: auto;
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
