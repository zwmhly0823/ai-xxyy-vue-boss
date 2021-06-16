<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2021-04-27 15:08:33
 -->
<template>
  <div class="third-step">
    <div class="search-container">
      <div class="header-tip">
        <h4>
          <span>{{ courseTypeObj[$route.params.courseType] }}</span>
          <span>排期-设置招生容量</span>
        </h4>
        <div class="btn-group">
          <div class="btn">
            <el-button
              type="primary"
              size="mini"
              class="btn-directed"
              @click="exportExcel('batchSetTeacher')"
            >
              批量配置接生销售
            </el-button>
            <!-- <div class="tip" @click="downLoadDemo('batchSetTeacher')">
              模板下载
            </div> -->
            <div class="tip">
              <a
                href="https://s2.xiaoxiongmeishu.com/1v1Pro/resources/insert.xlsx"
                >模板下载</a
              >
            </div>
          </div>
          <div class="btn">
            <el-button
              type="primary"
              size="mini"
              class="btn-directed"
              @click="exportExcel('batchSetVolume')"
            >
              批量修改接生容量
            </el-button>
            <div class="tip">
              <a
                href="https://s2.xiaoxiongmeishu.com/1v1Pro/resources/update.xlsx"
                >模板下载</a
              >
            </div>
            <!-- <div class="tip" @click="downLoadDemo('batchSetVolume')">
              模板下载
            </div> -->
          </div>
        </div>
      </div>
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
            size="mini"
            @click="centerDialogVisible = true"
            >添加接生销售</el-button
          >
        </div>
      </div>
      <div class="filter-container">
        <table-search
          @change="searchChange"
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
        <el-table-column label="接生微信" min-width="130" align="center">
          <template slot-scope="scope">
            {{ scope.row.weixinNo || '' }}
            <i
              class="el-icon-edit edit-styl"
              @click="editWechat(scope.row, scope.$index)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="市场开关"
          min-width="100"
          align="center"
        >
          <template slot-scope="scope">
            <div class="select-container">
              <el-switch
                v-model="scope.row.marketStatus"
                active-color="#13ce66"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="转介绍开关" min-width="100" align="center">
          <template slot-scope="scope">
            <div class="select-container">
              <el-switch
                v-model="scope.row.conversionStatus"
                active-color="#13ce66"
                :active-value="1"
                :inactive-value="0"
                @change="(val) => coversionCalc(val, scope.row)"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="转介绍超量开关" min-width="110" align="center">
          <template slot-scope="scope">
            <div class="select-container">
              <el-switch
                v-model="scope.row.overshootStatus"
                active-color="#13ce66"
                :active-value="1"
                :inactive-value="0"
                :disabled="scope.row.conversionStatus == 0"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="班级人数" width="120" align="center">
          <template slot-scope="scope">
            <el-input
              :disabled="
                !Boolean(+scope.row.marketStatus) &&
                  !Boolean(+scope.row.conversionStatus)
              "
              class="table_input"
              size="mini"
              v-model="scope.row.teamSize"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="计划招生" min-width="100" align="center">
          <template slot-scope="scope">
            <el-input
              :disabled="
                !Boolean(+scope.row.marketStatus) &&
                  !Boolean(+scope.row.conversionStatus)
              "
              class="table_input"
              size="mini"
              v-model="scope.row.sumTeamSize"
              placeholder="请输入内容"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="课程材料版本" min-width="130" align="center">
          <template slot-scope="scope">
            <div class="select-container">
              <el-select
                :disabled="
                  !Boolean(+scope.row.marketStatus) &&
                    !Boolean(+scope.row.conversionStatus)
                "
                v-model="scope.row.courseVersion"
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
          label="体验课类型"
          min-width="240"
          align="center"
        >
          <template slot-scope="scope">
            <!-- <div v-for="(v, v_index) in scope.row.enroll" :key="v_index"> -->
              <el-select
                multiple
                :disabled="scope.row.marketStatus == 0"
                v-model="scope.row.courseCategory"
                popper-class="courseCategory"
                size="mini"
                placeholder="课程类型"
                clearable
              >
                <el-option
                  v-for="item in trialClass"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            <!-- </div> -->
          </template>
        </el-table-column>
        <el-table-column label="定向渠道" min-width="70" align="center">
          <template slot-scope="scope">
            <div class="look" :a="scope.$index" @click="viewChannel(scope.row)">
              查看
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
        <el-button size="small" type="primary" @click="changeStep(0)">
          上一步
        </el-button>
        <el-button size="small" type="warning" @click="backList"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="changeStep(1)"
          >下一步</el-button
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
      :category="category"
    ></CourseLevalDeploy>
    <upload-excel
      v-if="showUploadExcel"
      :showUploadExcel.sync="showUploadExcel"
      :uploadCategory="uploadCategory"
      :category="category"
    ></upload-excel>
    <!--查看定向渠道-->
    <el-dialog
      title="定向渠道"
      :visible.sync="dialogChannel"
      custom-class="my-dialog-achedule"
      width="40%"
    >
      <div class="dialog-info">
        <ele-table
          :dataList="currentChannel"
          :tableHeight="tableHeight"
          :tableSize="'small'"
          :total="currentChannel.length"
          style="width: 100%;min-width: 100%;"
          class="mytable"
        >
          <el-table-column
            label="渠道ID"
            min-width="100"
            prop="channelId"
          ></el-table-column>
          <el-table-column
            label="定向渠道"
            min-width="100"
            prop="channelName"
          ></el-table-column>
        </ele-table>
      </div>
    </el-dialog>
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
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import EleTable from '@/components/Table/EleTable'
import CourseLevalDeploy from '../../components/CourseLevalDeploy'
import TableSearch from '@/pages/music_app/views/operating/components/tableSearch/index'
import UploadExcel from '@/pages/music_app/views/operating/components/uploadExcel' // 上传excel文件
import { mapGetters } from 'vuex'
import { Sup_scheduleSubmit } from '@/utils/supList'
import { courseTypeObj } from '@/pages/music_app/views/operating/courseType'
import { downLoadBolob } from '@/utils'

export default {
  props: {
    category: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      courseTypeObj,
      uploadCategory: '', // 上传excel文件种类
      courseType: '',
      /** 配置课程难度 */
      centerDialogVisible: false,
      editCourseLevel: null,
      showUploadExcel: false,

      /** 配置课程难度 */
      levelIndex: 0,
      activeTab: '',
      currentRowIndex: -1,
      currentTeacherWenum: '',
      currentTeacherWechatList: [],
      currentEidtRow: {},
      dialogVisible: false,
      // 查看定向渠道弹窗状态
      dialogChannel: false,
      // 当前弹窗展示的定向渠道
      currentChannel: ['niaho', 'asdad'],
      levelList: [
        {
          text: 'M3',
          id: 'S3'
        }
      ],
      tableData: [],
      isValidate: true,
      totalElements: 0,
      flags: {
        loading: true
      },
      productVersion: [],
      trialClass: [],
      // // 28元体验课-体验课类型
      // trialClass28: [{ name: '单周体验课', value: '19' }],
      tabQuery: {
        size: 20,
        pageNum: 1
      },
      // 总页数
      tableHeight: 'auto',
      totalPages: 1,
      params: {
        courseDifficulty: 'S3',
        departmentIds: '',
        teacherWechatIds: '',
        // levels: '',
        ids: [],
        courseVersion: ''
      }
    }
  },
  computed: {
    ...mapGetters(['schedulePeriod'])
  },
  components: {
    EleTable,
    CourseLevalDeploy,
    TableSearch,
    UploadExcel
  },
  watch: {},
  async created() {
    const { courseType = '0' } = this.$route.params

    this.courseType = courseType
    this.initData()
    Object.assign(this.params, {
      courseType:Sup_scheduleSubmit[courseType],
      period: this.schedulePeriod
    })

    await this.getCourseVersion()
    this.getVolumeList()
  },
  methods: {
    async initData() {
      let result = await this.$http.Operating.getAllCategory()
      if (result.code == 0) {
        if (this.courseType == '0') {
          this.trialClass = result.payload.singleWeek
        } else if (this.courseType == '1') {
          this.trialClass = result.payload.doubleWeek
        } else if (this.courseType == '2') {
          this.trialClass = result.payload.systemWeek
        }
      }
    },
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
    dialogOperate(args) {
      const { close = true, payload = [] } = args

      if (!payload.length) {
        this.warningMessage('暂无可配置数据')
      }

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

        this.getVolumeList()
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
      const { getTeacherAllWechatByDept } = this.$http.Operating
      const { payload = [] } = await getTeacherAllWechatByDept(params)

      this.currentTeacherWechatList = payload
    },
    /** 编辑微信模态框保存按钮 */
    saveEditHandle() {
      const { courseType = 0 } = this.$route.params
      const {
        currentTeacherWechatList: crtWc,
        currentTeacherWenum: weixinId,
        schedulePeriod: period,
        currentEidtRow: { weixinId: oldWeixinId, weixinNo, teacherId } = {}
      } = this

      if (!weixinId) return this.$message.warning('请选择微信号')

      const params = {
        oldWeixinId,
        weixinId,
        weixinNo: '',
        oldWeixinNo: weixinNo,
        teacherId,
        courseType: Sup_scheduleSubmit[courseType],
        period,
        category: ''
      }

      /** 单周28元体验课 新增 category参数 courseType 为2 */
      // if (this.courseType === '6') {
      //   params.category = this.category
      //   params.courseType = 2
      // }
      /** 单周28元体验课 新增 category参数 courseType 为2 */

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
      const { saveTrialVolumeTeacherWeChat } = this.$http.Operating
      saveTrialVolumeTeacherWeChat(params).then((res) => {
        const {
          payload: { wechatId = '', wechatNo = '' }
        } = res

        this.tableData[this.currentRowIndex].weixinNo = wechatNo
        this.tableData[this.currentRowIndex].weixinId = wechatId

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
        // level = [],
        teacherWechatIds = '',
        version = '',
        courseType = ''
      } = search
      this.tabQuery.pageNum = 1
      Object.assign(this.params, {
        departmentIds: department.join(), // 销售部
        ids: groupSell ? [groupSell] : [], // 社群销售
        // levels: level.join(), // 销售等级
        teacherWechatIds, // 微信号搜索
        courseVersion: version, // 随材版本
        courseType: Sup_scheduleSubmit[this.$route.params.courseType] // 课程类型
      })

      this.getVolumeList()
    },
    // 包装列表接口返回的数据
    packageVolumeList(payload = []) {
      payload.forEach((item) => {
        // 如果enroll为空，手动添加
        const { courseCategory } = item
        Object.assign(item, {
          courseDifficulty: this.params.courseDifficulty,
          courseCategory: courseCategory ? courseCategory.split(',') : []
        })
      })
    },
    // 根据老师ids获取招生排期设置中老师配置信息
    async getVolumeList() {
      this.flags.loading = true
      Object.assign(this.params, this.tabQuery)
      /** 单周28元体验课 新增 category参数 courseType 为2 */
      // if (this.courseType === '6') {
      //   this.params.category = this.category
      //   this.params.courseType = 2
      // }
      /** 单周28元体验课 新增 category参数 courseType 为2 */
      try {
        const { payload = {} } = await this.$http.Operating.trialSetVolumeList(
          this.params
        )
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
        const _res = await this.$http.Operating.saveTrialVolumeRow(params)
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
      this.getVolumeList()
    },
    // validate
    validateTableForm(row) {
      this.isValidate = true

      if (row.marketStatus) {
        if (!row.teamSize) {
          this.warningMessage('请输入班级人数')
          this.isValidate = false
        } else if (!row.sumTeamSize) {
          this.warningMessage('请输入计划招生人数')
          this.isValidate = false
        }
      }
    },
    // 单行保存body中需要的数据
    packageSavaData(row) {
      const reqBody = cloneDeep(row)
      const {
        conversionStatus,
        marketStatus,
        overshootStatus,
        courseCategory
      } = reqBody
      const STATUS_CH = (status) => {
        if (!+status) return 'CLOSE'
        else return 'OPEN'
      }
      return Object.assign(reqBody, {
        conversionStatus: STATUS_CH(conversionStatus),
        marketStatus: STATUS_CH(marketStatus),
        overshootStatus: STATUS_CH(overshootStatus),
        courseCategory: courseCategory.join()
      })
    },
    // 某一行单独保存
    async saveRow(index, row) {
      const { courseType = 0 } = this.$route.params
      let submitCourseType = Sup_scheduleSubmit[courseType]
      this.validateTableForm(row)

      if (this.isValidate) {
        const params = {
          period: this.schedulePeriod,
          body: this.packageSavaData(row),
          courseType:submitCourseType
        }
        /** 单周28元体验课 新增 category参数 courseType 为2 */
        // if (this.courseType === '6') {
        //   params.category = this.category
        //   params.courseType = 2
        // }
        /** 单周28元体验课 新增 category参数 courseType 为2 */
        await this.saveScheduleConfig(params)
      }
    },
    backList() {
      this.$store.commit('setSchedulePeriod', '')
      this.$router.push({ path: '/operatingSchedule' })
    },
    changeStep(type) {
      this.$emit('listenStepStatus', type)
    },
    /** 系统课导入数据 */
    exportExcel(type) {
      this.uploadCategory = type
      this.showUploadExcel = true
    },
    /**
     * 下载模板 TODO:
     */
    downLoadDemo(type) {
      if (type === 'batchSetTeacher') {
      } else if (type === 'batchSetVolume') {
      } else {
        downLoadBolob()
      }
    },

    warningMessage(message) {
      this.$message({ message, type: 'warning' })
    },

    // 转介绍切换 （关闭后 转介绍超量也会跟随关闭）
    coversionCalc(val, row) {
      if (Number(val) === 0) {
        row.overshootStatus = 0
      }
    },

    // 查看渠道
    viewChannel(row) {
      if (row.directEnrollConfigList && row.directEnrollConfigList.length) {
        this.dialogChannel = true
        this.currentChannel = row.directEnrollConfigList
        return
      }
      this.$message.error('还没有渠道哦~')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-container {
  .header-tip {
    display: flex;
    justify-content: space-between;
    .btn-group {
      display: flex;
      align-items: center;
      .btn {
        display: flex;
        align-items: flex-end;
        margin-right: 30px;
        .tip {
          color: #2a75ed;
          text-decoration: underline;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
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
