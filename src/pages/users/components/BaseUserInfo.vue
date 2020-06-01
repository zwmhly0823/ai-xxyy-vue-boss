<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-05-20 21:37:01
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-05-20 21:37:01
 * @Description: 用户基础信息 - 头像，用户名，手机号，性别，生日，基础
 *  性别
    0: '',
    1: '男',
    2: '女',
    3: '保密'
 -->
<template>
  <div class="user-info" @click="onClick">
    <div class="user-info-l">
      <div class="user-info-head">
        <img :src="head" alt="" />
      </div>
      <i class="el-icon-male" v-if="user.sex === 1"></i>
      <i class="el-icon-female female" v-if="user.sex === 2"></i>
    </div>
    <div>
      <p>{{ user.username || '-' }} - {{ user.mobile || '' }}</p>
      <p>{{ birthday }} · {{ basePainting || '' }}</p>
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
      return this.user.birthday ? GetAgeByBrithday(this.user.birthday) : '-'
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
      this.$emit('handle-click', this.user.id)
    }
  }
}
</script>

<style lang="scss" scoped>
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
      width: 20px;
      height: 20px;
      line-height: 20px;
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
    width: 40px;
    height: 40px;
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
    color: #409eff;
  }
}
</style>
