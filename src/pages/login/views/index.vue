<!--
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-06 17:48:07
 -->
<template>
  <div id="login" class="login-container">
    <div class="form-container">
      <!-- logo -->
      <div class="logo-container">
        <img src="../../../assets/images/boss.png" alt />
      </div>
      <div class="title-container login-type">
        <div :class="{ active: tabFirstActive }" @click="loginTypeHandle('codeLoginForm')">密码登录</div>
        <div :class="{ active: !tabFirstActive }" @click="loginTypeHandle('pwdLoginForm')">验证码登录</div>
      </div>
      <!-- 密码登录 -->
      <el-form
        v-if="tabFirstActive"
        ref="pwdLoginForm"
        :rules="pwdLoginRules"
        :model="pwdLoginForm"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="userName">
          <span class="svg-container">
            <i class="el-icon-user-solid"></i>
          </span>
          <el-input
            v-model.trim="pwdLoginForm.userName"
            placeholder="请输入用户名"
            name="userName"
            type="text"
            auto-complete="on"
            maxlength="18"
            @focus="checkStart"
            @blur="checkEnd"
          />
        </el-form-item>
        <el-form-item prop="pwd">
          <span class="svg-container">
            <i class="el-icon-lock"></i>
          </span>
          <el-input
            :type="passwordType"
            v-model.trim="pwdLoginForm.password"
            placeholder="密码"
            maxlength="16"
            name="password"
            auto-complete="on"
            @focus="checkStart"
            @blur="checkEnd"
            @keyup.enter.native="pwdLoginHandle('pwdLoginForm')"
          />
          <span class="show-pwd" @click="showPwd">
            <i class="el-icon-view" v-if="passwordType"></i>
            <i class="el-icon-key" v-else></i>
          </span>
        </el-form-item>
        <el-form-item prop="codeImage">
          <div style="display:flex;justify-content:flex-start;align-item:center;">
            <span class="svg-container">
            <i class="el-icon-user-solid"></i>
          </span>
          <el-input
            v-model.trim="pwdLoginForm.codeImage"
            placeholder="请计算验证码"
            name="codeImage"
            type="text"
            auto-complete="on"
            maxlength="18"
            @focus="checkStart"
            @blur="checkEnd"
            @keydown.enter.native="pwdLoginHandle('pwdLoginForm')"
          />
          <div style="height:52px;" @click="getVerificationCode">
            <img style="width:auto;height:100%;" :src="`${verificationUrl}?T=${verificationTime}`" alt />
          </div>
          </div>
        </el-form-item>
        <el-button
          type="primary"
          style="width:100%;margin:30px atuo; height: 50px;"
          @click="pwdLoginHandle('pwdLoginForm')"
        >登录</el-button>
      </el-form>

      <!-- 验证码登录 -->
      <el-form
        v-else
        ref="codeLoginForm"
        :rules="codeLoginRules"
        :model="codeLoginForm"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <el-form-item prop="phone">
          <span class="svg-container">
            <i class="el-icon-mobile-phone"></i>
          </span>
          <el-input
            v-model.trim="codeLoginForm.phone"
            placeholder="请输入手机号"
            name="phone"
            type="text"
            auto-complete="on"
            maxlength="11"
            @input="
              codeLoginForm.phone = codeLoginForm.phone.replace(/[^\d]/g, '')
            "
          />
        </el-form-item>
        <div class="code-form-outer">
          <el-form-item prop="code">
            <span class="svg-container">
              <i class="el-icon-lock"></i>
            </span>
            <el-input
              v-model.trim="codeLoginForm.code"
              placeholder="验证码"
              name="password"
              auto-complete="on"
              maxlength="6"
              style="ime-mode:disabled;"
              @focus="checkStart"
              @blur="checkEnd"
              @keyup.enter.native="pwdLoginHandle('codeLoginForm')"
            />
          </el-form-item>
          <div class="button-timer">
            <el-button
              v-if="cutDown == 60"
              class="get-code"
              type="primary"
              @click.prevent="getCodeHandle()"
            >获取验证码</el-button>
            <el-button disabled plain v-else>
              <span style="width:20px;display:inline-block;">
                {{
                cutDown
                }}
              </span>
              <span>s 重试</span>
            </el-button>
          </div>
        </div>

        <el-button
          type="primary"
          style="width:100%;margin:30px atuo; height: 50px;"
          @click.native.prevent="pwdLoginHandle('codeLoginForm')"
        >登录</el-button>
      </el-form>
      <!-- 验证码登录 end -->
      <!-- 修改用户密码 dialog -->
      <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="600px"
        top="22vh"
        :append-to-body="true"
      >
        <span class="update-pwd_tip">
          <span style="margin-right:5px">⚠️</span>
          系统检测到您当前账号密码安全等级较低，请修改密码后重新登录
        </span>
        <el-form
          ref="updatePwd"
          :model="updatePwd"
          :rules="updatePwdRules"
          style="margin-top:10px;"
        >
          <el-form-item label="新密码" label-width="15%" prop="newPassword">
            <el-input size="medium" v-model="updatePwd.newPassword" />
          </el-form-item>
          <el-form-item>
            <div class="operate-btn">
              <!-- <el-button
                style="width:100px;"
                size="medium"
                @click="dialogVisible = false"
                >取 消</el-button
              >-->
              <el-button
                style="width:100px;"
                size="medium"
                type="primary"
                @click="handleSureReplacePassword('updatePwd')"
              >确 认</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui'
import { setToken } from '@/utils/auth'
import { validatePwd } from '@/utils/validate'
import { isToss } from '@/utils/index'

const valid = {
  isPhoneNum(str) {
    return /^1(3|4|5|6|7|8|9)\d{9}$/.test(str)
  },
  isUserName(str) {
    return /^[0-9A-Za-z]{2,18}$/.test(str)
  }
}
export default {
  data() {
    // 验证手机号
    const validatePhone = (urle, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号哟~'))
      } else if (!valid.isPhoneNum(value)) {
        callback(new Error('请输入正确的手机号哦~'))
      } else {
        callback()
      }
    }
    // 验证用户名
    const validateUsername = (urle, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'))
      } else if (!valid.isUserName(value)) {
        callback(new Error('请输入正确的账号哦~'))
      } else {
        callback()
      }
    }
    // 密码
    const validatePassword = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatecode = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('请填写验证码'))
      } else {
        callback()
      }
    }
    // 修改密码验证
    const validatePass = (rule, value, callback) => {
      console.log(validatePwd(value))
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (!validatePwd(value)) {
        callback(
          new Error('密码至少包含大小写字母、数字、特殊字符大于8个字符!')
        )
      } else {
        callback()
      }
    }
    return {
      verificationUrl: '/api/b/v1/kaptcha/getCodeImage/account',
      verificationTime:'',
      userInfo: null,
      updatePwdRules: {
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 8, message: '长度在8个字符以上', trigger: 'blur' }
        ]
      },
      updatePwd: {
        newPassword: ''
      },
      dialogVisible: false,
      cutDown: 60,
      timer: null,
      tabFirstActive: true,
      pwdLoginForm: {
        codeImage:'',
        userName: '',
        password: '',
        origin: 1 // 标记后端登录
      },
      codeLoginForm: {
        phone: '',
        code: '',
        origin: 1 // 标记后端登录
      },
      checkInterval: '',
      passwordType: 'password',
      pwdLoginRules: {
        codeImage:[{ required: true,max: 4, message: '请根据图片计算验证码', trigger: 'change' }],
        userName: [
          { required: true, trigger: 'change', validator: validateUsername }
        ],
        password: [
          {
            required: true,
            max: 16,
            trigger: 'change',
            validator: validatePassword
          }
        ]
      },
      codeLoginRules: {
        phone: [
          { required: true, trigger: 'change', validator: validatePhone }
        ],
        code: [{ required: true, trigger: 'change', validator: validatecode }]
      }
    }
  },
  computed: {},
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.updatePwd.newPassword = ''
      }
    }
  },
  methods: {
    // 切换验证码
    getVerificationCode() {
      this.verificationTime = new Date().getTime();
    },
    // 切换登录方式点击事件
    loginTypeHandle(loginType) {
      if (this.$refs[loginType]) {
        this.resetForm(loginType)
        this.tabFirstActive = !this.tabFirstActive
      }
    },
    // 根据手机号获取验证码
    getCodeHandle() {
      this.$refs.codeLoginForm.validateField('phone', (valid) => {
        if (!valid) {
          this.$http.Login.getCodeByPhone({ mobile: this.codeLoginForm.phone })
            .catch((err) => console.log(err))
            .then((res) => {
              if (res && res.payload) {
                this.$message.success('验证码已发送')
                !this.timer && this.startInterval()
              }
            })
        }
      })
    },
    // 禁止输入中文
    checkStart() {
      this.checkInterval = setInterval(this.checkChinese, 100)
    },
    checkEnd() {
      clearInterval(this.checkInterval)
    },
    checkChinese() {
      // 禁止输入中文
      const test = /[\u4e00-\u9fa5]/gi
      // /[^0-9A-Za-z]/g
      this.codeLoginForm.code = this.codeLoginForm.code.replace(test, '')
      this.pwdLoginForm.userName = this.pwdLoginForm.userName.replace(test, '')
      this.pwdLoginForm.password = this.pwdLoginForm.password.replace(test, '')
      this.codeLoginForm.phone = this.codeLoginForm.phone.replace(test, '')
    },
    // 通过密码登录
    async loginByPwd() {
      const pwdLoginIn = await this.$http.Login.pwdLoginIn(this.pwdLoginForm)
      setToken(`Bearer ${pwdLoginIn.payload.accessToken}`)

      const authRouter = await this.$http.Login.getCurrentRouter();
      let result = {}
      if (pwdLoginIn && pwdLoginIn.payload) {
        result.accessToken = pwdLoginIn.payload.accessToken
      }
      if (authRouter && authRouter.payload) {
        result.staff = authRouter.payload.staff;
        result.menuList = authRouter.payload.menuList;
      }
      return result;
    },
    // 通过验证码登录接口
    async loginBycode() {
      const codeLoginIn = await this.$http.Login.codeLoginIn(this.codeLoginForm)

      setToken(`Bearer ${codeLoginIn.payload.accessToken}`)
      const authRouter = await this.$http.Login.getCurrentRouter();
      let result = {}


      if (codeLoginIn && codeLoginIn.payload) {
        result.accessToken = codeLoginIn.payload.accessToken
      }
      if (authRouter && authRouter.payload) {
        result.staff = authRouter.payload.staff;
        result.menuList = authRouter.payload.menuList;
      }
      return result;
    },
    // 切换密码小眼睛
    showPwd() {
      this.passwordType === 'password'
        ? (this.passwordType = '')
        : (this.passwordType = 'password')
    },
    // form表单登录时校验
    judegeValidate(formName) {
      return this.$refs[formName].validate(valid)
    },
    // 登录btn
    async pwdLoginHandle(formName) {
      let getToken
      const { pathname } = location
      let path = pathname.replace(/login/, 'dashboard')
      // 校验回调返回的是Promise
      const validatePromise = await this.judegeValidate(formName).catch((err) =>
        console.log(err)
      )
      if (validatePromise) {
        const loadingInstance = Loading.service({
          target: 'section',
          lock: true,
          text: '正在登录...',
          fullscreen: true
        })

        formName === 'pwdLoginForm'
          ? (getToken = await this.loginByPwd().catch((err) =>
              console.log(err)
            ))
          : (getToken = await this.loginBycode().catch((err) =>
              console.log(err)
            ))

        if (getToken && getToken.accessToken) {

          // if (getToken.teacher) {
          //   const {
          //     teacher,
          //     department,
          //     departmentId,
          //     duty,
          //     dutyId,
          //     rank,
          //     rankId
          //   } = getToken
          //   Object.assign(teacher, {
          //     department,
          //     departmentId,
          //     duty,
          //     dutyId,
          //     rank,
          //     rankId
          //   })
          //   localStorage.setItem('teacher', JSON.stringify(teacher || '{}'))
          // }
          if (getToken.staff) {
            // 前端设置权限管理
            localStorage.setItem(
              'staff',
              JSON.stringify(getToken.staff || '{}')
            )
            // 如果是 教研 角色，跳转到 设置-员工帐号
            // if (getToken.staff.roleId === '19') {
            //   path = path.replace(/student-team/, 'teacher')
            // }
          }
          if(getToken.menuList) {
            localStorage.setItem(
              'menuList',
              JSON.stringify(getToken.menuList || '{}')
            )
          }
          // 登录后，设置默认multiTabbed
          // const tabs = {
          //   [`${path}#/`]: { meta: { title: '班级中心' } }
          // }
          // sessionStorage.setItem('multiTabbed', JSON.stringify(tabs))
          // sessionStorage.setItem('currentMultiTab', `${path}#/`)

          // 检测用户登录的密码是否合法 TODO:
          // if (formName === 'pwdLoginForm') {
          //   if (validatePwd(this.pwdLoginForm.pwd)) {
          //     location.href = `${path}#/`
          //   } else {
          //     this.getUserInfo()
          //     this.dialogVisible = true
          //   }
          // } else {
            console.log('path', path);
          location.href = `${path}#/`
          // }
        }

        // 以服务的方式调用的 Loading 需要异步关闭
        this.$nextTick(() => loadingInstance.close())
      }
    },
    async handleSureReplacePassword(formName) {
      // 校验回调返回的是Promise
      const validatePwd = await this.judegeValidate(formName).catch((err) =>
        console.log(err)
      )
      if (validatePwd) {
        const {
          userInfo: { id },
          updatePwd: { newPassword }
        } = this

        try {
          const res = await this.$http.Login.resetPwd(id, newPassword)
          if (res.code === 0) {
            this.$message.success('密码修改成功～')
            this.pwdLoginForm.password = ''
            this.dialogVisible = false
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    getUserInfo() {
      let itemType = 'teacher'
      const teacherId = isToss()

      if (!teacherId) itemType = 'staff'

      const userInfo = localStorage.getItem(itemType)

      this.userInfo = JSON.parse(userInfo)
    },
    resetForm(formName) {
      this.passwordType = 'password'
      this.$refs[formName].resetFields()
    },
    startInterval() {
      this.timer = setInterval(() => {
        if (this.cutDown > 0) {
          this.cutDown--
        } else {
          clearInterval(this.timer)
          this.timer = null
          this.cutDown = 60
        }
      }, 1000)
    }
  },
  created() {
    // 根据url获取地址
    this.verificationUrl = location.origin + this.verificationUrl
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
$bg: #283443;
$light_gray: #eee;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      // color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.operate-btn {
  display: flex;
  justify-content: flex-end;
}
.update-pwd_tip {
  color: #e6a23c;
  margin-left: 30px;
  line-height: 30px;
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .form-container {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 150px auto;
    overflow: hidden;
    .logo-container {
      text-align: center;
      margin-bottom: 30px;
      > img {
        height: 50px;
      }
    }
  }
  .login-form {
    .code-form-outer {
      display: flex;
      .el-form-item {
        flex: 1;
      }
      .button-timer {
        height: 52px;
        margin: 0px 0 0 20px;
        button {
          height: 100%;
        }
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
    &.login-type {
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: space-around;
      color: #fff;
      font-size: 16px;
      div {
        cursor: pointer;
        &.active {
          color: #2a75ed;
        }
      }
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
}
</style>
