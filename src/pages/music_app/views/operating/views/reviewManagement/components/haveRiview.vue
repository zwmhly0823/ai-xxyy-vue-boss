<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 14:30:00
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-21 23:04:10
 */
 -->
<template>
  <div class="container">
    <have-riview-search @result="getSearch"></have-riview-search>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="list"
    >
      <el-table-column label="作品" width="100" align="center">
        <template slot-scope="scope">
          <el-image
            class="works-img"
            :src="`${scope.row.task_image}?x-oss-process=image/resize,l_100`"
            :lazy="true"
            :preview-src-list="[scope.row.task_image]"
            :z-index="1001"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="点评" width="180" align="center">
        <template slot-scope="scope">
          <p
            v-if="
              !scope.row.soundCommentlist ||
                scope.row.soundCommentlist.length === 0
            "
          >
            -
          </p>
          <div
            class="audio-container"
            v-for="(audio, idx) in scope.row.soundCommentlist"
            :key="idx"
            v-else
          >
            <audio
              :src="audio.sound_comment"
              style="height: 47px"
              controls
            ></audio>
          </div>
          <!-- <div class="audio-container">
            <audio
              :src="scope.row.sound_comment"
              style="height: 47px"
              controls
            ></audio>
          </div> -->
        </template>
      </el-table-column>
      <el-table-column label="点评分类" align="center" width="180">
        <template slot-scope="scope">
          <p
            v-if="
              !scope.row.soundCommentlist ||
                scope.row.soundCommentlist.length === 0
            "
          >
            -
          </p>
          <div
            v-else
            v-for="(item, index) in scope.row.soundCommentlist"
            :key="index"
            class="review-type"
          >
            {{ item.type === 0 ? '手动点评' : '智能点评' }}
          </div>
          <!-- <div class="review-type">
            {{ scope.row.type === 0 ? '手动点评' : '智能点评' }}
          </div> -->
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="center" width="180">
        <template slot-scope="scope">
          <p>
            {{ (scope.row.userExtends && scope.row.userExtends.mobile) || '-' }}
          </p>
          <p>
            {{
              (scope.row.userExtends &&
                scope.row.userExtends.wechat_nikename) ||
                '-'
            }}
          </p>
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
          <!-- <div
            v-for="(item, index) in scope.row.taskComments"
            :key="index"
            class="review-type"
          >
            {{ timestamp(item.ctime. 's') || '-' }}
          </div> -->
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
    </el-table>
    <m-pagination
      :current-page="query.pageNum"
      :page-size="query.size"
      :total="totalElements"
      :showPager="true"
      @current-change="pageChange_handler"
      open="calc(100vw - 95px - 100px)"
      close="calc(100vw - 23px - 50px)"
    />
  </div>
</template>

<script>
import { formatData } from '@/utils/index'
import { courseLevelReplace } from '@/utils/supList'
export default {
  components: {
    MPagination: () => import('@/components/MPagination/index.vue'),
    HaveRiviewSearch: () =>
      import('../../../components/search/haveRiviewSearch.vue')
  },
  data() {
    return {
      number: 1,
      list: [],
      query: {
        size: 10,
        pageNum: 1
      },
      totalElements: 0,
      radio: '',
      timestamp: formatData,
      loading: true,
      searchParams: {}
    }
  },
  mounted() {
    this.initList()
  },
  methods: {
    async initList(params = this.searchParams, number = this.query.pageNum) {
      // 增加 已点评 状态
      const query = Object.assign({}, params, { comment_time: { gt: 0 } })
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
        console.log(error)
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

    /**
     * 搜索
     */
    getSearch(res) {
      console.log(res, 'search')
      this.searchParams = res || {}
      this.query.pageNum = 1
      this.initList()
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
    }
  }
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
