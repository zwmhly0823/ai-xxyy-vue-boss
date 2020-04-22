<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-22 17:20:03
 -->
<template>
  <div>
    <div class="sear-container">
      <div class="orderStyle">
        <ele-table
          :dataList="tableData"
          :loading="flags.loading"
          :size="tabQuery.size"
          :page="tabQuery.pageNum"
          :total="totalElements"
          @pageChange="pageChange_handler"
          class="mytable"
        >
          <el-table-column prop="id" label="序号" width="50"> </el-table-column>
          <el-table-column prop="realname" label="期名" width="80">
          </el-table-column>
          <el-table-column prop="nickname" label="开始招生"></el-table-column>
          <el-table-column prop="aa" label="结束招生"></el-table-column>
          <el-table-column prop="address" label="开课时间"></el-table-column>
          <el-table-column prop="address" label="结课时间"></el-table-column>
          <el-table-column prop="address" label="招生级别"></el-table-column>
          <el-table-column
            prop="address"
            label="带班销售人数"
          ></el-table-column>
          <el-table-column prop="address" label="计划招生"></el-table-column>
          <el-table-column prop="address" label="实际招生"></el-table-column>
          <el-table-column prop="address" label="计划开班"></el-table-column>
          <el-table-column prop="address" label="实际开班"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="">
              <div class="editStyle">
                <span style="margin-right:20px">编辑</span>
                <span>详细</span>
              </div>
            </template>
          </el-table-column>
        </ele-table>
      </div>
    </div>
  </div>
</template>

<script>
import EleTable from '@/components/Table/EleTable'
export default {
  props: {
    department: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    EleTable
  },
  data() {
    return {
      totalElements: 0,
      flags: {
        loading: false
      },
      tabQuery: {
        size: 10,
        pageNum: 1
      },
      // 总页数
      totalPages: 1,
      // 当前页数
      currentPage: 1,
      // 多选选择项
      checkList: [],
      // 表格数据
      tableData: [],
      // 老师id
      teacherID: ''
    }
  },
  computed: {},
  watch: {},
  activated() {},
  methods: {
    // async getStatisticHeader() {
    //   try {
    //     const statisticHeader = this.$http.Operating.getStatisticHeader()
    //     return statisticHeader
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
    // 分页
    pageChange_handler(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-operate {
  background: #f5f7fa;
  display: flex;
  > div {
    height: 50px;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    span.active {
      color: #409eff;
      background: #fff;
    }
  }
}
.sear-container {
  display: flex;
  align-items: center;
  .el-card {
    border: 0;
  }
}
.orderStyle {
  // padding-bottom: 45px;
  width: 100%;
}
.editStyle {
  color: #0401ff;
  cursor: pointer;
}
</style>
<style lang="scss">
.checkBoxStyle {
  .el-checkbox {
    border: none;
    padding-left: 0px !important;
    color: rgb(102, 102, 102) !important;
  }
}
</style>
