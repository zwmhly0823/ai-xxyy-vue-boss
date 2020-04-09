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
    <m-search @search="handleSearch" teacherphone="12">
      <el-button type="primary" slot="searchItems" size="mini">搜索</el-button>
      <el-button
        type="primary"
        slot="searchItems"
        size="mini"
        @click="newTeacher"
        >新增老师</el-button
      >
      <!-- <el-checkbox-group
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
      </el-checkbox-group> -->
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
        <el-table-column width="30px">
          <!-- 表格header操作按钮 -->
          <!-- <template slot="header">
            <el-dropdown @command="headerOperation">
              <div>
                <img src="../../../../../assets/images/point.png" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="headerEditor">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item command="headerDetails">
                  详情
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template> -->
          <!-- 表格内容操作按钮 -->
          <template slot-scope="scope">
            <el-dropdown>
              <div>
                <img src="../../../../../assets/images/point.png" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="operation(scope.row, 1)">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item @click.native="operation(scope.row, 2)">
                  详情
                </el-dropdown-item>
                <el-dropdown-item @click.native="operation(scope.row, 3)">
                  关联微信号
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="员工ID">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="老师姓名">
          <template slot-scope="scope">
            <div>{{ scope.row.realname }}</div>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <div>{{ scope.row.sex }}</div>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template slot-scope="scope">
            <div>{{ scope.row.nickname }}</div>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <div>{{ scope.row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属部门">
          <template slot-scope="scope">
            <div>{{ scope.row.duty.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="职务">
          <template slot-scope="scope">
            <div>{{ scope.row.duty.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="职级">
          <template slot-scope="scope">
            <div>{{ scope.row.rank.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="在职状态">
          <template slot-scope="scope">
            <div>{{ scope.row.status }}</div>
          </template>
        </el-table-column>
        <el-table-column label="登录状态">
          <template slot-scope="scope">
            <div>{{ scope.row.is_login }}</div>
          </template>
        </el-table-column>
        <el-table-column label="绑定微信号">
          <template slot-scope="scope">
            <div><img :src="scope.row.head_image" /></div>
            <div v-for="item in scope.row.weixin" :key="item.id">
              {{ item.weixin_no }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="">
            <div class="editStyle">
              <span style="margin-right:20px">编辑</span>
              <span>详细</span>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 关联微信弹窗 -->
      <associatedWeChat ref="associated" />
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
import associatedWeChat from '../components/associatedWeChat.vue'

export default {
  props: [],
  components: {
    MSearch,
    MPagination,
    associatedWeChat
  },
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
      tableData: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.createdUrl()
  },
  methods: {
    createdUrl() {
      // tab数据
      this.$http.Teacher.getTeacherPage().then((res) => {
        this.tableData = res.data.TeacherPage.content
      })
    },
    // 搜索
    handleSearch(data) {
      console.log(data)
    },
    // 选择按钮
    changeHandler(data) {
      console.log(data)
    },
    // 分页
    handleSizeChange(val) {
      this.currentPage = val
      // this.studentsList()
      const dom = document.getElementById('right-scroll')
      dom.querySelector('.scrollbar-wrapper').scrollTo(0, 0)
    },
    // 表头操作
    headerOperation(val) {
      console.log(val, '表头编辑')
    },
    // 点击操作按钮
    operation(val, index) {
      if (index === 1 || index === 2) {
        this.$router.push({
          path: '/newTeacher',
          query: { index: index, teacherId: val.id }
        })
      } else if (index === 3) {
        this.$refs.associated.centerDialogVisible = true
      }
    },
    // 新建老师
    newTeacher(val) {
      this.$router.push({ path: '/newTeacher' })
    }
  }
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
