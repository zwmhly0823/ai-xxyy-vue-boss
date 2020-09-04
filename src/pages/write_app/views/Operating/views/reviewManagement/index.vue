<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-09-03 15:14:25
 * @LastEditors: Shentong
 * @LastEditTime: 2020-09-04 21:00:21
-->
<template>
  <el-row type="flex" class="app-main reviewManagement">
    <el-col class="reviewManagement-content">
      <div class="grid-content">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div class="header-search-container" border>
            <table-search @change="searchChange"></table-search>
          </div>
          <div ref="tableContainer">
            <ele-table
              :tableHeight="tableHeight"
              :tableSize="'small'"
              :dataList="tableData"
              :loading="flags.loading"
              :size="tabQuery.size"
              :page="tabQuery.page"
              :showAllTotalNum="true"
              :total="totalElements"
              @pageChange="pageChange_handler"
              class="mytable"
            >
              <el-table-column
                label="点评ID"
                min-width="50"
                prop="department_name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="用户信息"
                min-width="180"
                prop="teacher_realname"
                align="center"
              ></el-table-column>
              <el-table-column
                label="作品"
                min-width="120"
                prop="teacher_wechat_no"
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    class="img-box"
                    v-for="(img, index) in scope.row.imgs"
                    :key="index"
                  >
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="img"
                      :preview-src-list="scope.row.imgs"
                    >
                    </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="课程名称·上传时间"
                min-width="120"
                prop="teacher_wechat_no"
                align="center"
              >
                <!-- <template slot-scope="scope">
                  <div
                    class="img-box"
                    v-for="(img, index) in scope.row.imgs"
                    :key="index"
                  >
                    <img :src="img" alt="" />
                  </div>
                </template> -->
              </el-table-column>
              <el-table-column
                label="课程类型"
                min-width="110"
                prop="courseType"
                align="center"
              ></el-table-column>
              <el-table-column
                label="课程难度"
                min-width="100"
                prop="level"
                align="center"
              ></el-table-column>
              <el-table-column
                label="点评老师"
                min-width="120"
                prop="end_course_day"
                align="center"
              ></el-table-column>
              <el-table-column
                label="点评内容"
                min-width="120"
                prop="teacher_wechat_no"
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    class="audio-box"
                    v-for="(item, index) in scope.row.audio.split(',')"
                    @click="audioClickHandle(scope.$index, index, item)"
                    :key="index"
                  >
                    <i
                      v-if="currentAudioIndex == `${scope.$index}${index}`"
                      class="el-icon-video-pause"
                    ></i>
                    <i v-else class="el-icon-video-play"></i>
                    <!-- :ref="`audioRef_${scope.$index}_${index}`" -->
                    <audio
                      :src="item"
                      :ref="`audioRef_${scope.$index}_${index}`"
                    ></audio>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="老师接收时间"
                min-width="120"
                prop="end_course_day"
                align="center"
              ></el-table-column>
              <el-table-column
                label="点评状态"
                min-width="120"
                prop="status"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="comment-status">{{ scope.row.status }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="听点评状态"
                min-width="120"
                prop="status"
                align="center"
              >
                <template slot-scope="scope">
                  <div class="comment-status">{{ scope.row.status }}</div>
                </template>
              </el-table-column>
            </ele-table>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import _ from 'lodash'
import TableSearch from './components/tableSearch/index'
import EleTable from '@/components/Table/EleTable'

export default {
  props: [],
  components: {
    TableSearch,
    EleTable
  },
  data() {
    return {
      currentAudioIndex: null,
      tableHeight: 'auto',
      flags: {
        loading: false
      },
      // 总页数
      totalElements: 0,
      tableData: [],
      tabQuery: {
        size: 10,
        page: 1
      },
      searchEmit: {},
      showSearch: true,
      dataMocke: [
        {
          imgs: [
            'http://s1.meixiu.mobi/android-images/2020-08-04/9826c5d2a4634f438cb0d9b4415f583f.jpg',
            'http://s1.meixiu.mobi/android-images/2020-09-04/e1cd31339ac54e5d854f5c299496e308.jpg'
          ],
          audio: 'http://mp3.9ku.com/hot/2007/05-07/84566.mp3'
        },
        {
          imgs: [
            'http://s1.meixiu.mobi/android-images/2020-08-04/9826c5d2a4634f438cb0d9b4415f583f.jpg'
          ],
          audio: 'http://mp3.9ku.com/hot/2009/05-31/183203.mp3'
        },
        {
          imgs: [
            'http://s1.meixiu.mobi/android-images/2020-08-04/9826c5d2a4634f438cb0d9b4415f583f.jpg'
          ],
          audio: 'http://mp3.9ku.com/hot/2011/05-31/411603.mp3'
        }
      ]
    }
  },
  async created() {
    this.getTrialTeamList(this.tabQuery)
  },
  computed: {},
  mounted() {
    this.calcTableHeight()
  },
  watch: {},
  methods: {
    // 组件emit
    searchChange(res) {
      console.log('emit-res', res)
      // this.initSearchData(res, true)
      // this.getTrialTeamList(this.tabQuery)
    },
    initSearchData(res, isFromEmit = false) {
      // 如果是子组件emit而来的数据，则不需要清空
      if (!isFromEmit) {
        this.showSearch = false
        this.$nextTick(() => {
          this.showSearch = true
        })
      }

      this.searchEmit = _.cloneDeep(res)

      const {
        term = [],
        department = [],
        teacherId = '',
        sup = [],
        teamName = ''
      } = this.searchEmit

      Object.assign(this.tabQuery, {
        term,
        teamName,
        sup,
        department,
        teacherId,
        page: 1
      })
    },
    audioClickHandle($index, index, src) {
      // 当前音频ref
      // const { audioRef = [] } = this.$refs

      // const typeOfAudio = Object.prototype.toString.call(audioRef)
      // if (typeOfAudio === '[object Array]') {
      //   audioRef.forEach((audio) => {
      //     console.log(audio, 'audio')
      //   })
      // }

      const currentRef = `audioRef_${$index}_${index}`
      const currentAudio = this.$refs[currentRef][0]
      /** 顾虑掉其他ref，只包含音频 audio 组件 */
      const keys = Object.keys(this.$refs).filter(
        (item) => item.indexOf('audioRef') !== -1
      )
      keys.forEach((key) => {
        if (key !== currentRef) {
          const otherAudio = this.$refs[key][0]
          if (otherAudio && otherAudio.load) otherAudio.load()
        }
      })

      if (currentAudio.paused) {
        this.currentAudioIndex = `${$index}${index}`
        currentAudio.play() // audio.play();// 播放
      } else {
        // audio.pause() // 暂停
        currentAudio.load() // 取消播放并回到0秒
        this.currentAudioIndex = null
      }
    },
    // 条件查询列表
    async getTrialTeamList(params) {
      this.flags.loading = true
      try {
        const {
          data: {
            StudentTrialTeamStatisticsPage: { content = [], totalElements }
          }
        } = await this.$http.writeApp.Team.getTrialTeamList(params)
        // 总数、分页用
        this.totalElements = +totalElements || 0
        this.pakageListData(content)
        // this.tableData = content
        this.tableData = this.dataMocke
      } catch (err) {
        console.log('err', err)
      } finally {
        this.flags.loading = false
      }
    },
    // 组装table接口返回数据
    pakageListData(list) {},
    /**
     * @description 分页 回调事件
     */
    pageChange_handler(page) {
      this.tabQuery.page = page
      this.getTrialTeamList(this.tabQuery)
    },
    getElementToPageTop(el) {
      if (el.parentElement) {
        return this.getElementToPageTop(el.parentElement) + el.offsetTop
      }
      return el.offsetTop
    },
    calcTableHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
        const tableTopHeight = this.$refs.tableContainer.getBoundingClientRect()
          .y
        //  document.body.clientHeight 返回body元素内容的高度
        const tableHeight = document.body.clientHeight - tableTopHeight - 60
        this.tableHeight = tableHeight + ''
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-image-viewer__canvas > img {
  max-height: 80% !important;
}
.reviewManagement {
  &-content {
    overflow-x: hidden;
    flex: 1;
    margin: 10px;
  }
  .team-name-pointer {
    cursor: pointer;
    color: #2a75ed;
  }
  .grid-content {
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-search-container {
      // height: 50px;
      display: flex;
      padding-left: 15px;
      border-bottom: 1px solid #eee;
    }
    .tabs-operate {
      height: 40px;
      background: #f5f7fa;
      display: flex;
      > div {
        height: 100%;
        padding: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &.active {
          background: #fff;
          span {
            color: #2a75ed;
          }
        }
      }
    }
  }
  .img-box {
    > img {
      width: 50px;
      height: 50px;
      cursor: pointer;
    }
  }
  .audio-box {
    > i {
      font-size: 25px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
// .mytable > .el-table tbody tr:hover > td:first-child {
//   background-color: #2a75ed !important;
//   .team-name-pointer {
//     color: #ffffff;
//   }
// }
.grid-content .scrollbar-wrapper {
  overflow-x: hidden;
}
.grid-content .el-scrollbar {
  flex: 1;
}
</style>
