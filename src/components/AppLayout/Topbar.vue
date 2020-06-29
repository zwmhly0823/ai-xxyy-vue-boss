<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-13 15:13:34
 * @Description: topbar 顶部功能区
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-06-22 22:50:43
 -->
<template>
  <div class="navbar" :class="{ prod: isProd }">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
      v-if="false"
    />
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb-container" />

    <!-- 预发布环境提示 -->
    <div v-if="isProd" style="flex: 1; margin: 0 40px;">
      <el-alert
        title="警告：当前是预发布环境，仅供特殊情况下使用！！！"
        type="error"
        effect="dark"
        center
        :closable="false"
      >
      </el-alert>
    </div>

    <div class="right-menu">
      <a
        class="talk-btn"
        href="https://wgjkf.xiaoxiongmeishu.com"
        target="_blank"
        >进入聊天工作台</a
      >
      <el-dropdown class="avatar-container" trigger="click">
        <div class="user-info">
          <div class="avatar-wrapper">
            <img
              :src="userInfo ? userInfo.head || head : head"
              class="user-avatar"
            />
          </div>
          <p>{{ userInfo ? userInfo.realName : '' }}</p>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link> -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="replacePassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="430px"
      :append-to-body="true"
    >
      <el-form>
        <el-form-item label="新密码" label-width="15%">
          <el-input size="medium" v-model="newPassword" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSureReplacePassword"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import { removeToken } from '@/utils/auth'
import { baseUrl } from '@/utils/index'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.newPassword = ''
      }
    }
  },
  data() {
    return {
      isProd: false,
      userInfo: null,
      head: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png',
      dialogVisible: false,
      newPassword: ''
    }
  },
  created() {
    const userInfo = localStorage.getItem('staff')
    this.isProd = location.origin.indexOf('prod') > -1
    if (!userInfo) {
      this.logout()
      return
    }
    this.userInfo = JSON.parse(userInfo)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      removeToken()
      console.log('baseUrl:', baseUrl())
      location.href = `${baseUrl()}login/#/`
      // await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    replacePassword() {
      this.dialogVisible = true
    },
    async handleSureReplacePassword() {
      const { userInfo, newPassword } = this
      if (newPassword === '') {
        this.$message.warning('请填写密码～')
        return
      }
      try {
        const res = await this.$http.Login.resetPwd(userInfo.id, newPassword)
        if (res.code === 0) {
          this.$message.success('密码修改成功～')
          this.dialogVisible = false
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  &.prod {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 15px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    .talk-btn {
      margin-right: 20px;
      padding: 5px 10px;
      height: 20px;
      border: 1px solid #2a75ed;
      color: #2a75ed;
      border-radius: 20px;
      font-size: 12px;
      &:hover {
        background-color: #2a75ed;
        color: #fff;
      }
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0px 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      p {
        margin: 0 0 0 8px;
      }
    }

    .avatar-container {
      margin-right: 30px;
      height: 50px;
      line-height: 50px;
      .avatar-wrapper {
        height: 50px;
        line-height: 50px;
        position: relative;

        .user-avatar {
          vertical-align: middle;
          display: inline-block;
          width: 32px;
          height: 32px;
          border-radius: 100%;
          border: 1px solid #e5e5e5;
        }
      }
    }
    .el-icon-arrow-down {
      position: absolute;
      right: -20px;
      top: 22px;
      font-size: 12px;
    }
  }
}
</style>
