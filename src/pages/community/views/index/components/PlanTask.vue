<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 17:10:10
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-29 18:18:31
-->
<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-06-29 17:02:32
 * @LastEditors: Shentong
 * @LastEditTime: 2020-06-29 17:08:56
-->
<template>
  <div class="plan-task-container">
    <div class="operete-row">
      <div class="search-container"></div>
      <div class="add-btn">
        <el-button type="primary" size="mini">新建SOP模板</el-button>
      </div>
    </div>
    <section>
      <ele-table
        :tableHeight="tableHeight"
        :tableSize="'small'"
        :dataList="tableData"
        :size="tableParams.size"
        :page="tableParams.page"
        :total="totalElements"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column label="序号" prop="" align="center"></el-table-column>
        <el-table-column
          label="模板名称"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="调用次数"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="职级"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column
          label="模板状态"
          prop="conversion_rate"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="editStyle">
              <span @click="tableRowOperate(scope.row, '1')">调用</span>
              <span @click="tableRowOperate(scope.row, '2')">编辑</span>
              <el-popconfirm
                confirmButtonText="YES"
                cancelButtonText="算了"
                icon="el-icon-info"
                iconColor="red"
                title="你确定要删除该项内容吗？"
                @onConfirm="confirmDelRow"
              >
                <span @click="tableRowOperate(scope.row, '3')" slot="reference"
                  >删除</span
                >
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </ele-table>
    </section>
  </div>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
export default {
  data() {
    return {
      tableHeight: 'auto',
      tableData: [{}],
      tableParams: {
        size: 20,
        page: 1
      },
      totalElements: 0,
      selectVal: ''
    }
  },
  components: {
    EleTable
  },
  computed: {},
  methods: {
    pageChange_handler(res) {},
    /** 表格删除某一行确认按钮 */
    confirmDelRow() {
      console.log('删除了')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss"></style>
