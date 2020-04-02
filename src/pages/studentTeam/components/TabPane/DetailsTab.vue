<!--
 * @Descripttion:
 * @version:
 * @Author: panjian
 * @Date: 2020-03-16 14:19:58
 * @LastEditors: panjian
 * @LastEditTime: 2020-04-02 21:00:20
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
        :teamId="classId.classId.id"
      />
      <el-button
        size="mini"
        type="primary"
        style="height: 30px; margin-right: 16px;"
        v-if="btnbox"
        @click="finishLessonList"
        >生成完课榜</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="btnbox"
        style="height: 30px; margin-right: 10px;"
        v-show="exhibition"
        @click="ExhibitionList"
        >生成作品展</el-button
      >
    </div>
    <div>
      <!-- <m-search
        class="search-box"
        @search="handleSearch"
        phone="uid"
        onlyPhone="1"
        phoneTip="手机号/微信昵称 查询"
        :teamId="classId.classId.id"
      /> -->

      <div class="tabs-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="加好友进群" name="group">
            <details-table
              @onCurrentPage="onCurrentPage"
              @commandFriend="onCommandFriend"
              @onGroup="onGroup"
              @onGroupSort="onGroupSort"
              :tables="table"
              :classId="classId"
              :audioTabs="audioTabs"
            ></details-table>
          </el-tab-pane>
          <el-tab-pane label="物流" name="logistics">
            <details-table
              @onCurrentPage="onCurrentPage"
              @addExpresss="addExpresss"
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
        <!-- <el-input
          class="el-input-search"
          size="mini"
          placeholder="昵称、手机号、微信信息"
          prefix-icon="el-icon-search"
          v-model="input"
          @keyup.enter.native="enter"
        >
        </el-input> -->
        <!-- <check-box class="checkbox"></check-box> -->
        <!-- 生成完课榜弹出框 -->
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
            >第一周未开课</el-radio
          >
          <el-radio
            v-model="ExhibitionData.weekNum"
            label="U1"
            v-show="radioOne"
            >第一周</el-radio
          >
          <el-radio label="2" disabled v-show="MissedClassesTwo"
            >第二周未开课</el-radio
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
      </div>
      <!-- <img
        v-show="show"
        :src="dataURL"
        alt
        class="exportImg"
        finishBox
        @load="handlePosterLoaded"
        crossorigin="anonymous"
      /> -->
      <!-- 生成完课榜图片 -->
      <div class="finishBox">
        <slot>
          <!-- 需要转换的html -->
          <finishclass
            @isLoad="canvasStart"
            :listData="finishLessonData.childListData"
            :weekNum="finishLessonData.weekNum"
          ></finishclass>
        </slot>
      </div>

      <!-- 生成作品展图片 -->
      <div class="exhibitionBox">
        <slot>
          <!-- 需要转换的html -->
          <exhibition
            @isload="CanvasStart"
            :listData="ExhibitionData.childListData"
            :weekNum="ExhibitionData.weekNum"
          ></exhibition>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
// import checkBox from '@/components/MCheckBox/index'
import detailsTable from './components/detailsTable'
import MSearch from '@/components/MSearch/index.vue'
import axios from '@/api/axios'
import { timestamp, GetAgeByBrithday, isToss } from '@/utils/index'
import status from '@/utils/status'
import finishclass from './FinishClass'
import exhibition from './Exhibition'
import html2canvas from 'html2canvas'
export default {
  components: {
    detailsTable,
    finishclass,
    exhibition,
    MSearch
    // checkBox
  },
  props: {
    classId: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 完课榜隐藏单选框-------作品展隐藏单选框
      radioOne: true,
      radioTwo: true,
      MissedClassesOne: false,
      MissedClassesTwo: false,

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
        finishClassSort: 'asc',
        weekNum: '',
        childListData: {}
      },
      // 作品展相关数据
      ExhibitionData: {
        teamId: 0,
        weekNum: '',
        studentLesson: '',
        childListData: {}
      },
      // tabs标签默认状态
      activeName: 'group',
      tablsName: '',
      codeHandle: {},
      // 弹出框
      dialogTableVisible: false,
      dialogFormVisible: false,
      Exhibition: false,
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
      sortGroup: ''
    }
  },
  watch: {
    // getQcUrl: function() {
    //   this.handlePosterLoad()
    // },
    classId(value) {
      // 切换标签 语音停止
      const audios = this.$refs
      const audiosList = Object.values(audios)
      audiosList.forEach((item, index) => {
        item[0].load()
      })
      // this.table.audioIndex = 10000
      this.sortGroup = ''
      this.table.currentPage = 1
      console.log(value.classId, 'classId')
      if (value.classId) {
        this.tableDataEmpty = true
        if (value.classId.team_type === 0) {
          this.type = 'TRAIL'
        } else if (value.classId.team_type === 1) {
          this.type = 'MONTH'
        } else if (value.classId.team_type === 2) {
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
    }
  },
  mounted() {
    const teacherId = isToss()
    if (teacherId) {
      this.teacherId = teacherId
    }
    console.log(status, 'status')
    this.table.tableLabel = [{ label: '购买时间', prop: 'buytime' }]
  },
  methods: {
    // 排序
    onGroupSort(data) {
      // this.sortGroup = `sort:${data}`
      this.sortGroup = `sort:${JSON.stringify(data)}`
      console.log(this.sortGroup, 'sort 父组件')
      this.getGroup()
    },
    // 搜索组件传回来的值
    handleSearch(res) {
      console.log(res, 'res[0].term.uid')
      if (res.length === 0) {
        console.log('res传的空')
        this.search = ''
        this.getGroup()
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
      } else {
        console.log('res', res[0].term.uid)
        this.search = `"${res[0].term.uid}"`
        this.getGroup()
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
      }
    },
    // 生成完课榜----确定按钮
    async clickHandler() {
      // 确认第几周
      console.log(
        'this.finishLessonData.weekNum -- val ',
        this.finishLessonData.weekNum
      )

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
      // 确认第几周
      console.log(
        'this.ExhibitionData.weekNum -- val ',
        this.ExhibitionData.weekNum
      )
      // 获取第几周的数据
      await this.getStuTaskRankingList(
        this.ExhibitionData.teamId,
        // this.ExhibitionData.studentLesson,
        this.ExhibitionData.weekNum
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
        html2canvas(document.getElementsByClassName('finishBox')[0], {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          useCORS: true,
          async: true,
          allowTaint: false
        }).then((canvas) => {
          const data = canvas.toDataURL('image/jpeg')
          // 执行浏览器下载
          this.download(`${picname}.jpeg`, data)
          this.finish = false
          // this.dataURL = data
        })
      })
    },
    //  生成作品展
    E_handlePosterLoad(picname) {
      this.$nextTick(() => {
        window.scrollTo(0, 0)
        html2canvas(document.getElementsByClassName('exhibitionBox')[0], {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          useCORS: true,
          async: true,
          allowTaint: false
        }).then((canvas) => {
          const data = canvas.toDataURL('image/jpeg')
          // 执行浏览器下载
          this.download(`${picname}.jpeg`, data)
          this.finish = false
          // this.dataURL = data
        })
      })
    },
    // 点击显示完课榜
    finishLessonList(week) {
      if (
        this.classId &&
        this.classId.classId &&
        this.classId.classId.id &&
        this.classId.classId.current_lesson
      ) {
        // 显示弹框
        console.log('this.classid ------>>>>>', this.classId)
        this.dialogFormVisible = true
        this.finishLessonData.teamId = this.classId.classId.id
        const currentLesson = this.classId.classId.current_lesson.substring(
          0,
          6
        )
        this.finishLessonData.studentLesson = currentLesson.substring(0, 4)
        this.finishLessonData.weekNum = currentLesson.substring(4, 6)
        console.log(
          'this.finishLessonData.weekNum ------>>>>>',
          this.finishLessonData.weekNum
        )
        this.btnshow(
          this.finishLessonData.weekNum,
          this.classId.classId.team_state
        )
        // const state = '0'
        // const weekNum = 'U1'
        // this.btnshow(weekNum, state)
      } else {
        console.log('this.classId.classId.id  undefined')
      }
    },
    // 生成图片周按钮显示状态
    btnshow(weekNum, state) {
      console.log('weekNum', weekNum)
      console.log('state', state)
      if (weekNum === 'U1') {
        if (state === 0) {
          this.radioOne = false
          this.radioTwo = false
          this.MissedClassesOne = true
          this.MissedClassesTwo = true
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
        }
      }
    },
    // 点击显示作品展
    ExhibitionList(week) {
      if (
        this.classId &&
        this.classId.classId &&
        this.classId.classId.id &&
        this.classId.classId.current_lesson
      ) {
        this.Exhibition = true
        this.ExhibitionData.teamId = this.classId.classId.id
        // this.ExhibitionData.teamId = '100'
        // this.ExhibitionData.weekNum = 'S1L1U1'
        const currentLesson = this.classId.classId.current_lesson.substring(
          0,
          6
        )
        // this.ExhibitionData.studentLesson = currentLesson.substring(0, 4)
        this.ExhibitionData.weekNum = currentLesson.substring(4, 6)
        this.btnshow(
          this.ExhibitionData.weekNum,
          this.classId.classId.team_state
        )
      } else {
        console.log('this.classId.classId.id  undefined')
      }
    },
    // 请求完课榜 - 接口数据
    getStuRankingList(teamId, lesson, week) {
      if (!teamId || !lesson || !week) {
        console.log('getStuRankingList - error:', ' 缺少毕传信息')
        return
      }
      this.$loading()
      const queryParams = `{"team_id" : ${teamId}, "week" : "${lesson +
        week}", "sort" : "${this.finishLessonData.finishClassSort}"}`
      console.log(
        'request - params  -->> ',
        'team_id: ' + teamId + ' , lesson :' + lesson + ' , week : ' + week
      )
      axios
        .post('/graphql/getStuRankingList', {
          query: `{
                getStuComRankingList(query : ${JSON.stringify(queryParams)}){
                student_id
                mobile
                username
                head
                completeArr {
                current_lesson
                is_complete
                }
            }
          }`
        })
        .then((res) => {
          if (res.error) {
            console.log(res.error, '接口错误信息-------------->')
            return
          }
          this.finishLessonData.childListData = res
        })
    },

    // 请求作品展-接口数据
    getStuTaskRankingList(teamId, week) {
      if (!teamId || !week) {
        return
      }
      this.$loading()
      const QueryParams = `{"team_id" : ${teamId}, "week" :  "${week}"}`
      axios
        .post('/graphql/getStuRankingList', {
          query: `{
            getStuTaskRankingList(query : ${JSON.stringify(QueryParams)}){
            student_id
            mobile
            username
            head
            completeArr {
            current_lesson
            task_image
                }
                }
                  }`
        })
        .then((res) => {
          if (res.error) {
            console.log(res.error, '接口错误信息-------------->')
            return
          }
          this.ExhibitionData.childListData = res
          console.log(res, '+_+_+_+_+_+_+_+_')
        })
    },
    // 绘制生成完课榜图片
    canvasStart(res) {
      if (res) {
        this.handlePosterLoad(this.classId.classId.team_name)
      }
    },
    // 绘制生成作品展图片
    CanvasStart(res) {
      if (res) {
        this.E_handlePosterLoad(this.classId.classId.team_name)
      }
    },
    // 加好友进群 修改已加好友 已进群 接口
    getCodeHandle() {
      this.$http.User.updateTeamStudent({
        studentId: this.codeHandle.studentId,
        teamId: this.classId.classId.id,
        courseType: this.type,
        addedGroup: this.codeHandle.addedGroup,
        addedWechat: this.codeHandle.addedWechat
      })
        .catch((err) => console.log(err, '修改失败'))
        .then((res) => {
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
        })
    },
    // 加好友进群接口
    getGroup() {
      if (this.classId && this.classId.classId && this.classId.classId.id) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type},"uid":${this.search}}`
        } else {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
        }
        console.log(this.search, 'this.search')

        axios
          .post('/graphql/user', {
            query: `{
                userListForTeam(query:${JSON.stringify(
                  this.querysData
                )} , page: ${this.table.currentPage}, size: 20,${
              this.sortGroup
            }) {
                empty
                first
                last
                number
                size
                numberOfElements
                totalElements
                totalPages
                content {
                  id
                  nickname
                  sex
                  birthday
                  head
                  mobile
                  base_painting
                  follow
                  added_group
                  added_wechat
                  buytime
                  added_wechat_time
                  added_group_time
                  follow_time
                }
              }
            }`
          })
          .then((res) => {
            this.table.tableData = []
            // 0 默认 1 男 2 女 3 保密
            // 0 默认  1 无基础  2 一年以下 3 一年以上
            // 0 叉 1 对号
            this.table.totalElements = +res.data.userListForTeam.totalElements
            const _data = res.data.userListForTeam.content
            _data.forEach((item) => {
              item.birthday = GetAgeByBrithday(item.birthday)
              if (item.sex === '0') {
                item.sex = '- ·'
              } else if (item.sex === '1') {
                item.sex = '男 ·'
              } else if (item.sex === '2') {
                item.sex = '女 ·'
              } else if (item.sex === '3') {
                item.sex = '保密 ·'
              }
              if (item.birthday.indexOf(50) !== -1) {
                item.birthday = '-'
              }
              item.buytime = timestamp(item.buytime, 6)
              item.added_wechat_time = timestamp(item.added_wechat_time, 6)
              item.added_group_time = timestamp(item.added_group_time, 6)
              item.follow_time = timestamp(item.follow_time, 6)
              if (item.base_painting === '0') {
                item.base_painting = ' '
              } else if (item.base_painting === '1') {
                item.base_painting = '无基础'
              } else if (item.base_painting === '2') {
                item.base_painting = '一年以下'
              } else if (item.base_painting === '3') {
                item.base_painting = '一年以上'
              }
            })
            console.log(this.tableDataEmpty)
            if (this.tableDataEmpty) {
              this.table.tableData = _data
            } else {
              this.table.tableData = []
              this.tableDataEmpty = true
            }
          })
      } else {
        console.log('this.classId.classId.id  undefined')
      }
    },
    // 物流接口
    getLogistics() {
      if (this.classId && this.classId.classId && this.classId.classId.id) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type},"uid":${this.search}}`
        } else {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
        }
        // const logisticsSort = '{"login_time":"desc"}}'
        axios
          .post('/graphql/express', {
            query: `{
              stuExpressPage(query:${JSON.stringify(this.querysData)} , page: ${
              this.table.currentPage
            }, size: 20) {
              empty
              first
              last
              number
              size
              numberOfElements
              totalElements
              totalPages
              content {
                id
                head
                nickname
                username
                address_detail
                province
                city
                area
                express_status
                ctime
                mobile
                user_id
                order_id
                receipt_tel
                receipt_name
                product_name
              }
            }
          }`
          })
          .then((res) => {
            console.log(res, 'experessssssss')
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
                  statusName: '待确认'
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
      if (this.classId && this.classId.classId && this.classId.classId.id) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type},"uid":${this.search}}`
        } else {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
        }
        // const querys = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`

        axios
          .post('/graphql/getClassLogin', {
            query: `{
          stuLoginPage(query:${JSON.stringify(this.querysData)}, page: ${
              this.table.currentPage
            }, size: 20) {
            first
            last
            number
            size
            totalPages
            totalElements
            content {
              id
              head
              username
              nickname
              ctime
              mobile
              status
              login_time
              express_ctime
              first_login_time
              page_origin
            }
          }
        }`
          })
          .then((res) => {
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
      if (this.classId && this.classId.classId && this.classId.classId.id) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type},"uid":${this.search}}`
        } else {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
        }

        axios
          .post('/graphql/getClassComplete', {
            query: `{
            getClassCompPage(query:${JSON.stringify(this.querysData)}, page: ${
              this.table.currentPage
            }, size: 20) {
              first
              last
              number
              size
              totalPages
              totalElements
              content {
                mobile
                buy_time
                username
                nickname
                head
                status
                course_id
                course_title
                course_begin_time
                course_current_num
                join_course_state
                join_course_time
                complete_course_state
                complete_course_time
              }
            }
          }`
          })
          .then((res) => {
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
                item.join_course_state = '-'
                item.join_course_time = ''
              }
              if (item.complete_course_state) {
                item.complete_course_time = timestamp(
                  item.complete_course_time,
                  6
                )
              } else {
                item.complete_course_state = '-'
                item.complete_course_time = ''
              }
            })
            this.table.tableData = _data
          })
      }
    },
    // 作品及点评
    getStuComment() {
      if (this.classId && this.classId.classId && this.classId.classId.id) {
        if (this.search) {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type},"uid":${this.search}}`
        } else {
          this.querysData = `{"team_id":${this.classId.classId.id},"team_type":${this.classId.type}}`
        }

        axios
          .post('/graphql/getStuComment', {
            query: `{
            getStuCommentPage(query:${JSON.stringify(this.querysData)}, page: ${
              this.table.currentPage
            }, size: 20) {
              empty
              first
              last
              number
              size
              numberOfElements
              totalElements
              totalPages
              content {
                id
                team_name
                current_lesson
                buytime
                classTitle
                course_current_num
                start_course_date
                status
                head
                mobile
                username
                nickname
                task_image
                works_ctime
                task_sound
                task_video
                task_video_second
                task_sound_second
                has_comment_ctime
                has_comment_utime
                has_listen_time
                sound_comment
                sound_comment_second
                listenInfoArr {
                  task_image
                  works_ctime
                  task_sound
                  task_video
                  task_video_second
                  task_sound_second
                }
              }
            }
          }`
          })
          .then((res) => {
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
                item.has_comment_ctime = '-'
              }
            })
            this.table.tableData = _data
          })
      }
    },
    // 添加物流地址 子组件传值 掉物流接口
    addExpresss(data) {
      console.log(data, '父组件')
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
      // 切换标签 语音停止
      const audios = this.$refs
      const audiosList = Object.values(audios)
      audiosList.forEach((item, index) => {
        item[0].load()
      })
      // this.table.audioIndex = 10000
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
    download(fileName, content) {
      const aLink = document.createElement('a')
      const blob = this.base64ToBlob(content)

      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true)
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)

      // aLink.dispatchEvent(evt);
      aLink.click()
      this.$loading().close()
    },
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
    },
    enter(val) {
      console.log('input', val, this.input)
    }
  }
}
</script>
<style lang="scss" scoped>
.btnbox {
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
}
.search-box {
  display: flex;
  border: 0;
  margin: 0 -60px 0 0;
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
    color: #409eff;
  }
}
.el-radio__input {
  position: relative;
  top: -8px;
}
</style>
