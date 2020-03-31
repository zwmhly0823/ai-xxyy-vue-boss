<template>
  <div class="app">
    <div class="classhead">
      <img src="@/assets/images/FinishClassHead.png" alt="" />
    </div>
    <div class="classconent">
      <img src="@/assets/images/Finishclasslist.png" class="img" alt="" />
      <div class="content">
        <ul class="title">
          <li>宝贝信息</li>
          <li>W1D1</li>
          <li>W1D2</li>
          <li>W1D3</li>
          <li>W1D4</li>
        </ul>
        <!-- <ul class="Title">
          <li>宝贝信息</li>
          <li>W2D1</li>
          <li>W2D2</li>
          <li>W2D3</li>
          <li>W2D4</li>
        </ul> -->
        <ul class="information">
          <li><img src="@/assets/images/Stars.png" alt="" /></li>
          <li>哈哈哈</li>
          <li><img src="@/assets/images/Stars.png" alt="" /></li>
          <li><img src="@/assets/images/Stars.png" alt="" /></li>
          <li><img src="@/assets/images/Stars.png" alt="" /></li>
          <li><img src="@/assets/images/Stars.png" alt="" /></li>
        </ul>
      </div>
    </div>
    <div class="classfooter">
      <img src="@/assets/images/APPlogo.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.app {
  font-size: 0px;
  width: 750px;
  min-height: 1836px;
  background: #317bc6;
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
      padding-left: 33px;
      padding-right: 33px;
      padding-top: 60px;
      padding-bottom: 66px;
      .title {
        list-style: none;
        margin: 0px;
        padding: 0px;
        font-size: 24px;
        color: #666;
        li {
          float: left;
        }
        li:nth-child(2) {
          margin-left: 150px;
        }
        li:nth-child(3),
        li:nth-child(4),
        li:nth-child(5) {
          margin-left: 38px;
        }
      }
      .Title {
        list-style: none;
        margin: 0px;
        padding: 0px;
        font-size: 24px;
        color: #666;
        li {
          float: left;
        }
        li:nth-child(2) {
          margin-left: 157px;
        }
        li:nth-child(3),
        li:nth-child(4),
        li:nth-child(5) {
          margin-left: 36px;
        }
      }
      .information {
        font-size: 28px;
        color: #333;
        margin-top: 50px;
        list-style: none;
        margin: 0px;
        padding: 0px;
        li {
          float: left;
          img {
            width: 51px;
            height: 51px;
            border-radius: 50%;
          }
        }
        li:nth-child(2) {
          margin-left: 14px;
          margin-top: 10px;
        }
        li:nth-child(3) {
          margin-left: 110px;
        }
        li:nth-child(4),
        li:nth-child(5),
        li:nth-child(6) {
          margin-left: 51px;
        }
      }
    }
  }
  .classfooter {
    width: 366px;
    height: 93px;
    margin: 0px auto;
    position: relative;
    bottom: -370px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
