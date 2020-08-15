<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-30 19:21:08
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-15 20:00:45
-->
<template>
  <el-dialog
    :title="isEdit ? '编辑内容' : '添加内容'"
    :visible.sync="centerDialog"
    width="60%"
    top="20vh"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    custom-class="dialog-custom"
  >
    <div class="dialog-center">
      111
  </el-dialog>
</template>
<script>
import { debounce } from 'lodash'
export default {
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false
    },
    content: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      addContentForm: {
        imgUrl: '',
        textarea: ''
      },
      changeEmojiToggle: false,
      dialogVisible: false,
    }
  },
  components: {
    EmojiList
    // VEmojiPicker
  },
  computed: {
    centerDialog() {
      return this.centerDialogVisible
    }
  },
  created() {},
  mounted() {},
  methods: {
    /** img-upload */
    dialogClose() {
      this.$emit('dialogOperate', { close: true })
    },
    /** 新增内容底部按钮操作 */
    dialogOperate(type) {
      this.$emit('dialogOperate', { close: true })
    }
  }
}
</script>
<style>
.el-scrollbar__wrap {
  overflow-x: auto;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-center {
  border: 1px solid #ebeef3;
  border-radius: 5px;

  .edit-content {
    padding: 15px;
    min-height: 180px;
  }
}
.dialog-footer {
  &.is-edit {
  }
}
</style>
