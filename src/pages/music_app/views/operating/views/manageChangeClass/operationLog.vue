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
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="coins-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; border-top: 1px solid #ebeef5"
      >
        <el-table-column label="学员" align="center" type="index" width="80px">
        </el-table-column>
        <el-table-column label="调班性质" align="center" prop="fromTeam">
        </el-table-column>
        <el-table-column label="调班时间" align="center" prop="toTeam">
        </el-table-column>
        <el-table-column label="调班方式" align="center" prop="toTeam">
        </el-table-column>
        <el-table-column label="原有班级" align="center" prop="toTeam">
        </el-table-column>
        <el-table-column label="调入班级" align="center" prop="toTeam">
        </el-table-column>
        <el-table-column label="调班结果" align="center" prop="toTeam">
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="toTeam">
        </el-table-column>
        <el-table-column label="操作时间" align="center" prop="toTeam">
        </el-table-column>
      </el-table>
      <m-pagination
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        @current-change="handleCurrentChange"
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
export default {
  name: 'operationLog',
  components: {
    SearchPhoneOrUsernum,
    MPagination,
  },
  props: {},
  data() {
    return {
      loading:false,
      activeName: '1',
      options: [],
      value: '',
      tableData: [],
      query: {
        pageSize: 10,
        pageNum: 1,
      },
      totalElements: 0, // 总条数
    }
  },
  created() {},
  watch: {},
  mounted() {},
  methods: {
    handleClick() {},
    getSearchData(key, res) {},
    handleCurrentChange(val) {},
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
