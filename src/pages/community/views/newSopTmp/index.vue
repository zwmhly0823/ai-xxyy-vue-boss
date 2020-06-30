<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 16:50:58
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-30 14:54:11
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
                <div class="item">
                  <span>第一天任务</span>
                  <i>×</i>
                </div>
              </div>
              <div class="task-detail">
                <div class="label">发送时间</div>
                <div class="send-time">
                  <div class="day">第<span>1</span>天</div>
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
                <div class="send-content"></div>
              </div>
            </div>
          </el-card>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      sopFrom: {
        name: '',
        status: 0
      },
      sendTime: [new Date(2019, 9, 10, 8, 40), new Date(2019, 9, 10, 9, 40)]
    }
  },
  components: {},
  computed: {},
  methods: {}
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
          .task-group {
            width: 180px;
            margin-right: 20px;
            .item {
              width: 100%;
              border: 1px solid #dcdfe6;
              color: #2a75ed;
              height: 30px;
              border-radius: 5px;
              display: flex;
              align-items: center;
              padding: 0 10px;
              justify-content: center;
              transition: box-shadow 0.2s;
              position: relative;
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
              &:hover {
                box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              }
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
          }
        }
      }
    }
  }
}
</style>
