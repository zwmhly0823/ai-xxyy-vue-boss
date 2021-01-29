<!--
 * @Descripttion: 用户基础信息 - 用户昵称、年龄、性别、有无基础
 * @version: 1.0.0
 * @Author: YangJiyong
 * @Date: 2020-08-13 10:58:05
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-08-17 15:40:25
 性别
    0: '',
    1: '男',
    2: '女',
    3: '保密'
-->
<template>
  <div class="user-info" :style="myStyle" @click="onClick">
    <p class="d-flex">
      <i class="el-icon-male male" v-if="user && +user.sex === 1"></i>
      <i class="el-icon-female female" v-if="user && +user.sex === 2"></i>
      <span class="username">{{ (user && user.username) || '-' }}</span>
    </p>
    <p>{{ birthday }} · {{ basePainting || '' }}</p>
  </div>
</template>

<script>
import { GetAgeByBrithday } from '@/utils/index'
import { BASE_PAINTING } from '@/utils/enums'
export default {
  props: {
    // 用户信息
    user: {
      type: Object,
      default: () => ({})
    },
    // 自定义style
    myStyle: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png'
    }
  },
  computed: {
    // 头像
    head() {
      const head = (this.user && this.user.head) || this.defaultHead
      return `${head}?x-oss-process=image/resize,l_100`
    },

    // 生日
    birthday() {
      return this.user && this.user.birthday
        ? GetAgeByBrithday(this.user.birthday)
        : '-'
    },
    // 绘画基础
    basePainting() {
      const base = this.user
        ? this.user.base_painting || this.user.basepainting
        : ''
      return base ? BASE_PAINTING[base] : '-'
    }
  },
  methods: {
    // 预留：点击用户信息事件回调, 参数是用户信息
    onClick() {
      this.$emit('handle-click', this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/mixin.scss';
// @import '../../assets/styles/variables.scss';
.user-info {
  // cursor: pointer;
  p {
    margin: 0;
    i {
      // position: relative;
      // top: 5px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 100%;
      overflow: hidden;
      text-align: left;
      font-weight: bolder;
      &.male {
        color: #59cbff;
      }
      &.female {
        color: #f23589;
      }
    }
    .username {
      // position: relative;
      // top: 4px;
      display: inline-block;
      @include ellipsis();
    }
  }
}
</style>
