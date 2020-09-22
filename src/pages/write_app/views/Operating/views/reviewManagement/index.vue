<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-09-03 15:14:25
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-22 16:40:36
-->
<template>
  <el-row type="flex" class="app-main reviewManagement">
    <el-col class="reviewManagement-content">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="header-search-container" border>
            <table-search @change="searchChange"></table-search>
          </div>
          <div ref="tableContainer">
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'small'"
              :dataList="tableData"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :showAllTotalNum="true"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                label="点评ID"
                min-width="80"
                prop="task_comment_id"
                align="center"
              ></el-table-column>
              <el-table-column label="用户信息" min-width="180">
                <template slot-scope="scope">
                  <p v-if="scope.row.userInfo">
                    {{ scope.row.userInfo.mobile || '-' }}-{{
                      scope.row.userInfo.username
                    }}
                  </p>
                  <p>{{ scope.row.period_name || '-' }}</p>
                </template>
              </el-table-column>
              <el-table-column label="作品" min-width="80">
                <template slot-scope="scope">
                  <div
                    class="img-box"
                    v-for="(img, index) in scope.row.taskImageList"
                    :key="index"
                  >
                    <el-image
                      style="height: 50px;"
                      :src="img"
                      fit="contain"
                      :preview-src-list="scope.row.taskImageList"
                    >
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="课程名称·上传时间"
                min-width="140"
                prop="teacher_wechat_no"
              >
                <template slot-scope="scope">
                  <div
                    class="img-box"
                    v-for="course in scope.row.courseTaskList"
                    :key="course.id"
                  >
                    <p>{{ course.course_name }}</p>
                    <p>{{ course.ctime }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="课程类型"
                min-width="110"
                prop="course_type"
              ></el-table-column>
              <el-table-column
                label="课程难度"
                min-width="100"
                prop="sup"
              ></el-table-column>
              <el-table-column label="点评老师" min-width="120">
                <template slot-scope="scope">
                  <div v-if="scope.row.teacherInfo">
                    <p>{{ scope.row.teacherInfo.realname }}</p>
                    <p>
                      {{
                        (scope.row.teacherInfo.departmentInfo &&
                          scope.row.teacherInfo.departmentInfo.name) ||
                          '-'
                      }}
                    </p>
                  </div>
                  <p v-else>-</p>
                </template>
              </el-table-column>
              <el-table-column label="点评内容" min-width="120">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.commentInfo"
                    class="audio-box"
                    @click="
                      audioClickHandle(scope.$index, scope.row.commentInfo)
                    "
                  >
                    <i
                      v-if="
                        currentAudioIndex ==
                          `${scope.$index}${scope.row.commentInfo.id}`
                      "
                      class="el-icon-video-pause"
                    ></i>
                    <i v-else class="el-icon-video-play"></i>
                    <audio
                      :src="scope.row.commentInfo.sound_comment"
                      :ref="
                        `audioRef_${scope.$index}_${scope.row.commentInfo.id}`
                      "
                    ></audio>
                  </div>
                  <p v-else>-</p>
                </template>
              </el-table-column>
              <el-table-column
                label="老师接收时间"
                min-width="120"
                prop="ctime"
              ></el-table-column>
              <el-table-column label="点评状态" min-width="120" prop="status">
                <template slot-scope="scope">
                  <p class="comment-status">
                    {{ scope.row.is_comment === '1' ? '已点评' : '待点评' }}
                  </p>
                  <p>{{ scope.row.task_comment_time_text }}</p>
                </template>
              </el-table-column>
              <el-table-column label="听点评状态" min-width="120" prop="status">
                <template slot-scope="scope">
                  <!-- 已点评 -->
                  <div v-if="scope.row.is_comment === '1'">
                    <div
                      v-if="scope.row.flagRecord && scope.row.flagRecord.ctime"
                    >
                      <p>已听点评</p>
                      <p>{{ scope.row.flagRecord.ctime || '-' }}</p>
                    </div>
                    <p v-else>未听点评</p>
                  </div>
                  <!-- 待点评 -->
                  <p v-else>-</p>
                </template>
              </el-table-column>
            </ele-table>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'lodash'
import { formatData } from '@/utils/index'
import TableSearch from './components/tableSearch/index'
import EleTable from '@/components/Table/EleTable'

export default {
  props: [],
  components: {
    TableSearch,
    EleTable
  },
  data() {
    return {
      currentAudioIndex: null,
      tableHeight: 'auto',
      flags: {
        loading: false
      },
      // 总页数
      totalElements: 0,
      tableData: [],
      tabQuery: {
        size: 10,
        page: 1
      },
      searchEmit: {},
      showSearch: true
    }
  },
  async created() {
    this.getStudentTaskDispatchLogPage(this.tabQuery)
  },
  computed: {},
  mounted() {
    this.calcTableHeight()
  },
  watch: {},
  methods: {
    // 组件emit
    searchChange(res) {
      console.log('emit-res', res)
      // this.initSearchData(res, true)
      // this.getStudentTaskDispatchLogPage(this.tabQuery)
    },
    initSearchData(res, isFromEmit = false) {
      // 如果是子组件emit而来的数据，则不需要清空
      if (!isFromEmit) {
        this.showSearch = false
        this.$nextTick(() => {
          this.showSearch = true
        })
      }

      this.searchEmit = _.cloneDeep(res)

      const {
        term = [],
        department = [],
        teacherId = '',
        sup = [],
        teamName = ''
      } = this.searchEmit

      Object.assign(this.tabQuery, {
        term,
        teamName,
        sup,
        department,
        teacherId,
        page: 1
      })
    },
    audioClickHandle($index, item) {
      // 当前音频ref
      const currentRef = `audioRef_${$index}_${item.id}`
      const currentAudio = this.$refs[currentRef]

      /** 顾虑掉其他ref，只包含音频 audio 组件 */
      const keys = Object.keys(this.$refs).filter(
        (item) => item.indexOf('audioRef') !== -1
      )
      keys.forEach((key) => {
        if (key !== currentRef) {
          const otherAudio = this.$refs[key]
          if (otherAudio && otherAudio.load) otherAudio.load()
        }
      })

      if (currentAudio.paused) {
        this.currentAudioIndex = `${$index}${item.id}`
        currentAudio.play() // audio.play();// 播放
      } else {
        // audio.pause() // 暂停
        currentAudio.load() // 取消播放并回到0秒
        this.currentAudioIndex = null
      }
      // 播放结束后，监听事件，改变按钮状态
      currentAudio.addEventListener('ended', () => {
        this.currentAudioIndex = null
      })
    },
    /**
     * 获取点评列表
     */
    async getStudentTaskDispatchLogPage(params) {
      this.flags.loading = true
      try {
        const {
          data: {
            StudentTaskDispatchLogPage: { content = [], totalElements }
          }
        } = await this.$http.writeApp.ReviewManage.getStudentTaskDispatchLogPage(
          params
        )
        // 总数、分页用
        this.totalElements = +totalElements || 0
        this.pakageListData(content)
        // this.tableData = content
      } catch (err) {
        console.log('err', err)
      } finally {
        this.flags.loading = false
      }
    },
    // 组装table接口返回数据
    pakageListData(list) {
      const data = list || []
      data.forEach((item) => {
        const taskImageList = [] // 作品列表
        const { courseTaskList = [] } = item
        const cousreList = courseTaskList.map((course) => {
          course.ctime = course.ctime ? formatData(course.ctime, 'm') : '-'
          course.course_name = course.course_name || '-'
          taskImageList.push(course.task_image)
          return course
        })
        item.courseTaskList = cousreList
        item.taskImageList = taskImageList
        item.ctime = item.ctime ? formatData(item.ctime, 'm') : '-'
        item.task_comment_time_text = item.task_comment_time
          ? formatData(item.task_comment_time, 'm')
          : ''
        // 听点评
        if (item?.flagRecord?.ctime) {
          item.flagRecord.ctime = formatData(item.flagRecord.ctime, 'm')
        }
        // 课程类型 1-体验课，2-系统课
      })
      this.tableData = list || []
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getStudentTaskDispatchLogPage(this.tabQuery)
    },
    getElementToPageTop(el) {
      if (el.parentElement) {
        return this.getElementToPageTop(el.parentElement) + el.offsetTop
      }
      return el.offsetTop
    },
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-image-viewer__canvas > img {
  max-height: 80% !important;
}
/deep/ .el-image {
  .el-icon-circle-close {
    color: #fff;
  }
}
.reviewManagement {
  &-content {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .team-name-pointer {
    cursor: pointer;
    color: #2a75ed;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-search-container {
      // height: 50px;
      display: flex;
      padding-left: 15px;
      border-bottom: 1px solid #eee;
    }
    .tabs-operate {
      height: 40px;
      background: #f5f7fa;
      display: flex;
      > div {
        height: 100%;
        padding: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &.active {
          background: #fff;
          span {
            color: #2a75ed;
          }
        }
      }
    }
  }
  .img-box {
    > img {
      width: 50px;
      height: 50px;
      cursor: pointer;
    }
  }
  .audio-box {
    > i {
      font-size: 25px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
