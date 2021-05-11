<template>
  <el-row class="coins">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="1"></el-tab-pane>
      <el-tab-pane label="调班成功" name="2"></el-tab-pane>
      <el-tab-pane label="调班失败" name="3"></el-tab-pane>
    </el-tabs>
    <!-- search -->
    <el-form :inline="true" ref="ruleForm">
      <el-form-item label="学员手机号:">
        <search-phone-or-usernum
          style="margin-right: 10px"
          type="2"
          :extension="true"
          user-num-key="user_num"
          tablename="UserExtendsList"
          @result="getSearchData('uid', arguments)"
        />
      </el-form-item>
      <el-form-item label="操作人:">
        <el-input v-model="opeName" placeholder="请输入操作人姓名"></el-input>
      </el-form-item>
    </el-form>
    <div class="coins-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; border-top: 1px solid #ebeef5"
      >
        <el-table-column label="学员" align="center" type="index" width="120px">
          <template slot-scope="scope">
            <p>{{ scope.row.mobile }}</p>
            <p>ID:{{ scope.row.id }}</p>
          </template>
        </el-table-column>
        <el-table-column label="调班性质" align="center" prop="fromTeam">
          <template slot-scope="scope">
            <p>{{ scope.row.change_type == 1 ? '调期' : '调班' }}</p>
          </template>
        </el-table-column>
        <el-table-column label="调班时间" align="center" prop="toTeam">
          <template slot-scope="scope">
            <p>{{ scope.row.ctime }}</p>
          </template>
        </el-table-column>
        <el-table-column label="调班方式" align="center" prop="importType">
          <template slot-scope="scope">
            <p>
              {{type[scope.row.importType]}}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="原有班级" align="center" prop="originTeamName">
        </el-table-column>
        <el-table-column label="调入班级" align="center" prop="currentTeamName">
        </el-table-column>
        <el-table-column label="调班结果" align="center" prop="executeResult">
          <template slot-scope="scope">
            <p>
              {{ scope.row.executeResult == 'SUCCESS' ? '成功' : '失败' }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="operator">
        </el-table-column>
        <el-table-column label="操作时间" align="center" prop="utime">
        </el-table-column>
      </el-table>
      <m-pagination
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        @current-change="handleCurrentChange"
        show-pager
        :total="+totalElements"
        open="calc(100vw - 195px)"
        close="calc(100vw - 75px)"
      />
    </div>
  </el-row>
</template>
<script>
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
import MPagination from '@/components/MPagination/index.vue'
import { formatData } from '@/utils/index.js'
export default {
  name: 'operationLog',
  components: {
    SearchPhoneOrUsernum,
    MPagination,
  },
  props: {},
  data() {
    return {
      type: {
        "0": '按人导入',
        "1": '按班导入',
        "2": '批量导入',
      },
      loading: false,
      activeName: '1',
      options: [],
      value: '',
      tableData: [],
      query: {
        pageSize: 10,
        pageNumber: 1,
      },
      opeName: '',
      totalElements: 0, // 总条数
    }
  },
  created() {},
  watch: {},
  mounted() {
    this.initData()
  },
  watch: {
    opeName(newValue) {
      console.log(newValue)
      if (newValue || newValue == '') {
        this.query.staffName = newValue
        this.initData()
      }
    },
  },
  methods: {
    async initData() {
      let result = await this.$http.Operating.operationClassList(this.query)
      if (result.code == 0) {
        this.tableData = result.payload.content
        this.totalElements = result.payload.totalElements
        this.tableData.forEach((item, index) => {
          item.ctime = formatData(item.ctime, 's')
          item.utime = formatData(item.utime, 's')
        })
      }
    },
    handleClick() {
      if (this.activeName == 2) {
        this.query.execute = 'SUCCESS'
      }
      if (this.activeName == 3) {
        this.query.execute = 'FAIL'
      }
      if (this.activeName == 1) {
        this.query.execute = null
      }
      this.initData()
    },
    getSearchData(key, res) {
      if (res[0]) {
        Object.assign(this.query, res[0])
      } else {
        this.query.uid = ''
      }
      this.initData()
    },
    handleCurrentChange(val) {
      this.query.pageNumber = val
      this.initData()
    },
  },
}
</script>

<style lang="scss" scoped>
.coins {
  padding: 10px;
  &-table {
    margin-top: 10px;
  }
  .manageclass-maxwidth {
    width: 200px !important;
    /deep/ .el-select {
      width: 100%;
    }
    /deep/ .search-item {
      width: 100%;
    }
  }
  .submit {
    float: right;
    margin-right: 10px;
  }
}
/deep/ .el-input__inner {
  height: 28px !important;
}
</style>
