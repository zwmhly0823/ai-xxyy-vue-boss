<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-03-14 15:11:17
 * @LastEditors: Shentong
 * :max-height="maxHeight"
 * @LastEditTime: 2020-12-25 16:30:46
 -->
<template>
  <div class="single-img-preview">
    <el-image-viewer
      class="head-portrait"
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[url]"
    />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    showViewer: {
      type: Boolean,
      default: false
    }
  },
  components: { ElImageViewer },
  data() {
    return {}
  },
  methods: {
    closeViewer() {
      this.$emit('update:showViewer', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.single-img-preview {
  .head-portrait {
    // height: 100%;
    // width: 100%;
    // border-radius: 50%;
    /deep/ .el-image-viewer__mask {
      opacity: 0.2;
    }
    /deep/ .el-image-viewer__canvas img {
      transform: scale(0.8) rotate(0deg) !important;
    }
    /deep/ .el-icon-circle-close {
      color: #fff !important;
    }
    // /deep/ el-image-viewer__btn.el-image-viewer__close {
    //   color: #fff !important;
    // }
  }
}
</style>
