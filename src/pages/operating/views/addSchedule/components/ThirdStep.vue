<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-18 13:34:29
 -->
<template>
  <div class="third-step">
    <div class="step-container step-three-container">
      <ele-table
        :dataList="tableData"
        :loading="loading"
        :size="tabQuery.size"
        :page="tabQuery.pageNum"
        :total="totalElements"
        @pageChange="pageChange_handler"
        class="mytable"
      >
        <el-table-column prop="period" label="序号" width="70">
        </el-table-column>
        <el-table-column prop="teacherRealName" label="真实姓名" width="100">
        </el-table-column>
        <el-table-column prop="departmentName" label="所属部门" width="150">
        </el-table-column>
        <el-table-column prop="teacherWechatNo" label="绑定微信" width="150">
        </el-table-column>
        <el-table-column prop="address" label="招生级别" width="80">
          <template slot-scope="scope">
            <div v-for="(leve, l_index) in scope.row.enroll" :key="l_index">
              {{ leve.courseDifficulty || '' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="打开开关" width="100">
          <template slot-scope="scope">
            <div v-for="(swicth, s_index) in scope.row.enroll" :key="s_index">
              <el-switch
                v-model="swicth.status"
                active-color="#13ce66"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="班级人数" width="120">
          <template slot-scope="scope">
            <div v-for="(t, t_index) in scope.row.enroll" :key="t_index">
              <el-input
                class="table_input"
                size="mini"
                v-model="t.teamSize"
                placeholder="请输入内容"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="计划招生" width="100">
          <template slot-scope="scope">
            <div v-for="(p, t_index) in scope.row.enroll" :key="t_index">
              <el-input
                class="table_input"
                size="mini"
                v-model="p.sumTeamSize"
                placeholder="请输入内容"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="课程材料版本" width="130">
          <template slot-scope="scope">
            <div
              v-for="(v, v_index) in scope.row.enroll"
              :key="v_index"
              class="select-container"
            >
              <el-select
                v-model="v.courseVersion"
                size="mini"
                placeholder="随材版本"
              >
                <el-option
                  v-for="(item, i) in productVersion"
                  :key="i"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </ele-table>

      <!-- 取消、下一步 -->
      <div class="operate-btn">
        <el-button size="small" type="primary" @click="stepOpt(0)"
          >上一步</el-button
        >
        <el-button size="small" type="primary" @click="stepOpt(1)"
          >提交保存</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui'
import EleTable from '@/components/Table/EleTable'
import { mapGetters } from 'vuex'
export default {
  props: ['stepStatus'],
  data() {
    return {
      tableData: [],
      loading: true,
      totalElements: 0,
      flags: {
        loading: true
      },
      productVersion: [
        { name: 'V1.4', value: 'V1.4' },
        { name: 'V1.5', value: 'V1.5' },
        { name: 'V1.6', value: 'V1.6' }
      ],
      tabQuery: {
        size: 2,
        pageNum: 1
      }
    }
  },
  computed: {
    ...mapGetters(['scheduleTeacherId'])
  },
  components: {
    EleTable
  },
  watch: {},
  created() {
    console.log('scheduleTeacherId', this.scheduleTeacherId)
    // 根据老师ids获取招生排期设置中老师配置信息 TODO:
    const params = {
      courseType: '0',
      period: 13,
      // ids: scheduleTeacherId,
      ids: [1, 2, 3]
    }
    this.scheduleTeacherId && this.getTeacherConfigList(params)
  },
  methods: {
    // 根据老师ids获取招生排期设置中老师配置信息
    async getTeacherConfigList(params) {
      try {
        const teacherList = await this.$http.Operating.getTeacherConfigList(
          params
        )
        const { payload = [] } = teacherList
        this.tableData = payload
        console.log(teacherList)
      } catch (err) {
        this.$message({
          message: '获取列表出错',
          type: 'warning'
        })
      }
      this.loading = false
    },
    //  保存 招生排期 设置
    async saveScheduleConfig(params) {
      const loadingInstance = Loading.service({
        target: 'section',
        lock: true,
        text: '正在保存...',
        fullscreen: true
      })

      try {
        const _res = await this.$http.Operating.saveScheduleConfig(params)
        if (_res.code === 0) this.$message.success('保存成功')
      } catch (err) {
        this.$message({
          message: '获取列表出错',
          type: 'warning'
        })
      }
      // 以服务的方式调用的 Loading 需要异步关闭
      this.$nextTick(() => loadingInstance.close())
    },
    preStep() {
      this.$emit('listenStepStatus', 0)
    },
    // 翻页emit
    pageChange_handler() {},
    async stepOpt(type) {
      const params = {
        courseType: '0',
        period: 13,
        // ids: scheduleTeacherId,
        body: this.tableData
      }
      await this.saveScheduleConfig(params)

      this.$emit('listenStepStatus', type)
    }
  }
}
</script>
<style lang="scss" scoped>
.step-three-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  .select-container {
    margin-bottom: 5px;
  }
  .table_input {
    margin-bottom: 5px;
    width: 80px;
  }
  .operate-btn {
    display: flex;
    justify-content: center;
    margin: 40px 0 10px 0;
  }
}
</style>
