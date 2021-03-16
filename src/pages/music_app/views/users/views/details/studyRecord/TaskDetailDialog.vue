<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: Shentong
 * @LastEditTime: 2021-02-03 16:53:31
-->
<template>
  <div class="task-detail">
    <el-dialog
      :visible.sync="showDialog"
      :before-close="dialogClose"
      :close-on-click-modal="false"
      :show-close="false"
      width="75%"
      top="10vh"
      class="taskd-dialog"
    >
      <section
        v-loading="loadingList"
        element-loading-spinner="el-icon-loading"
        element-loading-text="玩命加载中"
      >
        <header class="header" slot="title">
          <div class="btns" v-if="Object.keys(currentTask).length">
            <el-button size="mini" type="primary" @click="downLoad"
              >下载</el-button
            >
            <el-button size="mini" type="primary" @click="deleteTask"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="notice"
              :disabled="currentTask.task_report_image ? false : true"
              >{{
                currentTask.task_report_image ? '学习报告' : '未生成报告'
              }}</el-button
            >
            <el-button size="mini" type="primary" @click="noticeUrl"
              >报告链接</el-button
            >
          </div>
          <span class="colse-btn" @click="dialogClose">×</span>
        </header>
        <div class="content">
          <aside class="task-list">
            <div
              class="item"
              :class="{ active: task.id == currentTask.id }"
              v-for="task in courseList"
              :key="task.id"
            >
              <el-image
                style="width: 80px; height: 100px"
                :src="task.task_image"
                fit="fit"
                @click="taskClickHandle(task)"
              ></el-image>
            </div>
          </aside>
          <section class="task-info" v-if="Object.keys(currentTask).length">
            <div class="big-img">
              <el-image :src="currentTask.task_image" fit="contain">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image>
            </div>
            <div class="discription">
              <div class="row-desc">
                <div class="label">上传时间：</div>
                <div class="info">{{ currentTask.ctime || '--' }}</div>
              </div>
              <div class="row-desc">
                <div class="label">点评老师：</div>
                <div class="info">
                  <span>{{ currentTask.commentTeacher || '--' }}</span>
                  <span
                    class="jz"
                    v-if="
                      currentTask.dutyName &&
                        currentTask.dutyName.includes('兼职')
                    "
                    >兼职</span
                  >
                </div>
              </div>
              <div class="row-desc">
                <div class="label">点评类型：</div>
                <div class="info">
                  {{ currentTask.commentType || '--' }}
                  <span v-if="currentTask.commentType">点评</span>
                </div>
              </div>
              <div class="row-desc">
                <div class="label">点评时间：</div>
                <div class="info">
                  <span>{{ currentTask.commentTime || '--' }}</span>
                  <span class="over-time" v-if="currentTask.is_overtime == 1"
                    >超时</span
                  >
                </div>
              </div>
              <div class="row-desc">
                <div class="label">点评内容：</div>
                <div
                  class="info "
                  v-if="currentTask.commentSound || currentTask.videoUrl"
                >
                  <div
                    class="video-container"
                    v-if="currentTask.commentType == '真人'"
                  >
                    <video
                      controls
                      :src="currentTask.videoUrl"
                      class="video-comps"
                    ></video>
                  </div>
                  <div class="audio-container" v-else>
                    <audio :src="currentTask.commentSound" controls></audio>
                  </div>
                </div>
                <div v-else>--</div>
              </div>
              <div class="row-desc">
                <div class="label">点评反馈：</div>
                <div class="info">
                  <div>{{ currentTask.commentCH || '--' }}</div>
                  <div style="line-height: 30px;">
                    {{ currentTask.tag }}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </el-dialog>
    <!-- 学习报告图片 -->
    <el-dialog :visible.sync="studyRecordImg" top="2vh" width="30%">
      <el-image :src="studyRecordImgSrc" fit="contain"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { formatDateByType } from '@/utils/mini_tool_lk'

export default {
  name: 'taskDetail',

  props: {
    showTaskDetail: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  computed: {
    showDialog() {
      return this.showTaskDetail
    }
  },
  created() {
    console.log('showTaskDetail-created')
    this.studentId = this.$route.params.id
    this.getStudentCourseTaskList()
  },
  data() {
    return {
      studyRecordImgSrc: '',
      studyRecordImg: false,
      loadingList: false,
      studentId: '',
      courseList: [],
      currentTask: {}
    }
  },
  methods: {
    // 上课记录 系统课报名期数
    async getStudentCourseTaskList() {
      this.loadingList = true
      const params = {
        student_id: this.studentId,
        course_id: this.rowData.course_id,
        subject: this.rowData.subjectCode,
        del: 0
      }
      try {
        const { StudentCourseTaskList } = this.$http.User

        const { data = {} } = await StudentCourseTaskList(params)
        const { StudentCourseTaskPage = {} } = data
        const { content = [] } = StudentCourseTaskPage

        this.courseList = content

        if (content.length) {
          this.taskClickHandle(content[0])
        } else {
          this.currentTask = {}
        }
      } catch (err) {
        console.info(err)
      } finally {
        this.loadingList = false
      }
    },
    taskClickHandle(task = {}) {
      const COMMENT = {
        0: '不满意',
        1: '一般',
        2: '满意'
      }
      const COMMENTTYPE = {
        0: '人工',
        1: '智能',
        2: '真人',
        3: '语音库'
      }
      const { ctime, taskComment, commentFeedback } = task

      const { content, feedback_type: feedbackType, tag } =
        commentFeedback || {}

      const [firstComment = {}] = taskComment || []

      this.currentTask = Object.assign({}, task, {
        ctime: formatDateByType(ctime, '-', 'M'),
        commentTeacher: firstComment?.teacherInfo?.realname,
        commentType: firstComment ? COMMENTTYPE[firstComment.type] : '',
        dutyName:
          firstComment.teacherInfo && firstComment.teacherInfo.duty_name,
        commentTime: formatDateByType(firstComment?.ctime, '-', 'YS'),
        commentSound: firstComment.sound_comment,
        videoUrl: firstComment.video_url,
        commentFeedback: content,
        commentCH: feedbackType !== undefined ? COMMENT[feedbackType] : '',
        tag
      })
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
    downLoad() {
      const that = this
      const {
        task_image: taskImage,
        course_name: courseName
      } = this.currentTask
      const canvas = document.createElement('canvas')
      const typeName = taskImage.lastIndexOf('.')
      const type = taskImage.substr(typeName + 1)
      const image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')

      image.src = taskImage
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
        link.download = `${courseName}.jpg` // TODO:
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
      }
    },
    // 学习报告
    notice() {
      this.studyRecordImg = true
      this.studyRecordImgSrc = this.currentTask.task_report_image
    },
    // 报告链接
    noticeUrl() {
      const {
        course_id: courseId,
        student_id: studentId,
        id: taskId
      } = this.currentTask
      const url = `https://www.xiaoxiongmeishu.com/h5/report?studentId=${studentId}&taskId=${taskId}&courseId=${courseId}&channelId=6`
      window.open(url, '_blank')
    },
    deleteTask() {
      const { id } = this.currentTask
      this.$confirm('此操作将永久删除该文件, 是否继续?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$http.User.taskDelete(id).then(
          (r) => {
            if (!r.code) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                onClose: () => {
                  setTimeout(this.getStudentCourseTaskList(), 1000)
                }
              })
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
    dialogClose() {
      // this.$emit('update:showTaskDetail', false)
      this.$emit('taskDetailClose', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.task-detail {
  /deep/ .taskd-dialog .el-dialog__body {
    padding: 0;
  }
  .header {
    display: flex;
    height: 40px;
    align-items: flex-start;
    border-bottom: 1px solid #eee;
    .btns {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
    .colse-btn {
      width: 50px;
      font-size: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: monospace;
      cursor: pointer;
    }
  }
  .content {
    display: flex;
    .task-list {
      width: 150px;
      border-right: 1px solid #eee;
      padding: 10px 10px 30px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      .item {
        border: 1px solid #ccc;
        cursor: pointer;
        &.active {
          border-color: #2a75ed;
        }
        margin-bottom: 50px;
        /deep/ img {
          padding: 5px;
        }
      }
    }
    .task-info {
      display: flex;
      flex: 1;
      padding-top: 10px;
      .big-img {
        flex: 3;
        padding: 0 30px;
        /deep/ img {
          max-height: 600px;
        }
      }
      .discription {
        flex: 2;
        .row-desc {
          display: flex;
          font-size: 15px;
          min-height: 45px;
          .label {
            min-width: 76px;
          }
          .info {
            .jz {
              position: relative;
              background: limegreen;
              color: #fff;
              padding: 1px 6px;
              border-radius: 3px;
              left: 10px;
              top: 5px;
            }
            .over-time {
              color: #e4393c;
              margin-left: 10px;
            }
          }
          .audio-container {
            overflow: hidden;
            width: 45px;
            border-radius: 100%;
            height: 45px;
            transform: translate(10px, -10px);
            audio {
              height: 100%;
            }
          }
          .video-container {
            .video-comps {
              width: 90%;
              object-fit: contain;
              border: 1px solid;
            }
          }
        }
      }
    }
  }
}
</style>
