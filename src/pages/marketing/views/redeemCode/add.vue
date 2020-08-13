<!--
 * @Descripttion: 创建码库
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-06 22:29:42
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-11 14:49:15
-->
<template>
  <div class="add-redeem-code">
    <el-dialog
      title="创建兑换码"
      :visible.sync="show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        size="small"
        :label-width="formLabelWidth"
        style="width: 75%"
      >
        <el-form-item label="活动名称" prop="title">
          <el-input
            v-model.trim="form.title"
            placeholder="兑换码标题，不超过40个字"
            maxlength="40"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="兑换码数量" prop="num">
          <el-input
            v-model.number="form.num"
            placeholder="请输入兑换码数量（不大于1000）"
            maxlength="4"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="有效时间" prop="date">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            align="right"
            start-placeholder="生效时间"
            end-placeholder="失效时间"
            value-format="timestamp"
            :default-time="['00:00:00', '24:00:00']"
            :picker-options="pickerOptions"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="兑换商品套餐" prop="packageId">
          <el-input v-model="form.packageId" style="display: none;" />
          <!-- 没选择时 -->
          <div
            class="package-btn"
            @click="handleSelectPackage"
            v-if="!form.packageId && !packageProduct.id"
          >
            选择套餐
          </div>
          <!-- 选择时 -->
          <div class="package-section d-flex align-center" v-else>
            <div class="flex-1">
              <h4>{{ packageProduct.name }}</h4>
              <p class="red">{{ packageProduct.price }}元</p>
              <p>课时：{{ packageProduct.course_week }}周</p>
            </div>
            <el-button size="mini" @click="dialogPackageVisible = true"
              >更换商品</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="渠道" prop="channelId">
          <el-select v-model="form.channelId" placeholder="请选择渠道">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="customerSignId">
          <el-select v-model="form.customerSignId" placeholder="请选择标签">
            <el-option
              v-for="item in labelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否生成卡号" prop="isCardNo">
          <el-radio-group v-model="form.isCardNo">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAdd('form')"
          size="small"
          :loading="loading"
          >保 存</el-button
        >
      </div>

      <packages-list
        :to-body="true"
        :visible="dialogPackageVisible"
        :current-id="form.packageId"
        @result="getPackageId"
      />
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index'
import PackagesList from '../../components/redeemCode/PackagesList'
export default {
  components: {
    PackagesList
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  data() {
    // 数量校验规则
    var checkNum = (rule, value, callback) => {
      if (value <= 0 || value > 1000) {
        return callback(new Error('请输入1~1000内数字'))
      }
      callback()
    }
    // 开始时间不能早于当前时间
    var checkDate = (rule, value, callback) => {
      if (!value) return
      const start = value[0]
      const end = value[1]
      if (start >= end) {
        return callback(new Error('失效时间要大于有效时间，请重新选择'))
      }
      if (start < Date.now()) {
        return callback(new Error('有效时间不能早于当前时间，请重新选择'))
      }
      callback()
    }
    return {
      // dialogFormVisible: this.show || false,
      dialogPackageVisible: false,
      rules: {
        title: [
          { required: true, message: '请输入兑换码标题', trigger: 'blur' },
          { min: 1, max: 40, message: '最多可输入40字', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入兑换码数量', trigger: 'blur' },
          { type: 'number', message: '仅限输入数字，最大上限为1000' },
          { validator: checkNum, trigger: 'blur' }
        ],
        date: [
          {
            required: true,
            message: '请设置兑换码有效期',
            trigger: 'blur'
          },
          { validator: checkDate, trigger: ['blur', 'change'] }
        ],
        packageId: [
          {
            required: true,
            message: '请选择商品套餐',
            trigger: ['blur', 'change']
          }
        ],
        channelId: [
          { required: true, message: '请选择渠道', trigger: ['blur', 'change'] }
        ],
        customerSignId: [
          {
            required: true,
            message: '请选择标签',
            trigger: ['blur', 'change']
          }
        ]
      },
      form: {
        title: '',
        num: '',
        date: '',
        // startDate: '',
        // endDate: '',
        packageId: '',
        channelId: '',
        customerSignId: '', // 标签
        // 是否生成卡号  0 不生成 1生成
        isCardNo: 1
      },
      formLabelWidth: '120px',
      // 设置禁用时间，小于当前日期不可用
      pickerOptions: {
        disabledDate(date) {
          const now = new Date()
          now.setHours(0, 0, 0, 0)
          const today = now.getTime()
          if (new Date(date).getTime() < today) return true
          return false
        }
      },
      packageProduct: {}, // 选中的商品套餐
      // TODO:指定的渠道, 先写死 ！！！
      channelList: [
        {
          id: '2048',
          text: 'vip学员'
        }
      ],
      labelList: [],
      loading: false
    }
  },
  created() {
    this.getMarketingLabel()
  },
  methods: {
    /**
     * 创建
     */
    handleAdd(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(this.form)
        if (valid) {
          const obj = deepClone(this.form)
          // 组装开始-结束时间
          const { date } = obj
          Object.assign(obj, {
            startDate: date[0],
            endDate: date[1]
          })
          delete obj.date

          // TODO:套餐名称，渠道名称，标签名称
          console.log(this.packageProduct)
          const packageName = this.packageProduct?.name || ''
          const channelName =
            this.channelList.filter(
              (item) => item.id === this.form.channelId
            )[0].text || ''
          const customerSignName =
            this.labelList.filter(
              (item) => item.id === this.form.customerSignId
            )[0].name || ''
          Object.assign(obj, {
            packageName,
            channelName,
            customerSignName
          })
          console.log(obj)

          // 提交
          this.loading = true
          this.$http.Marketing.addRedeemCode(obj)
            .then((res) => {
              console.log(res)
              if (res?.code === 0) {
                this.resetForm()

                this.$confirm('码库创建成功！', '确认', {
                  confirmButtonText: '继续创建',
                  cancelButtonText: '返回列表'
                })
                  .then(() => {
                    this.$emit('confirm', true)
                  })
                  .catch(() => {
                    this.$emit('confirm', false)
                  })
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 取消创建
    handleCancel() {
      // this.dialogFormVisible = false
      this.resetForm()
      this.$emit('cancel')
    },

    /**
     * 重置表单
     */
    resetForm(formName = 'form') {
      this.$refs[formName].resetFields()
      this.packageProduct = {}
    },

    // 选择套餐
    handleSelectPackage() {
      this.dialogPackageVisible = true
    },

    // 获取套餐ID
    getPackageId(res) {
      console.log(res)
      this.form.packageId = res.id || ''
      this.packageProduct = res
      this.dialogPackageVisible = false
    },

    // 获取营销标签
    getMarketingLabel() {
      this.$http.Marketing.getMarketingLabelList().then((res) => {
        if (res?.code === 0 && res?.payload) {
          this.labelList = res.payload
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.package {
  &-btn {
    width: 90px;
    line-height: 28px;
    text-align: center;
    border: 1px dashed #2a75ed;
    color: #2a75ed;
    cursor: pointer;
    &:hover {
      background-color: #2a75ed;
      color: #fff;
    }
  }
  &-section {
    padding: 10px;
    line-height: 20px;
    background-color: #e3e3e380;
    h4 {
      margin: 0;
    }
    .red {
      color: #f56c6c !important;
    }
  }
}
.dialog-footer {
  text-align: center;
}
</style>
