<!--
/*
 * @Descripttion:
 * @Author: songyanan
 * @Date: 2020-05-11 10:46:18
 * @LastEditors: YangJiyong
 * @LastEditTime: 2020-10-17 13:42:22
 */
 -->
<template>
  <div class="audio-container">
    <div class="audio-container-button">
      <div style="display: flex;">
        <MSearch search-courseware="course_id" @search="getCourseId"> </MSearch>
        <div style="padding: 6px 0 0 0;">
          <simple-select
            name="operation"
            placeholder="是否上架"
            :multiple="false"
            class="search-group-item"
            :data-list="shelfList"
            @result="getSearchData('operation', arguments)"
          />
        </div>
        <DatePicker
          name="ctime"
          style="padding: 6px 0 0 20px;"
          @result="getSearchData('ctime', arguments)"
        />
      </div>
      <div>
        <el-button type="primary" size="small" @click="addPage"
          >新增语音</el-button
        >
        <el-button type="primary" @click="allDisable" size="small"
          >一键禁用</el-button
        >
        <el-button type="primary" @click="allUnDisable" size="small"
          >一键取消禁用</el-button
        >
      </div>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column label="语音ID" width="80" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.id }}</div>
        </template>
      </el-table-column>
      <el-table-column label="课程类型" width="120" align="center">
        <template slot-scope="scope">
          <span style="margin: 0 20px 0 0">{{
            courseVal[scope.row.courseType]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" width="200">
        <template slot-scope="scope">
          <span style="margin: 0 10px 0 0"
            >{{
              scope.row.courseStrait +
                scope.row.courseLevel +
                scope.row.courseUnit
            }}
          </span>
          <span>{{ scope.row.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程版本" width="80" align="center">
        <template slot-scope="scope">
          <span style="margin: 0 20px 0 0">{{
            scope.row.courseVersion ? scope.row.courseVersion : '-'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维度" width="100" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.reviewDimension }}</div>
        </template>
      </el-table-column>
      <el-table-column label="评分" width="80" align="center">
        <template slot-scope="scope">
          <div>{{ scoreObj[scope.row.score] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="语音名称" width="80" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.voiceName ? scope.row.voiceName : '-' }}</div>
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
      <el-table-column label="上传时间" width="180" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.row.ctime ? scope.row.ctime : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleItem(scope.row.opreation, scope.row.id)"
            v-if="scope.row.opreation === 'ENABLE'"
            >禁用</el-button
          >
          <el-button
            type="text"
            @click="handleItem(scope.row.opreation, scope.row.id)"
            v-if="scope.row.opreation === 'DISABLE'"
            >取消禁用</el-button
          >
          <el-button type="text" @click="deleteAudio(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <m-pagination
      :current-page="query.pageNum"
      :page-size="query.pageSize"
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
import MSearch from '@/components/MSearch/index'
import SimpleSelect from '@/components/MSearch/searchItems/simpleSelect'
import DatePicker from '@/components/MSearch/searchItems/datePicker'
import { formatData } from '@/utils/index.js'
import { SUP_LEVEL_UPPER,SUP_LEVEL_ALL,courseLevelReplace } from '@/utils/supList.js'
export default {
  data() {
    return {
      courseLevelReplace,
      SUP_LEVEL_ALL,
      shelfList: [
        {
          id: 0,
          text: '是'
        },
        {
          id: 1,
          text: '否'
        }
      ],
      courseVal: {
        EXPERIENCE: '体验课',
        SYSTEM: '系统课',
        TA: '体验课-TV课',
        TB: '系统课-TV课',
        T6: '节日主题课'
      },
      number: 1,
      loading: true,
      list: [],
      totalElements: 0,
      query: {
        pageSize: 10,
        pageNum: 1
      },
      scoreObj: scoreObj,
      ids: ''
    }
  },
  mounted() {
    this.initList(this.query)
  },
  methods: {
    getCourseId(res) {
      // searchComment {searchComment: 1}
      console.log('课程名称', res)
      const key = 'course_id'
      let val = ''
      if (res[0] && res[0].terms) {
        val = res[0].terms
      }
      console.log(key, val)
      this.getSearchData(key, [val])
    },
    // 点击搜索
    getSearchData(key, res) {
      const search = res && res[0]
      console.log(key, res[0], '===')
      if (search) {
        if (key !== 'ctime') {
          this.query = {
            ...this.query,
            ...search
          }
        } // 查询时间处理格式
        else {
          const startTime = search.ctime.gte
          const endTime = search.ctime.lte
          this.query = {
            ...this.query,
            startTime,
            endTime
          }
        }
      } else {
        this.$delete(this.query, key)
        if (key === 'ctime') {
          this.$delete(this.query, 'startTime')
          this.$delete(this.query, 'endTime')
        }
      }
      console.log(search, 'search==')
      // 删除返回值没空数组的情况
      if (search && search[key].length === 0) {
        this.$delete(this.query, key)
      }
      // this.$emit('search', this.query)
      this.query.pageNum = 1
      this.initList(this.query)
      console.log(this.query, 'query====')
    },
    // 一键禁用
    allDisable() {
      if (this.ids.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择禁用项'
        })
        return
      }
      this.$confirm('禁用后语音不可使用，是否禁用?', '禁用语音', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(this.ids, 'idsssss')
          this.batchUpdateReviewVoice('ENABLE', this.ids)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 一键取消禁用
    allUnDisable() {
      if (this.ids.length === 0) {
        this.$message({
          type: 'info',
          message: '请选择取消项'
        })
        return
      }
      this.$confirm('取消禁用后语音即可使用，是否取消禁用?', '取消禁用语音', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.batchUpdateReviewVoice('DISABLE', this.ids)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 删除
    deleteAudio(row) {
      this.$confirm('删除后语音不可恢复，是否删除语音?', '删除语音', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delReviewVoice(row.id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // checkbox
    handleSelectionChange(res) {
      const _ids = []
      res.forEach((item) => {
        _ids.push(item.id)
      })
      this.ids = _ids.join(',')
      console.log(res, _ids, this.ids, '---')
    },
    addPage() {
      this.$router.push('/audioAdd')
    },
    async initList(params) {
      try {
        const res = await this.$http.RiviewCourse.getAudioList(params)
        if (res.code === 0) {
          const _list = res.payload.content
          _list.forEach((item) => {
            item.ctime = formatData(item.ctime, 's')
            item.courseStrait = SUP_LEVEL_ALL[item.courseStrait] || ''
          })
          this.list = _list
          this.totalElements = Number.parseInt(res.payload.totalElements)
          this.loading = false
        }
      } catch (error) {
        console.log(error)
      }
    },
    async pageChange_handler(page) {
      this.query.pageNum = page
      await this.initList(this.query)
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
          this.initList(this.query)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 一键禁用/取消
    async batchUpdateReviewVoice(type, ids) {
      const params = {
        opreation: type === 'ENABLE' ? 'DISABLE' : 'ENABLE',
        ids: ids
      }
      try {
        const res = await this.$http.RiviewCourse.batchUpdateReviewVoice(params)
        if (res.code === 0) {
          console.log(res, 'res===')
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.initList(this.query)
          this.ids = ''
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 删除接口
    async delReviewVoice(id) {
      const params = {
        id: id
      }
      try {
        const res = await this.$http.RiviewCourse.delReviewVoice(params)
        if (res.code === 0) {
          console.log(res, 'res===')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initList(this.query)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  components: {
    MSearch,
    SimpleSelect,
    DatePicker,
    MPagination: () => import('@/components/MPagination/index.vue')
  }
}
</script>

<style lang="scss" scoped>
.audio-container {
  margin: 0 0 30px 0;
  // &-button {
  //   width: 100%;
  //   height: 50px;
  //   background: rgb(255, 255, 255);
  //   line-height: 50px;
  //   margin: 10px 0 10px 0;
  //   button {
  //     margin: 0 0 0 20px;
  //   }
  // }
  .audio {
    overflow: hidden;
    width: 47px;
    border-radius: 100%;
    height: 47px;
    margin: 0 auto;
  }
  /deep/ .m-pagination {
    bottom: 0;
  }
  /deep/ button {
    height: 30px;
    line-height: 0;
  }
  /deep/ .el-card {
    border: none;
  }
  .audio-container-button {
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 5px;
  }
}
</style>
