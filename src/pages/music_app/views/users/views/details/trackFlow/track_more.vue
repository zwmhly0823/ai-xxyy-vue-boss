<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-20 16:38:13
 * @LastEditors: YangJiyong
 * @LastEditTime: 2021-01-04 18:57:16
-->
<template>
  <el-drawer :visible.sync="drawer" size="35%" :destroy-on-close="true">
    <template v-slot:title>
      <section class="setou123">
        <strong></strong>
        <span>跟进记录</span>
      </section>
    </template>
    <div class="chouti" v-if="tableData && tableData.length">
      <section class="flower_item" v-for="item of tableData" :key="item.ctime">
        <div class="upset_24col_space_between padding-right15">
          <div>
            <el-tag
              size="small"
              type="primary"
              v-if="
                item.createTeacherInfo && item.createTeacherInfo.duty_id === '1'
              "
              >CC</el-tag
            >
            <el-tag
              size="small"
              type="success"
              v-else-if="
                item.createTeacherInfo && item.createTeacherInfo.duty_id === '2'
              "
              >CT</el-tag
            >
            <el-tag
              size="small"
              type="danger"
              v-else-if="
                item.createStaffInfo &&
                  rolesArr.includes(item.createStaffInfo.role_id)
              "
              >{{
                roles.filter((n) => n.id === item.createStaffInfo.role_id)[0][
                  'name'
                ]
              }}</el-tag
            >
            <el-tag size="small" type="info" v-else>系统自动</el-tag>
            <span style="margin-left:10px"
              >{{
                (item.createTeacherInfo && item.createTeacherInfo.realname) ||
                  (item.createStaffInfo && item.createStaffInfo.real_name)
              }}{{
                item.createTeacherInfo &&
                  item.createTeacherInfo.departmentInfo &&
                  item.createTeacherInfo.departmentInfo.name
              }}</span
            >
          </div>
          <div>
            <svg
              v-if="item.contact_type === '0'"
              style="vertical-align: middle"
              class="lk-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icongongzhonghao"></use>
            </svg>
            <svg
              v-if="item.contact_type === '1'"
              style="vertical-align: middle"
              class="el-elment-lk"
              aria-hidden="true"
            >
              <use xlink:href="#icondianhua"></use>
            </svg>
            <i
              v-else-if="item.contact_type === '2'"
              class="el-icon-mobile-phone icon-fail"
            ></i>
            <!-- 在线客服 -->
            <svg
              v-if="item.contact_type === '3'"
              style="vertical-align: middle"
              class="el-elment-lk primary-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icondanseshixintubiao-"></use>
            </svg>
            <span style="vertical-align: middle;padding-left:5px">{{
              item.finish_type === '0'
                ? '无效沟通'
                : item.finish_type === '1'
                ? '完成沟通'
                : '无法判断'
            }}</span>
          </div>
        </div>
        <div class="upset_24col_space_between padding-right15 margin22">
          <span class="color-gray">{{ item.point_type }}</span>
          <el-tag v-if="item.label_text" type="warning" size="mini">{{
            item.label_text
          }}</el-tag>
          <span class="color-gray">{{ item.ctime }}</span>
        </div>
        <div class="upset_24col_space_between padding-right15">
          <span style="line-height:18px">{{ item.content }}</span>
        </div>
      </section>
    </div>
    <div class="no-data" v-else>暂无数据</div>
    <el-pagination
      v-if="allDigit > 0"
      layout="prev,pager,next,total,sizes,jumper"
      :total="allDigit"
      :page-size="pageSize"
      :page-sizes="[10, 20, 30]"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-drawer>
</template>

<script>
import { formatDate } from '@/utils/mini_tool_lk'
export default {
  name: 'track_more',
  props: {
    changeSubject: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      roles: [
        { id: '1', name: '管理员' },
        { id: '2', name: '运营' },
        { id: '3', name: '市场' },
        { id: '4', name: '财务' },
        { id: '5', name: '供应链' },
        { id: '6', name: '人事' },
        { id: '7', name: '超级管理员' },
        { id: '8', name: 'S1Producer' },
        { id: '9', name: 'S2Producer' },
        { id: '10', name: 'S3Producer' },
        { id: '11', name: 'Administrator' },
        { id: '12', name: 'S1Operator' },
        { id: '13', name: 'S2Operator' },
        { id: '14', name: 'S3Operator' },
        { id: '15', name: 'Anonymous' },
        { id: '16', name: 'WriteAdmin' },
        { id: '18', name: 'ArtAdmin' },
        { id: '19', name: '教研' },
        { id: '20', name: 'testAdmin' },
        { id: '21', name: '客服' }
      ],
      drawer: false,
      // 分页
      currentPage: 1,
      pageSize: 10, // :page-sizes="[5, 10, 20]" 包含才会有漂亮的文字
      allDigit: 0,
      tableData: []
    }
  },
  computed: {
    rolesArr() {
      // const arr1 = []
      // for (let i = 1; i < 22; i++) {
      //   arr1.push(i.toString())
      // }
      // arr1.splice(16, 1)
      // return arr1
      return this.roles.map((item) => item.id)
    }
  },
  methods: {
    // 页容量变化
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getTrackList({ page: this.currentPage, size: val })
    },
    // 当前页变化
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getTrackList({ page: val, size: this.pageSize })
    },

    // 数据接口(传当前页,页容量 取总数据，总条目)
    async getTrackList({ size = 10, page = 1 } = {}) {
      const {
        data: {
          UserFollowLogPage: { content, totalElements }
        }
      } = await this.$http.User.getTrackList({
        subject: this.changeSubject,
        uid: this.$route.params.id,
        size,
        page
      }).catch((err) => {
        this.$message.error('flow更多数据获取失败')
        console.error(err)
      })
      if (content && content.length) {
        this.pageSize = size
        this.currentPage = page
        this.allDigit = Number(totalElements)
        content.forEach((item, index) => {
          const obj = {
            '0': '首通',
            '1': 'CF01',
            '2': 'CF04',
            '3': 'CF08',
            '4': '老生覆盖',
            '5': '日常沟通',
            '6': '退费挽单',
            '7': '运营',
            '8': '客服',
            '9': '投诉回访'
          }
          item.point_type = obj[item.point_type]
          item.ctime = formatDate(+item.ctime)
        })
        this.tableData = content
        console.info('2号list更新')
      } else {
        this.pageSize = 10
        this.currentPage = 1
        this.allDigit = 0
        this.tableData = []
      }
    }
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        this.getTrackList()
      }
    }
  },
  created() {
    this.getTrackList()
  },
  mounted() {
    // 详情页新增记录刷新列表
    this.$root.$on('reload', (r) => {
      this.getTrackList()
    })
  }
}
</script>

<style lang="scss" scoped>
.upset_24col_space_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.setou123 {
  padding: 10px 0px;
  span {
    vertical-align: middle;
    font-size: 16px;
  }
  strong {
    vertical-align: middle;
    background-color: #49a3ff;
    display: inline-block;
    width: 16px;
    height: 2px;
    transform: rotate(90deg);
  }
}
.flower_item {
  padding: 10px 5px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: flex-start;
}
.lk-icon {
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: #42b983;
  fill: currentColor;
}
.el-elment-lk {
  vertical-align: middle;
  width: 24px;
  height: 18px;
  fill: #49a3ff;
}
.padding-right15 {
  padding-right: 15px;
}
.chouti {
  padding: 0px 20px;
  max-height: 85vh;
  overflow-x: auto;
}
.color-gray {
  color: #aeaeae;
}
.icon-fail {
  vertical-align: middle;
  font-size: 18px;
  color: #f56c6c !important;
}
.content {
  line-height: 20px;
}
::v-deep {
  .el-drawer__header {
    margin-bottom: 10px;
  }
  .el-drawer__close-btn {
    outline: none;
  }
}
.margin22 {
  margin: 12px 0;
}
.no-data {
  margin-top: 100px;
  color: #aeaeae;
  text-align: center;
}
</style>
