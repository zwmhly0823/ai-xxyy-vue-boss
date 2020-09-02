<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-03-13 15:13:34
 * @Description: topbar 顶部功能区
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-02 17:46:37
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
      <!-- 全局搜索学员 - 手机号、user_num -->
      <GlobelSearch class="globelSearch-con" />

      <!-- 功能区 入口; 目前只有 小熊美术 显示 -->
      <template v-if="currentSubject === 'art_app'">
        <a
          class="order-btn"
          href="https://shimo.im/docs/opMWovESib0pcyh0/"
          target="_blank"
          >帮助</a
        >
        <span class="item-line"></span>
        <el-badge
          :value="noticeBadge"
          :hidden="!noticeBadge"
          class="notices-content"
        >
          <span type="text" @click="clickNoticeTop" class="order-btn"
            >通知</span
          >
        </el-badge>
      </template>
      <!-- 功能区 入口 - end -->

      <!-- 用户信息 -->
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
          <el-dropdown-item @click.native="replacePassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 用户信息 end -->

      <!-- 多科目切换 -->
      <div class="subject-change">
        <el-dropdown
          @command="handleChangeSubject"
          trigger="hover"
          placement="bottom"
        >
          <div class="subject-change-title">
            <!-- {{ currentSubjectText }} -->
            科目
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown" class="subject-change-menu">
            <el-dropdown-item
              v-for="item in subjectsList"
              :command="item.key"
              :key="item.key"
              >{{ item.title }}
              <svg
                class="iconfont"
                aria-hidden="true"
                @click.stop.self="openNewTab(item.key)"
              >
                <use xlink:href="#iconopen"></use></svg
            ></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 通知中心列表 抽屉 -->
    <notice-center
      ref="noticeCenter"
      @reduceBadge="reduceBadge"
    ></notice-center>

    <!-- 修改用户密码 dialog -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="430px"
      :append-to-body="true"
    >
      <el-form style="height:30px;">
        <el-form-item label="新密码" label-width="15%">
          <el-input size="medium" v-model="newPassword" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          style="width:100px;"
          size="medium"
          @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button
          style="width:100px;"
          size="medium"
          type="primary"
          @click="handleSureReplacePassword"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from './Breadcrumb'
import GlobelSearch from './GlobelSearch'
import Hamburger from './Hamburger'
import { removeToken } from '@/utils/auth'
import { baseUrl, openBrowserTab } from '@/utils/index'
import noticeCenter from './noticeCenter/noticeCenter'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    noticeCenter,
    GlobelSearch
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'subjects']),
    subjectsList() {
      // 切换列表排除当前本身项目
      const list = this.subjects.subjectsList.filter(
        (item) => item.key !== this.subjects.currentSubjectKey
      )
      return list
    }
    // currentSubjectText() {
    //   return this.subjects.currentSubjectTitle
    // }
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
      newPassword: '',
      noticeBadge: 0,
      currentSubject: 'art_app'
    }
  },
  created() {
    const userInfo = localStorage.getItem('staff')
    this.isProd = location.origin.indexOf('prod') > -1
    if (!userInfo) {
      // this.logout() TODO: ? 。。。
      return
    }
    this.userInfo = JSON.parse(userInfo)

    this.getSubject()
    this.currentSubject = this.subjects.currentSubjectKey
    // 通知的角标数字
    this.currentSubject === 'art_app' && this.getNoticeBadge()
  },
  methods: {
    ...mapActions({
      getSubject: 'subjects/getSubject'
    }),
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
    },
    clickNoticeTop() {
      this.$refs.noticeCenter.openDrawer()
    },
    getNoticeBadge() {
      this.$http.NoticeCenter.getBadgeBoss({ staffId: this.userInfo.id })
        .then((res) => {
          if (res.code === 0 && res.status === 'OK') {
            this.noticeBadge = res.payload
          }
        })
        .catch(() => {
          console.log('获取消息数量角标失败')
        })
    },
    reduceBadge() {
      this.noticeBadge--
    },

    /**
     * 多科目切换 @isNew: 是否新浏览器标签打开
     */
    // 当前页面切换
    handleChangeSubject(command, isNew = false) {
      console.log(command, isNew)
      location.href =
        command !== 'art_app'
          ? `${baseUrl()}${command}/#/trialUsers`
          : `${baseUrl()}users/#/trial`
    },

    // 新标签页打开
    openNewTab(key) {
      console.log(key, 'new tab')
      // 非小熊美术
      if (key !== 'art_app') {
        openBrowserTab(`/${key}/#/trialUsers`)
      } else {
        openBrowserTab(`/users/#/trial`)
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
  .globelSearch-con {
    line-height: 46px;
    height: 100%;
    width: 220px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    margin-right: 20px;

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
    .item-line {
      display: inline-block;
      background-color: #bec0c3;
      width: 2px;
      height: 10px;
    }
    .order-btn {
      cursor: pointer;
      padding: 5px 10px;
      height: 20px;
      font-weight: 500;
      color: gray;
      font-size: 14px;

      // &:hover {
      //   background-color: #2a75ed;
      //   color: #fff;
      // }
    }

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
      top: 20px;
      font-size: 12px;
    }
    .notices-content {
      margin-right: 30px;
      /deep/ .el-badge__content.is-fixed {
        top: 12px;
      }
    }
  }
  // 多科目
  .subject-change {
    position: relative;
    float: right;
    min-width: 100px;
    margin-left: 10px;
    padding-left: 30px;
    border-left: 2px solid #bec0c3;
    cursor: pointer;
    &-title {
      position: relative;
      font-weight: 500;
    }
  }
}
.subject-change {
  &-menu {
    width: 135px;
    .iconfont {
      position: relative;
      top: 10px;
      float: right;
      width: 14px;
      margin-right: -5px;
      fill: #999;
      &:hover {
        fill: #2a75ed;
      }
    }
  }
}
</style>
