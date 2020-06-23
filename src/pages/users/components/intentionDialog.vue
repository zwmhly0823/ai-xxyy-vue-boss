<template>
  <div class="intent-dialog-box">
    <el-dialog
      class="dialog-class"
      title="沟通记录"
      :visible.sync="showIntentDialog"
      @closed="closed"
    >
      <el-form
        ref="intentForm"
        class="form-class"
        label-position="right"
        :model="formData"
        :rules="formRules"
      >
        <el-form-item label="意向度" prop="radio">
          <el-radio-group v-model="formData.radio" size="small">
            <el-radio-button label="中"></el-radio-button>
            <el-radio-button label="高"></el-radio-button>
            <el-radio-button label="低"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="textarea">
          <el-input
            type="textarea"
            class="textarea-class"
            placeholder="请输入内容"
            v-model="formData.textarea"
            maxlength="200"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showIntentDialog = false">
          取 消
        </el-button>
        <el-button size="mini" type="primary" @click="confirm">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'intentionDialog',
  data() {
    return {
      formRules: {
        radio: [
          { required: true, message: '请选择意向度等级', trigger: 'blur' }
        ]
        // textarea: [{ required: true, message: '请输入原因', trigger: 'blur' }]
      },
      showIntentDialog: false,
      formData: {
        radio: '',
        textarea: ''
      }
    }
  },
  methods: {
    showDialog(data) {
      this.showIntentDialog = true
      this.$nextTick(() => {
        if (data) {
          const arr = ['低', '中', '高']
          this.formData.radio = arr[data.type - 1]
          this.formData.textarea = data.describe
        }
      })
    },
    confirm() {
      this.$refs.intentForm.validate((valid) => {
        if (valid) {
          this.showIntentDialog = false
          this.$emit('intentConfirm', {
            radio: this.formData.radio,
            textarea: this.formData.textarea
          })
        } else {
          return false
        }
      })
    },
    closed() {
      this.$refs.intentForm.resetFields()
      this.$refs.intentForm.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.intent-dialog-box {
  .dialog-class {
    .form-class {
      .textarea-class {
        width: calc(100% - 60px);
        margin-left: 14px;
      }
      /deep/ .el-form-item__error {
        margin-left: 57px;
      }
    }
  }
}
</style>
