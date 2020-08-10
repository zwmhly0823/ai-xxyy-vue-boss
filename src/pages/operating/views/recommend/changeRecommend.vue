<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-03 15:45:34
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-10 09:21:42
-->
<template>
  <!-- wrap_lk:给分页留了40高度 -->
  <section class="wrap_lk">
    <div class="search_lk">
      <el-form
        :inline="true"
        size="mini"
        label-position="right"
        label-width="80px"
      >
        <!--type 1-系统课，0-体验课 2-全部 -->
        <el-form-item label="学员搜索:">
          <SearchPhoneAndUsername
            type="2"
            :customStyle="{ width: '160px' }"
            placeholder="手机号或昵称或id"
            @result="_wai1"
          />
        </el-form-item>
        <el-form-item label="上传时间:">
          <el-date-picker
            value-format="timestamp"
            type="datetimerange"
            clearable
            @change="chooseTime"
            v-model="num1"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="老师搜索:">
          <GroupSell tip="老师姓名" :isMultiple="true" @result="_wai2" />
        </el-form-item>
        <el-form-item label="活动名称:">
          <el-select
            style="width:160px"
            clearable
            v-model="num2"
            placeholder="选择活动"
            @change="chooseActivity"
          >
            <el-option
              v-for="(item, index) of activity"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="tabpan_lk">
      <el-tabs v-model="tabsValue" @tab-click="handleClick">
        <el-tab-pane
          v-for="(value, key) in tabs"
          :key="value"
          :label="key"
          :name="value"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="table_lk">
      <el-table :data="tableData">
        <el-table-column label="用户信息" align="center">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :href="'/users/#/details/' + scope.row.userId"
              target="_blank"
              >{{ scope.row.userName }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="title" label="活动名称" align="center">
        </el-table-column>
        <el-table-column label="活动赠品" align="center">
          <template slot-scope="scope">
            {{ scope.row.rewardName + '*' + scope.row.rewardValue }}
          </template>
        </el-table-column>
        <el-table-column
          prop="systemTeacherName"
          label="辅导老师"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="buytime" label="截图" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              fit="contain"
              :src="scope.row.uploadUrl"
              :preview-src-list="[scope.row.uploadUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="ctime" label="上传截图时间" align="center">
        </el-table-column>
        <el-table-column prop="endTime" label="审核时间" align="center">
        </el-table-column>
        <el-table-column prop="status" label="审核状态" align="center">
        </el-table-column>
        <el-table-column prop="approvalRemark" label="驳回原因" align="center">
        </el-table-column>
        <el-table-column prop="approvalName" label="审核人" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope" v-if="scope.row.status === 'PENDING'">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_lk">
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
    </div>
    <div class="pdrawer_lk">
      <drawerLk ref="drawer_lk" :initItem="initItem" :arrageArr="arrangeArr" />
    </div>
  </section>
</template>

<script>
import { formatDate } from '@/utils/mini_tool_lk'
import drawerLk from './drawer_lk.vue'
import SearchPhoneAndUsername from '@/components/MSearch/searchItems/searchPhoneAndUsername.vue'
import GroupSell from '@/components/MSearch/searchItems/groupSell.vue'

export default {
  name: 'changeRecommend',
  components: { SearchPhoneAndUsername, GroupSell, drawerLk },
  data() {
    return {
      // 分页
      allDigit: 0,
      pageSize: 10,
      currentPage: 1,

      num1: '', // 显示时间
      num2: '', // 显示活动
      tabsValue: '', // 显示tabs
      // 活动总量(接口来的)
      activity: [
        { label: '首单分享得红包', value: 'AFTER_FIRST_ORDER_SHARE' },
        { label: '完成分享任务得小熊币', value: 'SHARE_TASK' }
      ],
      // tabpans总量
      tabs: {
        全部: 'PENDING,DECLINE,COMPLETED',
        待审核: 'PENDING',
        审核驳回: 'DECLINE',
        审核成功: 'COMPLETED'
      },
      // 表格数据
      tableData: [],
      // arrange_search
      searchJson: {},
      // son initItem
      initItem: {}
    }
  },
  computed: {
    arrangeArr() {
      return this.tableData.filter((item) => item.status === 'PENDING')
    }
  },
  methods: {
    _wai1(r) {
      console.info('学员', r)
      this.searchJson.userId = r['']
      this.getData()
    },
    _wai2(r) {
      console.info('老师', r.pay_teacher_id)
      this.searchJson.systemTeacherId =
        r.pay_teacher_id[r.pay_teacher_id.length - 1]
      this.getData()
    },
    chooseTime(r) {
      console.info('时间', r)
      this.searchJson.sctime = r[0]
      this.searchJson.ectime = r[1]
      this.getData()
    },
    chooseActivity(r) {
      console.info('活动', r)
      this.searchJson.type = r
      this.getData()
    },
    handleClick(tab) {
      console.info('tabpad实例', tab, tab.name)
      this.searchJson.status = tab.name
      this.getData()
    },
    // 点击审核
    handleEdit(index, item) {
      this.$refs.drawer_lk.drawer = true
      this.initItem = item
      console.info('点击审核')
    },
    // 页容量变化
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getData({ pageNum: this.page, pageSize: val })
    },
    // 当前页变化
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getData({ pageNum: val, pageSize: this.pageSize })
    },
    // 数据接口(传当前页,页容量 取总数据，总条目)
    async getData({ pageNum = 1, pageSize = 10 } = {}) {
      Object.assign(this.searchJson, { pageNum, pageSize }) // 放心page,size会覆盖原有
      const {
        code,
        payload: { content, totalElements }
      } = await this.$http.Operating.getTable(this.searchJson).catch((err) => {
        console.info('取数据接口报错,', err)
        this.$message.error('table数据接口失败')
      })
      if (!code) {
        this.pageSize = pageSize // 就取本地设订的可以嘛？server也是听本地的传值(统一接口成功再变化分页信息)
        this.currentPage = pageNum // 就取本地设订的可以嘛？server也是听本地的传值(统一接口成功再变化分页信息)
        this.allDigit = +totalElements // 总量
        // 加工整合
        content.forEach((item) => {
          item.ctime = item.ctime ? formatDate(+item.ctime) : ''
          item.endTime = item.endTime ? formatDate(+item.endTime) : ''
          item.status = {
            PENDING: '待审核',
            COMPLETED: '审核通过',
            DECLINE: '审核驳回'
          }[item.status]
        })
        // 赋值
        this.tableData = content
      }
    }
  },
  mounted() {
    this.getData()
    this.$refs.drawer_lk.drawer = true
  }
}
</script>

<style lang="scss" scoped>
.wrap_lk {
  padding: 10px 10px 40px;
  .search_lk {
    padding: 20px;
    background: #fff;
  }
  .tabpan_lk {
    background: #fff;
    padding: 0px 20px;
  }
  .pagination_lk {
    width: 100%;
    height: 40px;
    background-color: #fff;
    position: fixed;
    right: 10px;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
