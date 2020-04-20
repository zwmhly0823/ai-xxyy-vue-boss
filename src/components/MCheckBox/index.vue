<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-20 21:18:48
 -->
<template>
  <div>
    <div v-if="tables.tabs == 3">
      <el-popover
        v-model="attendClassShow"
        placement="bottom"
        width="300"
        trigger="click"
      >
        <!-- <el-button slot="reference">筛选</el-button> -->
        <el-button
          class="screen-text"
          slot="reference"
          @click="visible = !visible"
        >
          <span>
            <svg
              t="1586260816244"
              class="icon-filter"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1148"
              width="200"
              height="200"
            >
              <path
                d="M859.02 234.524l0.808-0.756 0.749-0.813c27.047-29.356 33.876-70.34 17.823-106.957-15.942-36.366-50.416-58.957-89.968-58.957H163.604c-38.83 0-73.043 22.012-89.29 57.444-16.361 35.683-10.632 76.301 14.949 106.004l0.97 1.126 280.311 266.85 2.032 312.074c0.107 16.502 13.517 29.805 29.995 29.805l0.2-0.001c16.568-0.107 29.912-13.626 29.804-30.194l-2.198-337.564-296.478-282.241c-9.526-11.758-11.426-26.933-5.044-40.851 6.446-14.059 19.437-22.452 34.75-22.452h624.828c15.6 0 28.69 8.616 35.017 23.047 6.31 14.391 3.924 29.831-6.354 41.497l-304.13 284.832 1.302 458.63c0.047 16.54 13.469 29.916 29.998 29.915h0.087c16.568-0.047 29.962-13.517 29.915-30.085L573.04 502.36l285.98-267.836z"
                p-id="1149"
              ></path>
              <path
                d="M657.265 595.287c0 16.498 13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.498 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997H687.262c-16.498 0-29.997 13.499-29.997 29.997zM931.159 734.169H687.262c-16.498 0-29.997 13.499-29.997 29.997s13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.499 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997zM931.159 903.047H687.262c-16.498 0-29.997 13.499-29.997 29.997s13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.499 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997z"
                p-id="1150"
              ></path>
            </svg>
          </span>
          筛选</el-button
        >
        <p class="title-text">参课和完课筛选</p>
        <p>选择课程</p>
        <el-select
          v-model="attendClassSelect"
          filterable
          remote
          clearable
          multiple
          reserve-keyword
          collapse-tags
          placeholder="请选择课程"
          @visible-change="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in attendClassList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <p>状态</p>
        <el-select v-model="attendClassStatus" placeholder="请选择">
          <el-option
            v-for="item in states"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- <el-checkbox-group
          class="check-states-box"
          v-model="attendClassStatus"
          @change="attendClassChangeStatus"
        >
          <el-checkbox
            class="check-states"
            v-for="state in states"
            :label="state.value"
            :key="state.label"
            >{{ state.label }}</el-checkbox
          >
        </el-checkbox-group> -->
        <p>参课情况</p>
        <el-select v-model="attendClassGinseng" placeholder="请选择">
          <el-option
            v-for="item in friends"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- <el-checkbox-group
          v-model="attendClassGinseng"
          @change="attendClassChangeGinseng"
        >
          <el-checkbox
            v-for="friend in friends"
            :label="friend.value"
            :key="friend.label"
            >{{ friend.label }}</el-checkbox
          >
        </el-checkbox-group> -->
        <p>完课情况</p>
        <el-select v-model="attendClassFinish" placeholder="请选择">
          <el-option
            v-for="item in groups"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <!-- <el-checkbox-group
          v-model="attendClassFinish"
          @change="attendClassChangeFinish"
        >
          <el-checkbox
            v-for="group in groups"
            :label="group.value"
            :key="group.label"
            >{{ group.label }}</el-checkbox
          >
        </el-checkbox-group> -->
        <div class="check-button">
          <el-button
            style="border: none;"
            @click="attendClassEmpty"
            size="small"
            >清空</el-button
          >
          <el-button
            @click="onAttendClass"
            style="margin-left:40px;width:80px;"
            size="small"
            type="primary"
            >过滤</el-button
          >
          <el-button
            @click="attendClassCancel"
            style="width:80px;color:#409EFF;border:1px solid #409EFF;"
            size="small"
            >取消</el-button
          >
        </div>
      </el-popover>
    </div>
    <!-- --------------------------------------- -->
    <div v-if="tables.tabs == 4">
      <el-popover
        v-model="worksShow"
        placement="bottom"
        width="300"
        trigger="click"
      >
        <!-- <el-button slot="reference">筛选</el-button> -->

        <el-button
          class="screen-text"
          slot="reference"
          @click="visible = !visible"
        >
          <span>
            <svg
              t="1586260816244"
              class="icon-filter"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1148"
              width="200"
              height="200"
            >
              <path
                d="M859.02 234.524l0.808-0.756 0.749-0.813c27.047-29.356 33.876-70.34 17.823-106.957-15.942-36.366-50.416-58.957-89.968-58.957H163.604c-38.83 0-73.043 22.012-89.29 57.444-16.361 35.683-10.632 76.301 14.949 106.004l0.97 1.126 280.311 266.85 2.032 312.074c0.107 16.502 13.517 29.805 29.995 29.805l0.2-0.001c16.568-0.107 29.912-13.626 29.804-30.194l-2.198-337.564-296.478-282.241c-9.526-11.758-11.426-26.933-5.044-40.851 6.446-14.059 19.437-22.452 34.75-22.452h624.828c15.6 0 28.69 8.616 35.017 23.047 6.31 14.391 3.924 29.831-6.354 41.497l-304.13 284.832 1.302 458.63c0.047 16.54 13.469 29.916 29.998 29.915h0.087c16.568-0.047 29.962-13.517 29.915-30.085L573.04 502.36l285.98-267.836z"
                p-id="1149"
              ></path>
              <path
                d="M657.265 595.287c0 16.498 13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.498 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997H687.262c-16.498 0-29.997 13.499-29.997 29.997zM931.159 734.169H687.262c-16.498 0-29.997 13.499-29.997 29.997s13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.499 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997zM931.159 903.047H687.262c-16.498 0-29.997 13.499-29.997 29.997s13.499 29.997 29.997 29.997h243.897c16.498 0 29.997-13.499 29.997-29.997 0-16.498-13.499-29.997-29.997-29.997z"
                p-id="1150"
              ></path>
            </svg>
          </span>
          筛选</el-button
        >
        <p class="title-text">作品及点评筛选</p>
        <p>选择课程</p>
        <el-select
          v-model="worksSelect"
          filterable
          remote
          clearable
          multiple
          reserve-keyword
          collapse-tags
          placeholder="请选择课程"
          @visible-change="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in worksList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <p>作品上传</p>

        <el-select v-model="emptyWorksUpload" placeholder="请选择">
          <el-option
            v-for="item in uploads"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <!-- <el-checkbox-group
          class="check-states-box"
          v-model="emptyWorksUpload"
          @change="worksChangeStatus"
        >
          <el-checkbox
            class="check-states"
            v-for="upload in uploads"
            :label="upload.value"
            :key="upload.label"
            >{{ upload.label }}</el-checkbox
          >
        </el-checkbox-group> -->
        <p>作品点评</p>

        <el-select v-model="emptyWorksComment" placeholder="请选择">
          <el-option
            v-for="item in comments"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- <el-checkbox-group
          v-model="emptyWorksComment"
          @change="worksChangeAttend"
        >
          <el-checkbox
            v-for="comment in comments"
            :label="comment.value"
            :key="comment.label"
            >{{ comment.label }}</el-checkbox
          >
        </el-checkbox-group> -->
        <p>听作品点评</p>
        <el-select v-model="emptyWorksHear" placeholder="请选择">
          <el-option
            v-for="item in hearWorkss"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <!-- <el-checkbox-group v-model="emptyWorksHear" @change="worksChangeFinish">
          <el-checkbox
            v-for="hearWorks in hearWorkss"
            :label="hearWorks.value"
            :key="hearWorks.label"
            >{{ hearWorks.label }}</el-checkbox
          >
        </el-checkbox-group> -->
        <div class="check-button">
          <el-button style="border: none;" @click="worksEmpty" size="small"
            >清空</el-button
          >
          <el-button
            @click="onWorks"
            style="margin-left:40px;width:80px;"
            size="small"
            type="primary"
            >过滤</el-button
          >
          <el-button
            @click="worksCancel"
            style="width:80px;color:#409EFF;border:1px solid #409EFF;"
            size="small"
            >取消</el-button
          >
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MCheckBox',
  props: {
    tables: {
      type: Object,
      default: null
    },
    classId: {
      type: Object,
      default: null
    },
    audioTabs: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      loading: false,
      // 点击取消 隐藏弹出框
      attendClassShow: null,
      worksShow: null,
      visible: false,
      // 参课完课 状态
      attendClassStatus: [],
      // 参课完课 参课情况
      attendClassGinseng: [],
      // 参课完课 完课状态
      attendClassFinish: [],
      // 作品及点评 作品上传
      emptyWorksUpload: [],
      // 作品及点评 作品点评
      emptyWorksComment: [],
      // 作品及点评 听作品点评
      emptyWorksHear: [],
      states: [
        {
          value: '5',
          label: '已年课'
        },
        {
          value: '2',
          label: '体验完课'
        }
      ],
      friends: [
        {
          value: '0',
          label: '未参课'
        },
        {
          value: '1',
          label: '已参课'
        }
      ],
      groups: [
        {
          value: '0',
          label: '未完课'
        },
        {
          value: '1',
          label: '已完课'
        }
      ],
      uploads: [
        {
          value: '0',
          label: '未上传'
        },
        {
          value: '1',
          label: '已上传'
        }
      ],
      comments: [
        {
          value: '0',
          label: '未点评'
        },
        {
          value: '1',
          label: '已点评'
        }
      ],
      hearWorkss: [
        {
          value: '0',
          label: '未听点评'
        },
        {
          value: '1',
          label: '已听点评'
        }
      ],
      attendClassList: [],
      worksList: [],
      attendClassSelect: '',
      worksSelect: ''
    }
  },
  mounted() {},
  watch: {
    audioTabs(value) {
      // 作品及点评 作品上传
      this.emptyWorksUpload = []
      // 作品及点评 作品点评
      this.emptyWorksComment = []
      // 作品及点评 听作品点评
      this.emptyWorksHear = []
      this.worksSelect = ''

      // 参课完课 状态
      this.attendClassStatus = []
      // 参课完课 参课情况
      this.attendClassGinseng = []
      // 参课完课 完课情况
      this.attendClassFinish = []
      this.attendClassSelect = ''
    }
  },
  created() {
    console.log(this.audioTabs, 'this.value.tabs')
  },
  methods: {
    // 参课完课 作品及点评 筛选下拉框接口
    remoteMethod() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        const query = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
        this.$http.Team.getStuCourseList({ query }).then((item) => {
          const data = item.data.getStuCourseList
          const _data = []
          data.forEach((res) => {
            _data.push({
              value: res.course_id,
              label: res.classTitle
            })
          })
          if (this.tables.tabs === 3) {
            this.attendClassList = _data.filter((ele) => {
              return ele
            })
          } else {
            this.worksList = _data.filter((ele) => {
              return ele
            })
          }
        })
      }, 200)
    },
    // 点击 参课完课 过滤
    onAttendClass() {
      // 选择课程
      const courseId = this.attendClassSelect.toString()
      const userStatus = this.attendClassStatus
      const isJoinCourse = this.attendClassGinseng.toString()
      const isCompleteCourse = this.attendClassFinish.toString()
      console.log(
        courseId,
        userStatus,
        isJoinCourse,
        isCompleteCourse,
        '参课完课数据'
      )
      const data = {
        courseId: courseId,
        userStatus: userStatus,
        isJoinCourse: isJoinCourse,
        isCompleteCourse: isCompleteCourse
      }
      this.$emit('screenAttendClass', data)
      this.attendClassShow = false
    },
    // 点击 作品及点评 过滤
    onWorks() {
      // 上传作品
      const isTask = this.emptyWorksUpload.toString()
      // 作品点评
      const isComment = this.emptyWorksComment.toString()
      // 听作品点评
      const isListen = this.emptyWorksHear.toString()
      // 选择课程
      const courseId = this.worksSelect.toString()
      console.log(isTask, isComment, isListen, courseId, '作品及点评数据')
      const data = {
        courseId: courseId,
        isTask: isTask,
        isComment: isComment,
        isListen: isListen
      }
      this.$emit('screenWorks', data)
      this.worksShow = false
    },
    // 参课完课 状态
    // attendClassChangeStatus(value) {
    //   this.attendClassStatus = value
    // },
    // 参课完课 参课情况
    // attendClassChangeGinseng(value) {
    //   this.attendClassGinseng = value
    // },
    // 参课完课 完课情况
    // attendClassChangeFinish(value) {
    //   this.attendClassFinish = value
    // },
    // 参课完课 点击清空
    attendClassEmpty() {
      this.attendClassSelect = ''
      // 参课完课 状态
      this.attendClassStatus = []
      // 参课完课 参课情况
      this.attendClassGinseng = []
      // 参课完课 完课情况
      this.attendClassFinish = []
    },
    // 参课完课 点击取消
    attendClassCancel() {
      this.attendClassSelect = ''
      this.attendClassStatus = []
      this.attendClassGinseng = []
      this.attendClassFinish = []
      this.attendClassShow = false
    },
    // 作品及点评 作品上传
    // worksChangeStatus(value) {
    //   this.emptyWorksUpload = value
    // },
    // 作品及点评 作品点评
    // worksChangeAttend(value) {
    //   this.emptyWorksComment = value
    // },
    // 作品及点评 听作品点评
    // worksChangeFinish(value) {
    //   this.emptyWorksHear = value
    // },

    // 作品及点评 点击清空
    worksEmpty() {
      this.worksSelect = ''
      this.emptyWorks = []
      // 作品及点评 作品上传
      this.emptyWorksUpload = []
      // 作品及点评 作品点评
      this.emptyWorksComment = []
      // 作品及点评 听作品点评
      this.emptyWorksHear = []
    },
    // 作品及点评 点击取消
    worksCancel() {
      this.worksSelect = ''
      // 作品及点评 作品上传
      this.emptyWorksUpload = []
      // 作品及点评 作品点评
      this.emptyWorksComment = []
      // 作品及点评 听作品点评
      this.emptyWorksHear = []
      this.worksShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.screen-text {
  border: none;
}
.icon-filter {
  font-size: 24px;
  height: 18px;
  width: 18px;
}
.title-text {
  font-weight: 400;
  font-size: 22px;
}
.check-menu {
  width: 260px;
  padding: 10px;
}
.check-button {
  margin-top: 20px;
}
</style>
