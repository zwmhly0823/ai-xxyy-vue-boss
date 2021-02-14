<!--
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: zhangjiawen
 * @Date: 2020-12-09 15:49:39
 * @LastEditors: zhangjianwen
 * @LastEditTime: 2020-12-23 11:53:43
-->
<template>
  <div class="search-item small">
    <el-table :data="comTableData" border style="width: 100%">
      <el-table-column prop="userName" label="学生姓名" min-width="120">
        <template slot-scope="scope">
          <span class="handle-btn" @click="goDel(scope.row)"
            >{{ scope.row.userName }}-{{ scope.row.userMobile }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="complaintNo" label="投诉单号" min-width="80">
      </el-table-column>
      <el-table-column
        prop="systemTeacherName"
        label="辅导老师"
        min-width="120"
      >
      </el-table-column>

      <el-table-column prop="trialTeacherName" label="社群销售" min-width="120">
      </el-table-column>
      <el-table-column prop="cpStatus" label="处理状态" min-width="80">
        <template slot-scope="scope">
          <span>{{ handleName(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="currentStaffName"
        label="当前处理负责人"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="progress" label="课程进度" min-width="80">
        <!-- <template slot-scope="scope">
          <span>{{ +scope.row.use_status === 1 ? '使用中' : '空闲' }}</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="problemPName" label="投诉问题" min-width="80">
        <!-- <template slot-scope="scope">
          <span>{{ issusList[scope.row.problemPid] }}</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="ctime" label="处理倒计时" min-width="120">
        <template slot-scope="scope">
          <span>{{ `${DeadTime(scope.row.ctime)}` }}</span>
          <!-- <span>{{ scope.row.ctime }}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="cpStatusSub" label="处理类型" min-width="80">
        <template slot-scope="scope">
          <span>{{
            +scope.row.cpStatusSub === 11 ? '退回处理' : '首次处理'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <span
            class="handle-btn"
            v-if="+scope.row.cpStatus !== 7"
            @click="openDrawer(scope.row)"
          >
            处理任务
          </span>
          <span
            class="handle-btn"
            @click="openDrawer(scope.row)"
            v-if="+scope.row.cpStatus === 7"
          >
            查看详情
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { openBrowserTab, MillisecondToDate } from '@/utils/index'
import dayjs from 'dayjs'
export default {
  props: {
    comTableData: {
      type: Array,
      default: () => []
    }
  },
  created() {
    console.log(this.comTableData)
  },
  components: {},
  data() {
    return {
      cpStatusName: { 1: '待处理', 2: '处理中', 3: '待回访', 7: '已解决' },
      issusList: {
        101101: '销售相关',
        101102: '班主任相关',
        101103: '教学老师相关',
        101104: '课程相关',
        101108: '产品技术相关',
        101105: '赠品问题',
        101106: '费用问题',
        101107: '其他'
      }
    }
  },
  computed: {},
  watch: {
    comTableData: () => {
      console.log('变化')
      // const that = this
      // this.comTableData.forEach((el) => {
      //   el.ctime =
      //     24 * 60 * 60 * 1000 - (dayjs().valueOf() - dayjs(el.ctime).valueOf())

      //   el.countDown = setInterval(() => {
      //     that.TimeDeadLine(el)
      //   }, 1000)
      //   // 模拟后端发的时间戳
      //   // that.TimeDeadLine(el) // 调用定时器
      // })
    }
  },
  methods: {
    // 数据处理
    handleName(val) {
      if (val.cpStatus === 2 && val.cpStatusSub === 20) {
        return '待处理'
      } else {
        return this.cpStatusName[val.cpStatus]
      }
    },

    // 去用户页
    goDel(val) {
      console.log(val)
      // studentid
      const { username, mobile, userId } = val
      // 新标签打开详情页
      openBrowserTab(
        `/music_app/#/details/${userId}`,
        `学员：${username || mobile}`
      )
    },
    DeadTime(val) {
      if (!val) return '-'
      return MillisecondToDate(
        24 * 60 * 60 * 1000 - (dayjs().valueOf() - dayjs(val).valueOf())
      )
    },
    // 倒计时计算
    TimeDeadLine(val) {
      val.ctime = val.ctime - 1000
      // const times = dayjs(
      //   24 * 60 * 60 * 1000 - (dayjs().valueOf() - dayjs(val).valueOf()) - 1000
      // ).format('HH:mm:ss')
      // return setInterval(function() {
      //   return times
      // }, 1000)
    },
    //
    // 打开抽屉
    openDrawer(val) {
      this.$emit('openDrawer', val)
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.handle-btn {
  color: blue;
  cursor: pointer;
}
</style>
