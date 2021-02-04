<template>
  <div class="wechat-info">
    <template v-if="wechat.wechat_id">
      <div class="wechat-info-head">
        <img :src="head" alt="" />
      </div>
      <span>{{ wechat.wechat_nick_name }}</span>
    </template>
    <template v-else>
      <div>未绑定</div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    // 用户信息
    wechat: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      defaultHead:
        'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png?x-oss-process=image/resize,l_100'
    }
  },
  computed: {
    // APP头像
    head() {
      const headUrl = this.wechat.wechat_avatar
      const head =
        (headUrl && `${headUrl}?x-oss-process=image/resize,l_100`) ||
        this.defaultHead
      return `${head}`
    }
  },
  created() {
    // console.log(this.wechat)
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/variables.scss';
.wechat-info {
  display: flex;
  align-items: center;
  // width: 130px;
  cursor: pointer;
  &-head {
    display: inline-block;
    margin-right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    overflow: hidden;
    background-color: #eee;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
