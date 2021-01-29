<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-24 15:38:26
 -->
<template>
  <div class="third-step">
    <div class="search-container">
      <div class="tabs">
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
      <!-- 随材版本和课程类型先不做 -->
      <!-- <div class="table-search">
        <table-search
          @change="searchChange"
          :isShowLevel="true"
          :isShowWxSearch="true"
        ></table-search>
      </div> -->
    </div>
    <div class="step-container step-three-container">
      <ele-table
        :dataList="tableData"
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
          prop="levelName"
          label="销售等级"
          min-width="120"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.levelName || '' }}
          </template>
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
          prop="lastPeriod"
          label="最近接生期数"
          min-width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="招生级别"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <div v-for="(leve, l_index) in scope.row.enroll" :key="l_index">
              {{ levelObj[leve.courseDifficulty] }}
            </div>
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
          label="体验课类型"
          min-width="240"
          align="center"
        >
          <template slot-scope="scope">
            <div v-for="(v, v_index) in scope.row.enroll" :key="v_index">
              <el-select
                multiple
                :disabled="!Boolean(+v.status)"
                v-model="v.courseCategory"
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
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="" min-width="70" align="center">
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
      <div class="operate-btn">
        <el-button size="small" type="warning" @click="backList"
          >取消</el-button
        >
        <!-- <el-button size="small" type="primary" @click="stepOpt(1)"
          >提交保存</el-button
        > -->
      </div>
    </div>
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
  </div>
</template>
<script>
import _ from 'lodash'
import EleTable from '@/components/Table/EleTable'
// import TableSearch from '../../../components/tableSearch/index'
import { mapGetters } from 'vuex'
import { SUP_LEVEL_LIST_UPPER, SUP_LEVEL_UPPER } from '@/utils/supList'
export default {
  props: ['stepStatus'],
  data() {
    return {
      levelIndex: 0,
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
      productVersion: [
        { name: 'V1.4', value: 'V1.4' },
        { name: 'V1.5', value: 'V1.5' },
        { name: 'V1.6', value: 'V1.6' },
        { name: 'V1.7', value: 'V1.7' },
        { name: 'V1.8', value: 'V1.8' },
        { name: 'V1.9', value: 'V1.9' },
        { name: 'V2.0', value: 'V2.0' }
      ],
      trialClass: [
        { name: '单周体验课', value: '3' },
        { name: '双周体验课', value: '0' },
        { name: '年系统课', value: '2' },
        { name: '半年系统课', value: '4' }
      ],
      tabQuery: {
        size: 2,
        pageNum: 1
      },
      params: {
        courseDifficulty: 'S1',
        departmentIds: '',
        teacherWechatIds: '',
        levels: ''
      }
    }
  },
  computed: {
    ...mapGetters(['scheduleTeacherId', 'schedulePeriod'])
  },
  components: {
    EleTable
    // TableSearch
  },
  watch: {},
  async created() {
    console.log(this.$route.params)
    const { courseType = '0' } = this.$route.params // courseType = '0' 体验课
    // 根据老师ids获取招生排期设置中老师配置信息 TODO:

    if (courseType !== '0') {
      this.levelList = SUP_LEVEL_LIST_UPPER
      this.params.courseDifficulty = 'S4'
      this.levelObj = SUP_LEVEL_UPPER
    }
    Object.assign(this.params, {
      courseType,
      period: this.schedulePeriod,
      ids: this.scheduleTeacherId
    })
    await this.getCourseVersion()
    this.scheduleTeacherId.length && this.getTeacherConfigList()
  },
  methods: {
    // 顶部tabs点击事件
    levelClickHandle(tab, index) {
      const callback = () => {
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
        teacherWechatIds = ''
      } = search
      Object.assign(this.params, {
        departmentIds: department.join(),
        teacherWechatIds,
        levels: level.join(),
        ids: groupSell ? [groupSell] : this.scheduleTeacherId
      })
      this.getTeacherConfigList()
    },
    // 根据老师ids获取招生排期设置中老师配置信息
    async getTeacherConfigList() {
      this.flags.loading = true
      try {
        const teacherList = await this.$http.Operating.getTeacherConfigList(
          this.params
        )
        const { payload = [] } = teacherList

        payload.forEach((item) => {
          const { enroll = [] } = item
          // 如果enroll为空，手动添加
          if (!enroll.length) {
            enroll.push({
              courseDifficulty: this.params.courseDifficulty,
              status: 0,
              teamSize: '',
              sumTeamSize: '',
              courseVersion: '',
              courseCategory: []
            })
            // }
          } else {
            enroll.forEach((item) => {
              item.courseCategory = item.courseCategory
                ? item.courseCategory.split(',')
                : []
            })
          }
        })

        this.tableData = payload
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
        this.$message({
          message: '获取随材版本出错',
          type: 'warning'
        })
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
        this.$message({
          message: '获取列表出错',
          type: 'warning'
        })
      } finally {
        loadingInstance.close()
      }
    },
    // 翻页emit
    pageChange_handler() {},
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
      // console.log(this.tableData, index, row)
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
    // 上一步，下一步
    async stepOpt(type, cb) {
      const { courseType = 0 } = this.$route.params
      const tableData = _.cloneDeep(this.tableData)
      this.validateTableForm(tableData)
      if (this.isValidate) {
        const params = {
          courseType,
          period: this.schedulePeriod,
          body: tableData
        }
        const callback = () => {
          this.$emit('listenStepStatus', type)
        }
        await this.saveScheduleConfig(params, cb || callback)
      }
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
    margin: 40px 0 10px 0;
  }
}
</style>
