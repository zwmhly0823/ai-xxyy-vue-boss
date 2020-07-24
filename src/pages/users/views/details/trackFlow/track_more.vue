<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-20 16:38:13
 * @LastEditors: liukun
 * @LastEditTime: 2020-07-23 14:34:22
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
      <section class="flower_item" v-for="item of tableData" :key="item.uid">
        <div class="upset_24col_space_between padding-right15">
          <div>
            <el-tag size="small" v-if="item.teacherInfo.duty_id === '1'"
              >CC</el-tag
            >
            <el-tag
              size="small"
              type="danger"
              v-else-if="item.teacherInfo.duty_id === '2'"
              >CT</el-tag
            >
            <span style="margin-left:10px">{{
              item.teacherInfo.realname +
                '-' +
                item.teacherInfo.departmentInfo.name
            }}</span>
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
            <i
              v-else-if="item.contact_type === '1'"
              class="el-icon-phone-outline el-elment-lk"
            ></i>
            <i
              v-else-if="item.contact_type === '2'"
              class="el-icon-mobile-phone el-elment-lk"
            ></i>
            <span style="vertical-align: middle;padding-left:5px">{{
              item.finish_type === '0'
                ? '无效沟通'
                : item.finish_type === '1'
                ? '完成沟通'
                : '无法判断'
            }}</span>
          </div>
        </div>
        <div class="upset_24col_space_between padding-right15">
          <span>{{ item.point_type }}</span>
          <span>{{ new Date(Number(item.ctime)).toLocaleString() }}</span>
        </div>
        <div class="upset_24col_space_between padding-right15">
          <span>{{ item.content }}</span>
        </div>
      </section>
    </div>
    <div v-else>暂无数据</div>
    <el-pagination
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
export default {
  name: 'track_more',
  data() {
    return {
      drawer: false,
      // 分页
      currentPage: 1,
      pageSize: 10, // :page-sizes="[5, 10, 20]" 包含才会有漂亮的文字
      allDigit: 0,
      tableData: []
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
        uid: this.$route.params.id,
        size: this.pageSize,
        page: this.currentPage
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
            '5': '日常沟通'
          }
          item.point_type = obj[item.point_type]
        })
        this.tableData = content
      }
    }
  },
  created() {
    this.getTrackList()
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
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: flex-start;
}
.lk-icon {
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: #bfbfbf;
  fill: currentColor;
}
.el-elment-lk {
  vertical-align: middle;
  font-size: 20px;
  color: #ccc;
}
.padding-right15 {
  padding-right: 15px;
}
.chouti {
  padding: 0px 20px;
  max-height: 85vh;
  overflow-x: auto;
}
</style>
