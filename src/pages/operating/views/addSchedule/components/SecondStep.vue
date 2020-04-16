<!--
 * @Descripttion: TOSS小熊
 * @version: 1.0.0
 * @Author: Shentong
 * @Date: 2020-04-15 20:35:57
 * @LastEditors: Shentong
 * @LastEditTime: 2020-04-16 17:26:43
 -->
<template>
  <div class="second-step">
    <div class="step-container step-two-container">
      <el-row :gutter="20">
        <el-col :offset="3" :span="3"
          ><org-dept @changeOrgDept="changeOrgDept"></org-dept
        ></el-col>
        <el-col :span="16">
          <div class="transfer-container">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="transferVal"
              filterable
              :left-default-checked="[2, 3]"
              :right-default-checked="[1]"
              :render-content="renderFunc"
              :titles="['Source', 'Target']"
              :button-texts="['到左边', '到右边']"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              @change="handleChange"
              :data="data"
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
    const generateData = (_) => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      tableData: [],
      transferVal: [],
      currentDept: {},
      // 总页数
      totalPages: 1,
      // 总条数
      totalElements: 0,
      // 当前页数
      currentPage: 1,
      data: generateData(),
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
  methods: {
    department(dept = {}) {
      // 根据部门ID获取老师ID
      const { id, pid, children } = dept
      const query = `{"department":{"id": ${id}, "pid": ${pid}, "children": ${JSON.stringify(
        children
      )}}}`
      if (id === '0') {
        this.query = ''
        this.getData()
        return
      }
      this.query = query
      this.getData(1, JSON.stringify(query))
    },
    // 获取老师数据
    getData(page = this.currentPage, query = JSON.stringify(this.query)) {
      // tab数据
      this.$http.Teacher.getTeacherPage(page, query).then((res) => {
        if (res && res.data && res.data.TeacherManagePage) {
          const {
            content = [],
            number,
            totalPages,
            totalElements
          } = res.data.TeacherManagePage
          this.tableData = content
          this.totalPages = +totalPages
          this.currentPage = +number
          this.totalElements = +totalElements
        }
      })
    },
    changeOrgDept(data) {
      this.currentDept = data
      console.log(data, 'orgdept')
    },
    handleChange(val) {
      console.log('transferVal', val)
    },
    stepOperate(type) {
      this.$emit('listenStepStatus', type)
    }
  }
}
</script>
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
