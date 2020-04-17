<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-17 22:36:14
 -->
<template>
  <div class="second-step">
    <div class="step-container step-two-container">
      <el-row :gutter="20">
        <el-col :span="3" :offset="3"
          ><org-dept @changeOrgDept="changeOrgDept"></org-dept
        ></el-col>
        <el-col :span="16">
          <div class="transfer-container">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="transferVal"
              filterable
              :right-default-checked="rightDefaultChecked"
              :render-content="renderFunc"
              :titles="['待选择', '已选择']"
              :button-texts="['到左边', '到右边']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @right-check-change="handleWHRightChange"
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
      period: '',
      courseType: '0',
      rightDefaultChecked: [],
      transferData: [],
      transferVal: [],
      currentDept: {},
      // 总页数
      totalElements: 0,
      totalPages: 1,
      // 总条数
      // 当前页数
      currentPage: 1,
      renderFunc(h, option) {
        return (
          <span>
            {option.key} - {option.label}
          </span>
        )
      }
    }
  },
  components: {
    OrgDept
  },
  computed: {},
  watch: {},
  mounted() {
    const { period = 0, courseType = '0' } = this.$route.params
    this.period = period
    this.courseType = courseType
    this.getData()
  },
  methods: {
    // 数据右侧列表元素被用户选中 / 取消选中时触发
    handleWHRightChange(key, key1) {
      console.log(key, key1, '00000')
    },
    // 编辑页获取所 选择的 teacher：TODO:
    async getHasSelectTeacher() {
      const params = {
        period: this.period,
        courseType: this.courseType
      }
      try {
        const teacherList = await this.$http.Operating.getHasSelectTeacher(
          params
        )
        const { payload = [] } = teacherList
        return Promise.resolve(payload)
      } catch (err) {
        this.$message({
          message: '获取列表出错',
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
      this.getData(1, JSON.stringify(query))
    },
    // 获取老师数据

    async getData(page = this.currentPage) {
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
        const {
          content = [],
          number,
          totalPages,
          totalElements,
          arr = []
        } = res.data.TeacherManagePage

        content.forEach((item, index) => {
          arr.push({
            label: item.realname,
            key: item.id
          })
        })
        this.transferData = arr
        this.totalPages = +totalPages
        this.currentPage = +number
        this.totalElements = +totalElements
      }
      // 编辑页面
      if (this.period) {
        const teachers = await this.getHasSelectTeacher()
        teachers &&
          teachers.forEach((item) => {
            this.transferVal.push(item.teacherId)
            this.rightDefaultChecked.push(item.teacherId)
          })
        console.log(this.rightDefaultChecked)
      }
    },
    changeOrgDept(data) {
      this.department(data)
    },
    handleChange(val) {
      console.log('transferVal', val)
    },
    stepOperate(type) {
      console.log('transferVal', this.transferVal)
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
