<template>
  <el-row class="app-main height weixin">
    <el-scrollbar wrap-class="scrollbar-wrapper" id="wechat-scroll">
      <m-search
        @search="searchHandler"
        wxSerch="wechat_no"
        wxTeacherPhone="teacher_id"
        wxStatus="is_effective"
        wxConcatTeacher="wechatJud"
      >
        <el-button
          type="primary"
          @click="showNewWeChat = true"
          size="mini"
          slot="searchItems"
          >新增微信</el-button
        >
      </m-search>
      <!-- 选择框 -->
      <el-table
        style="padding-bottom:70px;"
        :data="table.tableData"
        @cell-mouse-enter="onClick"
        :cell-style="cellStyle"
        :header-cell-style="headerCss"
      >
        <el-table-column label="微信号">
          <template slot-scope="scope">
            <div class="weixin-box">
              <el-dropdown>
                <div>
                  <img src="../../../../assets/images/point.png" alt="" />
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="operation(scope.row, '1')">
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="operation(scope.row, '2')">
                    关联老师
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <img class="weixinHead" :src="scope.row.head_img_url" alt="" />
              <span class="weixinName">{{ scope.row.wechat_no }}</span>
              <!-- 鼠标指向显示二维码 -->
              <el-popover placement="right" trigger="hover">
                <img
                  :src="scope.row.wechat_qr_code"
                  style="width:150px;height:150px;"
                  alt=""
                />
                <span
                  class="code"
                  slot="reference"
                  style="color: #2a75ed"
                  v-if="scope.row.wechat_qr_code"
                  >二维码</span
                >
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="使用状态" width="180">
          <template slot-scope="scope">
            <span>{{ openTeacher[scope.row.id] | filterStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="关联老师" width="180">
          <template slot-scope="scope">
            <span>{{
              concatTeacher[scope.row.teacher_id] &&
                concatTeacher[scope.row.teacher_id].teachername
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="老师手机号">
          <template slot-scope="scope">
            <span v-if="concatTeacher[scope.row.teacher_id]">{{
              concatTeacher[scope.row.teacher_id] &&
                concatTeacher[scope.row.teacher_id].phone
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所在部门">
          <template slot-scope="scope">
            <span v-if="concatTeacher[scope.row.teacher_id]">
              {{
                concatTeacher[scope.row.teacher_id] &&
                  concatTeacher[scope.row.teacher_id].pteamname
              }}</span
            ><br />
            {{
              concatTeacher[scope.row.teacher_id] &&
                concatTeacher[scope.row.teacher_id].teamname
            }}
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        @current-change="handleCurrentChange"
        :current-page="+currentPage"
        :total="+totalElements"
        open="calc(100vw - 170px - 24px)"
        close="calc(100vw - 50px - 24px)"
      />
      <el-dialog title="编辑信息" :visible.sync="showEditWeChat" width="45%">
        <editWeChat
          v-if="showEditWeChat"
          @editWeChat="editWeChat"
          :weixinId="weixinId"
        />
      </el-dialog>
      <el-dialog
        title="关联老师"
        :visible.sync="showRelationTeacher"
        width="35%"
      >
        <showRelationTeacher
          v-if="showRelationTeacher"
          @relationTeacher="relationTeacher"
          :weixinId="weixinId"
        />
      </el-dialog>
      <el-dialog title="新增微信" :visible.sync="showNewWeChat" width="45%">
        <addWeChat v-if="showNewWeChat" @addWeChat="addWeChat" />
      </el-dialog>
    </el-scrollbar>
  </el-row>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import MSearch from '@/components/MSearch/index.vue'
import addWeChat from './components/addWeChat'
import showRelationTeacher from './components/showRelationTeacher'
import editWeChat from './components/editWeChat'
export default {
  components: {
    MPagination,
    MSearch,
    addWeChat,
    showRelationTeacher,
    editWeChat
  },

  data() {
    return {
      // 微信ID
      weixinId: '',
      // 编辑信息
      showEditWeChat: false,
      // 关联老师
      showRelationTeacher: false,
      // 新增微信
      showNewWeChat: false,
      showExpress: false,
      // 总页数
      totalElements: null,
      totalPages: 1,
      // 当前页数
      currentPage: 1,
      // 微信管理列表
      table: {
        tabs: 0,
        // 列表数据
        tableData: []
      },
      // 关联老师
      concatTeacher: {},
      openTeacher: {},
      // 搜索
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        }
      ],
      value: '',
      // 输入框
      restaurants: [],
      state: '',
      timeout: null,
      // 搜索
      querSearch: '',
      searchQuery: null
    }
  },

  mounted() {
    this.weChatPageList()
  },
  filters: {
    filterStatus(res) {
      if (res === 0) {
        return '启用'
      } else {
        return '停用'
      }
    },
    weixinFilterStatus(res) {
      if (res === '') {
        return ''
      }
    }
  },
  methods: {
    // 点击操作按钮
    operation(val, index) {
      if (index === '1') {
        this.showEditWeChat = true
      } else if (index === '2') {
        this.showRelationTeacher = true
      }
    },
    searchHandler(res) {
      this.currentPage = 1
      if (res.length > 0) {
        const wildcard = {}
        res.forEach((item) => {
          Object.assign(wildcard, item.wildcard)
        })
        this.searchQuery = wildcard
        // 是否关联老师
        res.forEach((res) => {
          if (res.term && res.term.wechatJud === '0') {
            this.querSearch = { teacher_id: { lte: 0 } }
          } else if (res.term && res.term.wechatJud === '1') {
            this.querSearch = { teacher_id: { gt: 0 } }
          }
        })
      } else {
        this.querSearch = ''
        this.searchQuery = ''
      }
      if (res.length === 0) {
        this.weChatPageList()
      }
      if (this.querSearch && this.searchQuery) {
        Object.assign(this.searchQuery, this.querSearch)
      }
      if (this.searchQuery.wechat_no || this.searchQuery.teacher_id) {
        this.weChatPageList(this.searchQuery)
      }
    },
    // 微信管理列表
    weChatPageList(params) {
      console.log('params哈哈哈哈哈', params)
      if (!params) {
        params = ''
      }
      this.$http.Weixin.getWeChatTeacherPage(params, this.currentPage)
        .catch((err) => console.log(err))
        .then((res) => {
          // 总条数
          this.totalElements = +res.data.WeChatTeacherPage.totalElements
          // console.log('####this.totalElements###', this.totalElements)
          // 当前是第几页
          this.currentPage = +res.data.WeChatTeacherPage.number
          // console.log('####this.currentPage###', this.currentPage)
          this.table.tableData = res.data.WeChatTeacherPage.content
          const arrayTId = []
          const arrayWId = []
          this.table.tableData.forEach((item) => {
            item.teacher_id && arrayTId.push(item.teacher_id)
            item.id && arrayWId.push(item.id)
          })
          // 启用
          this.$http.Weixin.getTeacherWeixinRelationList(arrayWId)
            .catch((err) => console.log(err))
            .then((res) => {
              const jsondata = {}
              if (res.data.TeacherWeixinRelationList) {
                res.data.TeacherWeixinRelationList.forEach((item) => {
                  jsondata[item.weixin_id] = item.is_effective
                })
                this.openTeacher = jsondata
              }
            })
          // 微信管理列表所在部门
          this.$http.Weixin.getTeacherList(arrayTId)
            .catch((err) => console.log(err))
            .then((res) => {
              // console.log('微信管理列表所在部门', res)
              const jsonData = {}
              if (res.data.TeacherList) {
                res.data.TeacherList.forEach((item) => {
                  const tmp = {
                    phone: '',
                    teacherid: '',
                    teachername: '',
                    teamname: '',
                    teamid: '',
                    pteamname: ''
                  }
                  item.phone && (tmp.phone = item.phone)
                  item.id && (tmp.teacherid = item.id)
                  item.realname && (tmp.teachername = item.realname)
                  item.department.name && (tmp.teamname = item.department.name)
                  item.department.pname &&
                    (tmp.pteamname = item.department.pname)
                  item.department.id && (tmp.teamid = item.department.id)
                  jsonData[item.id] = tmp
                  // console.log('+_+_+_tmp+_+_+', tmp)
                  // console.log('+)+)+)+)+)jsonData+(+(+(+(+(+', jsonData)
                })
                this.concatTeacher = jsonData
              }
            })
        })
    },
    // 单元格回调样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:55px;'
      }
      if (columnIndex === 3) {
        return 'padding-left:10px;'
      }
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'font-size:12px;color:#666;font-weight:normal;padding-left:100px;'
      }
      return 'font-size:12px;color:#666;font-weight:normal;'
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.weChatPageList(this.searchQuery)
    },
    // 获取表格一行信息
    onClick(row, column, event) {
      this.weixinId = row.id
      // console.log(row, column, event)
    },
    // 新增微信关闭弹框
    addWeChat(data) {
      if (data === 1) {
        this.showNewWeChat = false
        setTimeout(() => {
          this.weChatPageList()
        }, 1000)
      } else if (data === 2) {
        this.showNewWeChat = false
      }
    },
    // 修改微信信息关闭弹框
    editWeChat(data) {
      if (data === 1) {
        this.showEditWeChat = false
        setTimeout(() => {
          this.weChatPageList()
        }, 1000)
      } else if (data === 2) {
        this.showEditWeChat = false
      }
    },
    relationTeacher(data) {
      if (data === 1) {
        this.showRelationTeacher = false
        setTimeout(() => {
          this.weChatPageList()
        }, 1000)
      } else if (data === 2) {
        this.showRelationTeacher = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.weixin {
  display: flex;
  flex-direction: column;
  padding: 10px;
  .el-card {
    padding-top: 14px;
    padding-bottom: 14px;
    box-sizing: border-box;
  }
  .weixin-box {
    line-height: 30px;
    display: flex;
    .weixinHead {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-left: 10px;
    }
    span {
      display: inline-block;
    }
    .code {
      display: inline-block;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .weixinName {
    margin-left: 10px;
  }
  .public {
    color: blue;
    cursor: pointer;
  }
  .operatingTwo {
    margin-left: 10px;
  }
  .operatingThree {
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
.weixin .scrollbar-wrapper {
  overflow-x: hidden;
}
.weixin .el-scrollbar {
  flex: 1;
}
</style>
