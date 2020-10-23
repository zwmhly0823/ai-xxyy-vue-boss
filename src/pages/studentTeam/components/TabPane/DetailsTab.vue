<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 14:19:58
 * @LastEditors: Shentong
 * @LastEditTime: 2020-10-23 21:45:16
 -->
<template>
  <div>
    <div class="btnbox">
      <m-search
        class="search-box"
        @search="handleSearch"
        phone="uid"
        onlyPhone="1"
        phoneTip="手机号/微信昵称 查询"
        :teamType="`${classObj.type == 0 ? '0' : '1'}`"
        :teamId="classObj.teamId"
      />
      <el-button
        size="mini"
        type="primary"
        style="margin-right: 10px;"
        v-if="btnbox"
        @click="finishLessonList"
        >生成完课榜</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="btnbox"
        style="margin-right: 10px;"
        v-show="exhibition"
        @click="exhibitionList"
        >生成作品展</el-button
      >
      <checkBox
        class="check-box"
        :tables="table"
        :classObj="classObj"
        :audioTabs="audioTabs"
        @screenWorks="screenWorks"
        @screenAttendClass="screenAttendClass"
        v-if="this.table.tabs == 3 || this.table.tabs == 4"
      />
    </div>
    <div>
      <div class="tabs-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="加好友进群" name="group">
            <details-table
              @onCurrentPage="onCurrentPage"
              @commandFriend="onCommandFriend"
              @onGroup="onGroup"
              @onGroupSort="onGroupSort"
              :tables="table"
              :classObj="classObj"
              :audioTabs="audioTabs"
            ></details-table>
          </el-tab-pane>
          <el-tab-pane label="物流" name="logistics">
            <details-table
              @onCurrentPage="onCurrentPage"
              @addExpresss="addExpresss"
              @modifyAddressExpresss="modifyAddressExpresss"
              :tables="table"
              :experssShow="experssShow"
              :audioTabs="audioTabs"
            ></details-table>
          </el-tab-pane>
          <el-tab-pane label="打开APP" name="login"
            ><details-table
              @onCurrentPage="onCurrentPage"
              :tables="table"
              :audioTabs="audioTabs"
            ></details-table
          ></el-tab-pane>
          <el-tab-pane label="参课和完课" name="participateIn"
            ><details-table
              @onCurrentPage="onCurrentPage"
              :tables="table"
              :audioTabs="audioTabs"
            ></details-table
          ></el-tab-pane>
          <el-tab-pane label="作品及点评" name="works"
            ><details-table
              @onCurrentPage="onCurrentPage"
              :tables="table"
              :audioTabs="audioTabs"
            ></details-table
          ></el-tab-pane>
        </el-tabs>
        <el-dialog
          title="请选择生成的完课榜周数"
          :visible.sync="dialogFormVisible"
          class="work-exhibition-class"
          :close-on-press-escape="false"
          @close="dialogClose"
          width="600px"
        >
          <div class="trail-content" v-if="type == 'TRAIL'">
            <el-radio label="1" disabled v-show="MissedClassesOne"
              >第一周未开课</el-radio
            >
            <el-radio
              v-model="finishLessonData.weekNum"
              label="U1"
              v-show="radioOne"
              >第一周</el-radio
            >
            <el-radio label="2" disabled v-show="MissedClassesTwo"
              >第二周未开课</el-radio
            >
            <el-radio
              v-model="finishLessonData.weekNum"
              label="U2"
              v-show="radioTwo"
              >第二周</el-radio
            >
          </div>
          <div class="system-content" v-else>
            <div class="cur-progress">
              <span>当前课程进度</span
              ><span class="progress">{{ currentProgress }}</span>
              <el-popover
                v-model="showProgressPopover"
                placement="right-start"
                width="100"
                trigger="click"
              >
                <div class="progress-list">
                  <div
                    v-for="item in progressList"
                    @click="progressClickHandle(item)"
                    :key="item"
                  >
                    {{ item }}
                  </div>
                </div>
                <span class="sets" slot="reference">「切换」</span>
              </el-popover>
            </div>
            <div class="system-radio">
              <el-radio v-model="sysFinishRadio" label="1">第一周</el-radio>
              <el-radio
                v-model="sysFinishRadio"
                :disabled="radioJudgeDisable < 2"
                label="2"
                >第二周<span v-if="radioJudgeDisable < 2"
                  >未开课</span
                ></el-radio
              >
              <el-radio
                v-model="sysFinishRadio"
                :disabled="radioJudgeDisable < 3"
                label="3"
                >第三周<span v-if="radioJudgeDisable < 3"
                  >未开课</span
                ></el-radio
              >
              <el-radio
                v-model="sysFinishRadio"
                :disabled="radioJudgeDisable < 4"
                label="4"
                >第四周<span v-if="radioJudgeDisable < 4"
                  >未开课</span
                ></el-radio
              >
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" size="small"
              >取 消</el-button
            >
            <el-button type="primary" @click="generatefinishLesson" size="small"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!-- 生成作品展弹出框 -->
        <el-dialog
          title="请选择生成的作品展周数"
          :visible.sync="Exhibition"
          :close-on-press-escape="false"
          class="work-exhibition-class"
          @close="dialogClose"
          width="600px"
        >
          <div class="trail-content" v-if="type == 'TRAIL'">
            <el-radio label="1" disabled v-show="MissedClassesOne"
              >第一周暂无作品</el-radio
            >
            <el-radio
              v-model="ExhibitionData.weekNum"
              label="U1"
              v-show="radioOne"
              >第一周</el-radio
            >
            <el-radio label="2" disabled v-show="MissedClassesTwo"
              >第二周暂无作品</el-radio
            >
            <el-radio
              v-model="ExhibitionData.weekNum"
              label="U2"
              v-show="radioTwo"
              >第二周</el-radio
            >
          </div>
          <div class="system-content" v-else>
            <div class="cur-progress">
              <span>当前课程进度</span
              ><span class="progress">{{ currentProgress }}</span>
              <el-popover
                v-model="showExProgressPopover"
                placement="right-start"
                width="100"
                trigger="click"
              >
                <div class="progress-list">
                  <div
                    v-for="item in progressList"
                    @click="progressClickHandle(item)"
                    :key="item"
                  >
                    {{ item }}
                  </div>
                </div>
                <span class="sets" slot="reference">「切换」</span>
              </el-popover>
            </div>
            <div class="system-radio">
              <el-radio v-model="sysExhibitionRadio" label="1">第一周</el-radio>
              <el-radio
                v-model="sysExhibitionRadio"
                :disabled="radioJudgeDisable < 2"
                label="2"
                >第二周<span v-if="radioJudgeDisable < 2"
                  >未开课</span
                ></el-radio
              >
              <el-radio
                v-model="sysExhibitionRadio"
                :disabled="radioJudgeDisable < 3"
                label="3"
                >第三周<span v-if="radioJudgeDisable < 3"
                  >未开课</span
                ></el-radio
              >
              <el-radio
                v-model="sysExhibitionRadio"
                :disabled="radioJudgeDisable < 4"
                label="4"
                >第四周<span v-if="radioJudgeDisable < 4"
                  >未开课</span
                ></el-radio
              >
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="Exhibition = false" size="small"
              >取 消</el-button
            >
            <el-button type="primary" @click="exhibitionBtn" size="small"
              >确 定</el-button
            >
          </div>
        </el-dialog>
        <!-- 系统课点击生成完课榜与作品展提示框 -->
        <!-- <el-dialog title="活动未开放" :visible.sync="Tips" width="30%">
          <span class="warning"
            ><img src="@/assets/images/warning.png" alt=""
          /></span>
          <span>此活动仅限体验课</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="Tips = false">取 消</el-button>
            <el-button type="primary" @click="Tips = false">确 定</el-button>
          </span>
        </el-dialog> -->
      </div>
      <!-- 生成完课榜图片-->
      <div
        v-for="(item, index) in finishLessonData.childListData"
        :key="index + 1"
        class="finishBox"
      >
        <slot>
          <!-- 需要转换的html -->
          <finishclass
            @isLoad="canvasStart"
            :listData="item"
            :weekNum="finishLessonData.weekNum"
          ></finishclass>
        </slot>
      </div>
      <!-- 生成作品展图片 -->
      <div
        class="exhibitionBox"
        v-for="(item, index) in ExhibitionData.childListData"
        :key="index"
      >
        <slot>
          <!-- 需要转换的html -->
          <exhibition @isload="CanvasStart" :listData="item"></exhibition>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import checkBox from '@/components/MCheckBox/index'
import detailsTable from './components/detailsTable'
import MSearch from '@/components/MSearch/index.vue'
import { timestamp, GetAgeByBrithday, isToss } from '@/utils/index'
import finishclass from './FinishClass'
import exhibition from './Exhibition'
import html2canvas from 'html2canvas'
export default {
  components: {
    detailsTable,
    finishclass,
    exhibition,
    MSearch,
    checkBox
  },
  props: {
    classObj: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['team']),
    searchUser() {
      return this.team.userByPhone
    }
  },
  data() {
    return {
      /**
       * 系统课完课榜、生成作品展start
       */
      sysFinishRadio: '',
      radioJudgeDisable: '',
      sysExhibitionRadio: '',
      // progressList: ['L1', 'L2', 'L3', 'L4', 'L5'],
      progressList: [],
      currentProgress: '',
      showProgressPopover: false,
      showExProgressPopover: false,
      lessonDescription: {},
      /**
       * 系统课完课榜、生成作品展end
       */
      radioOne: true,
      radioTwo: true,
      MissedClassesOne: false,
      MissedClassesTwo: false,
      teacherId: '',
      search: '',
      querysData: '',
      experssShow: false,
      btnbox: false,
      type: null,
      input: '',
      // 点击生成图片--状态
      getImg: false,
      dataURL: '',
      exhibition: true,
      Finish: true,
      audioTabs: '0',
      table: {
        courseState: '',
        tabs: 0,
        // 表头信息
        tableLabel: [],
        // 列表数据
        tableData: [],
        // 总条数
        totalElements: null,
        // 当前页
        currentPage: 1
      },
      // 完课榜相关数据
      finishLessonData: {
        teamId: 0,
        studentLesson: '',
        finishClassSort: 'desc',
        weekNum: '',
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
        childListData: [],
        imgNum: 0,
        imgSuccessNum: 0,
        opreaIndex: 0,
        weekNum1: ''
      },
      // tabs标签默认状态
      activeName: 'group',
      tablsName: '',
      codeHandle: {},
      // 弹出框
      dialogTableVisible: false,
      dialogFormVisible: false,
      Exhibition: false,
      Tips: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      currentLessonDesc: {
        diff: '',
        level: '',
        week: ''
      },
      formLabelWidth: '120px',
      tableDataEmpty: true,
      sortGroup: '',
      screenWorksData: {},
      screenAttendClassData: {},
      teamDetail: {},
      sysOriginCurp: '',
      sysOriginWeekNum: '',
      exOriginRadio: '',
      exOriginWeekNum: '',
      defaultHead: 'https://msb-ai.meixiu.mobi/ai-pm/static/touxiang.png'
    }
  },
  created() {
    // 切换标签 语音停止
    const audios = this.$refs
    const audiosList = Object.values(audios)
    audiosList.forEach((item, index) => {
      item[0].load()
    })
    this.screenWorksData = {}
    this.screenAttendClassData = {}
    this.sortGroup = ''
    this.table.currentPage = 1

    if (this.classObj.teamId) {
      this.tableDataEmpty = true
      this.getTeamDetailById({ teamId: this.classObj.teamId })
      if (+this.classObj.type === 0) {
        this.type = 'TRAIL'
      } else if (+this.classObj.type === 1) {
        this.type = 'MONTH'
      } else if (+this.classObj.type === 2) {
        this.type = 'YEAR'
      } else {
        this.type = ''
      }
      setTimeout(() => {
        if (this.tabsName === '物流') {
          this.getLogistics()
        } else if (this.tabsName === '打开APP') {
          this.geiLogin()
        } else if (this.tabsName === '参课和完课') {
          this.getClassCompPage()
        } else if (this.tabsName === '作品及点评') {
          this.getStuComment()
        } else {
          this.getGroup()
        }
      }, 200)
    } else {
      this.tableDataEmpty = false
      this.table.tableData = []
    }
  },
  watch: {
    currentProgress(val, oldVal) {
      const raceType = this.dialogFormVisible
        ? 'sysOriginCurp'
        : 'exOriginRadio'

      const baseModal = this.dialogFormVisible
        ? 'sysFinishRadio'
        : 'sysExhibitionRadio'
      // 如果当前进度小于总进度，那么禁用值为4，否则，禁用值等于初始值
      console.log(val.substring(1), this[raceType])
      if (+val.substring(1) < this[raceType].substring(1)) {
        this.radioJudgeDisable = 4

        this[baseModal] = '1'
        // if ()
      } else {
        const num = this.dialogFormVisible
          ? this.sysOriginWeekNum
          : this.exOriginWeekNum
        this[baseModal] = num

        this.radioJudgeDisable = num
      }
    },
    searchUser(user) {
      let teamId = ''
      let teamType = ''
      let mobile = ''
      if (user && user.phone) mobile = user.phone
      if (this.classObj.teamId) {
        teamId = this.classObj.teamId
        teamType = this.classObj.type
      }
      this.search = ''
      if (!mobile) {
        this.getGroup()
        return
      }
      this.$http.User.blurrySearch(mobile, teamType, teamId).then((res) => {
        const uid =
          res.data.blurrySearch &&
          res.data.blurrySearch[0] &&
          res.data.blurrySearch[0].id
        this.search = `"${uid}"`
        this.getGroup()
      })
    }
  },
  mounted() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
    this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
  },
  methods: {
    dialogClose() {
      this.Exhibition = false
      this.dialogFormVisible = false
    },
    progressClickHandle(item) {
      this.currentProgress = item
      this.showProgressPopover = false
      this.showExProgressPopover = false
    },
    // 根据班级id获取班级详情
    getTeamDetailById(params) {
      this.$http.Team.getTeamDetailById({ id: params.teamId }).then((res) => {
        const {
          data: { StudentTeam = {} }
        } = res
        this.teamDetail = StudentTeam
      })
    },
    screenAttendClass(data) {
      this.screenAttendClassData = data
      this.table.currentPage = 1
      this.getClassCompPage()
    },
    screenWorks(data) {
      this.screenWorksData = data
      this.table.currentPage = 1
      this.getStuComment()
    },
    // 排序
    onGroupSort(data) {
      this.sortGroup = `sort:${JSON.stringify(data)}`
      this.getGroup()
    },
    // 搜索组件传回来的值
    handleSearch(res) {
      this.search = ''
      if (!res.length) this.getGroup()
      else {
        this.search = `"${res[0].term.uid}"`
      }
      if (this.tabsName === '加好友进群') {
        this.getGroup()
      } else if (this.tabsName === '物流') {
        this.getLogistics()
      } else if (this.tabsName === '打开APP') {
        this.geiLogin()
      } else if (this.tabsName === '参课和完课') {
        this.getClassCompPage()
      } else if (this.tabsName === '作品及点评') {
        this.getStuComment()
      }
    },
    // 判断是否是待开课
    // 生成完课榜----确定按钮
    async generatefinishLesson() {
      // 获取第几周的数据
      const { difficute } = this.lessonDescription
      const { teamId, studentLesson, weekNum } = this.finishLessonData
      const isTrail = this.type === 'TRAIL'

      const week = isTrail
        ? `${studentLesson}${weekNum}`
        : `${difficute}${this.currentProgress}U${this.sysFinishRadio}`

      await this.generateFinishAndExhibition(
        'finishClassList',
        teamId,
        week,
        70
      )
      // 关闭弹框
      this.dialogFormVisible = false
    },
    // 生成作品展----确定按钮
    async exhibitionBtn() {
      const { difficute } = this.lessonDescription
      const { teamId, weekNum1 } = this.ExhibitionData
      const isTrail = this.type === 'TRAIL'

      const week = isTrail
        ? `${weekNum1}`
        : `${difficute}${this.currentProgress}U${this.sysExhibitionRadio}`

      await this.generateFinishAndExhibition(
        'exhibitionOfWorks',
        teamId,
        week,
        28
      )

      // 关闭弹框
      this.Exhibition = false
    },
    /**
     * @description 生成作品展和完课榜 canvas
     * @param modal = 'finishLessonData' 完课榜 / modal = 'ExhibitionData' 作品展
     */
    async createContentCanvas(modal, picname) {
      await this.$nextTick()
      window.scrollTo(0, 0)

      const htmlMOM =
        modal === 'finishLessonData' ? 'finishBox' : 'exhibitionBox'

      // 获取要生成图片的dom元素
      const DOMS = document.getElementsByClassName(htmlMOM)
      this[modal].opreaIndex++

      if (this[modal].opreaIndex === DOMS.length) {
        const _this = this
        for (var h = 0; h < DOMS.length; h++) {
          ;(function(i) {
            html2canvas(DOMS[i], {
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
    },
    // 点击显示完课榜 TODO:
    finishLessonList() {
      // 待开课班级 提示 未开课
      if (this.teamDetail.team_state === '0') {
        this.$message.warning('班级暂未开课')
        return
      }
      const curlesson = this.teamDetail.current_lesson
      const getLesseonDesc = this.getLesseonDesc(curlesson)

      this.dialogFormVisible = true
      this.finishLessonData.teamId = this.teamDetail.id

      Object.assign(this.finishLessonData, getLesseonDesc)

      if (this.type === 'TRAIL') {
        this.btnshow(
          this.finishLessonData.weekNum,
          this.classObj.type,
          this.teamDetail.team_state
        )
      } else {
        this.sysFinishRadio = this.finishLessonData.weekNum.substring(1) // 页面响应式周数，最大为4
        // this.radioJudgeDisable = this.sysFinishRadio

        this.currentProgress = getLesseonDesc.level

        this.sysOriginCurp = this.currentProgress
        this.sysOriginWeekNum = this.sysFinishRadio

        this.progressList = this.getCurProgressList(getLesseonDesc.level)
        //
      }
    },
    // 通过 当前 level 获取进度
    getCurProgressList(level) {
      const num = level.substring(1)
      const listArr = []

      for (let i = 1; i < +num + 1; i++) {
        listArr.push(`L${i}`)
      }

      return listArr
    },
    // 点击显示作品展
    exhibitionList() {
      if (this.teamDetail.team_state === '0') {
        this.$message.warning('班级暂未开课')
        return
      }
      const curlesson = this.teamDetail.current_lesson
      const { currentLesson: weekNum1, weekNum, level } = this.getLesseonDesc(
        curlesson
      )

      this.Exhibition = true

      Object.assign(this.ExhibitionData, {
        teamId: this.teamDetail.id,
        weekNum1,
        weekNum
      })

      if (this.type === 'TRAIL') {
        this.btnshow(weekNum, this.classObj.type, this.teamDetail.team_state)
      } else {
        this.sysExhibitionRadio = weekNum.substring(1)
        // this.radioJudgeDisable = this.sysExhibitionRadio
        this.currentProgress = level

        this.exOriginRadio = this.currentProgress
        this.exOriginWeekNum = this.sysExhibitionRadio

        this.progressList = this.getCurProgressList(level)
      }
    },
    /**
     * @description 生成完课榜和作品展统一接口方法
     * @params model = 'finishClassList' 完课榜 / model = 'exhibitionOfWorks' 作品展
     */
    async generateFinishAndExhibition(model, teamId, week, createDefineNum) {
      if (!teamId || !week) return

      const type = this.type === 'TRAIL' ? '0' : '1'
      const sort = this.finishLessonData.finishClassSort
      this.$loading({
        lock: true,
        text: '图片正在生成中'
      })

      const query = `{"team_id" : ${teamId}, "week" : "${week}", "sort" : "${sort}","type": "${type}"}`
      const {
        error,
        data: { getStuComRankingList: A, getStuTaskRankingList: B } = {}
      } = await this.$http.Team[model](query).catch()
      if (error) return

      const _list = model === 'finishClassList' ? A || [] : B || [] // TODO:
      // const _list = [
      //   {
      //     student_id: '500508178832953344',
      //     mobile: '15999062360',
      //     username: '李晟宇',
      //     head:
      //       'http://s1.xiaoxiongmeishu.com/android-images/2020-09-10/cf199d0fdf79433ebf1a8734116f9051.jpeg',
      //     completeArr: [
      //       { current_lesson: 'W1D1', is_complete: '1' },
      //       { current_lesson: 'W1D2', is_complete: '1' },
      //       { current_lesson: 'W1D3', is_complete: '2' }
      //     ]
      //   },
      //   {
      //     student_id: '500508178832953344',
      //     mobile: '15999062360',
      //     username: '李晟宇',
      //     head:
      //       'http://s1.xiaoxiongmeishu.com/android-images/2020-09-10/cf199d0fdf79433ebf1a8734116f9051.jpeg',
      //     completeArr: [
      //       { current_lesson: 'W1D1', is_complete: '1' },
      //       { current_lesson: 'W1D2', is_complete: '1' },
      //       { current_lesson: 'W1D3', is_complete: '2' }
      //     ]
      //   }
      // ]

      const _data =
        model === 'finishClassList' ? 'finishLessonData' : 'ExhibitionData'

      const childListData = []
      const arrL = _list.length

      if (arrL) {
        const arevNum = Math.ceil(arrL / Math.ceil(arrL / createDefineNum))

        for (var j = 0; j < arrL; j++) {
          const tmpnum = Math.floor(j / arevNum)
          childListData[tmpnum] = childListData[tmpnum] || []
          childListData[tmpnum].push(_list[j])
        }

        Object.assign(this[_data], {
          childListData,
          imgNum: childListData.length
        })
      } else {
        this.$loading().close()
        this.$message.warning('暂无内容可生成')
      }
    },
    /** 通过课程名称，获取里面包含的 信息 */
    getLesseonDesc(lesson) {
      const currentLesson = lesson.substring(0, 6)

      const difficute = currentLesson.substring(0, 2)
      const studentLesson = currentLesson.substring(0, 4)
      const weekNum = currentLesson.substring(4, 6)
      const level = currentLesson.substring(2, 4)

      this.lessonDescription = {
        difficute,
        currentLesson,
        studentLesson,
        weekNum,
        level
      }

      return this.lessonDescription
    },
    // 生成完课榜图片周按钮显示状态
    btnshow(weekNum, type, state) {
      if (weekNum === 'U1') {
        this.radioTwo = false
        this.MissedClassesTwo = true
        if (state === 0) {
          this.radioOne = false
          this.MissedClassesOne = true
        } else {
          this.radioOne = true
          this.MissedClassesOne = false
        }
      } else if (weekNum === 'U2') {
        this.radioOne = true
        this.MissedClassesOne = false
        if (state === 0) {
          this.radioTwo = false
          this.MissedClassesTwo = true
        } else {
          this.radioTwo = true
          this.MissedClassesTwo = false
        }
      }
    },
    // 请求作品展-接口数据
    getStuTaskRankingList(teamId, week) {
      if (!teamId || !week) return

      const type = this.type === 'TRAIL' ? '0' : '1'
      this.$loading({
        lock: true,
        text: '图片正在生成中'
      })
      const queryParams = `{"team_id":${teamId}, "week":"${week}","type": "${type}"}`
      this.$http.Team.exhibitionOfWorks(queryParams).then((res = {}) => {
        const { error, data: { getStuTaskRankingList = [] } = {} } = res
        if (error) return
        // 生成作品展（多页）
        const childLastData = []
        if (getStuTaskRankingList && getStuTaskRankingList.length) {
          const stuArrLength = getStuTaskRankingList.length
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
            childLastData[tmpnum].push(getStuTaskRankingList[j])
          }
          this.ExhibitionData.childListData = childLastData
          this.ExhibitionData.imgNum = childLastData.length
        } else {
          this.$loading().close()
          this.$message.warning('暂无作品可生成')
        }
      })
    },
    // 绘制生成完课榜图片
    canvasStart(res) {
      res &&
        this.createContentCanvas('finishLessonData', this.teamDetail.team_name)
    },
    // 绘制生成作品展图片
    CanvasStart(res) {
      res &&
        this.createContentCanvas('ExhibitionData', this.teamDetail.team_name)
    },
    // 加好友进群 修改已加好友 已进群 接口
    getCodeHandle() {
      this.$http.User.updateTeamStudent({
        studentId: this.codeHandle.studentId,
        teamId: this.classObj.teamId,
        courseType: this.type,
        addedGroup: this.codeHandle.addedGroup,
        addedWechat: this.codeHandle.addedWechat
      }).then((res) => {
        if (res.code === 0) {
          if (this.codeHandle.type === 'wechat') {
            this.table.tableData[
              this.codeHandle.index
            ].added_wechat = this.codeHandle.command
          } else if (this.codeHandle.type === 'group') {
            this.table.tableData[
              this.codeHandle.index
            ].added_group = this.codeHandle.command
          }
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      })
    },
    // 加好友进群接口
    getGroup() {
      const trail = +this.classObj.type
        ? 'StudentSystemForTeamStatisticsPage'
        : 'StudentTrialForTeamStatisticsPage'

      if (this.classObj.teamId) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classObj.teamId},"student_id":${this.search}}`
        } else {
          this.querysData = `{"team_id":${this.classObj.teamId}}`
        }
        const sortFollow = '{"follow":"desc"}'
        const cortfollowDesc = `sort:${JSON.stringify(sortFollow)}`
        const sort = this.sortGroup ? this.sortGroup : cortfollowDesc
        this.$http.Team[trail]({
          querysData: this.querysData,
          currentPage: this.table.currentPage,
          sortGroup: sort
        }).then((res) => {
          this.table.tableData = []
          // 0 默认 1 男 2 女 3 保密
          // 0 默认  1 无基础  2 一年以下 3 一年以上
          // 0 叉 1 对号
          this.table.totalElements = +res.data[trail].totalElements
          const _data = res.data[trail].content
          _data.forEach((item) => {
            item.birthday = GetAgeByBrithday(item.birthday)
            if (+item.sex === 0) {
              item.sex = '- ·'
            } else if (+item.sex === 1) {
              item.sex = '男 ·'
            } else if (+item.sex === 2) {
              item.sex = '女 ·'
            } else if (+item.sex === 3) {
              item.sex = '保密 ·'
            }
            if (item.birthday.indexOf(50) !== -1) {
              item.birthday = '-'
            }
            // 默认头像
            if (!item.head || item.head === 'undefined') {
              item.head = this.defaultHead
            }
            item.buytime = timestamp(item.buytime, 6)
            item.added_wechat_time = timestamp(item.added_wechat_time, 6)
            item.added_group_time = timestamp(item.added_group_time, 6)
            item.fast_follow_time = timestamp(item.fast_follow_time, 6)
            this.table.courseState = item.course_state
          })
          if (this.tableDataEmpty) {
            this.table.tableData = _data
          } else {
            this.table.tableData = []
            this.tableDataEmpty = true
          }
        })
      }
    },
    // 物流接口
    getLogistics() {
      if (this.classObj.teamId) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type},"uid":${this.search}}`
        } else {
          this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type}}`
        }
        this.$http.Team.getStuExpressPage({
          querysData: this.querysData,
          currentPage: this.table.currentPage
        }).then((res) => {
          this.table.tableData = []
          this.table.totalElements = +res.data.stuExpressPage.totalElements
          const _data = res.data.stuExpressPage.content
          _data.forEach((item) => {
            item.ctime = timestamp(item.ctime, 6)
            if (!item.nickname) {
              item.nickname = ''
              item.head = ''
            }
            if (item.product_name) {
              item.product_name = `「${item.product_name}」`
            } else {
              item.product_name = '-'
            }
            const experssStatus = [
              {
                id: '0',
                statusName: '-'
              },
              {
                id: '1',
                statusName: '待发货'
              },
              {
                id: '2',
                statusName: '已发货'
              },
              {
                id: '3',
                statusName: '已签收'
              },
              {
                id: '4',
                statusName: '签收失败'
              },
              {
                id: '5',
                statusName: '已退货'
              },
              {
                id: '6',
                statusName: '待审核'
              },
              {
                id: '7',
                statusName: '无效'
              }
            ]
            for (let i = 0; i < experssStatus.length; i++) {
              if (item.express_status === experssStatus[i].id) {
                item.express_status = experssStatus[i].statusName
              }
            }
          })
          this.table.tableData = _data
        })
      }
    },
    // 打开APP接口
    geiLogin() {
      if (this.classObj.teamId) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type},"uid":${this.search}}`
        } else {
          this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type}}`
        }
        this.$http.Team.getStuLoginPage({
          querysData: this.querysData,
          currentPage: this.table.currentPage
        }).then((res) => {
          this.table.totalElements = +res.data.stuLoginPage.totalElements
          const _data = res.data.stuLoginPage.content
          _data.forEach((item) => {
            item.express_ctime = timestamp(item.express_ctime, 6)
            item.first_login_time = timestamp(item.first_login_time, 2)
            if (!item.nickname) {
              item.nickname = ''
              item.head = ''
            }
            if (!item.login_time || item.login_time === '0') {
              item.login_time = '-'
              item.first_login_time = ''
            } else {
              item.first_login_time = `首次打开: ${item.first_login_time}`
            }
            if (item.page_origin === '') {
              item.page_origin = ''
            }
            const status = [
              {
                id: '0',
                statusName: '已注册'
              },
              {
                id: '1',
                statusName: '已体验课'
              },
              {
                id: '2',
                statusName: '体验完课'
              },
              {
                id: '3',
                statusName: '已月课'
              },
              {
                id: '4',
                statusName: '月课完课'
              },
              {
                id: '5',
                statusName: '已年课'
              },
              {
                id: '6',
                statusName: '年课完课'
              },
              {
                id: '7',
                statusName: '年课续费'
              },
              {
                id: '8',
                statusName: '注销失败'
              },
              {
                id: '9',
                statusName: '已季课'
              },
              {
                id: '10',
                statusName: '季课完课'
              },
              {
                id: '11',
                statusName: '已半年课'
              },
              {
                id: '12',
                statusName: '半年课完课'
              }
            ]
            for (let i = 0; i < status.length; i++) {
              if (item.status === status[i].id) {
                item.status = status[i].statusName
              }
            }
          })
          this.table.tableData = _data
        })
      }
    },
    // 参课和完课接口
    getClassCompPage() {
      if (this.classObj.teamId) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type},"uid":${this.search}}`
        } else {
          if (
            this.screenAttendClassData.courseId ||
            this.screenAttendClassData.userStatus ||
            this.screenAttendClassData.isJoinCourse ||
            this.screenAttendClassData.isCompleteCourse
          ) {
            const courseId = this.screenAttendClassData.courseId
              ? `"${this.screenAttendClassData.courseId}"`
              : `""`
            const userStatus = this.screenAttendClassData.userStatus
              ? `"${this.screenAttendClassData.userStatus}"`
              : `""`
            const isJoinCourse = this.screenAttendClassData.isJoinCourse
              ? `"${this.screenAttendClassData.isJoinCourse}"`
              : `""`
            const isCompleteCourse = this.screenAttendClassData.isCompleteCourse
              ? `"${this.screenAttendClassData.isCompleteCourse}"`
              : `""`
            this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type},"course_id":${courseId},"user_status":${userStatus},"is_join_course":${isJoinCourse},"is_complete_course":${isCompleteCourse}}`
          } else {
            this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type}}`
          }
        }
        this.$http.Team.getClassCompPage({
          querysData: this.querysData,
          currentPage: this.table.currentPage
        }).then((res) => {
          // ctime 已参课 utime 完课
          // 0 1 已参加课  1 已完课
          this.table.totalElements = +res.data.getClassCompPage.totalElements
          const _data = res.data.getClassCompPage.content
          _data.forEach((item) => {
            if (item.buy_time) {
              item.buy_time = timestamp(item.buy_time, 6)
            } else {
              item.buy_time = '-'
            }
            if (!item.nickname) {
              item.nickname = ''
              item.head = ''
            }
            if (item.course_current_num) {
              item.course_begin_time = timestamp(item.course_begin_time, 7)
              item.course_current_num = `${item.course_current_num}·${item.course_begin_time}`
            } else {
              item.course_current_num = '-'
            }
            if (item.join_course_state) {
              item.join_course_time = timestamp(item.join_course_time, 6)
            } else {
              item.join_course_state = '未参课'
              item.join_course_time = ''
            }
            if (item.complete_course_state) {
              item.complete_course_time = timestamp(
                item.complete_course_time,
                6
              )
            } else {
              item.complete_course_state = '未完课'
              item.complete_course_time = ''
            }
          })
          this.table.tableData = _data
        })
      }
    },
    // 作品及点评
    getStuComment() {
      if (this.classObj.teamId) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type},"uid":${this.search}}`
        } else {
          if (
            this.screenWorksData.courseId ||
            this.screenWorksData.isTask ||
            this.screenWorksData.isComment ||
            this.screenWorksData.isListen
          ) {
            const courseId = this.screenWorksData.courseId
              ? `"${this.screenWorksData.courseId}"`
              : `""`
            const isTask = this.screenWorksData.isTask
              ? `"${this.screenWorksData.isTask}"`
              : `""`
            const isComment = this.screenWorksData.isComment
              ? `"${this.screenWorksData.isComment}"`
              : `""`
            const isListen = this.screenWorksData.isListen
              ? `"${this.screenWorksData.isListen}"`
              : `""`
            this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type},"course_id":${courseId},"is_task":${isTask},"is_comment":${isComment},"is_listen":${isListen}}`
          } else {
            this.querysData = `{"team_id":${this.classObj.teamId},"team_type":${this.classObj.type}}`
          }
        }
        this.$http.Team.getStuCommentPage({
          querysData: this.querysData,
          currentPage: this.table.currentPage
        }).then((res) => {
          // classTitle 课程名字
          // has_listen_comment_ctime  已听点评的时间
          // task_sound 点评的音频
          // task_sound_second 音频多少秒
          this.table.totalElements = +res.data.getStuCommentPage.totalElements
          const _data = res.data.getStuCommentPage.content
          _data.forEach((item, index) => {
            item.buytime = timestamp(item.buytime, 6)
            // item.works_ctime = timestamp(item.works_ctime, 6)
            if (!item.nickname) {
              item.nickname = ''
              item.head = ''
            }
            if (item.course_current_num) {
              item.start_course_date = timestamp(item.works_ctime, 7)
              item.course_current_num = `${item.course_current_num}·${item.start_course_date}`
            } else {
              item.course_current_num = '-'
            }
            if (item.works_ctime) {
              item.works_ctime = timestamp(item.works_ctime, 6)
            }
            if (!item.task_image) {
              item.task_image = ''
              item.works_ctime = ''
            }
            if (item.has_comment_ctime) {
              item.has_comment_ctime = timestamp(item.has_comment_ctime, 6)
              item.has_comment_ctime = `已点评·${item.has_comment_ctime}`
              if (item.has_listen_time) {
                item.has_listen_time = timestamp(item.has_listen_time, 6)
                item.has_listen_time = `已听点评·${item.has_listen_time}`
              } else {
                item.has_listen_time = '未听点评'
              }
            } else {
              item.has_comment_ctime = '未点评'
            }
          })
          this.table.tableData = _data
        })
      }
    },
    // 添加物流地址 子组件传值 掉物流接口
    addExpresss(data) {
      if (data) this.getLogistics()
    },
    modifyAddressExpresss(data) {
      if (data) this.getLogistics()
    },
    // 加好友进群 已加好友子组建传值方法
    onCommandFriend(data) {
      this.codeHandle = data
      this.getCodeHandle()
    },
    // 加好友进群 已进群子组建传值方法
    onGroup(data) {
      this.codeHandle = data
      this.getCodeHandle()
    },
    handleClick(tab, event) {
      this.tabsName = tab.label
      this.table.currentPage = 1
      this.table.tableData = []
      this.screenWorksData = {}
      this.screenAttendClassData = {}
      // 切换标签 语音停止
      const audios = this.$refs
      const audiosList = Object.values(audios)
      audiosList.forEach((item, index) => {
        item[0].load()
      })
      if (tab.index === '0') {
        this.btnbox = false
        // 加好友进群
        setTimeout(() => {
          this.getGroup()
        }, 200)
        this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
        this.sortGroup = ''
        this.table.tabs = 0
        this.audioTabs = '0'
      } else if (tab.index === '1') {
        this.btnbox = false
        // 物流
        setTimeout(() => {
          this.getLogistics()
        }, 200)
        this.sortGroup = ''
        this.table.tabs = 1
        this.audioTabs = '1'
      } else if (tab.index === '2') {
        this.btnbox = false
        // 登陆
        setTimeout(() => {
          this.geiLogin()
        }, 200)
        this.sortGroup = ''
        this.table.tabs = 2
        this.audioTabs = '2'
      } else if (tab.index === '3') {
        // 参课和完课
        this.btnbox = true
        setTimeout(() => {
          this.getClassCompPage()
        }, 200)
        this.sortGroup = ''
        this.table.tabs = 3
        this.audioTabs = '3'
      } else if (tab.index === '4') {
        this.btnbox = false
        // 作品及点评
        setTimeout(() => {
          this.getStuComment()
        }, 200)
        this.sortGroup = ''
        this.table.tabs = 4
        this.audioTabs = '4'
      }
    },
    // 分页
    onCurrentPage(data) {
      this.table.currentPage = data
      setTimeout(() => {
        if (this.table.tabs === 0) {
          this.getGroup()
        } else if (this.table.tabs === 1) {
          this.getLogistics()
        } else if (this.table.tabs === 2) {
          this.geiLogin()
        } else if (this.table.tabs === 3) {
          this.getClassCompPage()
        } else if (this.table.tabs === 4) {
          this.getStuComment()
        }
      }, 200)

      var dom = document.getElementById('right-scroll')
      dom.querySelector('.scrollbar-wrapper').scrollTo(0, 0)
    },
    // 生成图片下载方法
    download(fileName, content, _this = null, shutdownLoading = false) {
      const aLink = document.createElement('a')
      const blob = this.base64ToBlob(content)

      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)

      aLink.click()
      if (shutdownLoading) {
        _this.$loading().close()
        this.finishLessonData = {
          teamId: 0,
          studentLesson: '',
          finishClassSort: 'desc',
          weekNum: '',
          childListData: [],
          imgNum: 0,
          imgSuccessNum: 0,
          opreaIndex: 0
        }
        this.ExhibitionData = {
          teamId: 0,
          weekNum: '',
          studentLesson: '',
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
.progress-list {
  font-size: 14px;
  > div {
    font-size: 14px;
    padding: 3px 5px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
.btnbox {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  .check-box {
    float: right;
  }
}
.warning {
  display: inline-block;
  width: 28px;
  height: 22px;
  position: relative;
  top: 5px;
  img {
    width: 100%;
    height: 100%;
  }
}

.search-box {
  display: flex;
  border: 0;
  margin: 0;
}

.tabs-tab {
  margin-top: 10px;
  position: relative;
  .el-input-search {
    position: absolute;
    top: 5px;
    right: 16px;
    float: right;
    width: 180px;
  }
  .el-tabs__nav-scroll {
    background: #fff;
  }
}
.table-flex {
  display: flex;
  align-items: center;
}
.div {
  padding-top: 20px;
}
.finishBox {
  position: fixed;
  left: -1000px;
}
.exhibitionBox {
  position: fixed;
  left: -1000px;
}
.checkbox {
  position: absolute;
  right: 20px;
  top: 10px;
}
</style>
<style lang="scss">
.tabs-tab {
  .el-tabs__nav-scroll {
    padding-left: 10px !important;
    background: #fff !important;
  }
  .el-tabs__nav {
    padding-left: 16px;
  }
  .el-tabs__nav-wrap::after {
    background-color: #fff !important;
  }
  .el-tabs__active-bar {
    width: 50%;
    top: 34px;
    margin-left: 16px;
  }
  .el-tabs__item {
    color: #999;
  }
  .el-tabs__item.is-active {
    color: #2a75ed;
  }
}
.work-exhibition-class {
  .system-content {
    .cur-progress {
      .progress {
        margin: 0 5px;
        color: #000;
      }

      .sets {
        font-size: 12px;
        color: #3a8ee6;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .system-radio {
      padding: 30px 0;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-radio__input {
    position: relative;
    top: 0px !important;
  }
}
.el-radio__input {
  position: relative;
  top: -8px;
}
</style>
