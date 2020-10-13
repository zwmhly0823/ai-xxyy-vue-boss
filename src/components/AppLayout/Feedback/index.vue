<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-10 14:49:13
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-10-13 14:32:21
-->
<template>
  <div class="feed-main" v-show="feedShow">
    <div class="feed-close" @click="closeFeed">x</div>
    <div class="feed-con">
      <a target="_blank" href="https://msb.jinshuju.net/f/sdM8yQ">
        <i class="el-icon-s-comment"></i>
        <p class="feed-word">意见反馈</p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedShow: !localStorage.getItem('feedFlag')
    }
  },
  watch: {},
  created() {},
  methods: {
    closeFeed() {
      localStorage.setItem('feedFlag', true)
      this.feedShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.feed-main {
  position: fixed;
  right: 10px;
  bottom: 40px;
  background: #b8c1c1;
  width: 60px;
  height: 80px;
  .feed-close {
    float: right;
    padding-right: 5px;
    font-size: 20px;
    color: #6193c7;
  }
  .feed-con {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    background: cornflowerblue;
    color: white;
    font-size: 12px;
    padding: 10px 0;
    p {
      margin-top: 0;
    }
    .el-icon-s-comment {
      // padding-top: 10px;
      display: inline-block;
      font-size: 20px;
      padding-bottom: 3px;
    }
  }
}
</style>
