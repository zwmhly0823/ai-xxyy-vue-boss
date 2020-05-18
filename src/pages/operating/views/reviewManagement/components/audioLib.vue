<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 10:46:18
 * @LastEditors: songyanan
 * @LastEditTime: 2020-05-15 20:20:40
 */
 -->
<template>
  <div class="audio-container">
    <div class="audio-container-button">
      <el-button type="primary" @click="addPage">新增语音</el-button>
    </div>
    <el-table :loading="loading" :data="list">
      <el-table-column label="语音ID" width="180" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.id }}</div>
        </template>
      </el-table-column>
      <el-table-column label="课程" width="240" align="center">
        <template slot-scope="scope">
          <span style="margin: 0 20px 0 0">{{
            scope.row.courseType === 'SYSTEM' ? '系统课' : '体验课'
          }}</span>
          <span style="margin: 0 20px 0 0"
            >{{
              scope.row.courseStrait +
                scope.row.courseLevel +
                scope.row.courseUnit
            }}
          </span>
          <span>{{ scope.row.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点评维度" width="180" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.reviewDimension }}</div>
        </template>
      </el-table-column>
      <el-table-column label="评分" width="180" align="center">
        <template slot-scope="scope">
          <div>{{ scoreObj[scope.row.score] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="语音" width="180" align="center">
        <template slot-scope="scope">
          <div class="audio">
            <audio
              :src="scope.row.fileUrl"
              style="height: 47px"
              controls
            ></audio>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleItem(scope.row.opreation, scope.row.id)"
            v-if="scope.row.opreation === 'ENABLE'"
            >禁用</el-button
          >
          <el-button
            type="primary"
            @click="handleItem(scope.row.opreation, scope.row.id)"
            v-if="scope.row.opreation === 'DISABLE'"
            >取消禁用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <m-pagination
      :current-page="query.pageNum"
      :page-count="totalPages"
      :total="totalElements"
      :showPager="true"
      @current-change="pageChange_handler"
      open="calc(100vw - 95px - 100px)"
      close="calc(100vw - 23px - 50px)"
    />
  </div>
</template>

<script>
import { scoreObj } from '@/common/data'
export default {
  data() {
    return {
      number: 0,
      loading: true,
      list: [],
      totalElements: 0,
      totalPages: 0,
      query: {
        size: 10,
        pageNum: 1
      },
      scoreObj: scoreObj
    }
  },
  mounted() {
    this.initList(this.number)
  },
  methods: {
    addPage() {
      this.$router.push('/audioAdd')
    },
    async initList(number) {
      try {
        const res = await this.$http.RiviewCourse.getAudioList(number)
        if (res.code === 0) {
          this.loading = false
          this.list = res.payload.content.sort((a, b) => {
            return Number.parseInt(b.id) - Number.parseInt(a.id)
          })
          this.totalElements = Number.parseInt(res.payload.totalElements)
          this.totalPages = Number.parseInt(res.payload.totalPages)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async pageChange_handler(page) {
      this.query.pageNum = page
      await this.initList(page)
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    async handleItem(type, id) {
      const params = {
        opreation: type === 'ENABLE' ? 'DISABLE' : 'ENABLE',
        id: id
      }
      try {
        const res = await this.$http.RiviewCourse.audioIsUse(params)
        if (res.code === 0) {
          this.initList(this.query.pageNum)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    MPagination: () => import('@/components/MPagination/index.vue')
  }
}
</script>

<style lang="scss" scoped>
.audio-container {
  margin: 0 0 30px 0;
  &-button {
    width: 100%;
    height: 60px;
    background: rgb(255, 255, 255);
    line-height: 60px;
    margin: 5px 0 10px 10px;
    button {
      margin: 0 0 0 20px;
    }
  }
  .audio {
    overflow: hidden;
    width: 47px;
    border-radius: 100%;
    height: 47px;
    margin: 0 auto;
  }
}
</style>
