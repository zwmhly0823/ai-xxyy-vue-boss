<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-13 16:53:33
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-03-18 22:43:30
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
        style="marginTop:10px;overflow:auto"
        v-infinite-scroll="load"
      >
        <li
          v-for="item in showClassData.datas"
          :key="item.id"
          class="infinite-list-item cycle-box"
          @click="clickHandler(item)"
        >
          <el-card class="box-card" shadow="hover">
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
    return {}
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
      //!  分页数据
      // const pageData = {
      //   totalElements:
      //     this.classData.teamStatusPage &&
      //     this.classData.teamStatusPage.totalElements,
      //   totalPages:
      //     this.classData.teamStatusPage &&
      //     this.classData.teamStatusPage.totalPages
      // }
      return { datas }
    }
  },
  watch: {},
  methods: {
    clickHandler(data) {
      this.$emit('change', data.id)
    },
    load() {
      console.log('a')
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
