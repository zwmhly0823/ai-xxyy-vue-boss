<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-07-31 17:53:04
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-12-21 14:54:44
-->
<template>
  <div class="container">
    <!-- 搜索栏 -->
    <div>
      <Search @searchTable="searchData" :teacherIds="teacherIds" />
    </div>
    <!-- tab切换 -->
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in activeList"
        :key="item.label"
        :label="item.label"
        :name="item.name"
      ></el-tab-pane>
    </el-tabs>
    <!-- table -->
    <comTable :comTableData="complaintData" @openDrawer="openDrawer" />
    <!-- 分页 -->
    <div class="pag-con">
      <m-pagination
        :current-page="currentPage"
        :page-count="totalPages"
        :pageSize="20"
        :total="totalElements"
        @current-change="handleSizeChange"
        show-pager
        open="calc(100vw - 170px - 25px)"
        close="calc(100vw - 50px - 25px)"
      ></m-pagination>
    </div>
    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      :before-close="handleClose"
      size="40%"
    >
      <ComDrawer :drawerData="drawerData" @closeDra="handleClose" />
    </el-drawer>
  </div>
</template>

<script>
import Search from './components/search'
import comTable from './components/comTable'
import ComDrawer from './components/comDrawer'
import MPagination from '@/components/MPagination/index.vue'
import { isToss } from '@/utils/index'

export default {
  data() {
    return {
      totalElements: 0,
      totalPages: 0,
      currentPage: 1,
      activeList: [
        { label: '待处理', name: '9' },
        { label: '退回待处理', name: '1' },
        { label: '处理中', name: '2' },
        { label: '待回访', name: '3' },
        { label: '已解决', name: '7' },
        { label: '全部', name: '0' }
      ],
      activeName: '9',
      drawer: false,
      drawerData: {}, // 抽屉数据
      complaintData: [
        {
          date: '2016-05-02',
          cno: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      teacherIds: [],
      lessonType: '',
      query: null
    }
  },
  components: {
    comTable,
    MPagination,
    ComDrawer,
    Search
  },
  created() {
    // this.lessonType = +JSON.parse(localStorage.getItem('teacher')).dutyId
  },
  mounted() {
    const teacherid = isToss()
    this.$http.Permission.getAllTeacherByRole({
      teacherId: teacherid
    }).then((res) => {
      this.teacherIds = res
      this.getComplaintList()
    })
  },
  watch: {
    activeName: function(val, oldVal) {
      console.log(val, oldVal)
      this.currentPage = 1
      this.getComplaintList(this.query)
    }
  },
  methods: {
    // 搜索 调用列表
    searchData(val) {
      this.getComplaintList(val)
      this.currentPage = 1
      this.query = Object.assign({}, val)
    },
    // 投诉列表
    getComplaintList(val) {
      console.log(val)
      let parmes = {
        businessId: 105,
        cpStatus: this.activeName,
        pageNumber: this.currentPage,
        pageSize: 20
      }
      // console.log('search', this.lessonType, val)
      if (val) {
        parmes = Object.assign(parmes, val)
      }
      if (+this.activeName === 9) {
        parmes.cpStatusSub = 20
        parmes.cpStatus = 2
      }
      if (+this.activeName === 2) {
        parmes.cpStatusSub = 21
      }
      // if (+this.activeName === 1) {
      //   parmes.cpStatusSub = 11
      // }
      // if (
      //   (this.lessonType === 1 && !val) ||
      //   (this.lessonType === 1 && val.userRemarkEightExt.length < 1)
      // ) {
      //   parmes.userRemarkEightExt = this.teacherIds
      // } else if (
      //   (this.lessonType === 2 && !val) ||
      //   (this.lessonType === 2 && val.userRemarkNineExt.length < 1)
      // ) {
      //   parmes.userRemarkNineExt = this.teacherIds
      //   console.log(parmes.userRemarkNineExt)
      // }

      // if (val) {
      //   this.query = Object.assign({}, val)
      // }
      return this.$http.Complaint.getComplaintList(parmes, this.currentPage)
        .then((res) => {
          if (+res.payload.total === 0) {
            this.complaintData = []
            this.totalElements = 0
          }
          if (res && res.payload && res.payload.list) {
            this.complaintData = res.payload.list
            this.totalElements = +res.payload.total
          }
        })
        .catch(() => {
          // loading.close()
        })
    },
    // 分页
    handleSizeChange(val) {
      this.currentPage = val
      this.getComplaintList(this.query)
    },
    //
    openDrawer(val) {
      return this.$http.Complaint.getComplaintDetail({
        id: val.complaintNo
      }).then((res) => {
        this.drawerData = res.payload

        this.drawer = true
      })
    },
    // 关闭抽屉
    handleClose() {
      this.drawer = false
      this.getComplaintList(this.query)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 10px;
  padding: 20px;
  width: calc(100vw)-50px;
  background: white;
  overflow: hidden;
  .demo-form-inline {
    margin: 0 auto;
    text-align: center;
  }
  .demo-form-flex {
    display: flex;
  }
  .handle-btn {
    color: blue;
    cursor: pointer;
  }
}
.el-input__inner {
  width: 150px !important;
}
</style>
