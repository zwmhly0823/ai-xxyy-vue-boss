<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 14:30:00
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-15 18:07:10
 */
 -->
<template>
  <div class="container">
    <el-table :loading="loading" :data="list">
      <el-table-column label="作品" width="300" align="center">
        <template slot-scope="scope">
          <img class="works-img" :src="scope.row.taskImage" draggable="false" />
        </template>
      </el-table-column>
      <el-table-column label="点评" width="180" align="center">
        <template slot-scope="scope">
          <div class="audio-container">
            <audio
              :src="scope.row.taskSound"
              style="height: 47px"
              controls
            ></audio>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="点评分类" align="center" width="180">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.taskComments" :key="index">
            {{ item.type === 0 ? '人工点评' : '智能点评' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.userMobile }}</div>
          <div>{{ scope.row.weixinNickname }}</div>
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.teamName }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="课程"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column label="辅导老师" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.teacherRealName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="上传日期" align="center" width="180">
        <template slot-scope="scope">
          <div>{{ timestamp(scope.row.ctime, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="点评日期" align="center" width="180">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.taskComments" :key="index">
            {{ timestamp(item.ctime, 2) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <m-pagination
      :current-page="query.pageNum"
      :page-count="totalPages"
      :total="totalElements"
      @current-change="pageChange_handler"
      open="calc(100vw - 95px - 100px)"
      close="calc(100vw - 23px - 50px)"
    />
  </div>
</template>

<script>
import { timestamp } from '@/utils/index'
export default {
  data() {
    return {
      number: 1,
      list: [],
      query: {
        size: 10,
        pageNum: 1
      },
      totalElements: 0,
      totalPages: 0,
      radio: '',
      timestamp: timestamp,
      loading: true
    }
  },
  mounted() {
    this.initList(this.number)
  },
  methods: {
    async initList(number) {
      try {
        const res = await this.$http.RiviewCourse.getHaveRiview(number)
        if (res.code === 0) {
          this.loading = false
          this.list = res.payload.content.sort((a, b) => {
            return (
              Number.parseInt(b.taskComments[0].ctime) -
              Number.parseInt(a.taskComments[0].ctime)
            )
          })
          this.totalElements = Number.parseInt(res.payload.totalElements)
          this.totalPages = Number.parseInt(res.payload.totalPages)
        }
      } catch (error) {
        console.log(error)
      }
    },
    pageChange_handler(page) {
      this.query.pageNum = page
      this.initList(page)
    }
  },
  components: {
    MPagination: () => import('@/components/MPagination/index.vue')
  }
}
</script>

<style lang="scss" scoped>
.container {
  .audio-container {
    overflow: hidden;
    width: 47px;
    border-radius: 100%;
    height: 47px;
    margin: 0 auto;
  }
  .works-img {
    width: 200px;
    height: 300px;
    display: block;
    margin: 0 auto;
  }
}
</style>
