<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 14:30:00
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-16 12:44:20
 */
 -->
<template>
  <div class="container">
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="list"
    >
      <el-table-column label="作品" width="300" align="center">
        <template slot-scope="scope">
          <el-image
            class="works-img"
            :src="scope.row.taskImage"
            :lazy="true"
            :preview-src-list="[scope.row.taskImage]"
            :z-index="1001"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="点评" width="180" align="center">
        <template slot-scope="scope">
          <div
            class="audio-container"
            v-for="(audio, idx) in soundArr(scope.row.taskComments)"
            :key="idx"
          >
            <audio :src="audio" style="height: 47px" controls></audio>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="点评分类" align="center" width="180">
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.taskComments"
            :key="index"
            class="review-type"
          >
            {{ item.type === 0 ? '手动点评' : '智能点评' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">{{ scope.row.userMobile }}</div>
          <div class="review-type">{{ scope.row.weixinNickname }}</div>
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">{{ scope.row.teamName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="课程" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">{{ scope.row.courseName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="辅导老师" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">{{ scope.row.teacherRealName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="上传日期" align="center" width="180">
        <template slot-scope="scope">
          <div class="review-type">{{ timestamp(scope.row.utime, 2) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="点评日期" align="center" width="180">
        <template slot-scope="scope">
          <div
            v-for="(item, index) in scope.row.taskComments"
            :key="index"
            class="review-type"
          >
            {{ timestamp(item.ctime, 2) }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <m-pagination
      :current-page="query.pageNum"
      :page-size="query.size"
      :total="totalElements"
      :showPager="true"
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
          this.list = res.payload.content
          this.totalElements = Number.parseInt(res.payload.totalElements)
          this.loading = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    soundArr(soundComments) {
      if (soundComments.lenght === 0) return
      const arr = []
      for (let i = 0; i < soundComments.length; i++) {
        if (i < 5) {
          arr.push(soundComments[i].soundComment)
        }
      }
      return arr
    },
    async pageChange_handler(page) {
      this.query.pageNum = page
      await this.initList(page)
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }
  },
  components: {
    MPagination: () => import('@/components/MPagination/index.vue')
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0 0 30px 0;
  .audio-container {
    overflow: hidden;
    width: 47px;
    border-radius: 100%;
    height: 47px;
    margin: 0 auto 20px;
  }
  .review-type {
    margin: 0 0 20px 0;
  }
  .works-img {
    width: 200px;
    height: 300px;
    display: block;
    margin: 0 auto;
  }
  /deep/ .m-pagination {
    bottom: 0;
  }
}
</style>
