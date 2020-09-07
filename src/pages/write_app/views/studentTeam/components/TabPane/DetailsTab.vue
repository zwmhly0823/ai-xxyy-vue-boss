<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 14:19:58
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-07 21:00:09
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
        :classObj="classObj"
        :teamType="`${classObj.type == 0 ? '0' : '1'}`"
        :teamId="classObj.teamId"
      />
      <!-- TODO: -->
      <!-- <el-button
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
        @click="ExhibitionList"
        >生成作品展</el-button
      > -->
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
          width="500px"
        >
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
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="clickHandler">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 生成作品展弹出框 -->
        <el-dialog
          title="请选择生成的作品展周数"
          :visible.sync="Exhibition"
          width="500px"
        >
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
          <div slot="footer" class="dialog-footer">
            <el-button @click="Exhibition = false">取 消</el-button>
            <el-button type="primary" @click="exhibitionBtn">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 系统课点击生成完课榜与作品展提示框 -->
        <el-dialog title="活动未开放" :visible.sync="Tips" width="30%">
          <span class="warning"
            ><img src="@/assets/images/warning.png" alt=""
          /></span>
          <span>此活动仅限体验课</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="Tips = false">取 消</el-button>
            <el-button type="primary" @click="Tips = false">确 定</el-button>
          </span>
        </el-dialog>
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
      // 完课榜隐藏单选框
      radioOne: true,
      radioTwo: true,
      MissedClassesOne: false,
      MissedClassesTwo: false,
      // 作品展隐藏单选框
      // RadioOne: true,
      // RadioTwo: true,
      // missedClassesOne: false,
      // missedClassesTwo: false,
      teacherId: '',
      search: '',
      querysData: '',
      experssShow: false,
      // 单选按钮
      // radio: '',
      // finish: false,
      btnbox: false,
      type: null,
      input: '',
      // 完课榜
      show: false,
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
      formLabelWidth: '120px',
      tableDataEmpty: true,
      sortGroup: '',
      screenWorksData: {},
      screenAttendClassData: {},
      teamDetail: {}
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
      this.getGroup()
      if (this.tabsName === '加好友进群') {
        setTimeout(() => {
          this.getGroup()
        }, 200)
      } else if (this.tabsName === '物流') {
        setTimeout(() => {
          this.getLogistics()
        }, 200)
      } else if (this.tabsName === '打开APP') {
        setTimeout(() => {
          this.geiLogin()
        }, 200)
      } else if (this.tabsName === '参课和完课') {
        setTimeout(() => {
          this.getClassCompPage()
        }, 200)
      } else if (this.tabsName === '作品及点评') {
        setTimeout(() => {
          this.getStuComment()
        }, 200)
      }
    } else {
      this.tableDataEmpty = false
      this.table.tableData = []
    }
  },
  watch: {
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
      this.search = res.length ? `"${res[0].term.uid}"` : ''
      this.table.currentPage = 1
      // this.getGroup()
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
      this.show = true
      // 执行 截图操作并保存
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
      this.show = true
      this.Exhibition = false
      // 执行 截图操作并保存
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
    // 点击显示完课榜 TODO:
    finishLessonList(week) {
      if (this.teamDetail.id && this.teamDetail.current_lesson) {
        // 显示弹框
        this.dialogFormVisible = true
        this.finishLessonData.teamId = this.teamDetail.id
        const currentLesson = this.teamDetail.current_lesson.substring(0, 6)
        this.finishLessonData.studentLesson = currentLesson.substring(0, 4)
        this.finishLessonData.weekNum = currentLesson.substring(4, 6)
        this.btnshow(
          this.finishLessonData.weekNum,
          this.classObj.type,
          // TODO:
          this.teamDetail.team_state
        )
        // const state = '0'
        // const weekNum = 'U1'
        // this.btnshow(weekNum, state)
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
        // this.finishLessonData.isRequest = false
        // this.ExhibitionData.isRequest = false
        // this.radioOne = false
        // this.radioTwo = false
        // this.MissedClassesOne = true
        // this.MissedClassesTwo = true
        this.dialogFormVisible = false
        this.Exhibition = false
        this.Tips = true
      }
    },
    // 生成完作品展图片周按钮显示状态
    // Btnshow(weekNum, state) {
    //   if (weekNum === 'U1') {
    //     if (state === 2) {
    //       this.RadioOne = true
    //       this.RadioTwo = false
    //       this.missedClassesOne = false
    //       this.missedClassesTwo = true
    //     } else {
    //       this.RadioOne = false
    //       this.RadioTwo = false
    //       this.missedClassesOne = true
    //       this.missedClassesTwo = true
    //     }
    //   } else if (weekNum === 'U2') {
    //     if (state === 2) {
    //       this.RadioOne = true
    //       this.RadioTwo = true
    //       this.missedClassesOne = false
    //       this.missedClassesTwo = false
    //     } else {
    //       this.RadioOne = true
    //       this.RadioTwo = false
    //       this.missedClassesOne = false
    //       this.missedClassesTwo = true
    //     }
    //   }
    // },
    // 点击显示作品展
    ExhibitionList(week) {
      if (this.teamDetail.id && this.teamDetail.current_lesson) {
        this.Exhibition = true
        this.ExhibitionData.teamId = this.teamDetail.id
        // this.ExhibitionData.teamId = '100'
        // this.ExhibitionData.weekNum = 'S1L1U1'
        const currentLesson = this.teamDetail.current_lesson.substring(0, 6)
        // this.ExhibitionData.studentLesson = currentLesson.substring(0, 4)
        this.ExhibitionData.weekNum1 = currentLesson
        this.ExhibitionData.weekNum = currentLesson.substring(4, 6)
        this.btnshow(
          this.ExhibitionData.weekNum,
          this.teamDetail.team_type,
          this.teamDetail.team_state
        )
      }
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
      console.log(
        'request - params  -->> ',
        'team_id: ' + teamId + ' , lesson :' + lesson + ' , week : ' + week
      )
      this.$http.Team.finishClassList({
        queryParams: queryParams
      }).then((res) => {
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
      this.$http.Team.exhibitionOfWorks({
        QueryParams: QueryParams
      }).then((res) => {
        if (res.error) {
          return
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
      console.log(this.classObj.type, 'classObj.type')
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
            // if (item.course_current_num) {
            //   item.course_begin_time = timestamp(item.course_begin_time, 7)
            //   item.course_current_num = `${item.course_current_num}·${item.course_begin_time}`
            // } else {
            //   item.course_current_num = '-'
            // }
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
            // if (item.course_current_num) {
            //   item.start_course_date = timestamp(item.works_ctime, 7)
            //   item.course_current_num = `${item.course_current_num}·${item.start_course_date}`
            // } else {
            //   item.course_current_num = '-'
            // }
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
      if (data) {
        this.getLogistics()
        // this.experssShow = true
      }
    },
    modifyAddressExpresss(data) {
      if (data) {
        this.getLogistics()
        // this.experssShow = true
      }
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
      if (this.table.tabs === 0) {
        setTimeout(() => {
          this.getGroup()
        }, 200)
      } else if (this.table.tabs === 1) {
        setTimeout(() => {
          this.getLogistics()
        }, 200)
      } else if (this.table.tabs === 2) {
        setTimeout(() => {
          this.geiLogin()
        }, 200)
      } else if (this.table.tabs === 3) {
        setTimeout(() => {
          this.getClassCompPage()
        }, 200)
      } else if (this.table.tabs === 4) {
        setTimeout(() => {
          this.getStuComment()
        }, 200)
      }
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
.btnbox {
  display: flex;
  align-items: center;
  width: 100%;
  // height: 40px;
  margin-top: 10px;
  // .btn {
  //   position: absolute;
  //   right: 18px;
  // }
  // .Btn {
  //   position: absolute;
  //   right: 150px;
  // }
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
  // padding-left: 20px;
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
  /* justify-content: space-between; */
  align-items: center;
}
.div {
  padding-top: 20px;
}
// .exportImg {
//   display: flex;
//   align-self: center;
//   width: 550px;
// }
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
.el-radio__input {
  position: relative;
  top: -8px;
}
</style>
