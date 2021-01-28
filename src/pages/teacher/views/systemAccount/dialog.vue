<!--
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-06-13 16:47:20
 * @LastEditors: songyanan
 * @LastEditTime: 2020-06-19 16:03:00
 -->
<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDialog"
    width="450px"
    @close="cacleHandle"
  >
    <el-form label-width="20%" ref="form">
      <el-form-item label="登录账号" :rules="{ required: true }">
        <el-input
          size="medium"
          v-model="form.userName"
          :disabled="handleType !== 'add'"
        />
      </el-form-item>
      <el-form-item
        v-if="handleType === 'add'"
        label="登录密码"
        :rules="{ required: true }"
      >
        <el-input size="medium" v-model="form.password" />
      </el-form-item>
      <el-form-item label="手机号" :rules="{ required: true }">
        <el-input
          type="number"
          size="medium"
          v-model="form.mobile"
          maxlength="11"
          onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          oninput="if(value.length>11)value=value.slice(0,11)"
          @wheel.native.prevent="stopScrollFun($event)"
        />
      </el-form-item>
      <el-form-item label="真实名字" :rules="{ required: true }">
        <el-input size="medium" v-model="form.realName" />
      </el-form-item>
      <el-form-item label="员工角色" :rules="{ required: true }">
        <employees-role
          employees="id"
          size="medium"
          :devalueValue="devalueValue"
          @search="handleSearchEmployees"
          class="search-container"
        />
      </el-form-item>
      <el-form-item label="账号状态" :rules="{ required: true }" class="status">
        <el-radio-group v-model="form.isLogin">
          <el-radio label="YES">启用</el-radio>
          <el-radio label="NO">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="cacleHandle">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    handleType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        this.isShowDialog = val
        if (!val) {
          this.initForm()
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      form: {
        userName: '' || this.editItem.user_name,
        password: this.handleType === 'add' ? '' : this.editItem.password,
        mobile: '' || this.editItem.mobile,
        realName: '' || this.editItem.real_name,
        id: '' || this.editItem.role_id, // 员工角色id
        isLogin:
          '' || this.editItem.is_login === '0'
            ? 'YES'
            : this.editItem.is_login === '1'
            ? 'NO'
            : ''
      },
      devalueValue: '' || this.editItem.role_id,
      isShowDialog: false
    }
  },
  methods: {
    handleSearchEmployees(res) {
      this.form.id = res.length !== 0 && res[0].term
    },
    handleSubmit() {
      const { form } = this
      console.log('form', form)
      const flag = Object.keys(form).some((item) => {
        return form[item] === ''
      })
      if (flag) {
        this.$message.warning('信息填写不完整～')
        return
      }
      this.$emit('submit')
    },
    cacleHandle() {
      this.$emit('cancleDialog')
    },
    initForm() {
      const form = this.form
      const keyArr = Object.keys(form)
      for (const key in keyArr) {
        if (form[keyArr[key]]) {
          form[keyArr[key]] = ''
        }
      }
    },
    stopScrollFun(evt) {
      evt = evt || window.event
      if (evt.preventDefault) {
        evt.preventDefault()
        evt.stopPropagation()
      } else {
        evt.cancelBubble = true
        evt.returnValue = false
      }
      return false
    }
  },
  components: {
    employeesRole: () => import('@/components/MSearch/index.vue')
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  margin: 0 !important;
  border: none;
}
/deep/ .el-input__inner {
  width: 300px;
}
/deep/ .el-card__body {
  padding-left: 0 !important;
}
/deep/ .el-input__inner {
  line-height: 20px;
  -moz-appearance: textfield;
}
/deep/ .el-input__inner::-webkit-outer-spin-button,
/deep/ .el-input__inner::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
.input-tip {
  position: absolute;
  left: 0;
  top: 30px;
  font-size: 12px;
  color: red;
}
.status {
  margin-bottom: 0 !important;
  margin-top: -40px;
}
.dialog-footer {
  text-align: center;
  .el-button--primary {
    margin-right: 40px;
  }
}
</style>
