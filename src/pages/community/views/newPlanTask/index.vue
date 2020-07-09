<!--
 * @Descripttion: BOSS小熊
 * @version: 1.0.0
 * @Author: Shasen
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: shasen
 * @LastEditTime: 2020-07-06 11:41:19
-->
<template>
  <el-row type="flex" class="new-plan app-main">
    <el-col class="new-plan-container">
      <el-card class="header">
        <div class="tip" v-if="id">修改SOP任务计划</div>
        <div class="tip" v-else>新建SOP任务计划</div>
        <el-form
          :model="sopFrom"
          ref="sopFrom"
          label-width="100px"
          size="mini"
          class="sop-form"
          :rules="rules"
        >
          <el-form-item prop="taskName" label="模板名称" style="width:320px;">
            <el-input
              v-model="sopFrom.taskName"
              placeholder="请输入任务名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="planTemplate"
            label="计划模板"
            style="width:320px;"
          >
            <el-select
              class="item-style"
              v-model="sopFrom.planTemplate"
              remote
              :reserve-keyword="true"
              size="mini"
              clearable
              placeholder="选择模板"
            >
              <el-option
                v-for="item in planTemplate || []"
                :key="item.id"
                :label="item.templateName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务开始日期" prop="planStartDate">
            <el-date-picker
              v-model="sopFrom.planStartDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="发送微信号" prop="wxNumber">
            <el-radio-group v-model="sopFrom.wxNumber">
              <el-radio
                v-for="(item, index) in wechatNos"
                :key="index"
                :label="item"
                >{{ item }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="chooseGroup('sopFrom')"
          >选择群</el-button
        >
      </el-card>
      <div ref="tableContainer">
        <ele-table
          :tableSize="'small'"
          :dataList="tableData"
          :tableHeight="tableHeight"
        >
          <el-table-column
            label="群名称"
            prop="cluster_name"
            align="center"
          ></el-table-column>
          <el-table-column
            label="群人数"
            prop="membersNum"
            align="center"
          ></el-table-column>
          <el-table-column label="带班销售" align="center">
            {{ this.teacherName }}</el-table-column
          >
          <el-table-column
            label="微信群工作微信号"
            prop="owner_wechat_id"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="editStyle">
                <el-popconfirm
                  confirmButtonText="YES"
                  cancelButtonText="算了"
                  icon="el-icon-info"
                  iconColor="red"
                  title="你确定要删除该项内容吗？"
                  @onConfirm="confirmDelRow(scope.row)"
                >
                  <span @click="deleteTablerow(scope.row, '1')" slot="reference"
                    >删除</span
                  >
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </ele-table>
      </div>
      <div class="bottom_choose" v-show="tableData.length">
        <el-button size="mini" @click="cannelOpt">取消</el-button>
        <el-button size="mini" type="primary" @click="saveTaskPlan"
          >确认</el-button
        >
      </div>
      <el-dialog
        title="选择群"
        :visible.sync="dialogGroupVisible"
        width="50%"
        destroy-on-close
      >
        <choose-group
          :taskstatus="teacherId"
          :wechatNo="sopFrom.wxNumber"
          :parent_tableData="tableData"
          @choose-group="parent_chooseGroup"
          @close-choosegroup="parent_close"
        ></choose-group>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import { isToss } from '@/utils/index'
import EleTable from '@/components/Table/EleTable'
import ChooseGroup from './components/chooseGroup'
export default {
  data() {
    return {
      id: '',
      tableHeight: 'auto',
      dialogGroupVisible: false,
      clusterIdList: [],
      teacherName: '',
      teacherId: '',
      taskPlan: {},
      planTemplate: [],
      wechatNos: [],
      tableData: [],
      sopFrom: {
        taskName: '',
        planTemplate: '',
        planStartDate: '',
        wxNumber: ''
      },
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        planTemplate: [
          { required: true, message: '请选择计划模板', trigger: 'change' }
        ],
        planStartDate: [
          {
            type: 'string',
            required: true,
            message: '请选择任务开始日期',
            trigger: 'change'
          }
        ],
        wxNumber: [
          { required: true, message: '请选择发送微信号', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    EleTable,
    ChooseGroup
  },
  async created() {
    const teacher = isToss()
    if (teacher) {
      const tossteacher = JSON.parse(localStorage.getItem('teacher'))
      this.teacherId = tossteacher.id || ''
      this.teacherName = tossteacher.realName || ''
    } else {
      const staff = JSON.parse(localStorage.getItem('staff'))
      this.teacherId = staff.id || ''
      this.teacherName = staff.realName || ''
    }
    if (this.$route.params.id === '-1') {
      this.id = ''
    } else {
      this.id = this.$route.params.id
    }
    this.taskPlan = await this.getToSaveOrUpdate(this.id, this.teacherId)
    if (this.taskPlan) {
      this.planTemplate = this.taskPlan.payload.templateList || []
      this.wechatNos = this.taskPlan.payload.wechatNos || []
    }

    if (this.id) {
      this.sopFrom.taskName = this.taskPlan.payload.taskName
      this.sopFrom.planTemplate = this.taskPlan.payload.templateId
      this.sopFrom.planStartDate = this.taskPlan.payload.job_time
      this.sopFrom.wxNumber = this.taskPlan.payload.wechatNo
      this.tableData = this.taskPlan.payload.weChatIcodeClusterLists
    }
    console.log(this.id, this.teacherId, this.taskPlan)
    this.calcTableHeight()
  },
  mounted() {},
  computed: {},
  methods: {
    deleteTablerow(row, type) {
      console.log(row, type)
    },
    // 获取SOP任务计划
    async getToSaveOrUpdate(id, teacherId) {
      try {
        const tmpInfo = await this.$http.Community.getToSaveOrUpdate({
          id,
          teacherId
        })
        return tmpInfo
      } catch (err) {
        console.log(err)
      }
    },
    // 选择群
    chooseGroup(sopFrom) {
      this.$refs[sopFrom].validate((valid) => {
        if (valid) {
          console.log('valid====', valid)
          this.dialogGroupVisible = true
          console.log(this.sopFrom)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 子组建传递
    parent_chooseGroup(data) {
      console.log(data)
      this.tableData = data
      this.dialogGroupVisible = false
    },
    // 关闭
    parent_close() {
      this.dialogGroupVisible = false
    },
    // 保存任务计划
    saveTaskPlan() {
      this.clusterIdList = []
      this.tableData.forEach((i) => {
        this.clusterIdList.push(i.cluster_id)
      })
      const obj = {
        id: this.id,
        clusterIdList: this.clusterIdList,
        templateId: this.sopFrom.planTemplate,
        taskName: this.sopFrom.taskName,
        wechatNo: this.sopFrom.wxNumber,
        uid: this.teacherId,
        job_time: this.sopFrom.planStartDate
      }
      this.saveOrUpdateSopJobTask(obj).then((res) => {
        if (res.code === 0) {
          this.$message('保存成功')
          this.$router.push({
            path: '/groupSop/'
          })
        }
        console.log(res)
      })
      console.log(obj)
    },
    // 取消
    cannelOpt() {
      this.$router.push({ path: '/groupSop' })
    },
    // 保存或者更新任务
    async saveOrUpdateSopJobTask(data) {
      try {
        const tmpInfo = await this.$http.Community.saveOrUpdateSopJobTask(data)
        return tmpInfo
      } catch (err) {
        console.log(err)
      }
    },
    formatTime(timestamp) {
      var date = new Date(timestamp * 1)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
    /** 表格删除某一行确认按钮 */
    confirmDelRow(row) {
      console.log('删除了', row)
      this.tableData.forEach((item, index) => {
        if (item.cluster_id === row.cluster_id) {
          this.tableData.splice(index, 1)
        }
        // console.log(item, arrIndex)
      })
    },
    // 计算表格高度
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 120
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.new-plan {
  background: #ffffff;
}
.header {
  .tip {
    margin-bottom: 20px;
  }
  .sop-form {
    font-size: 12px;
  }
}
.editStyle {
  display: flex;
  justify-content: space-around;
  span {
    color: #2a75ed;
    cursor: pointer;
  }
}
.bottom_choose {
  display: flex;
  justify-content: center;
}
.el-form-item__label {
  width: 110px !important;
}
.el-form-item__content {
  margin-left: 110px !important;
}
</style>
