<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-03-17 11:22:08
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-28 20:51:49
 -->
<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <p class="sidebar-logo">
          <img v-if="logo" :src="logoSmall" />
        </p>
        <!-- <h1 v-else class="sidebar-title">{{ title }}</h1> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <p class="sidebar-logo">
          <img v-if="logo" :src="logo" />
        </p>
        <!-- <h1 class="sidebar-title">{{ title }}</h1> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
import Logo from '@/assets/images/boss.png'
// import ArtAppLogo from '@/assets/images/art_app_boss.png'
// import WriteAppLogo from '@/assets/images/write_app_boss.png'
import LogoSmall from '@/assets/images/boss-64.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '', // 小熊美术TOSS
      // logo: Logo,
      logoSmall: LogoSmall
    }
  },
  computed: {
    logo() {
      let src = Logo
      const index = +this.$store.getters.subjects.subjectCode
      if (index === 0) {
        src = ArtAppLogo
      } else if (index === 1) {
        src = WriteAppLogo
      }
      return src
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #293042;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      margin: 0 auto;
      width: 115px;
      vertical-align: middle;
      text-align: center;
      img {
        vertical-align: middle;
        width: 100%;
      }
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      width: 42px;
      // height: 32px;
    }
  }
}
</style>
