<template>
  <el-row class="coins">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="1"></el-tab-pane>
      <el-tab-pane label="调班成功" name="2"></el-tab-pane>
      <el-tab-pane label="调班失败" name="3"></el-tab-pane>
    </el-tabs>
    <!-- search -->
    <el-form :inline="true" ref="ruleForm">
      <el-form-item label="添加学员" prop="mobile">
        <search-phone-or-usernum
          ref="mobile"
          class="manageclass-maxwidth"
          defaultType="0"
          :isHidden="false"
          :name="['mobile']"
          type="3"
          tablename="UserExtendsList"
          @result="getSearchUid('user', arguments)"
        />
      </el-form-item>
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
