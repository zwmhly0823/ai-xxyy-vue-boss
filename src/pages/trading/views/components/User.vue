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
      uid && openBrowserTab(`/users/#/details/${uid}`)
    }
  }
}
</script>

<style lang="scss" scoped></style>
