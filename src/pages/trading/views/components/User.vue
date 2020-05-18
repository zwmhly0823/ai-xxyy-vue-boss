<!-- 用户信息 -->
<template>
  <section>
    <p v-if="!user">-</p>
    <div v-else>
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
import { GetAgeByBrithday } from '@/utils/index'
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    getAgeByBrithday(birthday) {
      return '- ' + GetAgeByBrithday(birthday)
    }
  }
}
</script>

<style lang="scss" scoped></style>
