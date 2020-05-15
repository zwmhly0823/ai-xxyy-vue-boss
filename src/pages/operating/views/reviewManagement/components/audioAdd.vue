<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 14:30:00
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-15 15:29:20
 */
 -->
<template>
  <div class="audio-add">
    <el-form :model="form" class="audio-add-form">
      <el-form-item label="课程" class="audio-add-form-item">
        <el-select
          v-model="form.type"
          placeholder="请选择课程类型"
          class="course-type"
        >
          <el-option
            v-for="(item, index) in courseType"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select v-model="form.difficulty" placeholder="请选择课程难度">
          <el-option
            v-for="(item, index) in courseDifficulty"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select v-model="form.level" placeholder="请选择课程级别">
          <el-option
            v-for="(item, index) in courseLevel"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select v-model="form.unit" placeholder="请选择课程单元">
          <el-option
            v-for="(item, index) in courseUnit"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select v-model="form.lesson" placeholder="请选择课程Lesson">
          <el-option
            v-for="(item, index) in courseLesson"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select v-model="form.courseId" placeholder="请选择对应课程">
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
        <el-select v-model="form.degree" placeholder="请选择点评维度">
          <el-option
            v-for="(item, index) in reviewDegree"
            :key="index"
            :label="item"
            :value="index"
          >
          </el-option>
        </el-select>
        <el-select v-model="form.rate" placeholder="请选择评分">
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
      <Upload :btnWidth="130" format="audio" :upload="upload">
        <div slot="mp3" class="upload-tip">只能上传mp3格式</div>
      </Upload>
    </div>
    <el-button type="primary" class="button-sure" @click="handleSubmit"
      >确认上传</el-button
    >
  </div>
</template>

<script>
import {
  courseType,
  courseDifficulty,
  courseLevel,
  courseUnit,
  courseLesson,
  reviewDegree,
  reviewRate,
  scoreObj
} from '@/common/data'
import uploadFile from '@/utils/upload'
export default {
  data() {
    return {
      courseType: courseType,
      courseDifficulty: courseDifficulty,
      courseLevel: courseLevel,
      courseUnit: courseUnit,
      courseLesson: courseLesson,
      coursePayload: [],
      reviewDegree: reviewDegree,
      reviewRate: reviewRate,
      scoreObj: scoreObj,
      form: {
        type: null,
        difficulty: null,
        level: null,
        unit: null,
        lesson: null,
        courseId: null,
        degree: null,
        rate: null
      },
      audioList: []
    }
  },
  watch: {
    form: {
      handler(val) {
        if (
          val.type !== null &&
          val.difficulty !== null &&
          val.level !== null &&
          val.unit !== null &&
          val.lesson !== null
        ) {
          const type = val.type === 0 ? 'T1' : 'T2'
          const params = `${type}${this.courseDifficulty[val.difficulty]}${
            this.courseLevel[val.level]
          }${this.courseUnit[val.unit]}${this.courseLesson[val.lesson]}`
          this.loadCourseList(params)
        }
        // if (val.degree === 0) {
        //   this.reviewRate = []
        //   val.rate = null
        //   return
        // }
        // this.reviewRate = reviewRate
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initData() {
      const arr = Object.keys(this.form)
      arr.map((item, index) => {
        this.form[item] = null
      })
    },
    async loadCourseList(params) {
      this.coursePayload.length = 0
      try {
        const res = await this.$http.RiviewCourse.getCourseLesson(params)
        if (res.code === 0) {
          res.payload.length !== 0 &&
            res.payload.map((item, index) => {
              this.coursePayload.push(item)
            })
        }
      } catch (error) {
        console.log(error)
      }
    },
    upload(file) {
      uploadFile(file).then((res) => {
        this.audioList.push(res)
      })
    },
    async handleSubmit() {
      const {
        type,
        difficulty,
        degree,
        level,
        unit,
        lesson,
        courseId,
        rate
      } = this.form
      const { coursePayload, scoreObj } = this
      const fileUrl = this.audioList.join('')
      const arr = Object.keys(this.form)
      const check = arr.every((item, index) => {
        return this.form[item] === null
      })
      let courseName = null
      let score = null
      for (const item of coursePayload) {
        if (item.id === courseId) {
          courseName = item.title
        }
      }
      for (const key in scoreObj) {
        if (rate === scoreObj[key]) {
          score = key
        }
      }
      if (check) {
        this.$message({
          message: '选择项为空，暂时无法提交！',
          type: 'error'
        })
      }
      const params = {
        courseType: type === 0 ? 'EXPERIENCE' : 'SYSTEM',
        courseStrait: courseDifficulty[difficulty],
        courseLevel: courseDifficulty[level],
        courseUnit: courseUnit[unit],
        courseLesson: courseLesson[lesson],
        courseId: courseId,
        courseName: courseName,
        reviewDimension: reviewDegree[degree],
        score: score,
        fileUrl: fileUrl,
        opreation: 'ENABLE'
      }
      try {
        const res = await this.$http.RiviewCourse.addRiviewInform(params)
        if (res.code === 0) {
          this.$message({
            message: '上传成功！',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.push('/reviewManagement')
          }, 2000)
        }
      } catch (error) {
        console.log(error)
      }
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
  margin: 20px 0 0 0;
  overflow: hidden;
  &-form {
    margin: 80px auto 0;
    &-item {
      margin: 0 0 0 80px;
      .el-select {
        margin: 0 0 0 30px;
      }
      .course-type {
        margin-left: 60px;
      }
    }
    .degree {
      margin-top: 30px;
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
}
</style>
