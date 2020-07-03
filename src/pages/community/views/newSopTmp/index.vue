<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: Shentong
 * @LastEditTime: 2020-07-03 19:09:29
-->
<template>
  <el-row type="flex" class="new-sop app-main">
    <el-col class="new-sop-container">
      <div class="scroll-container">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <el-card class="header">
            <div class="tip">新建SOP模板</div>
            <el-form
              :model="sopFrom"
              ref="sopFrom"
              label-width="100px"
              size="mini"
              class="sop-form"
            >
              <el-form-item
                prop="name"
                label="模板名称"
                style="width:320px;"
                :rules="[
                  {
                    required: true,
                    message: '请输入邮箱地址',
                    trigger: 'blur'
                  },
                  {
                    type: 'name',
                    message: '请输入正确的邮箱地址',
                    trigger: ['blur', 'change']
                  }
                ]"
              >
                <el-input
                  v-model="sopFrom.name"
                  placeholder="请输入模板名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="模板状态" prop="status">
                <el-radio-group v-model="sopFrom.status">
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
                  <i>×</i>
                </div>
                <div class="add-task-btn">
                  <b>＋</b>
                  <span>添加一天任务</span>
                </div>
              </div>
              <div class="task-detail" v-if="currenContent.length">
                <div class="label">发送时间</div>
                <div class="send-time">
                  <div class="day">
                    第<span>{{ currenContent[0].day }}</span
                    >天
                  </div>
                  <el-time-picker
                    size="mini"
                    is-range
                    v-model="sendTime"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                    class="time-picker"
                  >
                  </el-time-picker>
                  <span class="tip">第一条信息在时间段内随机发送</span>
                </div>
                <div class="label content">发送内容</div>
                <div class="send-content">
                  <div class="text-type common">
                    <div class="content">
                      <div class="text-img-box">
                        <div class="desc">文案：</div>
                        <div class="info">
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Quaerat vel nesciunt placeat alias repellendus
                          non aspernatur eum adipisci distinctio accusamus porro
                          veritatis, veniam a corporis vitae eligendi delectus
                          dolore. Ipsam?
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <i class="el-icon-edit"></i>
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                  <div class="img-type common">
                    <div class="content">
                      <div class="gap-time">
                        <span>间隔</span>
                        <el-input-number
                          v-model="stepNum"
                          controls-position="right"
                          size="mini"
                          @change="stepNumHandleChange"
                          :min="1"
                          :max="10"
                          class="step-num"
                        ></el-input-number>
                        <el-select
                          v-model="intervalType"
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
                        <div class="desc">图片：</div>
                        <div class="info">
                          <el-image
                            style="width: 100px; height: 100px"
                            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                            fit="fill"
                          ></el-image>
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <i class="el-icon-edit"></i>
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                  <div class="add-content-btn">
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-plus"
                      @click="centerDialogVisible = true"
                      >添加内容</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-scrollbar>
      </div>
    </el-col>
    <add-content
      :centerDialogVisible="centerDialogVisible"
      @dialogOperate="dialogOperate"
      v-if="centerDialogVisible"
    ></add-content>
  </el-row>
</template>
<script>
import AddContent from './components/AddContent'
export default {
  data() {
    return {
      sopFrom: {
        name: '',
        status: 0
      },
      intervalType: 'SECONDS',
      currenTask: 1,
      currenContent: [],
      mockList: {
        '1': [
          {
            id: 1,
            cid: '0',
            mid: '0',
            ctime: '0',
            utime: '0',
            del: '0',
            templateId: 1,
            day: 1,
            strip: 1,
            startTime: '8:23:00',
            endTime: '9:00:00',
            intervalTime: 0,
            intervalType: 'HOUR',
            msgType: '1',
            msgContent: '第一天第一条的内容'
          },
          {
            id: 2,
            cid: '0',
            mid: '0',
            ctime: '0',
            utime: '0',
            del: '0',
            templateId: 1,
            day: 1,
            strip: 2,
            startTime: '8:30:00',
            endTime: '9:00:00',
            intervalTime: 0,
            intervalType: 'HOUR',
            msgType: '3',
            msgContent:
              'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
          }
        ],
        '2': [
          {
            id: 3,
            cid: '0',
            mid: '0',
            ctime: '0',
            utime: '0',
            del: '0',
            templateId: 1,
            day: 2,
            strip: 1,
            startTime: '14:30:00',
            endTime: '9:00:00',
            intervalTime: 0,
            intervalType: 'HOUR',
            msgType: '1',
            msgContent: '第二天第一条的内容'
          }
        ]
      },
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
      sendTime: [new Date(2019, 9, 10, 8, 40), new Date(2019, 9, 10, 9, 40)],
      stepNum: 0,
      centerDialogVisible: false,
      params: {
        id: ''
      }
    }
  },
  components: { AddContent },
  async created() {
    const { id = '' } = this.$route.params
    this.params.id = id
    if (id) {
      const tmpInfo = await this.getSopTemplate(id)
      console.log('tmpInfo', tmpInfo)
      // TODO:
      this.tmpInfo = this.mockList
      // 判断数据是否为空对象
      const keyArr = Object.getOwnPropertyNames(this.tmpInfo)

      keyArr.length && this.tasksClickHandle(keyArr[0])
    }
  },
  computed: {},
  methods: {
    /** 点击第几天任务事件 */
    tasksClickHandle(index) {
      this.currenTask = index
      this.currenContent = this.tmpInfo[index]
      console.log(this.currenContent, index)
    },
    /** 通过模板id获取模板信息 */
    async getSopTemplate(templateId) {
      try {
        const tmpInfo = await this.$http.Community.getSopTemplate({
          templateId
        })
        return tmpInfo
      } catch (err) {
        console.log(err)
      }
    },
    stepNumHandleChange() {},
    dialogOperate(args) {
      // msgType: 1--->文本；3--->图片
      const { close = true, msgType = '1', textarea = '', imgUrl = '' } = args
      this.centerDialogVisible = !close
      const content = {
        msgType,
        msgContent: msgType === '1' ? textarea : imgUrl
      }
      console.log('add-content', content)
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
              i {
                cursor: pointer;
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
                  padding: 0 20px;
                  font-weight: 500;
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
                  width: 50px;
                  font-size: 20px;
                  display: flex;
                  justify-content: space-between;
                  i {
                    cursor: pointer;
                    &:hover {
                      color: #2a75ed;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
