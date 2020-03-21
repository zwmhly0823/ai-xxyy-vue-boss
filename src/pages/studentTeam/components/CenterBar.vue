<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:33
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-21 15:28:59
 -->
<template>
  <div class="center-container">
    <div class="headers" v-if="false">
      <span>
        <i class="el-icon-brush" />
      </span>
      <span>
        <i class="el-icon-sort" />
      </span>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" style="flex: 1;">
      <ul
        class="infinite-list container"
        v-infinite-scroll="load"
        infinite-scroll-distance="10px"
        infinite-scroll-disabled="disabled"
      >
        <li
          v-for="(item, index) in showList ? showList : showClassData.datas"
          :key="index"
          class="infinite-list-item cycle-box"
          @click="clickHandler(item, index)"
        >
          <div
            :class="['box-card', heighLight == index ? 'hover-color' : '']"
            shadow="hover"
          >
            <div class="clcle-header">
              <span>{{ item.team_name }}</span>
              <span class="text-icons">{{ item.week }}</span>
            </div>
            <div class="clcle-info">
              <span class="imgtext1">
                <img src="@/assets/images/icon/teams.png" alt="" />
                <span>{{ item.enrolled }}</span>
              </span>
              <span class="imgtext2">
                <img src="@/assets/images/icon/teacher.png" alt="" />
                <span>{{ item.teacher.realname }}</span>
              </span>
              <span class="imgtext3">
                <i class="el-icon-date"></i>
                <span>{{ item.formatCtime }}-{{ item.formatCtime }}</span>
              </span>
            </div>
          </div>
        </li>
      </ul>
      <p v-if="loading" style="text-align:center">
        加载中...
      </p>
      <p v-if="noMore" style="text-align:center">
        没有更多了
      </p>
    </el-scrollbar>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    classData: {
      type: Object,
      default: () => ({})
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      noMore: false,
      type: 0,
      showList: [],
      heighLight: 0
    }
  },
  computed: {
    /**
     * 班级列表展示数据
     */
    showClassData() {
      const datas =
        this.classData.teamStatusPage &&
        this.classData.teamStatusPage.content.map((item) => {
          // 格式化开课时间
          item.formatCtime = dayjs
            .unix(Number(item.ctime) / 1000)
            .format('MMDD')
          return item
        })
      // 分页数据
      const pageData = {
        totalElements:
          this.classData.teamStatusPage &&
          this.classData.teamStatusPage.totalElements,
        totalPages:
          this.classData.teamStatusPage &&
          this.classData.teamStatusPage.totalPages,
        nums:
          this.classData.teamStatusPage && this.classData.teamStatusPage.number
      }
      // 0体验课 1系统课
      const types = this.classData.type
      const scrollStatus = this.classData.scrollStatus
      return { datas, pageData, types, scrollStatus }
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  watch: {
    // 是否切换左栏
    showClassData(val, old) {
      if (val.scrollStatus !== old.scrollStatus) {
        this.showList = []
        this.showList = this.showClassData.datas
        this.noMore = false
        this.heighLight = ''
        this.load()
      } else {
        if (this.showList.length === 0) {
          this.showList = this.showClassData.datas
        }
      }
    }
  },
  methods: {
    clickHandler(data, index) {
      this.heighLight = index
      this.$emit('change', { datas: data, type: this.showClassData.types })
    },
    // 下拉刷新
    load() {
      console.log('触发load函数')
      // 页码总数大于20 并且当前页数小于总页数
      if (
        +this.showClassData.pageData.totalElements > 9 &&
        +this.showClassData.pageData.totalPages >
          this.classData.teamStatusPage.number
      ) {
        // loading
        this.loading = true
        // 页码
        const nums = +this.showClassData.pageData.nums + 1
        // 课程类型
        this.type = this.showClassData.types

        this.$emit('scrollHandler', {
          page: nums,
          type: this.type
        })

        setTimeout(() => {
          this.loading = false

          this.showList.push(...this.showClassData.datas)
          // 列表数据总数等于分页总数时 不再加载
          if (
            this.showList.length === +this.showClassData.pageData.totalElements
          ) {
            this.noMore = true
          }
        }, 1000)
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
.center-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .headers {
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #e3e3e3;
    span {
      width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .container {
    list-style: none;
    padding-left: 0;
    margin-top: 0px;
    .cycle-box {
      cursor: pointer;
      .box-card {
        .clcle-header {
          font-size: 14px;
          .text-icons {
            font-size: 12px;
            margin-left: 8px;
            padding: 2px 4px;
            color: #59a0f3;
            background: #e5f1ff;
          }
        }
        .clcle-info {
          color: #666;
          font-size: 12px;
          margin-top: 8px;
          span {
            span {
              margin-left: 3px;
            }
          }
          .imgtext1 {
            margin-right: 8px;
            img {
              display: inline-block;
              width: 18px;
              position: relative;
              top: 4px;
            }
            span {
              position: relative;
            }
          }
          .imgtext2 {
            margin-right: 8px;
            img {
              display: inline-block;
              width: 10px;
            }
          }
        }
      }
    }
  }
}
.hover-color {
  // background: rgba(240, 241, 242, 1);
  background: #ebebeb;
}
</style>
<style lang="scss">
.box-card {
  padding: 15px 17px;
  border-bottom: 1px solid rgba(237, 237, 237, 1);

  // .el-card__body {
  // }
}
.center-container .scrollbar-wrapper {
  overflow-x: hidden;
}
</style>
