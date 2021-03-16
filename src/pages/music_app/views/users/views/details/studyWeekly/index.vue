<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: shasen
 * @Date: 2021-01-12 11:40:19
 * @LastEditors: shasen
 * @LastEditTime: 2021-01-12 11:40:19
-->
<template>
  <div class="study-weekly">
    <!-- 头部统计 -->
    <header class="header-statistics">
      <!-- 系统课 -->
      <template>
        <div class="item">
          <span class="label">共生成周报：</span>
          <span style="color:#81bbff">{{ totalConut.all_count }}</span>
        </div>
        <div class="item">
          <span class="label">已查看：</span
          ><span style="color:#81bbff">{{ totalConut.look_count }}</span>
        </div>
        <div class="item">
          <span class="label">已分享：</span
          ><span style="color:#81bbff">{{ totalConut.share_count }}</span>
        </div>
      </template>
    </header>

    <!-- table -->
    <section
      ref="tableRef"
      class="table-container"
      v-loading="flags.tLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="玩命加载中"
    >
      <ele-table
        :tableHeight="tableHeight"
        :tableSize="'small'"
        :dataList="tableData"
        :size="tabQuery.size"
        :page="tabQuery.page"
        :total="totalElements"
        :showAllTotalNum="true"
        :headerRowClasFn="headerRowClasFn"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column label="周报名称" min-width="120" align="center">
          <template slot-scope="scope">
            {{
              scope.row.current_unit_title ? scope.row.current_unit_title : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column label="周报进度" min-width="120" align="center">
          <template slot-scope="scope">
            <!-- 体验课 -->
            <p v-if="scope.row.course_type === '0'">
              {{ scope.row.current_super }}{{ scope.row.current_unit }}
            </p>
            <!-- 系统课 -->
            <p v-if="scope.row.course_type === '1'">
              {{ scope.row.current_super }}{{ scope.row.current_level
              }}{{ scope.row.current_unit }}
            </p>
          </template></el-table-column
        >
        <el-table-column label="周报生成时间" min-width="120" align="center">
          <template slot-scope="scope">
            {{
              scope.row.ctime && scope.row.ctime !== '0'
                ? formatDate(scope.row.ctime)
                : '-'
            }}
          </template></el-table-column
        >
        <el-table-column label="查看周报时间" min-width="120" align="center">
          <template slot-scope="scope">
            {{
              scope.row.lookCtime && scope.row.lookCtime !== '0'
                ? formatDate(scope.row.lookCtime)
                : '-'
            }}
          </template></el-table-column
        >
        <el-table-column label="分享周报时间" min-width="120" align="center">
          <template slot-scope="scope">
            {{
              scope.row.shareCtime && scope.row.shareCtime !== '0'
                ? formatDate(scope.row.shareCtime)
                : '-'
            }}
          </template></el-table-column
        >
        <el-table-column label="操作" min-width="120" align="center">
          <template slot-scope="scope">
            <div class="editStyle">
              <el-button
                class="editStyle_btn"
                type="text"
                @click="lookWeekly(scope.row, '1')"
                :disabled="flags.studyWeeklyFlag"
                >查看周报</el-button
              >
              <el-button
                class="editStyle_btn"
                type="text"
                @click="linkWeekly(scope.row, '2')"
                >周报链接</el-button
              >
            </div>
          </template></el-table-column
        >
      </ele-table>
    </section>
    <el-dialog
      title="查看周报"
      :visible.sync="showStudyWeekly"
      :before-close="handleCloseUpdata"
      :close-on-click-modal="false"
      width="415px"
    >
      <div class="studyWeeklyNowImgCon">
        <img :src="studyWeeklyNowImg" alt="" />
      </div>
    </el-dialog>
    <div class="pageMain" id="pageMain">
      <div class="pageScreen" id="pageScreen">
        <div class="pageIcon">
          <img :src="studyWeeklyImg" style="width:750px;" />
        </div>
        <p class="startEndTime">
          {{ formatData2(studyWeeklyDetail.startTime) }} ~
          {{ formatData2(studyWeeklyDetail.endTime) }}
        </p>
        <p class="studyWeeklyDetailUsername">
          {{ studyWeeklyDetail.username }}
        </p>
        <img
          class="studyWeeklyDetail_head"
          :src="studyWeeklyDetail.head"
          alt=""
        />
        <p class="studyDay">{{ studyWeeklyDetail.studyDay }}</p>
        <p class="finishedPaintingTimes">
          {{ studyWeeklyDetail.finishedPaintingTimes }}
        </p>
        <p class="answerQuestionTimes">
          {{ studyWeeklyDetail.answerQuestionTimes }}
        </p>
        <p class="advanceRate">{{ studyWeeklyDetail.advanceRate }}%</p>
        <img class="QRcodeimg" :src="QRcodeimg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
import { formatData } from '@/utils/index'
import html2canvas from 'html2canvas'
export default {
  name: 'studtWeekly',
  props: {},
  components: {
    EleTable
  },
  data() {
    return {
      studentId: '',
      totalElements: 0,
      tabQuery: {
        size: 20,
        page: 1
      },
      flags: {
        tLoading: false,
        studyWeeklyFlag: false
      },
      tableData: [],
      totalConut: {},
      tableHeight: 'auto',
      studyWeeklyDetail: {},
      showStudyWeekly: false,
      studyWeeklyImg: require('@/assets/images/studyWeekly.png'),
      QRcodeimg: '',
      studyWeeklyNowImg: ''
    }
  },
  computed: {},
  created() {
    this.studentId = this.$route.params.id
  },
  mounted() {
    this.initPage()
    this.initCount()
  },
  watch: {},
  methods: {
    // init列表
    initPage() {
      this.flags.tLoading = true
      const params = {
        student_id: this.studentId
      }
      this.$http.User.getStudyWeeklyPage(params, this.tabQuery.page)
        .then((res) => {
          const payload = res && res.data && res.data.StudentWeekReportPage
          if (payload) {
            this.totalElements = +payload.totalElements
            this.tableData = payload.content
          }
          this.flags.tLoading = false
        })
        .catch(() => {
          this.flags.tLoading = false
        })
    },
    // init统计
    initCount() {
      const params = {
        student_id: this.studentId
      }
      this.$http.User.getStudyWeeklyCount(params).then((res) => {
        const payload = res && res.data
        if (payload) {
          this.totalConut = payload.StudentWeekReportCount
        }
      })
    },
    // 查看周报
    lookWeekly(row) {
      this.flags.studyWeeklyFlag = true
      if (this.flags.studyWeeklyFlag) {
        Promise.all([
          this.getStudyWeeklyDetail(row),
          this.getStudyWeeklyQRcode(row)
        ]).then((res) => {
          this.studyWeeklyDetail = res[0].payload
          this.QRcodeimg = res[1].payload
          this.showStudyWeekly = true
          setTimeout(() => {
            this.flags.studyWeeklyFlag = false
          }, 2000)
          this.$nextTick(() => {
            this.turnCanvas()
          })
        })
      } else {
        return false
      }
    },
    // 关闭周报
    handleCloseUpdata() {
      document.querySelector('.imgAsy') &&
        document.querySelector('.imgAsy').remove()
      this.showStudyWeekly = false
    },
    // 获取周报详情
    async getStudyWeeklyDetail(row) {
      return new Promise((resolve, reject) => {
        this.$http.User.getStudyWeeklyDetail(row.id).then((res) => {
          resolve(res)
        })
      })
    },
    // 获取二维码
    async getStudyWeeklyQRcode(row) {
      return new Promise((resolve, reject) => {
        const url = `https://www.xiaoxiongmeishu.com/h5/weekReport?weekReportId=${row.id}&channelId=2594`
        this.$http.User.getStudyWeeklyQRcode(url).then((res) => {
          resolve(res)
        })
      })
    },
    // 绘图
    turnCanvas() {
      const that = this
      var canvas = document.createElement('canvas')
      var realHtml = document.getElementById('pageScreen')
      canvas.width = realHtml.offsetWidth * 2
      canvas.height = realHtml.offsetHeight * 2
      var opts = {
        tainttest: true, // 检测每张图片都已经加载完成
        scale: 2, // 添加的scale 参数
        useCORS: true,
        canvas: canvas, // 自定义 canvas
        logging: true, // 日志开关
        scrollX: 0,
        scrollY: 0
        // width: width, // dom 原始宽度
        // height: height // dom 原始高度
      }
      html2canvas(realHtml, opts).then(function(canvas) {
        var imgUri = canvas
          .toDataURL('image/')
          .replace('image/', 'image/octet-stream')
        that.turnImg = false
        // this.studyWeeklyNowImg = imgUri
        var img = new Image()
        img.setAttribute('class', 'imgAsy')
        img.src = imgUri
        img.width = 375
        img.height = 667
        document.querySelector('.studyWeeklyNowImgCon').appendChild(img)
      })
    },
    // 周报链接
    linkWeekly(row) {
      const url = `https://www.xiaoxiongmeishu.com/h5/weekReport?weekReportId=${row.id}&channelId=2594`
      window.open(url)
    },
    // 换页
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.initPage()
    },
    // 时间转化
    formatDate(date, flag = 's') {
      return formatData(date, flag)
    },
    formatData2(date) {
      return formatData(date)
    },
    // 自定义thead样式
    headerRowClasFn() {
      return 'header-row-class'
    }
  }
}
</script>

<style lang="scss" scoped>
.study-weekly {
  padding: 10px;
  .header-statistics {
    display: flex;
    align-items: center;
    padding: 7px 0;
    & > .item {
      margin-right: 30px;
      color: #444;
    }
  }

  .table-container {
    margin-top: 10px;
  }
  .mytable {
    /deep/ .header-row-class th {
      background: #f5f7fa;
      height: 50px;
      text-align: center;
    }
    .timeout {
      color: #e4393c;
    }
    .scope-row {
      text-align: left;
      .orange-btn {
        display: inline-flex;
        background: #d8ba1c;
        color: #fff;
        line-height: 16px;
        padding: 0 3px;
        border-radius: 2px;
      }
      .add {
        background: mediumseagreen;
        color: #fff;
        padding: 0px 8px;
        line-height: 16px;
        border-radius: 1px;
        margin-left: 10px;
      }
      .look {
        cursor: pointer;
        color: #2a75ed;
        margin-left: 7px;
      }
    }
    .editStyle {
      display: flex;
      justify-content: center;
      span {
        color: #2a75ed;
        cursor: pointer;
        &.btn-disabled {
          color: #ccc;
          cursor: no-drop;
        }
      }
    }
  }
  .pageScreen {
    position: absolute;
    z-index: 99;
    top: 0;
    right: 2000px;
  }
  .startEndTime {
    position: absolute;
    z-index: 100;
    top: 220px;
    left: 226px;
    color: #fff;
    font-weight: 900;
    font-size: 24px;
  }
  .studyWeeklyDetail_head {
    position: absolute;
    z-index: 100;
    top: 495px;
    left: 310px;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 5px solid #fff;
  }
  .studyWeeklyDetailUsername {
    position: absolute;
    z-index: 100;
    top: 640px;
    left: 232px;
    font-size: 24px;
    width: 300px;
    text-align: center;
  }
  .studyDay {
    position: absolute;
    z-index: 100;
    top: 688px;
    left: 65px;
    color: #922f0c;
    font-size: 64px;
    width: 200px;
    text-align: center;
  }
  .finishedPaintingTimes {
    position: absolute;
    z-index: 100;
    top: 688px;
    left: 274px;
    color: #922f0c;
    font-size: 64px;
    width: 200px;
    text-align: center;
  }
  .answerQuestionTimes {
    position: absolute;
    z-index: 100;
    top: 688px;
    left: 484px;
    color: #922f0c;
    font-size: 64px;
    width: 200px;
    text-align: center;
  }
  .advanceRate {
    position: absolute;
    z-index: 100;
    top: 955px;
    left: 429px;
    color: #ff6700;
    font-size: 44px;
    width: 118px;
    text-align: center;
  }
  .QRcodeimg {
    position: absolute;
    z-index: 100;
    top: 1134px;
    left: 556px;
    width: 142px;
    height: 142px;
  }
  .imgAsy {
    width: 375px !important;
    height: 667px !important;
  }
  .studyWeeklyNowImgCon {
    width: 100%;
  }
}
</style>
