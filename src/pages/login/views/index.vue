<!--
 * @Descripttion:
 * @version:
 * @Author: Shentong
 * @Date: 2020-03-13 15:24:11
 * @LastEditors: Shentong
 * @LastEditTime: 2020-11-02 20:46:40
 -->
<template>
  <div id="login" class="login-container">
    <div class="form-container">
      <!-- logo -->
      <div class="logo-container">
        <img src="../../../assets/images/boss.png" alt="" />
      </div>
      <div class="title-container login-type">
        <div
          :class="{ active: tabFirstActive }"
          @click="loginTypeHandle('codeLoginForm')"
        >
          密码登录
        </div>
        <div
          :class="{ active: !tabFirstActive }"
          @click="loginTypeHandle('pwdLoginForm')"
        >
          验证码登录
        </div>
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
            v-model.trim="pwdLoginForm.pwd"
            placeholder="密码"
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
        <el-button
          type="primary"
          style="width:100%;margin:30px atuo; height: 50px;"
          @click.native.prevent="pwdLoginHandle('pwdLoginForm')"
          >登录</el-button
        >
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
              >获取验证码</el-button
            >
            <el-button disabled plain v-else>
              <span style="width:20px;display:inline-block;">{{
                cutDown
              }}</span>
              <span>s 重试</span>
            </el-button>
          </div>
        </div>

        <el-button
          type="primary"
          style="width:100%;margin:30px atuo; height: 50px;"
          @click.native.prevent="pwdLoginHandle('codeLoginForm')"
          >登录</el-button
        >
      </el-form>
      <!-- 验证码登录 -->
    </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui'
import { setToken } from '@/utils/auth'
import { validatePwd } from '@/utils/validate'

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
        console.log('validatePwd', validatePwd('111'))
        // callback()
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
    return {
      cutDown: 60,
      timer: null,
      tabFirstActive: true,
      pwdLoginForm: {
        userName: '',
        pwd: '',
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
        userName: [
          { required: true, trigger: 'change', validator: validateUsername }
        ],
        pwd: [
          { required: true, trigger: 'change', validator: validatePassword }
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
  methods: {
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
      this.pwdLoginForm.pwd = this.pwdLoginForm.pwd.replace(test, '')
      this.codeLoginForm.phone = this.codeLoginForm.phone.replace(test, '')
    },
    // 通过密码登录
    async loginByPwd() {
      const pwdLoginIn = await this.$http.Login.pwdLoginIn(this.pwdLoginForm)

      if (pwdLoginIn && pwdLoginIn.payload) {
        return pwdLoginIn.payload
      }
    },
    // 通过验证码登录接口
    async loginBycode() {
      const codeLoginIn = await this.$http.Login.codeLoginIn(this.codeLoginForm)

      if (codeLoginIn && codeLoginIn.payload) {
        return codeLoginIn.payload
      }
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
      const path = pathname.replace(/login/, 'student-team')
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
        if (getToken && getToken.token) {
          setToken(getToken.token)
          if (getToken.teacher) {
            const {
              teacher,
              department,
              departmentId,
              duty,
              dutyId,
              rank,
              rankId
            } = getToken
            Object.assign(teacher, {
              department,
              departmentId,
              duty,
              dutyId,
              rank,
              rankId
            })
            localStorage.setItem('teacher', JSON.stringify(teacher || '{}'))
          }
          if (getToken.staff) {
            localStorage.setItem(
              'staff',
              JSON.stringify(getToken.staff || '{}')
            )
          }
          // 登录后，设置默认multiTabbed
          // const tabs = {
          //   [`${path}#/`]: { meta: { title: '班级中心' } }
          // }
          // sessionStorage.setItem('multiTabbed', JSON.stringify(tabs))
          // sessionStorage.setItem('currentMultiTab', `${path}#/`)

          location.href = `${path}#/`
        }

        // 以服务的方式调用的 Loading 需要异步关闭
        this.$nextTick(() => loadingInstance.close())
      }
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
