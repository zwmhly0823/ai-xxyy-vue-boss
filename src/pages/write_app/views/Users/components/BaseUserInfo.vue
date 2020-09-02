<!--
 * @Author: songyanan
 * @Email: songyanan@meishubao.com
 * @Date: 2020-08-27 16:47:01
 * @Last Modified by:   songyanan
 * @Last Modified time: 2020-05-28 15:37:01
 * @Description:
 -->
<template>
  <div class="user-info">
    <div>
      <p class="primary-text">
        <span @click="onClick" class="username">{{
          (user && user.username) || '--'
        }}</span>
        <span @click="onClick">{{ (user && user.mobile) || '' }}</span>
      </p>
      <p>
        <i class="el-icon-male" v-if="user && +user.sex === 1"></i>
        <i class="el-icon-female female" v-if="user && +user.sex === 2"></i>
        {{ birthday }} · {{ basePainting || '' }}·
        <span v-if="user && user.send_id > 0" style="color: rgb(255, 139, 140);"
          >R</span
        >
      </p>
    </div>
  </div>
</template>

<script>
import { GetAgeByBrithday } from '@/utils/index'
import { BASE_PAINTING } from '@/utils/enums'
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    uid: {
      type: String,
      default: ''
    }
  },
  computed: {
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
    // 点击用户信息事件回调, 参数是用户ID
    onClick() {
      const user = this.user
      if (this.uid) user.id = this.uid
      this.$emit('handle-click', this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../../assets/styles/mixin.scss';
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  &-l {
    position: relative;
    i {
      position: absolute;
      right: 10px;
      bottom: 0;
      background-color: #369bff;
      display: block;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 100%;
      overflow: hidden;
      color: #fff;
      text-align: center;
      font-weight: bolder;
      &.female {
        background-color: #f23589;
      }
    }
  }
  &-head {
    margin-right: 16px;
    width: 36px;
    height: 36px;
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
    // position: relative;
    i {
      position: relative;
      top: 5px;
      width: 18px;
      height: 18px;
      line-height: 18px;
      border-radius: 100%;
      overflow: hidden;
      text-align: center;
      font-weight: bolder;
      color: #369bff;
      &.female {
        color: #f23589;
      }
    }
    .iconfont-vip {
      position: relative;
      top: 2px;
      width: 14px;
      height: 14px;
      fill: #f96137;
    }
    .username {
      position: relative;
      top: 4px;
      width: 60px !important;
      display: inline-block;
      @include ellipsis();
    }
  }
}
</style>
