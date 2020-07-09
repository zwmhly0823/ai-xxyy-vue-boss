<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-09 14:46:58
-->
<template>
  <el-row type="flex" class="new-sop app-main">
    <el-col class="new-sop-container">
      <div class="scroll-container">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-card class="header">
            <div class="tip">新建SOP模板</div>
            <el-form
              :model="sopForm"
              ref="sopForm"
              label-width="100px"
              size="mini"
              class="sop-form"
            >
              <el-form-item
                prop="templateName"
                label="模板名称"
                style="width:320px;"
                :rules="[
                  {
                    required: true,
                    message: '请输入模板名称',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  v-model="sopForm.templateName"
                  placeholder="请输入模板名称"
                  maxlength="30"
                ></el-input>
              </el-form-item>
              <el-form-item label="模板状态" prop="state">
                <el-radio-group v-model="sopForm.state">
                  <el-radio :label="0">启用</el-radio>
                  <el-radio :label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card class="section">
            <div class="task-container">
              <div class="task-group">
                <div
                  class="item"
                  :class="{ active: currenTask == t_index }"
                  v-for="(task, t_index) in tmpInfo"
                  @click="tasksClickHandle(t_index)"
                  :key="t_index"
                >
                  <span>第{{ t_index }}天任务</span>
                  <i v-if="currenTask != t_index" @click.stop="delTask(t_index)"
                    >×</i
                  >
                </div>
                <div class="no-task" v-if="!Object.keys(tmpInfo).length">
                  暂无任务
                </div>
                <div class="add-task-btn" @click="addTask">
                  <b>＋</b>
                  <span>添加一天任务</span>
                </div>
              </div>
              <div class="task-detail" v-if="currenContentArr.length">
                <div class="label">发送时间</div>
                <div class="send-time">
                  <div class="day">
                    第<span>{{ currenContentArr[0].day }}</span
                    >天
                  </div>
                  <!-- <el-time-picker
                    size="mini"
                    v-model="currenContentArr[0].startTime"
                    :picker-options="{
                      selectableRange: '18:30:00 - 20:30:00'
                    }"
                    placeholder="任意时间点"
                  >
                  </el-time-picker>
                  <span>至</span>
                  <el-time-picker
                    size="mini"
                    arrow-control
                    v-model="currenContentArr[0].endTime"
                    :picker-options="{
                      selectableRange: '18:30:00 - 20:30:00'
                    }"
                    placeholder="任意时间点"
                  >
                  </el-time-picker> -->
                  <el-time-picker
                    size="mini"
                    is-range
                    v-model="currenContentArr[0].firstSendTime"
                    value-format="HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                    class="time-picker"
                    @change="firstSendTimeChange"
                  >
                  </el-time-picker>
                  <span class="tip">第一条信息在时间段内随机发送</span>
                </div>
                <div class="label content">发送内容</div>
                <div class="send-content">
                  <div
                    class="common"
                    :class="content.msgType == '1' ? 'text-type' : 'img-type'"
                    v-for="(content, index) in currenContentArr"
                    :key="index"
                  >
                    <div class="content">
                      <div class="gap-time" v-if="index != 0">
                        <span>间隔</span>
                        <el-input-number
                          v-model="currenContentArr[index].intervalTime"
                          controls-position="right"
                          size="mini"
                          @change="stepNumHandleChange"
                          :min="1"
                          :max="10"
                          class="step-num"
                        ></el-input-number>
                        <el-select
                          v-model="currenContentArr[index].intervalType"
                          class="time-scale"
                          placeholder="请选择"
                          size="mini"
                        >
                          <el-option
                            v-for="item in timeScaleSelect"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                        <span>发送</span>
                      </div>
                      <div class="text-img-box">
                        <div class="desc">
                          {{ content.msgType == '1' ? '文案：' : '图片：' }}
                        </div>
                        <div class="info">
                          <div v-if="content.msgType == '1'">
                            {{ content.msgContent }}
                          </div>
                          <el-image
                            v-else
                            style="width: 100px; height: 100px"
                            :src="content.msgContent"
                            fit="fill"
                          ></el-image>
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <i
                        class="el-icon-edit"
                        @click.stop="editCurrContent(index, content)"
                      ></i>
                      <i
                        v-if="currenContentArr.length > 1"
                        class="el-icon-delete"
                        @click.stop="delCurrContent(index)"
                      ></i>
                    </div>
                  </div>
                  <div class="add-content-btn">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-plus"
                      @click="newContent"
                      >添加内容</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="operate-btn">
              <el-button size="mini" style="width:150px" @click="cancelUpdate"
                >取消</el-button
              >
              <el-button
                type="primary"
                style="width:150px"
                size="mini"
                @click="saveForm"
                :loading="!canSave"
                >{{ canSave ? '确认' : '保存中' }}</el-button
              >
            </div>
          </el-card>
        </el-scrollbar>
      </div>
    </el-col>
    <add-content
      :centerDialogVisible="centerDialogVisible"
      :content="curCtnt"
      @dialogOperate="dialogOperate"
      v-if="centerDialogVisible"
    ></add-content>
  </el-row>
</template>
<script>
import AddContent from './components/AddContent'
import { isToss } from '@/utils/index.js'
export default {
  data() {
    return {
      sopForm: {
        templateName: '',
        state: 0,
        uid: '',
        templateId: ''
      },
      canSave: true,
      currenTask: 1,
      currenContentArr: [],
      emptyContentTmp: {
        day: 1,
        startTime: '',
        endTime: '',
        intervalTime: 0,
        intervalType: 'HOUR',
        msgType: '1',
        msgContent: '',
        firstSendTime: ['06:00:00', '23:59:59']
      },
      firstSendTime: ['06:00:00', '23:59:59'],
      tmpInfo: {},
      timeScaleSelect: [
        {
          label: '秒',
          value: 'SECONDS'
        },
        {
          label: '分钟',
          value: 'MINITES'
        },
        {
          label: '小时',
          value: 'HOUR'
        }
      ],
      centerDialogVisible: false,
      curCtnt: {}
    }
  },
  components: { AddContent },
  async created() {
    const { id = '' } = this.$route.params
    const teacherId = isToss()

    let itemType = 'teacher'
    !teacherId && (itemType = 'staff')
    const userInfo = localStorage.getItem(itemType)

    this.sopForm.uid = JSON.parse(userInfo).id

    if (id !== '-1') {
      this.sopForm.templateId = id
      const tmpInfo = await this.getSopTemplate(id)

      const { templateName = '', state = 0, detailMap = {} } = tmpInfo
      Object.assign(this.sopForm, {
        state,
        templateName
      })

      for (var i in detailMap) {
        const curTask = detailMap[i]
        curTask.forEach((task) => {
          const { startTime = '', endTime = '' } = task
          task.firstSendTime = [startTime, endTime]
        })
      }
      this.tmpInfo = { ...detailMap }
    } else {
      this.tmpInfo = {
        1: [this.emptyContentTmp]
      }
    }

    const taskArr = Object.getOwnPropertyNames(this.tmpInfo)

    taskArr.length && this.tasksClickHandle(taskArr[0])
  },
  computed: {},
  methods: {
    firstSendTimeChange() {},
    /** 删除某一天任务 */
    delTask(index) {
      delete this.tmpInfo[index]
      this.tmpInfo = { ...this.tmpInfo }
    },
    confirmDelTask(index) {
      delete this.tmpInfo[index]
      this.tmpInfo = { ...this.tmpInfo }
    },
    /** 添加一天的 任务 */
    addTask() {
      /** vue中数组出现了__ob__: Observer，使用下标取不到值 */
      const tmpInfo = JSON.parse(JSON.stringify(this.tmpInfo))
      const taskArr = Object.getOwnPropertyNames(tmpInfo)
      const lastTask = +taskArr[taskArr.length - 1] + 1

      if (taskArr.length) {
        this.tmpInfo = {
          ...this.tmpInfo,
          [lastTask]: [
            {
              ...this.emptyContentTmp,
              firstSendTime: this.firstSendTime,
              day: lastTask
            }
          ]
        }
      }
    },
    /** 点击第几天任务事件 */
    tasksClickHandle(index) {
      this.currenTask = index
      this.currenContentArr = this.tmpInfo[index]
    },
    /** 新增一条内容 */
    newContent() {
      this.curCtnt = {}
      this.centerDialogVisible = true
    },
    /** 删除当前任务下的某条内容 */
    delCurrContent(index) {
      this.currenContentArr.splice(index, 1)
    },
    /** 编辑当前任务下的某条内容 */
    editCurrContent(index, ctnt) {
      this.centerDialogVisible = true
      this.curCtnt = {
        ...ctnt,
        isEdit: true,
        curIndex: index
      }
    },
    /** 通过模板id获取模板信息 */
    async getSopTemplate(templateId) {
      const loadingInstance = this.$loading({
        target: '.app-main',
        lock: true,
        text: '正在获取数据...',
        fullscreen: true
      })
      try {
        const tmpInfo = await this.$http.Community.getSopTemplate({
          templateId
        })
        const { payload = {} } = tmpInfo
        return payload
      } catch (err) {
        console.log(err)
      } finally {
        loadingInstance.close()
      }
    },
    /** 保存（更新）模板信息 */
    saveForm() {
      this.canSave && this.executeSave()
    },
    /** 取消修改按钮 */
    cancelUpdate() {
      this.$router.back(-1)
    },
    // form表校验
    judegeValidate(formName) {
      return this.$refs[formName].validate()
    },
    async executeSave() {
      this.canSave = false
      const validatePro = await this.judegeValidate('sopForm').catch(() => {})

      if (validatePro) {
        const params = this.packageSendData()
        await this.saveOrUpdate(params)
      }
      this.canSave = true
    },
    /** 封装需要提交的数据 */
    packageSendData() {
      for (var i in this.tmpInfo) {
        const curTask = this.tmpInfo[i]
        curTask.forEach((task) => {
          const [startTime, endTime] = task.firstSendTime
          task.startTime = startTime || '06:00:00'
          task.endTime = endTime || '23:59:59'
        })
      }
      return {
        map: this.tmpInfo,
        ...this.sopForm
      }
    },
    /**
     * @description 保存、更新接口
     */
    async saveOrUpdate(params) {
      try {
        const tasks = await this.$http.Community.saveOrUpdateSopTmpInfo(params)
        const { code, status } = tasks
        if (code === 0 && status === 'OK') {
          this.$message({
            type: 'success',
            message: '保存成功',
            duration: 1200,
            onClose: () => this.cancelUpdate()
          })
        }
      } catch (err) {}
    },
    stepNumHandleChange() {},
    /**
     * @description diolog模态框emit回来的事件
     * @tip { msgType } 1: 文本；3: 图片
     */
    dialogOperate(args) {
      const {
        close = true,
        closeOnly = true,
        msgType = 1,
        textarea = '',
        imgUrl = '',
        curIndex,
        isEdit = false
      } = args
      this.centerDialogVisible = !close
      if (!closeOnly) {
        const content = {
          msgType,
          msgContent: +msgType === 1 ? textarea : imgUrl
        }
        if (isEdit) {
          this.currenContentArr[curIndex] = {
            ...this.currenContentArr[curIndex],
            ...content
          }
        } else {
          this.currenContentArr.push({ ...this.emptyContentTmp, ...content })
        }
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.new-sop {
  .new-sop-container {
    position: relative;
    margin: 10px;
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
    .scroll-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      .scrollbar-wrapper {
        overflow-x: hidden;
      }
      .el-scrollbar {
        flex: 1;
      }
      .header {
        margin-bottom: 10px;
        .tip {
          margin-bottom: 20px;
        }
        .sop-form {
          font-size: 12px;
        }
      }
      .section {
        .task-container {
          display: flex;
          min-height: 450px;
          .task-group {
            width: 180px;
            margin-right: 20px;
            position: relative;
            .item {
              width: 100%;
              border: 1px solid #dcdfe6;
              height: 30px;
              border-radius: 5px;
              display: flex;
              align-items: center;
              padding: 0 10px;
              justify-content: center;
              transition: box-shadow 0.2s;
              position: relative;
              margin-bottom: 10px;
              cursor: pointer;
              i {
                height: 100%;
                width: 30px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                position: absolute;
                right: 10px;
                top: 0;
              }
              &:last-child {
                margin-bottom: 0;
              }
              &:hover,
              &.active {
                color: #2a75ed;
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              }
            }
            .add-task-btn-circle {
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              bottom: 10px;
              left: 50%;
              transform: translateX(-50%);
            }
            .add-task-btn {
              width: 100%;
              border: 1px solid #2a75ed;
              border-radius: 5px;
              height: 30px;
              color: #2a75ed;
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              bottom: 10px;
              cursor: pointer;
              &:hover {
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              }
            }
            .no-task {
              display: flex;
              justify-content: center;
            }
          }
          .task-detail {
            flex: 1;
            padding: 10px;
            border-radius: 3px;
            background: #ebeef3;
            .label {
              margin-bottom: 10px;
              &.content {
                margin-top: 40px;
              }
            }
            .send-time {
              display: flex;
              align-items: center;
              .day {
                span {
                  color: #2a75ed;
                  padding: 0 15px;
                  font-weight: 500;
                  width: 50px;
                  background: #fff;
                  margin: 0 5px;
                  border-radius: 3px;
                }
              }
              .time-picker {
                margin: 0 15px;
              }
            }
            .send-content {
              .common {
                border: 1px solid #dcdfe6;
                padding: 10px;
                background: white;
                border-radius: 6px;
                display: flex;
                margin-bottom: 20px;
                &:last-child {
                  margin-bottom: 0;
                }
                .content {
                  flex: 1;
                  .gap-time {
                    margin-bottom: 15px;
                    .step-num {
                      margin-left: 10px;
                    }
                    .time-scale {
                      margin: 0 10px;
                    }
                  }
                  .text-img-box {
                    display: flex;
                    .desc {
                      width: 50px;
                    }
                    .info {
                      flex: 1;
                    }
                  }
                }
                .operate {
                  // width: 50px;
                  font-size: 20px;
                  display: flex;
                  justify-content: space-between;
                  i {
                    cursor: pointer;
                    &:hover {
                      color: #2a75ed;
                    }
                    &:first-child {
                      margin-right: 5px;
                    }
                  }
                }
              }
            }
          }
        }
        .operate-btn {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          button:first-child {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
