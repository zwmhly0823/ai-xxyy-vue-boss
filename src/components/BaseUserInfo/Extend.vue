<!--
 * @Descripttion: 用户扩展信息 - 微信头像，手机号，扩展的标识：如vip，转介绍等信息icon。信息基于User表数据
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-13 10:58:05
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-16 12:24:32
-->
<template>
  <div class="user-info" :style="myStyle">
    <div class="user-info-head" v-if="isHead">
      <img :src="head" alt="" />
    </div>
    <div>
      <p class="primary-text">
        <span @click="onClick">{{ (user && user.mobile) || '-' }}</span>
      </p>
      <p>
        <i
          v-if="user && user.mobile"
          class="el-icon-document-copy mg-r-5"
          @click="handLeCopy(user.mobile)"
        ></i>
        <!-- vip 会员标识 -->
        <svg class="iconfont-vip  mg-r-5" v-if="is_sys_label_vip">
          <use xlink:href="#iconvip"></use>
        </svg>
        <!-- 转介绍会员标识 -->
        <i class="icon-referral" v-if="user && +user.send_id">转</i>
      </p>
    </div>
  </div>
</template>

<script>
import { copyText, openBrowserTab } from '@/utils/index'
export default {
  props: {
    // 是否显示头像
    isHead: {
      type: Boolean,
      default: true
    },
    // 自定义style
    myStyle: {
      type: Object,
      default: () => {}
    },
    // 点击手机号是否需要自定义 emit 回调事件，默认跳转用户详情
    callback: {
      type: Boolean,
      default: false
    },
    // 用户信息
    user: {
      type: Object,
      default: () => ({})
    },
    // 用户系统标签
    sysLabel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultHead:
        'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png?x-oss-process=image/resize,l_100'
    }
  },
  computed: {
    // 微信头像
    head() {
      const head = this?.user?.weixinUser?.avatar || this.defaultHead
      return `${head}`
    },
    // 是不是vip标签 - 固定标签: vip
    is_sys_label_vip() {
      if (!this.sysLabel || this.sysLabel === '-') return false
      const label = this.sysLabel.split(',')
      return label.includes('vip')
    }
  },
  methods: {
    // 点击用户信息事件回调, 参数是用户ID
    onClick() {
      if (this.callback) {
        this.$emit('handle-click', this.user)
        return
      }
      // 跳转用户详情
      if (!this.user?.id) {
        // this.$message.error('缺少用户信息')
        return
      }
      const { id } = this.user
      // 新标签打开详情页
      id && openBrowserTab(`/users/#/details/${id}`)
    },

    // 复制学员手机号
    handLeCopy(mobile) {
      copyText(mobile, '手机号不存在')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';
.user-info {
  display: flex;
  align-items: center;
  width: 130px;
  cursor: pointer;
  &-head {
    margin-right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    overflow: hidden;
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
    }
  }
  p {
    margin: 0;
    line-height: 14px;
    i {
      font-size: 13px;
      color: $blueTextColor;
    }
    .iconfont-vip {
      position: relative;
      top: 2px;
      width: 14px;
      height: 14px;
      fill: #f96137;
    }
    .icon-referral {
      display: inline-block;
      position: relative;
      top: -1px;
      padding: 1px 2px;
      line-height: 12px;
      border: 1px solid $dangerColor;
      color: $dangerColor;
      font-style: normal;
      font-size: 12px;
      border-radius: 2px;
      transform: scale(0.8);
    }
  }
  .mg-r-5 {
    margin-right: 5px;
  }
}
</style>
