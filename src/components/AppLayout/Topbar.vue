<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-13 15:13:34
 * @Description: topbar 顶部功能区
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
        </el-dropdown-menu>
      </el-dropdown>
    </div>
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
  data() {
    return {
      isProd: false,
      userInfo: null,
      head: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png'
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
      location.href = `${baseUrl()}login/#/`
      // await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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
