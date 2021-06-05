<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2021-03-29 21:15:34
 -->
<template>
  <div class="third-step">
    <div class="search-container">
      <h4>
        <!-- <span v-if="$route.params.courseType == 0">体验课</span
        ><span v-else>系统课</span> -->
        <span>{{ courseTypeObj[$route.params.courseType] }}</span>
        <span>排期-设置招生容量</span>
      </h4>
      <div class="tabs">
        <div class="tab-container">
          <div
            class="tab"
            v-for="(tab, index) in levelList"
            :key="index"
            :class="{ active: index == levelIndex }"
            @click="levelClickHandle(tab, index)"
          >
            {{ tab.text }}
          </div>
          <div class="tip">tip：切换前请先保存当前级别下更改的内容哟~</div>
        </div>
        <div class="btn">
          <el-button
            type="primary"
            size="small"
            class="btn-directed"
            @click="exportExcel"
            v-if="$route.params.courseType != '0'"
          >
            导入数据
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="centerDialogVisible = true"
            >添加接生销售</el-button
          >
        </div>
      </div>
      <div class="filter-container">
        <table-search
          @change="searchChange"
          :showSysCourseType="true"
          :isShowWxSearch="true"
          :moreVersion="true"
        ></table-search>
      </div>
    </div>
    <div class="step-container step-three-container" ref="tableContainer">
      <ele-table
        :dataList="tableData"
        :tableHeight="tableHeight"
        :loading="flags.loading"
        :tableSize="'small'"
        :size="tabQuery.size"
        :page="tabQuery.pageNum"
        :total="totalElements"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column type="index" label="序号" width="70" align="center">
        </el-table-column>
        <el-table-column
          prop="teacherRealName"
          label="真实姓名"
          min-width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="所属部门"
          min-width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="teacherWechatNo"
          label="绑定微信"
          min-width="130"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.teacherWechatNo || '' }}
            <i
              class="el-icon-edit edit-styl"
              @click="editWechat(scope.row, scope.$index)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="打开开关"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div
              v-for="(swicth, s_index) in scope.row.enroll"
              :key="s_index"
              class="select-container"
            >
              <el-switch
                v-model="swicth.status"
                active-color="#13ce66"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="班级人数" width="120" align="center">
          <template slot-scope="scope">
            <div v-for="(t, t_index) in scope.row.enroll" :key="t_index">
              <el-input
                :disabled="!Boolean(+t.status)"
                class="table_input"
                size="mini"
                v-model="t.teamSize"
                placeholder="请输入内容"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="计划招生"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div v-for="(p, t_index) in scope.row.enroll" :key="t_index">
              <el-input
                :disabled="!Boolean(+p.status)"
                class="table_input"
                size="mini"
                v-model="p.sumTeamSize"
                placeholder="请输入内容"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="课程材料版本"
          min-width="130"
          align="center"
        >
          <template slot-scope="scope">
            <div
              v-for="(v, v_index) in scope.row.enroll"
              :key="v_index"
              class="select-container"
            >
              <el-select
                :disabled="!Boolean(+v.status)"
                v-model="v.courseVersion"
                size="mini"
                placeholder="随材版本"
              >
                <el-option
                  v-for="(item, i) in productVersion"
                  :key="i"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="系统课类型"
          min-width="240"
          align="center"
        >
          <template slot-scope="scope">
            <div v-for="(v, v_index) in scope.row.enroll" :key="v_index">
              <!-- 此处不适合该组件、回调多次接口，影响性能 TODO: -->
              <!-- <course-list
                :courseType="1"
                :canMultiple="true"
                :tip="'系统课类型'"
                :vModal="v"
                @courseTypeChanged="courseTypeHandle"
              ></course-list> -->
              <el-select
                multiple
                :disabled="!Boolean(+v.status)"
                v-model="v.courseCategory"
                popper-class="courseCategory"
                size="mini"
                placeholder="课程类型"
                clearable
                collapse-tags
              >
                <el-option
                  v-for="item in courseList"
                  :key="item.category"
                  :label="item.labelName"
                  :value="String(item.category)"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="" min-width="77" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="saveRow(scope.$index, scope.row)"
            >
              保存
            </el-button>
          </template>
        </el-table-column>
      </ele-table>

      <!-- 取消、下一步 -->
      <div class="operate-btn" :class="{ 'is-many': totalPages > 1 }">
        <el-button size="small" type="warning" @click="backList"
          >取 消</el-button
        >
      </div>
    </div>
    <!-- 课程级别配置模态框 -->
    <CourseLevalDeploy
      :centerDialogVisible="centerDialogVisible"
      @dialogOperate="dialogOperate"
      :editCourseLevel="editCourseLevel"
      :activeTab="levelList[levelIndex]"
      v-if="centerDialogVisible"
    ></CourseLevalDeploy>
    <!-- 编辑微信号模态框 -->
    <el-dialog
      title="选择微信号"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="dialogHandleClose"
      custom-class="my-dialog-achedule"
      :close-on-click-modal="false"
    >
      <div class="dialog-info">
        <div class="row-cell">
          <div>
            <span class="label">销售姓名：</span
            ><span>{{ currentEidtRow.teacherRealName }}</span>
          </div>
        </div>
        <div class="row-cell">
          <div>
            <span class="label">所属部门：</span
            ><span>{{ currentEidtRow.departmentName }}</span>
          </div>
        </div>
        <div class="row-cell">
          <div>
            <span class="label">选择微信号：</span>
            <el-select
              v-model="currentTeacherWenum"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in currentTeacherWechatList"
                :key="item.weixinId"
                :label="item.weixinNo"
                :value="item.weixinId"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogHandleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveEditHandle"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 系统课导入数据模态框 -->
    <el-dialog
      title="导入数据"
      :visible.sync="showSysImport"
      :before-close="handleCloseUpdata"
      width="30%"
    >
      <el-upload
        ref="upload"
        action=""
        accept=".xls, .xlsx"
        :headers="headers"
        :auto-upload="false"
        :limit="1"
        :http-request="uploadFile"
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
          :disabled="uploading"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
          :disabled="uploading"
          >上传到服务器</el-button
        >
        <!-- :loading="uploading" -->
        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import EleTable from '@/components/Table/EleTable'
import CourseLevalDeploy from '../../components/CourseLevalDeploy'
import TableSearch from '@/pages/music_app/views/operating/components/tableSearch/index'
// import CourseList from '@/pages/music_app/views/operating/components/courseType'
import { mapGetters } from 'vuex'
import {
  SUP_LEVEL_LIST_UPPER,
  SUP_LEVEL_UPPER
} from '@/utils/supList'

import { courseTypeObj } from '@/pages/music_app/views/operating/courseType'

export default {
  props: ['stepStatus'],
  data() {
    return {
      courseTypeObj,
      courseType: '',
      /** 配置课程难度 */
      centerDialogVisible: false,
      editCourseLevel: null,
      showSysImport: false,
      uploading: false,
      headers: { 'Content-Type': 'multipart/form-data' },
      /** 配置课程难度 */
      levelIndex: 0,
      activeTab: '',
      currentRowIndex: -1,
      currentTeacherWenum: '',
      currentTeacherWechatList: [],
      currentEidtRow: {},
      dialogVisible: false,
      levelList: [
        {
          text: 'S1进阶',
          id: 'S1'
        },
        {
          text: 'S2基础',
          id: 'S2'
        },
        {
          text: 'S3',
          id: 'S3'
        }
      ],
      levelObj: {
        S1: 'S1进阶',
        S2: 'S2基础',
        S3: 'S3'
      },
      tableData: [],
      isValidate: true,
      totalElements: 0,
      flags: {
        loading: true
      },
      productVersion: [],
      trialClass: [
        { name: '单周体验课', value: '3' },
        { name: '双周体验课', value: '0' },
        { name: '年系统课', value: '2' },
        { name: '半年系统课', value: '4' },
        { name: '两年系统课', value: '9' }
      ],
      // 9.9元体验课-体验课类型
      trialClass2: [{ name: '单周体验课', value: '11' }],
      tabQuery: {
        size: 20,
        pageNum: 1
      },
      // 总页数
      tableHeight: 'auto',
      totalPages: 1,
      params: {
        courseDifficulty: 'S1',
        departmentIds: '',
        teacherWechatIds: '',
        levels: '',
        ids: [],
        courseVersion: '',
        category: ''
      },
      courseList: []
    }
  },
  computed: {
    ...mapGetters(['schedulePeriod']),
    trialClassList() {
      const { courseType, trialClass, trialClass2 } = this

      return courseType === '3' ? trialClass2 : trialClass
    }
  },
  components: {
    EleTable,
    CourseLevalDeploy,
    TableSearch
    // CourseList
  },
  watch: {},
  async created() {
    const { courseType = '0' } = this.$route.params // courseType = '0' 体验课
    // 根据老师ids获取招生排期设置中老师配置信息 TODO:

    if (courseType !== '0') {
      this.params.courseDifficulty = courseType === '1' ? 'S4' : 'S1'
      if (courseType === '1') {
        this.levelList = SUP_LEVEL_LIST_UPPER
        this.levelObj = SUP_LEVEL_UPPER
      }
    }

    this.courseType = courseType

    Object.assign(this.params, {
      courseType,
      period: this.schedulePeriod
    })
    this.getCourseType()
    this.getTeacherConfigList()
    await this.getCourseVersion()
  },
  mounted() {
    // this.calcTableHeight()
  },
  methods: {
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    },
    getCourseType() {
      const { getCourseListByCourseType } = this.$http.Operating
      const { courseType } = this

      getCourseListByCourseType({ courseType }).then((res) => {
        const { code, payload } = res
        if (code === 0) this.courseList = this.packageCourseList(payload)
      })
    },
    packageCourseList(list = []) {
      return list.map((item) => {
        const { area, name } = item
        item.labelName = area ? `${area}-${name}` : name

        return item
      })
    },
    courseTypeHandle(res) {
    },
    dialogOperate(args) {
      const { close = true, payload = [] } = args
      this.packageVolumeList(payload)

      this.tableData = this.tableData.concat(payload)

      this.centerDialogVisible = !close
      this.editCourseLevel = null
    },
    // 顶部tabs点击事件
    levelClickHandle(tab, index) {
      const callback = () => {
        this.activeTab = tab.text
        this.levelIndex = index

        Object.assign(this.params, {
          courseDifficulty: tab.id
        })

        this.getTeacherConfigList()
      }
      index !== this.levelIndex && callback()
    },
    /** 点击编辑微信 按钮 */
    editWechat(row, curIndex) {
      const { departmentId, teacherId } = row
      this.dialogVisible = true
      this.currentEidtRow = row
      this.currentRowIndex = curIndex
      this.getTeacherAllWechatByDept({
        departmentId,
        teacherId
      })
    },
    /** 根据老师id和部门id查询老师关联微信号 */
    async getTeacherAllWechatByDept(params) {
      const teacherList = await this.$http.Operating.getTeacherAllWechatByDept(
        params
      )
      const { payload = [] } = teacherList
      this.currentTeacherWechatList = payload
    },
    /** 编辑微信模态框保存按钮 */
    saveEditHandle() {
      const { courseType = 0 } = this.$route.params
      const {
        currentTeacherWechatList: crtWc,
        currentTeacherWenum: weixinId,
        schedulePeriod: period,
        currentEidtRow: {
          teacherWechatId: oldWeixinId,
          teacherWechatNo,
          teacherId
        } = {}
      } = this

      if (!weixinId) {
        this.$message.warning('请选择微信号')
        return
      }
      const params = {
        oldWeixinId,
        weixinId,
        weixinNo: '',
        oldWeixinNo: teacherWechatNo,
        teacherId,
        courseType,
        period
      }

      for (let i = 0; i < crtWc.length; i++) {
        if (weixinId === crtWc[i].weixinId) {
          params.weixinNo = crtWc[i].weixinNo
          break
        }
      }
      weixinId && this.saveEditTeacherWeChat(params)
    },
    /** 保存更改的老师微信号 */
    saveEditTeacherWeChat(params) {
      this.$http.Operating.saveEditTeacherWeChat(params).then((res) => {
        const {
          payload: { wechatId = '', wechatNo = '' }
        } = res

        this.tableData[this.currentRowIndex].teacherWechatNo = wechatNo
        this.tableData[this.currentRowIndex].teacherWechatId = wechatId

        this.$message({
          type: 'success',
          message: '更改成功',
          duration: 1000,
          onClose: this.dialogHandleClose
        })
      })
    },
    dialogHandleClose() {
      this.currentTeacherWenum = ''
      this.dialogVisible = false
      this.currentRowIndex = -1
    },
    // 搜索emit数据
    searchChange(search) {
      const {
        department = [],
        groupSell = '',
        level = [],
        teacherWechatIds = '',
        version = '',
        courseType = '',
        category = ''
      } = search
      this.tabQuery.pageNum = 1
      Object.assign(this.params, {
        departmentIds: department.join(), // 销售部
        ids: groupSell ? [groupSell] : [], // 社群销售
        levels: level.join(), // 销售等级
        teacherWechatIds, // 微信号搜索
        courseVersion: version, // 随材版本
        courseType: courseType || this.$route.params.courseType, // 当前页面的 课程类型
        category // 过滤条件下的 课程类型
      })
      this.getTeacherConfigList()
    },
    // 包装列表接口返回的数据
    packageVolumeList(payload = []) {
      payload.forEach((item) => {
        const enroll = item.enroll || []
        // 如果enroll为空，手动添加
        if (!enroll.length) {
          enroll.push({
            courseDifficulty: this.params.courseDifficulty,
            status: 0,
            teamSize: '',
            sumTeamSize: '',
            courseVersion: '',
            // 9.9元体验课默认选中-id为11的单周体验课
            courseCategory: this.courseType === '3' ? ['11'] : []
          })
        } else {
          enroll.forEach((item) => {
            item.courseCategory = item.courseCategory
              ? item.courseCategory.split(',')
              : []
          })
        }

        item.enroll = enroll
      })
    },
    // 根据老师ids获取招生排期设置中老师配置信息
    async getTeacherConfigList() {
      this.flags.loading = true
      Object.assign(this.params, this.tabQuery)
      try {
        const {
          payload = {}
        } = await this.$http.Operating.getScheduleVolumeListSys(this.params)
        const { content = [], totalElements, totalPages } = payload

        this.totalElements = +totalElements || 0
        this.totalPages = totalPages

        this.packageVolumeList(content)

        this.tableData = content
      } catch (err) {
        this.$message({
          message: '获取列表出错',
          type: 'warning'
        })
      }
      this.flags.loading = false
    },
    // 获取随材版本
    async getCourseVersion() {
      try {
        const { payload = [] } = await this.$http.Operating.getCourseVersion({
          type: 'courseVersion'
        })
        this.productVersion = payload
      } catch (err) {
        this.warningMessage('获取随材版本出错')
      }
    },
    //  保存 招生排期 设置
    async saveScheduleConfig(params, cb) {
      const loadingInstance = this.$loading({
        target: '.app-main',
        lock: true,
        text: '正在保存...',
        fullscreen: true
      })

      try {
        const _res = await this.$http.Operating.saveScheduleConfig(params)
        if (_res.code === 0) {
          this.$message.success('保存成功')
          cb && cb()
        }
      } catch (err) {
        this.warningMessage('获取列表出错')
      } finally {
        loadingInstance.close()
      }
    },
    // 翻页emit
    pageChange_handler(page) {
      this.tabQuery.pageNum = page
      this.getTeacherConfigList()
    },
    // validate
    validateTableForm(data) {
      this.isValidate = true

      for (var i = 0; i < data.length; i++) {
        const { enroll = [] } = data[i]
        for (var j = 0; j < enroll.length; j++) {
          enroll[j].courseCategory = enroll[j].courseCategory
            ? enroll[j].courseCategory.join()
            : ''

          if (enroll[j].status) {
            if (!enroll[j].teamSize) {
              this.warningMessage('请输入班级人数')
              this.isValidate = false
              return
            } else if (!enroll[j].sumTeamSize) {
              this.warningMessage('请输入计划招生人数')
              this.isValidate = false
              return
            } else if (!enroll[j].courseVersion) {
              this.warningMessage('随材版本为必选项')
              this.isValidate = false
              return
            } else if (!enroll[j].courseCategory) {
              this.warningMessage('课程类型为必选项')
              this.isValidate = false
              return
            }
          }
        }
      }
    },
    // 某一行单独保存
    async saveRow(index, row) {
      const { courseType = 0 } = this.$route.params
      const data = _.cloneDeep(this.tableData)
      const tableData = [data[index]]
      this.validateTableForm(tableData)
      if (this.isValidate) {
        const params = {
          courseType,
          period: this.schedulePeriod,
          body: tableData
        }
        await this.saveScheduleConfig(params)
      }
    },
    backList() {
      this.$store.commit('setSchedulePeriod', '')
      this.$store.commit('setScheduleTeacher', [])
      this.$router.push({ path: '/operatingSchedule' })
    },
    /** 系统课导入数据 */
    exportExcel() {
      this.showSysImport = true
    },
    /** 导入数据 关闭事件 */
    handleCloseUpdata() {
      this.showSysImport = false
      this.$refs.upload.clearFiles()
    },
    /** 导入数据上传 */
    uploadFile(params) {
      const { courseType = 1 } = this.$route.params
      const formdata = new FormData()
      const { file } = params
      formdata.append('file', file)

      this.uploading = true
      Object.assign(formdata, { courseType })

      this.$http.DownloadExcel.updateScheduleExcel(formdata)
        .then((res) => {
          if (res && Object.prototype.toString.call(res) === '[object Blob]') {
            this.$refs.upload.clearFiles()
            this.showSysImport = false
            this.downloadFn(res, file.name, () => {
              // this.$emit('setExcelStatus', 'complete')
              this.$message.success('上传成功！')
            })
          } else {
            this.$message.error(`上传失败，${res.errors || '请检测文件！'}`)
          }
        })
        .catch((err) => {
        })
        .finally(() => {
          this.uploading = false
        })
    },
    // 下载文件
    downloadFn(data, fileName = '下载', cb) {
      if (!data) return
      const blob = new Blob([data])
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)

      cb && cb()
    },
    submitUpload(file, filelist) {
      this.$refs.upload.submit()
    },
    warningMessage(message) {
      this.$message({
        message,
        type: 'warning'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-container {
  .tabs {
    display: flex;
    height: 35px;
    align-items: center;
    background: #f5f7fa;
    .tab-container {
      flex: 1;
      display: flex;
      height: 100%;
      align-items: center;
      .tab {
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        cursor: pointer;
        &.active {
          background: #fff;
          color: #2a75ed;
        }
      }
    }
    .btn {
      min-width: 120px;
      display: flex;
    }
  }
  .filter-container {
    margin-top: 10px;
  }
  .tip {
    font-size: 12px;
    font-family: monospace;
    color: #666;
  }
  .table-search {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
}
.my-dialog-achedule {
  .dialog-info {
    .row-cell {
      height: 35px;
      display: flex;
      align-items: center;
      .label {
        font-weight: 500;
        color: #333;
        margin-right: 20px;
        width: 90px;
        display: inline-block;
      }
    }
  }
}
.mytable {
  .edit-styl {
    font-size: 16px;
    color: green;
    cursor: pointer;
    :hover {
      color: #2a75ed;
    }
  }
}
.step-three-container {
  // display: flex;
  // align-items: center;
  // flex-direction: column;
  .select-container {
    margin-bottom: 5px;
    .courseCategory {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }
  .table_input {
    margin-bottom: 5px;
    width: 80px;
  }
  .operate-btn {
    display: flex;
    justify-content: center;
    margin: 20px 0 10px 0;
    &.is-many {
      margin: 0;
      position: absolute;
      bottom: 20px;
      left: 40%;
    }
  }
}
</style>
