<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2021-02-04 16:39:50
-->
<template>
  <div>
    <div class="course-sty">
      <el-radio-group v-model="changeSubject" size="mini">
        <!-- <el-radio-button :label="0">美术</el-radio-button>
        <el-radio-button :label="1">写字</el-radio-button> -->
        <el-radio-button :label="3">音乐</el-radio-button>
      </el-radio-group>
      <el-tabs v-model="courseData" @tab-click="courseBtn">
        <el-tab-pane
          v-for="(item, key) of teams_lk_filter"
          :key="key"
          :label="`${item.team_type_formatting || '体验课'}:${item.team_name}`"
          :courseIds="item.course_ids"
          :teamId="item.id"
        >
          <div class="inner_lk">
            <div class="statistical">
              <div>
                <span>社群销售</span>:
                {{ item.teacher_info && item.teacher_info.realname }}
              </div>
              <div>
                <span>微信昵称</span>:
                {{ item.teacher_info && item.teacher_info.nickname }}
              </div>
              <div>
                <span>微信号</span>:
                {{
                  item.teacher_wechat_info && item.teacher_wechat_info.wechat_no
                }}
              </div>
            </div>
            <div class="statistical">
              <div>
                <span>作品总数</span>:
                <span class="tatistical-span">{{
                  item.course_task_count
                }}</span>
              </div>
              <div>
                <span>收到点评</span>:
                <span class="tatistical-span">
                  {{ item.task_comment_count }}
                </span>
              </div>
              <div>
                <span>已听点评</span>:
                <span class="tatistical-span">
                  {{ item.listen_comment_count }}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-table
      :data="porfolioTableData"
      style="width: 100%"
      header-row-class-name="learning-record-sty"
      class="portfolio-table"
    >
      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          <div>{{ scope.row.serNum }}</div>
        </template>
      </el-table-column>
      <el-table-column label="作品详情">
        <template slot-scope="scope">
          <div class="work-photo">
            <img
              class="work-details"
              :src="scope.row.task_image + '?x-oss-process=image/resize,l_100'"
              @click="lookCurImg(scope.row.task_image)"
            />
            <!-- 如果有视频，显示播放按钮 -->
            <i class="el-icon-video-play" v-if="scope.row.task_video"></i>
            <el-button
              round
              v-if="!scope.row.task_video"
              class="down-btn"
              @click="downImg(scope.row)"
              size="mini"
              type="primary"
              plain
              >下载作品</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="点评老师" width="70">
        <template slot-scope="scope">
          <!-- 美术科目老师 -->
          <section v-if="!changeSubject">
            {{
              (scope.row.taskComment[0] &&
                scope.row.taskComment[0].teacherInfo &&
                scope.row.taskComment[0].teacherInfo.realname) ||
                '--'
            }}
          </section>
          <!-- 写字科目老师 -->
          <section v-else>
            <!-- 有点评 -->
            <div v-if="scope.row.taskComment.length">
              {{
                (scope.row.taskComment[0] &&
                  scope.row.taskComment[0].teacherInfo &&
                  scope.row.taskComment[0].teacherInfo.realname) ||
                  '--'
              }}
            </div>
            <!-- 没点评a  -->
            <div v-else>
              <!-- 转给兼职 -->
              <span v-if="scope.row.taskDispatchLog">
                {{
                  (scope.row.taskDispatchLog.teacherInfo &&
                    scope.row.taskDispatchLog.teacherInfo.realname) ||
                    '--'
                }}
              </span>
              <!-- 没转给兼职 -->
              <span v-else>
                {{
                  (scope.row.teacherInfo && scope.row.teacherInfo.realname) ||
                    '--'
                }}
              </span>
            </div>
          </section>
        </template>
      </el-table-column>
      <el-table-column label="老师点评·点评时间">
        <template slot-scope="scope">
          <div
            class="comment-time"
            v-if="scope.row.taskComment && scope.row.taskComment.length"
          >
            <div v-for="(aItem, aKey) in scope.row.taskComment" :key="aKey">
              <div @click="playBtn(scope.row, aItem)" class="comment-time-item">
                <i
                  :class="
                    aItem.id === play
                      ? 'el-icon-video-pause img-play'
                      : 'el-icon-video-play img-play'
                  "
                ></i>
                <audio
                  :id="`audio${[aItem.id]}`"
                  :src="aItem.sound_comment"
                ></audio>
              </div>
              <img class="img-play" :src="scope.row.imgWorks" />
              <div>
                {{ aItem && '' + aItem.type && voiceType['' + aItem.type]
                }}<br />{{ aItem.ctime }}
              </div>
              <div class="listening-status">
                {{ aItem.hadListened ? '已收听' : '' }}
              </div>
            </div>
          </div>
          <div v-else>未点评</div>
        </template>
      </el-table-column>
      <el-table-column label="课程">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.sendCourseLog ? scope.row.sendCourseLog.wd_info : '-'
            }}·《{{
              scope.row.sendCourseLog ? scope.row.sendCourseLog.title : '-'
            }}》
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作品上传时间">
        <template slot-scope="scope">
          <div>{{ scope.row.ctime }}</div>
          <div class="course-btn">
            {{ scope.row.is_day_upload_task === 0 ? '' : '当日上传' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="!changeSubject">
        <template slot-scope="scope">
          <el-button type="text" @click="delete_task(scope.row.id)"
            >删除</el-button
          >
          <el-button
            type="text"
            :disabled="scope.row.task_report_image ? false : true"
            @click="
              studyRecordImg = true
              studyRecordImgSrc = scope.row.task_report_image
            "
            >{{
              scope.row.task_report_image ? '学习报告' : '未生成报告'
            }}</el-button
          >
          <!-- studentId，courseId，taskId -->
          <el-link
            :type="scope.row.task_report_image ? 'primary' : 'info'"
            :disabled="scope.row.task_report_image ? false : true"
            :href="
              `https://www.xiaoxiongmeishu.com/h5/report?studentId=${scope.row.student_id}&taskId=${scope.row.id}&courseId=${scope.row.sendCourseLog.course_id}&channelId=6`
            "
            target="_blank"
            >{{
              scope.row.task_report_image ? '报告链接' : '无报告链接'
            }}</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_lk">
      <el-pagination
        layout="prev,pager,next,total"
        :page-size="20"
        :total="allDigit"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 作品集视频播放 -->
    <el-dialog
      title
      :visible.sync="videoDialog"
      width="30%"
      @close="closeDialog"
    >
      <video
        :src="currentVideo"
        controls
        autoplay
        class="video"
        width="100%"
      ></video>
    </el-dialog>
    <!-- 学习报告图片 -->
    <el-dialog :visible.sync="studyRecordImg" top="1vh" width="30%">
      <el-image :src="studyRecordImgSrc" fit="contain"></el-image>
    </el-dialog>

    <!-- 查看大图弹框 -->
    <single-img-preview :url="imgPreview" :showViewer.sync="showViewer" />
  </div>
</template>

<script>
import SingleImgPreview from '@/components/SingleImgPreview/index'
import { formatData } from '@/utils/index'
export default {
  name: 'portfolio',
  components: { SingleImgPreview },
  mounted() {
    this.$root.$on('portfolio', (...argus) => {
      console.info('老爹给作品集的基础数据和写字0元体验', argus[0], argus[1])
      this.teams_lk = argus[0] || []
      this.teams_lk_free_write = argus[1] || []
    })
    // 初始化-拿数组第1条数据
    setTimeout(() => {
      if (this.teams_lk_filter[0]) {
        this.teamId = this.teams_lk_filter[0].id
        this.courseId =
          this.teams_lk_filter[0] &&
          this.teams_lk_filter[0].course_ids &&
          this.teams_lk_filter[0].course_ids.length
            ? this.teams_lk_filter[0].course_ids
            : []
        this.reqStudentCourseTaskPage()
      }
    }, 1000)
  },
  data() {
    return {
      voiceType: {
        0: '人工点评',
        1: '智能点评',
        2: '真人点评',
        3: '语音库点评'
      },
      imgPreview: '',
      showViewer: false,
      teams_lk_free_write: [], // tab-pane(写字0元体验)
      teams_lk: [], // tab-pane
      courseData: '0', // tab-pane v-model
      porfolioTableData: [], // table展示数据

      // 数据查询
      teamId: '', // 班级Id
      courseId: [], // 写字0元体验课
      currentPage: 1, // 页码

      // 分页组件
      allDigit: 1, // 总量
      changeSubject: this.$store.state.subjects.subjectCode,

      // 播放相关
      play: -1,
      audioId: '',
      currentVideo: '',
      videoDialog: false,

      // 学习报告分享图片
      studyRecordImg: false,
      studyRecordImgSrc: ''
    }
  },
  computed: {
    teams_lk_filter() {
      const arrNew = this.teams_lk
        .filter((item) => item.subject === '' + this.changeSubject)
        .concat(this.changeSubject ? this.teams_lk_free_write : [])
      console.info(
        '作品集:o元,科目,最终',
        this.teams_lk_free_write,
        this.changeSubject,
        arrNew
      )
      return arrNew
    }
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.info('作品集-手动切换科目')
        this.reqStudentCourseTaskPage()
      }
    }
  },
  methods: {
    lookCurImg(src) {
      this.imgPreview = src
      this.showViewer = true
    },
    // 删除作品
    delete_task(...args) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$http.User.taskDelete(args[0]).then(
          (r) => {
            if (!r.code) {
              this.$message.success('删除成功!')
              setTimeout(() => {
                // 刷新数据
                this.reqStudentCourseTaskPage()
              }, 1000)
            } else {
              this.$message.error('删除失败,稍后重试!')
            }
          },
          (err) => {
            console.warn(err)
          }
        )
      })
    },
    // 切换课程
    courseBtn(r) {
      console.info(r)
      if (r.$attrs.courseIds && r.$attrs.courseIds.length) {
        // 写字0元体验课
        this.courseId = r.$attrs.courseIds
        this.reqStudentCourseTaskPage()
      } else {
        // 普通系统体验课
        this.teamId = r.$attrs.teamId
        this.courseId = []
        this.reqStudentCourseTaskPage()
      }
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqStudentCourseTaskPage()
    },
    // 数据接口_作品集
    reqStudentCourseTaskPage() {
      this.$http.User.getStudentCourseTaskPage({
        page: this.currentPage,
        subject: this.changeSubject,
        studentId: this.$route.params.id,

        teamId: this.teamId, // 班级Id
        courseId: this.courseId // 写字0元体验课
      }).then((res) => {
        console.log('作品集模块接口', res.data.StudentCourseTaskPage.content)
        const _data =
          res.data.StudentCourseTaskPage &&
          res.data.StudentCourseTaskPage.content
            ? res.data.StudentCourseTaskPage.content
            : []
        _data.forEach((item, index) => {
          item.serNum = ++index
          if (item.taskComment && item.taskComment.length) {
            item.taskComment.forEach((tItem) => {
              tItem.ctime = formatData(tItem.ctime, 's')
              for (let i = 0, len = item.listenComment.length; i < len; i++) {
                if (item.listenComment[i].flag_id === tItem.id) {
                  tItem.hadListened = true
                  break
                }
              }
            })
          }
          item.ctime = item.ctime ? formatData(item.ctime, 's') : ''
        })
        this.porfolioTableData = _data // 赋值
        this.allDigit =
          res.data.StudentCourseTaskPage &&
          +res.data.StudentCourseTaskPage.totalElements
            ? +res.data.StudentCourseTaskPage.totalElements
            : 0
      })
    },
    // 下载图片
    downImg(val) {
      const that = this
      console.log('下载', val)
      const canvas = document.createElement('canvas')
      const typeName = val.task_image.lastIndexOf('.')
      const type = val.task_image.substr(typeName + 1)
      const image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')

      image.src = val.task_image
      image.onload = function() {
        const link = document.createElement('a')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        const url = canvas.toDataURL('image/' + type)
        const blob = that.dataUrlToBold(url)
        const objUrl = URL.createObjectURL(blob)
        link.style.display = 'none'
        link.href = objUrl
        link.download = `${val.sendCourseLog.wd_info}${val.sendCourseLog.title}.jpg`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
      }
    },
    // 图片下载bold
    dataUrlToBold(url) {
      const arr = url.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bStr = atob(arr[1])
      let n = bStr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bStr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    // 关闭视频播放 清空数据
    closeDialog() {
      this.currentVideo = ''
      this.videoDialog = false
    },
    playBtn(val, aItem) {
      const audio = document.getElementById(`audio${aItem.id}`)
      const audioLast = document.getElementById(this.audioId)
      this.play = this.play === aItem.id ? -1 : aItem.id
      if (this.play !== -1) {
        audioLast && audioLast.load()
        audio.play()
        let time = 0

        time = aItem.sound_comment_second
        setTimeout(() => {
          this.play = -1
        }, time * 1000)
      } else {
        audio.load()
      }
      this.audioId = audio.id
    }
  }
}
</script>

<style lang="scss" scoped>
.course-sty {
  padding: 10px;
  .portfolio-table {
    padding: 0 10px;
  }
}
.inner_lk {
  display: flex;
  align-items: center;
}
.statistical {
  background-color: #fff;
  min-width: 200px;
  display: flex;
  margin-right: 30px;
}

.statistical .tatistical-span {
  color: #5ea0f5;
}

.statistical {
  div {
    margin-right: 10px;
    span {
      color: #aeaeae;
    }
  }
}
.learning-record-sty {
  th {
    background-color: #f5f7fa;
    padding: 5px 0;
  }
}
.course-btn {
  color: #67c23a;
  // cursor: pointer;
}
.pagination_lk {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  right: 0px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.work-photo {
  position: relative;
  width: 100px;
  // 作品详情img
  .work-details {
    width: 100px;
    cursor: pointer;
  }
  ::v-deep .el-icon-video-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    color: #f5f7fa;
  }
  .down-btn {
    text-align: center;
    padding: 4px 15px;
  }
}

// 老师点评播放img
.comment-time {
  // display: flex;
  // align-items: center;

  .img-play {
    font-size: 24px;
    float: left;
    height: 100%;
    cursor: pointer;
  }
  &-item {
    margin-bottom: 10px;
    > * {
      height: 100%;
      float: left;
      margin: 7px 7px 0 5px;
    }
  }
  .listening-status {
    padding: 0 0 0 20px;
  }
}
// 报告链接
/deep/ .el-link--inner {
  font-size: 12px;
}
/deep/ .el-link.is-underline:hover:after {
  width: 0px;
}
.el-link {
  position: relative;
  top: -1px;
  left: 11px;
}
</style>
