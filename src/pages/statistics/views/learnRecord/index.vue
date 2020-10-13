<!--
 * @Descripttion: 学习记录
 * @version: 1.0.0
 * @Author: zhangjianwen
 * @Date: 2020-07-09 15:02:59
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-10-13 23:15:57
-->
<template>
  <div class="learn-record">
    <div class="record-header">
      <el-tabs v-model="lessonType">
        <el-tab-pane label="体验课" name="0"></el-tab-pane>
        <el-tab-pane label="系统课" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="record-header">
      <el-tabs v-model="term" @tab-click="clearName">
        <el-tab-pane
          v-for="mg in manageMentList"
          :label="mg.period_label"
          :name="mg.period"
          :key="mg.period"
        >
        </el-tab-pane>
        <el-tab-pane
          v-if="manageMentList.length <= 0 && mangeFirst"
          :label="mangeFirst.period_label"
          :name="mangeFirst.period"
          :key="mangeFirst.period"
        >
        </el-tab-pane>
        <el-tab-pane
          disabled
          name="999"
          v-if="manageMentHistoryList.length > 0"
        >
          <el-dropdown @command="handleCommand" slot="label">
            <span class="el-dropdown-link">
              {{ dropName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="el-menu" slot="dropdown">
              <el-dropdown-item
                :key="mg.period"
                v-for="mg in manageMentHistoryList"
                :command="mg"
                >{{ mg.period_label }}</el-dropdown-item
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
          :span="8"
          v-for="item in recordList"
          :key="item.id"
          class="card-main"
        >
          <el-card @click.native="goDetalis(item)">
            <div class="card-data">
              {{ timeSplit(item.send_date) }}
            </div>
            <div class="card-content">
              <div class="content-img">
                <img :src="item.image" class="image" />
              </div>

              <div class="content-word">
                <p>课程名称：{{ item.title }}</p>
                <p>课程类型：{{ learn_type[item.lesson_type] }}</p>
                <p>
                  今日参课：{{
                    [10, 11].includes(item.lesson_type)
                      ? `${item.ad_today_join_course_count}/${item.all_send_course_count}  `
                      : `${item.today_join_course_count}/${item.all_send_course_count}  `
                  }}
                </p>
                <p>
                  昨日参课：{{
                    [10, 11].includes(item.lesson_type)
                      ? `${item.ad_yesterday_join_course_count}/${item.all_send_course_count}  `
                      : `${item.yesterday_join_course_count}/${item.all_send_course_count}  `
                  }}
                </p>
                <p>
                  今日完课：{{
                    [10, 11].includes(item.lesson_type)
                      ? `${item.ad_today_complete_course_count}/${item.all_send_course_count}  `
                      : `${item.today_complete_course_count}/${item.all_send_course_count}  `
                  }}
                </p>
                <p>
                  累计参课：{{
                    [10, 11].includes(item.lesson_type)
                      ? `${item.ad_join_course_count}/${item.all_send_course_count}  `
                      : `${item.join_course_count}/${item.all_send_course_count}  `
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
        :pageSize="12"
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
import { openBrowserTab } from '@/utils/index'
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
      lessonType: '0',
      dropName: '更多',
      manageMentList: [],
      manageMentHistoryList: [],
      mangeFirst: null,
      term: '0',
      level: '0',
      recordList: [],
      currentPage: 1,
      totalPages: null,
      totalElements: null,
      learn_type: {
        0: '小熊AI课',
        1: '小熊AI课',
        10: '家长课堂',
        11: '小熊TV课',
        12: '小熊TV课'
      }
    }
  },
  watch: {
    lessonType(val, old) {
      this.currentPage = 1
      this.$nextTick(() => {
        this.getManagement().then(() => {
          setTimeout(() => {
            this.term = this.manageMentList[0].period
            this.level = 'S1'
            console.log('期数', this.term)
            // this.getData(this.currentPage, val, this.level)
          }, 300)
        })
      })
    },
    term(val, old) {
      if (val === '999') {
        return false
      }
      this.term = val
      this.currentPage = 1
      this.getData(this.currentPage, val, this.level)
    },
    level(val, old) {
      // console.log('难度', val)
      // this.level = val
      // this.currentPage = 1
      // this.getData(this.currentPage, this.term, val)
      // if (this.dropName === '更多') {
      //   return false
      // } else {
      //   this.level = val
      //   this.currentPage = 1
      //   this.getData(this.currentPage, this.term, val)
      // }
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
    // 获取期数
    // 获取排期期数
    getManagement() {
      const params = {
        // teacher_id: this.teacherIds
        team_state: [1, 2],
        team_type: this.lessonType
      }
      return this.$http.User.ManagementForTeacherList(params).then((res) => {
        if (res && res.data && res.data.ManagementForTeacherList) {
          if (res.data.ManagementForTeacherList.length === 0) {
            this.manageMentList = []
            this.manageMentHistoryList = []
            this.mangeFirst = null
            this.term = ''
            this.recordList = []
            return
          }
          // 过滤当前科目
          const manageMentList = res.data.ManagementForTeacherList.filter(
            (item) =>
              item.management &&
              +item.management.subject ===
                this.$store.getters.subjects.subjectCode
          )

          // 只显示开课中的期数 status // 1 招生中   2待开课   3 开课中  4 已结课',
          const arr = manageMentList.filter(
            (item) => item.management && item.management.status === 3
          )
          const arrHistory = manageMentList.filter(
            (item) => item.management && item.management.status === 4
          )
          const arrSort = arr.sort((b, a) => {
            return a.management.period - b.management.period
          })
          const arrHistorySort = arrHistory.sort((b, a) => {
            return a.management.period - b.management.period
          })

          // this.manageMentHistoryList = arrHistorySort
          const list = arrSort.map((item) => {
            item.management.period_label = `${item.management.period_name}(
              开课中
            )`

            return item.management
          })

          this.manageMentList = _.orderBy(list, ['status'], ['desc'])
          const listHis = arrHistorySort.map((item) => {
            item.management.period_label = `${item.management.period_name}(
              已结课
            )`

            return item.management
          })

          const handleData = _.orderBy(listHis, ['status'], ['desc'])
          if (this.manageMentList.length <= 0 && handleData.length > 1) {
            this.mangeFirst = handleData[0]
            this.manageMentHistoryList = handleData.slice(1)
            // this.manageMentHistoryList = manageMentHistoryList
            console.log(this.manageMentHistoryList)
          } else {
            this.mangeFirst = handleData[0]
            this.manageMentHistoryList = handleData
          }
          if (this.manageMentList.length > 5) {
            this.manageMentHistoryList = [
              ...this.manageMentList.slice(6),
              ...this.manageMentHistoryList
            ]
            this.manageMentList = this.manageMentList.slice(0, 5)
          }
          console.log('处理过的数据', this.manageMentHistoryList)
        }
      })
    },
    // 查询
    getData(page = this.currentPage, term = this.term, level = this.level) {
      this.recordList = []
      // console.log(this.lessonType)
      if (+this.lessonType === 2) {
        return this.$http.LearnRecord.getStudentSystemRecordPage(
          page,
          term,
          level
        )
          .then((res) => {
            if (
              res &&
              res.data &&
              res.data.StudentSystemRecordOperatorStatisticsPage
            ) {
              const data = res.data.StudentSystemRecordOperatorStatisticsPage
              this.totalElements = Number(data.totalElements)
              this.totalPages = Number(data.totalPages)
              console.log('数据量', this.recordList)
              this.recordList = data.content
              // this.$nextTick(() => {
              //   return ()
              // })
            }
          })
          .catch(() => {})
      } else {
        return this.$http.LearnRecord.getStudentTrialRecordPage(
          page,
          term,
          level
        )
          .then((res) => {
            if (
              res &&
              res.data &&
              res.data.StudentTrialRecordOperatorStatisticsPage
            ) {
              const data = res.data.StudentTrialRecordOperatorStatisticsPage
              this.totalElements = Number(data.totalElements)
              this.totalPages = Number(data.totalPages)
              return (this.recordList = data.content)
            }
          })
          .catch(() => {})
      }
    },

    handleCommand(command) {
      console.log(command)
      this.term = command.period
      this.dropName = command.period_label
    },
    clearName() {
      console.log(this.term)
      if (this.term === '999') {
        return
      }

      this.dropName = '更多'
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
    },
    // 进入详情页
    goDetalis(item) {
      if (this.lessonType === '0') {
        openBrowserTab(
          `/statistics/#/recordTrialDetails/${item.term}/${item.course_id}/${item.sup}/${item.lesson_type}`
        )
      } else {
        openBrowserTab(
          `/statistics/#/recordSystemDetails/${item.term}/${item.course_id}/${item.sup}/${item.lesson_type}`
        )
      }
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
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .card-content {
    height: 220px;
    padding-top: 10px;
    display: flex;
    .content-word {
      padding: 10px;
      p {
        font-size: 14px;
        height: 20px;
        margin-bottom: 14px;
      }
    }
  }
}
.el-menu {
  max-height: 500px;
  overflow: scroll;
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
