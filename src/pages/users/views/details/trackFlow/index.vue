<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: liukun
 * @Date: 2020-07-20 16:37:31
 * @LastEditors: liukun
 * @LastEditTime: 2020-09-01 12:14:53
-->
<template>
  <div class="track-container">
    <div class="upset_24col_space_between">
      <section class="setou123">
        <strong></strong>
        <span style="margin-right:5px">跟进记录</span>
        <el-select v-model="changeSubject" size="mini" style="width:75px">
          <el-option label="美术" :value="0"></el-option>
          <el-option label="写字" :value="1"></el-option>
        </el-select>
      </section>
      <section style="margin-right:30px">
        <el-button
          type="text"
          size="mini"
          @click="$refs.track_more.drawer = true"
          >更多<i class="el-icon-arrow-right"></i
        ></el-button>
      </section>
    </div>
    <div class="chouti" v-if="tableData && tableData.length">
      <section class="flower_item" v-for="item of tableData" :key="item.ctime">
        <div class="upset_24col_space_between padding-right15">
          <div>
            <el-tag size="small" v-if="item.teacherInfo.duty_id === '1'"
              >CC</el-tag
            >
            <el-tag
              size="small"
              type="danger"
              v-else-if="item.teacherInfo.duty_id === '2'"
              >CT</el-tag
            >
            <span style="margin-left:10px">{{
              item.teacherInfo.realname + item.teacherInfo.departmentInfo.name
            }}</span>
          </div>
          <div>
            <svg
              v-if="item.contact_type === '0'"
              style="vertical-align: middle"
              class="lk-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icongongzhonghao"></use>
            </svg>
            <svg
              v-if="item.contact_type === '1'"
              style="vertical-align: middle"
              class="el-elment-lk"
              aria-hidden="true"
            >
              <use xlink:href="#icondianhua"></use>
            </svg>
            <i
              v-else-if="item.contact_type === '2'"
              class="el-icon-mobile-phone icon-fail"
            ></i>
            <span style="vertical-align: middle;padding-left:5px">{{
              item.finish_type === '0'
                ? '无效沟通'
                : item.finish_type === '1'
                ? '完成沟通'
                : '无法判断'
            }}</span>
          </div>
        </div>
        <div class="upset_24col_space_between padding-right15 margin22">
          <span class="color-gray">{{ item.point_type }}</span>
          <span class="color-gray">{{ item.ctime }}</span>
        </div>
        <div class="upset_24col_space_between padding-right15">
          <span style="line-height:18px">{{ item.content }}</span>
        </div>
      </section>
    </div>
    <div v-else class="no-data">暂无数据</div>
    <addNew ref="track_add" :changeSubject="changeSubject" />
    <trackMore ref="track_more" :changeSubject="changeSubject" />
  </div>
</template>

<script>
import { formatDate } from '@/utils/mini_tool_lk'
import addNew from './add_new'
import trackMore from './track_more'
export default {
  name: 'index',
  components: { addNew, trackMore },
  data() {
    return {
      tableData: [],
      changeSubject: this.$store.state.subjects.subjectCode
    }
  },
  watch: {
    changeSubject: {
      immediate: false,
      deep: true,
      handler(newValue, oldValue) {
        console.info('跟进记录-手动切换科目')
        this.getTrackList()
      }
    }
  },
  methods: {
    async getTrackList({ size = 10, page = 1 } = {}) {
      const {
        data: {
          UserFollowLogPage: { content }
        }
      } = await this.$http.User.getTrackList({
        subject: this.changeSubject,
        uid: this.$route.params.id
      }).catch((err) => {
        this.$message.error('flow更多数据获取失败')
        console.error(err)
      })
      if (content && content.length) {
        content.forEach((item, index) => {
          const obj = {
            '0': '首通',
            '1': 'CF01',
            '2': 'CF04',
            '3': 'CF08',
            '4': '老生覆盖',
            '5': '日常沟通'
          }
          item.point_type = obj[item.point_type]
          item.ctime = formatDate(+item.ctime)
        })
        this.tableData = content
        console.info('1号list更新')
      } else {
        this.tableData = []
      }
    }
  },
  created() {
    this.getTrackList()
  },
  mounted() {
    this.$root.$on('reload', (r) => {
      this.getTrackList()
    })
  }
}
</script>

<style lang="scss" scoped>
.track-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .chouti {
    flex: 1;
    overflow: auto;
  }
}
.upset_24col_space_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.setou123 {
  padding: 10px 0px;
  span {
    vertical-align: middle;
    font-size: 14px;
  }
  strong {
    vertical-align: middle;
    background-color: #49a3ff;
    display: inline-block;
    width: 16px;
    height: 2px;
    transform: rotate(90deg);
  }
}
.flower_item {
  padding: 10px 5px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: flex-start;
}
.lk-icon {
  width: 20px;
  height: 20px;
  overflow: hidden;
  color: #42b983;
  fill: currentColor;
}
.el-elment-lk {
  vertical-align: middle;
  width: 24px;
  height: 18px;
  fill: #49a3ff;
}
.padding-right15 {
  padding-right: 15px;
}
.color-gray {
  color: #aeaeae;
}
.icon-fail {
  vertical-align: middle;
  font-size: 18px;
  color: #f56c6c !important;
}
.content {
  line-height: 20px;
}
.no-data {
  margin-top: 100px;
  color: #aeaeae;
  text-align: center;
}
.margin22 {
  margin: 12px 0;
}
</style>
