<template>
  <div>
    <a :href="to" target="_blank" v-if="link">
      <slot />
    </a>
    <router-link :to="to">
      <slot />
    </router-link>
  </div>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    link() {
      return isExternal(this.to)
    }
  }
}
</script>
