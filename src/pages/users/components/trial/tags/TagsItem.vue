<template>
  <el-tag :size="size" :closable="closable" class="tag-class">{{
    text
  }}</el-tag>
</template>

<script>
export default {
  name: 'tagsItem',
  props: {
    size: {
      type: String,
      default: 'mini'
    },
    text: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-class {
  margin: 2px 3px;
  border: none;
}
</style>
