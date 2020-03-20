<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:33
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-20 12:15:01
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
        style="marginTop:10px;"
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
          <el-card
            :class="['box-card', heighLight == index ? 'hover-color' : '']"
            shadow="hover"
          >
            <div class="clcle-header">
              <span>{{ item.team_name }}</span>
              <span class="text-icons">{{ item.week }}</span>
            </div>
            <div class="clcle-info">
              <span>
                <i class="el-icon-school"></i>
                {{ item.pre_enroll }}
              </span>
              <span>
                <i class="el-icon-user"></i>
                {{ item.teacher.realname }}
              </span>
              <span>
                <i class="el-icon-date"></i>
                {{ item.formatCtime }}-0210
              </span>
            </div>
          </el-card>
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
  padding: 10px;
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
    .cycle-box {
      cursor: pointer;
      .box-card {
        margin-top: 5px;
        .clcle-header {
          font-size: 14px;
          .text-icons {
            margin-left: 8px;
            padding: 0 5px;
            color: white;
            background: #41a0fa;
          }
        }
        .clcle-info {
          font-size: 12px;
          margin-top: 6px;
          span {
            margin-right: 8px;
          }
        }
      }
    }
  }
}
.hover-color {
  background: rgb(240, 247, 255);
}
</style>
<style lang="scss">
.box-card {
  .el-card__body {
    padding: 10px;
  }
}
.center-container .scrollbar-wrapper {
  overflow-x: hidden;
}
</style>
