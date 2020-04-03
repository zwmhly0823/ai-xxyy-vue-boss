<!--
 * @Descripttion: 
 * @version: 
 * @Author: zhubaodong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: zhubaodong
 * @LastEditTime: 2020-04-02 18:31:34
 -->
<template>
  <div>
    <m-search @search="handleSearch" channel="pay_channel">
      <el-button type="primary" slot="searchItems" size="mini">搜索</el-button>
      <el-button type="primary" slot="searchItems" size="mini"
        >新增老师</el-button
      >
      <el-checkbox-group
        v-model="checkList"
        slot="otherSearch"
        class="checkBoxStyle"
        size="mini"
        text-color="#999"
        @change="changeHandler"
      >
        <el-checkbox
          :label="item.value"
          border
          v-for="item of checkShowList"
          :key="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </m-search>

    <div class="orderStyle">
      <el-table
        :data="tableData"
        :header-cell-style="{
          fontSize: '12px',
          color: '#666',
          fontWeight: 'normal'
        }"
      >
        <el-table-column label="员工ID">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="老师姓名">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="性别">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="昵称">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="手机号">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="所属部门">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="职务">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="职级">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="在职状态">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="登录状态">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template> </el-table-column
        ><el-table-column label="绑定微信号">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <div class="editStyle">
              <span style="margin-right:20px">编辑</span>
              <span>详细</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <m-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :total="totalElements"
        @current-change="handleSizeChange"
        open="calc(100vw - 180px - 240px - 147px - 30px)"
        close="calc(100vw - 180px - 240px - 26px - 30px)"
      />
    </div>
  </div>
</template>

<script>
// import dayjs from 'dayjs'
// import axios from '@/api/axios'
// import { GetAgeByBrithday, formatData } from '@/utils/index'

import MSearch from '@/components/MSearch/index.vue'
import MPagination from '@/components/MPagination/index.vue'

export default {
  props: [],
  components: { MSearch, MPagination },
  data() {
    return {
      // 总页数
      totalPages: 1,
      // 总条数
      totalElements: 0,
      // 当前页数
      currentPage: 1,
      // 搜索多选
      checkShowList: [
        { label: '体验课辅导老师', value: '1' },
        { label: '系统课辅导老师', value: '2' },
        { label: '点评辅导老师', value: '3' }
      ],
      // 多选选择项
      checkList: [],
      // 表格数据
      tableData: [{ id: 1 }]
    }
  },
  computed: {},
  watch: {},
  methods: {
    handleSearch(data) {
      console.log(data)
    },
    changeHandler(data) {
      console.log(data)
    },
    handleSizeChange(val) {
      this.currentPage = val
      // this.studentsList()
      const dom = document.getElementById('right-scroll')
      dom.querySelector('.scrollbar-wrapper').scrollTo(0, 0)
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped>
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
