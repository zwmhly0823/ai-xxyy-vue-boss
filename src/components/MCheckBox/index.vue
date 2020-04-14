<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 20:22:24
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-14 14:47:47
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
          collapse-tags
          multiple
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in attendClassList"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
        <p>状态</p>
        <el-checkbox-group
          class="check-states-box"
          v-model="emptyAttendClass"
          @change="attendClassChange"
        >
          <el-checkbox
            class="check-states"
            v-for="state in states"
            :label="state"
            :key="state"
            >{{ state }}</el-checkbox
          >
        </el-checkbox-group>
        <p>参课情况</p>
        <el-checkbox-group
          v-model="emptyAttendClass"
          @change="attendClassChange"
        >
          <el-checkbox
            v-for="friend in friends"
            :label="friend"
            :key="friend"
            >{{ friend }}</el-checkbox
          >
        </el-checkbox-group>
        <p>完课情况</p>
        <el-checkbox-group
          v-model="emptyAttendClass"
          @change="attendClassChange"
        >
          <el-checkbox v-for="group in groups" :label="group" :key="group">{{
            group
          }}</el-checkbox>
        </el-checkbox-group>
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
          collapse-tags
          multiple
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="item in worksList"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
        <p>状态</p>
        <el-checkbox-group
          class="check-states-box"
          v-model="emptyWorks"
          @change="worksChange"
        >
          <el-checkbox
            class="check-states"
            v-for="upload in uploads"
            :label="upload"
            :key="upload"
            >{{ upload }}</el-checkbox
          >
        </el-checkbox-group>
        <p>参课情况</p>
        <el-checkbox-group v-model="emptyWorks" @change="worksChange">
          <el-checkbox
            v-for="comment in comments"
            :label="comment"
            :key="comment"
            >{{ comment }}</el-checkbox
          >
        </el-checkbox-group>
        <p>完课情况</p>
        <el-checkbox-group v-model="emptyWorks" @change="worksChange">
          <el-checkbox
            v-for="hearWorks in hearWorkss"
            :label="hearWorks"
            :key="hearWorks"
            >{{ hearWorks }}</el-checkbox
          >
        </el-checkbox-group>
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
    }
  },
  components: {},
  data() {
    return {
      // 点击取消 隐藏弹出框
      attendClassShow: null,
      worksShow: null,
      // 参课多选框的值
      attendClassCheck: [],
      // 作品多选框的值
      worksCheck: [],
      visible: false,
      // 选中的多选框 点击取消 赋值为空
      emptyAttendClass: [],
      emptyWorks: [],
      states: ['已年课', '体验完课'],
      friends: ['已参课', '未参课'],
      groups: ['已完课', '未完课'],
      uploads: ['已上传', '未上传'],
      comments: ['已点评', '未点评'],
      hearWorkss: ['已听点评', '未听点评'],
      attendClassList: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      worksList: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        },
        {
          value: '选项6',
          label: 'WE567'
        },
        {
          value: '选项7',
          label: '567ah'
        }
      ],
      attendClassSelect: '',
      worksSelect: ''
    }
  },
  mounted() {},
  watch: {},
  created() {},
  methods: {
    // 点击 参课完课 过滤
    onAttendClass() {
      const attendClassList = Object.values(this.attendClassCheck)
      const attendClassSelectList = Object.values(this.attendClassSelect)
      console.log(attendClassList, attendClassSelectList, '参课完课数据')
      this.attendClassShow = false
    },
    // 点击 作品及点评 过滤
    onWorks() {
      const worksCheckList = Object.values(this.worksCheck)
      const worksSelectList = Object.values(this.worksSelect)
      console.log(worksCheckList, worksSelectList, '作品及点评数据')
      this.worksShow = false
    },
    // 参课完课 多选框选中的值
    attendClassChange(value) {
      this.attendClassCheck = value
    },
    // 作品 多选框选中的值
    worksChange(value) {
      // const worksLists = []
      // console.log(value)
      // value.forEach((res) => {
      //   console.log(res)
      //   worksLists.push(res)
      // })
      this.worksCheck = value
    },
    // 参课完课 点击清空
    attendClassEmpty() {
      this.attendClassSelect = ''
      this.emptyAttendClass = []
    },
    // 参课完课 点击取消
    attendClassCancel() {
      this.attendClassSelect = ''
      this.emptyAttendClass = []
      this.attendClassShow = false
    },
    // 作品及点评 点击清空
    worksEmpty() {
      this.worksSelect = ''
      this.emptyWorks = []
    },
    // 作品及点评 点击取消
    worksCancel() {
      this.worksSelect = ''
      this.emptyWorks = []
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
