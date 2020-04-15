<template>
  <div class="weixin">
    <m-search
      @search="searchHandler"
      wxSerch="wx"
      wxInput="inp"
      wxStatus="st"
      wxConcatTeacher="ts"
    >
    </m-search>
    <el-button
      type="primary"
      @click="showNewWeChat = true"
      size="mini"
      style="height:30xp;"
      >新增微信</el-button
    >
    <!-- 选择框 -->
    <el-table
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
              <span class="code" slot="reference">二维码</span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="使用状态" width="180">
        <template slot-scope="scope">
          <span>{{ openTeacher[scope.row.teacher_id] | filterStatus }}</span>
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
      <el-table-column align="center" label="老师手机号" width="180">
        <template slot-scope="scope">
          <span v-if="concatTeacher[scope.row.teacher_id]">{{
            concatTeacher[scope.row.teacher_id] &&
              concatTeacher[scope.row.teacher_id].phone
          }}</span>
          <!-- <span else>--</span> -->
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在部门">
        <template slot-scope="scope">
          <span v-if="concatTeacher[scope.row.teacher_id]"
            >{{
              concatTeacher[scope.row.teacher_id] &&
                concatTeacher[scope.row.teacher_id].teamname
            }}/{{
              concatTeacher[scope.row.teacher_id] &&
                concatTeacher[scope.row.teacher_id].pteamname
            }}</span
          >
          <!-- <span else>--</span> -->
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="操作">
        <template>
          <span class="operatingOne public" @click="showExpress = true"
            >详情</span
          >
          <span class="operatingThree public" @click="showExpress = true"
            >关联老师</span
          >
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <m-pagination
      :current-page="currentPage"
      :page-count="totalPages"
      :total="+table.totalElements"
      show-pager
      open="calc(100vw - 170px - 24px)"
      close="calc(100vw - 50px - 24px)"
    ></m-pagination>
    <el-dialog title="编辑信息" :visible.sync="showEditWeChat" width="45%">
      <editWeChat v-if="showEditWeChat" :weixinId="weixinId" />
    </el-dialog>
    <el-dialog title="关联老师" :visible.sync="showRelationTeacher" width="35%">
      <showRelationTeacher v-if="showRelationTeacher" :weixinId="weixinId" />
    </el-dialog>
    <el-dialog title="新增微信" :visible.sync="showNewWeChat" width="45%">
      <addWeChat v-if="showNewWeChat" @addWeChat="addWeChat" />
    </el-dialog>
  </div>
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
      totalPages: 1,
      // 当前页数
      currentPage: 1,
      // 微信管理列表
      table: {
        tabs: 0,
        // 列表数据
        tableData: [],
        // 总条数
        totalElements: null,
        // 当前页
        currentPage: 1
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
      timeout: null
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
        return '未启用'
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
      console.log(res)
    },
    // 微信管理列表
    weChatPageList() {
      this.$http.Weixin.getWeChatTeacherPage()
        .catch((err) => console.log(err))
        .then((res) => {
          this.table.totalElements = +res.data.WeChatTeacherPage.totalElements
          this.table.tableData = res.data.WeChatTeacherPage.content
          const arrayTId = []
          this.table.tableData.forEach((item) => {
            arrayTId.push(item.teacher_id)
          })
          // 启用
          this.$http.Weixin.getTeacherWeixinRelationList(arrayTId)
            .catch((err) => console.log(err))
            .then((res) => {
              const jsondata = {}
              if (res.data.TeacherWeixinRelationList) {
                res.data.TeacherWeixinRelationList.forEach((item) => {
                  jsondata[item.teacher_id] = item.is_effective
                })
                this.openTeacher = jsondata
              }
              console.log('openTeacher', this.openTeacher)
            })
          // 微信管理列表所在部门
          this.$http.Weixin.getTeacherList(arrayTId)
            .catch((err) => console.log(err))
            .then((res) => {
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
                })
                this.concatTeacher = jsonData
              }
            })
        })
    },
    // 单元格回调样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding-left:25px;'
      }
    },
    // 表头回调样式
    headerCss({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'font-size:12px;color:#666;font-weight:normal;padding-left:50px;'
      }
      return 'font-size:12px;color:#666;font-weight:normal;'
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('onCurrentPage', val)
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
      }
    }
  }
}
</script>

<style scoped lang="scss">
.weixin {
  width: 98%;
  margin: 0px auto;
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
