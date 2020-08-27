<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 14:30:00
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-11 12:04:44
 */
 -->
<template>
  <div class="audio-add">
    <el-button type="primary" @click="goBack" class="go-back">返回</el-button>
    <el-form :model="form" class="audio-add-form">
      <el-form-item label="课  程" class="audio-add-form-item">
        <el-select
          v-model="form.type"
          placeholder="请选择课程类型"
          class="course-type"
          @change="onCourseTypeChange"
        >
          <el-option
            v-for="(item, index) in courseType"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="current-lessen" v-if="currentLessonId">
          课程ID：{{ currentLessonId }}
        </div>
        <el-select v-model="form.difficulty" placeholder="请选择课程难度">
          <el-option
            v-for="(item, index) in courseDifficulty"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="form.level"
          placeholder="请选择课程级别"
          v-if="isNotTvCourse"
        >
          <el-option
            v-for="(item, index) in courseLevel"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="form.unit"
          placeholder="请选择课程单元"
          v-if="isNotTvCourse"
        >
          <el-option
            v-for="(item, index) in courseUnit"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="form.lesson"
          placeholder="请选择课程Lesson"
          v-if="isNotTvCourse"
        >
          <el-option
            v-for="(item, index) in courseLesson"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="courseId"
          placeholder="请选择对应课程"
          @change="currentLesson"
        >
          <el-option
            v-for="(item, index) in coursePayload"
            :key="index"
            :label="item.title"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="点评维度" class="audio-add-form-item degree">
        <el-select v-model="commentFrom.degree" placeholder="请选择点评维度">
          <el-option
            v-for="(item, index) in reviewDegree"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select
          v-model="commentFrom.rate"
          placeholder="请选择评分"
          v-show="isShowRate"
        >
          <el-option
            v-for="(item, index) in reviewRate"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="upload-container">
      <Upload
        :btnWidth="130"
        format="audio"
        :upload="upload"
        :limit="1"
        :audioList="audioList"
        uploadText="选择语音"
        @handle-remove="handleRemoveFile"
      >
        <div slot="mp3" class="upload-tip">只能上传mp3格式</div>
      </Upload>
    </div>
    <el-button
      type="primary"
      size="small"
      class="button-sure"
      @click="handleSubmit"
      :disabled="btnDisabled"
      >确认上传</el-button
    >
  </div>
</template>

<script>
import {
  courseDifficulty,
  courseLevel,
  courseUnit,
  courseLesson,
  reviewDegree,
  reviewRate,
  scoreObj
} from '@/common/data'
import uploadFile from '@/utils/newupload'
export default {
  data() {
    return {
      currentLessonId: '',
      courseType: [
        {
          label: '体验课',
          value: 'EXPERIENCE'
        },
        {
          label: '系统课',
          value: 'SYSTEM'
        },
        {
          label: '体验课-TV课',
          value: 'TA'
        },
        {
          label: '系统课-TV课',
          value: 'TB'
        },
        {
          label: '节日主题课',
          value: 'T6'
        }
      ],
      courseDifficulty: courseDifficulty,
      courseLevel: courseLevel,
      courseUnit: courseUnit,
      courseLesson: courseLesson,
      coursePayload: [],
      reviewDegree: reviewDegree,
      reviewRate: reviewRate,
      scoreObj: scoreObj,
      courseId: null, // 课程特殊处理
      commentFrom: {
        degree: null,
        rate: null
      },
      form: {
        type: null,
        difficulty: null,
        level: null,
        unit: null,
        lesson: null
      },
      audioList: [],
      isShowRate: true,
      removeFile: [],
      btnDisabled: false
    }
  },
  computed: {
    isNotTvCourse() {
      const {
        form: { type }
      } = this
      return type !== 'TA' && type !== 'TB' && type !== 'T6'
    }
  },
  watch: {
    commentFrom: {
      handler(val, old) {
        if (val.degree === 0) {
          this.isShowRate = false
        } else {
          this.isShowRate = true
        }
      },
      deep: true,
      immediate: true
    },
    form: {
      handler(val) {
        this.courseId = null
        this.currentLessonId = ''
        /** 当选择课程为‘体验课-TV’or‘系统课-TV' or '节日主题课' */
        if (!this.isNotTvCourse) {
          this.form.level = null
          this.form.unit = null
          this.form.lesson = null
          // 设置 对应的课程
          if (val.difficulty !== null) {
            this.getTVCourseLesson({
              stageNo: this.courseDifficulty[val.difficulty],
              typeNo: val.type
            })
          }
        } else {
          if (
            val.type !== null &&
            val.difficulty !== null &&
            val.level !== null &&
            val.unit !== null &&
            val.lesson !== null
          ) {
            const couseT = {
              EXPERIENCE: 'T1',
              SYSTEM: 'T2'
            }
            const type = couseT[val.type]
            const params = `${type}${this.courseDifficulty[val.difficulty]}${
              this.courseLevel[val.level]
            }${this.courseUnit[val.unit]}${this.courseLesson[val.lesson]}`
            this.loadCourseList(params)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /** 获取TV课程列表 */
    async getTVCourseLesson(params) {
      try {
        const res = await this.$http.RiviewCourse.getTVCourseLesson(params)
        if (res.code === 0) {
          this.coursePayload = res.payload
        }
      } catch (error) {
        console.log(error)
      }
    },
    /** 选择当前课程时 */
    currentLesson(curLesson) {
      this.currentLessonId = curLesson
    },
    /** 选择课程类型时 */
    onCourseTypeChange(courseType) {},
    initData() {
      const arr = Object.keys(this.form)
      arr.map((item, index) => {
        this.form[item] = null
      })
    },
    async loadCourseList(params) {
      try {
        const res = await this.$http.RiviewCourse.getCourseLessons(params)
        if (res.code === 0) {
          // 清空 课程列表
          this.coursePayload = res.payload
        }
      } catch (error) {
        console.log(error)
      }
    },
    upload(file) {
      console.log(file, 'file')
      const _this = this
      uploadFile(file).then((res) => {
        console.log(res, 'res=')
        _this.$message({
          message: `${file.file.name}上传成功！`,
          type: 'success'
        })
        this.audioList.push({
          uid: file.file.uid,
          url: res
        })
      })
    },
    handleRemoveFile(list) {
      if (!list.length) this.audioList = []
      this.removeFile = list
    },
    async handleSubmit() {
      const { type, difficulty, level, unit, lesson } = this.form
      const { degree, rate } = this.commentFrom
      const {
        coursePayload,
        scoreObj,
        isShowRate,
        audioList,
        removeFile
      } = this
      const fileUrlList = []
      for (const item of audioList) {
        if (removeFile.length) {
          for (const remove of removeFile) {
            if (item.uid === remove.uid) {
              fileUrlList.push(item.url)
            }
          }
        } else {
          fileUrlList.push(item.url)
        }
      }
      const fileUrl = fileUrlList.join('')
      let courseName = null
      for (const item of coursePayload) {
        if (item.id === this.courseId) {
          courseName = item.title
        }
      }
      let score = null
      for (const key in scoreObj) {
        if (rate === scoreObj[key]) {
          score = key
        }
      }
      if (!isShowRate) score = 'EXCELLENT'

      // this.form.level = null TODO: 看不懂为啥要 设为 null
      if (!this.isNotTvCourse) {
        if (
          type === null ||
          difficulty === null ||
          this.courseId === null ||
          degree === null ||
          score === null ||
          !fileUrl
        ) {
          this.$message({
            message: '选择项为空，暂时无法提交！',
            type: 'error'
          })
          return false
        }
      } else if (
        type === null ||
        difficulty === null ||
        degree === null ||
        level === null ||
        unit === null ||
        lesson === null ||
        this.courseId === null ||
        score === null ||
        !fileUrl
      ) {
        this.$message({
          message: '选择项为空，暂时无法提交！',
          type: 'error'
        })
        return false
      }
      let curCourse = {}
      for (let i = 0; i < this.coursePayload.length; i++) {
        if ((this.coursePayload[i].id = this.courseId)) {
          curCourse = this.coursePayload[i]
          break
        }
      }
      const {
        coursewareNo = '', // lesseon
        levelNo = '', // courseLevel
        unitNo = '' // courseUnit
      } = curCourse
      // const fileName = 'https://s1.meixiu.mobi/h5/headPic/1598338769600.mp3'
      const pos = fileUrl.lastIndexOf('/')
      const voiceName = fileUrl.substring(pos + 1, fileUrl.length - 4)
      console.log(voiceName, 'voiceName=')
      const params = {
        courseType: type,
        courseStrait: courseDifficulty[difficulty],
        courseLevel: courseLevel[level] || levelNo,
        courseUnit: courseUnit[unit] || unitNo,
        courseLesson: courseLesson[lesson] || coursewareNo,
        courseId: this.courseId,
        reviewDimension: reviewDegree[degree],
        courseName,
        score,
        fileUrl, // TODO:
        opreation: 'ENABLE',
        voiceName
      }
      try {
        this.btnDisabled = true
        const res = await this.$http.RiviewCourse.addRiviewInform(params)
        if (res.code === 0) {
          this.$message({
            message: '上传成功！',
            type: 'success'
          })
          setTimeout(() => {
            this.btnDisabled = false
          }, 3000)
        } else {
          setTimeout(() => {
            this.btnDisabled = false
          }, 3000)
        }
      } catch (error) {
        console.log(error)
        setTimeout(() => {
          alert('1111')
          this.btnDisabled = false
        }, 3000)
      }
    },
    goBack() {
      this.$router.push('/reviewManagement')
    }
  },
  components: {
    Upload: () => import('@/components/Upload')
  },
  beforeDestroy() {
    this.initData()
    this.audioList = []
  }
}
</script>

<style lang="scss" scoped>
.audio-add {
  width: 100%;
  height: 100vh;
  background: rgb(255, 255, 255);
  overflow: hidden;
  .current-lessen {
    position: absolute;
    top: 35px;
    left: 60px;
  }
  .go-back {
    margin: 10px 0 0 10px;
  }
  &-form {
    margin: 80px auto 0;
    &-item {
      margin: 0 0 0 80px;
      .el-select {
        margin: 0 0 0 30px;
      }
    }
    .degree {
      margin-top: 30px;
    }
    /deep/ .el-form-item__content {
      display: flex;
      // justify-content: flex-start;
    }
  }
  .upload-container {
    margin: 80px 0 0 180px;
    .upload-tip {
      margin: 20px 0 0 0;
    }
    /deep/ .el-upload-list {
      width: 300px;
    }
  }
  .button-sure {
    width: 130px;
    height: 32px;
    line-height: 0;
    margin: 20px 0 0 180px;
  }
  /deep/ .el-form-item__label {
    width: 70px !important;
  }
}
</style>
