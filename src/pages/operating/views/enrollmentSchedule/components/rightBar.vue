<!--
 * @Descripttion:
 * @version:
 * @Author: shentong
 * @Date: 2020-04-02 16:08:02
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-14 18:50:25
 -->
<template>
  <div>
    <div class="tabs-operate">
      <div v-for="(tab, index) in tabs" :key="index">
        <span :class="{ active: index == tabIndex }">{{ tab }}</span>
      </div>
    </div>
    <div class="sear-container">
      <m-search @search="handleSearch" stage="stage" sup="sup" />
      <el-button
        type="primary"
        slot="searchItems"
        size="mini"
        @click="addSchedule"
        >新增招生排期</el-button
      >
    </div>

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
        <el-table-column prop="address" label="带班销售人数"></el-table-column>
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
</template>

<script>
import MSearch from '@/components/MSearch/index.vue'
import EleTable from '@/components/Table/EleTable'
export default {
  props: {
    department: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    MSearch,
    EleTable
  },
  data() {
    return {
      query: '',
      tabIndex: 0,
      tabs: ['体验课', '系统课'],
      totalElements: 0,
      flags: {
        loading: false
      },
      tabQuery: {
        size: 2,
        pageNum: 1
      },
      sex: {
        // 0: '-',
        0: '男',
        1: '女'
        // 3: '保密'
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
  activated() {
    setTimeout(() => {
      console.log(this.teacherID)
      this.getData()
      if (this.teacherID) this.$refs.detailsHidden.createdUrl(this.teacherID)
    }, 500)
  },
  methods: {
    /** adolf-start */
    addSchedule(val) {
      this.$router.push({
        path: '/addSchedule',
        query: { teacherId: val.id }
      })
    },
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.query.pageNum = page
      // this.getList()
    },
    /** adolf-end */
    getData(page = this.currentPage, query = JSON.stringify(this.query)) {
      // tab数据
      this.$http.Teacher.getTeacherPage(page, query).then((res) => {
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
      if (index === '1') {
        this.$router.push({
          path: '/newTeacher',
          query: { index: index, teacherId: val.id }
        })
      } else if (index === '2') {
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
