<template>
  <div class="studentDetails-sty">
    <!-- 学习记录 -->
    <el-table
      :data="studyTableData"
      style="width: 100%"
      header-row-class-name="learning-record-sty"
      v-if="tabData === 'learningRecord'"
    >
      <el-table-column label="课程计划">
        <template slot-scope="scope">
          <div>{{ scope.row.wd_info }} ·《{{ scope.row.title }}》</div>
          <div>{{ scope.row.ctime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="首次参课时间">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.ctime
                ? scope.row.studentCompleteCourseLog.ctime
                : '未参课'
            }}
          </div>
          <div class="course-btn" @click="participationBtn">
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.is_today_join_course === 1
                ? '当日参课'
                : ''
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="首次完课时间">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.complete_time &&
              scope.row.studentCompleteCourseLog.complete_time !==
                '1970-01-01 08:00:00'
                ? scope.row.studentCompleteCourseLog.complete_time
                : '未完课'
            }}
          </div>
          <div class="course-btn" @click="theLessonBtn">
            {{
              scope.row.studentCompleteCourseLog &&
              scope.row.studentCompleteCourseLog.is_today_complete_course === 1
                ? '当日完课'
                : ''
            }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 作品集 -->
    <el-table
      :data="studyTableData"
      style="width: 100%"
      header-row-class-name="learning-record-sty"
      v-if="tabData === 'collectionOf'"
    >
      <!-- 作品集 -->
      <el-table-column label="序号" width="70">
        <template slot-scope="scope">
          <div>{{ scope.row.serNum }}</div>
        </template>
      </el-table-column>
      <el-table-column label="作品详情">
        <template slot-scope="scope">
          <div class="work-photo">
            <img
              @click="enlarge(scope.row)"
              class="work-details"
              :src="scope.row.task_image"
            />
            <!-- 如果有视频，显示播放按钮 -->
            <i
              class="el-icon-video-play"
              @click="enlarge(scope.row)"
              v-if="scope.row.task_video"
            ></i>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="老师点评·点评时间">
        <template slot-scope="scope">
          <div class="comment-time" v-if="scope.row.taskComment">
            <div v-for="(aItem, aKey) in scope.row.taskComment" :key="aKey">
              <div @click="playBtn(scope.row, aItem)" class="comment-time-item">
                <i
                  :class="
                    aItem.id === play
                      ? 'el-icon-video-pause img-play'
                      : 'el-icon-video-play img-play'
                  "
                ></i>
                <audio
                  :id="`audio${[aItem.id]}`"
                  :src="aItem.sound_comment"
                ></audio>
                <!-- <i
                  v-if="scope.row.serNum === play"
                  class=" el-icon-video-pause img-play"
                ></i>
                <i v-else class=" el-icon-video-play img-play"></i> -->
              </div>
              <img class="img-play" :src="scope.row.imgWorks" />
              <div>
                {{ aItem && aItem.type === 0 ? '人工点评' : '智能点评'
                }}<br />{{ aItem.ctime }}
              </div>
              <div class="listening-status">
                {{ aItem.hadListened ? '已收听' : '' }}
              </div>
            </div>
          </div>
          <div v-else>未点评</div>
        </template>
      </el-table-column>
      <el-table-column label="课程">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.sendCourseLog ? scope.row.sendCourseLog.wd_info : '-'
            }}·《{{
              scope.row.sendCourseLog ? scope.row.sendCourseLog.title : '-'
            }}》
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作品上传时间">
        <template slot-scope="scope">
          <div>{{ scope.row.ctime }}</div>
          <div class="course-btn">
            {{ scope.row.is_day_upload_task === 0 ? '' : '当日上传' }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击图片放大 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      :show-close="false"
      width="400px"
      center
      custom-class="enlarge-box"
    >
      <img :src="bigImg" alt="" />
    </el-dialog>
    <!-- 订单物流记录 -->
    <el-table
      :data="studyTableData"
      style="width: 100%"
      header-row-class-name="learning-record-sty"
      v-if="tabData === 'orderLogistics'"
    >
      <el-table-column label="商品信息">
        <template slot-scope="scope">
          <div>
            {{ scope.row.packages_name ? scope.row.packages_name : '-' }}
          </div>
          <div>¥{{ scope.row.amount ? scope.row.amount : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <div>{{ scope.row.order_status ? scope.row.order_status : '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="班级信息">
        <template slot-scope="scope">
          <div>
            <div>{{ scope.row.team ? scope.row.team.team_name : '-' }}</div>
            <div>
              {{
                scope.row.team && scope.row.team.teacher_info
                  ? scope.row.team.teacher_info.realname
                  : '-'
              }}
              {{
                scope.row.team &&
                scope.row.team.teacher_info &&
                scope.row.team.teacher_info.departmentInfo
                  ? scope.row.team.teacher_info.departmentInfo.name
                  : '-'
              }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="下单时间·订单号">
        <template slot-scope="scope">
          <div>
            <div>{{ scope.row.ctime }}</div>
            <div>
              {{ scope.row.out_trade_no ? scope.row.out_trade_no : '-' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="关联物流">
        <template slot-scope="scope">
          <div>
            <div>
              共
              <span
                v-if="scope.row.express && scope.row.express.express_total"
                class="logistics"
                @click="
                  showExpressDetail(
                    scope.row.id,
                    scope.row.express.express_total
                  )
                "
                >{{ scope.row.express.express_total }}</span
              >
              <span v-else>0</span>
              条物流记录
            </div>
            <div>
              最后一次已{{
                scope.row.express && scope.row.express.last_express_status
                  ? scope.row.express.last_express_status
                  : '暂无物流记录'
              }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <express-detail :order_id="order_id" ref="order_id" />

    <!--用户资产 Start-->
    <div class="course-sty" v-if="tabData === 'userAsset'">
      <el-tabs v-model="assetCurPane">
        <el-tab-pane label="优惠券" name="assetCoupon">
          <template
            v-if="wholeData.CouponUserPage && wholeData.CouponUserPage.content"
          >
            <coupon-component
              :propData="wholeData"
              @couponSendSucc="couponSendSucc"
              @changePagenation="changePagenation"
            ></coupon-component>
          </template>
          <template v-else>
            <div class="asset-loading">
              <i class="el-icon-loading"></i>
              <span class="loading-text">加载中请稍后..</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane label="小熊币" name="assetBearCoin">
          <template
            v-if="
              wholeSecondData.AccountPage && wholeSecondData.AccountPage.content
            "
          >
            <coin-component
              :propData="wholeSecondData"
              @changePagenation="changePagenation"
            ></coin-component>
          </template>
          <template v-else>
            <div class="asset-loading">
              <i class="el-icon-loading"></i>
              <span class="loading-text">加载中请稍后..</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--用户资产 End-->

    <template v-if="tabData === 'notifyRecord'">
      <template v-if="wholeData.payload">
        <ivr-con
          :data="wholeData.payload.content"
          :studentId="wholeData.studentId"
          @ivrBubbleData="ivrBubbleData"
        ></ivr-con>
      </template>
      <template v-else>
        <div class="asset-loading">
          <i class="el-icon-loading"></i>
          <span class="loading-text">加载中请稍后..</span>
        </div>
      </template>
    </template>

    <!-- 作品集视频播放 -->
    <el-dialog
      title
      :visible.sync="videoDialog"
      width="30%"
      @close="closeDialog"
    >
      <video
        :src="currentVideo"
        controls
        autoplay
        class="video"
        width="100%"
      ></video>
    </el-dialog>
  </div>
</template>
<script>
// import imges from '../../../../src/assets/images/FinishClassHead.png'
import couponComponent from './assetComponents/couponComponent'
import coinComponent from './assetComponents/coinComponent'
import ExpressDetail from '../../../trading/views/components/expressDetail'
import ivrCon from './ivrComponents/ivrCon'
export default {
  props: {
    tabData: String,
    tabList: Array,
    wholeData: Object,
    wholeSecondData: Object
  },
  components: {
    couponComponent,
    coinComponent,
    ExpressDetail,
    ivrCon
  },
  data() {
    return {
      // 学习记录数据
      studyTableData: [],
      // 作品集点击放大
      centerDialogVisible: false,
      // 作品放大
      bigImg: '',
      // 播放按钮
      play: -1,
      // 播放id
      audioId: '',
      currentVideo: '',
      videoDialog: false,
      assetCurPane: '',
      order_id: ''
    }
  },
  created() {
    this.assetCurPane = 'assetCoupon'
  },
  watch: {
    tabList(val) {
      // console.log(val, 'watch')
      this.assetCurPane = 'assetCoupon'
      this.studyTableData = val
    }
  },
  methods: {
    // 点击当日参课
    participationBtn() {
      console.log('当日参课')
    },
    // 点击当日完课
    theLessonBtn() {
      console.log('点击当日完课')
    },
    // 点击图片放大
    enlarge(val) {
      console.log(val)
      if (!val.task_video) {
        this.bigImg = val.task_image
        this.centerDialogVisible = true
        return
      }
      this.currentVideo = val.task_video
      this.videoDialog = true
      console.log(val.task_video)
    },
    // 关闭视频播放 清空数据
    closeDialog() {
      this.currentVideo = ''
      this.videoDialog = false
    },
    playBtn(val, aItem) {
      const audio = document.getElementById(`audio${aItem.id}`)
      const audioLast = document.getElementById(this.audioId)
      this.play = this.play === aItem.id ? -1 : aItem.id
      if (this.play !== -1) {
        audioLast && audioLast.load()
        audio.play()
        let time = 0
        // time = this.studyTableData[val.serNum - 1].taskComment
        //   .sound_comment_second
        time = aItem.sound_comment_second
        setTimeout(() => {
          this.play = -1
        }, time * 1000)
      } else {
        audio.load()
      }
      this.audioId = audio.id
    },
    couponSendSucc() {
      this.$emit('couponSendSucc')
    },
    jumpToCoin(data) {
      this.assetCurPane = data
    },
    showExpressDetail(id, total) {
      if (total > 0) {
        this.$refs.order_id.drawer = true
        this.order_id = id
      }
    },
    ivrBubbleData(data) {
      this.$emit('ivrBubbleData', data)
    },
    changePagenation(data) {
      this.$emit('changePagenation', data)
    }
  }
}
</script>
<style scoped lang="scss">
.course-btn {
  color: #67c23a;
  // cursor: pointer;
}
.work-photo {
  position: relative;
  width: 100px;
  // 作品详情img
  .work-details {
    width: 100px;
  }
  ::v-deep .el-icon-video-play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 40px;
    color: #f5f7fa;
  }
}

// 老师点评播放img
.comment-time {
  // display: flex;
  // align-items: center;

  .img-play {
    font-size: 24px;
    float: left;
    height: 100%;
    cursor: pointer;
  }
  &-item {
    margin-bottom: 10px;
    > * {
      height: 100%;
      float: left;
      margin: 7px 7px 0 5px;
    }
  }
  .listening-status {
    padding: 0 0 0 20px;
  }
}
.enlarge-box {
  img {
    width: 100%;
    cursor: pointer;
  }
}
.logistics {
  color: #5ea0f5;
  text-decoration: underline;
  cursor: pointer;
}
</style>
<style lang="scss">
.learning-record-sty {
  th {
    background-color: #f5f7fa;
    padding: 5px 0;
  }
}
.el-table td {
  padding: 5px 0;
}
.studentDetails-sty {
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog--center .el-dialog__body {
    padding: 0;
    font-size: 0;
  }
}
.asset-loading {
  text-align: center;
  color: #409eff;
  font-size: 13px;
  margin-top: 20px;
}
</style>
