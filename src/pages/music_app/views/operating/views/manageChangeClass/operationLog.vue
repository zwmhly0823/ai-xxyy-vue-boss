<template>
  <el-row class="coins">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="1"></el-tab-pane>
      <el-tab-pane label="调班成功" name="2"></el-tab-pane>
      <el-tab-pane label="调班失败" name="3"></el-tab-pane>
    </el-tabs>
    <!-- search -->
    <el-form :inline="true" ref="ruleForm">
      <el-form-item label="学员手机号:" prop="mobile">
        <search-phone-or-usernum
          style="margin-right: 10px"
          type="2"
          :extension="true"
          user-num-key="user_num"
          tablename="UserExtendsList"
          @result="getSearchData('uid', arguments)"
        />
      </el-form-item>
      <el-form-item label="操作人:" prop="mobile"> </el-form-item>
    </el-form>
  </el-row>
</template>
<script>
import SearchPhoneOrUsernum from '@/components/MSearch/searchItems/searchPhoneOrUsernum.vue'
export default {
  name: 'operationLog',
  components: {
    SearchPhoneOrUsernum,
  },
  props: {},
  data() {
    return {
      loading: false,
      activeName: '1',
      tableData: [],
      query: {
        pageSize: 10,
        pageNum: 1,
      },
    }
  },
  created() {},
  watch: {},
  mounted() {},
  methods: {
    handleClick() {},
    getSearchData(key, res) {},
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
</style>
