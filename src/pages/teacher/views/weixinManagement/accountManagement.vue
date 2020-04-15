<template>
  <div class="weixin">
    <!-- 选择框 -->
    <div class="search">
      <el-select v-model="value" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 输入框 -->
      <!-- :fetch-suggestions="querySearchAsync" -->
      <!-- @select="handleSelect" -->

      <el-autocomplete
        class="select"
        v-model="state"
        placeholder="请输入内容"
      ></el-autocomplete>
      <el-select v-model="value" filterable placeholder="请选择" class="select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select v-model="value" filterable placeholder="请选择" class="select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" class="select">搜索</el-button>
      <el-button @click="showNewWeChat = true" type="primary"
        >新增微信</el-button
      >
    </div>
    <el-table
      :data="table.tableData"
      :cell-style="cellStyle"
      :header-cell-style="headerCss"
    >
      <el-table-column label="微信号">
        <template slot-scope="scope">
          <span class="weixinHead">
            <img :src="scope.row.head_img_url" alt="" />
          </span>
          <span class="weixinName">{{ scope.row.wechat_no }}</span>
          <!-- 鼠标指向显示二维码 -->
          <el-popover placement="right" trigger="hover">
            <img
              :src="scope.row.wechat_qr_code"
              style="width:150px;height:150px;"
              alt=""
            />
            <span>{{ scope.row.nickname }}</span>
            <span class="code" slot="reference">二维码</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="nickname"
        label="使用状态"
        width="180"
      >
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
      <el-table-column align="center" label="操作">
        <template>
          <span class="operatingOne public" @click="showExpress = true"
            >详情</span
          >
          <span class="operatingTwo public" @click="showExpress = true"
            >编辑</span
          >
          <span class="operatingThree public" @click="showExpress = true"
            >关联老师</span
          >
        </template>
      </el-table-column>
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
    <el-dialog
      :destroy-on-close="true"
      title="填写物流信息"
      :visible.sync="showExpress"
      width="30%"
    >
    </el-dialog>
    <el-dialog
      :destroy-on-close="true"
      title="新增微信"
      :visible.sync="showNewWeChat"
      width="30%"
    >
      <addWeChat @addWeChat="addWeChat" />
    </el-dialog>
  </div>
</template>

<script>
import MPagination from '@/components/MPagination/index.vue'
import addWeChat from './components/addWeChat'
export default {
  components: {
    MPagination,
    addWeChat
  },
  data() {
    return {
      // 新增微信弹框
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
      // 搜索
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
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
  methods: {
    // 微信管理列表
    weChatPageList() {
      this.$http.Weixin.getWeChatTeacherPage()
        .catch((err) => console.log(err))
        .then((res) => {
          console.log('微信管理列数据', res)
          this.table.totalElements = +res.data.WeChatTeacherPage.totalElements
          this.table.tableData = res.data.WeChatTeacherPage.content
          const arrayTId = []
          this.table.tableData.forEach((item) => {
            arrayTId.push(item.teacher_id)
          })
          // 微信管理列表所在部门
          this.$http.Weixin.getTeacherList(arrayTId)
            .catch((err) => console.log(err))
            .then((res) => {
              console.log('res', res)
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
                console.log('jsonData ------', jsonData)
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
        return 'font-size:16px;color:#666;font-weight:normal;padding-left:50px;'
      }
      return 'font-size:16px;color:#666;font-weight:normal;'
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.$emit('onCurrentPage', val)
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
  .search {
    width: 100%;
    height: 80px;
    line-height: 80px;
    .select {
      margin-left: 12px;
    }
  }
  .weixinHead {
    display: inline-block;
    position: relative;
    top: -5px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: red;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .code {
    display: inline-block;
    margin-top: 10px;
    margin-left: 10px;
    cursor: pointer;
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
