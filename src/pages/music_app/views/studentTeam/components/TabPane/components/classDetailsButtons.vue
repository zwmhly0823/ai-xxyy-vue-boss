<template>
  <div class="class-details-button-box">
    <el-button
      size="mini"
      type="primary"
      style="margin-right: 10px;"
      @click="finishLessonList"
    >生成完课榜</el-button>
    <el-button
      type="primary"
      size="mini"
      style="margin-right: 10px;"
      v-show="exhibition"
      @click="ExhibitionList"
    >生成作品展</el-button>
    <el-dialog
      class="dialog-class"
      title="请选择生成的完课榜周数"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-radio label="1" disabled v-show="MissedClassesOne">第一周未开课</el-radio>
      <el-radio v-model="finishLessonData.weekNum" label="U1" v-show="radioOne">第一周</el-radio>
      <el-radio label="2" disabled v-show="MissedClassesTwo">第二周未开课</el-radio>
      <el-radio v-model="finishLessonData.weekNum" label="U2" v-show="radioTwo">第二周</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="clickHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 生成作品展弹出框 -->
    <el-dialog class="dialog-class" title="请选择生成的作品展周数" :visible.sync="Exhibition" width="500px">
      <el-radio label="1" disabled v-show="MissedClassesOne">第一周暂无作品</el-radio>
      <el-radio v-model="ExhibitionData.weekNum" label="U1" v-show="radioOne">第一周</el-radio>
      <el-radio label="2" disabled v-show="MissedClassesTwo">第二周暂无作品</el-radio>
      <el-radio v-model="ExhibitionData.weekNum" label="U2" v-show="radioTwo">第二周</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Exhibition = false">取 消</el-button>
        <el-button type="primary" @click="exhibitionBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 生成完课榜图片-->
    <div v-for="(item, index) in finishLessonData.childListData" :key="index + 1" class="finishBox">
      <slot>
        <!-- 需要转换的html -->
        <finishclass @isLoad="canvasStart" :listData="item" :weekNum="finishLessonData.weekNum"></finishclass>
      </slot>
    </div>
    <!-- 生成作品展图片 -->
    <div class="exhibitionBox" v-for="(item, index) in ExhibitionData.childListData" :key="index">
      <slot>
        <!-- 需要转换的html -->
        <exhibition @isload="CanvasStart" :listData="item"></exhibition>
      </slot>
    </div>
  </div>
</template>

<script>
import finishclass from '@/components/art_app/FinishClass.vue'
import exhibition from '@/components/art_app/Exhibition.vue'
import html2canvas from 'html2canvas'
// 模块整体是从系统课班级详情那边儿扣过来的
export default {
  props: {
    // 班级ID
    teamId: String
  },
  components: {
    finishclass,
    exhibition
  },
  data() {
    return {
      dialogFormVisible: false,
      teamDetail: {},
      classObj: {
        // 0是体验课
        type: '0'
      },
      // 完课榜相关数据
      finishLessonData: {
        teamId: 0,
        studentLesson: '',
        finishClassSort: 'desc',
        weekNum: '',
        isRequest: true,
        childListData: [],
        imgNum: 0,
        imgSuccessNum: 0,
        opreaIndex: 0
      },
      // 作品展相关数据
      ExhibitionData: {
        teamId: 0,
        weekNum: '',
        studentLesson: '',
        isRequest: true,
        childListData: [],
        imgNum: 0,
        imgSuccessNum: 0,
        opreaIndex: 0,
        weekNum1: ''
      },
      // 完课榜隐藏单选框
      radioOne: true,
      radioTwo: true,
      MissedClassesOne: false,
      MissedClassesTwo: false,
      exhibition: true,
      Exhibition: false
    }
  },
  watch: {
    teamId(val) {
      this.getTeamDetailById({ teamId: val })
    }
  },
  created() {
    this.getTeamDetailById({ teamId: this.teamId })
  },
  methods: {
    // 根据班级id获取班级详情
    getTeamDetailById(params) {
      this.$http.Team.getTeamDetailById({ id: params.teamId }).then((res) => {
        const {
          data: { StudentTeam = {} }
        } = res
        this.teamDetail = StudentTeam
      })
    },
    finishLessonList() {
      // 显示弹框
      this.dialogFormVisible = true
      this.finishLessonData.teamId = this.teamDetail.id
      const currentLesson = this.teamDetail.current_lesson.substring(0, 6)
      this.finishLessonData.studentLesson = currentLesson.substring(0, 4)
      this.finishLessonData.weekNum = currentLesson.substring(4, 6)
      this.btnshow(
        this.finishLessonData.weekNum,
        this.classObj.type,
        this.teamDetail.team_state
      )
    },
    // 点击显示作品展
    ExhibitionList(week) {
      if (this.teamDetail.id && this.teamDetail.current_lesson) {
        this.Exhibition = true
        this.ExhibitionData.teamId = this.teamDetail.id
        const currentLesson = this.teamDetail.current_lesson.substring(0, 6)
        this.ExhibitionData.weekNum1 = currentLesson
        this.ExhibitionData.weekNum = currentLesson.substring(4, 6)
        this.btnshow(
          this.ExhibitionData.weekNum,
          this.teamDetail.team_type,
          this.teamDetail.team_state
        )
      }
    },
    // 生成完课榜图片周按钮显示状态
    btnshow(weekNum, type, state) {
      this.finishLessonData.isRequest = true
      this.ExhibitionData.isRequest = true
      if (weekNum === 'U1') {
        if (state === 0) {
          this.radioOne = false
          this.radioTwo = false
          this.MissedClassesOne = true
          this.MissedClassesTwo = true
          this.finishLessonData.isRequest = false
          this.ExhibitionData.isRequest = false
        } else {
          this.radioOne = true
          this.radioTwo = false
          this.MissedClassesOne = false
          this.MissedClassesTwo = true
        }
      } else if (weekNum === 'U2') {
        if (state === 0) {
          this.radioOne = true
          this.radioTwo = false
          this.MissedClassesOne = false
          this.MissedClassesTwo = true
        } else {
          this.radioOne = true
          this.radioTwo = true
          this.MissedClassesOne = false
          this.MissedClassesTwo = false
        }
      }
      if (type > 0) {
        this.dialogFormVisible = false
        this.Exhibition = false
        this.Tips = true
      }
    },
    // 生成完课榜----确定按钮
    async clickHandler() {
      if (!this.finishLessonData.isRequest) {
        this.dialogFormVisible = false
        return
      }
      // 获取第几周的数据
      await this.getStuRankingList(
        this.finishLessonData.teamId,
        this.finishLessonData.studentLesson,
        this.finishLessonData.weekNum
      )

      // 关闭弹框
      this.dialogFormVisible = false
    },
    // 生成作品展----确定按钮
    async exhibitionBtn() {
      if (!this.ExhibitionData.isRequest) {
        this.Exhibition = false
        return
      }
      // 获取第几周的数据
      await this.getStuTaskRankingList(
        this.ExhibitionData.teamId,
        this.ExhibitionData.weekNum1
      )
      // 关闭弹框
      this.Exhibition = false
      // 执行 截图操作并保存
    },
    // 请求完课榜 - 接口数据
    getStuRankingList(teamId, lesson, week, desc) {
      if (!teamId || !lesson || !week) {
        return
      }
      this.$loading({
        lock: true,
        text: '图片正在生成中'
      })
      const queryParams = `{"team_id" : ${teamId}, "week" : "${lesson +
        week}", "sort" : "${this.finishLessonData.finishClassSort}"}`
      this.$http.Team.finishClassList(queryParams).then((res) => {
        if (res.error) {
          return
        }
        // 生成完课榜（多页）
        const childLastData = []
        if (res.data.getStuComRankingList) {
          const stuArrLength = res.data.getStuComRankingList.length
          const createDefineNum = 70
          const arevNum = Math.ceil(
            stuArrLength / Math.ceil(stuArrLength / createDefineNum)
          )
          // 重构数组
          for (var j = 0; j < stuArrLength; j++) {
            const tmpnum = Math.floor(j / arevNum)
            childLastData[tmpnum] = childLastData[tmpnum]
              ? childLastData[tmpnum]
              : []
            childLastData[tmpnum].push(res.data.getStuComRankingList[j])
          }
        }
        this.finishLessonData.childListData = childLastData
        this.finishLessonData.imgNum = childLastData.length
      })
    },
    // 请求作品展-接口数据
    getStuTaskRankingList(teamId, week) {
      if (!teamId || !week) {
        return
      }
      this.$loading({
        lock: true,
        text: '图片正在生成中'
      })
      const QueryParams = `{"team_id" : ${teamId}, "week" :  "${week}"}`
      this.$http.Team.exhibitionOfWorks(QueryParams).then((res) => {
        if (res.error) {
          return
        }
        if (!res.data.getStuTaskRankingList.length) {
          this.$message.error('家长还未上传全部作品')
          this.$loading().close()
        }
        // 生成作品展（多页）
        const childLastData = []
        if (res.data.getStuTaskRankingList) {
          const stuArrLength = res.data.getStuTaskRankingList.length
          const createDefineNum = 28
          const arevNum = Math.ceil(
            stuArrLength / Math.ceil(stuArrLength / createDefineNum)
          )
          // 重构数组
          for (var j = 0; j < stuArrLength; j++) {
            const tmpnum = Math.floor(j / arevNum)
            childLastData[tmpnum] = childLastData[tmpnum]
              ? childLastData[tmpnum]
              : []
            childLastData[tmpnum].push(res.data.getStuTaskRankingList[j])
          }
        }
        this.ExhibitionData.childListData = childLastData
        this.ExhibitionData.imgNum = childLastData.length
      })
    },
    // 绘制生成完课榜图片
    canvasStart(res) {
      if (res) {
        this.handlePosterLoad(this.teamDetail.team_name)
      }
    },
    // 绘制生成作品展图片
    CanvasStart(res) {
      if (res) {
        this.E_handlePosterLoad(this.teamDetail.team_name)
      }
    },
    // 生成完课榜
    handlePosterLoad(picname) {
      this.$nextTick(() => {
        window.scrollTo(0, 0)
        // 获取要生成图片的dom元素
        var doms = document.getElementsByClassName('finishBox')
        this.finishLessonData.opreaIndex++
        if (this.finishLessonData.opreaIndex === doms.length) {
          const _this = this
          for (var h = 0; h < doms.length; h++) {
            ;(function(i) {
              html2canvas(doms[i], {
                backgroundColor: 'rgba(0, 0, 0, 0)',
                useCORS: true,
                async: true,
                allowTaint: false
              }).then((canvas) => {
                const data = canvas.toDataURL('image/jpeg')
                // 执行浏览器下载
                const shutdownLoading = i + 1 === h
                const imgName = picname + '-' + (i * 1 + 1)
                _this.download(`${imgName}.jpeg`, data, _this, shutdownLoading)
              })
            })(h)
          }
        }
      })
    },
    //  生成作品展
    E_handlePosterLoad(picname) {
      this.$nextTick(() => {
        window.scrollTo(0, 0)
        const Doms = document.getElementsByClassName('exhibitionBox')
        this.ExhibitionData.opreaIndex++
        if (this.ExhibitionData.opreaIndex === Doms.length) {
          const _this = this
          for (var h = 0; h < Doms.length; h++) {
            ;(function(i) {
              html2canvas(Doms[i], {
                backgroundColor: 'rgba(0, 0, 0, 0)',
                useCORS: true,
                async: true,
                allowTaint: false
              }).then((canvas) => {
                const data = canvas.toDataURL('image/jpeg')
                // 执行浏览器下载
                const shutdownLoading = i + 1 === h
                const imgName = picname + '-' + (i * 1 + 1)
                _this.download(`${imgName}.jpeg`, data, _this, shutdownLoading)
              })
            })(h)
          }
        }
      })
    },
    // 生成图片下载方法
    download(fileName, content, _this = null, shutdownLoading = false) {
      const aLink = document.createElement('a')
      const blob = this.base64ToBlob(content)

      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)

      // aLink.dispatchEvent(evt);
      aLink.click()
      if (shutdownLoading) {
        _this.$loading().close()
        this.finishLessonData = {
          teamId: 0,
          studentLesson: '',
          finishClassSort: 'desc',
          weekNum: '',
          isRequest: true,
          childListData: [],
          imgNum: 0,
          imgSuccessNum: 0,
          opreaIndex: 0
        }
        this.ExhibitionData = {
          teamId: 0,
          weekNum: '',
          studentLesson: '',
          isRequest: true,
          childListData: [],
          imgNum: 0,
          imgSuccessNum: 0,
          opreaIndex: 0,
          weekNum1: ''
        }
      }
    },
    // 转换图片为base64
    base64ToBlob(code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length

      const uInt8Array = new Uint8Array(rawLength)

      for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    }
  }
}
</script>

<style lang="scss" scoped>
.class-details-button-box {
  display: inline-block;
  .finishBox {
    position: fixed;
    left: -1000px;
  }
  .exhibitionBox {
    position: fixed;
    left: -1000px;
  }
}
.dialog-class {
  text-align: left;
}
</style>
