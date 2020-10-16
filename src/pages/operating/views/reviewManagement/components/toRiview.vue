<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 14:30:00
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-16 21:57:22
 */
 -->
<template>
  <div class="container">
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="list"
    >
      <el-table-column label="作品" width="100" align="center">
        <template slot-scope="scope" v-if="scope.row.taskImage">
          <el-image
            class="works-img"
            :src="scope.row.taskImage"
            :lazy="true"
            :preview-src-list="[scope.row.taskImage]"
            :z-index="1001"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="点评" width="300" align="center">
        <template
          slot-scope="scope"
          v-if="scope.row.reviewDataList !== undefined"
        >
          <div class="review-container">
            <div class="top-container">
              <div
                v-for="(item, index) in Object.keys(scope.row.reviewDataList)"
                :key="index"
              >
                <div
                  class="title"
                  v-if="
                    scope.row.reviewDataList[item] !== undefined &&
                      item !== '开场白'
                  "
                >
                  {{ item }}
                </div>
                <div v-if="item !== '开场白'">
                  <div
                    v-for="(_item, _index) of scope.row.reviewDataList[item]"
                    :key="_index"
                  >
                    <div
                      @click="selectNow(scope.$index, item, _index)"
                      class="select-container"
                    >
                      <span class="background-round"
                        ><span :class="[_item.flag ? 'circle' : '111']"></span
                      ></span>
                      <span>{{ scoreObj[_item.score] }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="bottom-container"
              v-if="Object.keys(scope.row.reviewDataList).length"
            >
              <el-button
                type="success"
                @click="syntheticSpeech(scope.$index, scope.row)"
                >生成</el-button
              >
              <div class="audio-container">
                <audio
                  v-if="scope.row.showAudio"
                  :src="scope.row.mp3Url"
                  controls
                  ref="audioRef"
                ></audio>
              </div>
              <el-button
                type="primary"
                :disabled="!scope.row.mp3Url"
                @click="generateSpeech(scope.row)"
                >发送</el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.userMobile }}</div>
          <div>{{ scope.row.weixinNickname }}</div>
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.teamName }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="课程"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column label="辅导老师" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.teacherRealName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="上传日期" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ timestamp(scope.row.ctime, 2) }}</div>
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
import { timestamp } from '@/utils/index'
import { reviewDegree, _scoreObj } from '@/common/data'
export default {
  data() {
    return {
      number: 1,
      list: [],
      query: {
        size: 10,
        pageNum: 1
      },
      totalElements: 0,
      timestamp: timestamp,
      loading: true,
      courseIdList: [],
      scoreObj: _scoreObj,
      renderFlag: false
    }
  },
  mounted() {
    this.initList(this.number)
  },
  methods: {
    async initList(number) {
      this.loading = true
      try {
        const res = await this.$http.RiviewCourse.getToView(
          number,
          this.query.size
        )
        if (res.code === 0) {
          const list = res.payload.content
          this.totalElements = Number.parseInt(res.payload.totalElements)
          list.forEach((item, index) => {
            const str = `${item.id}@${item.courseId}`
            this.courseIdList.push(str)
          })
          await this.iniToViewInform(list)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async iniToViewInform(list) {
      if (!this.courseIdList.length) return
      const courseIds = this.courseIdList.join(',')
      try {
        const res = await this.$http.RiviewCourse.getToViewInform(courseIds)
        if (res.code === 0) {
          const reviewList = res.payload
          this.list = list.map((item) => {
            for (const key in reviewList) {
              if (item.id === key) {
                const keys = reviewList[key]
                const obj = {}
                for (let i = 0; i < reviewDegree.length; i++) {
                  const current = reviewDegree[i]
                  const curVal = keys[current]
                  curVal && (obj[current] = curVal)
                }
                item.reviewDataList = obj
              }
            }
            return item
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async pageChange_handler(page) {
      this.courseIdList = []
      this.query.pageNum = page
      await this.initList(page)
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    getObjValues(obj) {
      if (!obj) return false

      const newarr = []
      for (const key in obj) {
        if (obj[key]) {
          newarr.push(key)
        }
      }
      return newarr
    },
    selectNow(listIndex, item, index) {
      const listItem = this.list[listIndex]
      const riviewList = listItem.reviewDataList[item]
      for (let i = 0; i < riviewList.length; i++) {
        if (i === index) {
          riviewList[i].flag = true
        } else {
          riviewList[i].flag = false
        }
      }
      this.list.splice(listIndex, 1, listItem)
    },
    async syntheticSpeech(listIndex, row) {
      const _this = this
      const listItem = this.list[listIndex]
      const keysItem = Object.keys(this.list[listIndex].reviewDataList)
      const idx = listItem.reviewDataList
      const ownArr = Object.values(idx)
      const ownLength = []
      const ownFils = Object.values(idx).flat()
      const fileUrl = []
      for (const item of ownArr) {
        if (item) {
          ownLength.push(item)
        }
      }
      for (const file of ownFils) {
        if (file !== undefined && file.flag) {
          fileUrl.push(file.fileUrl)
        }
      }
      const arr = []
      for (let i = 0; i < keysItem.length; i++) {
        const _arr = idx[keysItem[i]]
        if (_arr && _arr.length) {
          for (const _item of _arr) {
            if (_item.flag) {
              arr.push(_item.flag)
            }
          }
        }
      }
      if (keysItem.includes('开场白')) {
        arr.push(true)
        if (fileUrl.length > 0 && idx['开场白'] !== undefined) {
          fileUrl.unshift(idx['开场白'][0].fileUrl)
        }
      }
      if (arr.length < ownLength.length) {
        this.$message({
          message: '请选择评分！',
          type: 'warning'
        })
        return false
      }
      if (fileUrl.join(',') === '') {
        this.$message({
          message: '老师正在努力录制~',
          type: 'warning'
        })
        return false
      }
      const voices = {
        voices: fileUrl.join(',')
      }
      try {
        const res = await this.$http.RiviewCourse.syntheticSpeech(voices)
        if (res.code === 0) {
          this.$message({
            message: '生成成功！',
            type: 'success'
          })
          row.showAudio = true
          row.mp3Url = `https://${res.payload}`
          _this.list.splice(listIndex, 1, listItem)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async generateSpeech(item) {
      const describe = Math.ceil(this.$refs.audioRef.duration)
      if (isNaN(describe)) {
        console.log('生成失败')
        this.$message.error('发送失败，请重新发送')
        return false
      }
      const params = {
        studentId: item.studentId,
        taskId: item.id,
        teacherId: item.teacherId,
        teamId: item.teamId,
        soundComment: item.mp3Url,
        soundCommentSecond: describe
      }
      try {
        const res = await this.$http.RiviewCourse.generateSpeech(params)
        if (res.code === 0) {
          this.$message({
            message: '发送成功！',
            type: 'success'
          })
          setTimeout(() => {
            this.initList(this.query.pageNum)
          }, 1500)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    MPagination: () => import('@/components/MPagination/index.vue')
  },
  beforeDestroy() {
    this.courseIdList = []
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 0 30px 0;
  .review-container {
    .top-container {
      display: flex;
      justify-content: space-between;
      margin: 0 0 40px 0;
      .title {
        font-size: 18px;
        margin: 0 0 10px 0;
      }
      .select-container {
        text-align: left;
        span {
          display: inline-block;
        }
        .background-round {
          width: 15px;
          height: 15px;
          border: 1px solid rgb(121, 121, 121);
          border-radius: 100%;
          line-height: 15px;
          margin: 0 10px 0 10px;
          cursor: pointer;
          .circle {
            width: 10px;
            height: 10px;
            background: rgb(121, 121, 121);
            border-radius: 100%;
            margin: 0px 0px 1px 1.4px;
          }
        }
      }
    }
    .bottom-container {
      display: flex;
      width: 70%;
      margin: 0 auto;
      button {
        height: 30px;
        line-height: 0;
      }
      .audio-container {
        overflow: hidden;
        width: 30px;
        border-radius: 100%;
        height: 30px;
        margin: 0 auto;
        audio {
          height: 30px;
          margin-left: -10px;
        }
      }
    }
  }
  .works-img {
    width: 100px;
    height: 150px;
    display: block;
    margin: 0 auto;
  }
  .describe-container {
    display: inline-block;
    line-height: 35px;
    width: 80px;
    text-align: left;
    &-title {
      text-align: center;
    }
  }
  /deep/ .m-pagination {
    bottom: 0;
  }
  /deep/ .el-icon-circle-close {
    color: rgb(255, 255, 255);
  }
}
</style>
