<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-06 17:13:23
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-10 07:31:38
-->
<template>
  <div>
    <div class="search">
      <el-date-picker
        v-model="month_"
        type="month"
        placeholder="选择月"
        format="yyyy 年 MM 月"
        value-format="timestamp"
        @change="tt"
      >
      </el-date-picker>
      <section>
        累计审核成功：<span>{{ '-' }}</span>
      </section>
      <section>
        {{ showMonth + '月' }}审核成功：<span>{{
          (tableData[0] && tableData[0].currentMonthAgreeCount) || '-'
        }}</span>
      </section>
      <section>
        {{ showMonth + '月' }}审核驳回：<span>{{
          (tableData[0] && tableData[0].currentMonthRejectCount) || '-'
        }}</span>
      </section>
    </div>
    <div class="table">
      <el-table :data="tableData">
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
        <el-table-column prop="title" label="活动名称" align="center">
        </el-table-column>
        <el-table-column label="活动赠品" align="center">
          <template slot-scope="scope">
            {{ scope.row.rewardName + '*' + scope.row.rewardValue }}
          </template>
        </el-table-column>
        <el-table-column prop="approvalName" label="审核人" align="center">
        </el-table-column>
        <el-table-column prop="approvalRemark" label="驳回原因" align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/mini_tool_lk'

export default {
  name: 'changeRecommend',
  data() {
    return {
      tableData: [],
      month_: Date.now(),
      searchJson: { pageNum: 1, pageSize: 100, userId: this.$route.params.id }
    }
  },

  methods: {
    tt(r) {
      this.getData(r)
    },
    // 数据接口(传当前页,页容量 取总数据，总条目)
    async getData(sctime) {
      Object.assign(this.searchJson, { sctime })
      const {
        code,
        payload: { content }
      } = await this.$http.User.getTable(this.searchJson).catch((err) => {
        console.info('取数据接口报错,', err)
        this.$message.error('table数据接口失败')
      })
      if (!code) {
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
  computed: {
    showMonth() {
      return new Date(this.month_).getMonth() + 1
    }
  },
  mounted() {
    this.getData(this.month_)
  }
}
</script>

<style lang="scss" scoped>
.search {
  font-size: 14px;
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
