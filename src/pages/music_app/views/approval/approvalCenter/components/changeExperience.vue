<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2021-01-27 11:59:42
 * @LastEditors: liukun
 * @LastEditTime: 2021-01-30 19:00:53
-->
<template>
  <div class="adjustModule">
    <div class="title">
      <i class="el-icon-arrow-left back-icon" @click="back"></i>
      <span class="title-text">体验课调级申请</span>
    </div>
    <div :class="$style.content">
      <el-form
        label-position="right"
        label-width="130px"
        :model="refundForm"
        :rules="rules"
        ref="refundForm"
      >
        <el-form-item label="选择用户：" prop="userId">
          <SearchPhone
            size="medium"
            :class="$style.search_phone100"
            @result="getUid"
            name="userId"
            ref="toGetPhone"
          />
        </el-form-item>
        <el-form-item label="关联订单：" prop="orderId">
          <el-select
            v-model="refundForm.orderId"
            placeholder="请选择订单"
            :class="$style.order100"
            @change="orderensure"
            clearable
          >
            <el-option
              v-for="item in orderOptions"
              :key="item.outTradeNo"
              :value="item.id"
              :label="item.relationOrder"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联物流状态：" prop="expressStatus">
          <el-input
            v-model="refundForm.expressStatus"
            disabled
            :class="$style.order100"
          ></el-input>
          <span :class="$style.tip" v-if="refundForm.orderId"
            >tips:{{
              refundForm.expressStatus === '待审批'
                ? '系统终止当前级别物流并生成新级别物流'
                : '系统无法终止当前级别物流并且不会产生新级别物流'
            }}</span
          >
        </el-form-item>
        <el-form-item label="当前报名级别：" prop="currentSup">
          <el-input
            v-model="refundForm.currentSup"
            disabled
            :class="$style.order100"
          ></el-input>
        </el-form-item>

        <el-form-item label="申请调级级别：" prop="targetSup">
          <el-select
            v-model="refundForm.targetSup"
            placeholder="选择级别"
            :class="$style.order100"
            clearable
          >
            <el-option
              v-for="(value, key) in courseLevelList"
              :key="key"
              :value="value"
              :label="key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调级理由：" prop="adjustReason">
          <el-input
            :class="$style.order100"
            type="textarea"
            v-model="refundForm.adjustReason"
            placeholder="请输入"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item style="padding-left:190px">
          <el-button @click="onCancel('refundForm')">重置</el-button>
          <el-button type="primary" @click="onSubmit('refundForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import SearchPhone from '@/components/MSearch/searchItems/searchPhone'
import {SUP_LEVEL_TRIAL} from '@/utils/supList'
export default {
  name: 'changeExperience',
  components: {
    SearchPhone
  },
  data() {
    return {
      courseLevelList:SUP_LEVEL_TRIAL,
      orderOptions: [],
      selectOrder: {},
      refundForm: {
        userId: '',
        userTel: '',
        orderId: '',
        outTradeNo: '', // 为贺磊加他不动
        expressStatus: '',
        currentSup: '',
        targetSup: '',
        adjustReason: ''
      },
      rules: {
        userId: [
          { required: true, message: '请键入用户手机号', trigger: 'blur' }
        ],
        orderId: [
          { required: true, message: '请选择关联订单', trigger: 'change' }
        ],
        expressStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        currentSup: [{ required: true, message: '必填', trigger: 'blur' }],
        targetSup: [
          { required: true, message: '请选择期望调级', trigger: 'change' }
        ],
        adjustReason: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 后退
    back() {
      this.$router.push('/approval')
    },
    // 选择手机号后获取userId和手机号
    getUid({ userId }) {
      if (userId) {
        this.refundForm.userId = userId // 存 userId
        this.refundForm.userTel = this.$refs.toGetPhone.input // 存手机号
        this.getordersWithUid() // 用uid去提货订单数据
      } else {
        this.$message({
          message: 'searchPhone组件没有得到uid',
          type: 'warning'
        })
      }
    },
    // 用uid去提货订单数据
    getordersWithUid() {
      this.$http.RefundApproval.getOrdersByUid(this.refundForm.userId)
        .then(({ code, payload }) => {
          this.refundForm.orderId = ''
          this.orderOptions = []
          if (
            !code &&
            payload.length &&
            payload.find((item) => item.packagesType === 'EXPERIENCE_COURSE')
          ) {
            this.orderOptions = payload
              .filter((item) => item.packagesType === 'EXPERIENCE_COURSE')
              .map((item) => {
                item.relationOrder =
                  item.outTradeNo.replace(/[^\d]+/g, '') +
                  `(^_^)${item.packagesName}`
                return item
              })
          } else {
            this.$message({
              message: '该手机号未查询到体验课订单',
              type: 'warning'
            })
          }
        })
        .catch((err) => {
          this.$message.error('uid获取失败')
          console.error(err)
        })
    },
    orderensure(r) {
      // 存起来方便公用
      this.selectOrder = this.orderOptions.filter((item) => {
        return item.id === r
      })[0]
      console.info('选择关联订单是我,大家快来公用--', this.selectOrder)
      // 显示当前级别
      this.refundForm.currentSup = this.selectOrder.sup
      this.refundForm.outTradeNo = this.selectOrder.outTradeNo // 为贺磊加他不动
      // 该订单是否支持调级
      this.assertLevel(r)
      // 显示物流状态
      this.showExpressStatus(r)
    },
    // 是否支持调级
    assertLevel(orderId) {
      this.$http.RefundApproval.assertLevel(orderId.match(/\d+/g)[0]).then(
        ({ code, payload }) => {
          if (!code && !payload) {
            this.$message.error('该体验课订单不支持调级')
            setTimeout(() => {
              location.reload()
            }, 3000)
          }
        }
      )
    },
    // 物流状态
    async showExpressStatus(orderId) {
      const {
        code,
        payload
      } = await this.$http.RefundApproval.showExpressStatus(
        orderId.match(/\d+/g)[0]
      )
      if (!code && payload) {
        this.refundForm.expressStatus =
          payload.expressStatus === 'DEFAULT' ||
          payload.expressStatus === 'DELIVER_WAIT_CONFIRM'
            ? '待审批'
            : '已发货'
      } else if (!code && !payload) {
        this.refundForm.expressStatus = '待审批'
      }
    },

    // 置空表单
    onCancel(formName) {
      this.$refs[formName].resetFields()
      this.refundForm = {}
    },
    // 提交表单
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true
          })
          const applyId = JSON.parse(localStorage.getItem('teacher')).id
          const applyName = JSON.parse(localStorage.getItem('teacher')).realName

          // 贺磊不用expressStatus字段，另起expressStatusStr字段接受物流状态“已审批”,“已发货”
          const expressStatusStr = this.refundForm.expressStatus
          delete this.refundForm.expressStatus
          this.$http.RefundApproval.submitoTrial(
            Object.assign(this.refundForm, {
              applyId,
              applyName,
              expressStatusStr
            })
          )
            .then(({ code }) => {
              if (!code) {
                this.$router.push({
                  name: 'approvalCenter',
                  params: { activeApprove: 'second' }
                })
                // 回首掏
                this.onCancel('refundForm')
              }
            })
            .catch((err) => {
              console.info(err)
            })
            .finally(() => {
              setTimeout(() => {
                loading.close()
              }, 1000)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" module>
.content {
  padding: 10px 20px 10px;
}
.tip {
  color: red;
  margin-left: 5px;
}

.search_phone100 {
  width: 50% !important;
  // 体外控制手机号组件样式(组件内100%w,根节点别写样式造成局限)
  // 只生效当前显示页面(组件),追加给子组件的全局或局部类名
}
.order100 {
  width: 50%;
}
.refundMonths100 {
  width: 50%;
}

.refundForm_imageUrl {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 178px;
  overflow: hidden;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar_uploader_icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>
<style lang="scss" scoped>
.adjustModule {
  min-height: calc(100vh - 100px);
  background-color: #fff;
  margin: 10px;
  .title {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f0f1f2;
    i.back-icon {
      display: inline-block;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      border: 1px solid #ddd;
      margin: 0 20px;
      text-align: center;
      line-height: 19px;
      color: #ddd;
      vertical-align: middle;
      cursor: pointer;
    }
    .title-text {
      margin-left: 10px;
    }
  }
  .adjust-form {
    padding: 0 50px;
    margin-top: 30px;
    /deep/ .el-form-item__content {
      margin-left: 200px !important;
    }
    .search-phone-class {
      width: 200px;
      /deep/ .el-input--mini {
        .el-input__inner {
          height: 40px;
          line-height: 40px;
        }
      }
    }
    .supp-text {
      margin-left: 15px;
      color: red;
      font-size: 12px;
    }
    .input-loading {
      margin-left: 10px;
      font-size: 18px;
      color: #aaa;
    }
  }
}
</style>
