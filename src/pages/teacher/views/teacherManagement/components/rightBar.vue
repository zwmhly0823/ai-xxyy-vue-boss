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
    <m-search @search="handleSearch" teacherphone="12" v-if="false">
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

    <el-button
      type="primary"
      slot="searchItems"
      size="mini"
      @click="newTeacher"
      style="margin: 15px;"
      >新增老师</el-button
    >

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
          <!-- 表格内容操作按钮 -->
          <template slot-scope="scope">
            <el-dropdown>
              <div>
                <img src="../../../../../assets/images/point.png" />
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="operation(scope.row, '1')">
                  编辑
                </el-dropdown-item>
                <el-dropdown-item @click.native="operation(scope.row, '2')">
                  详情
                </el-dropdown-item>
                <!-- <el-dropdown-item @click.native="operation(scope.row, '3')">
                  关联微信号
                </el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="员工ID" width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="老师姓名">
          <template slot-scope="scope">
            <div>{{ scope.row.realname || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <div>{{ sex[scope.row.sex] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="昵称">
          <template slot-scope="scope">
            <div>{{ scope.row.nickname || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属部门">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.department
                  ? `${scope.row.department.pname} / ${scope.row.department.name}`
                  : '-'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="职务">
          <template slot-scope="scope">
            <div v-if="scope.row.duty && scope.row.duty.length > 0">
              <p v-for="item in scope.row.duty" :key="item.id">
                {{ item ? item.name || '-' : '-' }}
              </p>
            </div>
            <div v-else><p>-</p></div>
          </template>
        </el-table-column>
        <el-table-column label="职级">
          <template slot-scope="scope">
            <div>{{ scope.row.rank ? scope.row.rank.name || '-' : '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="在职状态">
          <template slot-scope="scope">
            <div>{{ scope.row.status == 0 ? '在职' : '离职' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="登录状态">
          <template slot-scope="scope">
            <div>{{ scope.row.is_login == 0 ? '允许登录' : '禁止登录' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="绑定微信号">
          <template slot-scope="scope">
            <div v-if="scope.row.weixin">
              <!-- <div><img :src="scope.row.head_image" /></div> -->
              <p
                style="margin: 0;"
                v-for="item in scope.row.weixin"
                :key="item.id"
              >
                {{ item.weixin_no }}
              </p>
            </div>
            <div v-else>
              <p>-</p>
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
        open="calc(100vw - 240px - 145px - 30px)"
        close="calc(100vw - 240px - 24px - 30px)"
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
  props: {
    department: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    MSearch,
    MPagination,
    associatedWeChat
  },
  data() {
    return {
      query: '',
      sex: {
        // 0: '-',
        0: '男',
        1: '女'
        // 3: '保密'
      },
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
  computed: {
    currentDept() {
      return this.department
    }
  },
  watch: {
    async department(dept = {}) {
      // 根据部门ID获取老师ID
      const { id, pid, children } = dept
      const query = `{"department":{"id": ${id}, "pid": ${pid}, "children": ${JSON.stringify(
        children
      )}}}`
      if (id === '0') {
        this.query = ''
        this.getData()
        return
      }
      this.query = query
      this.getData(1, JSON.stringify(query))
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(page = this.currentPage, query = this.query) {
      // tab数据
      this.$http.Teacher.getTeacherPage(page, query).then((res) => {
        console.log(res)

        if (res && res.data && res.data.TeacherManagePage) {
          const {
            content = [],
            number,
            totalPages,
            totalElements
          } = res.data.TeacherManagePage
          this.tableData = content
          this.totalPages = +totalPages
          this.currentPage = +number
          this.totalElements = +totalElements
        }
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
      this.getData()
      const dom = document.getElementById('right-scroll')
      dom.querySelector('.scrollbar-wrapper').scrollTo(0, 0)
    },
    // 表头操作
    headerOperation(val) {
      console.log(val, '表头编辑')
    },
    // 点击操作按钮
    operation(val, index) {
      if (index === '1' || index === '2') {
        this.$router.push({
          path: '/newTeacher',
          query: { index: index, teacherId: val.id }
        })
      } else if (index === '3') {
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
.orderStyle {
  padding-bottom: 45px;
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
