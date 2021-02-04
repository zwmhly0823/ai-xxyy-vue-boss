<template>
  <div class="app">
    <div class="classhead">
      <img src="@/assets/images/FinishClassHead.png" alt="" />
    </div>
    <div class="classconent">
      <img src="@/assets/images/Finishclasslist.png" class="img" alt="" />
      <div class="content">
        <table>
          <tr class="title">
            <td>宝贝信息</td>
            <td v-for="(wd, index) in WDLIST" :key="index">
              {{ wd.current_lesson || 'WD' }}
            </td>
            <!-- <td>{{ listTitle }}D1</td>
            <td>{{ listTitle }}D2</td>
            <td>{{ listTitle }}D3</td>
            <td>{{ listTitle }}D4</td> -->
          </tr>
          <tr
            class="information"
            v-for="(item, index) in listinfo"
            :key="index"
            height="52px;"
          >
            <td>
              <img
                :src="`${item.head}?x-oss-process=image/resize,l_100`"
                alt=""
                @load="loaded(index)"
                style="vertical-align:middle;width:51px;height:51px;"
                crossorigin="anonymous"
              />
              <span> {{ item.username }}</span>
            </td>
            <td>
              <img
                src="@/assets/images/Stars.png"
                alt=""
                v-if="
                  item.completeArr[0] && item.completeArr[0].is_complete === '1'
                "
              />
              <img
                src="@/assets/images/starsgrey.png"
                alt=""
                v-else-if="
                  item.completeArr[0] && item.completeArr[0].is_complete === '0'
                "
              />
              <img
                src="@/assets/images/lock.png"
                alt=""
                v-else-if="
                  item.completeArr[0] && item.completeArr[0].is_complete === '2'
                "
              />
            </td>
            <td>
              <img
                src="@/assets/images/Stars.png"
                alt=""
                v-if="
                  item.completeArr[1] && item.completeArr[1].is_complete === '1'
                "
              />
              <img
                src="@/assets/images/starsgrey.png"
                alt=""
                v-else-if="
                  item.completeArr[1] && item.completeArr[1].is_complete === '0'
                "
              />
              <img
                src="@/assets/images/lock.png"
                alt=""
                v-else-if="
                  item.completeArr[1] && item.completeArr[1].is_complete === '2'
                "
              />
            </td>
            <td>
              <img
                src="@/assets/images/Stars.png"
                alt=""
                v-if="
                  item.completeArr[2] && item.completeArr[2].is_complete === '1'
                "
              />
              <img
                src="@/assets/images/starsgrey.png"
                alt=""
                v-else-if="
                  item.completeArr[2] && item.completeArr[2].is_complete === '0'
                "
              />
              <img
                src="@/assets/images/lock.png"
                alt=""
                v-else-if="
                  item.completeArr[2] && item.completeArr[2].is_complete === '2'
                "
              />
            </td>
            <td>
              <img
                src="@/assets/images/Stars.png"
                alt=""
                v-if="
                  item.completeArr[3] && item.completeArr[3].is_complete === '1'
                "
              />
              <img
                src="@/assets/images/starsgrey.png"
                alt=""
                v-else-if="
                  item.completeArr[3] && item.completeArr[3].is_complete === '0'
                "
              />
              <img
                src="@/assets/images/lock.png"
                alt=""
                v-else-if="
                  item.completeArr[3] && item.completeArr[3].is_complete === '2'
                "
              />
            </td>
          </tr>
        </table>
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
      type: Array,
      default: null
    },
    weekNum: {
      type: String,
      default: ''
    },
    finish: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isLoaded: false,
      num: 0
    }
  },
  computed: {
    listinfo() {
      return this.listData || []
    },
    listTitle() {
      const listTitle = this.weekNum === 'U1' ? 'W1' : 'W2'
      return listTitle || ''
    },
    WDLIST() {
      if (!this.listData.length) return []
      return this.listData[0].completeArr || []
    }
  },

  methods: {
    loaded(i) {
      this.num++
      if (this.listinfo.length === 1) {
        this.isLoaded = true
        this.$emit('isLoad', this.isLoaded)
      }
      if (this.listinfo.length - 1 === this.num) {
        this.isLoaded = true
        this.$emit('isLoad', this.isLoaded)
      }
    }
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
      padding-left: 33px;
      padding-right: 33px;
      padding-top: 60px;
      padding-bottom: 66px;
      td {
        vertical-align: middle;
      }
      .title {
        width: 100%;
        height: 90px;
        font-size: 24px;
        color: #666;
        // padding-top: 40px;
        td:nth-child(2) {
          margin-left: 150px;
        }
      }
      .information {
        height: 94px;
        font-size: 28px;
        color: #333;
        // margin-top: 200px;
        td {
          img {
            width: 51px;
            height: 51px;
            border-radius: 50%;
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
