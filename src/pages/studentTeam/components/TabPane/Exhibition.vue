<template>
  <div class="app">
    <div class="classhead">
      <img src="@/assets/images/FinishClassHead.png" alt="" />
    </div>
    <div class="classconent">
      <img src="@/assets/images/Finishclasslist.png" class="img" alt="" />
      <div class="content">
        <div class="allinfo" v-for="(item, index) in listinfo" :key="index">
          <div class="userinfo">
            <span class="userhead">
              <img :src="item.head" @load="loaded(index)" class="head" alt="" />
            </span>
            <span class="username">{{ item.username }}</span>
          </div>
          <!-- <div class="framebox" v-for="(item, index) in 4" :key="index"> -->
          <span
            class="framebox"
            v-for="(img, index) in item.completeArr"
            :key="index + 1"
          >
            <span class="img-overflow"
              ><img
                class="topframe"
                :src="img.task_image"
                alt=""
                @load="loaded(index)"
            /></span>
            <!-- <img class="frame" src="../../../../assets/images/frame.png" alt=""
          /> -->
          </span>
          <!-- </div> -->
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
  props: {
    listData: {
      type: Object,
      default: null
    },
    weekNum: {
      type: String,
      default: ''
    },
    Exhibition: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listinfo: [],
      listTitle: '',
      isLoaded: false,
      num: 0
    }
  },
  methods: {
    loaded(i) {
      this.num++
      if (this.listinfo.length - 1 === this.num) {
        this.isLoaded = true
        this.$emit('isload', this.isLoaded)
      }
    }
  },
  watch: {
    listData(value) {
      console.log('child - receive ----> res:', value)
      this.listinfo = value.data.getStuTaskRankingList
      console.log('listinfo -------', this.listinfo)
    }
    // weekNum(value) {
    //   this.listTitle = value === 'U1' ? 'W1' : 'W2'
    // }
  }
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
      padding-top: 30px;
      padding-bottom: 66px;
      .allinfo {
        .userinfo {
          width: 100%;
          height: 51px;
          display: flex;
          margin-top: 30px;
          .userhead {
            display: inline-block;
            width: 51px;
            height: 51px;
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
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
          padding: 20px;
          display: inline-block;
          margin-left: 4px;
          width: 156px;
          height: 156px;
          overflow: hidden;
          background-image: url('../../../../assets/images/frame.png');
          .img-overflow {
            display: inline-block;
            overflow: hidden;
            width: 100%;
            height: 100%;
            .topframe {
              width: 100%;
            }
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
