<template>
  <div class="app">
    <div class="classhead">
      <img src="@/assets/images/FinishClassHead.png" alt="" />
    </div>
    <div class="classconent">
      <img src="@/assets/images/Finishclasslist.png" class="img" alt="" />
      <div class="content">
        <div class="userinfo">
          <span class="userhead">
            <img src="../../../../assets/images/Stars.png" alt="" />
          </span>
          <span class="username">哈哈哈哈</span>
        </div>
        <div class="framebox" v-for="(item, index) in 3" :key="index">
          <span>
            <img
              class="topframe"
              src="../../../../assets/images/FinishClassHead.png"
              alt=""/>
            <img class="frame" src="../../../../assets/images/frame.png" alt=""
          /></span>
          <span>
            <img class="frame" src="../../../../assets/images/frame.png" alt=""
          /></span>
          <span>
            <img class="frame" src="../../../../assets/images/frame.png" alt=""
          /></span>
          <span>
            <img class="frame" src="../../../../assets/images/frame.png" alt=""
          /></span>
        </div>
      </div>
    </div>
    <div class="classfooter">
      <img src="@/assets/images/APPlogo.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.app {
  font-size: 0px;
  width: 750px;
  min-height: 1400px;
  background: #317bc6;
  box-sizing: border-box;
  padding-bottom: 60px;
  .classhead {
    width: 100%;
    height: 774.6px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .classconent {
    width: 100%;
    position: relative;
    .img {
      width: 373px;
      height: 94px;
      position: absolute;
      top: -47px;
      left: 24.47%;
    }
    .content {
      background: #fff;
      width: 695px;
      min-height: 300px;
      margin: 0px auto;
      border-radius: 28px;
      box-sizing: border-box;
      padding-left: 26px;
      padding-right: 26px;
      padding-top: 60px;
      padding-bottom: 66px;
      .userinfo {
        width: 100%;
        height: 51px;
        display: flex;
        .userhead {
          display: inline-block;
          width: 51px;
          height: 51px;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .username {
          font-size: 28px;
          color: #333;
          margin-left: 14px;
          line-height: 51px;
        }
      }
      .framebox {
        margin-top: 14px;
        width: 100%;
        height: 156px;
        display: flex;
        justify-content: space-between;
        span {
          display: inline-block;
          width: 156px;
          height: 156px;
          frame {
            width: 100%;
            height: 100%;
          }
          .topframe {
            position: absolute;
            clip: rect(0px, 120px, 120px, 0px);
            width: 120px;
          }
        }
      }
    }
  }
  .classfooter {
    width: 366px;
    height: 93px;
    margin: 0px auto;
    position: relative;
    margin-top: 40px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
