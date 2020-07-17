<!--
 * @Descripttion:
 * @version:
 * @Author: zhubaodong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: panjian
 * @LastEditTime: 2020-07-17 12:03:58
 -->
<template>
  <div>
    <m-search
      @search="handleSearch"
      teacherphone="phone.keyword"
      teachername="realname.keyword"
      teachernickname="nickname.keyword"
      rank="rank_id"
      induction="status"
      landing="is_login"
      position="duty_id"
      seller-level="level"
      v-if="true"
    >
      <!-- <el-button type="primary" slot="searchItems" size="mini">搜索</el-button> -->
      <el-button
        type="primary"
        slot="searchItems"
        size="mini"
        @click="newTeacher"
        >新增销售</el-button
      >
      <!--  <el-checkbox-group
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
      </el-checkbox-group>-->
    </m-search>

    <!-- <el-button
      type="primary"
      slot="searchItems"
      size="mini"
      @click="newTeacher"
      style="margin: 15px;"
      >新增销售</el-button
    > -->
    <div class="tableInner" ref="tableInner"></div>
    <div class="orderStyle">
      <el-table
        :data="tableData"
        :height="tableHeight"
        empty-text=" "
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
                <!-- <el-dropdown-item @click.native="operation(scope.row, '2')">
                  详情
                </el-dropdown-item> -->
                <!-- <el-dropdown-item @click.native="operation(scope.row, '3')">
                  关联微信号
                </el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="员工ID" width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.id }}</div>
          </template>
        </el-table-column>
        <el-table-column label="真实姓名">
          <template slot-scope="scope">
            <div>{{ scope.row.realname || '-' }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="性别">
          <template slot-scope="scope">
            <div>{{ sex[scope.row.sex] }}</div>
          </template>
        </el-table-column> -->
        <el-table-column label="对外昵称" min-width="160">
          <template slot-scope="scope">
            <div>{{ scope.row.nickname || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="钉钉工号">
          <template slot-scope="scope">
            <div>{{ scope.row.ding_userid || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column width="150" label="绑定微信号">
          <template slot-scope="scope">
            <div v-if="scope.row.weixin.length > 0">
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
        <el-table-column label="手机号" min-width="120">
          <template slot-scope="scope">
            <div>{{ scope.row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" min-width="150px">
          <template slot-scope="scope">
            <div v-if="scope.row.department.pname || scope.row.department.name">
              <div>
                {{ scope.row.department.pname }}
              </div>
              <div>
                {{ scope.row.department.name }}
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="职场" min-width="100px">
          <template slot-scope="scope">
            <div>{{ scope.row.work_place || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="职务/职级" min-width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.duty && scope.row.duty.length > 0">
              <p v-for="item in scope.row.duty" :key="item.id" style="margin:0">
                {{ item ? item.name || '-' : '-' }}
              </p>
            </div>
            <div v-else><p>-</p></div>
            <div>{{ scope.row.rank ? scope.row.rank.name || '-' : '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="员工状态" min-width="120px">
          <template slot-scope="scope">
            <div>{{ scope.row.teacher_status || '-' }}</div>
          </template>
        </el-table-column>

        <!-- <el-table-column label="职级">
          <template slot-scope="scope">
            <div>{{ scope.row.rank ? scope.row.rank.name || '-' : '-' }}</div>
          </template>
        </el-table-column> -->
        <el-table-column label="入职时间" min-width="120px">
          <template slot-scope="scope">
            <div>
              {{ scope.row.join_date }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下组时间" min-width="120px">
          <template slot-scope="scope">
            <div>
              {{ scope.row.leave_train }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="销售等级" min-width="120px">
          <template slot-scope="scope">
            <div>
              {{ scope.row.level }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="离职时间" min-width="120px">
          <template slot-scope="scope">
            <div>
              {{ scope.row.leave_date || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="在职状态">
          <template slot-scope="scope">
            <div>{{ scope.row.status == 0 ? '在职' : '离职' }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="登录状态">
          <template slot-scope="scope">
            <div>{{ scope.row.is_login == 0 ? '允许登录' : '禁止登录' }}</div>
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="操作">
          <template slot-scope="">
            <div class="editStyle">
              <span style="margin-right:20px">编辑</span>
              <span>详细</span>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 查看老师详情 -->
      <teacher-details
        ref="detailsHidden"
        :teacherID="teacherID"
        :subDepartment="subDepartment"
      />
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
// import { GetAgeByBrithday, formatData } from '@/utils/index'
import { formatData } from '@/utils/index'
import MSearch from '@/components/MSearch/index.vue'
import MPagination from '@/components/MPagination/index.vue'
import associatedWeChat from '../components/associatedWeChat.vue'
import teacherDetails from '../components/teacherDetails.vue'

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
    associatedWeChat,
    teacherDetails
  },
  data() {
    return {
      tableHeight: 0,
      departmentQuery: '',
      searchQuery: '',
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
      tableData: [],
      // 老师id
      teacherID: '',
      // 所属部门
      subDepartment: {},
      // 搜索
      search: [],
      // 详情传参
      detailsIndex: ''
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
      const query = {
        department: {
          id: `${id}`,
          pid: `${pid}`,
          children: children
        }
      }
      if (query.department.pid === '99999') {
        this.departmentQuery = ''
        this.query = ''
      } else {
        this.departmentQuery = query
      }
      this.getData()
    }
  },
  created() {
    this.$nextTick(() => {
      const tableHeight =
        document.body.clientHeight - this.$refs.tableInner.offsetTop - 120
      this.tableHeight = tableHeight + ''
    })
  },
  activated() {
    setTimeout(() => {
      this.getData()
      if (this.teacherID) {
        this.$refs.detailsHidden.createdUrl(this.teacherID)
      }
    }, 500)
  },
  methods: {
    // 搜索
    handleSearch(data) {
      if (data.length > 0) {
        const term = {}
        data.forEach((res) => {
          if (res.term) {
            Object.assign(term, res.term)
          } else if (res.terms) {
            Object.assign(term, res.terms)
          }
        })
        // this.query = JSON.stringify(term)
        this.searchQuery = term
      } else {
        this.searchQuery = ''
        this.query = ''
      }
      this.getData(1)
    },
    getData(page = this.currentPage) {
      if (this.departmentQuery || this.searchQuery) {
        this.query = Object.assign(
          {},
          this.departmentQuery || {},
          this.searchQuery || {}
        )
      }
      const query = this.query ? JSON.stringify(this.query) : ''
      // tab数据
      const loading = this.$loading({
        lock: true,
        text: '加载中……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      this.$http.Teacher.getTeacherPage(page, JSON.stringify(query))
        .then((res) => {
          console.log(res.data.TeacherManagePage.content, '老师列表')
          if (res && res.data && res.data.TeacherManagePage) {
            const {
              content = [],
              number,
              totalPages,
              totalElements
            } = res.data.TeacherManagePage
            content.forEach((res) => {
              res.join_date = res.join_date
                ? formatData(new Date(res.join_date).getTime(), 'd')
                : ''
              res.leave_train = res.leave_train
                ? formatData(new Date(res.leave_train).getTime(), 'd')
                : ''
              res.leave_date = res.leave_date
                ? formatData(new Date(res.leave_date).getTime(), 'd')
                : ''
              // 销售等级
              if (res.level === 0) {
                res.level = '新兵营'
              } else if (res.level === 1) {
                res.level = '1级社群销售'
              } else if (res.level === 2) {
                res.level = '2级社群销售'
              } else if (res.level === 3) {
                res.level = '3级社群销售'
              } else if (res.level === 4) {
                res.level = '1级'
              } else if (res.level === 5) {
                res.level = '2级'
              } else if (res.level === 6) {
                res.level = '3级'
              } else if (res.level === 7) {
                res.level = '4级'
              }
            })
            this.tableData = content
            if (this.detailsIndex === '2') {
              this.tableData.forEach((val) => {
                if (this.teacherID === val.id) {
                  this.$refs.detailsHidden.departmentData.pname =
                    val.department.pname
                }
              })
            }
            this.totalPages = +totalPages
            this.currentPage = +number
            this.totalElements = +totalElements
          }
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
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
      if (index === '1') {
        this.$router.push({
          path: '/newTeacher',
          query: { index: index, teacherId: val.id }
        })
      } else if (index === '2') {
        this.detailsIndex = index
        this.$refs.detailsHidden.drawer = true
        this.teacherID = val.id
        this.subDepartment = val.department
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
// .orderStyle {
//   padding-bottom: 30px;
// }
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
