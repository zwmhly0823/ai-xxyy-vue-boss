<!--
 * @Author: YangJiyong
 * @Email: yangjiyong@meishubao.com
 * @Date: 2020-04-20 19:38:35
 * @Last Modified by:   YangJiyong
 * @Last Modified time: 2020-04-20 19:38:35
 * @Description: 社群销售 组织机构， 根据选择的机构ID，返回对应的老师ID
 -->
<template>
  <div class="search-item small threeSelect">
    <el-cascader
      size="mini"
      placeholder="销售部"
      :options="departmentList"
      :type="deptType"
      :props="{
        multiple: true,
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: false
      }"
      :show-all-levels="false"
      clearable
      @change="onSelect"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    deptType: {
      type: Number,
      default: 1 // 1 获取部门下的老师ids，2 只获取部门
    }
  },
  data() {
    return {
      departmentList: []
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    getDepartment() {
      this.$http.Department.getDepartmentList().then((res) => {
        this.departmentList = res.payload || []
        console.log(this.departmentList, 'this.departmentList')
      })
    },
    async onSelect(data) {
      // TODO: 根据选择的销售组，获取销售ID
      const ids = { department_id: data || [] }
      console.log(ids, 'ids')

      // 获取老师
      if (this.deptType === 1) {
        const teacher = await this.$http.Department.getDepartmentTeacher(
          JSON.stringify(ids)
        )
        const teacherIds = teacher.data.TeacherList.map((item) => item.id)
        this.$emit('result', data.length > 0 ? { [this.name]: teacherIds } : '')
      } else {
        // 获取部门

        this.$emit(
          'result',
          data.length > 0 ? { [this.name]: ids.department_id } : ''
        )
      }
    }
  }
}
</script>

<style lang="scss">
.threeSelect {
  .el-cascader__tags {
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}

.el-cascader-panel {
  max-height: 300px !important;
}
</style>
