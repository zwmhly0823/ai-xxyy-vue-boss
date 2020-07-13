<!--
 * @Descripttion: 学习记录
 * @version: 1.0.0
 * @Author: zhangjianwen
 * @Date: 2020-07-09 15:02:59
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-07-13 17:13:18
-->
<template>
  <div class="learn-record">
    <div class="record-header">
      <el-tabs v-model="term">
        <el-tab-pane
          v-for="mg in manageMentList"
          :label="mg.period_label"
          :name="mg.period"
          :key="mg.period"
        >
        </el-tab-pane>
        <el-tab-pane>
          <el-dropdown @command="handleCommand" slot="label">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :key="mg.management.period"
                v-for="mg in manageMentHistoryList"
                :command="mg.management.period"
                >{{ mg.management.period_name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="record-header">
      <el-tabs v-model="level">
        <el-tab-pane label="S1难度" name="S1"></el-tab-pane>
        <el-tab-pane label="S2难度" name="S2"></el-tab-pane>
        <el-tab-pane label="S3难度" name="S3"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="record-con">
      <el-row>
        <el-col
          :span="6"
          v-for="item in recordList"
          :key="item.id"
          class="card-main"
        >
          <el-card :body-style="{ padding: '0px' }">
            <div class="card-data">
              {{ timeSplit(item.send_date) }}
            </div>
            <div class="card-content">
              <div class="content-img">
                <img :src="item.image" class="image" />
              </div>

              <div class="content-word" style="padding: 14px;">
                <p>课程名称：{{ item.title }}</p>
                <p>课程类型：{{ learn_type[item.lesson_type] }}</p>
                <p>
                  今日参课：{{
                    `${item.today_join_course_count}/${item.all_send_course_count}  `
                  }}
                </p>
                <p>
                  昨日参课：{{
                    `${item.yesterday_join_course_count}/${item.all_send_course_count}  `
                  }}
                </p>
                <p>
                  今日完课：{{
                    `${item.today_complete_course_count}/${item.all_send_course_count}  `
                  }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="empty" v-if="recordList.length === 0">暂无数据</div>
    <div class="pag-con">
      <m-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :pageSize="8"
        :total="totalElements"
        @current-change="handleSizeChange"
        show-pager
        open="calc(100vw - 170px - 25px)"
        close="calc(100vw - 50px - 25px)"
      ></m-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import MPagination from '@/components/MPagination/index.vue'
// import Search from '../../components/Search.vue'

export default {
  name: 'trialUsers',
  components: {
    MPagination
    // Search
  },
  computed: {},
  data() {
    return {
      manageMentList: [],
      manageMentHistoryList: [],
      term: '0',
      level: '0',
      recordList: [],
      currentPage: 1,
      totalPages: null,
      totalElements: null,
      learn_type: {
        0: '小熊AI课',
        10: '家长课堂',
        11: '小熊TV课'
      }

      // editableTabsValue: '2',
      // editableTabs: [
      //   {
      //     title: 'Tab 1',
      //     name: '1',
      //     content: 'Tab 1 content'
      //   },
      //   {
      //     title: 'Tab 2',
      //     name: '2',
      //     content: 'Tab 2 content'
      //   }
      // ],
      // tabIndex: 2
    }
  },
  watch: {
    term(val, old) {
      if (val === '2') {
        return false
      }
      this.term = val
      this.currentPage = 1
      this.getData(this.currentPage, val, this.level)
    },
    level(val, old) {
      this.level = val
      this.currentPage = 1
      this.getData(this.currentPage, this.term, val)
    }
  },
  created() {},
  mounted() {
    this.getManagement().then(() => {
      this.term = this.manageMentList[0].period
      this.level = 'S1'
      // this.getData()
    })
  },
  methods: {
    compare(pre, property) {
      return function(a, b) {
        var value1 = a.pre.property
        var value2 = b.pre.property
        return value1 - value2
      }
    },
    // 获取排期期数
    getManagement() {
      const params = {
        // teacher_id: this.teacherIds
      }
      return this.$http.User.ManagementForTeacherList(params).then((res) => {
        if (res && res.data && res.data.ManagementForTeacherList) {
          if (res.data.ManagementForTeacherList.length === 0) {
            return
          }

          // 只显示开课中的期数 status // 1 招生中   2待开课   3 开课中  4 已结课',
          const arr = res.data.ManagementForTeacherList.filter(
            (item) => item.management && item.management.status === 3
          )
          const arrHistory = res.data.ManagementForTeacherList.filter(
            (item) => item.management && item.management.status === 4
          )
          const arrSort = arr.sort((a, b) => {
            return a.management.period - b.management.period
          })
          const arrHistorySort = arrHistory.sort((b, a) => {
            return a.management.period - b.management.period
          })
          this.manageMentHistoryList = arrHistorySort
          const list = arrSort.map((item) => {
            item.management.period_label = `${item.management.period_name}(
              开课中
            )`

            return item.management
          })

          this.manageMentList = _.orderBy(list, ['status'], ['desc'])
        }
      })
    },
    // 查询
    getData(page = this.currentPage, term = this.term, level = this.level) {
      this.recordList = []
      return this.$http.User.getStudentTrialRecordPage(page, term, level)
        .then((res) => {
          if (
            res &&
            res.data &&
            res.data.StudentTrialRecordOperatorStatisticsPage
          ) {
            const data = res.data.StudentTrialRecordOperatorStatisticsPage
            this.totalElements = Number(data.totalElements)
            this.totalPages = Number(data.totalPages)
            this.recordList = data.content
          }
        })
        .catch(() => {})
    },

    handleCommand(command) {
      this.term = command
    },

    handleSizeChange(val) {
      this.currentPage = val
      this.getData(val)
    },
    // 时间格式
    timeSplit(date) {
      return date
        .split('-')
        .splice(1)
        .join('-')
    }
  }
}
</script>

<style lang="scss" scoped>
.trial-container-body {
  flex: 1;
  overflow: hidden;
  background-color: #fff;
}
.learn-record {
  margin: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background-color: #f0f1f2;
  .record-header {
    padding: 0 20px;
    background-color: white;
    margin-bottom: 10px;
    border-bottom: 10px solid #f0f1f2;
  }
  .record-con {
    padding-bottom: 50px;
  }
  .pag-con {
    position: fixed;
    width: 100%;
    height: 20px;
    background: #f0f1f2;
    bottom: 0;
    right: 0;
  }
}
.card-main {
  padding: 10px;
  .card-data {
    margin: 10px auto;
    width: 100px;
    background-color: gray;
    color: white;
    text-align: center;
  }
  .content-img {
    width: 40%;
    padding: 10px;
    img {
      width: 100%;
    }
  }
  .card-content {
    padding-top: 10px;
    display: flex;
    .content-word {
      p {
        height: 20px;
      }
    }
  }
}

.empty {
  text-align: center;
  background: white;
  width: 100%;
  height: 500px;
  line-height: 200px;
  font-size: 20px;
}
/deep/ .el-tabs__header {
  padding: 0;
  position: relative;
  margin: 0 0 0 !important;
}
</style>
