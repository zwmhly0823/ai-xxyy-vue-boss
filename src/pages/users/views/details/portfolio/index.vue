<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-25 11:40:19
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-27 10:40:01
-->
<template>
  <div>
    <div class="course-sty">
      <el-tabs v-model="courseData" @tab-click="courseBtn">
        <el-tab-pane
          v-for="(item, key) of teams_lk"
          :key="key"
          :label="`${item.team_type_formatting}:${item.team_name}`"
          :name="'' + key"
        >
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
          <div class="statistical class-statistical">
            <div>
              <span>作品总数</span>:
              <span class="tatistical-span">{{ item.course_task_count }}</span>
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-table
      :data="porfolioTableData"
      style="width: 100%"
      header-row-class-name="learning-record-sty"
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
              @click="enlarge(scope.row)"
              class="work-details"
              :src="scope.row.task_image"
            />
            <!-- 如果有视频，显示播放按钮 -->
            <i
              class="el-icon-video-play"
              @click="enlarge(scope.row)"
              v-if="scope.row.task_video"
            ></i>
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
                {{ aItem && aItem.type === 0 ? '人工点评' : '智能点评'
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
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
export default {
  name: 'portfolio',
  mounted() {
    this.$root.$on('portfolio', (r) => {
      console.info('老爹给作品集的基础数据', r)
      this.teams_lk = r
    })
    // 初始化拿数据
    setTimeout(() => {
      this.lessonId = this.teams_lk[0] ? this.teams_lk[0].id : ''
      this.reqStudentCourseTaskPage()
    }, 1000)
  },
  data() {
    return {
      teams_lk: [], // tab-pane
      courseData: '0', // tab-pane v-model
      porfolioTableData: [], // table展示数据

      // 数据查询
      lessonId: '', // 课程Id
      currentPage: 1, // 页码

      // 分页组件
      allDigit: 1, // 总量

      // 播放相关
      play: -1,
      audioId: '',
      currentVideo: '',
      videoDialog: false
    }
  },
  methods: {
    // 切换课程
    courseBtn(r) {
      this.lessonId = this.teams_lk[r.name].id
      this.reqStudentCourseTaskPage()
    },
    // 翻页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.reqStudentCourseTaskPage()
    },
    // 数据接口_作品集
    reqStudentCourseTaskPage() {
      this.$http.User.getStudentCourseTaskPage(
        this.$route.params.id, // studentId
        this.lessonId, // 课程Id
        this.currentPage
      ).then((res) => {
        console.log('作品集模块接口', res.data.StudentCourseTaskPage.content)
        const _data = res.data.StudentCourseTaskPage.content
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
        this.allDigit = +res.data.StudentCourseTaskPage.totalElements
        this.porfolioTableData = _data // 赋值
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
  },
  computed: {
    hh2() {
      return 2
    }
  }
}
</script>

<style lang="scss" scoped>
.course-sty {
  background-color: #fff;
  .statistical {
    div {
      float: left;
      span {
        color: #aeaeae;
      }
    }
  }
  .class-statistical {
    margin: 0 15px 0 0;
    float: left;
    margin: 0 0 0 25px;
    .tatistical-span {
      color: #5ea0f5;
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
    margin-left: 10px;
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
</style>
