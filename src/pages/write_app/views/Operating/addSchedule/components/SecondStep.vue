<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-08-24 18:27:26
 -->
<template>
  <div class="second-step">
    <div class="step-container step-two-container">
      <el-row :gutter="20">
        <el-col :span="4" :offset="3">
          <org-dept @changeOrgDept="changeOrgDept"></org-dept>
        </el-col>
        <el-col :span="16">
          <div class="transfer-container">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="transferVal"
              filterable
              :right-default-checked="rightDefaultChecked"
              :props="{
                key: 'id',
                label: 'realname'
              }"
              :render-content="renderFunc"
              :titles="['待选择', '已选择']"
              :button-texts="['到左边', '到右边']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @change="handleChange"
              :data="transferData"
            >
            </el-transfer>
          </div>
        </el-col>
      </el-row>

      <!-- 取消、下一步 -->
      <div class="operate-btn">
        <el-button size="small" type="primary" @click="stepOperate(0)"
          >上一步</el-button
        >
        <el-button size="small" type="primary" @click="stepOperate(1)"
          >下一步</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import OrgDept from './OrgDept'
export default {
  props: ['stepStatus'],
  data() {
    return {
      params: {
        period: '',
        courseType: '0'
      },
      rightDefaultChecked: [],
      transferData: [],
      transferVal: [],
      teachers: [],
      // 当前页数
      currentPage: 1,
      renderFunc(h, option) {
        return (
          <span>
            {option.id} - {option.realname}
          </span>
        )
      }
    }
  },
  components: {
    OrgDept
  },
  watch: {},
  async created() {
    const { period = 0, courseType = '0' } = this.$route.params
    Object.assign(this.params, { period, courseType })

    await this.getTeacherByDept()
    if (+period) {
      const teachers = await this.getTeacherIdArray()
      teachers.forEach((item) => {
        this.transferVal.push(item.teacherId)
        this.rightDefaultChecked.push(item.teacherId)
      })
    }
  },
  methods: {
    // 编辑页获取所 选择的 teacher：TODO:
    async getHasSelectTeacher() {
      try {
        const teacherList = await this.$http.writeApp.Operating.getHasSelectTeacher(
          this.params
        )
        const { payload = [] } = teacherList
        return Promise.resolve(payload)
      } catch (err) {
        this.$message({
          message: '获取数据出错',
          type: 'warning'
        })
        return Promise.reject(err)
      }
    },
    // 获取部门tree信息
    department(dept = {}) {
      // 根据部门ID获取老师ID
      const { id, pid, children } = dept
      const query = {
        department: {
          id: `${id}`,
          pid: `${pid}`,
          children: `${JSON.stringify(children)}`
        }
      }
      this.departmentQuery = query
      this.getTeacherByDept(1, JSON.stringify(query))
    },
    // 获取老师数据
    async getTeacherIdArray() {
      // 编辑页面
      if (this.params.period) {
        const teachers = await this.getHasSelectTeacher()
        return teachers
      }
    },
    async getTeacherByDept(page = this.currentPage) {
      if (this.departmentQuery) {
        this.query = Object.assign({}, this.departmentQuery || {})
      }
      const query = this.query ? JSON.stringify(this.query) : ''
      // tab数据
      const res = await this.$http.Teacher.getTeacherPage(
        page,
        JSON.stringify(query),
        500
      )
      if (res && res.data && res.data.TeacherManagePage) {
        const { content = [], number } = res.data.TeacherManagePage

        this.transferData = content
        this.currentPage = +number
      }
    },
    changeOrgDept(data) {
      this.department(data)
    },
    handleChange(val) {},
    stepOperate(type) {
      if (!type) {
        this.$emit('listenStepStatus', type)
      } else if (!this.transferVal.length) {
        this.$message({
          message: '请先选择老师哟！',
          type: 'warning'
        })
      } else {
        this.$store.commit('setScheduleTeacher', this.transferVal)
        this.$emit('listenStepStatus', this.transferVal)
      }
    }
  }
}
</script>
<style>
.el-transfer-panel__filter {
  text-align: center;
  margin: 15px;
  box-sizing: border-box;
  display: block;
  width: auto;
}
.el-transfer-panel__body {
  height: 300px;
}
.el-transfer-panel__list.is-filterable {
  height: 270px;
}
</style>
<style lang="scss" scoped>
.step-two-container {
  margin: 60px 0;
  .transfer-container {
    text-align: center;
  }
  .operate-btn {
    display: flex;
    justify-content: center;
    margin: 40px 0 10px 0;
  }
}
</style>
