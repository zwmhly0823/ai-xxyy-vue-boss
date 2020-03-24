<template>
  <div class="container">
    <div class="header">
      <span>用户及购买时间</span>
      <span>商品信息</span>
      <span>收货信息</span>
      <span>物流状态</span>
      <span>物流创建·揽收·签收时间</span>
    </div>
    <div class="mid-mes">
      <div class="mid-mes-user">
        <span>15888888888</span>
        <span>2020-03-24 23:48</span>
      </div>
      <div class="mid-mes-product">
        <span>精品实木画</span>
      </div>
      <div class="mid-mes-take">
        <span>团团</span>
        <span>15888888888</span>
        <div>
          <span>北京市</span>
          <span>北京市</span>
          <span>朝阳区</span>
        </div>
        <span>问问看看我看看的看看反馈付款多斯拉克马面雷神考虑对方</span>
      </div>
      <div class="mid-mes-logitics">
        <span>
          代发货
        </span>
        <span>
          追踪
        </span>
      </div>
      <div class="mid-mes-sign">
        <span>2020-03-24 23:48</span>
        <span>2020-03-24 23:48</span>
        <span>2020-03-24 23:48</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #fff;
  .header {
    margin-top: 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
  }
  .mid-mes {
    padding: 20px;
    display: flex;
    // flex-direction: column;
    justify-content: space-between;
    & div {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
