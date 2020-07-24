<!--
 * @Descripttion: BOSS小熊
 * @version: 1.0.0
 * @Author: Shasen
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: Shasen
 * @LastEditTime: 2020-07-21 14:42:57
-->
<template>
  <el-row type="flex" class="activity-manage app-main">
    <el-col class="activity-manage-container">
      <el-card class="header">
        <div class="tip" v-if="id">修改活动</div>
        <div class="tip" v-else>新建活动</div>
        <el-form
          :model="activityFrom"
          ref="activityFrom"
          label-width="100px"
          size="mini"
          class="activity-from"
          :rules="rules"
        >
          <el-form-item prop="taskName" label="活动名称" style="width:320px;">
            <el-input
              v-model="activityFrom.taskName"
              placeholder="请输入活动名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="planTemplate"
            label="活动类型"
            style="width:320px;"
          >
            <el-select
              class="item-style"
              v-model="activityFrom.planTemplate"
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
          <el-form-item label="活动时间" prop="planStartDate">
            <el-date-picker
              v-model="activityFrom.planStartDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              :picker-options="expireTimeOption"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动范围">
            <el-row style="display:flex;margin-bottom: 10px;">
              {{ explesson }}
              <el-checkbox
                label="体验课"
                name="type"
                v-model="explesson"
                style="margin-right:20px;"
              ></el-checkbox>
              <search-stage
                :isDisabled="!explesson"
                class="search-group-item"
                name="term0"
                placeholder="体验课排期"
                type="0"
                @result="getSchedul('term0', arguments, 0)"
              />
            </el-row>
            <el-row style="display:flex">
              <el-checkbox
                label="系统课"
                name="type"
                style="margin-right:20px;"
              ></el-checkbox>
              <search-stage
                class="search-group-item"
                name="term1"
                placeholder="系统课排期"
                type="1"
                @result="getSchedul('term1', arguments, 1)"
              />
            </el-row>
          </el-form-item>
          <el-form-item label="赠品设置">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="chooseGroup('activityFrom')"
              >选择群</el-button
            >
            <div ref="tableContainer" class="tableContainer_">
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
                        <span
                          @click="deleteTablerow(scope.row, '1')"
                          slot="reference"
                          >删除</span
                        >
                      </el-popconfirm>
                    </div>
                  </template>
                </el-table-column>
              </ele-table>
            </div>
          </el-form-item>
          <el-form-item label="活动说明">
            <el-input
              type="textarea"
              style="width:400px"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入内容"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div class="bottom_choose" v-show="tableData.length">
          <el-button size="mini" @click="cannelOpt">取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="saveTaskPlan('activityFrom')"
            >确认</el-button
          >
        </div>
      </el-card>
      <el-dialog
        title="选择群"
        :visible.sync="dialogGroupVisible"
        width="50%"
        destroy-on-close
      >
        <choose-group
          ref="chooseGroup"
          :taskstatus="teacherId"
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
import SearchStage from '@/components/MSearch/searchItems/searchStage.vue'
export default {
  data() {
    return {
      explesson: false,
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
      activityFrom: {
        taskName: '',
        planTemplate: '',
        planStartDate: ''
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
            required: true,
            message: '请选择时间范围',
            trigger: 'change'
          }
        ]
      },
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now() - 24 * 60 * 60 * 1000
        }
      }
    }
  },
  components: {
    EleTable,
    ChooseGroup,
    SearchStage
  },
  watch: {
    explesson(val, old) {
      if (!val) {
        console.log('11111')
        this.$emit('result', '')
      }
      console.log(val, old)
    }
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

    // 新增与编辑逻辑
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
      this.activityFrom.taskName = this.taskPlan.payload.taskName
      this.activityFrom.planTemplate = this.taskPlan.payload.templateId
      this.activityFrom.planStartDate = this.taskPlan.payload.job_time
      this.tableData = this.taskPlan.payload.weChatIcodeClusterLists
    }
    console.log(this.id, this.teacherId, this.taskPlan)
    this.calcTableHeight()
  },
  mounted() {},
  computed: {},
  methods: {
    // 获取活动范围 体验课系统课拍戏
    getSchedul(key, res, type) {
      console.log(key, res[0], type, '11212121212121')
    },
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
    chooseGroup(activityFrom) {
      this.dialogGroupVisible = true
      this.$nextTick(() => {
        this.$refs.chooseGroup.handleDebounce()
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
    saveTaskPlan(activityFrom) {
      this.$refs[activityFrom].validate((valid) => {
        if (valid) {
          console.log('valid====', valid)
          console.log(this.activityFrom)
        } else {
          console.log('error submit!!')
          return false
        }
      })
      this.clusterIdList = []
      this.tableData.forEach((i) => {
        this.clusterIdList.push(i.cluster_id)
      })
      const obj = {
        id: this.id,
        clusterIdList: this.clusterIdList,
        templateId: this.activityFrom.planTemplate,
        taskName: this.activityFrom.taskName,
        uid: this.teacherId,
        job_time: this.activityFrom.planStartDate
      }
      // this.saveOrUpdateSopJobTask(obj).then((res) => {
      //   if (res.code === 0) {
      //     this.$message.success('保存成功')
      //     this.$router.push({
      //       path: '/groupSop/'
      //     })
      //   }
      //   console.log(res)
      // })
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
.activity-manage-container {
  padding: 10px;
}
.activity-manage {
  background: #ffffff;
}
// .tableContainer_ {
//   display: flex;
//   justify-content: center;
//   padding: 20px;
// }
.header {
  height: 100%;
  .tip {
    margin-bottom: 20px;
  }
  .activity-from {
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
