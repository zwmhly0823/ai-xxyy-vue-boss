<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-15 21:42:15
 -->
<template>
  <div class="third-step">
    <div class="step-container step-three-container">
      <ele-table
        :dataList="tableData"
        :loading="false"
        :size="tabQuery.size"
        :page="tabQuery.pageNum"
        :total="totalElements"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址" width="180">
        </el-table-column>

        <el-table-column label="自定义内容">
          <template slot-scope="scope">
            <div>{{ scope.row }}</div>
          </template>
        </el-table-column>
      </ele-table>

      <!-- 取消、下一步 -->
      <div class="operate-btn">
        <el-button size="small" type="warning" plain>取消</el-button>
        <el-button size="small" type="primary" @click="nextStep"
          >下一步</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import EleTable from '@/components/Table/EleTable'
export default {
  props: ['stepStatus'],
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      totalElements: 0,
      flags: {
        loading: true
      },
      tabQuery: {
        size: 2,
        pageNum: 1
      }
    }
  },
  computed: {},
  components: {
    EleTable
  },
  watch: {},
  methods: {
    // 翻页emit
    pageChange_handler() {},
    nextStep() {
      this.$emit('listenStepStatus')
    }
  }
}
</script>
<style lang="scss" scoped>
.step-three-container {
  .operate-btn {
    display: flex;
    justify-content: center;
    margin: 40px 0 10px 0;
  }
}
</style>
