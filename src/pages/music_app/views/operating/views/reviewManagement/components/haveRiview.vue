<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 14:30:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-06 20:07:13
 */
 -->
<template>
  <div class="container">
    <phone-search v-if="tabIndex != 2" @result="getSearch" />
    <have-riview-search
      v-if="tabIndex == 2"
      @result="getSearch"
    ></have-riview-search>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="list"
    >
      <el-table-column label="作品" width="100" align="center">
        <template slot-scope="scope">
          <div class="task-image-container" v-if="scope.row.task_image">
            <div
              class="task-image"
              @click="handleViewLarge(imgUrl + scope.row.task_video)"
            >
              <img
                :src="`${imgUrl}${scope.row.task_image}?x-oss-process=image/resize,l_100`"
              />
              <!-- 视频-播放按钮 -->
              <i class="el-icon-video-play" v-if="scope.row.task_video"></i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" width="180" align="center">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.status == 1
                ? '审核中'
                : scope.row.status == 2
                ? '发布成功'
                : scope.row.status == 3
                ? '已被禁'
                : '审核未通过'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="审核未通过原因" align="center" width="180">
        <template slot-scope="scope">
          <p>
            {{
              scope.row.status == 1
                ? '-'
                : scope.row.status == 2
                ? '-'
                : scope.row.status == 3
                ? '内容违规'
                : '内容违规'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="点评状态" align="center" width="180">
        <template slot-scope="scope">
          <p>
            {{ scope.row.comment_status == 0 ? '未点评' : '点评' }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="点评内容" align="center" width="180">
        <template slot-scope="scope">
          <p v-if="!scope.row.sound_comment">-</p>

          <div v-else class="audio-container">
            <audio
              :src="imgUrl + scope.row.sound_comment"
              style="height: 47px"
              controls
            ></audio>
          </div>
          <p>
            {{
              scope.row.rank_status == 0
                ? '未上榜'
                : scope.row.rank_status > 0
                ? '已上榜'
                : '-'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.userExtends.mobile }}</div>
          <div>{{ scope.row.userExtends.wechat_nikename }}</div>
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">
            {{ (scope.row.teamInfo && scope.row.teamInfo.team_name) || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="课程" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type" v-if="scope.row.courseware">
            {{ scope.row.courseware.no }} - {{ scope.row.courseware.title }}
          </div>
          <div class="review-type" v-else></div>
        </template>
      </el-table-column>
      <el-table-column label="辅导老师" align="center" width="100">
        <template slot-scope="scope">
          <div class="review-type">
            {{
              (scope.row.assistantTeacherInfo &&
                scope.row.assistantTeacherInfo.realname) ||
              '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="兼职老师" align="center" width="100">
        <template slot-scope="scope">
          <div class="review-type">
            {{
              (scope.row.parttimeTeacherInfo &&
                scope.row.parttimeTeacherInfo.realname) ||
              '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="点评老师" align="center" width="80">
        <template slot-scope="scope">
          <div class="review-type">
            {{
              (scope.row.commentTeacherInfo &&
                scope.row.commentTeacherInfo.realname) ||
              '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上传日期" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">
            {{ timestamp(scope.row.ctime, 's') || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="点评日期" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">
            {{ timestamp(scope.row.comment_time, 's') || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="听点评" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">
            {{
              (scope.row.flagRecord &&
                scope.row.flagRecord.ctime &&
                timestamp(scope.row.flagRecord.ctime, 's')) ||
              '未听点评'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="
              scope.row.status != 1 && tabIndex != 0
                ? handleUpdate(scope.row)
                : ''
            "
            >{{
              scope.row.status == 2 && tabIndex != 0
                ? '置为审核不通过'
                : scope.row.status >= 3 && tabIndex != 0
                ? '置为审核通过'
                : '-'
            }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="30%"
      title="提示:"
      :visible.sync="visible1"
      :close-on-click-modal="false"
    >
      <div>
        {{
          checkStatus == 2
            ? '确认将该作品状态更改为审核不通过吗？'
            : checkStatus >= 3
            ? '确认将该作品状态更改为审核通过吗？'
            : ''
        }}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible1 = false" size="mini">取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="handleSaveDelete"
          size="mini"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <m-pagination
      :current-page="query.pageNum"
      :page-size="query.size"
      :total="totalElements"
      :showPager="true"
      @current-change="pageChange_handler"
      open="calc(100vw - 95px - 100px)"
      close="calc(100vw - 23px - 50px)"
    />
    <!-- 查看作品 -->
    <el-dialog
      :visible.sync="taskDialogVisible"
      width="450px"
      center
      custom-class="enlarge-box"
      @close="closeTaskDialog"
    >
      <!-- 作品-视频播放 -->
      <video
        v-if="currentVideo"
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
import { courseLevelReplace } from '@/utils/supList'
import contants from '@/utils/contants'
const { OSS_IMG_BASE_URL } = contants
export default {
  props: {
    tabIndex: {
      type: String,
      default: '0',
    },
  },
  components: {
    MPagination: () => import('@/components/MPagination/index.vue'),
    HaveRiviewSearch: () =>
      import('../../../components/search/haveRiviewSearch.vue'),
    phoneSearch: () => import('../../../components/search/phoneSearch.vue'),
  },
  data() {
    return {
      number: 1,
      imgUrl: OSS_IMG_BASE_URL,
      list: [],
      visible1: false,
      checkStatus: null,
      course_id: null,
      taskDialogVisible: false,
      query: {
        size: 10,
        pageNum: 1,
      },
      totalElements: 0,
      radio: '',
      timestamp: formatData,
      loading: true,
      searchParams: {},
      currentVideo: '',
    }
  },
  mounted() {
    this.initList()
  },
  methods: {
    async initList(params = this.searchParams, number = this.query.pageNum) {
      // 增加 已点评 状态

      let query
      if (this.tabIndex == 0) {
        query = Object.assign({}, params)
      } else if (this.tabIndex == 1) {
        query = Object.assign({}, params, { comment_time: 0 }, { status: '2' })
      } else if (this.tabIndex == 2) {
        query = Object.assign(
          {},
          params,
          { comment_time: { gt: 0 } },
          { status: '2' }
        )
      } else {
        query = Object.assign({}, params, { status: '4' })
      }
      try {
        const res = await this.$http.RiviewCourse.getHaveRiviewV2(query, number)
        if (res?.data?.StudentTaskRelationCommentDetailPage) {
          this.list =
            res.data.StudentTaskRelationCommentDetailPage?.content || []
          this.totalElements =
            +res.data.StudentTaskRelationCommentDetailPage?.totalElements || 0
          this.list = this.list.map((item) => {
            if (item?.courseware?.no) {
              const coursewareNo = this.formatCourse(item.courseware.no)
              item.courseware.no = courseLevelReplace(coursewareNo)
            }
            return item
          })
        }
        this.loading = false

        // if (res.code === 0) {
        //   this.list = res.payload.content
        //   this.totalElements = Number.parseInt(res.payload.totalElements)
        //   this.loading = false
        // }
      } catch (error) {
        this.loading = false
      }
    },
    soundArr(soundComments) {
      if (soundComments.lenght === 0) return
      const arr = []
      for (let i = 0; i < soundComments.length; i++) {
        if (i < 5) {
          arr.push(soundComments[i].soundComment)
        }
      }
      return arr
    },
    // 通过和不通过按钮
    handleUpdate(row) {
      this.visible1 = true
      this.checkStatus = row.status
      this.course_id = row.id
    },
    async handleSaveDelete() {
      let obj = {
        status: this.checkStatus == 2 ? 4 : this.checkStatus >= 3 ? 1 : '',
        workIds: [this.course_id],
      }
      const res = await this.$http.RiviewCourse.getWorksAuditWorks(obj)
      if (res.status == 'OK') {
        this.visible1 = false
        this.initList()
      }
    },
    /**
     * 搜索
     */
    getSearch(res) {
      this.searchParams = res || {}
      if (res.rank_status == 1) {
        Object.assign(this.searchParams, { rank_status: { gt: 0 } })
      }
      this.query.pageNum = 1
      this.initList()
    },
    // 查看大图
    handleViewLarge(task) {
      this.currentVideo = task
      this.taskDialogVisible = true
    },
    // 关闭查看作品dialog
    closeTaskDialog() {
      this.taskDialogVisible = false
      this.currentVideo = ''
    },
    // T2S3L1U2Lesson1 -> S3L1U2
    formatCourse(course) {
      if (!course) return
      const end = course.indexOf('Lesson')
      return course.substring(2, end)
    },

    async pageChange_handler(page) {
      this.query.pageNum = page
      await this.initList(page)
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 0 30px 0;
  .audio-container {
    overflow: hidden;
    width: 47px;
    border-radius: 100%;
    height: 47px;
    margin: 0 auto 20px;
  }
  .task-image-container {
    width: 60px;
    text-align: center;
  }
  .task-image {
    position: relative;
    height: 40px;
    img {
      width: 100%;
      height: 100%;
    }
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      color: white;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: bold;
    }
  }
  .review-type {
    margin: 0 0 20px 0;
  }
  .works-img {
    width: 100px;
    height: 150px;
    display: block;
    margin: 0 auto;
  }
  /deep/ .m-pagination {
    bottom: 0;
  }
  /deep/ .el-icon-circle-close {
    color: rgb(255, 255, 255);
  }
}
</style>
