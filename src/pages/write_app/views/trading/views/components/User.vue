<!--
 * @Descripttion: 
 * @version: 
 * @Author: panjian
 * @Date: 2020-07-08 13:40:39
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-09-01 22:20:30
-->
<!-- 用户信息 -->
<template>
  <section>
    <p v-if="!user">-</p>
    <div v-else class="primary-text">
      <p @click="openUserDetail(user.id, user)">
        {{ user.username || '-' }}
        {{
          user.birthday
            ? user.birthday !== '0'
              ? getAgeByBrithday(user.birthday)
              : ''
            : ''
        }}
      </p>
      <p>
        <span @click="openUserDetail(user.id, user)">{{
          user.mobile || '-'
        }}</span>
      </p>
    </div>
  </section>
</template>
<script>
import { GetAgeByBrithday, openBrowserTab } from '@/utils/index'
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    singleData: {
      type: Object,
      default: () => ({})
    },
    flag: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getAgeByBrithday(birthday) {
      return '- ' + GetAgeByBrithday(birthday)
    },
    // 打开用户详情
    openUserDetail(uid, row) {
      if (this.flag) {
        return false
      }
      row && console.log(row)
      console.log(this.singleData && this.singleData.isrefund)
      if (Object.keys(this.singleData).length) {
        uid &&
          openBrowserTab(
            `/write_app/#/details/${uid}?isrefund=${this.singleData.isrefund}`
          )
      } else {
        uid && openBrowserTab(`/write_app/#/details/${uid}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
