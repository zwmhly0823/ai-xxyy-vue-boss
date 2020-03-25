<template>
  <div class="container">
    <div class="mess">
      <div class="mess-item-user">
        <div class="header">
          <span class="top">用户及购买时间</span>
        </div>
        <div class="text">
          <span>16789098976</span>
          <span>19-03-30</span>
        </div>
      </div>
      <div class="mess-item-product">
        <div class="header">
          <span class="top">商品信息</span>
        </div>
        <div class="text">
          <span>小熊美术体验课随材礼包</span>
        </div>
      </div>
      <div class="mess-item-express">
        <div class="header">
          <span class="top">收货信息</span>
        </div>
        <div class="text">
          <div>
            <span>团团 13432567865</span>
          </div>
          <div>
            <span>北京市</span>
            <span>北京市</span>
            <span>朝阳区</span>
          </div>
          <div>
            <span>
              读课文凯迪拉克没得看了都快来试试看的开始卡卡；乐扣乐扣；安康
            </span>
          </div>
        </div>
      </div>
      <div class="mess-item-logtics">
        <div class="header">
          <span class="top">物流状态</span>
        </div>
        <div class="text">
          <span>待发货</span>
          <span>追踪</span>
        </div>
      </div>
      <div class="mess-item-take">
        <div class="header">
          <span class="top">物流创建·揽收·签收时间</span>
        </div>
        <div class="text">
          <span>20-03-23 23:12:54</span>
          <span>20-03-23 23:12:54</span>
          <span>20-03-23 23:12:54</span>
        </div>
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
  .mess {
    margin-top: 10px;
    display: flex;
    padding: 10px;
    font-size: 12px;
    &-item {
      &-user {
        width: 15%;
        .header {
          padding: 5px 0 10px 0;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;

          height: 100px;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
      }
      &-product {
        width: 20%;
        .header {
          padding: 5px 0 10px 0;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;

          height: 100px;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
      }
      &-express {
        width: 30%;
        .header {
          padding: 5px 0 10px 0;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;

          height: 100px;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
      }
      &-logtics {
        width: 10%;
        .header {
          padding: 5px 0 10px 0;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
        .text {
          display: flex;
          flex-direction: column;
          // align-items: center;
          justify-content: center;
          height: 100px;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
      }
      &-take {
        width: 25%;
        .header {
          padding: 5px 0 10px 0;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;

          height: 100px;
          border-bottom: 1px solid rgba(240, 241, 242, 1);
        }
      }
    }
  }
}
</style>
