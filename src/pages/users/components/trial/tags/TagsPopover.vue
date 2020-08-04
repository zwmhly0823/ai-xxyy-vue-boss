<template>
  <div class="popover-box">
    <h4>学员当前标签</h4>
    <main>
      <div class="title">手动添加：个人库标签</div>
      <tags-item size="small" text="手动添加：个人库标签"></tags-item>
      <tags-item size="small" text="手动添加：个人库标签"></tags-item>
      <tags-item size="small" text="手动添加：个人库标签"></tags-item>
      <div class="title">手动添加：部门库标签</div>
      <div class="name">标签组名</div>
      <tags-item size="small" text="手动添加：个人库标签"></tags-item>
      <div class="name">标签组名</div>
      <tags-item size="small" text="手动添加：个人库标签"></tags-item>
      <div class="name">标签组名</div>
      <tags-item size="small" text="手动添加：个人库标签"></tags-item>
    </main>
  </div>
</template>

<script>
import tagsItem from './TagsItem.vue'
export default {
  name: 'tagsPopover',
  components: {
    tagsItem
  }
}
</script>

<style lang="scss" scoped>
.popover-box {
  width: 400px;
  height: 200px;
  overflow: auto;
  padding: 10px 0;
  h4 {
    margin: 0px;
    margin-bottom: 15px;
    font-size: 14px;
  }
  main {
    .title {
      color: #969495;
      margin: 10px 0;
    }
    .name {
      color: #dbdbdb;
      margin: 10px 0 5px;
    }
  }
}
</style>
