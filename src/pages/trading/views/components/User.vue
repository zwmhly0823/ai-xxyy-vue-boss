<!-- 用户信息 -->
<template>
  <section>
    <p v-if="!user">-</p>
    <div v-else class="primary-text" @click="openUserDetail(user.id, user)">
      <p>
        {{ user.username || '-' }}
        {{
          user.birthday
            ? user.birthday !== '0'
              ? getAgeByBrithday(user.birthday)
              : ''
            : ''
        }}
      </p>
      <p>{{ user.mobile || '-' }}</p>
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
    }
  },
  methods: {
    getAgeByBrithday(birthday) {
      return '- ' + GetAgeByBrithday(birthday)
    },
    // 打开用户详情
    openUserDetail(uid, row) {
      row && console.log(row)
      console.log(this.singleData && this.singleData.isrefund)
      if (Object.keys(this.singleData).length) {
        uid &&
          openBrowserTab(
            `/users/#/details/${uid}?isrefund=${this.singleData.isrefund}`
          )
      } else {
        uid && openBrowserTab(`/users/#/details/${uid}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
