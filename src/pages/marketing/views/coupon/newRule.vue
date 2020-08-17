<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-17 18:23:13
-->
<template>
  <el-dialog
    :title="'新建定向发放规则'"
    :visible.sync="centerDialog"
    width="60%"
    top="10vh"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    custom-class="dialog-custom"
  >
    <div class="dialog-center">
      <div class="rule-content">
        <div class="excuse-way divider">
          <div class="label">
            <span>执行方式</span>
          </div>
          <div class="ctn">
            <div class="title">执行方式：</div>
            <el-radio v-model="formData.exeType" label="1">仅选中期</el-radio>
            <div class="tooltip-gap">
              <el-tooltip
                class="item"
                effect="dark"
                content="Right Center 提示文字"
                placement="right"
              >
                <i
                  class="el-icon-question"
                  style="fontSize:17px;cursor:pointer;"
                ></i>
              </el-tooltip>
            </div>
            <el-select
              v-model="formData.exePeriod"
              size="mini"
              placeholder="请选择执行期"
            >
              <el-option
                v-for="item in exePeriod"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="ctn">
            <div class="title"></div>
            <el-radio v-model="formData.exeType" label="2"
              >仅选中期及后续所有期</el-radio
            >
            <div class="tooltip-gap">
              <el-tooltip
                class="item"
                effect="dark"
                content="Right Center 提示文字"
                placement="right"
              >
                <i
                  class="el-icon-question"
                  style="fontSize:17px;cursor:pointer;"
                ></i>
              </el-tooltip>
            </div>
            <el-select
              v-model="formData.exePeriod"
              size="mini"
              placeholder="请选择执行期"
            >
              <el-option
                v-for="item in exePeriod"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="selected-group divider">
          <div class="label">
            <span>选择组/设置期时间</span>
          </div>
          <div class="my-tree">
            <div class="select-all">
              <el-checkbox v-model="checkedAll">全选</el-checkbox>
              <span>未能选中的部门将不能发放此优惠券</span>
            </div>
            <dept-tree></dept-tree>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogOperate('cancel')" size="mini">取消</el-button>
      <el-button type="primary" @click="dialogOperate('submit')" size="mini"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
// import { debounce } from 'lodash'
import DeptTree from './deptTree'
export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      checkedAll: false,
      formData: {
        exeType: '1',
        exePeriod: ''
      },
      exePeriod: [],
      addContentForm: {
        imgUrl: '',
        textarea: ''
      },
      changeEmojiToggle: false
    }
  },
  components: { DeptTree },
  computed: {
    centerDialog() {
      return this.centerDialogVisible
    }
  },
  created() {},
  mounted() {},
  methods: {
    /** img-upload */
    dialogClose() {
      this.$emit('emitDialogOperate', { close: true })
    },
    /** 新增内容底部按钮操作 */
    dialogOperate(type) {
      this.$emit('emitDialogOperate', { close: true })
    }
  }
}
</script>
<style>
.el-scrollbar__wrap {
  overflow-x: auto;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-center {
  .rule-content {
    padding: 15px;
    min-height: 180px;
    .divider {
      .label {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        justify-content: space-between;
        margin-bottom: 10px;
        span {
          display: flex;
          align-items: center;
          &::before {
            display: inline-block;
            content: '';
            width: 5px;
            height: 22px;
            background: #409eff;
            margin-right: 10px;
          }
        }
      }
      .el-radio {
        margin-right: 10px !important;
      }
      .tooltip-gap {
        margin-right: 20px;
      }
    }
    .excuse-way {
      margin-bottom: 20px;
      .ctn {
        height: 33px;
        display: flex;
        align-items: center;
        .title {
          width: 75px;
        }
      }
    }
    .selected-group {
      .label {
        margin-bottom: 20px;
      }
      .my-tree {
        .select-all {
          margin-left: 24px;
          span {
            color: #999;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.dialog-footer {
  &.is-edit {
  }
}
</style>
