<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-08-07 14:03:15
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-13 17:38:58
-->
<template>
  <ele-table
    :tableHeight="tableHeight"
    :tableSize="'mini'"
    :dataList="channelThreededList"
    :loading="flags.loading"
    :size="tabQuery.size"
    :page="tabQuery.page"
    :total="totalElements"
    @pageChange="pageChange_handler"
    class="mytable"
  >
    <el-table-column
      label="序号"
      prop="sup"
      min-width="20"
      type="index"
      align="center"
    ></el-table-column>
    <el-table-column
      label="渠道名称"
      min-width="120"
      align="center"
      prop="channelName"
    ></el-table-column>
    <el-table-column
      label="社群销售"
      min-width="80"
      align="center"
      prop="teacherName"
    >
      <template slot-scope="scope">
        <span style="margin-right:10px;">{{ scope.row.departmentName }}</span>
        <span>{{ scope.row.teacherName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <span @click="editRow(scope.row)" class="edit-row">编辑</span>
      </template>
    </el-table-column>
  </ele-table>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
export default {
  props: {
    channelThreededList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataList: [],
      totalElements: 0,
      tabQuery: {
        size: 10,
        page: 1
      },
      flags: {
        loading: false
      },
      tableHeight: 'auto'
    }
  },
  components: {
    EleTable
  },
  methods: {
    pageChange_handler() {},
    editRow(row) {
      console.log(row)
      this.$emit('editRow', row)
    }
  }
}
</script>
<style lang="scss" scoped>
.mytable {
  .edit-row {
    color: #2a75ed;
    cursor: pointer;
  }
}
</style>
