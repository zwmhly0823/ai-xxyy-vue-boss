<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-08-06 17:13:23
 * @LastEditors: liukun
 * @LastEditTime: 2020-08-06 22:14:02
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
        累计审核时间：<span>{{ 999 }}</span>
      </section>
      <section>
        {{ showMonth + '月' }}审核成功：<span>{{ 111 }}</span>
      </section>
      <section>
        {{ showMonth + '月' }}审核驳回：<span>{{ 222 }}</span>
      </section>
    </div>
    <div class="table">
      <el-table :data="tableData">
        <el-table-column label="截图" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              fit="contain"
              :src="scope.row.attsUrl"
              :preview-src-list="[scope.row.attsUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="buytime" label="上传时间" align="center">
        </el-table-column>
        <el-table-column prop="statusStr" label="审核时间" align="center">
        </el-table-column>
        <el-table-column prop="statusStr" label="审核状态" align="center">
        </el-table-column>
        <el-table-column prop="statusStr" label="活动名称" align="center">
        </el-table-column>
        <el-table-column prop="refundTypeStr" label="活动赠品" align="center">
        </el-table-column>
        <el-table-column prop="refundRuleStr3" label="审核人" align="center">
        </el-table-column>
        <el-table-column prop="refundRuleStr32" label="驳回原因" align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'changeRecommend',
  data() {
    return {
      tableData: [],
      month_: Date.now(),
      userId: this.$route.params.id
    }
  },

  methods: {
    tt(r) {
      console.info(typeof r, r)
    },
    async getTableList() {
      const tt = await this.$http.User.listLabelRecommendForUser({
        id: this.userId,
        month: this.month_
      }).catch((err) => {
        console.error(err)
        this.$message.error('转介绍tab数据获取失败')
      })
      if (tt) {
        this.tableData = tt.hh
      } else {
        this.$message.warning('转介绍tab数据为空')
      }
    }
  },
  computed: {
    showMonth() {
      return new Date(this.month_).getMonth() + 1
    }
  },
  mounted() {
    console.info(typeof this.month_, this.month_)
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
